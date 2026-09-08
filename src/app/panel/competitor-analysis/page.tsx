"use client";

import { Badge, Card, Field, Input, PageHeader } from "@/components/ui/primitives";
import { formatTry, spokenRate } from "@/lib/utils";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function CompetitorPage() {
  const competitors = useDemoStore((s) => s.competitors);
  const market = useDemoStore((s) => s.market);
  const spoken = spokenRate(market.karat24Base, market.sellingSpread);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Zeka"
        title="Rakip analizi"
        description="Konum ve puanlar demo veri setidir. Üretimde Google Maps sağlayıcısı aynı arayüzü doldurur."
      />
      <Badge tone="demo">Demo Data · Google Maps bağlı değil</Badge>
      <div className="grid gap-4 lg:grid-cols-3">
        {competitors.map((c) => (
          <Card key={c.id} className="p-5">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-ink-500">{c.location}</p>
            <p className="mt-3 text-sm">
              {c.rating} · {c.reviewCount} değerlendirme
            </p>
            <p className="mt-2 text-sm text-ink-600">{c.pricingSignal}</p>
            <p className="mt-2 text-sm">{c.observation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.services.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <section>
        <h2 className="font-serif text-2xl">Piyasa fiyatı</h2>
        <p className="mt-1 text-sm text-ink-500">Harem Altın · Demo Feed. Konuşulan oran = baz + satış spread.</p>
        <Card className="mt-4 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-ink-400">24K baz</p>
            <p className="font-serif text-2xl">{formatTry(market.karat24Base)}</p>
          </div>
          <Field label="Satış spread">
            <Input
              type="number"
              step="0.1"
              value={market.sellingSpread}
              onChange={(e) => services.market.setSpread(Number(e.target.value))}
            />
          </Field>
          <div>
            <p className="text-xs text-ink-400">Konuşulan oran</p>
            <p className="font-serif text-2xl">{formatTry(spoken)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Son güncelleme</p>
            <p className="text-sm">{new Date(market.lastUpdatedAt).toLocaleTimeString("tr-TR")}</p>
            <Badge tone="demo" className="mt-2">
              Demo Market Data
            </Badge>
          </div>
        </Card>
      </section>
    </div>
  );
}
