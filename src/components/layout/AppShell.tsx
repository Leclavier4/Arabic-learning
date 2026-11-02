import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { GlobalCelebrations } from "./GlobalCelebrations";
import { SpeechNotice } from "./SpeechNotice";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-5">{children}</main>
      <BottomNav />
      <GlobalCelebrations />
      <SpeechNotice />
    </div>
  );
}
