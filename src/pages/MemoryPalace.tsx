import { Heart } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Pill } from "../components/ui/Pill";
import { SpeakButton } from "../components/ui/SpeakButton";
import { ArabicText } from "../components/ui/ArabicText";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";
import { CATEGORY_AR, CATEGORY_EMOJI } from "../constants/steps";
import { formatFriendly } from "../services/date";
import { lookupWord } from "../services/wordLookup";

/** « ذاكرتي / Mon palais de mémoire » : tous les souvenirs associés à des mots. */
export function MemoryPalace() {
  const { state } = useProgress();
  const { t, lang } = useLang();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="flex flex-wrap items-baseline gap-x-2 text-2xl font-black text-[var(--text)]">
          {t.memories.title}
          {lang === "fr" && (
            <span lang="ar" className="ar-content text-xl text-[var(--accent)]">
              ذاكرتي
            </span>
          )}
        </h1>
        <p className="text-[var(--text-muted)]">{t.memories.subtitle}</p>
      </div>

      {state.memories.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-10 text-center text-[var(--text-muted)]">
          <Heart size={32} className="text-clay-300" />
          {t.memories.empty}
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {state.memories.map((m) => {
            const word = lookupWord(m.word);
            return (
              <li key={m.id}>
                <Card>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <SpeakButton text={m.word} size={16} />
                      <ArabicText text={m.word} className="text-2xl font-semibold text-[var(--text)]" />
                      {word && (
                        <span className="text-sm italic text-[var(--text-faint)]" dir="ltr">
                          {word.translit}
                        </span>
                      )}
                    </div>
                    <Pill tone="sage">
                      <span aria-hidden>{CATEGORY_EMOJI[m.category]}</span>
                      {lang === "fr" ? t.categories[m.category] : CATEGORY_AR[m.category]}
                    </Pill>
                  </div>
                  <p className="whitespace-pre-line text-[var(--text)]" dir="auto">
                    {m.text}
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-faint)]">{formatFriendly(m.date, lang)}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
