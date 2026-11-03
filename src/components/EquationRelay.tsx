import { useMemo, useRef, type CSSProperties } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { boundaryPoints, clamp, ESCAPE_ENERGY, geometricValues, mix, smoothstep } from '../lib/geometry';
import { Equation, MathText } from './Formula';

const RELAY_MIN = 0.02;
const RELAY_MAX = 0.165;
const WELL_CENTER = 260;
const WELL_SCALE = 185;

function relayWellPath(energy: number) {
  return boundaryPoints(energy, 180).map(({ x, y }, index) =>
    `${index ? 'L' : 'M'}${(WELL_CENTER + x * WELL_SCALE).toFixed(2)},${(WELL_CENTER - y * WELL_SCALE).toFixed(2)}`,
  ).join(' ') + ' Z';
}

const relayRibbonPath = Array.from({ length: 120 }, (_, index) => {
  const t = index / 119;
  const energy = RELAY_MIN + t * (RELAY_MAX - RELAY_MIN);
  const { D } = geometricValues(energy);
  return `${index ? 'L' : 'M'}${(t * 1200).toFixed(2)},${(42 - (D - 1) * 20).toFixed(2)}`;
}).join(' ');

const ribbonNodes = Array.from({ length: 4 }, (_, index) => {
  const t = index / 3;
  const energy = RELAY_MIN + t * (RELAY_MAX - RELAY_MIN);
  const { D } = geometricValues(energy);
  return { x: t * 1200, y: 42 - (D - 1) * 20 };
});

const plates = [
  {
    tag: 'AN EXACT IDENTITY',
    equation: String.raw`J(t)+V_3(\mathbf q(t))=E`,
    caption: 'The harmonic energy and the cubic potential always add to E.',
  },
  {
    tag: 'THREEFOLD DOMAIN',
    equation: String.raw`V=\tfrac12r^2+\tfrac13r^3\sin3\varphi`,
    caption: 'One bounded well. Three saddle-approach directions. One steep family.',
  },
  {
    tag: 'A GLOBAL EXTREMUM',
    equation: String.raw`|V_3|_{\max}=\frac{r_-^3}{3}`,
    caption: 'The longest saddle-approach radius sets the absolute excursion.',
  },
  {
    tag: 'A HELD FRACTION',
    equation: String.raw`\alpha(E)=\beta D(E)`,
    caption: 'Follow the geometric scale to hold the threshold at a fixed fraction.',
  },
];

function plateStyle(delta: number): CSSProperties {
  const distance = Math.abs(delta);
  const visible = distance < 0.5;
  const inset = clamp(distance * 13, 0, 44);
  return {
    transform: `perspective(1400px) translate3d(${-delta * 38}vw, ${delta * 3.5}vh, ${-distance * 90}px) rotateY(${delta * -27}deg) rotateZ(${delta * -2.2}deg) scale(${1 - distance * 0.085})`,
    opacity: visible ? 1 : 0,
    clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
    visibility: visible ? 'visible' : 'hidden',
    zIndex: visible ? 20 : 0,
  };
}

export function EquationRelay({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced);
  const visualProgress = reduced ? 0.5 : progress;
  const energy = mix(RELAY_MIN, RELAY_MAX, smoothstep(0.03, 0.97, visualProgress));
  const { rMinus, D } = geometricValues(energy);
  const wellPath = useMemo(() => relayWellPath(energy), [energy]);
  const cursor = visualProgress * (plates.length - 1);
  const activeIndex = Math.round(cursor);

  return (
    <section
      ref={ref}
      className={`equation-relay ${reduced ? 'relay-static' : ''}`}
      aria-labelledby="relay-title"
      data-testid="equation-relay"
      data-progress={visualProgress.toFixed(4)}
      style={{ '--relay-progress': visualProgress } as CSSProperties}
    >
      <div className="relay-stage page-gutter">
        <div className="section-topline"><span className="mono">THE PROOF / HINGED ON ONE ORIGIN</span><span className="mono">FOUR EXACT STATES</span></div>
        <div className="relay-intro">
          <p className="eyebrow">AN EQUATION RELAY</p>
          <h2 id="relay-title">The proof<br /><em>turns on itself.</em></h2>
          <p>Each state inherits the previous one's scale. The well behind them keeps expanding from the exact formulas.</p>
          <div className="relay-index-readout"><span>{String(activeIndex + 1).padStart(2, '0')}</span> / 04</div>
        </div>
        <div className="relay-frame">
          <svg
            className="relay-well"
            viewBox="0 0 520 520"
            role="img"
            aria-label={`An exact bounded-well contour at energy ${energy.toFixed(4)} expands behind the equation relay.`}
            style={{ transform: `rotate(${mix(-8, 10, visualProgress)}deg) scale(${mix(0.9, 1.08, visualProgress)})` }}
          >
            <path d={relayWellPath(ESCAPE_ENERGY - 1e-9)} className="relay-well-limit" />
            <path d={wellPath} className="relay-well-boundary" data-testid="relay-well-path" />
            {[Math.PI / 2, 7 * Math.PI / 6, 11 * Math.PI / 6].map((phi) => (
              <line key={phi} x1="260" y1="260" x2={260 + Math.cos(phi) * WELL_SCALE} y2={260 - Math.sin(phi) * WELL_SCALE} className="relay-well-ray" />
            ))}
            <circle cx="260" cy="260" r="3" className="relay-well-origin" />
          </svg>
          <span className="relay-hinge" aria-hidden="true" />
          <div className="relay-plates">
            {plates.map((plate, index) => {
              const delta = cursor - index;
              const distance = Math.abs(delta);
              const visible = distance < 0.5;
              return (
                <article
                  key={plate.tag}
                  className={`relay-plate ${visible ? 'is-active' : ''}`}
                  style={plateStyle(delta)}
                  data-testid={`relay-plate-${index}`}
                  data-active={visible ? 'true' : 'false'}
                  aria-hidden={!reduced && !visible}
                >
                  <span className="relay-plate-tag mono">{String(index + 1).padStart(2, '0')} / {plate.tag}</span>
                  <Equation>{plate.equation}</Equation>
                  <p>{plate.caption}</p>
                </article>
              );
            })}
          </div>
          <div className="relay-hud" aria-label={`At the current scroll state, energy is ${energy.toFixed(4)}, r minus is ${rMinus.toFixed(4)}, and D is ${D.toFixed(4)}.`}>
            <span><MathText>E</MathText><strong data-testid="relay-energy">{energy.toFixed(4)}</strong></span>
            <span><MathText>r_-</MathText><strong>{rMinus.toFixed(4)}</strong></span>
            <span><MathText>D(E)</MathText><strong>{D.toFixed(4)}</strong></span>
          </div>
          <svg className="relay-ribbon" viewBox="0 0 1200 80" preserveAspectRatio="none" role="img" aria-label="A ribbon drawn from the exact D(E) curve records progress through the four equations.">
            <path d={relayRibbonPath} className="relay-ribbon-guide" />
            <path
              d={relayRibbonPath}
              className="relay-ribbon-active"
              pathLength={1}
              style={{ strokeDashoffset: 1 - visualProgress }}
              data-testid="relay-ribbon"
            />
            {ribbonNodes.map((node, index) => <circle key={index} cx={node.x} cy={node.y} r="4" className={index <= activeIndex ? 'relay-ribbon-node is-drawn' : 'relay-ribbon-node'} />)}
          </svg>
        </div>
      </div>
    </section>
  );
}
