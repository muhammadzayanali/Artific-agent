"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";

export function StartCampaignButton({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function start() {
    setPending(true);
    await fetch(`/api/proxy/campaigns/${id}/start`, { method: "POST", body: "{}" });
    router.refresh();
    setPending(false);
  }

  return (
    <Button onClick={start} disabled={pending || status === "running"} className="w-full">
      {status === "running" ? "Kampanya Çalışıyor" : pending ? "Başlatılıyor…" : "Kampanyayı Başlat"}
    </Button>
  );
}
