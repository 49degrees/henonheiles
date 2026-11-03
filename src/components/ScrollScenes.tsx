import { useRef, type CSSProperties } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { boundaryRadius, clamp, cubicPotential, geometricValues, mix, smoothstep } from '../lib/geometry';
import { MathText, Equation } from './Formula';
import { Arrow } from './Icons';
import { WellCanvas } from './WellCanvas';

export function Hero({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced, 'hero');
  return (
    <section className="hero" ref={ref} aria-labelledby="essay-title" style={{ '--hero-progress': progress } as CSSProperties}>
      <div className="hero-art" aria-hidden="true">
        <WellCanvas energy={mix(0.125, 0.158, progress)} progress={progress} />
      </div>
      <div className="hero-content page-gutter">
        <p className="eyebrow hero-eyebrow"><span className="short-rule" /> A VISUAL PAPER IN NONLINEAR DYNAMICS</p>
        <h1 id="essay-title">
          <span>Instability</span>
          <span>is <em>not</em></span>
          <span>transport<span className="title-period">.</span></span>
        </h1>
        <p className="hero-description">The same threshold is not the same test<br className="desktop-break" /> at different energies. A geometric journey<br className="desktop-break" /> through the H&eacute;non&ndash;Heiles system.</p>
        <div className="hero-actions">
          <a href="#argument" className="button-primary">Follow the argument <Arrow direction="down" /></a>
          <a href="#lab" className="text-link">Enter the lab <Arrow direction="up-right" /></a>
        </div>
      </div>
      <div className="hero-footer page-gutter">
        <span className="mono">GEOMETRIC THRESHOLDS / H&Eacute;NON&ndash;HEILES</span>
        <span className="hero-scroll-hint">A CHANGE OF SCALE. A CHANGE OF MEANING. <Arrow direction="down" /></span>
      </div>
    </section>
  );
}

const beats = [
  {
    number: '01',
    title: <>An identity.<br />Not an approximation.</>,
    equation: String.raw`J(t)+V_3(\mathbf q(t))=E`,
  },
  { number: '02', title: <>The energy rises.<br />The well changes.</>, equation: String.raw`0<E<E_c=\frac16` },
  { number: '03', title: <>A fixed threshold.<br />A moving target.</>, equation: String.raw`\beta_{\rm eff}=\frac{\alpha}{D(E)}` },
  { number: '04', title: <>Hold the fraction.<br />Let the threshold move.</>, equation: String.raw`\alpha(E)=\beta D(E)` },
];

