import Link from "next/link";

import { CreateResourceButton } from "@/components/CreateResourceButton";
import { RequestUpdater } from "@/components/RequestUpdater";
import { Badge, Card, PageHeader, StatCard } from "@/components/ui";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";

const categoryLabel: Record<string, string> = {
  price: "Fiyat sorusu",
  reservation: "Rezervasyon",
  complaint: "Şikayet",
  callback: "Geri Arama",
  quote: "Teklif",
  info: "Bilgi talebi",
  other: "Diğer",
};

const filters = [
  { label: "Tümü", category: "" },
  { label: "Fiyat sorusu", category: "price" },
  { label: "Rezervasyon", category: "reservation" },
  { label: "Şikayet", category: "complaint" },
  { label: "Geri Arama", category: "callback" },
  { label: "Teklif", category: "quote" },
  { label: "Bilgi talebi", category: "info" },
  { label: "Diğer", category: "other" },
];

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [all, staff] = await Promise.all([api.getRequests(category), api.getStaff()]);
  const counts = {
    new: all.filter((r) => r.status === "new").length,
    in_progress: all.filter((r) => r.status === "in_progress").length,
    completed: all.filter((r) => r.status === "completed").length,
    cancelled: all.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talep Merkezi"
        description="Çağrılardan gelen talepler ve görevler."
        action={
          <CreateResourceButton
            label="+ Yeni Talep"
            endpoint="requests"
            defaults={{ status: "new", priority: "medium", category: "info" }}
            fields={[
              { name: "title", label: "Başlık", required: true },
              { name: "description", label: "Açıklama", type: "textarea", required: true },
              { name: "phone", label: "Telefon" },
              {
                name: "category",
                label: "Kategori",
                type: "select",
                options: Object.entries(categoryLabel).map(([value, label]) => ({
                  value,
                  label,
                })),
              },
              {
                name: "priority",
                label: "Öncelik",
                type: "select",
                options: [
                  { value: "low", label: "Düşük" },
                  { value: "medium", label: "Orta" },
                  { value: "high", label: "Yüksek" },
                ],
              },
              {
                name: "status",
                label: "Durum",
                type: "select",
                options: [
                  { value: "new", label: "Yeni" },
                  { value: "in_progress", label: "İşlemde" },
                  { value: "completed", label: "Tamamlandı" },
                ],
              },
            ]}
          />
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Yeni" value={counts.new} />
        <StatCard label="İşlemde" value={counts.in_progress} />
        <StatCard label="Tamamlandı" value={counts.completed} />
        <StatCard label="İptal" value={counts.cancelled} />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = (category || "") === filter.category;
          const href = filter.category
            ? `/panel/requests?category=${filter.category}`
            : "/panel/requests";
          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm ring-1 ${
                active
                  ? "bg-[var(--text)] text-[var(--bg)] ring-[var(--text)]"
                  : "bg-[var(--panel-solid)] text-[var(--muted)] ring-[var(--line)]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
      <div className="grid gap-3">
        {all.slice(0, 20).map((request) => (
          <Card key={request.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warn">{categoryLabel[request.category] || request.category}</Badge>
              <Badge tone="neutral">
                {request.priority === "medium" ? "Orta" : request.priority}
              </Badge>
              <Badge tone="ok">{request.status === "new" ? "Yeni" : request.status}</Badge>
            </div>
            <h2 className="mt-3 text-lg font-medium text-[var(--text)]">{request.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{request.description}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              {request.phone} · {formatTime(request.created_at)}
            </p>
            <RequestUpdater
              id={request.id}
              status={request.status}
              assignee={request.assignee}
              staff={staff.map((s) => ({ id: s.id, name: s.name }))}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
