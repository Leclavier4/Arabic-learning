import fr, { type Dict } from "./fr";
import ar from "./ar";
import type { Bilingual, Lang } from "../types";

export type { Dict };

export const DICTIONARIES: Record<Lang, Dict> = { fr, ar };

export const LANG_LABELS: Record<Lang, { native: string; short: string }> = {
  fr: { native: "Français", short: "FR" },
  ar: { native: "العربية", short: "ع" },
};

/** Choisit la bonne variante d'un texte bilingue (rangs, badges…). */
export function pick(text: Bilingual, lang: Lang): string {
  return text[lang];
}