export function ArgumentScene({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced);
  const energy = mix(0.05, 0.165, smoothstep(0.14, 0.71, progress));
  const values = geometricValues(energy);
  const phi = 0.9 + progress * 8;
  const radius = 0.72 * boundaryRadius(energy, phi);
  const v3 = cubicPotential(radius * Math.cos(phi), radius * Math.sin(phi));
  const action = energy - v3;
  const normalized = smoothstep(0.72, 0.93, progress);
  const alpha = mix(1, 0.5 * values.D, normalized);
  const meterOpacity = smoothstep(0.37, 0.55, progress);

  return (
    <section id="argument" className={`argument-section page-gutter ${reduced ? 'static-scene' : ''}`} ref={ref} aria-label="A continuous argument in four steps" style={{ '--argument-progress': progress } as CSSProperties}>
      <div className="section-topline"><span className="mono">01 / FOLLOW THE GEOMETRY</span><span className="mono">SCROLL TO EXPLORE</span></div>
      <div className="argument-layout">
        <figure className="argument-visual">
          <div className="figure-topline"><span>THE BOUNDED WELL</span><span>E = {energy.toFixed(4)}</span></div>
          <div className="argument-canvas-wrap"><WellCanvas energy={energy} progress={progress} variant="argument" /></div>
          <div className="argument-readout">
            <div className="identity-balance" style={{ opacity: reduced ? 1 : 1 - meterOpacity }} aria-hidden={!reduced && meterOpacity > 0.01}>
              <div><MathText>J</MathText><strong>{action.toFixed(4)}</strong></div>
              <span>+</span>
              <div><MathText>V_3</MathText><strong>{v3 < 0 ? `(${v3.toFixed(4)})` : v3.toFixed(4)}</strong></div>
              <span>=</span>
              <div><MathText>E</MathText><strong>{energy.toFixed(4)}</strong></div>
            </div>
            {!reduced && (
              <div className="range-meter" style={{ opacity: meterOpacity }} aria-hidden={meterOpacity < 0.99}>
                <div className="range-meter-label"><span>AVAILABLE RANGE / E</span><span>{normalized > 0.5 ? 'NORMALIZED \u03b2 = 0.5' : 'FIXED \u03b1 = 1'}</span></div>
                <div className="range-meter-track">
                  <div className="range-meter-fill" style={{ width: `${values.D / 2 * 100}%` }} />
                  <div className={`range-meter-marker ${normalized > 0.5 ? 'normalized' : ''}`} style={{ left: `${alpha / 2 * 100}%` }}><span>{normalized > 0.5 ? '\u03b1(E)' : '\u03b1'}</span></div>
                </div>
                <div className="range-meter-ticks"><span>0</span><span>1</span><span>2</span></div>
              </div>
            )}
          </div>
          <figcaption>One potential surface, viewed continuously. The point is a configuration sample driven by scroll, <strong>not a simulated trajectory.</strong> S1&ndash;S3 mark the saddle directions. Readouts are rounded.</figcaption>
        </figure>
        <div className="argument-steps">
          {beats.map((beat, index) => {
            const focus = reduced ? 1 : 0.7 + 0.3 * clamp(1 - Math.abs(progress * 3.6 - index) * 0.8);
            return (
              <article className="argument-beat" key={beat.number} style={{ '--beat-focus': focus, '--beat-offset': clamp(progress * 3.6 - index, -1, 1) } as CSSProperties}>
                <span className="beat-number mono">{beat.number} / 04</span>
                <h2>{beat.title}</h2>
                <Equation>{beat.equation}</Equation>
                {index === 0 && <><p>The harmonic energy <MathText>J</MathText> and cubic potential <MathText>V_3=x^2y-y^3/3</MathText> always add to the conserved energy <MathText>E</MathText>. Their complementary changes are exact.</p><p className="small-note">On the section <MathText>{String.raw`y=0,\ p_y>0`}</MathText>, <MathText>V_3=0</MathText> and <MathText>J=E</MathText> at every crossing.</p></>}
                {index === 1 && <><p>As energy approaches <MathText>E_c=1/6</MathText> from below, the boundary stretches toward three saddles. The available cubic excursion grows faster than the energy itself.</p><p className="small-note">At <MathText>E_c</MathText>, three escape channels open. Above it, trajectories can escape, but not every trajectory does.</p></>}
                {index === 2 && <><p>A fixed criterion <MathText>{String.raw`|V_3|\ge\alpha E`}</MathText> occupies the fraction <MathText>{String.raw`\alpha/D(E)`}</MathText> of the available maximum. The denominator changes with energy.</p><p className="small-note">For <MathText>{String.raw`\alpha=1`}</MathText>, it is impossible anywhere in the bounded well below <MathText>E=9/64</MathText>.</p></>}
                {index === 3 && <><p>Choose a fraction <MathText>{String.raw`\beta\in(0,1]`}</MathText> of the maximum excursion. Then let the energy-relative threshold adapt: <MathText>{String.raw`\alpha(E)=\beta D(E)`}</MathText>.</p><p className="small-note">The scale is now calibrated. Crossing probabilities, passage times, and transport are not.</p></>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function EndScene({ reduced, openPaper }: { reduced: boolean; openPaper: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced, 'ending');
  return (
    <section id="conclusion" className="end-scene page-gutter" ref={ref} style={{ '--ending-progress': progress } as CSSProperties}>
      <div className="ending-art" aria-hidden="true" style={{ transform: `rotate(${mix(-12, 0, progress)}deg) scale(${mix(1.12, 0.9, progress)})` }}>
        <WellCanvas energy={mix(0.15, 0.05, progress)} progress={progress} variant="ending" />
      </div>
      <p className="eyebrow">06 / WHAT THE GEOMETRY CAN SAY</p>
      <h2>Calibrate the scale.<br /><em>Not the claim.</em></h2>
      <p className="end-lead">One exact geometric correction. No shortcut from instability to transport.</p>
      <ol className="limitations">
        <li><span>01</span>The normalization does not make crossing statistics dynamically invariant.</li>
        <li><span>02</span>Invariant structures may keep a trajectory from reaching the global maximum.</li>
        <li><span>03</span>No relationship between chaos and transport is claimed.</li>
      </ol>
      <div className="end-actions">
        <button type="button" className="button-primary" onClick={openPaper}>Read the complete paper <Arrow direction="up-right" /></button>
        <a href="/research-paper.md" download className="text-link">Download source draft <Arrow direction="down" /></a>
      </div>
    </section>
  );
}