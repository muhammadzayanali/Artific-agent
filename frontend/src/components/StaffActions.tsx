"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";

export function StaffActions({
  id,
  availability,
}: {
  id: number;
  availability: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function markAvailable() {
    setPending(true);
    await fetch(`/api/proxy/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability: "available" }),
    });
    router.refresh();
    setPending(false);
  }

  async function remove() {
    setPending(true);
    await fetch(`/api/proxy/staff/${id}`, { method: "DELETE" });
    router.refresh();
    setPending(false);
  }

  return (
    <div className="mt-4 flex gap-2">
      {availability !== "available" ? (
        <Button onClick={markAvailable} disabled={pending} className="flex-1" variant="secondary">
          Müsait işaretle
        </Button>
      ) : null}
      <Button onClick={remove} disabled={pending} className="flex-1" variant="danger">
        Sil
      </Button>
    </div>
  );
}
