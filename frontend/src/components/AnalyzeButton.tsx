"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";

export function AnalyzeButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function run() {
    setPending(true);
    await fetch("/api/proxy/analysis", { method: "POST", body: "{}" });
    router.refresh();
    setPending(false);
  }

  return (
    <Button onClick={run} disabled={pending}>
      {pending ? "Analiz ediliyor…" : "Hemen Analiz Et (Canlı)"}
    </Button>
  );
}
