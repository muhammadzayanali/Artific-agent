import Link from "next/link";

import { BrandName } from "@/components/BrandName";
import { FrequencyField } from "@/components/FrequencyField";
import { BrandLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAccessToken } from "@/lib/auth";

export default async function HomePage() {
  const token = await getAccessToken();
  const primaryHref = token ? "/panel" : "/login";
  const primaryLabel = token ? "Panele dön" : "Giriş Yap";

  return (
    <main className="relative min-h-svh overflow-hidden">
      <FrequencyField />

      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <BrandLogo href="/" size={40} priority />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={primaryHref}
            className="hidden rounded-brand bg-[var(--text)] px-4 py-2.5 text-sm font-medium text-[var(--bg)] transition hover:opacity-90 sm:inline-flex"
          >
            {primaryLabel}
          </Link>
        </div>
      </header>

      {/* First viewport: brand + one headline + one line + CTA + full-bleed visual */}
      <section className="relative z-10 flex min-h-[calc(100svh-5.5rem)] flex-col justify-end px-5 pb-16 pt-10 sm:px-8 sm:pb-20 lg:justify-center lg:px-12 lg:pb-24">
        <div className="max-w-4xl animate-fade-up">
          <div className="mb-8">
            <BrandLogo href={null} showWordmark={false} size={72} priority />
          </div>
          <BrandName className="font-display text-[clamp(3.2rem,10vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-[var(--text)]">
            Artific<span className="text-[var(--signal)]">Agent</span>
          </BrandName>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(1.65rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-[var(--text)]">
            Telefonu cevaplayan zeka.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Sesli asistan, bilgi bankası ve ekibinizi tek komuta merkezinden yönetin — müşteri
            aradığında işletmeniz hazırdır.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={primaryHref}
              className="inline-flex h-12 items-center rounded-brand bg-[var(--text)] px-6 text-sm font-semibold text-[var(--bg)] transition hover:opacity-90"
            >
              {primaryLabel}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-brand border border-[var(--line)] bg-[var(--panel)] px-6 text-sm font-medium text-[var(--text)] backdrop-blur-md transition hover:border-[color-mix(in_srgb,var(--signal)_40%,transparent)]"
            >
              Demo hesabı
            </Link>
          </div>
        </div>

        <p className="absolute bottom-6 right-5 hidden font-mono text-[10px] tracking-[0.04em] text-[var(--muted-2)] sm:right-8 lg:right-12 lg:block">
          Less artificial · more intelligence
        </p>
      </section>

      <section className="relative z-10 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-5 py-20 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--signal)]">
            Neden{" "}
            <span className="notranslate" translate="no">
              Artific agent
            </span>
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Bilmediğiniz bir ürün değil — kaçırdığınız her aramanın cevabı.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                title: "Canlı hat",
                body: "Asistan müşteriyi karşılar, soruları yanıtlar, doğru personele aktarır.",
              },
              {
                title: "Tek panel",
                body: "Çağrı geçmişi, talepler, WhatsApp ve kampanyalar aynı operasyon görünümünde.",
              },
              {
                title: "İşletmeye özel",
                body: "Bilgi bankası ve ajan ayarıyla markanızın sesini ve kurallarını taşır.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="animate-fade-up border-t border-[var(--line)] pt-6"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--gilt)]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-[var(--line)] pt-10 sm:flex-row sm:items-center">
            <p className="max-w-md text-sm text-[var(--muted)]">
              Demo: <span className="font-mono text-[var(--text)]">demo@artificagent.com</span> ·{" "}
              <span className="font-mono text-[var(--text)]">DemoPass123!</span>
            </p>
            <Link
              href={primaryHref}
              className="inline-flex h-11 items-center rounded-brand bg-[var(--signal)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Hemen dene
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
