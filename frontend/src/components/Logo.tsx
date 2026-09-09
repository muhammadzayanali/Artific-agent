import Image from "next/image";
import Link from "next/link";

import { BrandName } from "@/components/BrandName";

type BrandLogoProps = {
  href?: string | null;
  showWordmark?: boolean;
  size?: number;
  className?: string;
  priority?: boolean;
};

/** Official Artific agent mark (black squircle + white glyph). */
export function BrandLogo({
  href = "/",
  showWordmark = true,
  size = 36,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const mark = (
    <Image
      src="/logo.png"
      alt="Artific agent"
      width={size}
      height={size}
      priority={priority}
      className="shrink-0 rounded-[22%]"
    />
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {showWordmark ? (
        <BrandName className="font-display text-[0.95rem] font-semibold tracking-tight text-[var(--text)]">
          Artific <span className="text-[var(--signal)]">agent</span>
        </BrandName>
      ) : null}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center transition hover:opacity-90">
      {content}
    </Link>
  );
}

/** Inline SVG mark for favicon-sized places without image decode cost */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="64" height="64" rx="14" fill="#0A0A0A" />
      <path
        d="M18.5 46.5L36.2 16.8h8.6L27.1 46.5H18.5Z"
        fill="#FFFFFF"
      />
      <path
        d="M34.2 39.8L43.8 23.2h8.2L42.4 39.8H34.2Z"
        fill="#FFFFFF"
      />
      <circle cx="46.8" cy="45.2" r="3.4" fill="#FFFFFF" />
    </svg>
  );
}
