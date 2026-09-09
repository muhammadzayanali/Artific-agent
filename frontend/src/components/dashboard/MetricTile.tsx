"use client";

import type { DashboardTrend } from "@/lib/types";

function TrendChip({ trend }: { trend: DashboardTrend }) {
  const color =
    trend.direction === "up"
      ? "text-[var(--signal)]"
      : trend.direction === "down"
        ? "text-[var(--danger)]"
        : "text-[var(--muted-2)]";
  const arrow = trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";
  return (
    <span className={`inline-flex items-center gap-1 font-sans text-[11px] ${color}`}>
      <span aria-hidden>{arrow}</span>
      {trend.label}
    </span>
  );
}

export function MetricTile({
  label,
  value,
  unit,
  trend,
  interpretation,
  periodLabel,
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend: DashboardTrend;
  interpretation?: string;
  periodLabel: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-2">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted-2)]">
          {label}
        </p>
        <span className="rounded-full border border-[var(--line)] px-2 py-0.5 font-sans text-[10px] text-[var(--muted-2)]">
          {periodLabel}
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-light tracking-tight text-[var(--text)]">
        {value}
        {unit ? <span className="ml-1 font-sans text-sm text-[var(--muted)]">{unit}</span> : null}
      </p>
      <div className="mt-2">
        <TrendChip trend={trend} />
      </div>
      {interpretation ? (
        <p className="mt-2 font-sans text-xs leading-snug text-[var(--muted)]">{interpretation}</p>
      ) : null}
    </article>
  );
}
