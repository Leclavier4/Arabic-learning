/**
 * Petite couche d'accès au localStorage, tolérante aux erreurs (mode privé,
 * quota dépassé, storage désactivé...). Toujours utiliser ces fonctions
 * plutôt que localStorage directement.
 */

const NAMESPACE = "kalimati";

function key(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export function readJSON<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(name: string, value: T): boolean {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Efface toutes les données Kalimati, sauf les clés listées dans `keep` (ex. préférences). */
export function clearAllKalimatiData(keep: string[] = []): void {
  try {
    const keepKeys = new Set(keep.map(key));
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(`${NAMESPACE}:`) && !keepKeys.has(k)) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}
