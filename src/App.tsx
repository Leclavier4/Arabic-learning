import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { LessonPage } from "./pages/Lesson";
import { MyWords } from "./pages/MyWords";
import { MemoryPalace } from "./pages/MemoryPalace";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { Onboarding } from "./pages/Onboarding";
import { Collection } from "./pages/Collection";
import { usePreferences } from "./context/PreferencesContext";

export default function App() {
  const { onboarded } = usePreferences();

  // Premier lancement : choix de la langue d'interface + présentation.
  if (!onboarded) return <Onboarding />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lesson" element={<LessonPage />} />
        <Route path="/my-words" element={<MyWords />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/memory-palace" element={<MemoryPalace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
