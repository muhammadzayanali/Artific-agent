"use client";

import Link from "next/link";

import type { DashboardQueue } from "@/lib/types";

export function QueueHealth({ queue }: { queue: DashboardQueue }) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-medium text-[var(--text)]">Talep kuyruğu</h2>
        <Link href="/panel/requests" className="font-sans text-xs text-[var(--muted)] hover:text-[var(--text)]">
          Talep merkezi
        </Link>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-3">
          <p className="font-sans text-[11px] tracking-[0.12em] text-[var(--muted-2)]">
            Şimdi aksiyon
          </p>
          <p className="mt-1 font-display text-xl font-light text-[var(--signal)]">
            {queue.actionable_now}
          </p>
          <p className="mt-1 font-sans text-xs text-[var(--muted)]">Geçerli telefonu olan açık talepler</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-3">
          <p className="font-sans text-[11px] tracking-[0.12em] text-[var(--muted-2)]">
            İnceleme gerekli
          </p>
          <p className="mt-1 font-display text-xl font-light text-[var(--gilt)]">{queue.needs_review}</p>
          <p className="mt-1 font-sans text-xs text-[var(--muted)]">Telefon eksik / geçersiz</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-3">
          <p className="font-sans text-[11px] tracking-[0.12em] text-[var(--muted-2)]">
            En eski açık
          </p>
          {queue.oldest ? (
            <>
              <p className="mt-1 truncate font-sans text-sm font-medium text-[var(--text)]">
                {queue.oldest.title}
              </p>
              <p className="mt-1 font-sans text-xs text-[var(--muted)]">
                {queue.oldest.age_hours} saattir bekliyor
              </p>
              <Link
                href="/panel/requests"
                className="mt-2 inline-block font-sans text-xs text-[var(--signal)]"
              >
                İncele →
              </Link>
            </>
          ) : (
            <p className="mt-2 font-sans text-sm text-[var(--muted)]">Açık talep yok</p>
          )}
        </div>
      </div>
    </section>
  );
}
