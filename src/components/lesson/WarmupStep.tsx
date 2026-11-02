import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Eye, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { SpeakButton } from "../ui/SpeakButton";
import { ArabicText } from "../ui/ArabicText";
import { WordMeaning } from "./WordMeaning";
import type { Word } from "../../types";
import { useLang } from "../../hooks/useLang";

interface WarmupStepProps {
  reviewWords: Word[];
  answers: Record<string, boolean>;
  onAnswer: (wordId: string, correct: boolean) => void;
  onComplete: () => void;
}

/** Petit quiz de rappel « تسخين » (révision espacée) avant les nouveaux mots. */
export function WarmupStep({ reviewWords, answers, onAnswer, onComplete }: WarmupStepProps) {
  const { t } = useLang();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (reviewWords.length === 0) {
    return (
      <Card className="text-center">
        <Sparkles size={28} className="mx-auto mb-2 text-[var(--gold)]" />
        <h2 className="text-lg font-black text-[var(--text)]">{t.lesson.warmup.firstTitle}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{t.lesson.warmup.firstText}</p>
        <Button className="mt-4" onClick={onComplete} fullWidth>
          {t.lesson.warmup.letsGo}
        </Button>
      </Card>
    );
  }

  const allAnswered = reviewWords.every((w) => answers[w.harakat] !== undefined);

  return (
    <div className="flex flex-col gap-3">
      <Card className="text-sm text-[var(--text-muted)]">{t.lesson.warmup.intro}</Card>

      {reviewWords.map((word) => {
        const isRevealed = revealed[word.harakat] || answers[word.harakat] !== undefined;
        const answer = answers[word.harakat];
        return (
          <Card key={word.harakat} className="flex flex-col gap-3 !p-4">
            <div className="flex items-center gap-3">
              <SpeakButton text={word.harakat} />
              <ArabicText text={word.harakat} className="flex-1 text-2xl font-semibold text-[var(--text)]" />
              {answer !== undefined &&
                (answer ? (
                  <CheckCircle2 size={22} className="shrink-0 text-sage-500" />
                ) : (
                  <CircleDashed size={22} className="shrink-0 text-[var(--text-faint)]" />
                ))}
            </div>

            <AnimatePresence initial={false}>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden rounded-2xl bg-[var(--surface-alt)] p-3 text-center"
                >
                  <p className="text-sm italic text-[var(--text-faint)]" dir="ltr">
                    {word.translit}
                  </p>
                  <WordMeaning word={word} compact />
                </motion.div>
              )}
            </AnimatePresence>

            {!isRevealed ? (
              <Button variant="ghost" size="sm" className="self-center" onClick={() => setRevealed((r) => ({ ...r, [word.harakat]: true }))}>
                <Eye size={16} />
                {t.lesson.warmup.reveal}
              </Button>
            ) : (
              answer === undefined && (
                <div className="flex justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onAnswer(word.harakat, true)}>
                    {t.lesson.warmup.knew}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onAnswer(word.harakat, false)}>
                    {t.lesson.warmup.notYet}
                  </Button>
                </div>
              )
            )}
          </Card>
        );
      })}

      <Button fullWidth size="lg" disabled={!allAnswered} onClick={onComplete}>
        {t.lesson.warmup.next}
      </Button>
    </div>
  );
}
