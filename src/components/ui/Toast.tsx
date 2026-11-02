import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ToastProps {
  message: string | null;
  onDone: () => void;
  duration?: number;
  icon?: ReactNode;
}

/** Petit bandeau doux qui apparaît en haut puis disparaît tout seul (encouragements, infos). */
export function Toast({ message, onDone, duration = 2800, icon }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDone]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="pointer-events-auto flex max-w-md items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-soft"
            role="status"
          >
            <span className="shrink-0 text-[var(--gold)]">{icon ?? <Sparkles size={18} />}</span>
            <span className="text-sm font-semibold text-[var(--text)]">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
