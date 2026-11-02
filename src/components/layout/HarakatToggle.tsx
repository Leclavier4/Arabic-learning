import { useHarakat } from "../../hooks/useHarakat";
import { useLang } from "../../hooks/useLang";
import { playSound } from "../../services/sound";

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
      onClick={() => {
        playSound("pop");
        toggleHarakat();
      }}
      aria-pressed={showHarakat}
      aria-label={label}
      title={label}
      className={[
        "game-card relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border-2 transition",
        showHarakat
          ? "border-oasis-300 bg-oasis-100 text-oasis-600 dark:bg-oasis-400/20 dark:text-oasis-200"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-faint)]",
      ].join(" ")}
    >
      <span lang="ar" className="ar-content text-lg font-bold leading-none">
        {showHarakat ? "حَ" : "ح"}
      </span>
      {!showHarakat && <span aria-hidden className="absolute h-0.5 w-6 rotate-45 rounded-full bg-[var(--text-faint)]" />}
    </button>
  );
}
