import Link from "next/link";

import { Badge, Card, PageHeader, StatCard } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDuration, formatTime, outcomeLabel } from "@/lib/format";

export default async function CallHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const [stats, calls] = await Promise.all([
    api.getCallStats(),
    api.getCallHistory({ q: params.q, tag: params.tag }),
  ]);

  const filters = [
    { label: "Tümü", tag: undefined },
    { label: "Potansiyel", tag: "potential" },
    { label: "Transfer", tag: "transfer" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Çağrı geçmişi"
        description="Geçmiş görüşmeleri, özetleri ve transkriptleri inceleyin."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam" value={stats.total} />
        <StatCard label="Potansiyel" value={stats.potential} />
        <StatCard label="Transfer istekleri" value={stats.transfers} />
        <StatCard label="Toplam süre" value={stats.total_duration} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const active = (params.tag || undefined) === filter.tag;
          const href = filter.tag
            ? `/panel/call-history?tag=${filter.tag}`
            : "/panel/call-history";
          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm ring-1 ${
                active
                  ? "bg-[var(--text)] text-[var(--bg)] ring-[var(--text)]"
                  : "bg-[var(--panel-solid)] text-[var(--muted)] ring-[var(--line)]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
        <form className="ml-auto flex gap-2" action="/panel/call-history">
          <input
            name="q"
            defaultValue={params.q || ""}
            placeholder="Transkriptte ara..."
            className="theme-input h-10 rounded-xl px-3 text-sm outline-none"
          />
          <button className="rounded-xl bg-[var(--text)] px-4 text-sm font-medium text-[var(--bg)]">
            Ara
          </button>
        </form>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[140px_140px_80px_1fr_120px_100px] gap-3 border-b border-[var(--line)] px-4 py-3 text-xs tracking-wide text-[var(--muted-2)] md:grid">
          <span>Tarih</span>
          <span>Arayan</span>
          <span>Süre</span>
          <span>Özet</span>
          <span>Durum</span>
          <span>Detay</span>
        </div>
        {calls.map((call) => (
          <div
            key={call.id}
            className="grid gap-2 border-b border-[var(--line)] px-4 py-4 last:border-b-0 md:grid-cols-[140px_140px_80px_1fr_120px_100px] md:items-center"
          >
            <p className="text-sm text-[var(--muted)]">{formatTime(call.started_at)}</p>
            <p className="text-sm text-[var(--text)]">{call.caller_number}</p>
            <p className="font-mono text-sm text-[var(--text)]">
              {formatDuration(call.duration_seconds, call.status === "live")}
            </p>
            <p className="text-sm text-[var(--muted)]">{call.summary || "—"}</p>
            <div>
              <Badge tone={call.status === "live" ? "live" : call.status === "missed" ? "warn" : "ok"}>
                {call.status === "ended" ? "Tamamlandı" : call.status === "live" ? "Canlı" : "Cevapsız"}
              </Badge>
              {call.outcome === "appointment" || call.outcome === "follow_up" ? (
                <p className="mt-1 text-xs text-[var(--gilt)]">★ Potansiyel</p>
              ) : null}
              {call.outcome === "handoff" ? (
                <p className="mt-1 text-xs text-[var(--muted)]">{outcomeLabel(call.outcome)}</p>
              ) : null}
            </div>
            <Link href={`/panel/call-history/${call.id}`} className="text-sm text-[var(--signal)] hover:underline">
              Görüntüle
            </Link>
          </div>
        ))}
      </Card>
    </div>
  );
}
