"use client";

import { Badge, Card, PageHeader } from "@/components/ui/primitives";
import { formatDateTime } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function ConsultantPage() {
  const insights = useDemoStore((s) => s.insights);
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Zeka"
        title="AI Business Consultant"
        description="İçgörüler demo çağrı, WhatsApp ve talep veri setinden üretilir. Canlı model iddiası yoktur."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {insights.map((insight) => (
          <Card key={insight.id} className="p-5">
            <div className="flex items-center justify-between gap-2">
              <Badge tone="gold">{insight.category}</Badge>
              <span className="text-xs uppercase text-ink-400">{insight.impact}</span>
            </div>
            <h2 className="mt-3 font-serif text-2xl">{insight.title}</h2>
            <p className="mt-3 text-sm text-ink-600">
              <span className="font-medium">Kanıt: </span>
              {insight.evidence}
            </p>
            <p className="mt-2 text-sm text-ink-800">
              <span className="font-medium">Öneri: </span>
              {insight.recommendation}
            </p>
            <p className="mt-4 text-xs text-ink-400">{formatDateTime(insight.generatedAt)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
