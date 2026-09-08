"use client";

import { useParams } from "next/navigation";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { customerById } from "@/demo/lookups";
import { campaignStatusLabel } from "@/lib/labels";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useDemoStore();
  const campaign = state.campaigns.find((c) => c.id === id);
  const targets = state.campaignTargets.filter((t) => t.campaignId === id);
  if (!campaign) return <EmptyState title="Kampanya yok" body="Kayıt bulunamadı." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kampanya"
        title={campaign.name}
        description={`${campaign.sipProvider} · ${campaign.scheduleLabel}`}
        actions={
          <Button variant="secondary" onClick={() => services.campaigns.progress(campaign.id)}>
            İlerlemeyi güncelle
          </Button>
        }
      />
      <Badge tone="demo">Demo Telephony</Badge>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Denenen", campaign.attempted],
          ["Bağlanan", campaign.connected],
          ["Başarısız", campaign.failed],
          ["Meşgul", campaign.busy],
          ["Bekleyen", campaign.pending],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-4">
            <p className="text-xs text-ink-400">{label}</p>
            <p className="font-serif text-2xl">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <p className="font-medium">Durum: {campaignStatusLabel[campaign.status]}</p>
        <p className="mt-2 text-sm text-ink-500">{campaign.greeting}</p>
      </Card>
      <Card className="p-5">
        <p className="font-medium">Hedefler</p>
        <ul className="mt-3 space-y-2 text-sm">
          {(targets.length ? targets : state.campaignTargets.slice(0, 5)).map((t) => {
            const customer = customerById(state, t.customerId);
            return (
              <li key={t.id} className="flex justify-between">
                <span>{customer?.name}</span>
                <span className="text-ink-400">{t.status}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
