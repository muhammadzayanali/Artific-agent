export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 animate-fade-up">
        <p className="font-sans text-[11px] font-medium tracking-[0.04em] text-[var(--signal)]">
          <span className="notranslate" translate="no">
            Artific agent
          </span>{" "}
          · ops
        </p>
        <h1 className="mt-1 font-display text-2xl font-light tracking-tight text-[var(--text)] sm:text-[1.75rem] sm:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl font-sans text-sm leading-snug text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-brand-xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow)] backdrop-blur-xl transition duration-300 hover:brightness-[1.02] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="relative overflow-hidden p-4">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--signal-soft)] blur-2xl" />
      <p className="font-mono text-[10px] tracking-[0.04em] text-[var(--muted-2)]">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
        {value}
      </p>
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "live" | "ok" | "warn" | "danger";
}) {
  const tones = {
    neutral: "bg-[var(--nav-hover)] text-[var(--muted)] ring-[var(--line)]",
    live: "bg-[var(--signal-soft)] text-[var(--signal)] ring-[color-mix(in_srgb,var(--signal)_30%,transparent)]",
    ok: "bg-[var(--signal-soft)] text-[var(--signal)] ring-[color-mix(in_srgb,var(--signal)_30%,transparent)]",
    warn: "bg-[var(--gilt-soft)] text-[var(--gilt)] ring-[color-mix(in_srgb,var(--gilt)_30%,transparent)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)] ring-[color-mix(in_srgb,var(--danger)_30%,transparent)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="grid place-items-center p-14 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-[color-mix(in_srgb,var(--signal)_25%,transparent)] bg-[var(--signal-soft)]">
        <span className="h-2.5 w-2.5 animate-pulse-soft rounded-full bg-[var(--signal)]" />
      </div>
      <p className="font-display text-xl font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </Card>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const variants = {
    primary:
      "bg-[var(--text)] text-[var(--bg)] hover:opacity-90 shadow-[var(--shadow)]",
    secondary:
      "border border-[var(--line)] bg-[var(--panel-solid)] text-[var(--text)] hover:border-[color-mix(in_srgb,var(--signal)_40%,transparent)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)] ring-1 ring-[color-mix(in_srgb,var(--danger)_20%,transparent)] hover:brightness-110",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-brand px-4 py-2.5 text-sm font-medium transition duration-200 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
