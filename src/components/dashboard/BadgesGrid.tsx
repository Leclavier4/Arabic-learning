import { Lock } from "lucide-react";
import { Card } from "../ui/Card";
import { BADGES } from "../../constants/badges";
import { useProgress } from "../../context/ProgressContext";
import { useLang } from "../../hooks/useLang";
import { pick } from "../../i18n";

export function BadgesGrid() {
  const { state } = useProgress();
  const { t, lang } = useLang();
  const unlocked = new Set(state.badges);

  return (
    <Card>
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-[var(--text-faint)]">{t.badges.title}</h3>
      <ul className="grid grid-cols-4 gap-3">
        {BADGES.map((badge) => {
          const isUnlocked = unlocked.has(badge.id);
          const name = pick(badge.name, lang);
          return (
            <li
              key={badge.id}
              title={`${name} — ${pick(badge.description, lang)}`}
              className={[
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border text-center",
                isUnlocked
                  ? "border-gold-300/60 bg-gold-200/30 dark:bg-gold-300/10"
                  : "border-[var(--border)] bg-[var(--surface-alt)] opacity-55",
              ].join(" ")}
            >
              {isUnlocked ? <span className="text-2xl">{badge.emoji}</span> : <Lock size={18} className="text-[var(--text-faint)]" />}
              <span className="px-1 text-[10px] font-bold leading-tight text-[var(--text-muted)]">{name}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
