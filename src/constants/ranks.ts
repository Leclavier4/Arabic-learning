import type { Rank } from "../types";

/**
 * Rangs progressifs bilingues — l'apprenant monte de grade au fil de son XP.
 * XP gagnés par étape de leçon validée (voir constants/steps.ts).
 */
export const RANKS: Rank[] = [
  { id: "little-fennec", name: { ar: "فَنَكٌ صَغِير", fr: "Petit fennec" }, minXp: 0, emoji: "🦊" },
  { id: "dune-explorer", name: { ar: "مُسْتَكْشِفُ الكُثْبَان", fr: "Explorateur des dunes" }, minXp: 150, emoji: "🏜️" },
  { id: "oasis-friend", name: { ar: "صَدِيقُ الوَاحَة", fr: "Ami de l'oasis" }, minXp: 400, emoji: "🌴" },
  { id: "caravan-teller", name: { ar: "رَاوِي القَافِلَة", fr: "Conteur de la caravane" }, minXp: 800, emoji: "🐪" },
  { id: "desert-star", name: { ar: "نَجْمُ الصَّحْرَاء", fr: "Étoile du désert" }, minXp: 1400, emoji: "🌟" },
  { id: "word-sultan", name: { ar: "سُلْطَانُ الكَلِمَات", fr: "Sultan des mots" }, minXp: 2200, emoji: "👑" },
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
