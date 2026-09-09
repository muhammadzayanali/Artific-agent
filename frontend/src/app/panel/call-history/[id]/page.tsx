import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Card, PageHeader } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { formatDuration, formatTime, outcomeLabel } from "@/lib/format";

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const call = await api.getConversation(id);
    return (
      <div className="space-y-6">
        <Link href="/panel/call-history" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
          ← Çağrı geçmişi
        </Link>
        <PageHeader
          title={call.caller_name || call.caller_number}
          description={call.caller_number}
          action={
            <Badge tone={call.status === "live" ? "live" : "ok"}>
              {call.status === "live" ? "Canlı" : "Tamamlandı"}
            </Badge>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Başlangıç</p>
            <p className="mt-1 text-sm text-[var(--text)]">{formatTime(call.started_at)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Süre</p>
            <p className="mt-1 text-sm text-[var(--text)]">
              {formatDuration(call.duration_seconds, call.status === "live")}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--muted)]">Sonuç</p>
            <p className="mt-1 text-sm text-[var(--text)]">{outcomeLabel(call.outcome)}</p>
          </Card>
        </div>
        <Card className="p-5">
          <h2 className="font-medium text-[var(--text)]">Özet</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">{call.summary || "Özet yok."}</p>
          {call.detected_need ? (
            <p className="mt-3 text-sm text-[var(--muted)]">İhtiyaç: {call.detected_need}</p>
          ) : null}
          {call.action_taken ? (
            <p className="mt-1 text-sm text-[var(--muted)]">Aksiyon: {call.action_taken}</p>
          ) : null}
          {call.recording_url ? (
            <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-4">
              <p className="text-xs tracking-wide text-[var(--muted-2)]">Kayıt</p>
              <audio className="mt-3 w-full" controls src={call.recording_url} preload="metadata" />
            </div>
          ) : null}
        </Card>
        <Card className="p-5">
          <h2 className="font-medium text-[var(--text)]">Transkript</h2>
          {call.turns?.length ? (
            <ol className="mt-4 space-y-4">
              {call.turns.map((turn) => (
                <li key={turn.id}>
                  <p className="text-xs tracking-wide text-[var(--muted-2)]">
                    {turn.speaker === "agent" ? call.agent_name : "Arayan"} ·{" "}
                    {formatDuration(turn.started_offset_seconds)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text)]">{turn.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">Transkript yok.</p>
          )}
        </Card>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}
