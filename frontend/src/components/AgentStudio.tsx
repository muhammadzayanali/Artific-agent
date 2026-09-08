"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Badge, Button, Card } from "@/components/ui";
import type { Agent } from "@/lib/types";

const TOOL_OPTIONS = [
  { id: "knowledge", label: "Bilgi Bankası" },
  { id: "transfer", label: "Personel Aktarımı" },
  { id: "appointment", label: "Randevu" },
  { id: "price_lookup", label: "Fiyat Sorgusu" },
  { id: "whatsapp", label: "WhatsApp Özeti" },
];

export function AgentStudio({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [name, setName] = useState(agent.name);
  const [status, setStatus] = useState(agent.status);
  const [mode, setMode] = useState(agent.mode);
  const [greeting, setGreeting] = useState(agent.greeting || agent.main_goal || "");
  const [instructions, setInstructions] = useState(agent.instructions || "");
  const [mainGoal, setMainGoal] = useState(agent.main_goal || "");
  const [voiceLabel, setVoiceLabel] = useState(agent.voice_label || "");
  const [speakingStyle, setSpeakingStyle] = useState(agent.speaking_style || "");
  const [tools, setTools] = useState<string[]>(agent.tools_enabled || []);
  const [sampleUrl, setSampleUrl] = useState(agent.voice_sample_url);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function toggleTool(id: string) {
    setTools((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function saveConfig() {
    setSaving(true);
    setError("");
    setMessage("");
    const response = await fetch(`/api/proxy/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        status,
        mode,
        greeting,
        instructions,
        main_goal: mainGoal,
        voice_label: voiceLabel,
        speaking_style: speakingStyle,
        tools_enabled: tools,
        languages: agent.languages.length ? agent.languages : ["Türkçe"],
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.detail || "Kayıt başarısız.");
      setSaving(false);
      return;
    }
    setMessage("Ajan ayarları kaydedildi.");
    setSaving(false);
    router.refresh();
  }

  async function syncAgent() {
    setSaving(true);
    setError("");
    const response = await fetch(`/api/proxy/agents/${agent.id}/sync`, { method: "POST", body: "{}" });
    setSaving(false);
    if (!response.ok) {
      setError("Senkronizasyon başarısız.");
      return;
    }
    setMessage("Ajan bilgi bankası ve araçlarla senkronize edildi.");
    setStatus("active");
    router.refresh();
  }

  async function uploadBlob(blob: Blob, filename: string) {
    const form = new FormData();
    form.append("voice_sample", blob, filename);
    const response = await fetch(`/api/proxy/agents/${agent.id}/voice`, {
      method: "POST",
      body: form,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || "Ses yüklenemedi.");
    }
    const data = await response.json();
    setSampleUrl(data.voice_sample_url);
    setMessage("Ses örneği kaydedildi. Ajan bu tonu kullanacak.");
    router.refresh();
  }

  async function startRecording() {
    setError("");
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const ext = type.includes("mp4") ? "mp4" : "webm";
        try {
          await uploadBlob(blob, `voice-sample.${ext}`);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Ses yüklenemedi.");
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Mikrofon izni gerekli. Tarayıcı ayarlarından izin verin.");
    }
  }

  function stopRecording() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      await uploadBlob(file, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ses yüklenemedi.");
    }
  }

  const line =
    agent.lines.find((l) => l.is_primary)?.number || agent.lines[0]?.number || "Hat yok";

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--signal)]">
                Ajan stüdyosu
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text)]">
                {agent.name}
              </h2>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                agent_demo_{agent.id} · {line}
              </p>
            </div>
            <Badge tone={status === "active" ? "live" : "warn"}>
              {status === "active" ? "Aktif" : status === "paused" ? "Duraklatıldı" : "Kurulum"}
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              <span className="text-[var(--muted)]">Ajan adı</span>
              <input
                className="theme-input h-11 rounded-xl px-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-[var(--muted)]">Durum</span>
              <select
                className="theme-input h-11 rounded-xl px-3"
                value={status}
                onChange={(e) => setStatus(e.target.value as Agent["status"])}
              >
                <option value="active">Aktif</option>
                <option value="paused">Duraklatıldı</option>
                <option value="setup">Kurulum</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-[var(--muted)]">Mod</span>
              <select
                className="theme-input h-11 rounded-xl px-3"
                value={mode}
                onChange={(e) => setMode(e.target.value as Agent["mode"])}
              >
                <option value="voice">Ses</option>
                <option value="voice_chat">Ses + Chat</option>
                <option value="chat">Chat</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-[var(--muted)]">Ses profili</span>
              <input
                className="theme-input h-11 rounded-xl px-3"
                value={voiceLabel}
                onChange={(e) => setVoiceLabel(e.target.value)}
              />
            </label>
          </div>

          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Ana görev</span>
            <input
              className="theme-input h-11 rounded-xl px-3"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
            />
          </label>

          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Açılış karşılama cümlesi</span>
            <textarea
              className="theme-input min-h-[88px] rounded-xl px-3 py-2.5"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
            />
          </label>

          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Davranış talimatları</span>
            <textarea
              className="theme-input min-h-[120px] rounded-xl px-3 py-2.5"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </label>

          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Konuşma stili</span>
            <input
              className="theme-input h-11 rounded-xl px-3"
              value={speakingStyle}
              onChange={(e) => setSpeakingStyle(e.target.value)}
            />
          </label>

          <div className="mt-5">
            <p className="text-sm text-[var(--muted)]">Yetenekler & araçlar</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOOL_OPTIONS.map((tool) => {
                const on = tools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    className={`rounded-xl px-3 py-2 text-sm ring-1 transition ${
                      on
                        ? "bg-[var(--signal-soft)] text-[var(--signal)] ring-[color-mix(in_srgb,var(--signal)_35%,transparent)]"
                        : "bg-[var(--panel-solid)] text-[var(--muted)] ring-[var(--line)]"
                    }`}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={saveConfig} disabled={saving}>
              {saving ? "Kaydediliyor…" : "Ayarları Kaydet"}
            </Button>
            <Button variant="secondary" onClick={syncAgent} disabled={saving}>
              Ajanı Senkronize Et
            </Button>
          </div>
          {message ? <p className="mt-3 text-sm text-[var(--signal)]">{message}</p> : null}
          {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--gilt)]">
            Ses kaydı
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-[var(--text)]">
            Ajan ses örneği
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            Mikrofonla karşılama tonunuzu kaydedin veya bir ses dosyası yükleyin. Demo ortamında
            örnek ajan bu kaydı referans alır.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!recording ? (
              <Button onClick={startRecording}>Kaydı Başlat</Button>
            ) : (
              <Button variant="danger" onClick={stopRecording}>
                Durdur · {seconds}s
              </Button>
            )}
            <label className="inline-flex h-11 cursor-pointer items-center rounded-brand border border-[var(--line)] bg-[var(--panel-solid)] px-4 text-sm font-medium text-[var(--text)]">
              Dosya yükle
              <input type="file" accept="audio/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>

          {recording ? (
            <div className="mt-5 flex items-end gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-[var(--signal)]"
                  style={{
                    height: `${10 + ((i * 7 + seconds * 3) % 28)}px`,
                    opacity: 0.45 + (i % 5) * 0.1,
                  }}
                />
              ))}
            </div>
          ) : null}

          {sampleUrl ? (
            <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-2)]">Kayıtlı örnek</p>
              <audio className="mt-3 w-full" controls src={sampleUrl} preload="metadata" />
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--muted-2)]">Henüz ses örneği yok.</p>
          )}
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-[var(--text)]">Canlı durum</p>
          <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <p>Diller: {agent.languages.join(", ") || "Türkçe"}</p>
            <p>Canlı çağrı: {agent.live_call_count}</p>
            <p>Hat: {line}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
