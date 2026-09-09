"use client";

import { useCallback, useEffect, useState } from "react";

import { AttentionStrip } from "@/components/dashboard/AttentionStrip";
import { CampaignSummary } from "@/components/dashboard/CampaignSummary";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { KnowledgeStatus } from "@/components/dashboard/KnowledgeStatus";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { PeriodChart } from "@/components/dashboard/PeriodChart";
import { PeriodSelector, type PeriodKey } from "@/components/dashboard/PeriodSelector";
import { QueueHealth } from "@/components/dashboard/QueueHealth";
import { BrandName } from "@/components/BrandName";
import type { Dashboard } from "@/lib/types";

const STORAGE_KEY = "aa-dash-period";

async function fetchDashboard(query: {
  period: PeriodKey;
  from: string;
  to: string;
}): Promise<Dashboard> {
  const params = new URLSearchParams({ period: query.period });
  if (query.period === "custom") {
    params.set("from", query.from);
    params.set("to", query.to);
  }
  const response = await fetch(`/api/proxy/dashboard/?${params.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("dashboard_failed");
  }
  return (await response.json()) as Dashboard;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function readStoredPeriod(): { period: PeriodKey; from: string; to: string } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { period: "today", from: daysAgoISO(6), to: todayISO() };
    const parsed = JSON.parse(raw) as { period?: PeriodKey; from?: string; to?: string };
    return {
      period: parsed.period ?? "today",
      from: parsed.from ?? daysAgoISO(6),
      to: parsed.to ?? todayISO(),
    };
  } catch {
    return { period: "today", from: daysAgoISO(6), to: todayISO() };
  }
}

function formatRate(value: number | null) {
  return value == null ? "—" : `${value}%`;
}

export function DashboardScreen() {
  const [period, setPeriod] = useState<PeriodKey>("today");
  const [customFrom, setCustomFrom] = useState(daysAgoISO(6));
  const [customTo, setCustomTo] = useState(todayISO());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    const stored = readStoredPeriod();
    setPeriod(stored.period);
    setCustomFrom(stored.from);
    setCustomTo(stored.to);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ period, from: customFrom, to: customTo }),
    );
  }, [ready, period, customFrom, customTo]);

  const load = useCallback(async () => {
    if (!ready) return;
    if (period === "custom" && (!customFrom || !customTo)) return;
    setLoading(true);
    setError("");
    try {
      const payload = await fetchDashboard({
        period,
        from: customFrom,
        to: customTo,
      });
      setData(payload);
    } catch {
      setError("Gösterge paneli yüklenemedi. Yenileyin veya tekrar giriş yapın.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [ready, period, customFrom, customTo]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!ready || (loading && !data)) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="font-sans text-sm text-[var(--danger)]">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 rounded-xl border border-[var(--line)] px-3 py-2 font-sans text-sm"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!data) return <DashboardSkeleton />;

  const periodLabel = data.period.label;

  return (
    <div className="space-y-4">
      <header className="animate-fade-up">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--signal)]">
          <BrandName>ArtificAgent</BrandName> · Ops
        </p>
        <h1 className="mt-1 font-display text-2xl font-light tracking-tight text-[var(--text)] sm:text-[1.75rem] sm:leading-tight">
          Operasyon sağlığı
        </h1>
        <p className="mt-1 max-w-xl font-sans text-sm leading-snug text-[var(--muted)]">
          Bir bakışta bugün neyin dikkat istediğini ve dönemin nasıl gittiğini görün.
        </p>
      </header>

      <AttentionStrip items={data.attention} />

      <PeriodSelector
        value={period}
        customFrom={customFrom}
        customTo={customTo}
        onChange={setPeriod}
        onCustomChange={(from, to) => {
          setCustomFrom(from);
          setCustomTo(to);
        }}
      />

      {loading ? (
        <p className="font-sans text-xs text-[var(--muted-2)]">Dönem güncelleniyor…</p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <MetricTile
          label="Çağrı"
          value={data.metrics.calls_handled.value}
          trend={data.metrics.calls_handled.trend}
          interpretation={data.metrics.calls_handled.interpretation}
          periodLabel={periodLabel}
        />
        <MetricTile
          label="Potansiyel oranı"
          value={formatRate(data.metrics.potential_rate.value)}
          trend={data.metrics.potential_rate.trend}
          interpretation={data.metrics.potential_rate.interpretation}
          periodLabel={periodLabel}
        />
        <MetricTile
          label="Transfer oranı"
          value={formatRate(data.metrics.transfer_rate.value)}
          trend={data.metrics.transfer_rate.trend}
          interpretation={data.metrics.transfer_rate.interpretation}
          periodLabel={periodLabel}
        />
        <MetricTile
          label="Dakika"
          value={`${data.metrics.minutes.consumed} / ${data.metrics.minutes.remaining}`}
          unit="dk"
          trend={data.metrics.minutes.trend}
          interpretation={data.metrics.minutes.burn_line}
          periodLabel={periodLabel}
        />
        <MetricTile
          label="Talepler"
          value={data.metrics.leads.value}
          trend={data.metrics.leads.trend}
          interpretation={data.metrics.leads.interpretation}
          periodLabel={periodLabel}
        />
      </section>

      <QueueHealth queue={data.queue} />

      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr]">
        <PeriodChart series={data.chart.series} periodLabel={periodLabel} />
        <KnowledgeStatus knowledge={data.knowledge} />
      </div>

      <CampaignSummary campaign={data.campaign} />

      {!data.campaign ? (
        <p className="font-sans text-xs text-[var(--muted-2)]">
          Kampanya özeti yalnızca çalışan veya tamamlanmış kampanya varken görünür.{" "}
          <a href="/panel/campaigns" className="text-[var(--signal)]">
            Kampanya başlat
          </a>
        </p>
      ) : null}
    </div>
  );
}
