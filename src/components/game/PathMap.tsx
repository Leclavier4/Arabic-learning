import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
import { Mascot } from "../mascot/Mascot";
import { SpeechBubble } from "../mascot/SpeechBubble";
import { MapDecor, DECOR_SEQUENCE } from "./MapDecor";
import type { MascotPose } from "../../context/MascotContext";
import { useLang } from "../../hooks/useLang";
import { useMascot } from "../../hooks/useMascot";
import { readJSON, writeJSON } from "../../services/storage";
import { playSound } from "../../services/sound";

/*
 * Carte-parcours façon Duolingo : chaque leçon (jour) est un nœud rond,
 * reliés par un sentier en pointillés qui serpente entre les dunes.
 * Passé = coche, aujourd'hui = étoile qui pulse, futur = cadenas.
 * La mascotte se tient près du nœud du jour et marche jusqu'au suivant
 * quand une nouvelle leçon s'ouvre.
 */

const WIDTH = 320;
const ROW = 150;
const TOP = 70;
const NODE = 76;
// Décalage horizontal des nœuds : le chemin serpente.
const OFFSETS = [0, 70, 100, 70, 0, -70, -100, -70];

interface PathMapProps {
  currentDay: number;
  todayDone: boolean;
  mascotPose: MascotPose;
  mascotMessage: string | null;
  onPlay: () => void;
}

export function PathMap({ currentDay, todayDone, mascotPose, mascotMessage, onPlay }: PathMapProps) {
  const { t, dir } = useLang();
  const { react } = useMascot();
  const currentRef = useRef<HTMLButtonElement>(null);

  // Fenêtre de jours affichés : quelques leçons passées + quelques futures.
  const first = Math.max(1, currentDay - 6);
  const days = useMemo(() => Array.from({ length: 12 }, (_, i) => first + i), [first]);

  const sign = dir === "rtl" ? -1 : 1; // le chemin est en miroir en arabe
  const pos = (day: number) => {
    const i = day - first;
    return { x: WIDTH / 2 + sign * OFFSETS[(day - 1) % OFFSETS.length], y: TOP + i * ROW };
  };
  const height = TOP + days.length * ROW;

  // La mascotte se place du côté « intérieur » du nœud courant.
  const mascotPos = (day: number) => {
    const p = pos(day);
    const offset = OFFSETS[(day - 1) % OFFSETS.length] * sign;
    const side = offset > 0 ? -1 : offset < 0 ? 1 : sign;
    return { x: p.x + side * 92, y: p.y };
  };

  // Mémorise le dernier jour vu pour animer la marche de la mascotte d'un nœud à l'autre.
  const lastSeen = useRef(readJSON<number>("mapMascotDay", currentDay));
  const from = mascotPos(Math.min(lastSeen.current, currentDay));
  const to = mascotPos(currentDay);
  useEffect(() => {
    writeJSON("mapMascotDay", currentDay);
  }, [currentDay]);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const segment = (a: number, b: number) => {
    const p = pos(a);
    const q = pos(b);
    return `M${p.x} ${p.y} C ${p.x} ${p.y + ROW / 2}, ${q.x} ${q.y - ROW / 2}, ${q.x} ${q.y}`;
  };

  return (
    <div className="relative mx-auto" style={{ width: WIDTH, height }}>
      {/* Sentier */}
      <svg className="absolute inset-0" width={WIDTH} height={height} aria-hidden>
        {days.slice(0, -1).map((d) => (
          <path
            key={d}
            d={segment(d, d + 1)}
            fill="none"
            stroke={d < currentDay ? "#35B9AC" : "var(--dune-2)"}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray="1 18"
          />
        ))}
      </svg>

      {/* Décor : un élément tous les deux nœuds, du côté opposé au chemin */}
      {days.map((d, i) => {
        if (i % 2 === 1) return null;
        const p = pos(d);
        const offset = OFFSETS[(d - 1) % OFFSETS.length] * sign;
        const side = offset >= 0 ? -1 : 1;
        const x = Math.min(WIDTH - 40, Math.max(-10, p.x + side * 120));
        return (
          <div key={`decor-${d}`} className="pointer-events-none absolute opacity-90" style={{ left: x - 32, top: p.y + ROW / 2 - 40 }}>
            <MapDecor kind={DECOR_SEQUENCE[(d - 1) % DECOR_SEQUENCE.length]} />
          </div>
        );
      })}

      {/* Nœuds */}
      {days.map((d) => {
        const p = pos(d);
        const status = d < currentDay || (d === currentDay && todayDone) ? "done" : d === currentDay ? "current" : "locked";
        const label = status === "current" ? t.game.nodeCurrent(d) : status === "done" ? t.game.nodeDone(d) : t.game.nodeLocked(d);
        return (
          <div key={d} className="absolute" style={{ left: p.x - NODE / 2, top: p.y - NODE / 2, width: NODE }}>
            <motion.button
              ref={d === currentDay ? currentRef : undefined}
              type="button"
              aria-label={label}
              title={label}
              whileTap={{ scale: 0.9, y: 4 }}
              onClick={() => {
                if (status === "current") {
                  playSound("pop");
                  onPlay();
                } else if (status === "done") {
                  playSound("star");
                  if (d === currentDay) onPlay();
                  else react("doneNode");
                } else {
                  playSound("tap");
                  react("locked");
                }
              }}
              className={[
                "relative isolate flex items-center justify-center rounded-full border-4 text-white",
                status === "current"
                  ? "node-pulse border-sun-200 bg-sun-400 shadow-[0_7px_0_#B98A00] [--pulse-color:#FFCC3D]"
                  : status === "done"
                    ? "border-oasis-200 bg-oasis-400 shadow-[0_7px_0_#167469]"
                    : "border-[var(--surface)] bg-[var(--surface-alt)] text-[var(--text-faint)] shadow-[0_7px_0_var(--border)]",
              ].join(" ")}
              style={{ width: NODE, height: NODE }}
            >
              {status === "current" && <Star size={34} className="fill-white text-white" />}
              {status === "done" && <Check size={36} strokeWidth={3.5} />}
              {status === "locked" && <Lock size={28} strokeWidth={2.6} />}
            </motion.button>
            <p className={`mt-3 text-center text-xs font-extrabold ${status === "locked" ? "text-[var(--text-faint)]" : "text-[var(--text-muted)]"}`}>
              {t.game.node(d)}
            </p>
          </div>
        );
      })}

      {/* Mascotte posée sur le nœud du jour (avec sa bulle au-dessus) */}
      <motion.div
        className="absolute z-10"
        initial={{ left: from.x - 40, top: from.y - 52 }}
        animate={{ left: to.x - 40, top: to.y - 52 }}
        transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.4 }}
        style={{ width: 80 }}
      >
        <div className="absolute bottom-[calc(100%+4px)] start-1/2 w-44 -translate-x-1/2 rtl:translate-x-1/2">
          <SpeechBubble message={mascotMessage} tail="bottom" className="text-center text-sm" />
        </div>
        <Mascot pose={mascotPose} size={80} bubble="none" />
      </motion.div>
    </div>
  );
}
