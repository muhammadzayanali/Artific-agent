"use client";

import Link from "next/link";

import type { DashboardCampaign } from "@/lib/types";

export function CampaignSummary({ campaign }: { campaign: DashboardCampaign | null }) {
  if (!campaign) return null;

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-medium text-[var(--text)]">Kampanya özeti</h2>
          <p className="mt-0.5 font-sans text-xs text-[var(--muted)]">{campaign.name}</p>
        </div>
        <Link href="/panel/campaigns" className="font-sans text-xs text-[var(--muted)] hover:text-[var(--text)]">
          Kampanyalar
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-3">
          <p className="font-sans text-[11px] text-[var(--muted-2)]">Hedef</p>
          <p className="mt-1 font-display text-lg font-light text-[var(--text)]">{campaign.targets}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-3">
          <p className="font-sans text-[11px] text-[var(--muted-2)]">Bağlantı oranı</p>
          <p className="mt-1 font-display text-lg font-light text-[var(--text)]">
            {campaign.connect_rate == null ? "—" : `${campaign.connect_rate}%`}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-3">
          <p className="font-sans text-[11px] text-[var(--muted-2)]">Dönüşüm</p>
          <p className="mt-1 font-display text-lg font-light text-[var(--text)]">
            {campaign.conversion_rate == null ? "—" : `${campaign.conversion_rate}%`}
          </p>
        </div>
      </div>
    </section>
  );
}
