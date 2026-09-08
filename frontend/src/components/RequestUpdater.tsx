"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";

export function RequestUpdater({
  id,
  status,
  assignee,
  staff,
}: {
  id: number;
  status: string;
  assignee: number | null;
  staff: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [nextAssignee, setNextAssignee] = useState(assignee ? String(assignee) : "");
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    await fetch(`/api/proxy/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        assignee: nextAssignee ? Number(nextAssignee) : null,
      }),
    });
    router.refresh();
    setPending(false);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <select
        value={nextStatus}
        onChange={(e) => setNextStatus(e.target.value)}
        className="theme-input h-10 rounded-xl px-3 text-sm"
      >
        <option value="new">Yeni</option>
        <option value="in_progress">İşlemde</option>
        <option value="completed">Tamamlandı</option>
        <option value="cancelled">İptal</option>
      </select>
      <select
        value={nextAssignee}
        onChange={(e) => setNextAssignee(e.target.value)}
        className="theme-input h-10 rounded-xl px-3 text-sm"
      >
        <option value="">Atanmamış</option>
        {staff.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
      <Button onClick={save} disabled={pending} variant="secondary">
        {pending ? "Kaydediliyor…" : "Güncelle"}
      </Button>
    </div>
  );
}
