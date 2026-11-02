/**
 * Décor de fond discret : lueur de soleil (ou de lune en mode sombre) et
 * dunes douces en bas d'écran. SVG/CSS pur, fixe, non interactif, très léger.
 */
export function DesertBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--sky-glow)] via-[var(--bg)] to-[var(--bg)]" />
      {/* Soleil (jour) / lune (nuit) */}
      <div className="absolute -top-10 end-[-2.5rem] h-44 w-44 rounded-full bg-sun-300/40 blur-2xl dark:bg-sand-100/10" />
      <div className="absolute end-5 top-24 h-12 w-12 rounded-full bg-sun-300/45 dark:bg-sand-100/25 dark:shadow-[0_0_30px_rgba(255,240,200,0.2)]" />
      {/* Petites étoiles la nuit */}
      <div className="absolute inset-x-0 top-24 hidden h-40 dark:block">
        {[
          [12, 10],
          [28, 60],
          [46, 22],
          [64, 70],
          [80, 30],
          [90, 80],
        ].map(([x, y], i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-sand-100/70" style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>
      {/* Dunes */}
      <svg className="absolute inset-x-0 bottom-0 h-44 w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
        <path d="M0 70 C 70 30 130 40 200 70 C 260 95 330 60 400 50 L400 120 L0 120 Z" fill="var(--dune-1)" />
        <path d="M0 95 C 80 70 150 80 220 98 C 290 115 350 90 400 85 L400 120 L0 120 Z" fill="var(--dune-2)" opacity="0.8" />
      </svg>
    </div>
  );
}
