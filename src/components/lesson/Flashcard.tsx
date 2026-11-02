import { useState } from "react";
import { motion } from "framer-motion";
import type { Word } from "../../types";
import { SpeakButton } from "../ui/SpeakButton";
import { ArabicText } from "../ui/ArabicText";
import { WordMeaning } from "./WordMeaning";
import { useLang } from "../../hooks/useLang";
import { stripHarakat } from "../../services/arabic";

interface FlashcardProps {
  word: Word;
  onFlip?: (wordId: string) => void;
}

/** Taille du mot selon sa longueur (les expressions peuvent faire plusieurs mots). */
function sizeFor(text: string): string {
  const n = stripHarakat(text).length;
  if (n <= 6) return "text-4xl";
  if (n <= 12) return "text-3xl";
  if (n <= 20) return "text-2xl";
  return "text-xl";
}

/**
 * Carte retournable.
 * Recto : mot arabe vocalisé + bouton audio.
 * Verso : translittération + traduction (FR) et explication en arabe simple
 * (+ forme du présent pour les verbes).
 */
export function Flashcard({ word, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useLang();

  const flip = () => {
    setIsFlipped((f) => !f);
    onFlip?.(word.harakat);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={flip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
      aria-pressed={isFlipped}
      aria-label={t.lesson.discover.cardLabel(stripHarakat(word.harakat))}
      className="h-56 w-full cursor-pointer rounded-3xl [perspective:1200px]"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        {/* Recto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center shadow-soft [backface-visibility:hidden]">
          <ArabicText text={word.harakat} className={`${sizeFor(word.harakat)} font-semibold text-[var(--text)]`} />
          <SpeakButton text={word.harakat} />
          <span className="text-[11px] font-bold text-[var(--text-faint)]">{t.lesson.discover.tapToFlip}</span>
        </div>

        {/* Verso */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-3xl border border-sage-200 bg-[var(--accent-soft)] p-3 text-center shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-sage-700">
          <span className="text-sm font-semibold italic text-[var(--accent)]" dir="ltr" lang="ar-Latn">
            {word.translit}
          </span>
          <WordMeaning word={word} />
          {word.present && (
            <span className="mt-1 flex flex-col items-center rounded-xl bg-[var(--surface)]/70 px-2 py-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-faint)]">
                {t.lesson.discover.present}
              </span>
              <span className="flex items-baseline gap-1.5">
                <ArabicText text={word.present} className="text-lg text-[var(--text)]" />
                <span className="text-xs italic text-[var(--text-muted)]" dir="ltr">
                  {word.presentTranslit}
                </span>
              </span>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
