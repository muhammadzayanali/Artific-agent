"use client";

import Link from "next/link";

import type { DashboardAttentionItem } from "@/lib/types";

export function AttentionStrip({ items }: { items: DashboardAttentionItem[] }) {
  if (!items?.length) return null;

  return (
    <section aria-label="Dikkat gerekenler" className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 transition hover:opacity-95 ${
            item.severity === "red"
              ? "border-[color-mix(in_srgb,var(--danger)_35%,var(--line))] bg-[var(--danger-soft)]"
              : "border-[color-mix(in_srgb,var(--gilt)_40%,var(--line))] bg-[var(--gilt-soft)]"
          }`}
        >
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
              item.severity === "red" ? "bg-[var(--danger)]" : "bg-[var(--gilt)]"
            }`}
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-sm font-medium text-[var(--text)]">{item.title}</span>
            <span className="mt-0.5 block font-sans text-xs leading-snug text-[var(--muted)]">
              {item.body}
            </span>
          </span>
          <span className="shrink-0 self-center font-sans text-xs text-[var(--muted-2)]">Aç →</span>
        </Link>
      ))}
    </section>
  );
}
