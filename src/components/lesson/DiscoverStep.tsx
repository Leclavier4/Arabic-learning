import { Button } from "../ui/Button";
import { CategoryTitle } from "../ui/CategoryTitle";
import { Flashcard } from "./Flashcard";
import type { Word } from "../../types";
import { CATEGORIES } from "../../constants/steps";
import { useLang } from "../../hooks/useLang";
import { useMascot } from "../../hooks/useMascot";
import { playSound } from "../../services/sound";

interface DiscoverStepProps {
  words: Word[];
  flippedWords: string[];
  onFlip: (wordId: string) => void;
  onComplete: () => void;
}

/** Étape 1 « الاكتشاف » : les 20 mots en grandes cartes. Chaque nouvelle carte = une étoile. */
export function DiscoverStep({ words, flippedWords, onFlip, onComplete }: DiscoverStepProps) {
  const { t } = useLang();
  const { react, say } = useMascot();
  const flippedCount = words.filter((w) => flippedWords.includes(w.harakat)).length;
  const allFlipped = flippedCount >= words.length;

  const handleFlip = (wordId: string) => {
    const isNew = !flippedWords.includes(wordId);
    onFlip(wordId);
    if (!isNew) return;
    playSound("star");
    if (flippedCount + 1 >= words.length) say(t.mascot.allCards, "celebrate");
    else react("newWord", "cheer", 1800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Compteur d'étoiles de l'étape */}
      <div className="flex items-center justify-center">
        <span className="game-card rounded-full border-2 border-sun-300 bg-sun-100 px-4 py-1.5 text-lg font-extrabold text-sun-600 dark:bg-sun-300/15 dark:text-sun-200">
          {t.game.starsCount(flippedCount, words.length)}
        </span>
      </div>

      {CATEGORIES.map((cat) => {
        const catWords = words.filter((w) => w.cat === cat);
        if (!catWords.length) return null;
        return (
          <section key={cat}>
            <CategoryTitle cat={cat} className="mb-2.5" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {catWords.map((w) => (
                <Flashcard key={w.harakat} word={w} earned={flippedWords.includes(w.harakat)} onFlip={handleFlip} />
              ))}
            </div>
          </section>
        );
      })}

      <Button fullWidth size="lg" disabled={!allFlipped} onClick={onComplete} silent>
        {allFlipped ? t.common.continue : t.lesson.discover.flipAll(flippedCount, words.length)}
      </Button>
    </div>
  );
}
