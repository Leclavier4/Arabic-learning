import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { LanguageSwitch } from "./LanguageSwitch";
import { HarakatToggle } from "./HarakatToggle";
import { ThemeCycleButton } from "./ThemeToggle";
import { StarMark } from "../ui/Ornament";
import { useProgress } from "../../context/ProgressContext";
import { useLang } from "../../hooks/useLang";
import { pick } from "../../i18n";

export function Header() {
  const { rank, displayStreak, state } = useProgress();
  const { t, lang } = useLang();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2.5">
        <Link to="/" aria-label={t.header.home} className="flex items-center gap-2 text-[var(--text)]">
          <StarMark size={26} className="text-sage-500 dark:text-sage-400" />
          <span lang="ar" className="ar-content text-xl font-bold leading-none">
            كلماتي
          </span>
          <span className="hidden text-sm font-black text-[var(--text-faint)] sm:inline" lang="fr">
            Kalimati
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1 rounded-full bg-[var(--surface-alt)] px-2.5 py-1.5 text-sm font-bold text-[var(--text)]"
            title={t.header.streak(displayStreak, state.bestStreak)}
            aria-label={t.header.streak(displayStreak, state.bestStreak)}
          >
            <Flame size={16} className={displayStreak > 0 ? "text-clay-300" : "text-[var(--text-faint)]"} />
            {displayStreak}
          </div>
          <div
            className="hidden items-center gap-1 rounded-full bg-[var(--surface-alt)] px-3 py-1.5 text-sm font-bold text-[var(--text)] md:flex"
            title={`${state.xp} XP`}
          >
            <span aria-hidden>{rank.emoji}</span>
            {pick(rank.name, lang)}
          </div>
          <LanguageSwitch />
          <HarakatToggle />
          <ThemeCycleButton />
        </div>
      </div>
    </header>
  );
}
