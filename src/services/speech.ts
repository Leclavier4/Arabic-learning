/**
 * Lecture audio en arabe via l'API navigateur Web Speech (speechSynthesis).
 * Aucun service externe, aucune clé. Si aucune voix arabe n'est installée,
 * on ne lit rien (une voix française lirait l'arabe de travers) et on émet
 * un événement que <SpeechNotice> transforme en message doux.
 */

export type SpeechStatus = "ok" | "no-voice" | "unsupported";
export const SPEECH_EVENT = "kalimati:speech";

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Meilleure voix arabe disponible (ar-SA de préférence), `undefined` si la liste n'est pas encore chargée. */
function findArabicVoice(): SpeechSynthesisVoice | null | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const arabic = voices.filter((v) => v.lang?.toLowerCase().replace("_", "-").startsWith("ar"));
  return (
    arabic.find((v) => v.lang.toLowerCase().startsWith("ar-sa")) ||
    arabic.find((v) => v.localService) ||
    arabic[0] ||
    null
  );
}

// Certains navigateurs chargent les voix de façon asynchrone.
if (isSpeechSupported()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => window.speechSynthesis.getVoices());
}

function notify(status: SpeechStatus) {
  window.dispatchEvent(new CustomEvent<SpeechStatus>(SPEECH_EVENT, { detail: status }));
}

/** Lit un texte arabe (de préférence vocalisé, pour une meilleure prononciation). */
export function speak(text: string, rate = 0.8): SpeechStatus {
  if (!isSpeechSupported()) {
    notify("unsupported");
    return "unsupported";
  }
  if (!text) return "ok";
  try {
    const voice = findArabicVoice();
    if (voice === null) {
      notify("no-voice");
      return "no-voice";
    }
    window.speechSynthesis.cancel(); // évite les chevauchements
    const utterance = new SpeechSynthesisUtterance(text);
    // Liste non chargée (certains Android) : on tente quand même avec la langue arabe.
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "ar-SA";
    utterance.rate = rate;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    return "ok";
  } catch {
    return "unsupported"; // l'app ne doit jamais planter à cause de l'audio
  }
}

export function stopSpeaking(): void {
  try {
    if (isSpeechSupported()) window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
}
