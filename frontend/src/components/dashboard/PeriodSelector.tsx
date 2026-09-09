"use client";

export type PeriodKey = "today" | "7d" | "30d" | "custom";

const OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "7d", label: "7 gün" },
  { key: "30d", label: "30 gün" },
  { key: "custom", label: "Özel" },
];

export function PeriodSelector({
  value,
  customFrom,
  customTo,
  onChange,
  onCustomChange,
}: {
  value: PeriodKey;
  customFrom: string;
  customTo: string;
  onChange: (key: PeriodKey) => void;
  onCustomChange: (from: string, to: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-sans text-xs text-[var(--muted)]">
        Tüm metrikler aynı dönem için hesaplanır
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="inline-flex rounded-xl border border-[var(--line)] bg-[var(--panel-solid)] p-1"
          role="group"
          aria-label="Zaman aralığı"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className={`rounded-lg px-3 py-1.5 font-sans text-xs font-medium transition ${
                value === opt.key
                  ? "bg-[var(--signal-soft)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {value === "custom" ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => onCustomChange(e.target.value, customTo)}
              className="theme-input rounded-lg px-2 py-1.5 font-sans text-xs"
            />
            <span className="text-xs text-[var(--muted-2)]">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => onCustomChange(customFrom, e.target.value)}
              className="theme-input rounded-lg px-2 py-1.5 font-sans text-xs"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
