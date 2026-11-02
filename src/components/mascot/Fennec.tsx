import type { ReactNode } from "react";
import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import type { MascotPose } from "../../context/MascotContext";

/*
 * Fenek, le petit fennec — dessiné entièrement en SVG inline (aucune image
 * externe, fonctionne hors-ligne) et animé avec Framer Motion.
 * Chaque partie (oreilles, bras, queue, tête, yeux) est un <motion.g> qui
 * reçoit une animation selon la pose. Le dessin regarde vers la droite ;
 * <Mascot> le retourne en miroir quand l'interface est en arabe (RTL).
 *
 * Astuce : chaque partie est placée par un <g transform="translate(…)"> et
 * animée dans un <motion.g> enfant, pour que Framer Motion ne remplace pas
 * la position d'origine.
 */

const FUR = "#F2B066";
const FUR_SHADE = "#E39B4F";
const CREAM = "#FFF4E2";
const EAR_INNER = "#F7A79C";
const INK = "#3A2A22";
const SCARF = "#1C8C82";
const SCARF_LIGHT = "#35B9AC";
const CHEEK = "#FF9C85";

type Part = { animate: TargetAndTransition; transition?: Transition };
type PoseMap = Record<MascotPose, Part>;

const loop = (duration: number, extra: Transition = {}): Transition => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
  ...extra,
});
const settle: Transition = { type: "spring", stiffness: 160, damping: 14 };

const ROOT: PoseMap = {
  idle: { animate: { y: 0, rotate: 0 }, transition: settle },
  wave: { animate: { y: 0, rotate: 0 }, transition: settle },
  think: { animate: { y: 0, rotate: 0 }, transition: settle },
  sleep: { animate: { y: 2, rotate: 0 }, transition: settle },
  cheer: { animate: { y: [0, -14, 0] }, transition: loop(0.6, { repeatDelay: 0.15 }) },
  celebrate: { animate: { y: [0, -20, 0, -10, 0], rotate: [0, -5, 5, 0, 0] }, transition: loop(1.1, { repeatDelay: 0.2 }) },
};

const BREATH: PoseMap = {
  idle: { animate: { scaleY: [1, 1.035, 1] }, transition: loop(2.6) },
  wave: { animate: { scaleY: [1, 1.035, 1] }, transition: loop(2.6) },
  think: { animate: { scaleY: [1, 1.03, 1] }, transition: loop(3) },
  sleep: { animate: { scaleY: [1, 1.06, 1] }, transition: loop(3.4) },
  cheer: { animate: { scaleY: 1 }, transition: settle },
  celebrate: { animate: { scaleY: 1 }, transition: settle },
};

const HEAD: PoseMap = {
  idle: { animate: { rotate: [0, 3, 0, -3, 0], y: 0 }, transition: loop(6) },
  wave: { animate: { rotate: [0, 5, 0], y: 0 }, transition: loop(1.4) },
  think: { animate: { rotate: 12, y: 0 }, transition: settle },
  sleep: { animate: { rotate: -10, y: 4 }, transition: settle },
  cheer: { animate: { rotate: [0, -5, 5, 0], y: 0 }, transition: loop(0.6, { repeatDelay: 0.15 }) },
  celebrate: { animate: { rotate: [0, -6, 6, 0], y: 0 }, transition: loop(0.55) },
};

const EAR_LEFT: PoseMap = {
  idle: { animate: { rotate: [0, 0, 0, -12, 0, 0] }, transition: loop(4.5) },
  wave: { animate: { rotate: [0, -8, 0] }, transition: loop(1.2) },
  think: { animate: { rotate: -4 }, transition: settle },
  sleep: { animate: { rotate: -24 }, transition: settle },
  cheer: { animate: { rotate: [-8, -18, -8] }, transition: loop(0.6) },
  celebrate: { animate: { rotate: [-8, -20, -8] }, transition: loop(0.5) },
};
const EAR_RIGHT: PoseMap = {
  idle: { animate: { rotate: [0, 0, 0, 0, 12, 0] }, transition: loop(4.5) },
  wave: { animate: { rotate: [0, 8, 0] }, transition: loop(1.2, { delay: 0.2 }) },
  think: { animate: { rotate: 16 }, transition: settle },
  sleep: { animate: { rotate: 24 }, transition: settle },
  cheer: { animate: { rotate: [8, 18, 8] }, transition: loop(0.6) },
  celebrate: { animate: { rotate: [8, 20, 8] }, transition: loop(0.5) },
};

