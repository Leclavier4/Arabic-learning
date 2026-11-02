import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { PageMascot } from "../components/mascot/PageMascot";
import { BADGES } from "../constants/badges";
import { RANKS } from "../constants/ranks";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";
import { pick } from "../i18n";
import { playSound } from "../services/sound";

// Légère rotation « collée à la main » de chaque autocollant.
const TILT = [-4, 3, -2, 5, -5, 2, 4, -3];
const STICKER_BG = ["bg-oasis-100", "bg-coral-100", "bg-sun-200", "bg-sand-100"];

interface StickerProps {
  emoji: string;
  name: string;
  description?: string;
  unlocked: boolean;
  index: number;
}

/** Autocollant : bord blanc épais, ombre, légère rotation, reflet brillant une fois débloqué. */
function Sticker({ emoji, name, description, unlocked, index }: StickerProps) {
  const { t } = useLang();
  return (
    <motion.li
      initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: TILT[index % TILT.length] }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay: index * 0.05 }}
      whileTap={unlocked ? { scale: 1.12, rotate: 0 } : { x: [0, -4, 4, 0] }}
      onTap={() => playSound(unlocked ? "star" : "tap")}
      title={description ? `${name} — ${description}` : name}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={[
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2rem] border-[5px] border-white text-4xl shadow-[0_5px_0_rgba(0,0,0,0.08)] dark:border-[var(--surface-alt)]",
          unlocked ? `${STICKER_BG[index % STICKER_BG.length]} sticker-shine dark:bg-[var(--surface)]` : "bg-[var(--surface-alt)] grayscale",
        ].join(" ")}
      >
        {unlocked ? <span>{emoji}</span> : <Lock size={26} className="text-[var(--text-faint)]" />}
      </div>
      <span className={`text-center text-xs font-extrabold leading-tight ${unlocked ? "text-[var(--text)]" : "text-[var(--text-faint)]"}`}>
        {unlocked ? name : t.game.mystery}
      </span>
    </motion.li>
  );
}

export function Collection() {
  const { state } = useProgress();
  const { t, lang } = useLang();
  const unlocked = new Set(state.badges);
  const ranksReached = RANKS.filter((r) => state.xp >= r.minXp).length;

  return (
    <div className="flex flex-col gap-5">
      <PageMascot title={t.game.collectionTitle} subtitle={t.game.collectionSubtitle} message={t.mascot.pages.collection} pose="cheer" />

      <Card>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-[var(--text)]">{t.game.collectionBadges}</h2>
          <span className="rounded-full bg-sun-200 px-3 py-0.5 text-sm font-extrabold text-sun-600 dark:bg-sun-300/20 dark:text-sun-200">
            {t.game.collectionProgress(unlocked.size, BADGES.length)}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {BADGES.map((b, i) => (
            <Sticker
              key={b.id}
              index={i}
              emoji={b.emoji}
              name={pick(b.name, lang)}
              description={pick(b.description, lang)}
              unlocked={unlocked.has(b.id)}
            />
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-[var(--text)]">{t.game.collectionRanks}</h2>
          <span className="rounded-full bg-oasis-100 px-3 py-0.5 text-sm font-extrabold text-oasis-600 dark:bg-oasis-400/20 dark:text-oasis-200">
            {t.game.collectionProgress(ranksReached, RANKS.length)}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-4">
          {RANKS.map((r, i) => (
            <Sticker
              key={r.id}
              index={i + 3}
              emoji={r.emoji}
              name={pick(r.name, lang)}
              description={`${r.minXp} XP`}
              unlocked={state.xp >= r.minXp}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}
