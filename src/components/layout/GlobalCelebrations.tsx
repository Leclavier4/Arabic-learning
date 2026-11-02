import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "../../context/ProgressContext";
import { burstCelebration } from "../../services/confetti";
import { useLang } from "../../hooks/useLang";
import { pick } from "../../i18n";

/**
 * Composant monté une fois dans l'app : surveille les badges fraîchement
 * débloqués et les montées de grade pour afficher une célébration (confettis
 * + carte), où que soit l'apprenant.
 */
export function GlobalCelebrations() {
  const { justUnlocked, dismissOneBadge, justRankedUp, clearRankUp, rank } = useProgress();
  const { t, lang } = useLang();

  useEffect(() => {
    if (justRankedUp || justUnlocked.length) burstCelebration();
  }, [justRankedUp, justUnlocked.length]);

  // Le grade est affiché en priorité ; le badge suivant apparaît après fermeture.
  const badge = !justRankedUp ? justUnlocked[0] : undefined;
  const dismiss = justRankedUp ? clearRankUp : dismissOneBadge;
  const open = justRankedUp || Boolean(badge);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4"
          onClick={dismiss}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {justRankedUp ? (
              <>
                <div className="mb-2 text-5xl">{rank.emoji}</div>
                <h2 className="text-xl font-black text-[var(--text)]">{t.celebrate.rankTitle}</h2>
                <p className="mt-1 text-[var(--text-muted)]">{t.celebrate.rankText(pick(rank.name, lang))}</p>
                {lang === "fr" && (
                  <p lang="ar" className="ar-content mt-1 text-lg text-[var(--accent)]">
                    {rank.name.ar}
                  </p>
                )}
              </>
            ) : (
              badge && (
                <>
                  <div className="mb-2 text-5xl">{badge.emoji}</div>
                  <h2 className="text-xl font-black text-[var(--text)]">{t.celebrate.badgeTitle}</h2>
                  <p className="mt-1 font-bold text-[var(--text)]">{pick(badge.name, lang)}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{pick(badge.description, lang)}</p>
                </>
              )
            )}
            <button
              type="button"
              autoFocus
              onClick={dismiss}
              className="mt-5 w-full rounded-2xl bg-sage-500 px-4 py-2.5 font-bold text-white hover:bg-sage-600"
            >
              {t.celebrate.thanks}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
