import { VERBS, ADJECTIVES, LINKING, EXPRESSIONS } from "../data/wordbank.js";
import type { Word } from "../types";

/** Index de tous les mots de la banque, par forme vocalisée (identifiant unique). */
export const ALL_WORDS: Word[] = [
  ...VERBS.map((w) => ({ ...w, cat: "verb" as const })),
  ...ADJECTIVES.map((w) => ({ ...w, cat: "adjective" as const })),
  ...LINKING.map((w) => ({ ...w, cat: "linking" as const })),
  ...EXPRESSIONS.map((w) => ({ ...w, cat: "expression" as const })),
];

const WORD_MAP = new Map<string, Word>(ALL_WORDS.map((w) => [w.harakat, w]));

export function lookupWord(harakat: string): Word | undefined {
  return WORD_MAP.get(harakat);
}
