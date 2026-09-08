import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-paper-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Logo />
        <h1 className="mt-10 font-serif text-4xl">Özellikler</h1>
        <ul className="mt-6 space-y-3 text-ink-600">
          <li>Canlı çağrı denetimi ve transkript</li>
          <li>Politika temelli insan aktarımı</li>
          <li>Bilgi bankası ve ajan senkronu</li>
          <li>Talep merkezi ve personel yetkisi</li>
          <li>WhatsApp gelen kutusu</li>
          <li>Kampanya auto-dialer</li>
          <li>İş danışmanı ve rakip analizi</li>
        </ul>
        <Link href="/login" className="mt-8 inline-block text-sm underline">
          Operasyon merkezini aç
        </Link>
      </div>
    </div>
  );
}
