import { motion } from "framer-motion";

/** Petites étoiles qui jaillissent d'un point (micro-récompense). Rejoue à chaque nouvelle `burstKey`. */
export function StarBurst({ burstKey, count = 7 }: { burstKey: string | number; count?: number }) {
  return (
    <span key={burstKey} aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute text-xl text-sun-400"
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
            animate={{ x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, scale: [0.2, 1.3, 0.8], opacity: [1, 1, 0], rotate: 120 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ★
          </motion.span>
        );
      })}
    </span>
  );
}
