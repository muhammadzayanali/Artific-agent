"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, EmptyState, Input, PageHeader, Select } from "@/components/ui/primitives";
import { customerById, staffById } from "@/demo/lookups";
import { requestStatusLabel, requestTypeLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function RequestsPage() {
  const state = useDemoStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(
    () =>
      state.requests.filter((r) => {
        const customer = customerById(state, r.customerId);
        const hay = `${r.summary} ${customer?.name ?? ""}`.toLowerCase();
        return (status === "all" || r.status === status) && hay.includes(q.toLowerCase());
      }),
    [state, q, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operasyon"
        title="Talep Merkezi"
        description="Canlı aktarımlar ve kampanya sonuçları burada kayıt olur."
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Ara" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          <option value="all">Tüm durumlar</option>
          <option value="new">Yeni</option>
          <option value="in-progress">İşlemde</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal</option>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Talep yok" body="Aktarım yaptığınızda kayıt burada görünür." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((ticket) => {
            const customer = customerById(state, ticket.customerId);
            const staff = staffById(state, ticket.assignedStaffId);
            return (
              <Link key={ticket.id} href={`/panel/request-center/${ticket.id}`}>
                <Card className="p-4 hover:shadow-lift">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{ticket.summary}</p>
                      <p className="text-sm text-ink-500">
                        {customer?.name} · {requestTypeLabel[ticket.type]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={ticket.status === "new" ? "alert" : "neutral"}>{requestStatusLabel[ticket.status]}</Badge>
                      <span className="text-xs text-ink-400">{staff?.name ?? "Atanmamış"}</span>
                      <span className="text-xs text-ink-400">{formatDateTime(ticket.createdAt)}</span>
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
