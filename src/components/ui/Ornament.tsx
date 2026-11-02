/** Étoile à huit branches (motif géométrique arabe), utilisée comme logo et ornement. */
export function StarMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className={className}>
      <g transform="translate(50 50)">
        <rect x="-30" y="-30" width="60" height="60" fill="currentColor" />
        <rect x="-30" y="-30" width="60" height="60" fill="currentColor" transform="rotate(45)" />
        <circle r="13" fill="var(--gold)" />
      </g>
    </svg>
  );
}

/** Séparateur discret : deux filets et une petite étoile au centre. */
export function ArabesqueDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-sage-300 dark:text-sage-600 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current rtl:bg-gradient-to-l" />
      <svg width="14" height="14" viewBox="0 0 100 100">
        <g transform="translate(50 50)" fill="none" stroke="currentColor" strokeWidth="8">
          <rect x="-28" y="-28" width="56" height="56" />
          <rect x="-28" y="-28" width="56" height="56" transform="rotate(45)" />
        </g>
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current rtl:bg-gradient-to-r" />
    </div>
  );
}

/** Grande étoile décorative en filigrane, pour les coins de cartes. */
export function CornerStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <g transform="translate(50 50)" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="-32" y="-32" width="64" height="64" />
        <rect x="-32" y="-32" width="64" height="64" transform="rotate(45)" />
        <rect x="-20" y="-20" width="40" height="40" />
        <rect x="-20" y="-20" width="40" height="40" transform="rotate(45)" />
        <circle r="8" />
      </g>
    </svg>
  );
}
