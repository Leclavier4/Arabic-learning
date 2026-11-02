import { AnimatePresence, motion } from "framer-motion";

interface SpeechBubbleProps {
  message: string | null | undefined;
  /** "side" : la queue pointe vers le début de ligne ; "bottom" : vers le bas ; "top" : vers le haut. */
  tail?: "side" | "bottom" | "top";
  /** Position de la queue « top » le long de la bulle (valeur CSS, ex. "40%"). */
  tailAt?: string;
  className?: string;
}

/** Bulle de dialogue « BD » de la mascotte, qui apparaît avec un petit rebond. */
export function SpeechBubble({ message, tail = "side", tailAt = "50%", className = "" }: SpeechBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.1 } }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className={[
            "relative rounded-3xl border-2 border-sand-300 bg-[var(--surface)] px-4 py-2.5 dark:border-[var(--border)]",
            "text-[15px] font-bold leading-snug text-[var(--text)] shadow-softer",
            className,
          ].join(" ")}
        >
          {message}
          <span
            aria-hidden
            className={[
              "absolute h-4 w-4 rotate-45 border-sand-300 bg-[var(--surface)] dark:border-[var(--border)]",
              tail === "side"
                ? // carré tourné de 45° : on dessine les deux bords du coin qui dépasse (physiques, pas logiques)
                  "-start-[9px] bottom-5 border-b-2 border-l-2 rtl:border-b-0 rtl:border-l-0 rtl:border-r-2 rtl:border-t-2"
                : tail === "bottom"
                  ? "-bottom-[9px] start-1/2 -ms-2 border-b-2 border-r-2"
                  : "-top-[9px] -ms-2 border-l-2 border-t-2",
            ].join(" ")}
            style={tail === "top" ? { insetInlineStart: tailAt } : undefined}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
