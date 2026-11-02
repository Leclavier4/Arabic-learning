import { useNavigate } from "react-router-dom";
import { CheckCircle2, PartyPopper, PlayCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Pill";
import { CornerStar } from "../ui/Ornament";
import { useProgress } from "../../context/ProgressContext";
import { useLang } from "../../hooks/useLang";
import { CATEGORIES, CATEGORY_AR, CATEGORY_EMOJI, LESSON_STEPS } from "../../constants/steps";

export function TodayCard() {
  const navigate = useNavigate();
  const { state, isTodayCompleted } = useProgress();
  const { t, lang } = useLang();

  const started = state.lesson.stepIndex > 0 || state.lesson.flippedWords.length > 0;
  const currentStep = t.steps[LESSON_STEPS[state.lesson.stepIndex]];

  return (
    <Card className="relative overflow-hidden">
      <CornerStar className="pointer-events-none absolute -end-12 -top-12 h-36 w-36 text-sage-200 opacity-70 dark:text-sage-700 dark:opacity-50" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-faint)]">
          {t.dashboard.day(state.currentDay)}
        </p>
        <h2 className="mt-1 text-2xl font-black text-[var(--text)]">{t.dashboard.todaysLesson}</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Pill key={cat} tone="neutral">
              <span aria-hidden>{CATEGORY_EMOJI[cat]}</span>
              {lang === "fr" ? t.categories[cat] : CATEGORY_AR[cat]} · 5
            </Pill>
          ))}
        </div>

        <p className="mt-3 text-sm text-[var(--text-muted)]">{t.dashboard.description}</p>

        <div className="mt-5">
          {isTodayCompleted ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-bold text-sage-600 dark:text-sage-300">
                <CheckCircle2 size={20} />
                {t.dashboard.done}
              </div>
              <Button variant="outline" onClick={() => navigate("/lesson")}>
                <PartyPopper size={18} />
                {t.dashboard.viewRecap}
              </Button>
            </div>
          ) : (
            <Button fullWidth size="lg" onClick={() => navigate("/lesson")} className="flex-col !gap-0.5">
              <span className="flex items-center gap-2">
                <PlayCircle size={20} className="rtl:-scale-x-100" />
                {started ? t.dashboard.continueAt(currentStep) : t.dashboard.start}
              </span>
              {lang === "fr" && !started && (
                <span lang="ar" className="ar-content text-sm font-semibold opacity-90">
                  ابدأ درس اليوم
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
