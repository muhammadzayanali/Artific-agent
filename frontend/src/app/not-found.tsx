import Link from "next/link";

import { BrandLogo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-[var(--text)]">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <BrandLogo href={null} showWordmark={false} size={56} />
        </div>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--signal)]">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Sayfa bulunamadı</h1>
        <p className="mt-4 text-[var(--muted)]">İstediğiniz sayfa mevcut değil.</p>
        <Link
          href="/panel"
          className="mt-8 inline-flex rounded-brand bg-[var(--text)] px-5 py-2.5 text-sm font-medium text-[var(--bg)]"
        >
          Panele dön
        </Link>
      </div>
    </main>
  );
}
