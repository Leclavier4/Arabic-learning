import { useCallback } from "react";
import { usePreferences } from "../context/PreferencesContext";
import { stripHarakat } from "../services/arabic";

/** Affichage des voyelles : `show(text)` renvoie le texte avec ou sans harakât selon la préférence. */
export function useHarakat() {
  const { showHarakat, setShowHarakat, toggleHarakat } = usePreferences();
  const show = useCallback((text: string) => (showHarakat ? text : stripHarakat(text)), [showHarakat]);
  return { showHarakat, setShowHarakat, toggleHarakat, show };
}
