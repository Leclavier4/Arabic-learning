import type { Lang } from "../types";

/** Utilitaires de dates — tout est comparé en date locale "YYYY-MM-DD" (pas d'heure). */

export function todayKey(): string {
  return toKey(new Date());
}

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Nombre de jours calendaires entre deux clés "YYYY-MM-DD" (b - a). */
export function daysBetween(aKey: string, bKey: string): number {
  const [ay, am, ad] = aKey.split("-").map(Number);
  const [by, bm, bd] = bKey.split("-").map(Number);
  const a = Date.UTC(ay, am - 1, ad);
  const b = Date.UTC(by, bm - 1, bd);
  return Math.round((b - a) / 86400000);
}

export function formatFriendly(dateKey: string, lang: Lang): string {
  try {
    const [y, m, d] = dateKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    // Chiffres latins aussi en arabe, plus lisibles pour un débutant.
    return date.toLocaleDateString(lang === "ar" ? "ar-u-nu-latn" : "fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  } catch {
    return dateKey;
  }
}
