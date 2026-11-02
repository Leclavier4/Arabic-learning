import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StarMark, ArabesqueDivider } from "../components/ui/Ornament";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { usePreferences } from "../context/PreferencesContext";
import { useLang } from "../hooks/useLang";

/**
 * Premier lancement : choix de la langue d'interface (bascule LTR/RTL en
 * direct) et présentation rapide du principe de l'app.
 */
export function Onboarding() {
  const { completeOnboarding } = usePreferences();
  const { t } = useLang();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-5 px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2 text-center">
        <StarMark size={64} className="text-sage-500 dark:text-sage-400" />
        <p lang="ar" dir="rtl" className="ar-content text-5xl font-bold text-[var(--text)]">
          كَلِمَاتِي
        </p>
        <h1 className="text-2xl font-black text-[var(--text)]">{t.onboarding.welcome}</h1>
        <p className="text-[var(--text-muted)]">{t.onboarding.subtitle}</p>
      </motion.div>

      <Card className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-black text-[var(--text)]">{t.onboarding.chooseLang}</h2>
        <LanguageSwitch large />
        <p className="text-xs text-[var(--text-faint)]">{t.onboarding.canChange}</p>
      </Card>

      <Card>
        <h2 className="mb-3 font-black text-[var(--text)]">{t.onboarding.how}</h2>
        <ul className="flex flex-col gap-2.5">
          {t.onboarding.points.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-[var(--text-muted)]">
              <Check size={18} className="mt-0.5 shrink-0 text-sage-500" />
              {point}
            </li>
          ))}
        </ul>
      </Card>

      <ArabesqueDivider />

      <Button size="lg" fullWidth onClick={completeOnboarding}>
        {t.onboarding.start}
      </Button>
    </main>
  );
}
