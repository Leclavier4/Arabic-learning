import type { Lang, Word } from "../../types";
import { useLang } from "../../hooks/useLang";

/** Sens principal d'un mot dans la langue d'interface (explication arabe simple en AR, traduction en FR). */
export function meaningFor(word: Word, lang: Lang): string {
  return lang === "ar" ? word.def ?? word.fr : word.fr;
}

/**
 * Affiche le sens d'un mot dans les deux langues : la langue d'interface en
 * premier, l'autre en plus petit (traduction FR + arabe simple).
 */
export function WordMeaning({ word, compact = false }: { word: Word; compact?: boolean }) {
  const { lang } = useLang();
  const french = <span lang="fr" dir="ltr">{word.fr}</span>;
  const arabic = word.def ? (
    <span lang="ar" dir="rtl" className="ar-content">
      {word.def}
    </span>
  ) : null;
  const [primary, secondary] = lang === "ar" ? [arabic ?? french, arabic ? french : null] : [french, arabic];

  return (
    <span className="flex flex-col items-center gap-0.5">
      <span className={`font-extrabold text-[var(--text)] ${compact ? "text-sm" : "text-base"}`}>{primary}</span>
      {secondary && <span className="text-xs text-[var(--text-muted)]">{secondary}</span>}
    </span>
  );
}
