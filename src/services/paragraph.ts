import type { Word } from "../types";

/**
 * Génère un court paragraphe arabe vocalisé (7 phrases) qui réutilise les
 * mots du jour — 100 % déterministe, côté client, sans IA ni API.
 *
 * Principe : chaque gabarit est une phrase arabe avec 4 emplacements :
 *   v = verbe au présent, 1re personne (أَكْتُبُ « j'écris »)
 *   a = adjectif masculin, attribut au nominatif (أَنَا سَعِيدٌ)
 *   l = connecteur placé en tête de proposition (لِذَلِكَ، ثُمَّ…)
 *   e = expression, citée entre guillemets «…»
 * Les gabarits respectent l'accord grammatical (sujets masculins, attribut
 * au nominatif) pour que tous les mots s'insèrent correctement.
 * Le paragraphe est rendu sous forme de segments : on sait exactement où
 * sont les mots du jour, ce qui rend le surlignage fiable.
 */

export type ParagraphPart = { text: string; word?: Word };

const verbForm = (w: Word) => w.present ?? w.harakat;
const P = (word: Word, text = word.harakat): ParagraphPart => ({ text, word });
const T = (text: string): ParagraphPart => ({ text });

type Template = (v: Word, a: Word, l: Word, e: Word) => ParagraphPart[];

const TEMPLATES: Template[] = [
  (v, a, l, e) => [
    P(l), T(" "), P(v, verbForm(v)), T(" فِي الصَّبَاحِ وَأَقُولُ: «"), P(e),
    T("»، لِأَنَّ يَوْمِي "), P(a), T("."),
  ],
  (v, a, l, e) => [
    T("قَالَ لِي صَدِيقِي: «"), P(e), T("»، "), P(l), T(" "), P(v, verbForm(v)),
    T(" مَعَهُ، وَأَنَا "), P(a), T("."),
  ],
  (v, a, l, e) => [
    T("اليَوْمَ أَنَا "), P(a), T("، "), P(l), T(" "), P(v, verbForm(v)),
    T(" بِهُدُوءٍ، ثُمَّ أَقُولُ: «"), P(e), T("»."),
  ],
  (v, a, l, e) => [
    T("أَقُولُ لِنَفْسِي: «"), P(e), T("»، "), P(l), T(" "), P(v, verbForm(v)),
    T(" قَلِيلًا، لِأَنَّ قَلْبِي "), P(a), T("."),
  ],
  (v, a, l, e) => [
    T("فِي المَسَاءِ "), P(v, verbForm(v)), T(" مَعَ عَائِلَتِي، "), P(l),
    T(" يَقُولُ أَبِي: «"), P(e), T("»، وَهُوَ "), P(a), T(" جِدًّا."),
  ],
];

export function generateParagraph(words: Word[]): { sentences: ParagraphPart[][]; text: string } {
  const by = (cat: string) => words.filter((w) => w.cat === cat);
  const verbs = by("verb");
  const adjectives = by("adjective");
  const linking = by("linking");
  const expressions = by("expression");

  const n = Math.min(verbs.length, adjectives.length, linking.length, expressions.length);
  const sentences: ParagraphPart[][] = [];

  for (let i = 0; i < n; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];
    sentences.push(template(verbs[i], adjectives[i], linking[i], expressions[i]));
  }

  // Deux phrases de clôture qui réutilisent des mots du jour (renforcement).
  if (n > 0) {
    sentences.push([
      T("«"), P(expressions[0]), T("»… هَكَذَا كَانَ يَوْمِي مَعَ كَلِمَاتِي الجَدِيدَةِ."),
    ]);
    sentences.push([
      T("غَدًا "), P(verbs[n - 1], verbForm(verbs[n - 1])), T(" مِنْ جَدِيدٍ، وَأَنَا "),
      P(adjectives[0]), T(" إِنْ شَاءَ اللهُ."),
    ]);
  }

  const text = sentences.map((parts) => parts.map((p) => p.text).join("")).join(" ");
  return { sentences, text };
}
