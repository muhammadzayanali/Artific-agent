"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemoStore } from "@/stores/demo-store";

export default function WhatsAppIndexPage() {
  const first = useDemoStore((s) => s.conversations[0]?.id);
  const router = useRouter();
  useEffect(() => {
    if (first) router.replace(`/panel/whatsapp/${first}`);
  }, [first, router]);
  return <p className="text-sm text-ink-500">WhatsApp gelen kutusu açılıyor…</p>;
}
