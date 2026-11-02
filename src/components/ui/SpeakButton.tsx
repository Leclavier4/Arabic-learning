import { Volume2 } from "lucide-react";
import { speak } from "../../services/speech";
import { useLang } from "../../hooks/useLang";
import { stripHarakat } from "../../services/arabic";

interface SpeakButtonProps {
  /** Texte arabe à lire (de préférence vocalisé : meilleure prononciation). */
  text: string;
  size?: number;
  className?: string;
}

export function SpeakButton({ text, size = 18, className = "" }: SpeakButtonProps) {
  const { t } = useLang();
  const label = t.common.listenTo(stripHarakat(text));
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={label}
      title={label}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full p-2.5 transition",
        "bg-[var(--accent-soft)] text-[var(--accent)] hover:brightness-95 active:scale-95",
        className,
      ].join(" ")}
    >
      <Volume2 size={size} className="rtl:-scale-x-100" />
    </button>
  );
}
