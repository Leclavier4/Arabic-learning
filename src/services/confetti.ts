import confetti from "canvas-confetti";

// Palette « désert & oasis » : turquoise, soleil, corail, sable, or.
const COLORS = ["#35B9AC", "#FFCC3D", "#FF9C85", "#F1C985", "#EBCB6B", "#6FD3C8"];

let reduced = false;

/** Réglage « réduire les animations » : on coupe les confettis. */
export function setEffectsReduced(value: boolean): void {
  reduced = value;
}

const fire = (options: confetti.Options) => {
  if (reduced) return;
  confetti({ disableForReducedMotion: true, colors: COLORS, ...options });
};

/** Petite salve douce — validation d'étape. */
export function burstSoft(): void {
  fire({ particleCount: 40, spread: 60, startVelocity: 30, origin: { y: 0.7 } });
}

/** Grande salve — fin de leçon / montée de grade / badge. */
export function burstCelebration(): void {
  if (reduced) return;
  const end = Date.now() + 1100;
  (function frame() {
    fire({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
    fire({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** Ouverture du coffre — effet de « pop » central avec étoiles. */
export function burstGift(): void {
  fire({ particleCount: 80, spread: 110, startVelocity: 38, origin: { y: 0.55 }, scalar: 1.15, shapes: ["star", "circle"] });
}
