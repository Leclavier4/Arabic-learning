import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";
import { STEP_AR, VISIBLE_STEPS } from "../../constants/steps";
import type { LessonStepId } from "../../types";
import { useLang } from "../../hooks/useLang";

interface StepProgressHeaderProps {
  stepId: LessonStepId;
  fraction: number;
  day: number;
}

export function StepProgressHeader({ stepId, fraction, day }: StepProgressHeaderProps) {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const stepNumber = Math.min(VISIBLE_STEPS.indexOf(stepId) + 1, VISIBLE_STEPS.length);

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label={t.header.home}
          className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-alt)]"
        >
          {/* Flèche « retour » : pointe vers la gauche en LTR, vers la droite en RTL */}
          <ChevronLeft size={22} className="rtl:rotate-180" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-faint)]">
            {t.lesson.dayStep(day, stepNumber, VISIBLE_STEPS.length)}
          </p>
          <h1 className="flex flex-wrap items-baseline gap-x-2 text-lg font-black text-[var(--text)]">
            {t.steps[stepId]}
            {lang === "fr" && (
              <span lang="ar" className="ar-content text-base font-bold text-[var(--accent)]">
                {STEP_AR[stepId]}
              </span>
            )}
          </h1>
        </div>
      </div>
      <ProgressBar fraction={fraction} label={t.lesson.progress} />
    </div>
  );
}
