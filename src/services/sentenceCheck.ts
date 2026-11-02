import type { Word } from "../types";
import { findMatchedWords } from "./arabic";

export { findMatchedWords };

export function hasAtLeastOneMatch(sentence: string, words: Word[]): boolean {
  if (!sentence.trim()) return false;
  return findMatchedWords(sentence, words).length > 0;
}

/** Amorce de phrase arabe suggérée pour aider l'apprenant à démarrer. */
export function suggestStarter(word: Word | undefined): string {
  if (!word) return "";
  switch (word.cat) {
    case "verb":
      return `كُلَّ يَوْمٍ ${word.present ?? word.harakat}…`;
    case "adjective":
      return `أَنَا ${word.harakat} لِأَنَّ…`;
    case "linking":
      return `${word.harakat}، …`;
    case "expression":
    default:
      return `أَقُولُ لِصَدِيقِي: «${word.harakat}»…`;
  }
}
