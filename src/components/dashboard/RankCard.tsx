import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useProgress } from "../../context/ProgressContext";
import { useLang } from "../../hooks/useLang";
import { getNextRank, getRankProgress } from "../../constants/ranks";
import { pick } from "../../i18n";

export function RankCard() {
  const { state, rank } = useProgress();
  const { t, lang } = useLang();
  const next = getNextRank(state.xp);

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-3xl">
          {rank.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-faint)]">{t.rank.yourRank}</p>
          <h3 className="flex flex-wrap items-baseline gap-x-2 text-xl font-black text-[var(--text)]">
            {pick(rank.name, lang)}
            {lang === "fr" && (
              <span lang="ar" className="ar-content text-lg font-bold text-[var(--accent)]">
                {rank.name.ar}
              </span>
            )}
          </h3>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-lg font-black text-[var(--text)]">{state.xp}</p>
          <p className="text-xs text-[var(--text-faint)]">XP</p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar fraction={getRankProgress(state.xp)} label={t.rank.progress} />
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          {next ? `${t.rank.toNext(next.minXp - state.xp, pick(next.name, lang))} ${next.emoji}` : t.rank.max}
        </p>
      </div>
    </Card>
  );
}
