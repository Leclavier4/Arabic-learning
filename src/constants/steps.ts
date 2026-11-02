import type { Category, LessonStepId } from "../types";

/** Ordre officiel du parcours d'une leçon. "complete" = écran récap + cadeau. */
export const LESSON_STEPS: LessonStepId[] = [
  "warmup",
  "discover",
  "build",
  "memory",
  "read",
  "practice",
  "complete",
];

/** Étapes affichées dans la barre de progression (hors écran final). */
export const VISIBLE_STEPS: LessonStepId[] = LESSON_STEPS.filter((s) => s !== "complete");

/** XP attribué la première fois qu'une étape est validée. */
export const STEP_XP: Record<LessonStepId, number> = {
  warmup: 5,
  discover: 15,
  build: 20,
  memory: 15,
  read: 15,
  practice: 15,
  complete: 20, // bonus de complétion de la tâche du jour
};

export const CATEGORIES: Category[] = ["verb", "adjective", "linking", "expression"];

/** Nom arabe des catégories — toujours affiché, quelle que soit la langue d'interface. */
export const CATEGORY_AR: Record<Category, string> = {
  verb: "الأفعال",
  adjective: "الصفات",
  linking: "أدوات الربط",
  expression: "التعبيرات",
};

/** Nom arabe des étapes — affiché en sous-titre quand l'interface est en français. */
export const STEP_AR: Record<LessonStepId, string> = {
  warmup: "تسخين",
  discover: "الاكتشاف",
  build: "بناء الجمل",
  memory: "اربط بذكرى",
  read: "اقرأ الفقرة",
  practice: "تدرّب في الحياة",
  complete: "أحسنت!",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  verb: "🏃",
  adjective: "🎨",
  linking: "🔗",
  expression: "💬",
};
