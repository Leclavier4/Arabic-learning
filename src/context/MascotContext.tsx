import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePreferences } from "./PreferencesContext";
import { MASCOT, MASCOT_REACTION_MS } from "../config/game";
import type { Dict } from "../i18n";

/**
 * Cerveau de la mascotte : une « réaction » temporaire (pose + bulle) que
 * n'importe quel écran peut déclencher via useMascot().react(...). Quand la
 * réaction expire, chaque écran affiche sa pose/bulle de base.
 */

export type MascotPose = "idle" | "wave" | "cheer" | "think" | "sleep" | "celebrate";

/** Situations qui ont plusieurs phrases possibles (choisies au hasard, sans répétition immédiate). */
export type MascotLine = "greet" | "stepDone" | "newWord" | "locked" | "doneNode" | "tap" | "sleep" | "chestOpened";

const DEFAULT_POSE: Record<MascotLine, MascotPose> = {
  greet: "wave",
  stepDone: "cheer",
  newWord: "cheer",
  locked: "think",
  doneNode: "cheer",
  tap: "wave",
  sleep: "sleep",
  chestOpened: "celebrate",
};

export interface MascotReaction {
  pose: MascotPose;
  message: string | null;
  id: number;
}

interface MascotValue {
  /** Réaction en cours (null = l'écran affiche sa pose de base). */
  reaction: MascotReaction | null;
  /** Fait réagir la mascotte avec une phrase au hasard de la situation donnée. */
  react: (line: MascotLine, pose?: MascotPose, durationMs?: number) => void;
  /** Fait dire un message précis à la mascotte. */
  say: (message: string | null, pose?: MascotPose, durationMs?: number) => void;
  /** Renvoie une phrase au hasard (pour une bulle de base). */
  line: (line: MascotLine) => string;
  name: string;
}

const MascotContext = createContext<MascotValue | null>(null);

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const { t, lang } = usePreferences();
  const [reaction, setReaction] = useState<MascotReaction | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const lastIndex = useRef<Partial<Record<MascotLine, number>>>({});
  const counter = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const line = useCallback(
    (key: MascotLine) => {
      const list = (t as Dict).mascot[key];
      let i = Math.floor(Math.random() * list.length);
      if (list.length > 1 && i === lastIndex.current[key]) i = (i + 1) % list.length;
      lastIndex.current[key] = i;
      return list[i];
    },
    [t]
  );

  const say = useCallback((message: string | null, pose: MascotPose = "wave", durationMs = MASCOT_REACTION_MS) => {
    clearTimeout(timer.current);
    counter.current += 1;
    setReaction({ pose, message, id: counter.current });
    timer.current = setTimeout(() => setReaction(null), durationMs);
  }, []);

  const react = useCallback(
    (key: MascotLine, pose?: MascotPose, durationMs?: number) => say(line(key), pose ?? DEFAULT_POSE[key], durationMs),
    [say, line]
  );

  const value = useMemo<MascotValue>(
    () => ({ reaction, react, say, line, name: MASCOT.name[lang] }),
    [reaction, react, say, line, lang]
  );

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}

export function useMascotContext(): MascotValue {
  const ctx = useContext(MascotContext);
  if (!ctx) throw new Error("useMascot must be used within a MascotProvider");
  return ctx;
}
