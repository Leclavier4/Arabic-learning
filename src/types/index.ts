// Types centraux de Kalimati. Le contenu (mots, cadeaux) vient de src/data
// en JS ; on le type ici pour profiter de TypeScript partout ailleurs.

export type Lang = "fr" | "ar";

/** Texte disponible dans les deux langues d'interface. */
export interface Bilingual {
  fr: string;
  ar: string;
}

export type Category = "verb" | "adjective" | "linking" | "expression";

/** Mot tel qu'il est écrit dans data/wordbank.js (sans catégorie). */
export interface RawWord {
  /** Mot arabe sans voyelles. */
  ar: string;
  /** Mot arabe vocalisé (avec harakât) — sert aussi d'identifiant unique. */
  harakat: string;
  /** Translittération latine. */
  translit: string;
  /** Traduction française. */
  fr: string;
  /** Explication en arabe simple. */
  def?: string;
  /** Verbes : 1re personne du présent (« je … »), vocalisée. */
  present?: string;
  presentTranslit?: string;
}

export interface Word extends RawWord {
  cat: Category;
}

export interface Lesson {
  day: number;
  words: Word[];
}

export type GiftKind = "media" | "riddle" | "fact";

export interface MediaGift {
  type: "video" | "podcast" | "site";
  title: string;
  lang: string;
  why: string;
  whyAr?: string;
  url: string;
}
export interface RiddleGift {
  q: string;
  a: string;
  fr: string;
}
export interface FactGift {
  ar: string;
  fr: string;
}

export type Gift =
  | { kind: "media"; data: MediaGift }
  | { kind: "riddle"; data: RiddleGift }
  | { kind: "fact"; data: FactGift };

export interface Memory {
  id: string;
  /** Identifiant du mot (sa forme vocalisée). */
  word: string;
  category: Category;
  text: string;
  day: number;
  date: string; // ISO yyyy-mm-dd
}

export interface Rank {
  id: string;
  name: Bilingual;
  minXp: number;
  emoji: string;
}

export interface Badge {
  id: string;
  name: Bilingual;
  description: Bilingual;
  emoji: string;
}

/** Les étapes du parcours d'une leçon (dans l'ordre). */
export type LessonStepId =
  | "warmup"
  | "discover"
  | "build"
  | "memory"
  | "read"
  | "practice"
  | "complete";

export type SentencesByCategory = Record<Category, string[]>;

export interface LessonState {
  day: number;
  stepIndex: number; // index dans LESSON_STEPS
  flippedWords: string[]; // mots (harakat) déjà retournés à l'étape Découverte
  sentences: SentencesByCategory;
  memoryWord: string | null;
  memoryText: string;
  readDone: boolean;
  practiceDone: boolean;
  warmupAnswers: Record<string, boolean>; // mot -> su ?
  completed: boolean;
  xpAwardedSteps: LessonStepId[]; // pour n'attribuer l'XP qu'une fois par étape
}

export interface ProgressState {
  firstUseDate: string; // date de première ouverture — ancre pour numéroter les jours
  xp: number;
  streak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  lastCompletedDate: string | null; // dernière date où la tâche du jour a été bouclée
  currentDay: number; // n° de leçon absolu (peut dépasser LESSONS.length -> modulo)
  completedLessonsCount: number;
  lessonsWithoutHarakat: number; // leçons terminées avec les voyelles masquées (badge)
  learnedWords: Record<string, { cat: Category; day: number }>; // clé = harakat
  memories: Memory[];
  badges: string[];
  giftsClaimedByDay: Record<number, boolean>;
  lesson: LessonState;
}
