import { Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";

export default async function WhatsappPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const messages = await api.getWhatsapp(q);

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Yazışmaları"
        description="Yapay zekanın müşterilerle WhatsApp üzerinden yaptığı görüşme kayıtları."
      />
      <form className="flex gap-2" action="/panel/whatsapp">
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="Numara veya metin ara..."
          className="h-11 flex-1 rounded-xl border border-[var(--line)] bg-[var(--input)] px-3 text-sm outline-none"
        />
        <button className="rounded-xl bg-[var(--text)] px-4 text-sm font-medium text-[var(--bg)]">
          Ara
        </button>
      </form>
      {messages.length === 0 ? (
        <EmptyState
          title="Henüz WhatsApp görüşmesi bulunmuyor"
          body="İlk görüşmeler burada listelenecek."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[140px_180px_1fr] gap-3 border-b border-[var(--line)] px-4 py-3 text-xs uppercase tracking-wide text-[var(--muted-2)]">
            <span>Tarih</span>
            <span>Müşteri Numarası</span>
            <span>Görüşme Kaydı</span>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="grid grid-cols-1 gap-2 border-b border-[var(--line)] px-4 py-4 last:border-b-0 md:grid-cols-[140px_180px_1fr]"
            >
              <p className="text-sm text-[var(--muted)]">{formatTime(msg.occurred_at)}</p>
              <p className="text-sm text-[var(--text)]">{msg.customer_number}</p>
              <p className="text-sm text-[var(--muted)]">{msg.preview}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
