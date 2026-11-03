import { useId, useMemo, useRef, type CSSProperties } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { boundaryPoints, ESCAPE_ENERGY, geometricValues, mix, smoothstep, thresholdValues } from '../lib/geometry';
import { Equation, MathText } from './Formula';

const WELL_CENTER = 220;
const WELL_SCALE = 162;
const GRAPH_LEFT = 54;
const GRAPH_RIGHT = 406;
const GRAPH_BOTTOM = 288;
const GRAPH_HEIGHT = 246;
const START_ENERGY = 0.05;
const END_ENERGY = 0.165;

const wellX = (x: number) => WELL_CENTER + x * WELL_SCALE;
const wellY = (y: number) => WELL_CENTER - y * WELL_SCALE;
const graphX = (energy: number) => GRAPH_LEFT + (energy - START_ENERGY) / (ESCAPE_ENERGY - START_ENERGY) * (GRAPH_RIGHT - GRAPH_LEFT);
const graphY = (value: number) => GRAPH_BOTTOM - value / 2.1 * GRAPH_HEIGHT;
const mobileX = (energy: number) => 24 + (energy - START_ENERGY) / (ESCAPE_ENERGY - START_ENERGY) * 392;
const mobileY = (value: number) => 94 - value / 2.1 * 76;

function wellPath(energy: number) {
  return boundaryPoints(energy, 240).map(({ x, y }, index) => `${index ? 'L' : 'M'}${wellX(x).toFixed(2)},${wellY(y).toFixed(2)}`).join(' ') + ' Z';
}

const escapeOutline = wellPath(ESCAPE_ENERGY - 1e-9);
const lowOutline = wellPath(START_ENERGY);
const boundCurve = Array.from({ length: 280 }, (_, index) => {
  const energy = mix(START_ENERGY, ESCAPE_ENERGY - 1e-8, index / 279);
  return `${index ? 'L' : 'M'}${graphX(energy).toFixed(2)},${graphY(geometricValues(energy).D).toFixed(2)}`;
}).join(' ');
const mobileCurve = Array.from({ length: 220 }, (_, index) => {
  const energy = mix(START_ENERGY, ESCAPE_ENERGY - 1e-8, index / 219);
  return `${index ? 'L' : 'M'}${mobileX(energy).toFixed(2)},${mobileY(geometricValues(energy).D).toFixed(2)}`;
}).join(' ');

