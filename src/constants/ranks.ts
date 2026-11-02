import type { Rank } from "../types";

/**
 * Rangs progressifs bilingues — l'apprenant monte de grade au fil de son XP.
 * XP gagnés par étape de leçon validée (voir constants/steps.ts).
 */
export const RANKS: Rank[] = [
  { id: "beginner", name: { ar: "مُبْتَدِئ", fr: "Débutant" }, minXp: 0, emoji: "🌱" },
  { id: "explorer", name: { ar: "مُسْتَكْشِف", fr: "Explorateur" }, minXp: 150, emoji: "🧭" },
  { id: "speaker", name: { ar: "مُتَحَدِّث", fr: "Locuteur" }, minXp: 400, emoji: "💬" },
  { id: "storyteller", name: { ar: "رَاوٍ", fr: "Conteur" }, minXp: 800, emoji: "📖" },
  { id: "fluent-friend", name: { ar: "صَدِيقٌ طَلِيق", fr: "Ami fluide" }, minXp: 1400, emoji: "🤝" },
  { id: "word-master", name: { ar: "سَيِّدُ الكَلِمَات", fr: "Maître des mots" }, minXp: 2200, emoji: "👑" },
];

export function getRankForXp(xp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) current = rank;
  }
  return current;
}

export function getNextRank(xp: number): Rank | null {
  const current = getRankForXp(xp);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] ?? null;
}

/** Progression (0–1) vers le prochain rang, pour la barre de progression. */
export function getRankProgress(xp: number): number {
  const current = getRankForXp(xp);
  const next = getNextRank(xp);
  if (!next) return 1;
  const span = next.minXp - current.minXp;
  return Math.max(0, Math.min(1, (xp - current.minXp) / span));
}
