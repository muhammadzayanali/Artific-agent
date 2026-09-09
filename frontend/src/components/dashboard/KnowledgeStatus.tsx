"use client";

import Link from "next/link";

import type { DashboardKnowledge } from "@/lib/types";

function formatSync(iso: string | null) {
  if (!iso) return "Henüz senkron yok";
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function KnowledgeStatus({ knowledge }: { knowledge: DashboardKnowledge }) {
  const ok = knowledge.last_sync_ok;
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-medium text-[var(--text)]">Ajan & bilgi durumu</h2>
        <Link href="/panel/agents" className="font-sans text-xs text-[var(--muted)] hover:text-[var(--text)]">
          Ajan Ayarı
        </Link>
      </div>
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-2.5">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[var(--muted-2)]">
              Son senkron
            </p>
            <p className="mt-0.5 font-sans text-sm text-[var(--text)]">
              {formatSync(knowledge.last_synced_at)}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 font-sans text-[11px] font-medium ${
              ok
                ? "bg-[var(--signal-soft)] text-[var(--signal)]"
                : "bg-[var(--danger-soft)] text-[var(--danger)]"
            }`}
          >
            {ok ? "Başarılı" : "Başarısız"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-2.5">
            <p className="font-sans text-[11px] text-[var(--muted-2)]">Yayında bilgi</p>
            <p className="mt-1 font-display text-lg font-light text-[var(--text)]">
              {knowledge.live_entries}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-2.5">
            <p className="font-sans text-[11px] text-[var(--muted-2)]">Onay bekleyen</p>
            <p className="mt-1 font-display text-lg font-light text-[var(--text)]">
              {knowledge.pending_entries}
            </p>
          </div>
        </div>
        {knowledge.agent_name ? (
          <p className="font-sans text-xs text-[var(--muted)]">
            {knowledge.agent_name}
            {knowledge.agent_status ? ` · ${knowledge.agent_status}` : ""}
          </p>
        ) : (
          <p className="font-sans text-xs text-[var(--muted)]">
            Ajan yok —{" "}
            <Link href="/panel/agents" className="text-[var(--signal)]">
              oluştur
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
