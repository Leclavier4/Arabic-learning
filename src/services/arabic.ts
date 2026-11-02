import type { Word } from "../types";

/**
 * Outils pour le texte arabe : retrait des harakât, normalisation pour la
 * comparaison (l'apprenant tape rarement les voyelles), détection des mots
 * de la leçon dans une phrase libre et découpage pour le surlignage.
 */

const HARAKAT = "\\u064B-\\u065F\\u0670\\u0640"; // voyelles, tanwīn, shadda, sukūn, alif suscrit, tatwīl
const HARAKAT_RE = new RegExp(`[${HARAKAT}]`, "g");
const LETTERS = "\\u0620-\\u064A";
const PUNCT = `.,!?;:«»"'()\\-–—…،؛؟`;
const PUNCT_RE = new RegExp(`[${PUNCT}]`, "g");

/** Retire toutes les harakât d'un texte (utilisé aussi par le bouton « masquer les voyelles »). */
export function stripHarakat(text: string): string {
  return text.replace(HARAKAT_RE, "");
}

/**
 * Forme canonique pour comparer deux textes arabes : sans voyelles, sans
 * ponctuation, variantes d'alif/hamza/tā' marbūṭa unifiées.
 */
export function normalizeArabic(text: string): string {
  return stripHarakat(text)
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىئ]/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ة/g, "ه")
    .replace(PUNCT_RE, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Formes à rechercher pour un mot. Pour un verbe, on accepte aussi la forme
 * du présent et son radical sans préfixe (ex. أَقُولُ → « قول » retrouve
 * يَقُولُ, نَقُولُ…), car l'apprenant conjugue rarement au passé de citation.
 */
export function matchTokens(word: Word): string[] {
  const tokens = new Set<string>([normalizeArabic(word.harakat)]);
  if (word.present) {
    const present = normalizeArabic(word.present);
    tokens.add(present);
    const stem = present.slice(1);
    if (stem.length >= 3) tokens.add(stem);
  }
  return [...tokens].filter(Boolean);
}

/** Un mot court ou un connecteur doit apparaître comme mot entier (évite « ثم » dans « ثمن »). */
function isStrict(word: Word, token: string): boolean {
  return word.cat === "linking" || token.replace(/ /g, "").length <= 2;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function tokenFoundIn(normalizedText: string, token: string, strict: boolean): boolean {
  if (!strict) return normalizedText.includes(token);
  // Mot entier, avec préfixes/suffixes arabes courants autorisés.
  const re = new RegExp(`(?:^| )(?:و|ف|ب|ال|وال)?${escapeRe(token)}(?:ه|ا|ون|ين)?(?= |$)`);
  return re.test(normalizedText);
}

/** Retourne les mots de `words` retrouvés dans `sentence` (voyelles et ponctuation ignorées). */
export function findMatchedWords(sentence: string, words: Word[]): Word[] {
  const normalized = normalizeArabic(sentence);
  if (!normalized) return [];
  return words.filter((w) => matchTokens(w).some((t) => tokenFoundIn(normalized, t, isStrict(w, t))));
}

// ── Surlignage dans un texte brut (avec ou sans harakât) ────────────────

const LETTER_CLASS: Record<string, string> = {
  ا: "[اأإآٱ]",
  ي: "[يىئ]",
  ه: "[هة]",
  و: "[وؤ]",
  " ": `[\\s${PUNCT}]+`,
};

/** Transforme une forme normalisée en motif tolérant (voyelles optionnelles entre chaque lettre). */
function tokenToPattern(token: string, strict: boolean): string {
  const body = [...token]
    .map((ch) => LETTER_CLASS[ch] ?? escapeRe(ch))
    .join(`[${HARAKAT}]*`);
  const core = `${body}[${HARAKAT}]*`;
  // Surligne le mot entier qui contient la forme trouvée (ex. « يَكْتُبُ » et pas seulement « كتب »).
  if (!strict) return `[${LETTERS}${HARAKAT}]*${core}[${LETTERS}${HARAKAT}]*`;
  // Début de mot (éventuellement après و / ف / ب) et fin de mot.
  return `(?<=^|[^${LETTERS}${HARAKAT}]|(?:^|[^${LETTERS}])[وفب][${HARAKAT}]*)${core}(?![${LETTERS}])`;
}

/** Découpe un texte en segments {text, isMatch} pour le rendu avec <mark>. */
export function highlightSegments(text: string, words: Word[]): { text: string; isMatch: boolean }[] {
  const tokens = words
    .flatMap((w) => matchTokens(w).map((t) => ({ t, strict: isStrict(w, t) })))
    .sort((a, b) => b.t.length - a.t.length); // les plus longs d'abord
  if (!text || !tokens.length) return [{ text, isMatch: false }];

  let regex: RegExp;
  try {
    regex = new RegExp(tokens.map(({ t, strict }) => tokenToPattern(t, strict)).join("|"), "g");
  } catch {
    // Vieux navigateurs sans lookbehind (Safari < 16.4) : surlignage sans bornes de mot.
    regex = new RegExp(tokens.map(({ t }) => tokenToPattern(t, false)).join("|"), "g");
  }
  const segments: { text: string; isMatch: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match[0] === "") {
      regex.lastIndex++; // garde-fou anti boucle infinie
      continue;
    }
    if (match.index > lastIndex) segments.push({ text: text.slice(lastIndex, match.index), isMatch: false });
    segments.push({ text: match[0], isMatch: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), isMatch: false });
  return segments;
}
