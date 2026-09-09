import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#050507",
          900: "#0A0A0C",
          850: "#0E0E11",
          800: "#141418",
          700: "#1C1C22",
          600: "#2A2A33",
        },
        signal: {
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        aurora: {
          300: "#7DD3FC",
          400: "#38BDF8",
        },
        gilt: {
          300: "#E8D5A3",
          400: "#D4B56A",
          500: "#C9A962",
        },
        mist: {
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
        },
      },
      fontFamily: {
        display: [
          "var(--font-inter)",
          "Inter",
          "Inter Fallback",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-inter)",
          "Inter",
          "Inter Fallback",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        brand: "0.9rem",
        "brand-xl": "1.4rem",
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 18px 50px rgba(0,0,0,0.45)",
        lift: "0 12px 40px rgba(0,0,0,0.35)",
        signal: "0 0 0 1px rgba(16,185,129,0.25), 0 8px 28px rgba(16,185,129,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.92)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(2%, -3%) scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
        "pulse-soft": "pulse-soft 2.2s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
