"use client";

import { useMemo, useState } from "react";

import type { DashboardChartPoint } from "@/lib/types";

export function PeriodChart({
  series,
  periodLabel,
}: {
  series: DashboardChartPoint[];
  periodLabel: string;
}) {
  const [showPotential, setShowPotential] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);

  const maxCalls = useMemo(
    () => Math.max(...series.map((d) => d.calls), 1),
    [series],
  );

  if (!series.length) {
    return (
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
        <h2 className="font-display text-sm font-medium text-[var(--text)]">Çağrı trendi</h2>
        <p className="mt-4 font-sans text-sm text-[var(--muted)]">
          Bu dönemde çağrı yok. Asistan hattını ve kampanyaları kontrol edin.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-medium text-[var(--text)]">Çağrı trendi</h2>
          <p className="mt-0.5 font-sans text-xs text-[var(--muted)]">{periodLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={showPotential}
              onChange={(e) => setShowPotential(e.target.checked)}
            />
            Potansiyel
          </label>
          <label className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={showTransfer}
              onChange={(e) => setShowTransfer(e.target.checked)}
            />
            Transfer
          </label>
        </div>
      </div>

      <div className="mt-5 flex h-44 items-end gap-1.5 sm:gap-2">
        {series.map((day) => (
          <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="relative flex h-36 w-full items-end justify-center gap-0.5">
              <div
                className="w-full max-w-[1.25rem] rounded-t-md bg-[linear-gradient(to_top,var(--signal),color-mix(in_srgb,var(--signal)_50%,white))]"
                style={{ height: `${Math.max((day.calls / maxCalls) * 100, day.calls ? 6 : 2)}%` }}
                title={`${day.calls} çağrı`}
              />
              {showPotential ? (
                <div
                  className="absolute bottom-0 left-1/2 h-1 w-1.5 -translate-x-1/2 rounded-full bg-[var(--gilt)]"
                  style={{
                    bottom: `${Math.max((day.potential / maxCalls) * 100, 0)}%`,
                    opacity: day.potential ? 1 : 0.2,
                  }}
                  title={`${day.potential} potansiyel`}
                />
              ) : null}
              {showTransfer ? (
                <div
                  className="absolute bottom-0 right-0 h-1 w-1.5 rounded-full bg-[var(--danger)]"
                  style={{
                    bottom: `${Math.max((day.transfer / maxCalls) * 100, 0)}%`,
                    opacity: day.transfer ? 1 : 0.2,
                  }}
                  title={`${day.transfer} transfer`}
                />
              ) : null}
            </div>
            <span className="font-sans text-[10px] text-[var(--muted-2)]">{day.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
