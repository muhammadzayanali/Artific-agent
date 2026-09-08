"use client";

/** Lighter full-bleed frequency field for brand surfaces */
export function FrequencyField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden contain-paint ${className}`}
    >
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />

      <svg
        className="absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--signal)" stopOpacity="0.8" />
            <stop offset="70%" stopColor="var(--gilt)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--gilt)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="48%" r="42%">
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#coreGlow)" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            className="hero-wave"
            style={{ animationDelay: `${i * 0.5}s` }}
            d={`M-40 ${420 + i * 30} C 220 ${320 + i * 18}, 480 ${540 - i * 22}, 760 ${400 + i * 12} S 1180 ${480 - i * 16}, 1480 ${390 + i * 20}`}
            fill="none"
            stroke="url(#waveStroke)"
            strokeWidth={1.25 + i * 0.12}
            opacity={0.4 - i * 0.06}
          />
        ))}
        <circle
          className="hero-ring"
          cx="720"
          cy="430"
          r="190"
          fill="none"
          stroke="var(--signal)"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <circle
          className="hero-ring"
          style={{ animationDelay: "1.6s" }}
          cx="720"
          cy="430"
          r="270"
          fill="none"
          stroke="var(--gilt)"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
