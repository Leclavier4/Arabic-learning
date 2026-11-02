import type { KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fennec } from "./Fennec";
import { SpeechBubble } from "./SpeechBubble";
import type { MascotPose } from "../../context/MascotContext";
import { useMascot } from "../../hooks/useMascot";
import { useLang } from "../../hooks/useLang";
import { playSound } from "../../services/sound";

interface MascotProps {
  pose?: MascotPose;
  message?: string | null;
  size?: number;
  /** Position de la bulle : à côté (side), au-dessus (top) ou aucune. */
  bubble?: "side" | "top" | "none";
  /** Sens du regard. Par défaut : celui de l'interface (miroir en arabe). */
  direction?: "ltr" | "rtl";
  /** Toucher la mascotte la fait réagir (petite phrase rigolote). */
  interactive?: boolean;
  className?: string;
  bubbleClassName?: string;
}

/**
 * La mascotte complète : le fennec animé + sa bulle de dialogue + petits
 * effets (Zzz quand elle dort, « … » quand elle réfléchit, étincelles
 * quand elle fait la fête). Elle regarde dans le sens de lecture :
 * vers la droite en français, vers la gauche en arabe.
 */
export function Mascot({
  pose = "idle",
  message,
  size = 96,
  bubble = "side",
  direction,
  interactive = true,
  className = "",
  bubbleClassName = "",
}: MascotProps) {
  const { dir } = useLang();
  const { react, name } = useMascot();
  const mirrored = (direction ?? dir) === "rtl";

  const figure = (
    <div
      className={["relative shrink-0", interactive ? "cursor-pointer" : ""].join(" ")}
      style={{ width: size }}
      {...(interactive
        ? {
            role: "button",
            tabIndex: 0,
            "aria-label": name,
            onClick: () => {
              playSound("pop");
              react("tap");
            },
            onKeyDown: (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                react("tap");
              }
            },
          }
        : {})}
    >
      <div style={{ transform: mirrored ? "scaleX(-1)" : undefined }}>
        <Fennec pose={pose} size={size} />
      </div>
      <PoseEffects pose={pose} size={size} />
    </div>
  );

  if (bubble === "none") return <div className={className}>{figure}</div>;

  if (bubble === "top") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <SpeechBubble message={message} tail="bottom" className={`max-w-[17rem] text-center ${bubbleClassName}`} />
        {figure}
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      {figure}
      <div className="min-w-0 flex-1 pb-3">
        <SpeechBubble message={message} tail="side" className={bubbleClassName} />
      </div>
    </div>
  );
}

/** Effets HTML superposés (hors du SVG pour ne pas être retournés en miroir). */
function PoseEffects({ pose, size }: { pose: MascotPose; size: number }) {
  const fontSize = Math.max(12, size * 0.16);
  return (
    <AnimatePresence>
      {pose === "sleep" && (
        <motion.div key="zzz" className="pointer-events-none absolute -top-1 end-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute font-extrabold text-oasis-500 dark:text-oasis-300"
              style={{ fontSize: fontSize * (0.7 + i * 0.25), insetInlineEnd: i * 10 }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-2, -24 - i * 6] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7 }}
            >
              z
            </motion.span>
          ))}
        </motion.div>
      )}
      {pose === "think" && (
        <motion.div key="think" className="pointer-events-none absolute -top-2 end-0 flex items-end gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {[6, 9, 12].map((d, i) => (
            <motion.span
              key={d}
              className="block rounded-full bg-[var(--surface)] shadow-softer ring-2 ring-[var(--border)]"
              style={{ width: d, height: d }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      )}
      {(pose === "celebrate" || pose === "cheer") && (
        <motion.div key="sparkles" className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {[
            { x: "5%", y: "8%", d: 0 },
            { x: "82%", y: "4%", d: 0.3 },
            { x: "90%", y: "45%", d: 0.6 },
            { x: "-4%", y: "40%", d: 0.9 },
          ].map((s, i) => (
            <motion.span
              key={i}
              className="absolute text-sun-400"
              style={{ left: s.x, top: s.y, fontSize }}
              animate={{ scale: [0, 1.2, 0], rotate: [0, 90] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: s.d }}
            >
              ✦
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
