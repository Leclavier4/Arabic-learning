import { useCallback, useState } from "react";
import { AlertTriangle, Gamepad2, Info, RotateCcw, Smartphone } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Toast } from "../components/ui/Toast";
import { ArabicText } from "../components/ui/ArabicText";
import { PageMascot } from "../components/mascot/PageMascot";
import { usePreferences } from "../context/PreferencesContext";
import { useMascot } from "../hooks/useMascot";
import { playSound } from "../services/sound";
import { ThemeToggle } from "../components/layout/ThemeToggle";
import { LanguageSwitch } from "../components/layout/LanguageSwitch";
import { useProgress } from "../context/ProgressContext";
import { useLang } from "../hooks/useLang";
import { useHarakat } from "../hooks/useHarakat";
import { STATS } from "../data/wordbank.js";

const sectionTitle = "mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[var(--text-faint)]";

export function Settings() {
  const { resetAll } = useProgress();
  const { t } = useLang();
  const { showHarakat, setShowHarakat } = useHarakat();
  const { soundOn, setSoundOn, reducedMotion, setReducedMotion } = usePreferences();
  const { name } = useMascot();
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
      active
        ? "bg-oasis-500 text-white dark:bg-oasis-400 dark:text-[#13200f]"
        : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)]",
    ].join(" ");

  return (
    <div className="flex flex-col gap-4">
      <Toast message={message} onDone={clearMessage} />
      <PageMascot title={t.settings.title} message={t.mascot.pages.settings} pose="think" />

      {/* Réglages du jeu : sons, animations réduites, mascotte */}
      <Card>
        <h2 className={sectionTitle}>
          <Gamepad2 size={16} />
          {t.game.settingsGame}
        </h2>
        <div className="flex flex-col gap-4">
          <OnOff
            label={t.game.sound}
            help={t.game.soundHelp}
            value={soundOn}
            onChange={(v) => {
              setSoundOn(v);
              if (v) setTimeout(() => playSound("star"), 30);
            }}
            yes={t.game.on}
            no={t.game.off}
            segment={segment}
          />
          <OnOff
            label={t.game.motion}
            help={t.game.motionHelp}
            value={reducedMotion}
            onChange={setReducedMotion}
            yes={t.game.on}
            no={t.game.off}
            segment={segment}
          />
          <p className="text-sm font-semibold text-[var(--text-muted)]">🦊 {t.game.mascotIs(name)}</p>
        </div>
      </Card>

      <Card>
        <h2 className={sectionTitle}>{t.settings.language}</h2>
        <LanguageSwitch large />
      </Card>

      <Card>
        <h2 className={sectionTitle}>{t.settings.harakat}</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div
            role="radiogroup"
            aria-label={t.settings.harakat}
            className="flex w-fit gap-1 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] p-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={showHarakat}
              onClick={() => setShowHarakat(true)}
              className={segment(showHarakat)}
            >
              {t.settings.show}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!showHarakat}
              onClick={() => setShowHarakat(false)}
              className={segment(!showHarakat)}
            >
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

      <Card className="border-coral-200 dark:border-coral-400/40">
        <h2 className={`${sectionTitle} !text-coral-400`}>
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

interface OnOffProps {
  label: string;
  help: string;
  value: boolean;
  onChange: (value: boolean) => void;
  yes: string;
  no: string;
  segment: (active: boolean) => string;
}

/** Interrupteur Oui / Non en deux gros boutons (cibles tactiles larges). */
function OnOff({ label, help, value, onChange, yes, no, segment }: OnOffProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-extrabold text-[var(--text)]">{label}</span>
        <div
          role="radiogroup"
          aria-label={label}
          className="flex gap-1 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] p-1"
        >
          <button type="button" role="radio" aria-checked={value} onClick={() => onChange(true)} className={segment(value)}>
            {yes}
          </button>
          <button type="button" role="radio" aria-checked={!value} onClick={() => onChange(false)} className={segment(!value)}>
            {no}
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{help}</p>
    </div>
  );
}
