import React from "react";

type Tone = "sage" | "sand" | "gold" | "clay" | "neutral";

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const TONES: Record<Tone, string> = {
  sage: "bg-sage-100 text-sage-700 dark:bg-sage-400/20 dark:text-sage-200",
  sand: "bg-sand-100 text-[#6b4f1d] dark:bg-sand-300/20 dark:text-sand-200",
  gold: "bg-gold-200/70 text-[#6a5317] dark:bg-gold-300/20 dark:text-gold-200",
  clay: "bg-clay-100 text-[#8a3f29] dark:bg-clay-300/20 dark:text-clay-200",
  neutral: "bg-[var(--surface-alt)] text-[var(--text-muted)]",
};

export function Pill({ tone = "neutral", className = "", children, ...rest }: PillProps) {
  return (
    <span
      className={["inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold", TONES[tone], className].join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
