import { useMemo } from "react";
import { Mic, Volume2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArabesqueDivider } from "../ui/Ornament";
import type { Word } from "../../types";
import { generateParagraph } from "../../services/paragraph";
import { speak } from "../../services/speech";
import { useLang } from "../../hooks/useLang";
import { useHarakat } from "../../hooks/useHarakat";

interface ReadParagraphStepProps {
  words: Word[];
  readDone: boolean;
  onMarkRead: () => void;
  onContinue: () => void;
}

/**
 * Étape 4 « اقرأ الفقرة » : un paragraphe arabe vocalisé généré côté client
 * à partir des mots du jour (surlignés), à lire à voix haute. Aucun jugement
 * sur la prononciation.
 */
export function ReadParagraphStep({ words, readDone, onMarkRead, onContinue }: ReadParagraphStepProps) {
  const { t } = useLang();
  const { show } = useHarakat();
  const { sentences, text } = useMemo(() => generateParagraph(words), [words]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-sm text-[var(--text-muted)]">{t.lesson.read.intro}</Card>

      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-[var(--text-faint)]">{t.lesson.read.story}</h3>
          <button
            type="button"
            onClick={() => speak(text, 0.75)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-bold text-[var(--accent)]"
          >
            <Volume2 size={14} className="rtl:-scale-x-100" />
            {t.common.listen}
          </button>
        </div>
        <ArabesqueDivider className="mb-4" />

        {/* Le contenu arabe est toujours en RTL, quelle que soit la langue d'interface. */}
        <p dir="rtl" lang="ar" className="ar-content text-[1.4rem] leading-[2.3] text-[var(--text)] sm:text-2xl sm:leading-[2.3]">
          {sentences.map((parts, i) => (
            <span key={i}>
              {parts.map((part, j) =>
                part.word ? (
                  <mark key={j} className="mark-hit">
                    {show(part.text)}
                  </mark>
                ) : (
                  <span key={j}>{show(part.text)}</span>
                )
              )}{" "}
            </span>
          ))}
        </p>

        <ArabesqueDivider className="mt-4" />
        <p className="mt-2 text-xs text-[var(--text-faint)]">{t.lesson.read.sentences(sentences.length)}</p>
      </Card>

      {readDone ? (
        <>
          <Card className="text-center text-sm font-bold text-oasis-600 dark:text-oasis-300">{t.lesson.read.bravo}</Card>
          <Button fullWidth size="lg" onClick={onContinue}>
            {t.common.continue}
          </Button>
        </>
      ) : (
        <Button fullWidth size="lg" onClick={onMarkRead}>
          <Mic size={20} />
          {t.lesson.read.done}
        </Button>
      )}
    </div>
  );
}
