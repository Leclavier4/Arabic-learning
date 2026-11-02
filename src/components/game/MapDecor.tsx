/** Petits éléments de décor du chemin (SVG inline, très légers). */

export type DecorKind = "palm" | "oasis" | "dunes" | "cactus" | "tent";

export const DECOR_SEQUENCE: DecorKind[] = ["palm", "dunes", "oasis", "tent", "palm", "cactus"];

export function MapDecor({ kind, size = 64 }: { kind: DecorKind; size?: number }) {
  switch (kind) {
    case "palm":
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
          <ellipse cx="32" cy="58" rx="16" ry="4" fill="var(--dune-2)" />
          <path d="M31 58 C 30 44 33 34 31 22 L 35 22 C 37 34 34 46 35 58 Z" fill="#B5793A" />
          <g fill="#3FA463">
            <path d="M33 22 C 22 14 12 18 8 26 C 18 20 26 22 33 24 Z" />
            <path d="M33 22 C 44 14 54 18 58 26 C 48 20 40 22 33 24 Z" />
            <path d="M33 22 C 26 10 30 4 38 4 C 34 10 34 16 34 22 Z" />
            <path d="M33 23 C 24 24 18 32 18 38 C 24 30 28 28 33 25 Z" />
            <path d="M33 23 C 42 24 48 32 48 38 C 42 30 38 28 33 25 Z" />
          </g>
          <circle cx="31" cy="24" r="2.4" fill="#8A5524" />
          <circle cx="35" cy="25" r="2.4" fill="#8A5524" />
        </svg>
      );
    case "oasis":
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
          <ellipse cx="32" cy="46" rx="26" ry="10" fill="#6FD3C8" />
          <ellipse cx="28" cy="44" rx="10" ry="3" fill="#CFF3EE" opacity="0.8" />
          <path d="M48 44 C 47 34 49 28 48 20 L 51 20 C 52 28 50 36 51 44 Z" fill="#B5793A" />
          <g fill="#3FA463">
            <path d="M50 20 C 42 14 36 18 33 24 C 40 19 45 20 50 22 Z" />
            <path d="M50 20 C 58 14 63 18 64 24 C 58 19 54 20 50 22 Z" />
            <path d="M50 20 C 46 12 49 8 54 8 C 51 12 51 16 51 20 Z" />
          </g>
        </svg>
      );
    case "dunes":
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
          <circle cx="46" cy="18" r="8" fill="#FFCC3D" opacity="0.9" />
          <path d="M2 54 C 14 36 26 36 36 54 Z" fill="var(--dune-2)" />
          <path d="M22 56 C 34 40 48 40 62 56 Z" fill="var(--dune-1)" stroke="var(--dune-2)" strokeWidth="1.5" />
        </svg>
      );
    case "cactus":
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
          <ellipse cx="32" cy="58" rx="14" ry="3.5" fill="var(--dune-2)" />
          <rect x="27" y="18" width="10" height="40" rx="5" fill="#3FA463" />
          <path d="M27 38 h-6 a4 4 0 0 1 -4 -4 v-8 a3 3 0 0 1 6 0 v6 h4 Z" fill="#3FA463" />
          <path d="M37 32 h6 a4 4 0 0 0 4 -4 v-6 a3 3 0 0 0 -6 0 v4 h-4 Z" fill="#3FA463" />
          <circle cx="32" cy="17" r="3" fill="#FF9C85" />
        </svg>
      );
    case "tent":
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
          <ellipse cx="32" cy="56" rx="24" ry="4" fill="var(--dune-2)" />
          <path d="M6 54 L32 18 L58 54 Z" fill="#FF9C85" />
          <path d="M32 18 L58 54 L44 54 Z" fill="#F57A5F" />
          <path d="M26 54 L32 38 L38 54 Z" fill="#7A2E2E" opacity="0.8" />
          <path d="M14 46 L50 46" stroke="#FFE07A" strokeWidth="3" />
          <path d="M32 18 L32 10 L40 13 L32 16" fill="#1C8C82" />
        </svg>
      );
  }
}
