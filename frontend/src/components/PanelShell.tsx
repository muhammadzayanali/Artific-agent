"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { BrandLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItem = { href: string; label: string };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "YAPILANDIRMA",
    items: [
      { href: "/panel/agents", label: "Ajan Ayarı" },
      { href: "/panel/knowledge", label: "Bilgi Bankası" },
      { href: "/panel/staff", label: "Personel Durumu" },
    ],
  },
  {
    title: "İZLEME",
    items: [
      { href: "/panel/live-calls", label: "Canlı Çağrılar" },
      { href: "/panel/call-history", label: "Çağrı Geçmişi" },
      { href: "/panel/ai-consultant", label: "AI Danışman" },
      { href: "/panel/competitors", label: "Rakip Analizi" },
    ],
  },
  {
    title: "YAYINA ALMA",
    items: [
      { href: "/panel/campaigns", label: "Kampanya Araması" },
      { href: "/panel/whatsapp", label: "WhatsApp Bot" },
      { href: "/panel/requests", label: "Talep Merkezi" },
    ],
  },
  {
    title: "AYARLAR",
    items: [{ href: "/panel/settings", label: "Ayarlar" }],
  },
];

export function PanelShell({
  children,
  orgName,
  remainingMinutes,
  activeCalls,
}: {
  children: React.ReactNode;
  orgName: string;
  remainingMinutes: number | string;
  activeCalls: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const linkClass = (active: boolean) =>
    `block rounded-xl px-3 py-2.5 text-sm transition duration-200 ${
      active ? "nav-active font-medium" : "text-[var(--muted)] hover:bg-[var(--nav-hover)] hover:text-[var(--text)]"
    }`;

  const nav = (
    <>
      <div className="border-b border-[var(--line)] px-4 py-5">
        <div className="flex items-center gap-3">
          <BrandLogo href="/panel" showWordmark={false} size={40} />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold tracking-tight text-[var(--text)]">
              {orgName}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-2)]">
              ArtificAgent
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <Link href="/panel" onClick={() => setOpen(false)} className={linkClass(pathname === "/panel")}>
          Ana Sayfa
        </Link>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 font-mono text-[10px] font-medium tracking-[0.2em] text-[var(--muted-2)]">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={linkClass(active)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={logout}
          disabled={pending}
          className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[var(--muted)] transition hover:bg-[var(--nav-hover)] hover:text-[var(--text)] disabled:opacity-50"
        >
          {pending ? "Çıkış yapılıyor…" : "Çıkış"}
        </button>
      </nav>

      <div className="m-3 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--signal)_25%,transparent)] bg-[linear-gradient(135deg,var(--signal-soft),var(--panel-solid))] p-4">
        <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-[var(--signal)]">
          KALAN BAKİYE
        </p>
        <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--signal)]">
          {Number(remainingMinutes).toFixed(1)}
          <span className="ml-1 text-sm font-medium opacity-70">dk</span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-black/30">
          <div className="h-full w-[72%] rounded-full bg-[var(--signal)]" />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-svh text-[var(--text)]">
      <div className="mx-auto flex min-h-svh max-w-[1600px]">
        <aside className="hidden w-[17.5rem] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--sidebar)] backdrop-blur-2xl lg:flex">
          {nav}
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-label="Menüyü kapat"
              onClick={() => setOpen(false)}
            />
            <aside className="relative flex h-full w-80 flex-col border-r border-[var(--line)] bg-[var(--panel-solid)]">
              {nav}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--header)] px-3 py-3 backdrop-blur-xl sm:gap-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="shrink-0 rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-2 text-sm lg:hidden"
                onClick={() => setOpen(true)}
              >
                Menü
              </button>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  Command Center
                </p>
                <p className="truncate text-sm text-[var(--muted)]">Operasyon görünümü</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-1.5 text-xs text-[var(--muted)] sm:inline-flex">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeCalls > 0 ? "animate-pulse-soft bg-[var(--signal)]" : "bg-[var(--muted-2)]"
                  }`}
                />
                Aktif: {activeCalls}
              </span>
              <ThemeToggle />
              <div className="hidden text-right md:block">
                <p className="max-w-[10rem] truncate text-sm font-medium text-[var(--text)]">
                  {orgName}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted-2)]">
                  İşletme
                </p>
              </div>
              <BrandLogo href="/panel" showWordmark={false} size={36} />
            </div>
          </header>
          <main className="animate-page min-w-0 flex-1 overflow-x-hidden px-3 py-5 sm:px-6 sm:py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
