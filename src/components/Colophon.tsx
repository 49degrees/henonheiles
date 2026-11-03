import { useMemo, useRef, type CSSProperties } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { boundaryPoints, ESCAPE_ENERGY, mix, smoothstep } from '../lib/geometry';
import { Arrow } from './Icons';

const escapePoints = boundaryPoints(ESCAPE_ENERGY - 1e-9, 180);
const CENTER = 260;
const RADIUS = 185;

function collapsePath(progress: number) {
  const contraction = 1 - smoothstep(0.02, 0.9, progress);
  const radius = RADIUS * (0.045 + 0.955 * Math.pow(contraction, 0.75));
  return escapePoints.map(({ x, y }, index) =>
    `${index ? 'L' : 'M'}${(CENTER + x * radius).toFixed(2)},${(CENTER - y * radius).toFixed(2)}`,
  ).join(' ') + ' Z';
}

export function Colophon({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced);
  const visualProgress = reduced ? 0.88 : progress;
  const contour = useMemo(() => collapsePath(visualProgress), [visualProgress]);
  const reveal = smoothstep(0.28, 0.78, visualProgress);
  const creditStyle: CSSProperties = {
    clipPath: `inset(0 ${((1 - reveal) * 50).toFixed(2)}% 0 ${((1 - reveal) * 50).toFixed(2)}%)`,
    transform: `translate3d(0, ${mix(18, -6, reveal).toFixed(2)}px, 0) scale(${mix(0.94, 1, reveal).toFixed(3)})`,
  };
  const artStyle: CSSProperties = {
    transform: `translateY(-50%) rotate(${mix(-12, 12, visualProgress).toFixed(2)}deg) scale(${mix(1.08, 0.82, visualProgress).toFixed(3)})`,
  };

  return (
    <section
      id="colophon"
      ref={ref}
      className={`colophon ${reduced ? 'colophon-static' : ''}`}
      aria-labelledby="colophon-title"
      data-testid="colophon"
      data-progress={visualProgress.toFixed(4)}
    >
      <div className="colophon-stage page-gutter">
        <div className="colophon-topline"><span className="mono">THE ARGUMENT CLOSES</span><span className="mono">ONE-SIDED LIMIT / E &#x2192; 1/6&#x207B;</span></div>
        <svg className="colophon-art" viewBox="0 0 520 520" style={artStyle} role="img" aria-label="The escape-limit contour contracts into a point as the essay ends.">
          <path d={collapsePath(0)} className="colophon-ghost" />
          <path d={contour} className="colophon-contour" data-testid="colophon-contour" />
          <circle cx="260" cy="260" r={mix(2, 12, visualProgress)} className="colophon-point" />
          {[Math.PI / 2, 7 * Math.PI / 6, 11 * Math.PI / 6].map((phi) => (
            <line key={phi} x1="260" y1="260" x2={260 + Math.cos(phi) * RADIUS} y2={260 - Math.sin(phi) * RADIUS} className="colophon-ray" />
          ))}
        </svg>
        <div className="colophon-copy">
          <p className="eyebrow">AN EXACT CALIBRATION / NOT A TRANSPORT CLAIM</p>
          <h2 id="colophon-title">One scale.<br /><em>One limit.</em></h2>
          <p>The bound is exact. The threshold can be calibrated. No relationship between chaos and transport is claimed.</p>
          <div className="colophon-credit" style={creditStyle} data-testid="by-jasper-liu"><span>by</span><strong>Jasper Liu</strong></div>
          <a href="#top" className="text-link">Return to the beginning <Arrow direction="up-right" /></a>
        </div>
      </div>
    </section>
  );
}
