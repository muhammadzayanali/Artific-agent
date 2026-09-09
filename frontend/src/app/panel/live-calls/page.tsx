import Link from "next/link";

import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDuration, formatTime } from "@/lib/format";

export default async function LiveCallsPage() {
  const calls = await api.getLiveCalls();

  return (
    <div>
      <PageHeader
        title="Canlı çağrılar"
        description="Yapay zeka ile görüşen müşterilerinizi takip edin."
        action={
          <Badge tone="live">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Canlı
          </Badge>
        }
      />
      {calls.length === 0 ? (
        <EmptyState
          title="Şu an aktif çağrı yok"
          body="Sistem çalışıyor, çağrı bekleniyor."
        />
      ) : (
        <div className="grid gap-3">
          {calls.map((call) => (
            <Link key={call.id} href={`/panel/call-history/${call.id}`}>
              <Card className="p-5 transition hover:bg-[var(--nav-hover)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone="live">Canlı</Badge>
                      <p className="font-medium text-[var(--text)]">{call.caller_name || call.caller_number}</p>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{call.summary}</p>
                  </div>
                  <div className="text-right text-sm text-[var(--muted)]">
                    <p>{formatTime(call.started_at)}</p>
                    <p className="mt-1 font-mono">
                      {formatDuration(call.duration_seconds, true)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Link
          href="/panel/live-calls"
          className="inline-flex rounded-xl border border-[var(--line)] bg-[var(--nav-hover)] px-4 py-2.5 text-sm"
        >
          Yenile
        </Link>
      </div>
    </div>
  );
}
