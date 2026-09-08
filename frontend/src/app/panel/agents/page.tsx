import { AgentStudio } from "@/components/AgentStudio";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";

export default async function AgentsPage() {
  const agents = await api.getAgents();
  const agent = agents[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ajan Ayarı"
        description="Ses kaydı, karşılama cümlesi, talimatlar ve araçları buradan yönetin."
      />
      {!agent ? (
        <EmptyState
          title="Henüz ajan tanımlı değil"
          body="Demo seed ile bir ajan oluşturulabilir."
        />
      ) : (
        <AgentStudio agent={agent} />
      )}
      {agents.length > 1 ? (
        <Card className="p-4 text-sm text-[var(--muted)]">
          Bu organizasyonda {agents.length} ajan var. Şimdilik birincil ajan düzenleniyor:{" "}
          <span className="text-[var(--text)]">{agent?.name}</span>
        </Card>
      ) : null}
    </div>
  );
}
