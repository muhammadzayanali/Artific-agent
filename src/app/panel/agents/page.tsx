"use client";

import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/ui/primitives";
import { agentStatusLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function AgentsPage() {
  const agents = useDemoStore((s) => s.agents);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="AI" title="Ajanlar" description="Ses ve WhatsApp ajanlarını, bilgi kaynaklarını ve aktarım kurallarını yönetin." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <Link key={agent.id} href={`/panel/agents/${agent.id}`}>
            <Card className="h-full p-5 transition hover:shadow-lift">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-2xl">{agent.name}</p>
                  <p className="mt-1 text-sm text-ink-500">{agent.description}</p>
                </div>
                <Badge tone={agent.status === "active" ? "live" : "neutral"}>{agentStatusLabel[agent.status]}</Badge>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-ink-400">Kanal</dt>
                  <dd>{agent.channel}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">Dil</dt>
                  <dd>{agent.language}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">Çağrı</dt>
                  <dd>{agent.callsHandled}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">Son senkron</dt>
                  <dd>{formatDateTime(agent.lastSyncAt)}</dd>
                </div>
              </dl>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
