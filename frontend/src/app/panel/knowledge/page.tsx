import { ActionButton, CreateResourceButton } from "@/components/CreateResourceButton";
import { Badge, Card, EmptyState, PageHeader, StatCard } from "@/components/ui";
import { api } from "@/lib/api";

export default async function KnowledgePage() {
  const [entries, agents] = await Promise.all([api.getKnowledge(), api.getAgents()]);
  const live = entries.filter((e) => e.status === "live").length;
  const pending = entries.filter((e) => e.status === "pending").length;
  const draft = entries.filter((e) => e.status === "draft").length;
  const agentId = agents[0]?.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bilgi bankası"
        description="Sesli asistanınızın konuşma sırasında yararlanacağı bilgi havuzunu yönetin."
        action={
          <div className="flex flex-wrap gap-2">
            {agentId ? (
              <ActionButton
                label="Ajanı senkronize et"
                endpoint={`agents/${agentId}/sync`}
                successMessage="Bilgi bankası ajanla senkronize edildi."
              />
            ) : null}
            <CreateResourceButton
              label="+ Yeni bilgi ekle"
              endpoint="knowledge"
              defaults={{ status: "live", priority: 1, category: "Genel" }}
              fields={[
                { name: "title", label: "Başlık", required: true },
                { name: "category", label: "Kategori", required: true },
                { name: "content", label: "İçerik", type: "textarea", required: true },
                { name: "tags", label: "Etiketler" },
                {
                  name: "priority",
                  label: "Öncelik",
                  type: "number",
                },
                {
                  name: "status",
                  label: "Durum",
                  type: "select",
                  options: [
                    { value: "live", label: "Yayında" },
                    { value: "pending", label: "Onay bekliyor" },
                    { value: "draft", label: "Taslak" },
                  ],
                },
              ]}
            />
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Yayında" value={live} />
        <StatCard label="Onay bekliyor" value={pending} />
        <StatCard label="Taslak" value={draft} />
        <StatCard label="Toplam giriş" value={entries.length} />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="Henüz bilgi girişi yok"
          body="İlk girişi ekleyerek asistanınızın doğru cevap vermesini sağlayabilirsiniz."
        />
      ) : (
        <div className="grid gap-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  tone={
                    entry.status === "live" ? "ok" : entry.status === "pending" ? "warn" : "neutral"
                  }
                >
                  {entry.status === "live"
                    ? "Yayında"
                    : entry.status === "pending"
                      ? "Onay bekliyor"
                      : "Taslak"}
                </Badge>
                <span className="text-xs text-[var(--muted)]">{entry.category}</span>
                <span className="text-xs text-[var(--muted)]">Öncelik {entry.priority}</span>
              </div>
              <h2 className="mt-3 text-lg font-medium text-[var(--text)]">{entry.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{entry.content}</p>
              {entry.tags ? (
                <p className="mt-3 text-xs text-[var(--muted-2)]">Etiketler: {entry.tags}</p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
