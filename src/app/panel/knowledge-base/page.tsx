"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select } from "@/components/ui/primitives";
import { knowledgeCategoryLabel } from "@/lib/labels";
import { formatDateTime, uid } from "@/lib/utils";
import type { KnowledgeCategory, KnowledgeItem } from "@/types";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

const categories = Object.keys(knowledgeCategoryLabel) as KnowledgeCategory[];

export default function KnowledgePage() {
  const items = useDemoStore((s) => s.knowledge);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const hay = `${item.title} ${item.content}`.toLowerCase();
        return (cat === "all" || item.category === cat) && hay.includes(q.toLowerCase());
      }),
    [items, q, cat],
  );

  function create() {
    const item: KnowledgeItem = {
      id: uid("k"),
      title: "Yeni bilgi kaydı",
      content: "İçeriği düzenleyin.",
      category: "additional",
      priority: 3,
      status: "active",
      updatedAt: new Date().toISOString(),
      linkedCallIds: [],
    };
    services.knowledge.upsert(item);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI"
        title="Bilgi Bankası"
        description="AI yanıtları onaylı kayıtlara bağlıdır. Fiyat pazarlığı kuralı canlı çağrıya bağlanır."
        actions={<Button onClick={create}>Yeni kayıt</Button>}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Ara" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-64">
          <option value="all">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {knowledgeCategoryLabel[c]}
            </option>
          ))}
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Kayıt yok" body="Filtreleri temizleyin veya yeni kayıt ekleyin." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <Link key={item.id} href={`/panel/knowledge-base/${item.id}`}>
              <Card className="p-4 transition hover:shadow-lift">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-500">{item.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Öncelik {item.priority}</Badge>
                    <Badge tone={item.status === "active" ? "live" : "neutral"}>{item.status}</Badge>
                    <span className="text-xs text-ink-400">{formatDateTime(item.updatedAt)}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-400">{knowledgeCategoryLabel[item.category]}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
