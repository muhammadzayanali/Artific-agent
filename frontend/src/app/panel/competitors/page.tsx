import { ActionButton, CreateResourceButton } from "@/components/CreateResourceButton";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";

export default async function CompetitorsPage() {
  const competitors = await api.getCompetitors();

  return (
    <div>
      <PageHeader
        title="Rakip Analizi"
        description="Çevredeki rakipleri Google Maps tarzı verilerle takip edin; puan ve yorumlardan strateji çıkarın."
        action={
          <div className="flex flex-wrap gap-2">
            <ActionButton
              label="Otomatik Rakip Tara"
              endpoint="competitors/scan"
              successMessage="Tarama tamamlandı."
            />
            <CreateResourceButton
              label="+ Manuel Rakip Ekle"
              endpoint="competitors"
              defaults={{ review_count: 0, rating: 4.0 }}
              fields={[
                { name: "name", label: "İşletme adı", required: true },
                { name: "address", label: "Adres" },
                { name: "rating", label: "Puan", type: "number" },
                { name: "review_count", label: "Yorum sayısı", type: "number" },
                { name: "notes", label: "Notlar", type: "textarea" },
              ]}
            />
          </div>
        }
      />
      {competitors.length === 0 ? (
        <EmptyState
          title="Takip edilen rakip bulunamadı"
          body="Otomatik tara veya manuel rakip ekleyerek başlayın."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {competitors.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium text-[var(--text)]">{item.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.address || "Adres yok"}</p>
                </div>
                <Badge tone="ok">
                  ★ {item.rating ?? "—"} · {item.review_count} yorum
                </Badge>
              </div>
              {item.notes ? <p className="mt-4 text-sm text-[var(--muted)]">{item.notes}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