function BoundFigure({ energy }: { energy: number }) {
  const id = useId().replace(/:/g, '');
  const { rMinus, rPlus, D } = geometricValues(energy);
  const boundary = useMemo(() => wellPath(energy), [energy]);
  const rays = [Math.PI / 2, 7 * Math.PI / 6, 11 * Math.PI / 6];
  const currentX = graphX(energy);
  const currentY = graphY(D);

  return (
    <figure className="bound-figure">
      <div className="bound-visuals">
        <svg className="bound-well" viewBox="0 0 440 440" role="img" aria-labelledby={`${id}-well-title ${id}-well-desc`}>
          <title id={`${id}-well-title`}>Bounded well changing with energy</title>
          <desc id={`${id}-well-desc`}>At E = {energy.toFixed(4)}, the bounded-well boundary is shown in violet. The three dotted lines point toward saddle channels. The saddle-approach radius is {rMinus.toFixed(4)} and the positive steep-ray radius is {rPlus.toFixed(4)}. The dashed outer contour is the one-sided escape limit.</desc>
          <path d={escapeOutline} className="bound-limit" />
          <path d={lowOutline} className="bound-low" />
          <line x1="31" y1="220" x2="409" y2="220" className="bound-axis" />
          <line x1="220" y1="31" x2="220" y2="409" className="bound-axis" />
          {rays.map((phi) => <line key={phi} x1="220" y1="220" x2={wellX(Math.cos(phi))} y2={wellY(Math.sin(phi))} className="bound-ray" />)}
          <path d={boundary} className="bound-current" data-testid="journey-well-boundary" />
          <line x1="220" y1="220" x2="220" y2={wellY(rMinus)} className="bound-radius" />
          <line x1="220" y1="220" x2="220" y2={wellY(-rPlus)} className="bound-steep-radius" />
          {rays.map((phi) => <circle key={phi} cx={wellX(rMinus * Math.cos(phi))} cy={wellY(rMinus * Math.sin(phi))} r="4.5" className="bound-extremum" />)}
          <circle cx="220" cy="220" r="3" className="bound-origin" />
          <text x="230" y={wellY(rMinus / 2)} className="bound-math-label">r&#x208B;</text>
          <text x="230" y={wellY(-rPlus / 2) + 5} className="bound-secondary-label">r&#x208A;</text>
          <text x="405" y="210" className="bound-axis-label">x</text>
          <text x="229" y="40" className="bound-axis-label">y</text>
          <text x="32" y="424" className="bound-annotation">CONFIGURATION SPACE</text>
        </svg>
        <svg className="bound-plot" viewBox="0 0 440 350" role="img" aria-labelledby={`${id}-plot-title ${id}-plot-desc`}>
          <title id={`${id}-plot-title`}>The radius traces the geometric bound</title>
          <desc id={`${id}-plot-desc`}>The current energy E = {energy.toFixed(4)} maps to D(E) = {D.toFixed(4)}. The curve grows strictly to the one-sided limit 2 as E approaches 1/6 from below. The fixed alpha = 1 level is crossed at E = 9/64.</desc>
          <defs><clipPath id={`${id}-curve-clip`}><rect x={GRAPH_LEFT - 2} y="0" width={Math.max(0, currentX - GRAPH_LEFT + 3)} height="320" /></clipPath></defs>
          {[0, 1, 2].map((value) => <g key={value}><line x1={GRAPH_LEFT} y1={graphY(value)} x2={GRAPH_RIGHT} y2={graphY(value)} className="bound-plot-grid" /><text x="40" y={graphY(value) + 4} textAnchor="end" className="bound-annotation">{value}</text></g>)}
          <line x1={GRAPH_LEFT} y1={GRAPH_BOTTOM} x2={GRAPH_RIGHT} y2={GRAPH_BOTTOM} className="bound-plot-axis" />
          <line x1={GRAPH_LEFT} y1="38" x2={GRAPH_LEFT} y2={GRAPH_BOTTOM} className="bound-plot-axis" />
          <line x1={graphX(9 / 64)} y1="38" x2={graphX(9 / 64)} y2={GRAPH_BOTTOM} className="bound-onset" />
          <path d={boundCurve} className="bound-curve-guide" />
          <path d={boundCurve} className="bound-curve-active" clipPath={`url(#${id}-curve-clip)`} />
          <line x1={currentX} y1={currentY} x2={currentX} y2={GRAPH_BOTTOM} className="bound-plot-current" />
          <circle cx={currentX} cy={currentY} r="6" className="bound-plot-point" data-testid="journey-curve-point" />
          <circle cx={GRAPH_RIGHT} cy={graphY(2)} r="4" className="bound-plot-limit" />
          <text x={GRAPH_LEFT} y="21" className="bound-annotation">GEOMETRIC BOUND D(E)</text>
          <text x={GRAPH_LEFT} y="312" textAnchor="middle" className="bound-annotation">0.05</text>
          <text x={graphX(9 / 64)} y="312" textAnchor="middle" className="bound-annotation">9/64</text>
          <text x={GRAPH_RIGHT} y="312" textAnchor="end" className="bound-annotation">1/6&#x207B;</text>
          <text x={GRAPH_RIGHT} y="342" textAnchor="end" className="bound-annotation">ENERGY E</text>
        </svg>
        <svg className="bound-mobile-plot" viewBox="0 0 440 120" role="img" aria-labelledby={`${id}-mobile-title ${id}-mobile-desc`}>
          <title id={`${id}-mobile-title`}>The radius traces the geometric bound</title>
          <desc id={`${id}-mobile-desc`}>At E = {energy.toFixed(4)}, D(E) = {D.toFixed(4)}. The open point marks the one-sided limit 2 as energy approaches 1/6.</desc>
          <defs><clipPath id={`${id}-mobile-clip`}><rect x="22" y="0" width={Math.max(0, mobileX(energy) - 22)} height="100" /></clipPath></defs>
          <line x1="24" y1="94" x2="416" y2="94" className="bound-plot-axis" />
          <line x1="24" y1={mobileY(1)} x2="416" y2={mobileY(1)} className="bound-plot-grid" />
          <path d={mobileCurve} className="bound-curve-guide" />
          <path d={mobileCurve} className="bound-curve-active" clipPath={`url(#${id}-mobile-clip)`} />
          <circle cx={mobileX(energy)} cy={mobileY(D)} r="4.5" className="bound-plot-point" />
          <circle cx="416" cy={mobileY(2)} r="4" className="bound-plot-limit" />
          <text x="24" y="114" className="bound-annotation">E = 0.05</text>
          <text x="416" y="114" textAnchor="end" className="bound-annotation">E &#x2192; 1/6&#x207B;</text>
        </svg>
      </div>
      <figcaption>The violet points mark the global absolute extrema on the saddle-approach rays. Their radius traces <MathText>D(E)</MathText>; the escape contour is a one-sided limit. This is not a trajectory.</figcaption>
    </figure>
  );
}

