import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-paper-50 px-5 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Logo />
        <h1 className="font-serif text-4xl">Platform</h1>
        <p className="text-ink-600">
          ArtificAgent, rutin iletişimi otomatikleştiren ve kritik anlarda insan denetimini koruyan bir operasyon
          merkezidir. AI yanıtları bilgiye bağlıdır; özel fiyat ve şikayet gibi durumlar yetkili personele geçer.
        </p>
        <p className="text-ink-600">
          Müşteri → ses / WhatsApp → ajan → bilgi → otomatik eylem → risk → insan → talep → analitik.
        </p>
        <Link href="/request-demo" className="inline-block underline">
          Demo talep et
        </Link>
      </div>
    </div>
  );
}
