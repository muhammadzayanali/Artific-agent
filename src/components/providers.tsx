"use client";

import { useEffect } from "react";
import { createSeedState } from "@/demo/seed";
import { useDemoStore } from "@/stores/demo-store";

export function DemoRuntime() {
  const tick = useDemoStore((s) => s.tickLiveDurations);
  const progress = useDemoStore((s) => s.progressCampaign);
  const campaigns = useDemoStore((s) => s.campaigns);
  const setHydrated = useDemoStore((s) => s.setHydrated);

  useEffect(() => {
    const finish = () => {
      const state = useDemoStore.getState();
      if (state.version !== 1) {
        const user = state.user;
        useDemoStore.setState({ ...createSeedState(), user, hydrated: true });
        return;
      }
      setHydrated(true);
    };
    const result = useDemoStore.persist.rehydrate();
    if (result && typeof result.then === "function") {
      void result.then(finish);
    } else {
      finish();
    }
  }, [setHydrated]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      tick();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [tick]);

  useEffect(() => {
    const running = campaigns.find((c) => c.status === "running" && c.pending > 0);
    if (!running) return;
    const timer = window.setInterval(() => progress(running.id), 8000);
    return () => window.clearInterval(timer);
  }, [campaigns, progress]);

  return null;
}

export function Toaster() {
  const toasts = useDemoStore((s) => s.toasts);
  const dismiss = useDemoStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;
    const last = toasts[toasts.length - 1];
    const t = window.setTimeout(() => dismiss(last.id), 3600);
    return () => window.clearTimeout(t);
  }, [toasts, dismiss]);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] grid gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto min-w-64 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm shadow-lift"
        >
          <p className="font-medium text-ink-950">{toast.title}</p>
        </div>
      ))}
    </div>
  );
}
