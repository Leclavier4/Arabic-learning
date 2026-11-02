import type { Lesson, RawWord } from "../types";

export const VERBS: RawWord[];
export const ADJECTIVES: RawWord[];
export const LINKING: RawWord[];
export const EXPRESSIONS: RawWord[];

export function buildLessons(): Lesson[];
export const LESSONS: Lesson[];

export const STATS: {
  verbs: number;
  adjectives: number;
  linking: number;
  expressions: number;
  readonly total: number;
  lessons: number;
};
