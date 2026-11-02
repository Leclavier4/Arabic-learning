import type { Lang } from "../../types";
import { LANG_LABELS } from "../../i18n";
import { useLang } from "../../hooks/useLang";

/** Sélecteur de langue d'interface FR / ع (compact) ou Français / العربية (large). */
export function LanguageSwitch({ large = false }: { large?: boolean }) {
  const { lang, setLang, t } = useLang();
  const langs: Lang[] = ["fr", "ar"];

  return (
    <div
      role="radiogroup"
      aria-label={t.header.language}
      className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
    >
      {langs.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            lang={l}
            onClick={() => setLang(l)}
            title={LANG_LABELS[l].native}
            className={[
              "rounded-full font-bold transition",
              large ? "px-5 py-2 text-base" : "min-w-[2.25rem] px-2.5 py-1.5 text-sm",
              l === "ar" ? "font-[Tajawal]" : "",
              active
                ? "bg-sage-500 text-white dark:bg-sage-400 dark:text-[#13200f]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)]",
            ].join(" ")}
          >
            {large ? LANG_LABELS[l].native : LANG_LABELS[l].short}
          </button>
        );
      })}
    </div>
  );
}
