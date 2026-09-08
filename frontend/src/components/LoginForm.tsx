"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("demo@artificagent.com");
  const [password, setPassword] = useState("DemoPass123!");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.detail ?? "Invalid email or password.");
        return;
      }
      router.replace(searchParams.get("next") || "/panel");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Is the API running?");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-ink-900">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-brand border border-ink-900/15 bg-white px-3 outline-none ring-electric-600/30 focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-ink-900">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-brand border border-ink-900/15 bg-white px-3 outline-none ring-electric-600/30 focus:ring-2"
        />
      </label>
      {error ? (
        <p role="alert" className="rounded-brand bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-brand bg-[var(--signal)] font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
