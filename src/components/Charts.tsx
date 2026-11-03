import { useId, useMemo } from 'react';
import { boundaryPoints, boundaryRadius, ESCAPE_ENERGY, geometricValues, TAU, UNIT_THRESHOLD_ONSET } from '../lib/geometry';

export function ScaleChart({ comparison = false, energy, alpha = 1, beta = 0.5 }: { comparison?: boolean; energy?: number; alpha?: number; beta?: number }) {
  const id = useId().replace(/:/g, '');
  const maxY = comparison ? Math.max(1.1, beta * 2.12, alpha * 1.1) : 2.12;
  const x = (e: number) => 62 + (e / ESCAPE_ENERGY) * 558;
  const y = (d: number) => 302 - (d / maxY) * 260;
  const curve = useMemo(() => Array.from({ length: 300 }, (_, i) => {
    const e = 0.00001 + (i / 299) * (ESCAPE_ENERGY - 0.000010001);
    return `${i ? 'L' : 'M'}${x(e).toFixed(2)},${y(geometricValues(e).D * (comparison ? beta : 1)).toFixed(2)}`;
  }).join(' '), [comparison, beta, maxY]);
  const current = energy ? geometricValues(energy).D * (comparison ? beta : 1) : null;
  const fixed = comparison ? alpha : 1;

  return (
    <svg className="scale-chart" viewBox="0 0 670 370" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{comparison ? 'Fixed and adaptive thresholds' : 'The strictly increasing geometric bound'}</title>
      <desc id={`${id}-desc`}>{comparison ? `A fixed alpha of ${alpha} is horizontal. The adaptive threshold beta D(E), with beta ${beta}, grows with the geometric bound.` : 'D increases from zero to the one-sided limit 2 as E approaches 1/6. It equals 1 at E = 9/64. This is a geometric bound, not a transport diagnostic.'}{energy && current !== null ? ` The scroll-driven marker is at E = ${energy.toFixed(4)} and ${comparison ? 'adaptive alpha' : 'D'} = ${current.toFixed(4)}.` : ''}</desc>
      {energy && <defs><clipPath id={`${id}-trace`}><rect x="60" y="0" width={Math.max(0, x(energy) - 60)} height="320" /></clipPath></defs>}
      {[0, 0.5, 1, 1.5, 2].filter((v) => v <= maxY).map((v) => (
        <g key={v}>
          <line x1="62" y1={y(v)} x2="620" y2={y(v)} className="chart-grid" />
          <text x="46" y={y(v) + 4} textAnchor="end" className="chart-tick">{v.toFixed(1)}</text>
        </g>
      ))}
      {[0, 0.05, 0.1, 0.15].map((e) => (
        <g key={e}>
          <line x1={x(e)} y1="42" x2={x(e)} y2="302" className="chart-grid" />
          <text x={x(e)} y="325" textAnchor="middle" className="chart-tick">{e === 0 ? '0' : e.toFixed(2)}</text>
        </g>
      ))}
      <line x1="62" y1="302" x2="620" y2="302" className="chart-axis" />
      <line x1="62" y1="42" x2="62" y2="302" className="chart-axis" />
      <line x1={x(UNIT_THRESHOLD_ONSET)} y1="42" x2={x(UNIT_THRESHOLD_ONSET)} y2="302" className="chart-onset" />
      <line x1="62" y1={y(fixed)} x2="620" y2={y(fixed)} className="chart-fixed" />
      <path d={curve} className={`chart-curve ${energy ? 'chart-curve-guide' : ''}`} />
      {energy && <path d={curve} className="chart-curve" clipPath={`url(#${id}-trace)`} />}
      <circle cx="620" cy={y(comparison ? beta * 2 : 2)} r="4" className="chart-limit" />
      {energy && current !== null && (
        <g>
          <line x1={x(energy)} y1={y(current)} x2={x(energy)} y2="302" className="chart-current-line" />
          <circle cx={x(energy)} cy={y(current)} r="6" className="chart-current" />
        </g>
      )}
      <text x="62" y="20" className="chart-label">{comparison ? 'THRESHOLD  \u03b1(E)' : 'GEOMETRIC BOUND  D(E)'}</text>
      <text x="620" y="355" textAnchor="end" className="chart-label">ENERGY E (DIMENSIONLESS)</text>
      <text x="76" y={y(fixed) - 12} className="chart-fixed-label">{`fixed \u03b1 = ${fixed.toFixed(2).replace('.00', '')}`}</text>
      <text x={x(UNIT_THRESHOLD_ONSET) - 8} y="285" textAnchor="end" className="chart-tick">9/64</text>
      <text x="626" y={y(comparison ? beta * 2 : 2) - 12} textAnchor="end" className="chart-curve-label">{comparison ? `${beta} D(E)` : 'D(E) \u2192 2'}</text>
      <text x="620" y="325" textAnchor="end" className="chart-tick">1/6&#x207B;</text>
    </svg>
  );
}

const diagramX = (x: number) => 260 + x * 160;
const diagramY = (y: number) => 215 - y * 160;
const diagramPath = (energy: number) => boundaryPoints(energy, 300).map(({ x, y }, i) => `${i ? 'L' : 'M'}${diagramX(x).toFixed(2)},${diagramY(y).toFixed(2)}`).join(' ') + ' Z';

