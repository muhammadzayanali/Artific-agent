"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { useDemoStore } from "@/stores/demo-store";

export function DemoControl() {
  const [open, setOpen] = useState(false);
  const runInbound = useDemoStore((s) => s.runInboundScenario);
  const runHandoff = useDemoStore((s) => s.runHandoffScenario);
  const runWhatsApp = useDemoStore((s) => s.runWhatsAppScenario);
  const runCampaign = useDemoStore((s) => s.runCampaignScenario);
  const reset = useDemoStore((s) => s.resetDemo);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <FlaskConical className="h-4 w-4" />
        Demo Lab
      </Button>
      {open ? (
        <div className="mt-2 w-72 rounded-2xl border border-ink-100 bg-white p-3 shadow-lift">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Toplantı kontrolleri</p>
          <div className="mt-3 grid gap-2">
            <Button variant="secondary" size="sm" onClick={runInbound}>
              Gelen çağrı senaryosu
            </Button>
            <Button variant="secondary" size="sm" onClick={runHandoff}>
              İnsan aktarımı senaryosu
            </Button>
            <Button variant="secondary" size="sm" onClick={runWhatsApp}>
              WhatsApp senaryosu
            </Button>
            <Button variant="secondary" size="sm" onClick={runCampaign}>
              Kampanya ilerlemesi
            </Button>
            <Button variant="gold" size="sm" onClick={reset}>
              Demo ortamını sıfırla
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
