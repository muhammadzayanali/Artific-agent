"use client";

import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Pie, PieChart, Cell } from "recharts";
import { Badge, Card, PageHeader } from "@/components/ui/primitives";
import { customerById } from "@/demo/lookups";
import { callStatusLabel } from "@/lib/labels";
import { formatClock, formatDuration } from "@/lib/utils";
import { selectMetrics, useDemoStore } from "@/stores/demo-store";

const callsOverTime = [
  { t: "09:00", calls: 8 },
  { t: "10:00", calls: 14 },
  { t: "11:00", calls: 11 },
  { t: "12:00", calls: 7 },
  { t: "13:00", calls: 9 },
  { t: "14:00", calls: 16 },
];

const outcomes = [
  { name: "Çözüldü", value: 18, color: "#178A68" },
  { name: "Aktarım", value: 9, color: "#C4A35A" },
  { name: "Geri arama", value: 6, color: "#1F4E79" },
];

export default function DashboardPage() {
  const state = useDemoStore();
  const metrics = selectMetrics(state);
  const live = state.calls.filter((c) => c.live);

  const cards = [
    { label: "Aktif çağrılar", value: metrics.activeCalls },
    { label: "Bugünkü çağrılar", value: metrics.callsToday },
    { label: "AI yanıtlıyor", value: metrics.aiHandled },
    { label: "İnsan aktarımı", value: metrics.humanHandoffs },
    { label: "Açık talepler", value: metrics.openRequests },
    { label: "Müsait personel", value: metrics.availableStaff },
    { label: "Aktif kampanya", value: metrics.activeCampaigns },
    { label: "WhatsApp", value: metrics.whatsappOpen },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Komuta merkezi"
        title="Operasyon özeti"
        description="Anatolia Gold & Jewellery için gerçek zamanlı iletişim, talep ve kampanya durumu."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-xs uppercase tracking-wide text-ink-400">{card.label}</p>
            <p className="mt-2 font-serif text-3xl">{card.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <p className="text-sm font-medium">Çağrı hacmi</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callsOverTime}>
                <CartesianGrid stroke="#ECEEF2" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="calls" stroke="#161A22" fill="#F4ECD6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium">Sonuç dağılımı</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomes} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72}>
                  {outcomes.map((o) => (
                    <Cell key={o.name} fill={o.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Canlı çağrılar</p>
            <Link href="/panel/live-calls" className="text-sm text-ink-500 hover:text-ink-950">
              Tümü
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {live.map((call) => {
              const customer = customerById(state, call.customerId);
              return (
                <Link key={call.id} href={`/panel/live-calls/${call.id}`} className="rounded-xl border border-ink-100 p-3 hover:bg-ink-50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{customer?.name}</p>
                      <p className="text-xs text-ink-500">{call.intent}</p>
                    </div>
                    <div className="text-right">
                      <Badge tone={call.status === "ai-handling" ? "live" : "alert"}>{callStatusLabel[call.status]}</Badge>
                      <p className="mt-1 font-mono text-xs">{formatDuration(call.durationSeconds)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium">Canlı aktivite</p>
          <ol className="mt-4 space-y-3">
            {state.activity.slice(0, 6).map((event) => (
              <li key={event.id} className="flex gap-3 text-sm">
                <span className="w-14 shrink-0 font-mono text-xs text-ink-400">{formatClock(event.at)}</span>
                <span>{event.text}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
      <Card className="p-5">
        <p className="text-sm font-medium">Kampanya performansı</p>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={state.campaigns.map((c) => ({ name: c.name.slice(0, 18), connected: c.connected, pending: c.pending }))}>
              <CartesianGrid stroke="#ECEEF2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="connected" fill="#178A68" radius={6} />
              <Bar dataKey="pending" fill="#D4BA7A" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
