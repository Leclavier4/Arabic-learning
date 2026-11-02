import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "../../context/ProgressContext";
import { burstCelebration } from "../../services/confetti";
import { playSound } from "../../services/sound";
import { Mascot } from "../mascot/Mascot";
import { useLang } from "../../hooks/useLang";
import { pick } from "../../i18n";

/**
 * Monté une fois dans l'app : surveille les montées de grade et les badges
 * fraîchement débloqués (dont les paliers de série 3, 7, 30 jours) et
 * affiche une grande célébration : flash doré, fanfare, confettis et la
 * mascotte qui fait la fête.
 */
export function GlobalCelebrations() {
  const { justUnlocked, dismissOneBadge, justRankedUp, clearRankUp, rank } = useProgress();
  const { t, lang } = useLang();

  const badge = !justRankedUp ? justUnlocked[0] : undefined;
  const dismiss = justRankedUp ? clearRankUp : dismissOneBadge;
  const open = justRankedUp || Boolean(badge);
  const celebrationKey = justRankedUp ? `rank-${rank.id}` : badge?.id;

  useEffect(() => {
    if (!celebrationKey) return;
    burstCelebration();
    playSound("levelup");
  }, [celebrationKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
          onClick={dismiss}
        >
          {/* Flash doré */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-sun-300"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            key={celebrationKey}
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.6, y: 40, rotate: -4 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="game-card relative w-full max-w-sm rounded-4xl border-4 border-sun-300 bg-[var(--surface)] p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="-mt-20 mb-1 flex justify-center">
              <Mascot pose="celebrate" size={110} bubble="none" interactive={false} />
            </div>
            {justRankedUp ? (
              <>
                <motion.div
                  className="text-6xl"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {rank.emoji}
                </motion.div>
                <h2 className="mt-1 text-2xl font-extrabold text-sun-600 dark:text-sun-300">{t.celebrate.rankTitle}</h2>
                <p className="mt-1 font-semibold text-[var(--text-muted)]">{t.celebrate.rankText(pick(rank.name, lang))}</p>
                {lang === "fr" && (
                  <p lang="ar" className="ar-content mt-1 text-xl text-[var(--accent)]">
                    {rank.name.ar}
                  </p>
                )}
                <p className="mt-2 text-sm font-bold text-[var(--text-faint)]">{t.mascot.rankUp}</p>
              </>
            ) : (
              badge && (
                <>
                  <motion.div
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border-[5px] border-white bg-sun-200 text-5xl shadow-[0_5px_0_rgba(0,0,0,0.1)]"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: [0, 1.25, 1], rotate: [-20, 8, -4] }}
                    transition={{ delay: 0.15, duration: 0.7 }}
                  >
                    {badge.emoji}
                  </motion.div>
                  <h2 className="mt-3 text-2xl font-extrabold text-sun-600 dark:text-sun-300">{t.celebrate.badgeTitle}</h2>
                  <p className="mt-1 text-lg font-extrabold text-[var(--text)]">{pick(badge.name, lang)}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-muted)]">{pick(badge.description, lang)}</p>
                </>
              )
            )}
            <button
              type="button"
              autoFocus
              onClick={() => {
                playSound("tap");
                dismiss();
              }}
              className="btn-jelly mt-5 w-full rounded-3xl bg-oasis-500 px-4 py-3 text-lg font-extrabold text-white [--btn-edge:theme(colors.oasis.700)]"
            >
              {t.celebrate.thanks}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