// Shade the actual level-set inequality, not a fraction of the well's area.
function thresholdRegion(energy: number, threshold: number) {
  const parts: string[] = [];
  const samples = 480;
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * TAU;
    const b = ((i + 1) / samples) * TAU;
    const ra = boundaryRadius(energy, a);
    const rb = boundaryRadius(energy, b);
    const ia = Math.cbrt((3 * threshold) / Math.max(1e-14, Math.abs(Math.sin(3 * a))));
    const ib = Math.cbrt((3 * threshold) / Math.max(1e-14, Math.abs(Math.sin(3 * b))));
    if (ia >= ra || ib >= rb) continue;
    const point = (r: number, p: number) => `${diagramX(r * Math.cos(p)).toFixed(2)},${diagramY(r * Math.sin(p)).toFixed(2)}`;
    parts.push(`M${point(ra, a)} L${point(rb, b)} L${point(ib, b)} L${point(ia, a)} Z`);
  }
  return parts.join(' ');
}

export function WellDiagram({ energy, alpha, beta, compare }: { energy: number; alpha: number; beta: number; compare: boolean }) {
  const id = useId().replace(/:/g, '');
  const values = geometricValues(energy);
  const boundary = useMemo(() => diagramPath(energy), [energy]);
  const fixedRegion = useMemo(() => thresholdRegion(energy, alpha * energy), [energy, alpha]);
  const adaptiveRegion = useMemo(() => thresholdRegion(energy, beta * values.maxAbs), [energy, beta, values.maxAbs]);
  const limit = useMemo(() => diagramPath(ESCAPE_ENERGY - 1e-9), []);
  const rays = [Math.PI / 2, (7 * Math.PI) / 6, (11 * Math.PI) / 6];
  const fixedAtMaximum = Math.abs(alpha - values.D) < 1e-9;
  const adaptiveAtMaximum = compare && Math.abs(beta - 1) < 1e-9;
  return (
    <svg className="well-diagram" viewBox="0 0 520 435" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>Live bounded-well geometry</title>
      <desc id={`${id}-desc`}>Configuration-space boundary at E = {energy.toFixed(6)}. Saddle-approach radius r minus is {values.rMinus.toFixed(4)}; steep-ray radius r plus is {values.rPlus.toFixed(4)}. Hatching indicates states meeting the fixed threshold. {compare ? 'Violet shading indicates states meeting the adaptive threshold.' : ''} {fixedAtMaximum || adaptiveAtMaximum ? 'An equality criterion reaches only three extremal configuration points, marked with circles rather than shaded area.' : ''} Shading is not a probability or an area normalization.</desc>
      <defs>
        <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#ab603f" strokeWidth="1.3" />
        </pattern>
      </defs>
      <path d={limit} fill="none" className="well-limit" />
      <line x1="65" y1="215" x2="455" y2="215" className="diagram-axis" />
      <line x1="260" y1="27" x2="260" y2="393" className="diagram-axis" />
      {[-1, -0.5, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={diagramX(v)} y1="211" x2={diagramX(v)} y2="219" className="diagram-axis" />
          <text x={diagramX(v)} y="235" textAnchor="middle" className="diagram-tick">{v}</text>
        </g>
      ))}
      {[0.25, 0.5, 0.75].map((fraction) => <path key={fraction} d={diagramPath(energy * fraction)} className="well-inner" />)}
      <path d={boundary} fill="rgba(119,83,196,.055)" stroke="#7954c5" strokeWidth="1.8" />
      {compare && <path d={adaptiveRegion} fill="rgba(119,83,196,.25)" />}
      <path d={fixedRegion} fill={`url(#${id}-hatch)`} />
      {rays.map((phi, i) => (
        <g key={phi}>
          <line x1="260" y1="215" x2={diagramX(Math.cos(phi))} y2={diagramY(Math.sin(phi))} className="well-ray" />
          {fixedAtMaximum && <circle data-testid="fixed-extremum" cx={diagramX(values.rMinus * Math.cos(phi))} cy={diagramY(values.rMinus * Math.sin(phi))} r="4" fill="#fbfaf7" stroke="#ab603f" strokeWidth="1.5" />}
          {adaptiveAtMaximum && <circle data-testid="adaptive-extremum" cx={diagramX(values.rMinus * Math.cos(phi))} cy={diagramY(values.rMinus * Math.sin(phi))} r="6" fill="none" stroke="#7954c5" strokeWidth="1.5" />}
          <circle cx={diagramX(Math.cos(phi))} cy={diagramY(Math.sin(phi))} r="3.5" className="saddle-point" />
          <text x={diagramX(Math.cos(phi)) + (i === 1 ? -21 : 10)} y={diagramY(Math.sin(phi)) - 8} className="diagram-tick">S{i + 1}</text>
        </g>
      ))}
      <line x1="260" y1="215" x2="260" y2={diagramY(values.rMinus)} stroke="#7954c5" strokeWidth="2.5" />
      <text x="271" y={diagramY(values.rMinus / 2)} className="diagram-radius">r&#x208B;</text>
      <line x1="260" y1="215" x2="260" y2={diagramY(-values.rPlus)} stroke="#66616b" strokeWidth="2" />
      <text x="271" y={diagramY(-values.rPlus / 2) + 7} className="diagram-radius">r&#x208A;</text>
      <circle cx="260" cy="215" r="3" fill="#252129" />
      <text x="463" y="220" className="diagram-radius">x</text>
      <text x="268" y="30" className="diagram-radius">y</text>
      <text x="32" y="416" className="diagram-tick">CONFIGURATION SPACE (x, y)</text>
      <text x="488" y="416" textAnchor="end" className="diagram-tick">DASHED: E &#x2192; 1/6&#x207B;</text>
    </svg>
  );
}