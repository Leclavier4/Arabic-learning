import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Volume2, VolumeX } from "lucide-react";
import { HarakatToggle } from "../layout/HarakatToggle";
import { useProgress } from "../../context/ProgressContext";
import { usePreferences } from "../../context/PreferencesContext";
import { useLang } from "../../hooks/useLang";
import { getNextRank, getRankProgress } from "../../constants/ranks";
import { pick } from "../../i18n";
import { playSound } from "../../services/sound";

/** Petites étiquettes « +N » qui s'envolent quand une valeur augmente. */
function useGainFloaters(value: number) {
  const previous = useRef(value);
  const [floaters, setFloaters] = useState<{ id: number; amount: number }[]>([]);
  useEffect(() => {
    const diff = value - previous.current;
    previous.current = value;
    if (diff <= 0) return;
    const id = Date.now() + Math.random();
    setFloaters((f) => [...f, { id, amount: diff }]);
    const timer = setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1300);
    return () => clearTimeout(timer);
  }, [value]);
  return floaters;
}

function Floaters({ items, suffix, className }: { items: { id: number; amount: number }[]; suffix: string; className: string }) {
  return (
    <AnimatePresence>
      {items.map((f) => (
        <motion.span
          key={f.id}
          className={`pointer-events-none absolute top-full z-50 whitespace-nowrap rounded-full px-2 py-0.5 text-sm font-extrabold shadow-softer ${className}`}
          initial={{ opacity: 0, y: 4, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: [4, -6, -14, -30], scale: [0.6, 1.15, 1, 1] }}
          transition={{ duration: 1.25, ease: "easeOut" }}
        >
          +{f.amount} {suffix}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

const chip =
  "relative flex h-9 shrink-0 items-center gap-1 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-2 text-[15px] font-extrabold game-card";

/**
 * Barre de statut « HUD » toujours visible : avatar + grade, barre d'XP,
 * série (flamme), étoiles, langue, voyelles et son.
 */
export function GameHud() {
  const { state, rank, displayStreak } = useProgress();
  const { t, lang, setLang } = useLang();
  const { soundOn, setSoundOn } = usePreferences();
  const xpFloaters = useGainFloaters(state.xp);
  const starFloaters = useGainFloaters(state.stars);
  const next = getNextRank(state.xp);
  const rankName = pick(rank.name, lang);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-[var(--border)] bg-[var(--bg)]/92 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2">
        {/* Avatar = emoji du grade */}
        <Link
          to="/collection"
          aria-label={rankName}
          title={rankName}
          className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full border-[3px] border-sun-400 bg-sun-100 text-[1.7rem] dark:bg-sun-300/20"
        >
          {rank.emoji}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="min-w-0 flex-1 truncate text-xs font-extrabold leading-tight text-[var(--text-muted)]">{rankName}</p>

            {/* Série */}
            <div
              className={chip}
              title={t.header.streak(displayStreak, state.bestStreak)}
              aria-label={t.header.streak(displayStreak, state.bestStreak)}
            >
              <motion.span
                animate={displayStreak > 0 ? { scale: [1, 1.15, 1], rotate: [0, -6, 4, 0] } : {}}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="flex"
              >
                <Flame size={20} className={displayStreak > 0 ? "fill-coral-300 text-coral-400" : "text-[var(--text-faint)]"} />
              </motion.span>
              <span className={displayStreak > 0 ? "text-coral-400" : "text-[var(--text-faint)]"}>{displayStreak}</span>
            </div>

            {/* Étoiles */}
            <div className={chip} aria-label={t.game.stars(state.stars)} title={t.game.stars(state.stars)}>
              <span aria-hidden className="text-lg leading-none">
                ⭐
              </span>
              <span className="text-sun-600 dark:text-sun-300">{state.stars}</span>
              <Floaters items={starFloaters} suffix="⭐" className="end-0 bg-sun-200 text-sun-600" />
            </div>

            {/* Langue : un seul bouton qui bascule FR ⇄ ع */}
            <button
              type="button"
              onClick={() => {
                playSound("pop");
                setLang(lang === "fr" ? "ar" : "fr");
              }}
              aria-label={t.game.switchLang}
              title={t.game.switchLang}
              className={`${chip} w-9 justify-center !px-0 text-base`}
            >
              <span lang={lang === "fr" ? "ar" : "fr"}>{lang === "fr" ? "ع" : "FR"}</span>
            </button>

            <HarakatToggle />

            <button
              type="button"
              onClick={() => {
                setSoundOn(!soundOn);
                if (!soundOn) setTimeout(() => playSound("pop"), 30);
              }}
              aria-pressed={soundOn}
              aria-label={soundOn ? t.game.soundMute : t.game.soundUnmute}
              title={soundOn ? t.game.soundMute : t.game.soundUnmute}
              className={`${chip} w-9 justify-center !px-0`}
            >
              {soundOn ? (
                <Volume2 size={19} className="text-oasis-500 rtl:-scale-x-100" />
              ) : (
                <VolumeX size={19} className="text-[var(--text-faint)] rtl:-scale-x-100" />
              )}
            </button>
          </div>

          {/* Barre d'XP chunky vers le grade suivant */}
          <div
            className="relative mt-1.5"
            title={next ? t.rank.toNext(next.minXp - state.xp, pick(next.name, lang)) : t.rank.max}
          >
            <div
              role="progressbar"
              aria-label={t.rank.progress}
              aria-valuenow={Math.round(getRankProgress(state.xp) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative h-4 overflow-hidden rounded-full bg-[var(--surface-alt)] ring-2 ring-[var(--border)]"
            >
              <motion.div
                className="h-full rounded-full bg-sun-400"
                initial={false}
                animate={{ width: `${Math.max(5, getRankProgress(state.xp) * 100)}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 16 }}
              >
                <span className="mx-1.5 mt-[3px] block h-1 rounded-full bg-white/50" />
              </motion.div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-[var(--text)]">
                {t.game.xp(state.xp)}
                {next ? ` / ${next.minXp}` : ""}
              </span>
            </div>
            <Floaters items={xpFloaters} suffix="XP" className="start-1/3 bg-sun-300 text-[#5c4300]" />
          </div>
        </div>
      </div>
    </header>
  );
}
