/**
 * Réglages du « mode jeu » de Kalimati.
 * Modifie ce fichier pour renommer la mascotte ou changer les récompenses.
 * Les préférences de l'utilisateur (sons, animations réduites) sont, elles,
 * sauvegardées dans le localStorage (voir PreferencesContext).
 */
import type { Bilingual } from "../types";

export const MASCOT: { name: Bilingual; species: Bilingual } = {
  name: { ar: "فَنَك", fr: "Fenek" },
  species: { ar: "ثَعْلَبُ الصَّحْرَاءِ الصَّغِير", fr: "petit fennec du désert" },
};

/** Étoiles gagnées (monnaie du jeu, affichée dans le HUD). */
export const STAR_REWARDS = {
  /** Chaque carte retournée pour la première fois. */
  card: 1,
  /** Chaque étape validée. */
  step: 2,
  /** Bonus de fin de leçon (coffre). */
  lesson: 5,
};

/** Durée d'affichage par défaut d'une réaction de la mascotte (ms). */
export const MASCOT_REACTION_MS = 3200;

/** Valeurs par défaut des préférences de jeu. */
export const GAME_DEFAULTS = {
  sound: true,
  reducedMotion: false,
};
