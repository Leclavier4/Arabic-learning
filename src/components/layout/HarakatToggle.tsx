import { useHarakat } from "../../hooks/useHarakat";
import { useLang } from "../../hooks/useLang";

/**
 * Bouton « حَ » : affiche / masque les harakât (voyelles) dans tout le contenu
 * arabe. Barré quand les voyelles sont masquées.
 */
export function HarakatToggle() {
  const { showHarakat, toggleHarakat } = useHarakat();
  const { t } = useLang();
  const label = showHarakat ? t.header.harakatHide : t.header.harakatShow;

  return (
    <button
      type="button"
      onClick={toggleHarakat}
      aria-pressed={showHarakat}
      aria-label={label}
      title={label}
      className={[
        "relative flex h-9 w-9 items-center justify-center rounded-full border transition",
        showHarakat
          ? "border-sage-200 bg-[var(--accent-soft)] text-[var(--accent)] dark:border-sage-600"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-faint)]",
      ].join(" ")}
    >
      <span lang="ar" className="ar-content text-lg font-bold leading-none">
        {showHarakat ? "حَ" : "ح"}
      </span>
      {!showHarakat && (
        <span aria-hidden className="absolute h-0.5 w-6 rotate-45 rounded-full bg-[var(--text-faint)]" />
      )}
    </button>
  );
}