// Rotation des bras depuis l'épaule (0 = bras le long du corps, ±150 = bras levé).
const ARM_LEFT: PoseMap = {
  idle: { animate: { rotate: 14 }, transition: settle },
  wave: { animate: { rotate: 14 }, transition: settle },
  think: { animate: { rotate: 14 }, transition: settle },
  sleep: { animate: { rotate: 6 }, transition: settle },
  cheer: { animate: { rotate: [150, 166, 150] }, transition: loop(0.6) },
  celebrate: { animate: { rotate: [150, 172, 150] }, transition: loop(0.45) },
};
const ARM_RIGHT: PoseMap = {
  idle: { animate: { rotate: -14 }, transition: settle },
  wave: { animate: { rotate: [-150, -112, -150] }, transition: loop(0.7) },
  think: { animate: { rotate: 132 }, transition: settle },
  sleep: { animate: { rotate: -6 }, transition: settle },
  cheer: { animate: { rotate: [-150, -166, -150] }, transition: loop(0.6) },
  celebrate: { animate: { rotate: [-150, -172, -150] }, transition: loop(0.45) },
};

const TAIL: PoseMap = {
  idle: { animate: { rotate: [0, 10, 0] }, transition: loop(2.4) },
  wave: { animate: { rotate: [0, 12, 0] }, transition: loop(1.2) },
  think: { animate: { rotate: [0, 6, 0] }, transition: loop(3) },
  sleep: { animate: { rotate: 8 }, transition: settle },
  cheer: { animate: { rotate: [0, 20, 0] }, transition: loop(0.5) },
  celebrate: { animate: { rotate: [0, 24, 0] }, transition: loop(0.4) },
};

const BLINK: Part = {
  animate: { scaleY: [1, 1, 0.1, 1, 1] },
  transition: { duration: 4, times: [0, 0.46, 0.5, 0.54, 1], repeat: Infinity },
};

/** Groupe animé dont l'origine de transformation est relative à sa propre boîte. */
function Animated({ part, originX = 0.5, originY = 0.5, children }: { part: Part; originX?: number; originY?: number; children: ReactNode }) {
  return (
    <motion.g
      style={{ originX, originY, transformBox: "fill-box" }}
      animate={part.animate}
      transition={part.transition}
    >
      {children}
    </motion.g>
  );
}

function Arm({ x, part }: { x: number; part: Part }) {
  return (
    <g transform={`translate(${x} 122)`}>
      <Animated part={part} originY={0}>
        <rect x={-6.5} y={-2} width={13} height={30} rx={6.5} fill={FUR} />
        <circle cx={0} cy={25} r={6.8} fill={CREAM} />
      </Animated>
    </g>
  );
}

function Ear({ side, part }: { side: 1 | -1; part: Part }) {
  // side = -1 : oreille gauche (à l'écran), +1 : oreille droite.
  const s = side;
  return (
    <g transform={`translate(${80 + s * 26} 64)`}>
      <Animated part={part} originY={1}>
        <path d={`M0 8 Q ${s * 28} -22 ${s * 23} -56 Q ${-s * 6} -42 ${-s * 19} -8 Z`} fill={FUR} />
        <path d={`M${s * 1} 1 Q ${s * 18} -22 ${s * 16} -44 Q ${-s * 2} -33 ${-s * 12} -9 Z`} fill={EAR_INNER} />
      </Animated>
    </g>
  );
}

function Eyes({ pose }: { pose: MascotPose }) {
  if (pose === "sleep") {
    return (
      <g stroke={INK} strokeWidth={3.2} strokeLinecap="round" fill="none">
        <path d="M58 81 Q65 87 72 81" />
        <path d="M88 81 Q95 87 102 81" />
      </g>
    );
  }
  if (pose === "cheer" || pose === "celebrate") {
    // Yeux « rieurs » en arc.
    return (
      <g stroke={INK} strokeWidth={3.4} strokeLinecap="round" fill="none">
        <path d="M58 83 Q65 73 72 83" />
        <path d="M88 83 Q95 73 102 83" />
      </g>
    );
  }
  const lookUp = pose === "think" ? -2.5 : 0;
  return (
    <Animated part={BLINK}>
      {[65, 95].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={80} rx={7.6} ry={9.6} fill={INK} />
          {/* Reflets décalés vers la droite : la mascotte regarde dans le sens de lecture */}
          <circle cx={cx + 2.8} cy={76 + lookUp} r={3} fill="#fff" />
          <circle cx={cx - 2} cy={84 + lookUp} r={1.3} fill="#fff" />
        </g>
      ))}
    </Animated>
  );
}

