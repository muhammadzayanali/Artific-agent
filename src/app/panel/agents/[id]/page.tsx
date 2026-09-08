"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, EmptyState, Field, PageHeader, Textarea } from "@/components/ui/primitives";
import { knowledgeCategoryLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const agent = useDemoStore((s) => s.agents.find((a) => a.id === id));
  const knowledge = useDemoStore((s) => s.knowledge);
  const syncProgress = useDemoStore((s) => s.syncProgress);
  const setSync = useDemoStore((s) => s.setSyncProgress);
  const [greeting, setGreeting] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (agent) {
      setGreeting(agent.greeting);
      setInstructions(agent.instructions);
    }
  }, [agent]);

  if (!agent) return <EmptyState title="Ajan bulunamadı" body="Kayıt mevcut değil." />;

  function save() {
    services.agents.update(agent!.id, { greeting, instructions });
  }

  function sync() {
    setSync({ agentId: agent!.id, phase: "preparing" });
    window.setTimeout(() => setSync({ agentId: agent!.id, phase: "syncing" }), 700);
    window.setTimeout(() => {
      services.agents.sync(agent!.id);
      setSync({ agentId: agent!.id, phase: "done" });
      window.setTimeout(() => setSync(null), 1200);
    }, 1600);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ajan"
        title={agent.name}
        description={agent.description}
        actions={
          <>
            <Button onClick={save}>Save Changes</Button>
            <Button variant="secondary" onClick={sync}>
              Sync Agent
            </Button>
          </>
        }
      />
      {syncProgress?.agentId === agent.id ? (
        <Card className="p-4 text-sm">
          {syncProgress.phase === "preparing" && "Senkronizasyon hazırlanıyor…"}
          {syncProgress.phase === "syncing" && "Senkronize ediliyor…"}
          {syncProgress.phase === "done" && "Başarıyla senkronize edildi."}
        </Card>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <p className="font-medium">Genel</p>
          <Field label="Karşılama">
            <Textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} />
          </Field>
          <Field label="Talimatlar">
            <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </Field>
          <p className="text-xs text-ink-400">Son değişiklik: {formatDateTime(agent.lastModifiedAt)}</p>
        </Card>
        <Card className="space-y-3 p-5">
          <p className="font-medium">Ses</p>
          <p className="text-sm text-ink-600">{agent.voiceProvider}</p>
          <p className="text-sm">{agent.voiceProfile}</p>
          <p className="text-sm text-ink-500">{agent.speakingStyle}</p>
          <Badge tone="demo">ElevenLabs · Demo Mode</Badge>
        </Card>
        <Card className="space-y-3 p-5">
          <p className="font-medium">Bilgi</p>
          {agent.knowledgeBaseIds.map((kid) => {
            const item = knowledge.find((k) => k.id === kid);
            return item ? (
              <Link key={kid} href={`/panel/knowledge-base/${kid}`} className="block rounded-xl bg-ink-50 px-3 py-2 text-sm">
                {item.title} · {knowledgeCategoryLabel[item.category]}
              </Link>
            ) : null;
          })}
        </Card>
        <Card className="space-y-3 p-5">
          <p className="font-medium">Güvenlik ve aktarım</p>
          <div>
            <p className="text-xs uppercase text-ink-400">Yasak konular</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {agent.prohibitedTopics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase text-ink-400">Aktarım kuralları</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {agent.escalationRules.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
