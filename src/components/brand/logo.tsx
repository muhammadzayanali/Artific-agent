export function LogoMark({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 168 88" fill="currentColor" aria-hidden="true" className={className}>
      <polygon points="75,8 111,8 43,80 8,80" />
      <polygon points="117,8 151,8 43,80 8,80" opacity="0" />
      <polygon points="117,8 151,8 101,64 69,64" />
      <circle cx="144" cy="44" r="17" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-5 w-auto shrink-0" />
      <span className="text-[1.05rem] font-semibold leading-none tracking-tight">ArtificAgent</span>
    </span>
  );
}
