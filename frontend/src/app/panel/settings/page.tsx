import { SettingsForms } from "@/components/SettingsForms";
import { Badge, Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";

export default async function SettingsPage() {
  const profile = await api.getProfile();

  return (
    <div className="space-y-6">
      <PageHeader title="Hesap ayarları" description="İşletme bilgileri, bakiye ve sistem durumu." />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SettingsForms profile={profile} />
        <Card className="h-fit p-5">
          <p className="text-sm font-medium text-[var(--text)]">Sistem bilgileri</p>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="İşletme ID" value={`#${profile.organization_id}`} />
            <Row label="E-posta" value={profile.email || "—"} />
            <Row label="EL agent ID" value={profile.external_agent_id || "—"} />
            <Row label="Kayıt tarihi" value={profile.registered_at || "—"} />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--muted)]">Durum</span>
              <Badge tone={profile.is_active ? "ok" : "warn"}>
                {profile.is_active ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="max-w-[60%] break-all text-right text-[var(--text)]">{value}</span>
    </div>
  );
}
