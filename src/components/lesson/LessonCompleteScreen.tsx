import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Map } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Pill";
import { ArabicText } from "../ui/ArabicText";
import { Mascot } from "../mascot/Mascot";
import { GiftCard } from "./GiftCard";
import type { Gift, Lesson, LessonState } from "../../types";
import type { MascotPose } from "../../context/MascotContext";
import { STEP_XP } from "../../constants/steps";
import { STAR_REWARDS } from "../../config/game";
import { getRankForXp } from "../../constants/ranks";
import { burstCelebration } from "../../services/confetti";
import { playSound } from "../../services/sound";
import { useLang } from "../../hooks/useLang";
import { useMascot } from "../../hooks/useMascot";
import { pick } from "../../i18n";

interface LessonCompleteScreenProps {
  lesson: Lesson;
  lessonState: LessonState;
  xp: number;
  streak: number;
  gift: Gift;
}

/**
 * Écran de victoire : la mascotte fait la fête, récap (XP, étoiles, grade,
 * série, mots), puis le coffre. Une fois le coffre ouvert, elle applaudit…
 * et va dormir jusqu'au lendemain.
 */
export function LessonCompleteScreen({ lesson, lessonState, xp, streak, gift }: LessonCompleteScreenProps) {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { reaction, line } = useMascot();
  const rank = getRankForXp(xp);
  const xpToday = lessonState.xpAwardedSteps.reduce((sum, step) => sum + STEP_XP[step], 0);
  const stepsDone = lessonState.xpAwardedSteps.filter((s) => s !== "complete").length;
  const starsToday = lesson.words.length * STAR_REWARDS.card + stepsDone * STAR_REWARDS.step + STAR_REWARDS.lesson;

  const [phase, setPhase] = useState<"party" | "opened" | "sleep">("party");
  const sleepTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    burstCelebration();
    playSound("levelup");
    return () => clearTimeout(sleepTimer.current);
  }, []);

  const onChestOpen = () => {
    setPhase("opened");
    sleepTimer.current = setTimeout(() => setPhase("sleep"), 5000);
  };

  const basePose: MascotPose = phase === "party" ? "celebrate" : phase === "opened" ? "cheer" : "sleep";
  const [openedLine] = useState(() => line("chestOpened"));
  const [sleepLine] = useState(() => line("sleep"));
  const baseMessage = phase === "party" ? t.mascot.chestReady : phase === "opened" ? openedLine : sleepLine;

  const stats = [
    { value: `+${xpToday}`, label: t.lesson.complete.xpEarned, color: "text-sun-600 dark:text-sun-300" },
    { value: `+${starsToday}`, label: "⭐", color: "text-sun-600 dark:text-sun-300" },
    { value: rank.emoji, label: pick(rank.name, lang), color: "" },
    {
      value: (
        <span className="flex items-center justify-center gap-1">
          <Flame size={20} className="fill-coral-300 text-coral-400" />
          {streak}
        </span>
      ),
      label: t.lesson.complete.streak,
      color: "text-coral-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
        <Card className="flex flex-col items-center gap-2 border-oasis-300 bg-oasis-50 text-center dark:bg-oasis-400/10">
          <h1 className="text-3xl font-extrabold text-oasis-600 dark:text-oasis-200">{t.lesson.complete.title}</h1>
          <Mascot pose={reaction?.pose ?? basePose} message={reaction?.message ?? baseMessage} size={120} bubble="top" />
          <p className="font-semibold text-[var(--text-muted)]">{t.lesson.complete.text}</p>
        </Card>
      </motion.div>

      <Card>
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.complete.recap}</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 260, damping: 15 }}
              className="rounded-3xl bg-[var(--surface-alt)] px-1 py-2"
            >
              <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
              <p className="text-[11px] font-bold leading-tight text-[var(--text-faint)]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <p className="mb-2 mt-4 text-xs font-extrabold uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.complete.words}</p>
        <div className="flex flex-wrap gap-1.5" dir="rtl">
          {lesson.words.map((w) => (
            <Pill key={w.harakat} tone="oasis" title={`${w.translit} — ${w.fr}`}>
              <ArabicText text={w.harakat} className="text-base" />
            </Pill>
          ))}
        </div>
      </Card>

      <GiftCard gift={gift} onOpen={onChestOpen} />

      <Button fullWidth size="lg" variant="outline" onClick={() => navigate("/")}>
        <Map size={20} />
        {t.lesson.complete.back}
      </Button>
    </div>
  );
}
