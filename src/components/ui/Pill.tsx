import React from "react";

type Tone = "oasis" | "sand" | "sun" | "coral" | "neutral";

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const TONES: Record<Tone, string> = {
  oasis: "bg-oasis-100 text-oasis-700 dark:bg-oasis-400/20 dark:text-oasis-200",
  sand: "bg-sand-100 text-sand-600 dark:bg-sand-300/20 dark:text-sand-200",
  sun: "bg-sun-200 text-sun-600 dark:bg-sun-300/20 dark:text-sun-200",
  coral: "bg-coral-100 text-coral-500 dark:bg-coral-300/20 dark:text-coral-200",
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
