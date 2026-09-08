export default function PanelLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-36 rounded-brand-xl bg-[var(--panel)]" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-brand-xl bg-[var(--panel)]" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="h-64 rounded-brand-xl bg-[var(--panel)]" />
        <div className="h-64 rounded-brand-xl bg-[var(--panel)]" />
      </div>
    </div>
  );
}
