import { motion } from "framer-motion";

interface ProgressBarProps {
  fraction: number; // 0..1
  className?: string;
  label?: string;
}

/** Barre de progression douce ; se remplit depuis le début de ligne (droite en RTL). */
export function ProgressBar({ fraction, className = "", label }: ProgressBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-alt)]"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sage-400 via-sand-300 to-gold-300 rtl:bg-gradient-to-l"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
