import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Fennec } from "../mascot/Fennec";
import { SpeechBubble } from "../mascot/SpeechBubble";
import type { MascotPose } from "../../context/MascotContext";
import type { LessonStepId } from "../../types";
import { STEP_AR, VISIBLE_STEPS } from "../../constants/steps";
import { useLang } from "../../hooks/useLang";
import { playSound } from "../../services/sound";

const STEP_ICON: Record<LessonStepId, string> = {
  warmup: "🏁",
  discover: "🃏",
  build: "✏️",
  memory: "💭",
  read: "📖",
  practice: "🗣️",
  complete: "🎁",
};

interface StepStonesProps {
  stepId: LessonStepId;
  day: number;
  mascotPose: MascotPose;
  mascotMessage: string | null;
}

/**
 * Les étapes de la leçon = des pierres sur un petit chemin. La mascotte se
 * tient sur la pierre en cours et saute à la suivante à chaque étape validée.
 * Sa bulle s'affiche juste en dessous, la pointe tournée vers elle.
 */
export function StepStones({ stepId, day, mascotPose, mascotMessage }: StepStonesProps) {
  const navigate = useNavigate();
  const { t, lang, dir } = useLang();
  const index = Math.max(0, VISIBLE_STEPS.indexOf(stepId));
  const tailAt = `calc(${((index + 0.5) / VISIBLE_STEPS.length) * 100}% - 2px)`;

  // Petit son de saut quand la mascotte change de pierre.
  const previous = useRef(index);
  useEffect(() => {
    if (previous.current !== index) playSound("hop");
    previous.current = index;
  }, [index]);

  return (
    <div className="mb-5">
      <div className="mb-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label={t.header.home}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-faint)] hover:bg-[var(--surface-alt)]"
        >
          <X size={24} strokeWidth={3} />
        </button>
        <p className="min-w-0 flex-1 truncate text-sm font-extrabold text-[var(--text-muted)]">
          {t.lesson.dayStep(day, index + 1, VISIBLE_STEPS.length)} · {t.steps[stepId]}
          {lang === "fr" && (
            <span lang="ar" className="ar-content ms-2 text-[var(--accent)]">
              {STEP_AR[stepId]}
            </span>
          )}
        </p>
      </div>

      {/* Chemin de pierres */}
      <ol aria-label={t.game.stepStones} className="relative mt-14 grid grid-cols-6 items-end">
        <span aria-hidden className="absolute inset-x-[8%] top-1/2 h-2 -translate-y-1/2 rounded-full border-y-2 border-dashed border-[var(--dune-2)]" />
        {VISIBLE_STEPS.map((s, i) => {
          const state = i < index ? "done" : i === index ? "current" : "todo";
          return (
            <li key={s} className="relative flex justify-center" aria-current={state === "current" ? "step" : undefined}>
              {state === "current" && (
                <motion.div
                  layoutId="lesson-mascot"
                  className="absolute bottom-[70%] z-10"
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <motion.div key={stepId} initial={{ y: 0 }} animate={{ y: [0, -22, 0] }} transition={{ duration: 0.5, ease: "easeOut" }}>
                    <div style={{ transform: dir === "rtl" ? "scaleX(-1)" : undefined }}>
                      <Fennec pose={mascotPose} size={50} />
                    </div>
                  </motion.div>
                </motion.div>
              )}
              <motion.span
                title={t.steps[s]}
                animate={state === "current" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 1.6, repeat: state === "current" ? Infinity : 0 }}
                className={[
                  "relative flex items-center justify-center rounded-[45%] border-[3px] text-lg",
                  state === "current"
                    ? "h-12 w-14 border-sun-200 bg-sun-400 shadow-[0_5px_0_#B98A00]"
                    : state === "done"
                      ? "h-11 w-12 border-oasis-200 bg-oasis-400 text-white shadow-[0_5px_0_#167469]"
                      : "h-11 w-12 border-[var(--surface)] bg-[var(--surface-alt)] shadow-[0_5px_0_var(--border)] grayscale",
                ].join(" ")}
              >
                {state === "done" ? <Check size={22} strokeWidth={3.5} /> : <span aria-hidden>{STEP_ICON[s]}</span>}
                <span className="sr-only">{t.steps[s]}</span>
              </motion.span>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 min-h-[3rem]">
        <SpeechBubble message={mascotMessage} tail="top" tailAt={tailAt} />
      </div>
    </div>
  );
}
