import { usePreferences } from "../context/PreferencesContext";

export type { ThemeChoice } from "../context/PreferencesContext";

/** Thème clair / sombre / auto, partagé par toute l'app (classe `dark` sur <html>). */
export function useTheme() {
  const { theme, setTheme, isDark } = usePreferences();
  return { theme, setTheme, isDark };
}
