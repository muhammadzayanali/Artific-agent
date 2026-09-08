"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { knowledgeCategoryLabel } from "@/lib/labels";
import type { KnowledgeCategory, KnowledgeStatus, Priority } from "@/types";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function KnowledgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const item = useDemoStore((s) => s.knowledge.find((k) => k.id === id));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>(3);
  const [status, setStatus] = useState<KnowledgeStatus>("active");
  const [category, setCategory] = useState<KnowledgeCategory>("additional");

  useEffect(() => {
    if (!item) return;
    setTitle(item.title);
    setContent(item.content);
    setPriority(item.priority);
    setStatus(item.status);
    setCategory(item.category);
  }, [item]);

  if (!item) return <EmptyState title="Kayıt yok" body="Bu bilgi öğesi bulunamadı." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Bilgi Bankası"
        title={item.title}
        actions={
          <>
            <Button
              onClick={() =>
                services.knowledge.upsert({ ...item, title, content, priority, status, category })
              }
            >
              Kaydet
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                services.knowledge.remove(item.id);
                router.push("/panel/knowledge-base");
              }}
            >
              Sil
            </Button>
          </>
        }
      />
      <Card className="grid gap-4 p-5">
        <Field label="Başlık">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="İçerik">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Kategori">
            <Select value={category} onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}>
              {Object.entries(knowledgeCategoryLabel).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Öncelik">
            <Select value={priority} onChange={(e) => setPriority(Number(e.target.value) as Priority)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Durum">
            <Select value={status} onChange={(e) => setStatus(e.target.value as KnowledgeStatus)}>
              <option value="active">Aktif</option>
              <option value="disabled">Kapalı</option>
            </Select>
          </Field>
        </div>
        {item.id === "k_price_policy" ? (
          <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
            Bu kural Mehmet Kaya ve Elif Demir canlı çağrılarına bağlıdır. Özel fiyat talebi insan aktarımını tetikler.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
