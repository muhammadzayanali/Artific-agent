"use client";

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Gösterge paneli yükleniyor">
      <div className="h-8 w-48 rounded-lg bg-[var(--line)]" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[var(--line)]" />
        ))}
      </div>
      <div className="h-40 rounded-2xl bg-[var(--line)]" />
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="h-48 rounded-2xl bg-[var(--line)]" />
        <div className="h-48 rounded-2xl bg-[var(--line)]" />
      </div>
    </div>
  );
}
