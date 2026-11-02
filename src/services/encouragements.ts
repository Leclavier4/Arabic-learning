import type { Dict } from "../i18n";

/** Messages d'encouragement bilingues — jamais de jugement, toujours bienveillants. */
type EncouragementStep = keyof Dict["encouragements"];

export function encouragementFor(t: Dict, step: string, seed = Date.now()): string {
  const key: EncouragementStep = step in t.encouragements ? (step as EncouragementStep) : "generic";
  const list = t.encouragements[key];
  return list[Math.abs(seed) % list.length];
}
