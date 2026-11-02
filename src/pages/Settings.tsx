import { useCallback, useState } from "react";
import { AlertTriangle, Info, RotateCcw, Smartphone } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Toast } from "../components/ui/Toast";
import { ArabicText } from "../components/ui/ArabicText";
import { ThemeToggle } from "../components/layout/ThemeToggle";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";
import { useHarakat } from "../hooks/useHarakat";
import { STATS } from "../data/wordbank.js";

const sectionTitle = "mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--text-faint)]";

export function Settings() {
  const { resetAll } = useProgress();
  const { t } = useLang();
  const { showHarakat, setShowHarakat } = useHarakat();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const clearMessage = useCallback(() => setMessage(null), []);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetAll();
    setConfirming(false);
    setMessage(t.settings.resetDone);
  };

  const segment = (active: boolean) =>
    [
      "rounded-full px-4 py-2 text-sm font-bold transition",
      active ? "bg-sage-500 text-white dark:bg-sage-400 dark:text-[#13200f]" : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)]",
    ].join(" ");

  return (
    <div className="flex flex-col gap-4">
      <Toast message={message} onDone={clearMessage} />
      <h1 className="text-2xl font-black text-[var(--text)]">{t.settings.title}</h1>

      <Card>
        <h2 className={sectionTitle}>{t.settings.language}</h2>
        <LanguageSwitch large />
      </Card>

      <Card>
        <h2 className={sectionTitle}>{t.settings.harakat}</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div role="radiogroup" aria-label={t.settings.harakat} className="flex w-fit gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
            <button type="button" role="radio" aria-checked={showHarakat} onClick={() => setShowHarakat(true)} className={segment(showHarakat)}>
              {t.settings.show}
            </button>
            <button type="button" role="radio" aria-checked={!showHarakat} onClick={() => setShowHarakat(false)} className={segment(!showHarakat)}>
              {t.settings.hide}
            </button>
          </div>
          {/* Aperçu en direct de l'effet du réglage */}
          <ArabicText text="كَلِمَاتِي الجَمِيلَةُ" className="text-2xl text-[var(--accent)]" />
        </div>
        <p className="mt-3 text-sm text-[var(--text-muted)]">{t.settings.harakatHelp}</p>
      </Card>

      <Card>
        <h2 className={sectionTitle}>{t.settings.appearance}</h2>
        <ThemeToggle />
      </Card>

      <Card>
        <h2 className={sectionTitle}>
          <Smartphone size={16} />
          {t.settings.install}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">{t.settings.installText}</p>
      </Card>

      <Card>
        <h2 className={sectionTitle}>
          <Info size={16} />
          {t.settings.about}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">{t.settings.aboutText(STATS.total, STATS.lessons)}</p>
      </Card>

      <Card className="border-clay-200 dark:border-clay-400/40">
        <h2 className={`${sectionTitle} !text-clay-400`}>
          <AlertTriangle size={16} />
          {t.settings.danger}
        </h2>
        <p className="mb-3 text-sm text-[var(--text-muted)]">{t.settings.dangerText}</p>
        <Button variant={confirming ? "danger" : "outline"} onClick={handleReset} fullWidth>
          <RotateCcw size={18} />
          {confirming ? t.settings.confirm : t.settings.reset}
        </Button>
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="mt-2 w-full text-center text-sm text-[var(--text-faint)] underline"
          >
            {t.common.cancel}
          </button>
        )}
      </Card>
    </div>
  );
}
