import Link from "next/link";

import { Badge, Card, StatCard } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDuration, formatTime, outcomeLabel } from "@/lib/format";

export default async function DashboardPage() {
  const data = await api.getDashboard();
  const maxWeekly = Math.max(...data.weekly.map((d) => d.calls), 1);

  return (
    <div className="space-y-6">
      <div className="dash-hero animate-fade-up px-6 py-8 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--signal)]">
          ArtificAgent · Ops
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Operasyon özeti
        </h1>
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--muted)]">
          İşletmenizin canlı iletişim, talep ve asistan durumunu buradan izleyin.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Bugünkü Çağrılar" value={data.calls_today} />
        <StatCard label="Kalan Dakika" value={`${data.remaining_minutes.toFixed(1)} dk`} />
        <StatCard label="Potansiyel Müşteri" value={data.potential_leads} />
        <StatCard label="Transfer İsteği" value={data.transfer_requests} />
        <StatCard label="Bekleyen Talepler" value={data.pending_requests} />
        <StatCard label="Toplam Görüşme" value={data.total_talk_time} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-medium text-[var(--text)]">
              Haftalık Çağrı Analitiği
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-2)]">
              7 gün
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {data.weekly.map((day, index) => (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-[linear-gradient(to_top,var(--signal),color-mix(in_srgb,var(--signal)_55%,white))] transition duration-500"
                  style={{
                    height: `${Math.max((day.calls / maxWeekly) * 100, 8)}%`,
                    animationDelay: `${index * 40}ms`,
                  }}
                  title={`${day.calls} çağrı`}
                />
                <span className="font-mono text-[10px] text-[var(--muted-2)]">{day.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative grid place-items-center overflow-hidden p-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--signal-soft),transparent_65%)]" />
          <div className="relative">
            <div className="mx-auto grid h-32 w-32 place-items-center rounded-full border border-[color-mix(in_srgb,var(--signal)_30%,transparent)] bg-[var(--signal-soft)]">
              <div className="grid h-20 w-20 place-items-center rounded-full border border-[color-mix(in_srgb,var(--signal)_30%,transparent)] bg-[var(--panel-solid)]">
                <svg viewBox="0 0 48 24" className="h-7 w-12 text-[var(--signal)]" aria-hidden>
                  <path
                    d="M2 12h4l3-8 4 16 4-12 3 6h6l3-5 4 9h5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hero-wave"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge tone={data.assistant_active ? "live" : "warn"}>
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-current" />
                {data.assistant_active ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <p className="mt-3 font-display text-lg font-semibold text-[var(--text)]">
              Asistan Bağlantısı
            </p>
            <p className="mt-1 font-mono text-sm text-[var(--muted)]">
              {data.ai_line || "Hat yok"}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-2)]">{data.language}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--text)]">Son Çağrılar</p>
            <Link
              href="/panel/call-history"
              className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
            >
              Tümü
            </Link>
          </div>
          <div className="space-y-3">
            {data.recent_calls.map((call) => (
              <Link
                key={call.id}
                href={`/panel/call-history/${call.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-3 transition hover:bg-[var(--nav-hover)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--text)]">
                    {call.caller_name || call.caller_number}
                  </p>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {call.summary || "Özet yok"}
                  </p>
                </div>
                <div className="text-right">
                  <Badge tone={call.status === "live" ? "live" : "ok"}>
                    {call.status === "live" ? "Canlı" : "Tamamlandı"}
                  </Badge>
                  <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                    {formatDuration(call.duration_seconds, call.status === "live")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-4 text-sm font-medium text-[var(--text)]">Transfer İstekleri</p>
          <div className="space-y-3">
            {data.recent_transfers.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Henüz transfer isteği yok.</p>
            ) : (
              data.recent_transfers.map((item) => (
                <div key={item.id} className="rounded-xl border border-[var(--line)] p-3">
                  <p className="text-sm text-[var(--text)]">{item.summary}</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {item.caller_number} · {formatTime(item.started_at)} · {outcomeLabel("handoff")}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
