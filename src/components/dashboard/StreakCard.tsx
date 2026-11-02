import { Flame, Trophy } from "lucide-react";
import { Card } from "../ui/Card";
import { useProgress } from "../../context/ProgressContext";
import { useLang } from "../../hooks/useLang";

export function StreakCard() {
  const { displayStreak, state } = useProgress();
  const { t } = useLang();
  const active = displayStreak > 0;

  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            active ? "bg-clay-100 dark:bg-clay-300/20" : "bg-[var(--surface-alt)]",
          ].join(" ")}
        >
          <Flame size={26} className={active ? "text-clay-300" : "text-[var(--text-faint)]"} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-faint)]">{t.streak.title}</p>
          <h3 className="text-xl font-black text-[var(--text)]">{t.streak.days(displayStreak)}</h3>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-[var(--surface-alt)] px-3 py-2 text-sm font-bold text-[var(--text-muted)]">
        <Trophy size={16} className="text-[var(--gold)]" />
        {t.streak.best(state.bestStreak)}
      </div>
    </Card>
  );
}