function Mouth({ pose }: { pose: MascotPose }) {
  const open = pose === "wave" || pose === "cheer" || pose === "celebrate";
  if (open) {
    return (
      <g>
        <path d="M71.5 98 Q80 114 88.5 98 Z" fill="#7A2E2E" />
        <ellipse cx={80} cy={106} rx={4.6} ry={3} fill={EAR_INNER} />
      </g>
    );
  }
  if (pose === "sleep") return <path d="M76 100 Q80 102.5 84 100" stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
  return <path d="M72.5 98 Q76.2 102.5 80 98 Q83.8 102.5 87.5 98" stroke={INK} strokeWidth={2.4} strokeLinecap="round" fill="none" />;
}

export function Fennec({ pose = "idle", size = 120, title }: { pose?: MascotPose; size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size * (186 / 160)}
      viewBox="0 -6 160 186"
      overflow="visible"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* Ombre au sol (ne saute pas avec la mascotte) */}
      <ellipse cx={80} cy={175} rx={40} ry={5} fill="#000" opacity={0.08} />

      <Animated part={ROOT[pose]} originY={1}>
        {/* Queue */}
        <g transform="translate(56 152)">
          <Animated part={TAIL[pose]} originX={1} originY={1}>
            <path d="M4 -4 C -20 -2 -46 -16 -42 -46 C -40 -58 -26 -60 -22 -48 C -18 -30 -6 -20 8 -14 Z" fill={FUR_SHADE} />
            <ellipse cx={-33} cy={-50} rx={8.5} ry={9.5} fill={CREAM} />
          </Animated>
        </g>

        {/* Pattes arrière */}
        <ellipse cx={65} cy={168} rx={12} ry={6.5} fill={FUR_SHADE} />
        <ellipse cx={95} cy={168} rx={12} ry={6.5} fill={FUR_SHADE} />

        {/* Corps qui respire */}
        <Animated part={BREATH[pose]} originY={1}>
          <ellipse cx={80} cy={140} rx={32} ry={30} fill={FUR} />
          <ellipse cx={80} cy={148} rx={19} ry={19} fill={CREAM} />
        </Animated>

        {/* Foulard turquoise (touche « oasis ») */}
        <path d="M49 112 Q80 127 111 112 L109 121 Q80 136 51 121 Z" fill={SCARF} />
        <path d="M90 122 L101 140 L88 135 Z" fill={SCARF_LIGHT} />

        {/* Tête (pivote depuis le cou) */}
        <Animated part={HEAD[pose]} originY={0.9}>
          <Ear side={-1} part={EAR_LEFT[pose]} />
          <Ear side={1} part={EAR_RIGHT[pose]} />
          <ellipse cx={80} cy={82} rx={42} ry={34} fill={FUR} />
          <path d="M73 50 Q80 41 86 50 Q80 47 73 50 Z" fill={FUR_SHADE} />
          <ellipse cx={80} cy={98} rx={25} ry={15.5} fill={CREAM} />
          <ellipse cx={53} cy={96} rx={6.5} ry={4.2} fill={CHEEK} opacity={0.55} />
          <ellipse cx={107} cy={96} rx={6.5} ry={4.2} fill={CHEEK} opacity={0.55} />
          <Eyes pose={pose} />
          <ellipse cx={80} cy={92} rx={5.8} ry={4.2} fill={INK} />
          <ellipse cx={81.8} cy={90.6} rx={1.8} ry={1.1} fill="#fff" opacity={0.8} />
          <Mouth pose={pose} />
        </Animated>

        {/* Bras devant (pour pouvoir toucher le menton en pose « think ») */}
        <Arm x={52} part={ARM_LEFT[pose]} />
        <Arm x={108} part={ARM_RIGHT[pose]} />
      </Animated>
    </svg>
  );
}
