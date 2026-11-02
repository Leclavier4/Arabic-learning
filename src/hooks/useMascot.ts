import { useMascotContext } from "../context/MascotContext";

export type { MascotPose, MascotLine } from "../context/MascotContext";

/**
 * Déclenche les réactions de la mascotte depuis n'importe quel écran :
 *   const { react, say } = useMascot();
 *   react("stepDone");                 // phrase au hasard + pose « cheer »
 *   say("Coucou !", "wave", 2000);     // message précis
 */
export function useMascot() {
  return useMascotContext();
}
