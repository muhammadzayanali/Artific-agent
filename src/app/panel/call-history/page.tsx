"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, EmptyState, Input, PageHeader, Select } from "@/components/ui/primitives";
import { agentById, customerById } from "@/demo/lookups";
import { callStatusLabel } from "@/lib/labels";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function CallHistoryPage() {
  const state = useDemoStore();
  const [q, setQ] = useState("");
  const [agent, setAgent] = useState("all");
  const history = useMemo(
    () =>
      state.calls
        .filter((c) => !c.live)
        .filter((c) => {
          const customer = customerById(state, c.customerId);
          return (agent === "all" || c.agentId === agent) && `${customer?.name} ${c.intent}`.toLowerCase().includes(q.toLowerCase());
        }),
    [state, q, agent],
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="İletişim" title="Çağrı geçmişi" description="Tamamlanan görüşmeleri transkript ve sonuçlarıyla inceleyin." />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Müşteri veya niyet" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={agent} onChange={(e) => setAgent(e.target.value)} className="sm:w-56">
          <option value="all">Tüm ajanlar</option>
          {state.agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>
      </div>
      {history.length === 0 ? (
        <EmptyState title="Geçmiş boş" body="Canlı bir çağrıyı bitirdiğinizde burada görünür." />
      ) : (
        <div className="grid gap-3">
          {history.map((call) => {
            const customer = customerById(state, call.customerId);
            const ag = agentById(state, call.agentId);
            return (
              <Link key={call.id} href={`/panel/call-history/${call.id}`}>
                <Card className="p-4 hover:shadow-lift">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{customer?.name}</p>
                      <p className="text-sm text-ink-500">
                        {call.intent} · {ag?.name} · {formatDuration(call.durationSeconds)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{callStatusLabel[call.status]}</Badge>
                      <span className="text-xs text-ink-400">{formatDateTime(call.startedAt)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
