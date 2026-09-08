"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, Field, Input, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { campaignStatusLabel } from "@/lib/labels";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";
import { useRouter } from "next/navigation";

export default function CampaignsPage() {
  const campaigns = useDemoStore((s) => s.campaigns);
  const agents = useDemoStore((s) => s.agents);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Ekim Hatırlatma");
  const [audience, setAudience] = useState("Son 90 günde aranmayan müşteriler");
  const [agentId, setAgentId] = useState("a_ayse");
  const [greeting, setGreeting] = useState("Merhaba, Anatolia Gold’dan arıyorum.");
  const router = useRouter();

  function launch() {
    const id = services.campaigns.launch({
      name,
      status: "running",
      agentId,
      greeting,
      sipProvider: "Demo Telephony Provider",
      audienceLabel: audience,
      scheduleLabel: "Hafta içi 10:00–17:00",
      totalTargets: 80,
    });
    setStep(0);
    router.push(`/panel/campaigns/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operasyon"
        title="Kampanya Auto-Dialer"
        description="Onaylı kitleye giden aramalar. Sağlayıcı: Demo Telephony Provider."
        actions={<Button onClick={() => setStep(1)}>Yeni kampanya</Button>}
      />
      {step > 0 ? (
        <Card className="p-5">
          <p className="text-sm text-ink-500">Adım {step} / 8</p>
          {step === 1 && (
            <Field label="Kampanya adı">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
          )}
          {step === 2 && (
            <Field label="Hedef kitle">
              <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
            </Field>
          )}
          {step === 3 && (
            <Field label="Ajan">
              <Select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          {step === 4 && <p className="text-sm">SIP Provider: Demo Telephony Provider</p>}
          {step === 5 && (
            <Field label="Karşılama">
              <Textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} />
            </Field>
          )}
          {step === 6 && <p className="text-sm">Plan: Hafta içi 10:00–17:00</p>}
          {step === 7 && (
            <ul className="text-sm text-ink-600">
              <li>{name}</li>
              <li>{audience}</li>
              <li>80 hedef · Demo Telephony</li>
            </ul>
          )}
          {step === 8 && <p className="text-sm">Kampanya başlatılacak.</p>}
          <div className="mt-4 flex gap-2">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Geri
              </Button>
            ) : null}
            {step < 8 ? <Button onClick={() => setStep((s) => s + 1)}>İleri</Button> : <Button onClick={launch}>Launch</Button>}
          </div>
        </Card>
      ) : null}
      <div className="grid gap-4">
        {campaigns.map((c) => (
          <Link key={c.id} href={`/panel/campaigns/${c.id}`}>
            <Card className="p-5 hover:shadow-lift">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-ink-500">{c.audienceLabel}</p>
                </div>
                <Badge tone={c.status === "running" ? "live" : "neutral"}>{campaignStatusLabel[c.status]}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-6">
                <Stat label="Hedef" value={c.totalTargets} />
                <Stat label="Denenen" value={c.attempted} />
                <Stat label="Bağlanan" value={c.connected} />
                <Stat label="Başarısız" value={c.failed} />
                <Stat label="Meşgul" value={c.busy} />
                <Stat label="Bekleyen" value={c.pending} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="font-serif text-2xl">{value}</p>
    </div>
  );
}
