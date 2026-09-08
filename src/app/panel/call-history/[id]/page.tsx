"use client";

import { useParams } from "next/navigation";
import { Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { agentById, customerById, staffById } from "@/demo/lookups";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useDemoStore();
  const call = state.calls.find((c) => c.id === id);
  if (!call) return <EmptyState title="Kayıt yok" body="Çağrı bulunamadı." />;
  const customer = customerById(state, call.customerId);
  const agent = agentById(state, call.agentId);
  const staff = staffById(state, call.staffId);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Çağrı kaydı" title={customer?.name ?? "Çağrı"} description={call.summary} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 text-sm lg:col-span-1">
          <p>Ajan: {agent?.name}</p>
          <p>Personel: {staff?.name ?? "—"}</p>
          <p>Süre: {formatDuration(call.durationSeconds)}</p>
          <p>Sonuç: {call.outcome ?? "—"}</p>
          <p>Başlangıç: {formatDateTime(call.startedAt)}</p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <p className="font-medium">Transkript</p>
          <ol className="mt-3 space-y-3">
            {call.transcript.map((line) => (
              <li key={line.id} className="text-sm">
                <span className="text-ink-400">{line.speakerName}: </span>
                {line.text}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
