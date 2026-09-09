"use client";

import { useMemo, useState } from "react";

import { Card, EmptyState } from "@/components/ui";
import { formatTime } from "@/lib/format";
import type { AnalysisReport } from "@/lib/types";

export function AnalysisWorkspace({ reports }: { reports: AnalysisReport[] }) {
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? null);
  const selected = useMemo(
    () => reports.find((r) => r.id === selectedId) || reports[0],
    [reports, selectedId],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <p className="text-xs tracking-[0.14em] text-[var(--muted-2)]">Analiz raporları</p>
        {reports.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Henüz rapor yok"
              body="Hemen analiz et butonuyla ilk raporunuzu oluşturabilirsiniz."
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {reports.map((report) => {
              const active = selected?.id === report.id;
              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedId(report.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-[color-mix(in_srgb,var(--signal)_40%,transparent)] bg-[var(--signal-soft)]"
                      : "border-[var(--line)] hover:bg-[var(--nav-hover)]"
                  }`}
                >
                  <p className="font-medium text-[var(--text)]">{report.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{formatTime(report.created_at)}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{report.summary}</p>
                </button>
              );
            })}
          </div>
        )}
      </Card>
      <Card className="p-5">
        <p className="text-xs tracking-[0.14em] text-[var(--muted-2)]">Rapor önizleme</p>
        {selected ? (
          <div className="mt-4 space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text)]">{selected.title}</h2>
            <p className="text-sm text-[var(--muted)]">{selected.summary}</p>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-4">
              <p className="text-xs tracking-wide text-[var(--muted-2)]">Öneriler</p>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-[var(--text)]">
                {selected.recommendations}
              </pre>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="Rapor seçilmedi"
              body="Soldan bir rapor seçin veya yukarıdan yeni analiz başlatın."
            />
          </div>
        )}
      </Card>
    </div>
  );
}
