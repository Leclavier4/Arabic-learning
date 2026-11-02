import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { GameHud } from "../game/GameHud";
import { DesertBackdrop } from "../game/DesertBackdrop";
import { BottomNav } from "./BottomNav";
import { GlobalCelebrations } from "./GlobalCelebrations";
import { SpeechNotice } from "./SpeechNotice";
import { usePreferences } from "../../context/PreferencesContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { reducedMotion } = usePreferences();
  return (
    // « Réduire les animations » : Framer Motion coupe les mouvements partout.
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <div className="flex min-h-screen flex-col">
        <DesertBackdrop />
        <GameHud />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-4">{children}</main>
        <BottomNav />
        <GlobalCelebrations />
        <SpeechNotice />
      </div>
    </MotionConfig>
  );
}
