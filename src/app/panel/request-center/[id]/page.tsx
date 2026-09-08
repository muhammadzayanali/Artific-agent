"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, EmptyState, Field, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { customerById, staffById } from "@/demo/lookups";
import { requestStatusLabel, requestTypeLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";
import type { RequestStatus } from "@/types";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useDemoStore();
  const ticket = state.requests.find((r) => r.id === id);
  const [note, setNote] = useState("");
  if (!ticket) return <EmptyState title="Talep yok" body="Kayıt bulunamadı." />;
  const customer = customerById(state, ticket.customerId);
  const staff = staffById(state, ticket.assignedStaffId);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Talep" title={requestTypeLabel[ticket.type]} description={ticket.summary} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5 text-sm">
          <p>
            <span className="text-ink-400">Müşteri: </span>
            {customer?.name} · {customer?.phone}
          </p>
          <p>
            <span className="text-ink-400">Kaynak: </span>
            {ticket.source}
          </p>
          <p>
            <span className="text-ink-400">Oluşturma: </span>
            {formatDateTime(ticket.createdAt)}
          </p>
          <p>
            <span className="text-ink-400">Atanan: </span>
            {staff?.name ?? "—"}
          </p>
          <p>
            <span className="text-ink-400">Durum: </span>
            {requestStatusLabel[ticket.status]}
          </p>
          {ticket.callId ? (
            <Link className="text-gold-700" href={`/panel/live-calls/${ticket.callId}`}>
              Çağrı bağlamı
            </Link>
          ) : null}
        </Card>
        <Card className="grid gap-3 p-5">
          <Field label="Personel ata">
            <Select value={ticket.assignedStaffId ?? ""} onChange={(e) => services.requests.assign(ticket.id, e.target.value)}>
              <option value="">Seçin</option>
              {state.staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Durum">
            <Select value={ticket.status} onChange={(e) => services.requests.setStatus(ticket.id, e.target.value as RequestStatus)}>
              <option value="new">Yeni</option>
              <option value="in-progress">İşlemde</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal</option>
            </Select>
          </Field>
          <Field label="Not">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <Button
            onClick={() => {
              if (!note.trim()) return;
              services.requests.addNote(ticket.id, note);
              setNote("");
            }}
          >
            Not ekle
          </Button>
        </Card>
      </div>
      <Card className="p-5">
        <p className="font-medium">Notlar</p>
        <ul className="mt-3 space-y-2 text-sm">
          {ticket.notes.map((n) => (
            <li key={n.id}>
              <span className="text-ink-400">{n.author}: </span>
              {n.text}
            </li>
          ))}
          {ticket.notes.length === 0 ? <li className="text-ink-400">Henüz not yok.</li> : null}
        </ul>
      </Card>
    </div>
  );
}
