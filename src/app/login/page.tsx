"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Badge, Button, Field, Input } from "@/components/ui/primitives";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/demo/seed";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useDemoStore((s) => s.hydrated);
  const user = useDemoStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace("/panel");
  }, [hydrated, user, router]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = services.auth.login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Giriş başarısız");
      return;
    }
    router.push("/panel");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-ink-950 text-white lg:flex lg:flex-col lg:justify-between p-12">
        <Logo className="text-white" />
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">Operations Center</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight">Yönetilen AI iletişim altyapısı</h1>
          <p className="mt-4 text-white/70">
            Ses ve WhatsApp operasyonunu bilgiye bağlı AI, insan aktarımı ve denetimle aynı merkezden yönetin.
          </p>
        </div>
        <p className="text-sm text-white/40">Less Artificial. More Intelligence.</p>
      </section>
      <section className="grid place-items-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <Badge tone="demo">DEMO ENVIRONMENT</Badge>
          <h2 className="mt-4 font-serif text-3xl text-ink-950">Müşteri girişi</h2>
          <p className="mt-2 text-sm text-ink-500">
            AI çağrı asistanlarınızı, hatlarınızı ve müşteri görüşmelerini tek merkezden yönetin.
          </p>
          <form className="mt-8 grid gap-4" onSubmit={submit}>
            <Field label="E-posta">
              <Input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Şifre">
              <Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            {error ? <p className="text-sm text-danger-600">{error}</p> : null}
            <Button type="submit" size="lg">
              Giriş Yap
            </Button>
            <Button
              type="button"
              variant="gold"
              size="lg"
              onClick={() => {
                setEmail(DEMO_EMAIL);
                setPassword(DEMO_PASSWORD);
                services.auth.loginDemo();
                router.push("/panel");
              }}
            >
              Demo Account
            </Button>
          </form>
          <p className="mt-6 text-xs text-ink-400">
            Demo kimlik: {DEMO_EMAIL} · {DEMO_PASSWORD}
          </p>
        </div>
      </section>
    </div>
  );
}
