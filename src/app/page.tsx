"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/primitives";

const pillars = [
  { title: "AI Voice", body: "Onaylı bilgiyle gelen çağrıları karşılar, niyeti sınıflandırır." },
  { title: "Omnichannel", body: "Ses ve WhatsApp aynı bilgi ve aktarım kurallarını paylaşır." },
  { title: "Knowledge grounding", body: "Yanıtlar politika ve fiyat kayıtlarına bağlıdır." },
  { title: "Human handoff", body: "Pazarlık ve yetki gerektiren anlarda insan devralır." },
  { title: "Campaign automation", body: "Onaylı kitleye giden aramalar aynı operasyon merkezinden yönetilir." },
  { title: "Business intelligence", body: "Görüşmeler talep, darboğaz ve öneriye dönüşür." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link href="/platform">Platform</Link>
          <Link href="/features">Özellikler</Link>
          <Link href="/login">Giriş</Link>
          <Link href="/request-demo">
            <Button size="sm">Request a Demo</Button>
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-20">
        <section className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold-700">ArtificAgent</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight text-ink-950">
              AI Communication Infrastructure for Modern Businesses
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-600">
              Automate voice and messaging operations with grounded AI, real-time supervision, and seamless human handoff.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/request-demo">
                <Button size="lg">Request a Demo</Button>
              </Link>
              <Link href="/platform">
                <Button size="lg" variant="secondary">
                  Explore Platform
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="gold">
                  Open Operations Center
                </Button>
              </Link>
            </div>
          </div>
          <Link href="/login" className="rounded-3xl border border-ink-100 bg-white p-6 shadow-lift">
            <p className="text-xs uppercase tracking-wide text-ink-400">Ürün önizleme</p>
            <p className="mt-2 font-serif text-2xl">Anatolia Gold operasyon merkezi</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <PreviewStat label="Aktif çağrı" value="3" />
              <PreviewStat label="AI yanıt" value="Ayşe" />
              <PreviewStat label="Aktarım" value="Fiyat politikası" />
              <PreviewStat label="Talep" value="Açık" />
            </div>
          </Link>
        </section>
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.title} className="rounded-2xl border border-ink-100 bg-white p-5">
              <h2 className="font-medium">{p.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{p.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-50 p-4">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
