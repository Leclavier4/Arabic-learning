import { useCallback, useEffect, useState } from "react";
import { VolumeX } from "lucide-react";
import { Toast } from "../ui/Toast";
import { SPEECH_EVENT, type SpeechStatus } from "../../services/speech";
import { useLang } from "../../hooks/useLang";

/** Affiche un message doux quand aucune voix arabe n'est disponible (au lieu d'une erreur). */
export function SpeechNotice() {
  const { t } = useLang();
  const [status, setStatus] = useState<SpeechStatus | null>(null);

  useEffect(() => {
    const onSpeech = (e: Event) => {
      const detail = (e as CustomEvent<SpeechStatus>).detail;
      if (detail !== "ok") setStatus(detail);
    };
    window.addEventListener(SPEECH_EVENT, onSpeech);
    return () => window.removeEventListener(SPEECH_EVENT, onSpeech);
  }, []);

  const clear = useCallback(() => setStatus(null), []);
  const message = status === "no-voice" ? t.speech.noVoice : status === "unsupported" ? t.speech.unsupported : null;

  return <Toast message={message} onDone={clear} duration={5000} icon={<VolumeX size={18} />} />;
}
