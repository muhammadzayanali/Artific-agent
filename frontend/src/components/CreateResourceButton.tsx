"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

function ModalShell({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-brand-xl border border-[var(--line)] bg-[var(--panel-solid)] shadow-[var(--shadow)] sm:rounded-brand-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <h3 id={titleId} className="font-display text-lg font-semibold text-[var(--text)] sm:text-xl">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] text-[var(--muted)] transition hover:text-[var(--text)]"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function CreateResourceButton({
  label,
  endpoint,
  fields,
  defaults = {},
  variant = "primary",
}: {
  label: string;
  endpoint: string;
  fields: Field[];
  defaults?: Record<string, string | number>;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const field of fields) {
      init[field.name] = String(defaults[field.name] ?? "");
    }
    return init;
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.name];
      body[field.name] = field.type === "number" ? Number(raw || 0) : raw;
    }
    const response = await fetch(`/api/proxy/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPending(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(typeof data.detail === "string" ? data.detail : "Kayıt oluşturulamadı.");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} className="shrink-0 whitespace-nowrap">
        {label}
      </Button>
      <ModalShell open={open} onClose={() => setOpen(false)} title={label}>
        <form onSubmit={submit} className="grid gap-3">
          {fields.map((field) => (
            <label key={field.name} className="grid gap-1.5 text-sm">
              <span className="text-[var(--muted)]">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  required={field.required}
                  className="theme-input min-h-[90px] w-full rounded-xl px-3 py-2"
                  value={values[field.name]}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                />
              ) : field.type === "select" ? (
                <select
                  required={field.required}
                  className="theme-input h-11 w-full rounded-xl px-3"
                  value={values[field.name]}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                >
                  {(field.options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required={field.required}
                  type={field.type === "number" ? "number" : "text"}
                  className="theme-input h-11 w-full rounded-xl px-3"
                  value={values[field.name]}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                />
              )}
            </label>
          ))}
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <div className="sticky bottom-0 -mx-5 mt-2 flex flex-col-reverse gap-2 border-t border-[var(--line)] bg-[var(--panel-solid)] px-5 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              İptal
            </Button>
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

export function ActionButton({
  label,
  endpoint,
  method = "POST",
  body = {},
  variant = "secondary",
  successMessage,
}: {
  label: string;
  endpoint: string;
  method?: "POST" | "PATCH";
  body?: Record<string, unknown>;
  variant?: "primary" | "secondary";
  successMessage?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState("");

  async function run() {
    setPending(true);
    setNote("");
    const response = await fetch(`/api/proxy/${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNote(data.detail || "İşlem başarısız.");
      return;
    }
    setNote(successMessage || data.detail || "Tamamlandı.");
    router.refresh();
  }

  return (
    <div className="inline-flex max-w-full flex-col items-stretch gap-1 sm:items-end">
      <Button variant={variant} onClick={run} disabled={pending} className="whitespace-nowrap">
        {pending ? "…" : label}
      </Button>
      {note ? <span className="text-xs text-[var(--signal)]">{note}</span> : null}
    </div>
  );
}
