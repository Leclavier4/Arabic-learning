import { Heart } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArabicText } from "../ui/ArabicText";
import { SpeakButton } from "../ui/SpeakButton";
import { WordMeaning } from "./WordMeaning";
import type { Word } from "../../types";
import { useLang } from "../../hooks/useLang";

interface MemoryStepProps {
  words: Word[];
  memoryWord: string | null;
  memoryText: string;
  alreadySaved: boolean;
  onSelectWord: (wordId: string) => void;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onComplete: () => void;
}

/** Étape 3 « اربط بذكرى » : relier un mot à un souvenir personnel (ancrage mémoriel). */
export function MemoryStep({
  words,
  memoryWord,
  memoryText,
  alreadySaved,
  onSelectWord,
  onChangeText,
  onSave,
  onComplete,
}: MemoryStepProps) {
  const { t } = useLang();
  const selected = words.find((w) => w.harakat === memoryWord);

  if (alreadySaved) {
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <Heart size={32} className="text-coral-300" />
        <h2 className="text-lg font-extrabold text-[var(--text)]">{t.lesson.memory.savedTitle}</h2>
        {selected && <ArabicText text={selected.harakat} className="text-3xl text-[var(--accent)]" />}
        <p className="text-sm text-[var(--text-muted)]">{t.lesson.memory.savedText}</p>
        <Button fullWidth size="lg" onClick={onComplete}>
          {t.common.continue}
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-sm text-[var(--text-muted)]">{t.lesson.memory.intro}</Card>

      <Card>
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.memory.choose}</h3>
        <div className="flex flex-wrap gap-2" dir="rtl">
          {words.map((w) => (
            <button
              key={w.harakat}
              type="button"
              onClick={() => onSelectWord(w.harakat)}
              aria-pressed={memoryWord === w.harakat}
              className={[
                "rounded-full px-3.5 py-1 transition",
                memoryWord === w.harakat
                  ? "bg-oasis-500 text-white dark:bg-oasis-400 dark:text-[#13200f]"
                  : "bg-[var(--surface-alt)] text-[var(--text)] hover:bg-[var(--accent-soft)]",
              ].join(" ")}
            >
              <ArabicText text={w.harakat} className="text-lg" />
            </button>
          ))}
        </div>
      </Card>

      {selected && (
        <Card>
          <div className="mb-3 flex items-center gap-3">
            <SpeakButton text={selected.harakat} />
            <ArabicText text={selected.harakat} className="text-2xl font-semibold text-[var(--text)]" />
            <span className="ms-auto">
              <WordMeaning word={selected} compact />
            </span>
          </div>
          <label className="mb-2 block text-sm font-extrabold uppercase tracking-wide text-[var(--text-faint)]" htmlFor="memory-text">
            {t.lesson.memory.yourMemory}
          </label>
          <textarea
            id="memory-text"
            value={memoryText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={t.lesson.memory.placeholder}
            rows={4}
            dir="auto"
            className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-3 text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-oasis-400"
          />
        </Card>
      )}

      <Button fullWidth size="lg" disabled={!memoryWord || !memoryText.trim()} onClick={onSave}>
        <Heart size={18} />
        {t.lesson.memory.save}
      </Button>
    </div>
  );
}
