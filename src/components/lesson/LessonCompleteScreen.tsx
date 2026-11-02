import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PartyPopper, Flame } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Pill";
import { ArabicText } from "../ui/ArabicText";
import { ArabesqueDivider } from "../ui/Ornament";
import { GiftCard } from "./GiftCard";
import type { Gift, Lesson, LessonState } from "../../types";
import { STEP_XP } from "../../constants/steps";
import { getRankForXp } from "../../constants/ranks";
import { burstCelebration } from "../../services/confetti";
import { useLang } from "../../hooks/useLang";
import { pick } from "../../i18n";

interface LessonCompleteScreenProps {
  lesson: Lesson;
  lessonState: LessonState;
  xp: number;
  streak: number;
  gift: Gift;
}

/** Écran de fin : mots appris, XP, grade, série — puis ouverture du cadeau. */
export function LessonCompleteScreen({ lesson, lessonState, xp, streak, gift }: LessonCompleteScreenProps) {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const rank = getRankForXp(xp);
  const xpToday = lessonState.xpAwardedSteps.reduce((sum, step) => sum + STEP_XP[step], 0);

  useEffect(() => {
    burstCelebration();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center gap-2 text-center">
        <PartyPopper size={36} className="text-[var(--gold)]" />
        <h1 className="text-2xl font-black text-[var(--text)]">{t.lesson.complete.title}</h1>
        {lang === "fr" && (
          <p lang="ar" className="ar-content text-2xl text-[var(--accent)]">
            أَحْسَنْتَ!
          </p>
        )}
        <p className="text-[var(--text-muted)]">{t.lesson.complete.text}</p>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.complete.recap}</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-black text-[var(--text)]">+{xpToday}</p>
            <p className="text-xs text-[var(--text-faint)]">{t.lesson.complete.xpEarned}</p>
          </div>
          <div>
            <p className="text-lg font-black text-[var(--text)]">
              {rank.emoji} {pick(rank.name, lang)}
            </p>
            <p className="text-xs text-[var(--text-faint)]">{t.lesson.complete.rank}</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-xl font-black text-[var(--text)]">
              <Flame size={18} className="text-clay-300" />
              {streak}
            </p>
            <p className="text-xs text-[var(--text-faint)]">{t.lesson.complete.streak}</p>
          </div>
        </div>

        <ArabesqueDivider className="my-4" />
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.complete.words}</p>
        <div className="flex flex-wrap gap-1.5" dir="rtl">
          {lesson.words.map((w) => (
            <Pill key={w.harakat} tone="sage" title={`${w.translit} — ${w.fr}`}>
              <ArabicText text={w.harakat} className="text-base" />
            </Pill>
          ))}
        </div>
      </Card>

      <GiftCard gift={gift} />

      <Button fullWidth size="lg" variant="outline" onClick={() => navigate("/")}>
        {t.lesson.complete.back}
      </Button>
    </div>
  );
}
