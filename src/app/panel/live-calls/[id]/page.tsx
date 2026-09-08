"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge, Button, Card, EmptyState, Modal, PageHeader, StatusDot } from "@/components/ui/primitives";
import { agentById, customerById, knowledgeById, staffById } from "@/demo/lookups";
import { callStatusLabel, staffStatusLabel } from "@/lib/labels";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function LiveCallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useDemoStore();
  const call = state.calls.find((c) => c.id === id);
  const [transferOpen, setTransferOpen] = useState(false);

  const customer = call ? customerById(state, call.customerId) : undefined;
  const agent = call ? agentById(state, call.agentId) : undefined;
  const staff = call ? staffById(state, call.staffId) : undefined;
  const available = state.staff.filter((s) => s.status === "available");
  const policies = useMemo(
    () => (call ? call.knowledgeRefs.map((kid) => knowledgeById(state, kid)).filter(Boolean) : []),
    [call, state],
  );

  if (!call) return <EmptyState title="Çağrı bulunamadı" body="Kayıt silinmiş veya sıfırlanmış olabilir." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Canlı çağrı alanı"
        title={customer?.name ?? "Çağrı"}
        description={`${customer?.phone} · ${call.intent}`}
        actions={
          <>
            <Badge tone="demo">Demo Telephony</Badge>
            {call.live && call.status !== "human-handling" ? (
              <Button onClick={() => services.calls.takeOverCall(call.id)}>Çağrıyı Devral</Button>
            ) : null}
            {call.live ? (
              <Button variant="secondary" onClick={() => setTransferOpen(true)}>
                Çağrıyı Hemen Bana Bağla
              </Button>
            ) : null}
            {call.live ? (
              <Button variant="ghost" onClick={() => services.calls.completeCall(call.id)}>
                Çağrıyı bitir
              </Button>
            ) : null}
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={call.status === "human-handling" ? "gold" : call.status === "ai-handling" ? "live" : "alert"}>
              {callStatusLabel[call.status]}
            </Badge>
            <span className="font-mono text-sm">{formatDuration(call.durationSeconds)}</span>
            <span className="text-sm text-ink-500">Ajan: {agent?.name}</span>
            {staff ? <span className="text-sm text-ink-500">Personel: {staff.name}</span> : null}
          </div>
          {call.status === "human-handling" ? (
            <div className="mt-4 rounded-xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
              AI asistan duraklatıldı. Çağrı {staff?.name ?? "yetkili personel"} adlı kişiye aktarıldı. Neden: fiyat
              pazarlığı.
            </div>
          ) : null}
          <ol className="mt-6 space-y-4">
            {call.transcript.map((line) => (
              <li key={line.id} className="grid gap-1">
                <p className="text-xs font-medium text-ink-400">
                  {line.speakerName} · {formatDateTime(line.at)}
                </p>
                <p className="rounded-xl bg-ink-50 px-3 py-2 text-sm leading-relaxed">{line.text}</p>
              </li>
            ))}
          </ol>
        </Card>
        <div className="grid gap-4">
          <Card className="p-5">
            <p className="text-sm font-medium">Müşteri</p>
            <p className="mt-2 text-lg">{customer?.name}</p>
            <p className="text-sm text-ink-500">{customer?.phone}</p>
            <p className="mt-3 text-sm text-ink-600">{customer?.notes}</p>
            <p className="mt-2 text-xs text-ink-400">Önceki etkileşim: {customer ? formatDateTime(customer.lastInteractionAt) : "—"}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-medium">Zaman çizelgesi</p>
            <ol className="mt-3 space-y-3">
              {call.timeline.map((event) => (
                <li key={event.id} className="text-sm">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-ink-500">{event.detail}</p>
                  <p className="font-mono text-xs text-ink-400">{formatDateTime(event.at)}</p>
                </li>
              ))}
            </ol>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-medium">Bağlı bilgi kuralları</p>
            <div className="mt-3 grid gap-2">
              {policies.map((item) =>
                item ? (
                  <Link key={item.id} href={`/panel/knowledge-base/${item.id}`} className="rounded-xl bg-ink-50 px-3 py-2 text-sm hover:bg-ink-100">
                    {item.title}
                  </Link>
                ) : null,
              )}
            </div>
            {call.requestId ? (
              <Link href={`/panel/request-center/${call.requestId}`} className="mt-4 inline-block text-sm text-gold-700">
                Talep kaydını aç
              </Link>
            ) : null}
          </Card>
        </div>
      </div>
      <Modal open={transferOpen} title="Çağrıyı bağla" onClose={() => setTransferOpen(false)}>
        <p className="text-sm text-ink-500">Demo Telephony — gerçek PSTN çağrısı yapılmaz.</p>
        <div className="mt-4 grid gap-2">
          {state.staff.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-3">
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-ink-500">
                  {member.role} · {member.authority.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs">
                  <StatusDot tone={member.status === "available" ? "live" : member.status === "busy" ? "alert" : "neutral"} />
                  {staffStatusLabel[member.status]}
                </span>
                <Button
                  size="sm"
                  disabled={member.status !== "available"}
                  onClick={() => {
                    services.calls.transferCall(call.id, member.id);
                    setTransferOpen(false);
                  }}
                >
                  Connect
                </Button>
              </div>
            </div>
          ))}
          {available.length === 0 ? <p className="text-sm text-ink-500">Şu anda müsait personel yok.</p> : null}
        </div>
      </Modal>
    </div>
  );
}
