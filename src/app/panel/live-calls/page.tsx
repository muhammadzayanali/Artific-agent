"use client";

import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { customerById, agentById } from "@/demo/lookups";
import { callStatusLabel } from "@/lib/labels";
import { formatDuration } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function LiveCallsPage() {
  const state = useDemoStore();
  const live = state.calls.filter((c) => c.live);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="İletişim"
        title="Canlı çağrılar"
        description="AI yanıtı, aktarım ihtiyacı ve personel bekleyen görüşmeleri aynı anda izleyin."
      />
      {live.length === 0 ? (
        <EmptyState title="Aktif çağrı yok" body="Demo Lab’den gelen çağrı senaryosunu çalıştırın." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {live.map((call) => {
            const customer = customerById(state, call.customerId);
            const agent = agentById(state, call.agentId);
            return (
              <Link key={call.id} href={`/panel/live-calls/${call.id}`}>
                <Card className="h-full p-5 transition hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-950">{customer?.name}</p>
                      <p className="text-sm text-ink-500">{customer?.phone}</p>
                    </div>
                    <Badge
                      tone={
                        call.status === "ai-handling" ? "live" : call.status === "human-handling" ? "gold" : "alert"
                      }
                    >
                      {callStatusLabel[call.status]}
                    </Badge>
                  </div>
                  <p className="mt-6 font-mono text-2xl">{formatDuration(call.durationSeconds)}</p>
                  <p className="mt-3 text-sm text-ink-600">
                    Niyet: <span className="font-medium">{call.intent}</span>
                  </p>
                  <p className="mt-1 text-xs text-ink-400">Ajan: {agent?.name}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
