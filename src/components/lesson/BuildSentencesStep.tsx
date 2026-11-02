import { Fragment } from "react";
import { Lightbulb } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Pill";
import { ArabicText } from "../ui/ArabicText";
import { CategoryTitle } from "../ui/CategoryTitle";
import type { Category, SentencesByCategory, Word } from "../../types";
import { CATEGORIES } from "../../constants/steps";
import { findMatchedWords, suggestStarter } from "../../services/sentenceCheck";
import { highlightSegments } from "../../services/arabic";
import { useLang } from "../../hooks/useLang";
import { useHarakat } from "../../hooks/useHarakat";

interface BuildSentencesStepProps {
  words: Word[];
  sentences: SentencesByCategory;
  onChange: (cat: Category, index: number, text: string) => void;
  onComplete: () => void;
}

/**
 * Étape 2 « بناء الجمل » : une phrase libre par catégorie. Les mots de la
 * leçon reconnus (avec ou sans voyelles) sont surlignés en direct.
 */
export function BuildSentencesStep({ words, sentences, onChange, onComplete }: BuildSentencesStepProps) {
  const { t } = useLang();
  const { show } = useHarakat();

  const rows = CATEGORIES.map((cat) => {
    const catWords = words.filter((w) => w.cat === cat);
    const text = sentences[cat]?.[0] ?? "";
    const matched = findMatchedWords(text, catWords);
    return { cat, catWords, text, matched, isValid: matched.length > 0 };
  });
  const allValid = rows.every((r) => r.isValid);

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-sm text-[var(--text-muted)]">{t.lesson.build.intro}</Card>

      {rows.map(({ cat, catWords, text, matched, isValid }) => {
        const starter = show(suggestStarter(catWords[0]));
        return (
          <Card key={cat}>
            <CategoryTitle cat={cat} className="mb-3" />

            <div className="mb-3 flex flex-wrap gap-1.5" dir="rtl">
              {catWords.map((w) => (
                <Pill key={w.harakat} tone={matched.includes(w) ? "oasis" : "neutral"} className="!text-sm">
                  <ArabicText text={w.harakat} className="text-base leading-snug" />
                </Pill>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => onChange(cat, 0, e.target.value)}
              placeholder={starter}
              rows={2}
              dir="rtl"
              lang="ar"
              aria-label={t.categories[cat]}
              className="ar-content w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xl text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-oasis-400"
            />

            {!text.trim() && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-faint)]">
                <Lightbulb size={14} className="text-[var(--gold)]" />
                {t.lesson.build.starter}
                <ArabicText text={suggestStarter(catWords[0])} className="text-base text-[var(--text-muted)]" />
                <button
                  type="button"
                  onClick={() => onChange(cat, 0, show(suggestStarter(catWords[0])).replace(/…$/, " "))}
                  className="rounded-full bg-[var(--surface-alt)] px-2.5 py-1 font-bold text-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  {t.lesson.build.useStarter}
                </button>
              </div>
            )}

            {text.trim() && (
              <p dir="rtl" lang="ar" className="ar-content mt-2 rounded-xl bg-[var(--surface-alt)] px-3 py-2 text-lg text-[var(--text)]">
                {highlightSegments(text, catWords).map((seg, idx) =>
                  seg.isMatch ? (
                    <mark key={idx} className="mark-hit">
                      {seg.text}
                    </mark>
                  ) : (
                    <Fragment key={idx}>{seg.text}</Fragment>
                  )
                )}
              </p>
            )}

            {text.trim() && (
              <p className={`mt-1.5 text-xs font-bold ${isValid ? "text-oasis-600 dark:text-oasis-300" : "text-coral-400"}`}>
                {isValid ? t.lesson.build.found(matched.length) : t.lesson.build.almost}
              </p>
            )}
          </Card>
        );
      })}

      <Button fullWidth size="lg" disabled={!allValid} onClick={onComplete}>
        {t.common.continue}
      </Button>
    </div>
  );
}