export function BoundJourney({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced);
  const visualProgress = reduced ? 0.62 : progress;
  const energy = mix(START_ENERGY, END_ENERGY, smoothstep(0.02, 0.96, visualProgress));
  const values = geometricValues(energy);

  return (
    <section ref={ref} className="bound-journey" aria-labelledby="bound-journey-title" style={{ '--bound-progress': visualProgress } as CSSProperties}>
      <div className="bound-stage page-gutter">
        <div className="section-topline"><span className="mono">THE PROOF / IN MOTION</span><span className="mono">ONE WELL. ONE GLOBAL BOUND.</span></div>
        <div className="bound-layout">
          <div className="bound-copy">
            <p className="eyebrow">FROM RADIUS TO RANGE</p>
            <h2 id="bound-journey-title">An edge<br />{' '}<em>becomes</em><br />a scale.</h2>
            <p>As energy rises, the well stretches toward the saddles. Its longest radius sets the maximum absolute cubic excursion.</p>
            <Equation>{String.raw`|V_3|_{\max}=\frac{r_-^3}{3}`}</Equation>
            <div className="bound-readout" aria-label={`E = ${energy.toFixed(4)}; r minus = ${values.rMinus.toFixed(4)}; D of E = ${values.D.toFixed(4)}`}>
              <div><span>ENERGY E</span><strong data-testid="journey-energy">{energy.toFixed(4)}</strong></div>
              <div><span>RADIUS r&#x208B;</span><strong>{values.rMinus.toFixed(4)}</strong></div>
              <div><span>BOUND D(E)</span><strong data-testid="journey-bound">{values.D.toFixed(4)}</strong></div>
            </div>
          </div>
          <BoundFigure energy={energy} />
        </div>
      </div>
    </section>
  );
}

export function ThresholdJourney({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced);
  const visualProgress = reduced ? 0.54 : progress;
  const energy = mix(START_ENERGY, END_ENERGY, smoothstep(0.03, 0.97, visualProgress));
  const result = thresholdValues(energy, 1, 0.5);
  const maxScale = 3.5;
  const fixedPosition = result.betaEffective / maxScale * 100;
  const availablePosition = 1 / maxScale * 100;
  const adaptivePosition = 0.5 / maxScale * 100;

  return (
    <section ref={ref} className="threshold-journey" aria-labelledby="threshold-journey-title" style={{ '--threshold-progress': visualProgress } as CSSProperties}>
      <div className="threshold-stage page-gutter">
        <div className="section-topline"><span className="mono">THE SAME FIXED CRITERION / &#x03B1; = 1</span><span className="mono">A CHANGING GEOMETRIC MEANING</span></div>
        <div className="threshold-headline">
          <div>
            <p className="eyebrow">A THRESHOLD IS A FRACTION OF SOMETHING</p>
            <h2 id="threshold-journey-title">Same number.<br /><em>Different test.</em></h2>
            <p>Keep <MathText>{String.raw`\alpha=1`}</MathText> fixed while the available excursion changes.</p>
          </div>
          <div className="threshold-number-group">
            <div className="threshold-number" data-testid="journey-fixed-fraction">{(result.betaEffective * 100).toFixed(0)}<span>%</span></div>
            <p>OF THE MAXIMUM ABSOLUTE EXCURSION</p>
          </div>
        </div>
        <div className="threshold-scale" role="img" aria-label={`At energy ${energy.toFixed(4)}, fixed alpha 1 is ${(result.betaEffective * 100).toFixed(1)} percent of the maximum absolute excursion and is geometrically ${result.attainable ? 'attainable' : 'unattainable'}. An adaptive beta of 0.5 remains at 50 percent.`}>
          <div className="threshold-scale-header"><span>FRACTION OF THE ABSOLUTE MAXIMUM</span><span>E = <strong data-testid="threshold-energy">{energy.toFixed(4)}</strong></span></div>
          <div className="threshold-scale-track">
            <div className="threshold-scale-available" style={{ width: `${availablePosition}%` }} />
            <div className="threshold-fixed-carrier" style={{ transform: `translate3d(${fixedPosition}%, 0, 0)` }} data-testid="fixed-scroll-marker"><div className="threshold-scale-fixed"><span>fixed &#x03B1; = 1</span></div></div>
            <div className="threshold-scale-adaptive" style={{ left: `${adaptivePosition}%` }}><span>adaptive &#x03B2; = 0.5</span></div>
          </div>
          <div className="threshold-scale-labels"><span>0</span><span style={{ left: `${availablePosition}%` }}>100% / MAXIMUM</span><span>350%</span></div>
        </div>
        <div className="threshold-status">
          <div><span className={`threshold-status-dot ${result.attainable ? 'is-attainable' : ''}`} /><strong data-testid="threshold-scroll-status">Geometrically {result.attainable ? 'attainable' : 'unattainable'}</strong></div>
          <p>{result.attainable ? 'Some states can meet the fixed criterion; a particular trajectory need not reach them.' : 'The fixed threshold is above the global maximum, so no state in the well can meet it.'} The adaptive marker stays at 50%. Neither marker predicts transport.</p>
        </div>
      </div>
    </section>
  );
}