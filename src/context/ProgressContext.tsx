import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { LESSONS } from "../data/wordbank.js";
import { giftForDay } from "../data/gifts.js";
import type {
  Badge,
  Category,
  Gift,
  Lesson,
  LessonState,
  LessonStepId,
  Memory,
  ProgressState,
  Rank,
} from "../types";
import { readJSON, writeJSON, clearAllKalimatiData } from "../services/storage";
import { todayKey, daysBetween } from "../services/date";
import { getRankForXp } from "../constants/ranks";
import { BADGES } from "../constants/badges";
import { STEP_XP, LESSON_STEPS } from "../constants/steps";
import { uid } from "../services/id";
import { PREFERENCE_KEYS } from "./PreferencesContext";

const STORAGE_KEY = "progress";

// ── État initial ───────────────────────────────────────────────────────

function createFreshLessonState(day: number): LessonState {
  return {
    day,
    stepIndex: 0,
    flippedWords: [],
    sentences: { verb: [], adjective: [], linking: [], expression: [] },
    memoryWord: null,
    memoryText: "",
    readDone: false,
    practiceDone: false,
    warmupAnswers: {},
    completed: false,
    xpAwardedSteps: [],
  };
}

function createFreshState(day: number, date: string): ProgressState {
  return {
    firstUseDate: date,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastActiveDate: date,
    lastCompletedDate: null,
    currentDay: day,
    completedLessonsCount: 0,
    lessonsWithoutHarakat: 0,
    learnedWords: {},
    memories: [],
    badges: [],
    giftsClaimedByDay: {},
    lesson: createFreshLessonState(day),
  };
}

function lessonForDay(day: number): Lesson {
  const base = LESSONS[(day - 1) % LESSONS.length];
  return { day, words: base.words };
}

/**
 * Charge l'état depuis localStorage et gère le passage à un nouveau jour.
 * Le n° de leçon avance d'un jour calendaire à l'autre, mais jamais de plus
 * d'une leçon d'écart par rapport à la dernière leçon terminée : un apprenant
 * absent une semaine reprend là où il s'était arrêté.
 */
function loadInitialState(): ProgressState {
  const today = todayKey();
  const stored = readJSON<ProgressState | null>(STORAGE_KEY, null);
  if (!stored) return createFreshState(1, today);

  // Rétrocompatibilité : complète les champs ajoutés après coup.
  let state: ProgressState = { ...createFreshState(1, today), ...stored, lastActiveDate: today };

  const isNewDay = state.lastCompletedDate !== null && state.lastCompletedDate !== today;
  if (isNewDay && state.lesson.completed) {
    const nextDay = state.currentDay + 1;
    state = { ...state, currentDay: nextDay, lesson: createFreshLessonState(nextDay) };
  } else if (!state.lesson || state.lesson.day !== state.currentDay) {
    state = { ...state, lesson: createFreshLessonState(state.currentDay) };
  }
  return state;
}

// ── Streak d'affichage (dérivée, ne modifie jamais le state stocké) ────

function computeDisplayStreak(state: ProgressState): number {
  if (!state.lastCompletedDate) return 0;
  const gap = daysBetween(state.lastCompletedDate, todayKey());
  return gap <= 1 ? state.streak : 0; // 0 = complétée aujourd'hui, 1 = en attente, >1 = jour sauté
}

// ── Badges ──────────────────────────────────────────────────────────────

function computeNewlyUnlockedBadgeIds(state: ProgressState): string[] {
  const already = new Set(state.badges);
  const wordsLearned = Object.keys(state.learnedWords).length;
  const conditions: Record<string, boolean> = {
    "first-lesson": state.completedLessonsCount >= 1,
    "lessons-10": state.completedLessonsCount >= 10,
    "streak-3": state.streak >= 3,
    "streak-7": state.streak >= 7,
    "streak-30": state.streak >= 30,
    "words-100": wordsLearned >= 100,
    "first-memory": state.memories.length >= 1,
    "no-harakat": state.lessonsWithoutHarakat >= 1,
  };
  return Object.entries(conditions)
    .filter(([id, ok]) => ok && !already.has(id))
    .map(([id]) => id);
}

/** Attribue l'XP d'une étape une seule fois (idempotent). */
function awardStepXp(lesson: LessonState, step: LessonStepId): { lesson: LessonState; xp: number } {
  if (lesson.xpAwardedSteps.includes(step)) return { lesson, xp: 0 };
  return { lesson: { ...lesson, xpAwardedSteps: [...lesson.xpAwardedSteps, step] }, xp: STEP_XP[step] };
}

// ── Contexte ─────────────────────────────────────────────────────────────

interface ProgressContextValue {
  state: ProgressState;
  todaysLesson: Lesson;
  todaysGift: Gift;
  isTodayCompleted: boolean;
  displayStreak: number;
  rank: Rank;
  justUnlocked: Badge[];
  dismissOneBadge: () => void;
  justRankedUp: boolean;
  clearRankUp: () => void;

