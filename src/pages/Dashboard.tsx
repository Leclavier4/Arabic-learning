import { Link } from "react-router-dom";
import { Heart, BookOpenCheck } from "lucide-react";
import { TodayCard } from "../components/dashboard/TodayCard";
import { RankCard } from "../components/dashboard/RankCard";
import { StreakCard } from "../components/dashboard/StreakCard";
import { BadgesGrid } from "../components/dashboard/BadgesGrid";
import { ArabesqueDivider } from "../components/ui/Ornament";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";

/** Accueil : grade, série, leçon du jour, accès rapides, badges et sélecteur de langue. */
export function Dashboard() {
  const { state } = useProgress();
  const { t } = useLang();
  const wordsLearned = Object.keys(state.learnedWords).length;

  const quickLink =
    "flex items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 font-bold text-[var(--text)] shadow-softer transition hover:shadow-soft";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)]">{t.dashboard.hello}</h1>
          <p className="text-[var(--text-muted)]">
            {wordsLearned > 0 ? t.dashboard.wordsSoFar(wordsLearned) : t.dashboard.firstWords}
          </p>
        </div>
      </div>

      <TodayCard />
      <RankCard />
      <StreakCard />

      <div className="grid grid-cols-2 gap-3">
        <Link to="/my-words" className={quickLink}>
          <BookOpenCheck className="shrink-0 text-sage-500" size={22} />
          {t.nav.myWords}
        </Link>
        <Link to="/memory-palace" className={quickLink}>
          <Heart className="shrink-0 text-clay-300" size={22} />
          {t.dashboard.memoryPalace}
        </Link>
      </div>

      <BadgesGrid />

      <div className="flex flex-col items-center gap-3 py-2">
        <ArabesqueDivider className="w-full" />
        <LanguageSwitch large />
        <p className="text-center text-sm text-[var(--text-faint)]">{t.app.footer}</p>
      </div>
    </div>
  );
}
