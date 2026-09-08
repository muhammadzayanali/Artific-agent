"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  Bot,
  Building2,
  History,
  LayoutDashboard,
  LineChart,
  Menu,
  MessageCircle,
  PhoneCall,
  Settings,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge, Button } from "@/components/ui/primitives";
import { DemoControl } from "@/components/demo/demo-control";
import { useDemoStore, selectMetrics } from "@/stores/demo-store";
import { services } from "@/services";
import { cn } from "@/lib/utils";

const nav = [
  {
    label: "Genel Bakış",
    items: [{ href: "/panel", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "İletişim",
    items: [
      { href: "/panel/live-calls", label: "Canlı Çağrılar", icon: PhoneCall, countKey: "activeCalls" as const },
      { href: "/panel/call-history", label: "Çağrı Geçmişi", icon: History },
      { href: "/panel/whatsapp", label: "WhatsApp", icon: MessageCircle, countKey: "whatsappOpen" as const },
    ],
  },
  {
    label: "AI",
    items: [
      { href: "/panel/agents", label: "Ajanlar", icon: Bot },
      { href: "/panel/knowledge-base", label: "Bilgi Bankası", icon: BookOpen },
      { href: "/panel/ai-business-consultant", label: "AI İş Danışmanı", icon: Sparkles },
    ],
  },
  {
    label: "Operasyon",
    items: [
      { href: "/panel/staff", label: "Personel", icon: Users },
      { href: "/panel/request-center", label: "Talep Merkezi", icon: Ticket, countKey: "openRequests" as const },
      { href: "/panel/campaigns", label: "Kampanya", icon: Activity },
    ],
  },
  {
    label: "Zeka",
    items: [{ href: "/panel/competitor-analysis", label: "Rakip Analizi", icon: LineChart }],
  },
  {
    label: "Yönetim",
    items: [
      { href: "/panel/settings", label: "Ayarlar", icon: Settings },
      { href: "/panel/settings#integrations", label: "Entegrasyonlar", icon: Building2 },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useDemoStore((s) => s.user);
  const hydrated = useDemoStore((s) => s.hydrated);
  const metrics = useDemoStore(selectMetrics);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const counts = useMemo(
    () => ({
      activeCalls: metrics.activeCalls,
      openRequests: metrics.openRequests,
      whatsappOpen: metrics.whatsappOpen,
    }),
    [metrics],
  );

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper-50 text-sm text-ink-500">
        Oturum doğrulanıyor…
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/panel" className="text-ink-950" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Menüyü kapat">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6 scrollbar-thin" aria-label="Panel menüsü">
        {nav.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">{group.label}</p>
            <div className="grid gap-0.5">
              {group.items.map((item) => {
                const active = item.href === "/panel" ? pathname === "/panel" : pathname.startsWith(item.href.split("#")[0]);
                const count = item.countKey ? counts[item.countKey] : 0;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
                      active ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-ink-50",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {count ? (
                      <span className={cn("rounded-full px-1.5 text-[11px]", active ? "bg-white/15" : "bg-ink-100")}>
                        {count}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-ink-100 p-4 text-xs text-ink-500">
        <p className="font-medium text-ink-800">{user.name}</p>
        <p>{user.email}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start px-0"
          onClick={() => {
            services.auth.logout();
            router.replace("/login");
          }}
        >
          Çıkış
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink-100 bg-white lg:block">{sidebar}</aside>
      {open ? (
        <div className="fixed inset-0 z-40 bg-ink-950/40 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-80 max-w-[88vw] bg-white" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      ) : null}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink-100 bg-paper-50/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg p-2 hover:bg-white lg:hidden" onClick={() => setOpen(true)} aria-label="Menüyü aç">
              <Menu className="h-5 w-5" />
            </button>
            <Badge tone="demo">DEMO ENVIRONMENT</Badge>
            <span className="hidden text-xs text-ink-500 sm:inline">Harici entegrasyonlar simüle edilir</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span className="hidden md:inline">{useDemoStore.getState().settings.companyName}</span>
            <Link href="/" className="rounded-lg px-2 py-1 hover:bg-white">
              Site
            </Link>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <DemoControl />
    </div>
  );
}
