import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Play } from "lucide-react";
import { PathMap } from "../components/game/PathMap";
import { Button } from "../components/ui/Button";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";
import { useMascot } from "../hooks/useMascot";
import { CATEGORIES, CATEGORY_AR, CATEGORY_EMOJI, LESSON_STEPS } from "../constants/steps";

/**
 * Accueil = carte-parcours du jeu : bannière de la leçon du jour avec un
 * gros bouton « Jouer », puis le chemin de l'oasis avec la mascotte.
 */
export function Dashboard() {
  const navigate = useNavigate();
  const { state, isTodayCompleted } = useProgress();
  const { t, lang } = useLang();
  const { reaction, line, say } = useMascot();

  const started = state.lesson.stepIndex > 0 || state.lesson.flippedWords.length > 0;
  const play = () => navigate("/lesson");

  // À l'arrivée, la mascotte salue (ou souhaite bonne nuit) quelques secondes ;
  // ensuite la bulle disparaît pour ne pas cacher le chemin (elle revient quand on la touche).
  const greeting = useMemo(() => line(isTodayCompleted ? "sleep" : "greet"), [line, isTodayCompleted]);
  useEffect(() => {
    say(greeting, isTodayCompleted ? "sleep" : "wave", 4000);
  }, [say, greeting, isTodayCompleted]);

  const pose = reaction?.pose ?? (isTodayCompleted ? "sleep" : "idle");
  const message = reaction?.message ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* Bannière « unité » du jour */}
      <section className="game-card relative overflow-hidden rounded-4xl border-2 border-oasis-600 bg-oasis-500 p-5 text-white">
        <div aria-hidden className="absolute -end-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-10 end-16 h-24 w-24 rounded-full bg-white/10" />
        <p className="relative text-sm font-extrabold uppercase tracking-wide text-oasis-100">{t.game.mapTitle}</p>
        <h1 className="relative text-2xl font-extrabold leading-tight">{t.game.mapSubtitle(state.currentDay)}</h1>
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <span key={cat} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold">
              {CATEGORY_EMOJI[cat]} {lang === "fr" ? t.categories[cat] : CATEGORY_AR[cat]} · 5
            </span>
          ))}
        </div>
        <div className="relative mt-4">
          {isTodayCompleted ? (
            <div className="flex flex-col gap-2">
              <p className="font-extrabold">{t.game.doneToday}</p>
              <Button variant="sun" onClick={play} className="w-fit">
                <Gift size={20} />
                {t.game.seeChest}
              </Button>
            </div>
          ) : (
            <Button variant="sun" size="lg" fullWidth onClick={play} silent>
              <Play size={22} className="fill-current rtl:-scale-x-100" />
              {started ? `${t.game.continue} · ${t.steps[LESSON_STEPS[state.lesson.stepIndex]]}` : t.game.play}
            </Button>
          )}
        </div>
      </section>

      {/* Chemin de l'oasis */}
      <div className="overflow-x-clip">
        <PathMap
          currentDay={state.currentDay}
          todayDone={isTodayCompleted}
          mascotPose={pose}
          mascotMessage={message}
          onPlay={play}
        />
      </div>

      <div className="flex flex-col items-center gap-3 pb-2">
        <LanguageSwitch large />
        <p className="text-center text-sm font-semibold text-[var(--text-faint)]">{t.app.footer}</p>
      </div>
    </div>
  );
}
