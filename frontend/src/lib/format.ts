export function formatTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDuration(seconds: number, live = false) {
  if (live) return "Canlı";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export function outcomeLabel(outcome: string) {
  const labels: Record<string, string> = {
    appointment: "Randevu",
    information: "Bilgi",
    handoff: "Aktarım",
    follow_up: "Takip",
    missed: "Cevapsız",
    in_progress: "Devam ediyor",
  };
  return labels[outcome] ?? outcome;
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    live: "Canlı",
    ended: "Tamamlandı",
    missed: "Cevapsız",
    failed: "Hatalı",
    new: "Yeni",
    in_progress: "İşlemde",
    completed: "Tamamlandı",
    cancelled: "İptal",
    available: "Müsait",
    busy: "Meşgul",
    offline: "Çevrimdışı",
    live_kb: "Yayında",
    pending: "Onay bekliyor",
    draft: "Taslak",
  };
  return labels[status] ?? status;
}
