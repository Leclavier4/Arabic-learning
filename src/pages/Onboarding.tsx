import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Mascot } from "../components/mascot/Mascot";
import { DesertBackdrop } from "../components/game/DesertBackdrop";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { usePreferences } from "../context/PreferencesContext";
import { useLang } from "../hooks/useLang";
import { useMascot } from "../hooks/useMascot";
import { playSound } from "../services/sound";

/**
 * Premier lancement : Fenek se présente, l'enfant choisit la langue de
 * l'interface (bascule LTR/RTL en direct), puis découvre le principe du jeu.
 */
export function Onboarding() {
  const { completeOnboarding } = usePreferences();
  const { t } = useLang();
  const { reaction, name } = useMascot();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-5 px-5 py-10">
      <DesertBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center gap-1 text-center"
      >
        <Mascot pose={reaction?.pose ?? "wave"} message={reaction?.message ?? t.mascot.intro(name)} size={130} bubble="top" />
        <p lang="ar" dir="rtl" className="ar-content mt-2 text-5xl font-bold text-oasis-500 dark:text-oasis-300">
          كَلِمَاتِي
        </p>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">{t.onboarding.welcome}</h1>
        <p className="font-semibold text-[var(--text-muted)]">{t.onboarding.subtitle}</p>
      </motion.div>

      <Card className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-extrabold text-[var(--text)]">{t.onboarding.chooseLang}</h2>
        <LanguageSwitch large />
        <p className="text-xs text-[var(--text-faint)]">{t.onboarding.canChange}</p>
      </Card>

      <Card>
        <h2 className="mb-3 font-extrabold text-[var(--text)]">{t.onboarding.how}</h2>
        <ul className="flex flex-col gap-2.5">
          {t.onboarding.points.map((point) => (
            <li key={point} className="flex gap-2 text-sm font-semibold text-[var(--text-muted)]">
              <Check size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-oasis-500" />
              {point}
            </li>
          ))}
        </ul>
      </Card>

      <Button
        variant="sun"
        size="lg"
        fullWidth
        silent
        onClick={() => {
          playSound("success");
          completeOnboarding();
        }}
      >
        {t.onboarding.start}
      </Button>
    </main>
  );
}
