import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Pill";
import { ArabicText } from "../ui/ArabicText";
import type { Word } from "../../types";
import { useLang } from "../../hooks/useLang";

interface PracticeStepProps {
  words: Word[];
  onFinish: () => void;
}

/** Étape 5 « تدرّب في الحياة » : raconter sa journée à un proche avec les mots du jour. */
export function PracticeStep({ words, onFinish }: PracticeStepProps) {
  const { t, lang } = useLang();
  const [checked, setChecked] = useState(false);
  // Quelques mots faciles à placer : 2 verbes (au présent), 2 adjectifs, 2 expressions.
  const hints = [
    ...words.filter((w) => w.cat === "verb").slice(0, 2),
    ...words.filter((w) => w.cat === "adjective").slice(0, 2),
    ...words.filter((w) => w.cat === "expression").slice(0, 2),
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center gap-2 text-center">
        <MessageCircleHeart size={32} className="text-sage-400" />
        <h2 className="text-lg font-black text-[var(--text)]">{t.lesson.practice.title}</h2>
        <p className="text-sm text-[var(--text-muted)]">{t.lesson.practice.text}</p>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold text-[var(--text-muted)]">{t.lesson.practice.wordsHint}</p>
        <div className="flex flex-wrap gap-2" dir="rtl">
          {hints.map((w) => (
            <Pill key={w.harakat} tone="sand">
              <ArabicText text={w.present ?? w.harakat} className="text-base" />
            </Pill>
          ))}
        </div>
      </Card>

      <Card>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="h-6 w-6 shrink-0 rounded-lg accent-sage-500"
          />
          <span className="font-bold text-[var(--text)]">{t.lesson.practice.check}</span>
          {lang === "fr" && (
            <span lang="ar" className="ar-content ms-auto text-[var(--accent)]">
              حَكَيْتُ عَنْ يَوْمِي
            </span>
          )}
        </label>
      </Card>

      <Button fullWidth size="lg" disabled={!checked} onClick={onFinish}>
        {t.lesson.practice.finish}
      </Button>
    </div>
  );
}
