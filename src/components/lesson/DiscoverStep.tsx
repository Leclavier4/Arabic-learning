import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { CategoryTitle } from "../ui/CategoryTitle";
import { Flashcard } from "./Flashcard";
import type { Word } from "../../types";
import { CATEGORIES } from "../../constants/steps";
import { useLang } from "../../hooks/useLang";

interface DiscoverStepProps {
  words: Word[];
  flippedWords: string[];
  onFlip: (wordId: string) => void;
  onComplete: () => void;
}

/** Étape 1 « الاكتشاف » : les 20 mots en flashcards, groupés par catégorie. */
export function DiscoverStep({ words, flippedWords, onFlip, onComplete }: DiscoverStepProps) {
  const { t } = useLang();
  const flippedCount = words.filter((w) => flippedWords.includes(w.harakat)).length;
  const allFlipped = flippedCount >= words.length;

  return (
    <div className="flex flex-col gap-6">
      <Card className="text-sm text-[var(--text-muted)]">{t.lesson.discover.intro(flippedCount, words.length)}</Card>

      {CATEGORIES.map((cat) => {
        const catWords = words.filter((w) => w.cat === cat);
        if (!catWords.length) return null;
        return (
          <section key={cat}>
            <CategoryTitle cat={cat} className="mb-2" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {catWords.map((w) => (
                <Flashcard key={w.harakat} word={w} onFlip={onFlip} />
              ))}
            </div>
          </section>
        );
      })}

      <Button fullWidth size="lg" disabled={!allFlipped} onClick={onComplete}>
        {allFlipped ? t.common.continue : t.lesson.discover.flipAll(flippedCount, words.length)}
      </Button>
    </div>
  );
}
