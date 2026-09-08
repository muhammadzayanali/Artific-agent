"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  { value: "", label: "All" },
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
  { value: "missed", label: "Missed" },
];

export function InboxFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("status") ?? "";

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter conversations">
      {filters.map((filter) => {
        const active = current === filter.value;
        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => {
              const next = new URLSearchParams(params.toString());
              if (filter.value) next.set("status", filter.value);
              else next.delete("status");
              router.replace(`/panel${next.toString() ? `?${next}` : ""}`);
            }}
            className={`rounded-full px-3 py-1.5 text-sm ring-1 transition ${
              active
                ? "bg-[var(--text)] text-[var(--bg)] ring-[var(--text)]"
                : "bg-[var(--panel-solid)] text-[var(--muted)] ring-[var(--line)] hover:bg-[var(--nav-hover)] hover:text-[var(--text)]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
