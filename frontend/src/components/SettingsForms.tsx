"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";
import type { Profile } from "@/lib/types";

export function SettingsForms({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [authorizedName, setAuthorizedName] = useState(profile.authorized_name || "");
  const [mobilePhone, setMobilePhone] = useState(profile.mobile_phone || "");
  const [aiLine, setAiLine] = useState(profile.ai_line || "");
  const [goldSource, setGoldSource] = useState(profile.gold_price_source || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  async function saveProfile() {
    setPending(true);
    setErr("");
    setMsg("");
    const response = await fetch("/api/proxy/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorized_name: authorizedName,
        mobile_phone: mobilePhone,
        ai_line: aiLine,
        gold_price_source: goldSource,
      }),
    });
    setPending(false);
    if (!response.ok) {
      setErr("Profil güncellenemedi.");
      return;
    }
    setMsg("İşletme bilgileri kaydedildi.");
    router.refresh();
  }

  async function changePassword() {
    setPending(true);
    setErr("");
    setMsg("");
    const response = await fetch("/api/proxy/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setErr(data.detail || "Şifre güncellenemedi.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMsg("Şifre güncellendi.");
  }

  async function requestMinutes() {
    setPending(true);
    setErr("");
    const response = await fetch("/api/proxy/profile/minutes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes: 100 }),
    });
    const data = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setErr(data.detail || "Talep başarısız.");
      return;
    }
    setMsg(data.detail || "Dakika paketi eklendi.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-brand-xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
        <p className="text-sm font-medium text-[var(--text)]">İşletme bilgileri</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">İşletme adı</span>
            <input
              disabled
              className="theme-input h-11 rounded-xl px-3 opacity-70"
              value={profile.organization_name}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Yetkili adı</span>
            <input
              className="theme-input h-11 rounded-xl px-3"
              value={authorizedName}
              onChange={(e) => setAuthorizedName(e.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Cep telefonu</span>
            <input
              className="theme-input h-11 rounded-xl px-3"
              value={mobilePhone}
              onChange={(e) => setMobilePhone(e.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Sabit hat (AI hattı)</span>
            <input
              className="theme-input h-11 rounded-xl px-3"
              value={aiLine}
              onChange={(e) => setAiLine(e.target.value)}
            />
          </label>
        </div>
        <label className="mt-3 grid gap-1.5 text-sm">
          <span className="text-[var(--muted)]">Altın fiyat kaynağı</span>
          <input
            className="theme-input h-11 rounded-xl px-3"
            value={goldSource}
            onChange={(e) => setGoldSource(e.target.value)}
          />
        </label>
        <Button className="mt-4" onClick={saveProfile} disabled={pending}>
          Bilgileri kaydet
        </Button>
      </div>

      <div className="rounded-brand-xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
        <p className="text-sm font-medium text-[var(--text)]">Şifre değiştir</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="password"
            placeholder="Mevcut şifre"
            className="theme-input h-11 rounded-xl px-3 text-sm"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Yeni şifre"
            className="theme-input h-11 rounded-xl px-3 text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <Button className="mt-4" variant="secondary" onClick={changePassword} disabled={pending}>
          Şifreyi güncelle
        </Button>
      </div>

      <div className="rounded-brand-xl border border-[var(--line)] bg-[var(--panel)] p-6 text-center shadow-[var(--shadow)]">
        <p className="text-xs tracking-[0.14em] text-[var(--muted-2)]">Dakika bakiyesi</p>
        <p className="mt-3 text-5xl font-semibold text-[var(--signal)]">
          {Number(profile.remaining_minutes).toFixed(1)}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">dakika kaldı</p>
        <Button className="mt-5 w-full" onClick={requestMinutes} disabled={pending}>
          Dakika paketi talep et (+100)
        </Button>
      </div>

      {msg ? <p className="text-sm text-[var(--signal)]">{msg}</p> : null}
      {err ? <p className="text-sm text-[var(--danger)]">{err}</p> : null}
    </div>
  );
}
