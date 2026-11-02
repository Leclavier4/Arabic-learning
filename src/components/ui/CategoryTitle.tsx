import type { Category } from "../../types";
import { CATEGORY_AR, CATEGORY_EMOJI } from "../../constants/steps";
import { useLang } from "../../hooks/useLang";

/** Titre de catégorie bilingue : « 🏃 Verbes · الأفعال » (FR) ou « 🏃 الأفعال » (AR). */
export function CategoryTitle({ cat, className = "" }: { cat: Category; className?: string }) {
  const { t, lang } = useLang();
  return (
    <h3 className={`flex items-center gap-2 text-sm font-extrabold text-[var(--text-muted)] ${className}`}>
      <span aria-hidden>{CATEGORY_EMOJI[cat]}</span>
      {lang === "fr" && <span className="uppercase tracking-wide">{t.categories[cat]}</span>}
      {lang === "fr" && <span className="text-[var(--text-faint)]">·</span>}
      <span lang="ar" className="ar-content text-base font-bold text-[var(--accent)]">
        {CATEGORY_AR[cat]}
      </span>
    </h3>
  );
}
