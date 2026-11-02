import confetti from "canvas-confetti";

// Palette douce : sauge, sable, or, terre cuite.
const COLORS = ["#82A77E", "#DFC089", "#E3C878", "#DE9C86", "#C8D9C5"];

/** Petite salve douce — validation d'étape. */
export function burstSoft(): void {
  confetti({ particleCount: 40, spread: 55, startVelocity: 30, origin: { y: 0.7 }, colors: COLORS });
}

/** Grande salve — fin de leçon / montée de grade / badge. */
export function burstCelebration(): void {
  const end = Date.now() + 1100;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: COLORS });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** Ouverture de cadeau — effet de "pop" central. */
export function burstGift(): void {
  confetti({ particleCount: 70, spread: 100, startVelocity: 35, origin: { y: 0.55 }, scalar: 1.1, colors: COLORS });
}
