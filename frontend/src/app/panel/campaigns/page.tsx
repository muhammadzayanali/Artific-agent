import { StartCampaignButton } from "@/components/StartCampaignButton";
import { Badge, Card, PageHeader, StatCard } from "@/components/ui";
import { api } from "@/lib/api";

export default async function CampaignsPage() {
  const campaigns = await api.getCampaigns();
  const campaign = campaigns[0];

  if (!campaign) {
    return (
      <div>
        <PageHeader title="Kampanya araması" description="Outbound arama kampanyalarınızı yönetin." />
        <Card className="p-10 text-center text-sm text-[var(--muted)]">Henüz kampanya yok.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kampanya araması"
        description="AI outbound aramalarını başlatın ve hedef listesini takip edin."
      />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-medium text-[var(--text)]">Kampanya ayarları</p>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-[var(--muted)]">Arayacak ajan</p>
                <p className="mt-1">{campaign.agent_name || "Ana asistan"}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Aramanın yapılacağı hat</p>
                <p className="mt-1">{campaign.line_label}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Sesli kampanya mesajı</p>
                <p className="mt-2 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-3 text-[var(--muted)]">
                  {campaign.message}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-medium text-[var(--text)]">Kampanya kontrolü</p>
            <div className="mt-4">
              <StartCampaignButton id={campaign.id} status={campaign.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Toplam hedef" value={campaign.total_targets} />
              <StatCard label="Aranan" value={campaign.called_count} />
              <StatCard label="Başarılı" value={campaign.success_count} />
              <StatCard label="Hatalı" value={campaign.failed_count} />
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Durum:{" "}
              <Badge tone={campaign.status === "running" ? "live" : "neutral"}>
                {campaign.status === "running" ? "Çalışıyor" : "Taslak"}
              </Badge>
            </p>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <p className="text-sm font-medium text-[var(--text)]">Kampanya arama listesi</p>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {campaign.contacts.map((contact) => {
              const status = contact.call_status || "pending";
              const tone =
                status === "success" || status === "completed"
                  ? "ok"
                  : status === "failed"
                    ? "danger"
                    : status === "calling" || status === "running"
                      ? "live"
                      : "warn";
              const label =
                status === "success" || status === "completed"
                  ? "Başarılı"
                  : status === "failed"
                    ? "Hatalı"
                    : status === "calling" || status === "running"
                      ? "Aranıyor"
                      : "Bekliyor";
              return (
                <div
                  key={contact.id}
                  className="grid gap-2 px-5 py-3 sm:grid-cols-[1fr_140px_100px] sm:items-center"
                >
                  <div>
                    <p className="font-medium text-[var(--text)]">{contact.name}</p>
                    <p className="text-xs text-[var(--muted)]">{contact.source}</p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{contact.phone}</p>
                  <Badge tone={tone}>{label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
