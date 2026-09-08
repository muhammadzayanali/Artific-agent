"use client";

import { FormEvent, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button, Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { uid } from "@/lib/utils";
import { useDemoStore } from "@/stores/demo-store";

export default function RequestDemoPage() {
  const addLead = useDemoStore((s) => s.addLead);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    companySize: "11-50",
    useCase: "inbound",
    message: "",
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email.includes("@") || !form.company) return;
    addLead({ ...form, id: uid("lead"), createdAt: new Date().toISOString() });
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-paper-50 px-5 py-10">
      <div className="mx-auto max-w-xl">
        <Logo />
        <h1 className="mt-10 font-serif text-4xl">Request a Demo</h1>
        {sent ? (
          <p className="mt-6 rounded-2xl bg-live-100 px-4 py-4 text-live-600">
            Demo talebi alındı. Ekibimiz kısa süre içinde sizinle iletişime geçecek.
          </p>
        ) : (
          <form className="mt-8 grid gap-4" onSubmit={submit}>
            <Field label="Ad">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Şirket">
              <Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
            <Field label="E-posta">
              <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Telefon">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Şirket ölçeği">
              <Select value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>200+</option>
              </Select>
            </Field>
            <Field label="Kullanım senaryosu">
              <Select value={form.useCase} onChange={(e) => setForm({ ...form, useCase: e.target.value })}>
                <option value="inbound">Gelen çağrı</option>
                <option value="outbound">Kampanya</option>
                <option value="whatsapp">WhatsApp</option>
              </Select>
            </Field>
            <Field label="Mesaj">
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </Field>
            <Button type="submit">Gönder</Button>
          </form>
        )}
      </div>
    </div>
  );
}
