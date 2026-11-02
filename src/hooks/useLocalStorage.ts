import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "../services/storage";

/**
 * Hook générique de persistance localStorage (try/catch géré par services/storage).
 * Utilisé pour les petites préférences (langue, thème, voyelles…).
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() =>
    readJSON<T>(key, typeof initialValue === "function" ? (initialValue as () => T)() : initialValue)
  );

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : next));
  }, []);

  return [value, update] as const;
}
