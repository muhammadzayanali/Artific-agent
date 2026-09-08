"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { FrequencyField } from "@/components/FrequencyField";
import { BrandLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("demo@artificagent.com");
  const [password, setPassword] = useState("DemoPass123!");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.detail ?? "Geçersiz e-posta veya şifre.");
        return;
      }
      router.replace(searchParams.get("next") || "/panel");
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı. Django API çalışıyor mu?");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-[var(--muted)]">E-posta</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="theme-input h-12 rounded-brand px-3.5"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-[var(--muted)]">Şifre</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="theme-input h-12 rounded-brand px-3.5"
        />
      </label>
      {error ? (
        <p
          role="alert"
          className="rounded-brand bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)] ring-1 ring-[color-mix(in_srgb,var(--danger)_20%,transparent)]"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 rounded-brand bg-[var(--text)] font-semibold text-[var(--bg)] transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Panele gir"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-svh overflow-hidden">
      <FrequencyField />

      <div className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <BrandLogo href="/" size={38} priority />
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8">
        <section className="animate-fade-up max-lg:order-2">
          <BrandLogo href={null} showWordmark={false} size={64} className="mb-6" />
          <p className="font-display text-[clamp(2.6rem,7vw,4.8rem)] font-bold leading-[0.92] tracking-[-0.04em] text-[var(--text)]">
            Artific
            <span className="text-[var(--signal)]">Agent</span>
          </p>
          <h1 className="mt-6 max-w-lg font-display text-2xl font-semibold leading-snug tracking-tight text-[var(--text)] sm:text-3xl">
            Operasyon paneline hoş geldiniz.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted)]">
            Canlı çağrılar, bilgi bankası, personel aktarımı ve kampanyalar — hepsi tek, net bir
            merkezde.
          </p>
        </section>

        <section className="animate-fade-up max-lg:order-1" style={{ animationDelay: "100ms" }}>
          <div className="rounded-brand-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_92%,transparent)] p-7 shadow-[var(--shadow)] backdrop-blur-2xl sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
              Müşteri girişi
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Demo hesabıyla paneli hemen deneyin.
            </p>
            <Suspense>
              <LoginForm />
            </Suspense>
            <p className="mt-6 border-t border-[var(--line)] pt-5 font-mono text-[11px] leading-relaxed text-[var(--muted-2)]">
              demo@artificagent.com
              <br />
              DemoPass123!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
