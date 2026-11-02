/** Séparateur discret : deux filets et une petite étoile au centre. */
export function ArabesqueDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-oasis-300 dark:text-oasis-600 ${className}`} aria-hidden>
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
