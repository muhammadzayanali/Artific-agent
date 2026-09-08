import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink-950 text-white hover:bg-ink-800",
        variant === "secondary" && "border border-ink-200 bg-white text-ink-900 hover:bg-ink-50",
        variant === "ghost" && "text-ink-700 hover:bg-ink-50",
        variant === "danger" && "bg-danger-600 text-white hover:bg-danger-500",
        variant === "gold" && "bg-gold-600 text-white hover:bg-gold-700",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-5",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-ink-100 bg-white shadow-card", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "live" | "alert" | "danger" | "gold" | "demo";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-ink-50 text-ink-700",
        tone === "live" && "bg-live-100 text-live-600",
        tone === "alert" && "bg-alert-100 text-alert-600",
        tone === "danger" && "bg-danger-100 text-danger-600",
        tone === "gold" && "bg-gold-100 text-gold-700",
        tone === "demo" && "bg-ink-950 text-gold-400",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-ink-900",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-ink-800">{label}</span>
      {children}
      {hint ? <span className="text-xs text-ink-500">{hint}</span> : null}
    </label>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">{eyebrow}</p> : null}
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink-950">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
      <p className="font-medium text-ink-900">{title}</p>
      <p className="mt-2 max-w-md text-sm text-ink-500">{body}</p>
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/50 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-serif text-xl text-ink-950">
            {title}
          </h2>
          <button type="button" className="rounded-lg px-2 py-1 text-sm text-ink-500 hover:bg-ink-50" onClick={onClose}>
            Kapat
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function StatusDot({ tone }: { tone: "live" | "alert" | "danger" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        tone === "live" && "bg-live-500",
        tone === "alert" && "bg-alert-500",
        tone === "danger" && "bg-danger-500",
        tone === "neutral" && "bg-ink-400",
      )}
    />
  );
}
