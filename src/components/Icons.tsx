export function Arrow({ direction = 'right', className = '' }: { direction?: 'right' | 'down' | 'up-right'; className?: string }) {
  const rotation = direction === 'down' ? 90 : direction === 'up-right' ? -45 : 0;
  return (
    <svg className={`arrow-icon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function WellMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={`well-mark ${className}`} fill="none" aria-hidden="true">
      <path d="M22 3C20 14 15 20 4 32c13-4 23-4 36 0C29 20 24 14 22 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M22 10C20 17 17 22 10 29c9-3 15-3 24 0-7-7-10-12-12-19Z" stroke="currentColor" strokeWidth=".8" />
      <circle cx="22" cy="24" r="2.5" fill="currentColor" />
    </svg>
  );
}