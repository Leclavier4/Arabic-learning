import { usePreferences } from "../context/PreferencesContext";

/**
 * Langue d'interface : `t` = dictionnaire courant (fr ou ar), `dir` = sens
 * de lecture de l'interface. Le contenu arabe à apprendre, lui, est toujours
 * affiché en RTL (voir <ArabicText>).
 */
export function useLang() {
  const { lang, setLang, t, dir } = usePreferences();
  return { lang, setLang, t, dir, isRtl: dir === "rtl" };
}
