/**
 * Petits effets sonores « mignons » générés à la volée avec la Web Audio API :
 * aucun fichier audio, donc rien à télécharger et tout marche hors-ligne.
 * Le réglage on/off est synchronisé par PreferencesContext (setSoundEnabled).
 */

export type SoundName = "tap" | "flip" | "star" | "success" | "hop" | "chest" | "levelup" | "pop";

let enabled = true;
let ctx: AudioContext | null = null;

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Une note courte avec enveloppe douce (attaque rapide, extinction exponentielle). */
function note(ac: AudioContext, freq: number, start: number, duration: number, type: OscillatorType = "sine", volume = 0.12, slideTo?: number) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// Gamme de do majeur (Hz) pour des petites mélodies joyeuses.
const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5;

export function playSound(name: SoundName): void {
  if (!enabled) return;
  const ac = audio();
  if (!ac) return;
  try {
    switch (name) {
      case "tap":
        note(ac, 620, 0, 0.07, "triangle", 0.06);
        break;
      case "pop":
        note(ac, 300, 0, 0.09, "sine", 0.12, 900);
        break;
      case "flip":
        note(ac, 380, 0, 0.12, "triangle", 0.07, 760);
        break;
      case "star":
        note(ac, A5, 0, 0.09, "sine", 0.1);
        note(ac, E6, 0.07, 0.16, "sine", 0.09);
        break;
      case "hop":
        note(ac, 330, 0, 0.14, "square", 0.035, 660);
        break;
      case "success":
        [C5, E5, G5, C6].forEach((f, i) => note(ac, f, i * 0.08, 0.16, "triangle", 0.09));
        break;
      case "chest":
        note(ac, 110, 0, 0.18, "sine", 0.18, 70); // « clonk » du couvercle
        [G5, A5, C6, E6].forEach((f, i) => note(ac, f, 0.16 + i * 0.07, 0.22, "sine", 0.08)); // scintillement
        break;
      case "levelup":
        [C5, E5, G5].forEach((f, i) => note(ac, f, i * 0.1, 0.14, "square", 0.04));
        note(ac, C6, 0.3, 0.4, "triangle", 0.1);
        note(ac, D5 * 2, 0.3, 0.4, "sine", 0.05);
        break;
    }
  } catch {
    /* le son ne doit jamais casser l'app */
  }
}
