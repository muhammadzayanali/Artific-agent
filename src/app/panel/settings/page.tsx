"use client";

import { Badge, Card, Field, Input, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { integrationStatusLabel } from "@/lib/labels";
import { useDemoStore } from "@/stores/demo-store";

export default function SettingsPage() {
  const settings = useDemoStore((s) => s.settings);
  const update = useDemoStore((s) => s.updateSettings);
  const integrations = useDemoStore((s) => s.integrations);
  const audit = useDemoStore((s) => s.audit);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Yönetim" title="Ayarlar" description="Kuruluş, entegrasyon ve denetim izi." />
      <Card className="grid gap-4 p-5 md:grid-cols-2">
        <Field label="Kuruluş">
          <Input value={settings.companyName} onChange={(e) => update({ companyName: e.target.value })} />
        </Field>
        <Field label="Saat dilimi">
          <Input value={settings.timezone} onChange={(e) => update({ timezone: e.target.value })} />
        </Field>
        <Field label="Telefon sağlayıcı">
          <Input value={settings.telephonyProvider} readOnly />
        </Field>
        <Field label="WhatsApp sağlayıcı">
          <Input value={settings.whatsappProvider} readOnly />
        </Field>
        <Field label="Varsayılan aktarım">
          <Textarea value={settings.defaultEscalation} onChange={(e) => update({ defaultEscalation: e.target.value })} />
        </Field>
        <Field label="Dil">
          <Select value={settings.language} onChange={(e) => update({ language: e.target.value as "tr" | "en" })}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </Select>
        </Field>
      </Card>
      <section id="integrations">
        <h2 className="font-serif text-2xl">Entegrasyon merkezi</h2>
        <p className="mt-1 text-sm text-ink-500">Üretim bağlantıları henüz yok. Kartlar mimari sınırı gösterir.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-ink-400">{item.category}</p>
                </div>
                <Badge tone={item.status === "demo" ? "demo" : item.status === "connected" ? "live" : "neutral"}>
                  {integrationStatusLabel[item.status]}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-ink-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
      <Card className="p-5">
        <h2 className="font-medium">Denetim kaydı</h2>
        <ol className="mt-4 space-y-3">
          {audit.map((event) => (
            <li key={event.id} className="text-sm">
              <p className="font-medium">{event.action}</p>
              <p className="text-ink-500">
                {event.actor} · {event.detail}
              </p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
