"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { BrandLogo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";

type NavItem = { href: string; label: string };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Yapılandırma",
    items: [
      { href: "/panel/agents", label: "Ajan ayarı" },
      { href: "/panel/knowledge", label: "Bilgi bankası" },
      { href: "/panel/staff", label: "Personel durumu" },
    ],
  },
  {
    title: "İzleme",
    items: [
      { href: "/panel/live-calls", label: "Canlı çağrılar" },
      { href: "/panel/call-history", label: "Çağrı geçmişi" },
      { href: "/panel/ai-consultant", label: "AI danışman" },
      { href: "/panel/competitors", label: "Rakip analizi" },
    ],
  },
  {
    title: "Yayına alma",
    items: [
      { href: "/panel/campaigns", label: "Kampanya araması" },
      { href: "/panel/whatsapp", label: "WhatsApp bot" },
      { href: "/panel/requests", label: "Talep merkezi" },
    ],
  },
];

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function MenuIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)]">
      {children}
    </span>
  );
}

function ProfileMenu({
  displayName,
  planLabel,
  email,
  onNavigate,
}: {
  displayName: string;
  planLabel: string;
  email: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initials = initialsFrom(displayName);
  const settingsActive = pathname === "/panel/settings" || pathname.startsWith("/panel/settings/");
  const isDark = !mounted || theme === "dark";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function logout() {
    setPending(true);
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-sans text-sm text-[var(--text)] transition hover:bg-[var(--nav-hover)]";

  return (
    <div ref={rootRef} className="relative">
      {menuOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Hesap menüsü"
          className="absolute bottom-[calc(100%+0.5rem)] left-0 right-0 z-40 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel-solid)] shadow-[var(--shadow)] animate-fade-up"
        >
          <div className="flex items-center gap-3 border-b border-[var(--line)] px-3 py-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--signal)] font-sans text-xs font-semibold text-white"
              aria-hidden
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm font-medium text-[var(--text)]">{displayName}</p>
              <p className="truncate font-sans text-xs text-[var(--muted-2)]">{email || planLabel}</p>
            </div>
          </div>

          <div className="space-y-0.5 p-1.5">
            <Link
              role="menuitem"
              href="/panel/settings"
              onClick={() => {
                setMenuOpen(false);
                onNavigate?.();
              }}
              className={`${itemClass} ${settingsActive ? "bg-[var(--signal-soft)]" : ""}`}
            >
              <MenuIcon>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
                </svg>
              </MenuIcon>
              Ayarlar
            </Link>

            <div className="rounded-xl px-3 py-2.5" role="none">
              <p className="mb-2 font-sans text-[11px] font-medium tracking-[0.14em] text-[var(--muted-2)]">
                Tema
              </p>
              <div
                className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1"
                role="group"
                aria-label="Tema seçimi"
              >
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={!isDark}
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-sans text-xs font-medium transition ${
                    !isDark
                      ? "bg-[var(--panel-solid)] text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                  Açık
                </button>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isDark}
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-sans text-xs font-medium transition ${
                    isDark
                      ? "bg-[var(--panel-solid)] text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z" />
                  </svg>
                  Koyu
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--line)] p-1.5">
            <button
              role="menuitem"
              type="button"
              onClick={logout}
              disabled={pending}
              className={`${itemClass} disabled:opacity-50`}
            >
              <MenuIcon>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M10 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" />
                  <path d="M15 12H8" />
                  <path d="m15 8 4 4-4 4" />
                </svg>
              </MenuIcon>
              {pending ? "Çıkış yapılıyor…" : "Çıkış yap"}
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? menuId : undefined}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-2.5 text-left transition hover:border-[color-mix(in_srgb,var(--signal)_35%,var(--line))] hover:bg-[var(--nav-hover)]"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--signal)] font-sans text-xs font-semibold text-white"
          aria-hidden
        >
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-sans text-sm font-medium leading-snug text-[var(--text)]">
            {displayName}
          </span>
          <span className="block truncate font-sans text-xs leading-snug text-[var(--muted-2)]">
            {planLabel}
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 text-[var(--muted-2)] transition ${menuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}

function groupHasActive(group: NavGroup, pathname: string) {
  return group.items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of groups) {
      initial[group.title] = true;
    }
    return initial;
  });

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const group of groups) {
        if (groupHasActive(group, pathname)) next[group.title] = true;
      }
      return next;
    });
  }, [pathname]);

  function toggleGroup(title: string) {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  const linkClass = (active: boolean) =>
    `block border-l-[3px] px-3 py-1.5 font-sans text-sm leading-snug transition duration-200 ${
      active
        ? "border-[var(--signal)] bg-[linear-gradient(90deg,var(--signal-soft),transparent)] font-medium text-[var(--text)]"
        : "border-transparent text-[var(--muted)] hover:bg-[var(--nav-hover)] hover:text-[var(--text)]"
    }`;

  return (
    <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain py-2">
      <Link href="/panel" onClick={onNavigate} className={linkClass(pathname === "/panel")}>
        Ana sayfa
      </Link>

      {groups.map((group) => {
        const isOpen = !!openGroups[group.title];
        const panelId = `nav-group-${group.title}`;
        return (
          <div key={group.title} className="pt-0.5">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left transition hover:bg-[var(--nav-hover)]"
            >
              <span className="font-sans text-[10px] font-medium tracking-[0.04em] text-[var(--muted-2)]">
                {group.title}
              </span>
              <svg
                viewBox="0 0 24 24"
                className={`h-3.5 w-3.5 shrink-0 text-[var(--muted-2)] transition duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              id={panelId}
              role="region"
              hidden={!isOpen}
              className={isOpen ? "space-y-0" : "hidden"}
            >
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={linkClass(active)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function PanelShell({
  children,
  orgName,
  userName,
  userEmail,
  remainingMinutes,
}: {
  children: React.ReactNode;
  orgName: string;
  userName: string;
  userEmail: string;
  remainingMinutes: number | string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const minutes = Number(remainingMinutes);
  const minutePct = Math.max(4, Math.min(100, Math.round((minutes / 150) * 100)));
  const displayName = userName || orgName || "Hesap";

  const navBody = (
    <>
      <div className="shrink-0 border-b border-[var(--line)] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <BrandLogo href="/panel" showWordmark={false} size={36} />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-light tracking-tight text-[var(--text)]">
              {orgName}
            </p>
            <p className="font-sans text-[10px] tracking-[0.04em] text-[var(--muted-2)]">
              <span className="notranslate" translate="no">
                Artific agent
              </span>
            </p>
          </div>
        </div>
      </div>

      <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />

      <div className="shrink-0 space-y-2 border-t border-[var(--line)] px-2.5 py-2.5">
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--signal)_22%,var(--line))] bg-[linear-gradient(145deg,var(--signal-soft),var(--panel-solid)_70%)] px-2.5 py-2">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-sans text-[11px] font-medium tracking-[0.04em] text-[var(--signal)]">
              Kalan dakika
            </p>
            <p className="font-display text-xl font-light leading-none tracking-tight text-[var(--signal)]">
              {minutes.toFixed(1)}
              <span className="ml-1 font-sans text-[11px] font-normal opacity-70">dk</span>
            </p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-black/30">
            <div
              className="h-full rounded-full bg-[var(--signal)] transition-[width] duration-500"
              style={{ width: `${minutePct}%` }}
              title={`Bakiye: %${minutePct}`}
            />
          </div>
        </div>

        <ProfileMenu
          displayName={displayName}
          planLabel="İşletme"
          email={userEmail}
          onNavigate={() => setOpen(false)}
        />
      </div>
    </>
  );

  return (
    <div className="relative z-[1] min-h-svh bg-[var(--bg)] text-[var(--text)]">
      <div className="flex min-h-svh w-full bg-[var(--bg)]">
        <aside className="sticky top-0 hidden h-svh w-[15.5rem] shrink-0 flex-col overflow-hidden border-r border-[var(--line)] bg-[var(--sidebar)] lg:flex">
          {navBody}
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-label="Menüyü kapat"
              onClick={() => setOpen(false)}
            />
            <aside className="relative flex h-full max-h-svh w-80 flex-col overflow-hidden border-r border-[var(--line)] bg-[var(--sidebar)]">
              {navBody}
            </aside>
          </div>
        ) : null}

        <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-[var(--bg)]">
          <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--header)] px-3 py-3 lg:hidden">
            <button
              type="button"
              className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-2 font-sans text-sm"
              onClick={() => setOpen(true)}
            >
              Menü
            </button>
            <div className="min-w-0 text-right">
              <p className="truncate font-sans text-sm font-medium text-[var(--text)]">{orgName}</p>
              <p className="font-sans text-[10px] tracking-[0.14em] text-[var(--muted-2)]">
                Operasyon
              </p>
            </div>
          </div>

          <main className="animate-page min-w-0 flex-1 overflow-x-hidden bg-[var(--bg)] px-3 py-4 sm:px-5 sm:py-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