  goToStep: (index: number) => void;
  nextStep: () => void;
  toggleFlipped: (wordId: string) => void;
  completeDiscoverStep: () => void;
  setSentence: (cat: Category, index: number, text: string) => void;
  completeBuildStep: () => void;
  selectMemoryWord: (wordId: string) => void;
  setMemoryText: (text: string) => void;
  saveMemory: () => void;
  completeReadStep: () => void;
  setWarmupAnswer: (wordId: string, correct: boolean) => void;
  completeWarmupStep: () => void;
  /** Termine la pratique + la leçon (XP bonus, série, cadeau). */
  completeLesson: (options: { withoutHarakat: boolean }) => void;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadInitialState);
  const [justUnlocked, setJustUnlocked] = useState<Badge[]>([]);
  const [justRankedUp, setJustRankedUp] = useState(false);

  // Persistance à chaque changement d'état.
  useEffect(() => {
    writeJSON(STORAGE_KEY, state);
  }, [state]);

  // Détection des nouveaux badges / montées de grade, hors du setState (reste pur).
  const seenBadges = useRef(new Set(state.badges));
  const seenRank = useRef(getRankForXp(state.xp).id);
  useEffect(() => {
    const fresh = state.badges.filter((id) => !seenBadges.current.has(id));
    seenBadges.current = new Set(state.badges);
    if (fresh.length) {
      const objs = fresh.map((id) => BADGES.find((b) => b.id === id)).filter((b): b is Badge => Boolean(b));
      setJustUnlocked((cur) => [...cur, ...objs]);
    }
    const rankId = getRankForXp(state.xp).id;
    if (rankId !== seenRank.current) {
      const wentUp = state.xp > 0;
      seenRank.current = rankId;
      if (wentUp) setJustRankedUp(true);
    }
  }, [state.badges, state.xp]);

  const todaysLesson = useMemo(() => lessonForDay(state.currentDay), [state.currentDay]);
  const todaysGift = useMemo(() => giftForDay(state.currentDay) as Gift, [state.currentDay]);
  const isTodayCompleted = state.lesson.day === state.currentDay && state.lesson.completed;
  const displayStreak = computeDisplayStreak(state);
  const rank = getRankForXp(state.xp);

  /** Applique une mutation pure, puis ajoute les badges nouvellement mérités. */
  const mutate = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      const newBadgeIds = computeNewlyUnlockedBadgeIds(next);
      return newBadgeIds.length ? { ...next, badges: [...next.badges, ...newBadgeIds] } : next;
    });
  }, []);

  const dismissOneBadge = useCallback(() => setJustUnlocked((cur) => cur.slice(1)), []);
  const clearRankUp = useCallback(() => setJustRankedUp(false), []);

  // ── Navigation entre étapes ───────────────────────────────────────────

  const goToStep = useCallback(
    (index: number) =>
      mutate((prev) => ({
        ...prev,
        lesson: { ...prev.lesson, stepIndex: Math.max(0, Math.min(LESSON_STEPS.length - 1, index)) },
      })),
    [mutate]
  );

  const nextStep = useCallback(
    () =>
      mutate((prev) => ({
        ...prev,
        lesson: { ...prev.lesson, stepIndex: Math.min(LESSON_STEPS.length - 1, prev.lesson.stepIndex + 1) },
      })),
    [mutate]
  );

  // ── Warm-up (révision espacée, en tête de leçon) ──────────────────────

  const setWarmupAnswer = useCallback(
    (wordId: string, correct: boolean) =>
      mutate((prev) => ({
        ...prev,
        lesson: { ...prev.lesson, warmupAnswers: { ...prev.lesson.warmupAnswers, [wordId]: correct } },
      })),
    [mutate]
  );

  const completeWarmupStep = useCallback(
    () =>
      mutate((prev) => {
        const { lesson, xp } = awardStepXp(prev.lesson, "warmup");
        return { ...prev, xp: prev.xp + xp, lesson };
      }),
    [mutate]
  );

  // ── Étape 1 : Découverte ──────────────────────────────────────────────

  const toggleFlipped = useCallback(
    (wordId: string) =>
      mutate((prev) =>
        prev.lesson.flippedWords.includes(wordId)
          ? prev
          : { ...prev, lesson: { ...prev.lesson, flippedWords: [...prev.lesson.flippedWords, wordId] } }
      ),
    [mutate]
  );

  const completeDiscoverStep = useCallback(
    () =>
      mutate((prev) => {
        const { lesson, xp } = awardStepXp(prev.lesson, "discover");
        const learnedWords = { ...prev.learnedWords };
        for (const w of todaysLesson.words) {
          // On garde le jour de première rencontre (les connecteurs reviennent en rotation).
          learnedWords[w.harakat] ??= { cat: w.cat, day: prev.currentDay };
        }
        return { ...prev, xp: prev.xp + xp, learnedWords, lesson };
      }),
    [mutate, todaysLesson]
  );

  // ── Étape 2 : Construire des phrases ──────────────────────────────────

  const setSentence = useCallback(
    (cat: Category, index: number, text: string) =>
      mutate((prev) => {
        const arr = [...prev.lesson.sentences[cat]];
        arr[index] = text;
        return { ...prev, lesson: { ...prev.lesson, sentences: { ...prev.lesson.sentences, [cat]: arr } } };
      }),
    [mutate]
  );

  const completeBuildStep = useCallback(
    () =>
      mutate((prev) => {
        const { lesson, xp } = awardStepXp(prev.lesson, "build");
        return { ...prev, xp: prev.xp + xp, lesson };
      }),
    [mutate]
  );

  // ── Étape 3 : Associer à un souvenir ──────────────────────────────────

  const selectMemoryWord = useCallback(
    (wordId: string) => mutate((prev) => ({ ...prev, lesson: { ...prev.lesson, memoryWord: wordId } })),
    [mutate]
  );

  const setMemoryText = useCallback(
    (text: string) => mutate((prev) => ({ ...prev, lesson: { ...prev.lesson, memoryText: text } })),
    [mutate]
  );

  const saveMemory = useCallback(
    () =>
      mutate((prev) => {
        if (!prev.lesson.memoryWord || !prev.lesson.memoryText.trim()) return prev;
        if (prev.lesson.xpAwardedSteps.includes("memory")) return prev; // déjà enregistré
        const word = todaysLesson.words.find((w) => w.harakat === prev.lesson.memoryWord);
        const memory: Memory = {
          id: uid(),
          word: prev.lesson.memoryWord,
          category: word?.cat ?? "verb",
          text: prev.lesson.memoryText.trim(),
          day: prev.currentDay,
          date: todayKey(),
        };
        const { lesson, xp } = awardStepXp(prev.lesson, "memory");
        return { ...prev, xp: prev.xp + xp, memories: [memory, ...prev.memories], lesson };
      }),
    [mutate, todaysLesson]
  );

  // ── Étape 4 : Lire le paragraphe ──────────────────────────────────────

  const completeReadStep = useCallback(
    () =>
      mutate((prev) => {
        const { lesson, xp } = awardStepXp(prev.lesson, "read");
        return { ...prev, xp: prev.xp + xp, lesson: { ...lesson, readDone: true } };
      }),
    [mutate]
  );

  // ── Étape 5 + fin : pratique, XP bonus, série, cadeau ────────────────

  const completeLesson = useCallback(
    ({ withoutHarakat }: { withoutHarakat: boolean }) =>
      mutate((prev) => {
        if (prev.lesson.completed) return prev; // déjà fait aujourd'hui, pas de double récompense
        const practice = awardStepXp(prev.lesson, "practice");
        const done = awardStepXp(practice.lesson, "complete");
        const today = todayKey();

        const gap = prev.lastCompletedDate ? daysBetween(prev.lastCompletedDate, today) : null;
        const streak = gap === null ? 1 : gap === 0 ? prev.streak : gap === 1 ? prev.streak + 1 : 1;

        return {
          ...prev,
          xp: prev.xp + practice.xp + done.xp,
          streak,
          bestStreak: Math.max(prev.bestStreak, streak),
          lastCompletedDate: today,
          completedLessonsCount: prev.completedLessonsCount + 1,
          lessonsWithoutHarakat: prev.lessonsWithoutHarakat + (withoutHarakat ? 1 : 0),
          giftsClaimedByDay: { ...prev.giftsClaimedByDay, [prev.currentDay]: true },
          lesson: { ...done.lesson, practiceDone: true, completed: true, stepIndex: LESSON_STEPS.length - 1 },
        };
      }),
    [mutate]
  );

  // ── Réinitialisation complète (réglages) — garde langue/thème/voyelles ──

  const resetAll = useCallback(() => {
    clearAllKalimatiData(PREFERENCE_KEYS);
    const fresh = createFreshState(1, todayKey());
    seenBadges.current = new Set();
    seenRank.current = getRankForXp(0).id;
    setState(fresh);
    setJustUnlocked([]);
    setJustRankedUp(false);
  }, []);

  const value: ProgressContextValue = {
    state,
    todaysLesson,
    todaysGift,
    isTodayCompleted,
    displayStreak,
    rank,
    justUnlocked,
    dismissOneBadge,
    justRankedUp,
    clearRankUp,
    goToStep,
    nextStep,
    toggleFlipped,
    completeDiscoverStep,
    setSentence,
    completeBuildStep,
    selectMemoryWord,
    setMemoryText,
    saveMemory,
    completeReadStep,
    setWarmupAnswer,
    completeWarmupStep,
    completeLesson,
    resetAll,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
