import { useMemo } from "react";
import { useProgress } from "../context/ProgressContext";
import { LESSON_STEPS, VISIBLE_STEPS } from "../constants/steps";
import { LESSONS } from "../data/wordbank.js";
import type { Word } from "../types";

/**
 * Sélectionne quelques mots de leçons précédentes pour l'échauffement
 * (révision espacée). Sélection déterministe (pas d'aléatoire) pour rester
 * stable si l'apprenant revient sur l'étape. Les mots de liaison du jour
 * sont exclus (ils reviennent déjà en rotation).
 */
function pickReviewWords(currentDay: number, todays: Word[], count = 5): Word[] {
  if (currentDay <= 1) return [];
  const todayIds = new Set(todays.map((w) => w.harakat));
  const seen = new Set<string>();
  const pool: Word[] = [];
  const lookback = Math.min(currentDay - 1, 10); // les 10 derniers jours au plus
  for (let d = currentDay - 1; d >= currentDay - lookback; d--) {
    for (const w of LESSONS[(d - 1) % LESSONS.length].words) {
      if (todayIds.has(w.harakat) || seen.has(w.harakat)) continue;
      seen.add(w.harakat);
      pool.push(w);
    }
  }
  if (!pool.length) return [];
  const step = Math.max(1, Math.floor(pool.length / count));
  const picked: Word[] = [];
  for (let i = 0; i < pool.length && picked.length < count; i += step) picked.push(pool[i]);
  return picked;
}

/** Combine la progression + des valeurs dérivées propres à l'écran de leçon. */
export function useLesson() {
  const progress = useProgress();
  const { state, todaysLesson } = progress;
  const stepId = LESSON_STEPS[state.lesson.stepIndex];
  const reviewWords = useMemo(
    () => pickReviewWords(state.currentDay, todaysLesson.words),
    [state.currentDay, todaysLesson]
  );
  const lastIndex = VISIBLE_STEPS.length - 1;
  const progressFraction = Math.min(state.lesson.stepIndex, lastIndex) / lastIndex;

  return { ...progress, stepId, reviewWords, progressFraction };
}
