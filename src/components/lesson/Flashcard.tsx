import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { Category, Word } from "../../types";
import { ArabicText } from "../ui/ArabicText";
import { StarBurst } from "../game/StarBurst";
import { WordMeaning } from "./WordMeaning";
import { useLang } from "../../hooks/useLang";
import { stripHarakat } from "../../services/arabic";
import { speak } from "../../services/speech";
import { playSound } from "../../services/sound";

interface FlashcardProps {
  word: Word;
  /** La carte a déjà rapporté son étoile (retournée au moins une fois). */
  earned: boolean;
  onFlip?: (wordId: string) => void;
}

/** Couleur cartoon de chaque catégorie (recto). */
const CATEGORY_STYLE: Record<Category, string> = {
  verb: "bg-oasis-100 border-oasis-300 [--edge:theme(colors.oasis.300)] dark:bg-oasis-400/15",
  adjective: "bg-coral-100 border-coral-200 [--edge:theme(colors.coral.200)] dark:bg-coral-300/15",
  linking: "bg-sun-100 border-sun-300 [--edge:theme(colors.sun.300)] dark:bg-sun-300/15",
  expression: "bg-sand-100 border-sand-300 [--edge:theme(colors.sand.300)] dark:bg-sand-300/15",
};

/** Taille du mot selon sa longueur (les expressions peuvent faire plusieurs mots). */
function sizeFor(text: string): string {
  const n = stripHarakat(text).length;
  if (n <= 6) return "text-[2.6rem]";
  if (n <= 12) return "text-3xl";
  if (n <= 20) return "text-2xl";
  return "text-xl";
}

/**
 * Grande carte cartoon qui se retourne en 3D avec un rebond.
 * Recto : mot arabe vocalisé bien gros + haut-parleur rigolo.
 * Verso : translittération + traduction (+ présent pour les verbes).
 * La première fois qu'on la retourne, elle rapporte une étoile ⭐.
 */
export function Flashcard({ word, earned, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [burst, setBurst] = useState(0);
  const { t } = useLang();

  const flip = () => {
    setIsFlipped((f) => !f);
    if (!earned) setBurst((b) => b + 1);
    else playSound("flip");
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
      className="relative h-60 w-full cursor-pointer rounded-4xl [perspective:1200px]"
    >
      {burst > 0 && <StarBurst key={burst} burstKey={burst} />}
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 17 }}
      >
        {/* Recto */}
        <div
          className={[
            "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-4xl border-[3px] p-3 text-center [backface-visibility:hidden]",
            "shadow-[0_6px_0_var(--edge)]",
            CATEGORY_STYLE[word.cat],
          ].join(" ")}
        >
          {earned && (
            <span aria-hidden className="absolute end-3 top-2 text-lg">
              ⭐
            </span>
          )}
          <ArabicText text={word.harakat} className={`${sizeFor(word.harakat)} font-bold leading-snug text-[var(--text)]`} />
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speak(word.harakat);
            }}
            whileTap={{ scale: 0.85, rotate: -10 }}
            whileHover={{ rotate: [0, -8, 8, 0] }}
            aria-label={t.common.listenTo(stripHarakat(word.harakat))}
            className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-sun-400 text-[#5c4300] shadow-[0_4px_0_#B98A00]"
          >
            <Volume2 size={24} strokeWidth={2.6} className="rtl:-scale-x-100" />
          </motion.button>
          <span className="text-xs font-extrabold text-[var(--text-faint)]">{t.lesson.discover.tapToFlip}</span>
        </div>

        {/* Verso */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-4xl border-[3px] border-oasis-300 bg-[var(--surface)] p-3 text-center shadow-[0_6px_0_theme(colors.oasis.300)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-base font-extrabold italic text-[var(--accent)]" dir="ltr" lang="ar-Latn">
            {word.translit}
          </span>
          <WordMeaning word={word} />
          {word.present && (
            <span className="mt-1 flex flex-col items-center rounded-2xl bg-[var(--surface-alt)] px-2.5 py-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.discover.present}</span>
              <span className="flex items-baseline gap-1.5">
                <ArabicText text={word.present} className="text-xl text-[var(--text)]" />
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
