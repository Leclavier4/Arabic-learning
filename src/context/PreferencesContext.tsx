import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "../types";
import { DICTIONARIES, type Dict } from "../i18n";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * Préférences d'affichage, indépendantes de la progression :
 * - langue d'interface (fr → LTR, ar → RTL, appliquée sur <html>)
 * - affichage des harakât (voyelles) dans le contenu arabe
 * - thème clair / sombre / auto
 * - onboarding déjà vu ou non
 * Toutes sont persistées dans localStorage.
 */

export type ThemeChoice = "light" | "dark" | "system";

export const PREFERENCE_KEYS = ["lang", "harakat", "theme", "onboarded"];

interface PreferencesValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  dir: "ltr" | "rtl";
  showHarakat: boolean;
  setShowHarakat: (show: boolean) => void;
  toggleHarakat: () => void;
  theme: ThemeChoice;
  setTheme: (theme: ThemeChoice) => void;
  isDark: boolean;
  onboarded: boolean;
  completeOnboarding: () => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

function guessLang(): Lang {
  try {
    return navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "fr";
  } catch {
    return "fr";
  }
}

function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>("lang", guessLang);
  const [showHarakat, setShowHarakat] = useLocalStorage<boolean>("harakat", true);
  const [theme, setTheme] = useLocalStorage<ThemeChoice>("theme", "system");
  const [onboarded, setOnboarded] = useLocalStorage<boolean>("onboarded", false);
  const [systemDark, setSystemDark] = useState(prefersDark);

  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark" || (theme === "system" && systemDark);

  // Langue + sens de lecture sur <html> : tout le layout bascule en RTL/LTR.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
  }, [lang, dir]);

  // Suit le thème du système quand le choix est "auto".
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#1A221C" : "#5F8A5B");
  }, [isDark]);

  const toggleHarakat = useCallback(() => setShowHarakat((s) => !s), [setShowHarakat]);
  const completeOnboarding = useCallback(() => setOnboarded(true), [setOnboarded]);

  const value = useMemo<PreferencesValue>(
    () => ({
      lang,
      setLang,
      t: DICTIONARIES[lang],
      dir,
      showHarakat,
      setShowHarakat,
      toggleHarakat,
      theme,
      setTheme,
      isDark,
      onboarded,
      completeOnboarding,
    }),
    [lang, setLang, dir, showHarakat, setShowHarakat, toggleHarakat, theme, setTheme, isDark, onboarded, completeOnboarding]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within a PreferencesProvider");
  return ctx;
}
