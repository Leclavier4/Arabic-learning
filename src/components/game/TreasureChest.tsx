import { motion } from "framer-motion";

/**
 * Coffre au trésor en SVG. Fermé : il se dandine pour donner envie.
 * Ouvert : le couvercle bascule, des rayons dorés et des étincelles sortent.
 */
export function TreasureChest({ open, size = 150 }: { open: boolean; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      overflow="visible"
      aria-hidden
      animate={open ? { rotate: 0, y: 0 } : { rotate: [0, -4, 4, -3, 0], y: [0, -4, 0] }}
      transition={open ? { duration: 0.2 } : { duration: 1.4, repeat: Infinity, repeatDelay: 0.8 }}
    >
      {/* Rayons de lumière à l'ouverture */}
      {open && (
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1, rotate: 20 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ originX: 0.5, originY: 0.5, transformBox: "fill-box" }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d="M80 70 L72 -10 L88 -10 Z" fill="#FFE07A" opacity={0.55} transform={`rotate(${i * 36} 80 70)`} />
          ))}
        </motion.g>
      )}

      <ellipse cx={80} cy={146} rx={56} ry={8} fill="#000" opacity={0.1} />

      {/* Trésor qui brille à l'intérieur */}
      {open && (
        <motion.g initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, type: "spring", stiffness: 200 }}>
          <circle cx={62} cy={78} r={10} fill="#FFCC3D" stroke="#E8AE00" strokeWidth={3} />
          <circle cx={84} cy={72} r={11} fill="#FFCC3D" stroke="#E8AE00" strokeWidth={3} />
          <circle cx={102} cy={80} r={9} fill="#FFCC3D" stroke="#E8AE00" strokeWidth={3} />
          <path d="M76 64 l4 -10 l4 10 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 Z" fill="#fff" opacity={0.9} />
        </motion.g>
      )}

      {/* Base du coffre */}
      <rect x={24} y={78} width={112} height={64} rx={12} fill="#B8742F" />
      <rect x={24} y={78} width={112} height={14} rx={6} fill="#9A5E22" />
      <rect x={36} y={78} width={12} height={64} fill="#EBCB6B" />
      <rect x={112} y={78} width={12} height={64} fill="#EBCB6B" />
      <rect x={68} y={92} width={24} height={26} rx={6} fill="#EBCB6B" stroke="#A88534" strokeWidth={3} />
      <circle cx={80} cy={103} r={4} fill="#5C3A12" />
      <rect x={78} y={104} width={4} height={8} rx={2} fill="#5C3A12" />

      {/* Couvercle (pivote vers l'arrière depuis la charnière) */}
      <motion.g
        style={{ originX: 0.5, originY: 1, transformBox: "fill-box" }}
        animate={open ? { rotate: -24, y: -34, x: -6 } : { rotate: 0, y: 0, x: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 11 }}
      >
        <path d="M24 80 Q24 40 80 40 Q136 40 136 80 Z" fill="#C98A3E" />
        <path d="M36 80 Q36 46 48 43 L48 80 Z" fill="#EBCB6B" />
        <path d="M112 43 Q124 46 124 80 L112 80 Z" fill="#EBCB6B" />
        <rect x={20} y={74} width={120} height={10} rx={5} fill="#9A5E22" />
      </motion.g>

      {/* Étincelles */}
      {open &&
        [
          [28, 40],
          [132, 36],
          [80, 18],
          [140, 90],
          [18, 96],
        ].map(([x, y], i) => (
          <motion.text
            key={i}
            x={x}
            y={y}
            fontSize={18}
            fill="#FFCC3D"
            textAnchor="middle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 + i * 0.25 }}
            style={{ originX: 0.5, originY: 0.5, transformBox: "fill-box" }}
          >
            ✦
          </motion.text>
        ))}
    </motion.svg>
  );
}
