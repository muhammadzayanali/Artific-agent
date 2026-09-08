"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Card, EmptyState, Input, PageHeader } from "@/components/ui/primitives";
import { customerById, staffById } from "@/demo/lookups";
import { formatClock } from "@/lib/utils";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";
import { cn } from "@/lib/utils";

export default function WhatsAppPage() {
  const { id } = useParams<{ id: string }>();
  const state = useDemoStore();
  const conversation = state.conversations.find((c) => c.id === id);
  const [text, setText] = useState("");
  if (!conversation) return <EmptyState title="Konuşma yok" body="Kayıt bulunamadı." />;
  const customer = customerById(state, conversation.customerId);
  const staff = staffById(state, conversation.staffId);
  const messages = state.messages.filter((m) => m.conversationId === id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="WhatsApp"
        title="Mesajlaşma"
        description="Aynı bilgi kuralları ses kanalıyla paylaşılır."
        actions={<Badge tone="demo">WhatsApp · Demo Mode</Badge>}
      />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="overflow-hidden">
          {state.conversations.map((c) => {
            const cust = customerById(state, c.customerId);
            return (
              <Link
                key={c.id}
                href={`/panel/whatsapp/${c.id}`}
                className={cn("block border-b border-ink-50 px-4 py-3 hover:bg-ink-50", c.id === id && "bg-ink-50")}
              >
                <div className="flex justify-between gap-2">
                  <p className="font-medium">{cust?.name}</p>
                  <span className="text-xs text-ink-400">{formatClock(c.lastMessageAt)}</span>
                </div>
                <p className="truncate text-sm text-ink-500">{c.preview}</p>
              </Link>
            );
          })}
        </Card>
        <Card className="flex min-h-[520px] flex-col">
          <div className="flex items-center justify-between border-b border-ink-50 px-4 py-3">
            <div>
              <p className="font-medium">{customer?.name}</p>
              <p className="text-xs text-ink-500">
                {conversation.status === "human" ? `İnsan ajan: ${staff?.name ?? "Elif Yılmaz"}` : "AI: Nova"}
              </p>
            </div>
            {conversation.status === "ai" ? (
              <Button size="sm" onClick={() => services.whatsapp.takeOver(conversation.id)}>
                Take Over Conversation
              </Button>
            ) : (
              <Badge tone="gold">AI Assistant Paused</Badge>
            )}
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
            {messages.map((m) => (
              <div key={m.id} className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm", m.from === "customer" ? "bg-ink-50" : "ml-auto bg-gold-100")}>
                <p className="text-[11px] text-ink-400">{m.author}</p>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-ink-50 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (conversation.status !== "human" || !text.trim()) return;
              services.whatsapp.send(conversation.id, text);
              setText("");
            }}
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={conversation.status === "human" ? "Mesaj yazın" : "AI aktif — devralın"}
              disabled={conversation.status !== "human"}
            />
            <Button type="submit" disabled={conversation.status !== "human"}>
              Gönder
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
