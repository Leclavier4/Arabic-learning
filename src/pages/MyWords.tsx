import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { PageMascot } from "../components/mascot/PageMascot";
import { Pill } from "../components/ui/Pill";
import { SpeakButton } from "../components/ui/SpeakButton";
import { ArabicText } from "../components/ui/ArabicText";
import { meaningFor } from "../components/lesson/WordMeaning";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";
import { lookupWord } from "../services/wordLookup";
import { normalizeArabic } from "../services/arabic";
import { CATEGORIES, CATEGORY_AR, CATEGORY_EMOJI } from "../constants/steps";
import type { Category, Word } from "../types";

/** Retire les signes diacritiques latins (ā → a, ʿ → rien) pour chercher dans la translittération. */
const plainLatin = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʿʾ'-]/g, "")
    .toLowerCase();

/** Page « كلماتي / Mes mots » : tous les mots appris, filtrables, avec audio. */
export function MyWords() {
  const { state } = useProgress();
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const qAr = normalizeArabic(query);
    const qLatin = plainLatin(query.trim());
    return Object.entries(state.learnedWords)
      .map(([id, meta]) => ({ word: lookupWord(id), day: meta.day }))
      .filter((r): r is { word: Word; day: number } => Boolean(r.word))
      .filter((r) => filter === "all" || r.word.cat === filter)
      .filter(({ word }) => {
        if (!qLatin && !qAr) return true;
        return (
          (qAr && normalizeArabic(word.harakat).includes(qAr)) ||
          (qLatin && plainLatin(word.translit).includes(qLatin)) ||
          (qLatin && plainLatin(word.fr).includes(qLatin))
        );
      })
      .sort((a, b) => b.day - a.day);
  }, [state.learnedWords, filter, query]);

  const total = Object.keys(state.learnedWords).length;

  return (
    <div className="flex flex-col gap-4">
      <PageMascot
        title={lang === "fr" ? `${t.myWords.title} · كلماتي` : t.myWords.title}
        subtitle={t.myWords.count(total)}
        message={t.mascot.pages.myWords}
      />

      <div className="relative">
        <Search size={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.myWords.search}
          dir="auto"
          className="game-card w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] py-3 pe-3 ps-10 text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-oasis-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", ...CATEGORIES] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={[
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition",
              filter === f
                ? "bg-oasis-500 text-white dark:bg-oasis-400 dark:text-[#13200f]"
                : "bg-[var(--surface-alt)] text-[var(--text-muted)]",
            ].join(" ")}
          >
            {f === "all" ? t.myWords.all : `${CATEGORY_EMOJI[f]} ${lang === "fr" ? t.categories[f] : CATEGORY_AR[f]}`}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card className="text-center text-[var(--text-muted)]">{total === 0 ? t.myWords.empty : t.myWords.noResult}</Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map(({ word, day }) => (
            <li key={word.harakat}>
              <Card className="flex items-center gap-3 !py-3">
                <SpeakButton text={word.harakat} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <ArabicText text={word.harakat} className="text-2xl font-semibold text-[var(--text)]" />
                    <span className="text-sm italic text-[var(--text-faint)]" dir="ltr">
                      {word.translit}
                    </span>
                  </div>
                  <p className="truncate text-sm text-[var(--text-muted)]" title={word.fr}>
                    {meaningFor(word, lang)}
                    {lang === "ar" && (
                      <span className="text-[var(--text-faint)]" dir="ltr">
                        {" "}
                        · {word.fr}
                      </span>
                    )}
                  </p>
                </div>
                <Pill tone="neutral" className="shrink-0">
                  {t.myWords.day(day)}
                </Pill>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
