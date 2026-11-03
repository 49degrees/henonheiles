import { useRef, type CSSProperties } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { TABLE_ROWS, geometricValues, mix, smoothstep } from '../lib/geometry';
import { Equation, MathText } from './Formula';
import { ScaleChart } from './Charts';
import { PaperText, sectionText } from './PaperText';
import { Arrow } from './Icons';

export function Introduction({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced, 'ending');
  return (
    <section ref={ref} className="introduction page-gutter" aria-labelledby="premise-title" style={{ '--intro-progress': progress } as CSSProperties}>
      <div className="editorial-grid">
        <div className="section-rail"><span className="mono">THE PREMISE</span><span className="rail-note">A pedagogical calibration<br />of one geometric scale.</span></div>
        <div className="editorial-content">
          <h2 id="premise-title">Before asking how far a system moves,<br />ask how much room it has.</h2>
          <div className="intro-columns"><p>The H&eacute;non&ndash;Heiles system is a classical model of nonlinear dynamics with two degrees of freedom. Below the escape energy, its motion has a bounded component. <a href="#reference-1" className="citation">[1&ndash;3]</a></p><p>A threshold expressed as a fixed fraction of energy sounds consistent. But as the well deforms, the available perturbation changes. The same number can become a different test.</p></div>
          <Equation number="1">{String.raw`H=\underbrace{\tfrac12(p_x^2+p_y^2+x^2+y^2)}_{J\,:\,\text{harmonic energy}}+\underbrace{x^2y-\tfrac13y^3}_{V_3\,:\,\text{cubic potential}}=E`}</Equation>
          <p className="small-note">The variables <MathText>x,y</MathText> are positions; <MathText>p_x,p_y</MathText> are conjugate momenta. All energies and coordinates here are dimensionless. This is a worked criterion, not a claim that a published study uses it.</p>
        </div>
      </div>
    </section>
  );
}

export function GeometryArticle() {
  return (
    <section id="geometry" className="geometry-section page-gutter">
      <div className="section-topline"><span className="mono">02 / THE EXACT BOUND</span><span className="mono">LEMMA 1 + THEOREM 1</span></div>
      <div className="editorial-grid">
        <aside className="section-rail"><span className="mono">DOMAIN</span><MathText>{String.raw`0<E<\tfrac16`}</MathText><p className="rail-note">The escape energy is not included in the bounded-well theorem.</p></aside>
        <article className="editorial-content">
          <h2>The largest excursion<br />lives at the edge.</h2>
          <p className="section-lead">The geometry gives a global maximum, not merely a value along one trajectory.</p>
          <p>Let <MathText>D_E</MathText> be the bounded connected component of <MathText>{String.raw`\{V\le E\}`}</MathText> containing the origin. It is the configuration-space projection of the bounded energy surface. In polar coordinates, write</p>
          <Equation>{String.raw`V=\tfrac12r^2+\tfrac13r^3s,\qquad V_3=\tfrac13r^3s,\qquad s=\sin3\varphi.`}</Equation>
          <p>The saddle-approach rays have <MathText>s=-1</MathText>, negative <MathText>V_3</MathText>, and turning radius <MathText>r_-</MathText>. The steep rays have <MathText>s=+1</MathText>, positive <MathText>V_3</MathText>, and radius <MathText>r_+</MathText>.</p>
          <ol className="proof-steps">
            <li><span className="proof-index">i.</span><div><h3>First, the bounded well is star-shaped.</h3><p>Along a ray, <MathText>{String.raw`g(r)=r^2/2+sr^3/3`}</MathText> has <MathText>{String.raw`g'(r)=r(1+sr)>0`}</MathText> on <MathText>(0,1)</MathText>. Since <MathText>g(0)=0</MathText> and <MathText>{String.raw`g(1)\ge1/6>E`}</MathText>, there is exactly one boundary radius <MathText>{String.raw`r_b(\varphi)\in(0,1)`}</MathText>. The unit circle excludes any route to another component, so <MathText>{String.raw`D_E=\{r\le r_b(\varphi)\}`}</MathText> is compact.</p></div></li>
            <li><span className="proof-index">ii.</span><div><h3>Then, move every candidate to the boundary.</h3><p>At fixed angle, <MathText>{String.raw`|V_3|=r^3|s|/3`}</MathText> is nondecreasing in radius. Its maximum must occur at the edge. Implicit differentiation shows that the boundary radius decreases with <MathText>s</MathText>:</p><Equation>{String.raw`\frac{dr_b}{ds}=-\frac{r_b^2}{3(1+sr_b)}<0.\qquad r_->r_+`}</Equation></div></li>
            <li><span className="proof-index">iii.</span><div><h3>The saddle-approach rays win globally.</h3><p>On the boundary, <MathText>{String.raw`V_3=E-r_b^2/2`}</MathText> increases with <MathText>s</MathText>. Its endpoints are <MathText>{String.raw`-r_-^3/3`}</MathText> and <MathText>{String.raw`+r_+^3/3`}</MathText>. Because <MathText>r_-&gt;r_+</MathText>, the negative excursion has the larger absolute value.</p></div></li>
          </ol>
          <Equation number="L1" className="statement-equation">{String.raw`\max_{D_E}|V_3|=\frac{r_-^3}{3}\quad\ne\quad\max_{D_E}V_3=\frac{r_+^3}{3}`}</Equation>
          <div className="definition-note"><span className="mono">A PRECISE USE OF &ldquo;FRACTION&rdquo;</span><p>A fraction of <strong>the maximum absolute excursion</strong>. Not a fraction of configuration-space area, and not a fraction of the peak-to-peak range <MathText>{String.raw`(r_-^3+r_+^3)/3`}</MathText>.</p></div>
          <details className="technical-details" open>
            <summary>Three real roots. One physical branch.<span aria-hidden="true">+</span></summary>
            <div className="details-body">
              <p>The saddle equation <MathText>{String.raw`2r^3-3r^2+6E=0`}</MathText>, under <MathText>r=u+1/2</MathText>, becomes</p>
              <Equation number="5">{String.raw`u^3-\tfrac34u+(3E-\tfrac14)=0.`}</Equation>
              <p>Its discriminant <MathText>{String.raw`\Delta=243E(1/6-E)>0`}</MathText> gives three distinct real roots. Set <MathText>{String.raw`\theta=\arccos(1-12E)\in(0,\pi)`}</MathText> and use the triple-angle identity.</p>
              <div className="table-scroll" tabIndex={0} role="region" aria-label="Cubic root branches"><table className="branch-table"><thead><tr><th>Branch</th><th>Root range</th><th>Meaning</th></tr></thead><tbody><tr><td><MathText>k=0</MathText></td><td><MathText>(1,3/2)</MathText></td><td>Exterior, beyond the saddle</td></tr><tr><td><MathText>k=1</MathText></td><td><MathText>(-1/2,0)</MathText></td><td>Negative, unphysical</td></tr><tr><td><MathText>k=2</MathText></td><td><MathText>(0,1)</MathText></td><td>Inner turning point <MathText>r_-</MathText></td></tr></tbody></table></div>
              <Equation number="3a">{String.raw`r_-(E)=\tfrac12+\cos\!\left(\tfrac{\theta}{3}-\tfrac{2\pi}{3}\right)`}</Equation>
              <Equation number="3b">{String.raw`r_+(E)=-\tfrac12-\cos\!\left(\tfrac{\theta}{3}+\tfrac{2\pi}{3}\right)`}</Equation>
              <p>The steep equation is the saddle equation with <MathText>{String.raw`r\mapsto-r`}</MathText>. Its positive root is <MathText>r_+=-r_1</MathText>; uniqueness follows because <MathText>2r^3+3r^2-6E</MathText> increases for <MathText>r&gt;0</MathText>.</p>
            </div>
          </details>
          <div className="exact-check"><span className="mono">EXACT CHECK / E = 1/12</span><p><MathText>r_-=1/2</MathText> gives <MathText>D(E)=1/2</MathText>. Meanwhile <MathText>{String.raw`r_+=(\sqrt3-1)/2`}</MathText> gives the <strong>positive steep-ray value</strong> <MathText>{String.raw`3\sqrt3-5\approx0.1962`}</MathText>. These are different quantities.</p></div>
          <p className="small-note">A separate identity caveat: in general <MathText>{String.raw`|\Delta J|=|V_3(t)-V_3(0)|`}</MathText>, not <MathText>|V_3(t)|</MathText>. The latter applies only when the initial point is on the section <MathText>y=0</MathText>.</p>
        </article>
      </div>
    </section>
  );
}

export function GrowthSection({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced, 'ending');
  const energy = mix(0.01, 0.1665, smoothstep(0.06, 0.94, progress));
  const bound = geometricValues(energy).D;
  return (
    <section ref={ref} className="growth-section page-gutter" aria-labelledby="growth-title" style={{ '--growth-progress': progress } as CSSProperties}>
      <div className="section-topline"><span className="mono">THE GEOMETRIC CALIBRATION</span><span className="mono">FIGURE 1A / RECOMPUTED FROM EQ. (4)</span></div>
      <div className="growth-layout">
        <div className="growth-copy"><h2 id="growth-title">The energy changes.<br />So does the scale.</h2><p>The maximum absolute excursion, measured against energy, grows strictly.</p><Equation number="4">{String.raw`D(E)\equiv D_{\rm abs}^{\rm geom}(E)=\frac{|V_3|_{\max}}{E}=\frac{2r_-}{3-2r_-}`}</Equation><div className="growth-factor"><span>6.26<span className="factor-times">&times;</span></span><p>growth from <MathText>E=0.05</MathText><br />to the one-sided escape limit</p></div></div>
        <figure className="growth-figure">{!reduced && <div className="figure-trace-line"><span>SCROLL-DRIVEN TRACE</span><span>E = {energy.toFixed(4)} / D(E) = {bound.toFixed(4)}</span></div>}<ScaleChart energy={reduced ? undefined : energy} /><figcaption><strong>Figure 1a.</strong> The geometric bound (violet) crosses fixed <MathText>{String.raw`\alpha=1`}</MathText> (dashed) at <MathText>E=9/64</MathText>. The open endpoint is the limit <MathText>{String.raw`E\to1/6^-`}</MathText>, not an included energy.</figcaption></figure>
      </div>
      <div className="growth-proof"><span className="mono">WHY IT INCREASES</span><div><p>Both links in the chain are positive: <MathText>{String.raw`\frac{dD}{dr_-}=\frac{6}{(3-2r_-)^2}>0`}</MathText> and <MathText>{String.raw`\frac{dE}{dr_-}=r_-(1-r_-)>0`}</MathText>. Thus <MathText>dD/dE&gt;0</MathText> throughout the domain.</p><p className="small-note">As <MathText>{String.raw`E\to0^+`}</MathText>, <MathText>{String.raw`r_-\to0`}</MathText> and <MathText>{String.raw`D\to0`}</MathText>. As <MathText>{String.raw`E\to1/6^-`}</MathText>, <MathText>{String.raw`r_-\to1`}</MathText> and <MathText>{String.raw`D\to2`}</MathText>.</p></div></div>
      <details className="technical-details dark-details">
        <summary>Inspect the numerical evidence <span className="mono">TABLE 1 <span aria-hidden="true">+</span></span></summary>
        <div className="details-body"><div className="table-scroll" tabIndex={0} role="region" aria-label="Turning radii and geometric bounds"><table><thead><tr><th><MathText>E</MathText></th><th><MathText>r_-</MathText></th><th><MathText>r_+</MathText></th><th><MathText>{String.raw`D_{\rm abs}^{\rm geom}`}</MathText></th><th>Positive steep <MathText>V_3/E</MathText></th><th><MathText>{String.raw`D_{\rm range}^{\rm geom}`}</MathText></th></tr></thead><tbody>{TABLE_ROWS.map(({ label, energy }) => { const v = geometricValues(energy); return <tr key={label}><td>{label}</td><td>{v.rMinus.toFixed(4)}</td><td>{v.rPlus.toFixed(4)}</td><td>{v.D.toFixed(4)}</td><td>{v.steepRatio.toFixed(4)}</td><td>{v.rangeRatio.toFixed(4)}</td></tr>; })}<tr className="limit-row"><td>1/6&#x207B; (limit)</td><td>1.0000</td><td>0.5000</td><td>2.0000</td><td>0.2500</td><td>2.2500</td></tr></tbody></table></div><p className="small-note">The last row is a one-sided limit. <MathText>E=1/6</MathText> is outside Lemma 1 and Theorem 1. The peak-to-peak ratio in the final column is not the normalization used in this essay.</p></div>
      </details>
    </section>
  );
}

export function NormalizationSection({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref, !reduced, 'ending');
  const energy = mix(0.01, 0.1665, smoothstep(0.05, 0.9, progress));
  const adaptive = 0.5 * geometricValues(energy).D;
  return (
    <section ref={ref} id="normalization" className="normalization-section page-gutter" style={{ '--normalization-progress': progress } as CSSProperties}>
      <div className="section-topline"><span className="mono">03 / FIX THE FRACTION</span><span className="mono">NOT THE THRESHOLD</span></div>
      <div className="normalization-layout"><div><h2>Same fraction.<br /><em>Every energy.</em></h2><p className="section-lead">The correction is to follow the changing geometric scale.</p><Equation number="7" className="normalization-equation">{String.raw`\alpha(E)=\beta D(E)`}</Equation><p>Here <MathText>{String.raw`\beta\in(0,1]`}</MathText> is the chosen fraction of <MathText>{String.raw`|V_3|_{\max}`}</MathText>. The criterion then selects exactly those states whose absolute cubic excursion reaches that fraction, at every energy.</p><p className="small-note">If <MathText>{String.raw`\beta>1/2`}</MathText>, adaptive <MathText>{String.raw`\alpha(E)`}</MathText> may exceed 1 near escape. This is consistent: <MathText>|V_3|/E</MathText> can exceed 1 for <MathText>E&gt;9/64</MathText>. For <MathText>{String.raw`\beta\le1/2`}</MathText>, it never exceeds 1.</p></div><figure className="normalization-figure">{!reduced && <div className="figure-trace-line"><span>SCROLL-DRIVEN TRACE</span><span>E = {energy.toFixed(4)} / &#x03B1;(E) = {adaptive.toFixed(4)}</span></div>}<ScaleChart comparison energy={reduced ? undefined : energy} /><figcaption><strong>Figure 1b.</strong> Fixed <MathText>{String.raw`\alpha=1`}</MathText> versus adaptive <MathText>{String.raw`\alpha(E)=0.5D(E)`}</MathText>. The adaptive test stays at half the maximum absolute excursion, not half the area.</figcaption></figure></div>
      <div className="editorial-grid attainability-explainer"><div className="section-rail"><span className="mono">WHEN CAN IT FIRE?</span></div><div className="editorial-content"><h3>A fixed criterion has an onset energy.</h3><p>Geometric attainability requires <MathText>{String.raw`\beta_{\rm eff}=\alpha/D(E)\le1`}</MathText>. Solving <MathText>{String.raw`D(E)=\alpha`}</MathText> gives</p><Equation number="7a">{String.raw`r_\alpha=\frac{3\alpha}{2(1+\alpha)},\qquad E_\alpha=\frac{r_\alpha^2(3-2r_\alpha)}6.`}</Equation><div className="onset-examples"><span><MathText>{String.raw`\alpha=\tfrac14`}</MathText><Arrow /><MathText>{String.raw`E_\alpha=0.036`}</MathText></span><span><MathText>{String.raw`\alpha=\tfrac12`}</MathText><Arrow /><MathText>{String.raw`E_\alpha=\tfrac1{12}`}</MathText></span><span><MathText>{String.raw`\alpha=1`}</MathText><Arrow /><MathText>{String.raw`E_\alpha=\tfrac9{64}`}</MathText></span></div><p>Below the onset, no state in the well can meet the criterion. But a small threshold can be crossed by libration alone: at <MathText>E=0.05</MathText>, the maximum absolute cubic term is about <MathText>0.0160</MathText>, already 3.2 times the 10% threshold <MathText>0.005</MathText>. That first passage measures libration, not drift.</p>
      <details className="technical-details"><summary>The small-energy asymptotic is local.<span aria-hidden="true">+</span></summary><div className="details-body"><Equation number="4a">{String.raw`D(E)=\frac{2\sqrt2}{3}\sqrt E\,[1+\sqrt{2E}+O(E)].`}</Equation><p>The cubic excursion scales as <MathText>{String.raw`E^{3/2}`}</MathText>, before division by <MathText>E</MathText>. The leading term alone is within 5% only for <MathText>{String.raw`E\lesssim10^{-3}`}</MathText>. At <MathText>E=0.01</MathText> it is about 15% low; at <MathText>E=0.05</MathText> it gives <MathText>0.2108</MathText> versus <MathText>0.3196</MathText>. It is not a near-escape approximation.</p></div></details>
      <aside className="discrepancy-note"><span className="mono">SOURCE DISCREPANCY / PRESERVED FOR REVIEW</span><p>Eq. (7a) gives <strong>0.002430</strong> at <MathText>{String.raw`\alpha=0.05`}</MathText> and <strong>0.008452</strong> at <MathText>{String.raw`\alpha=0.10`}</MathText>, consistent with the prose. The supplied appendix log instead prints <strong>0.006024</strong> and <strong>0.010300</strong>, with inconsistent radii too. The lab evaluates the equation; the original draft and log are unchanged.</p></aside>
      </div></div>
    </section>
  );
}

export function ContextSections({ reduced }: { reduced: boolean }) {
  const protocolRef = useRef<HTMLElement>(null);
  const protocolProgress = useScrollProgress(protocolRef, !reduced, 'ending');
  const contexts = [
    { number: 5, title: 'The bounded energy surface is a 3-sphere.', subtitle: 'Morse theory, momentum fibres, and what a separating torus does not imply.' },
    { number: 6, title: 'A classical quartic normal form, recomputed.', subtitle: 'Exact symbolic coefficients, dynamical checks, and asymptotic error bookkeeping.' },
    { number: 7, title: 'A single lag cannot establish diffusion.', subtitle: 'The estimator bound for a bounded observable, regardless of the dynamics.' },
  ];
  return (
    <section id="context" className="context-section page-gutter">
      <div className="section-topline"><span className="mono">05 / CONTEXT, NOT NEW CLAIMS</span><span className="mono">PAPER SECTIONS 5&ndash;7</span></div>
      <div className="context-heading"><h2>Three useful results.<br />Three careful boundaries.</h2><p>These classical results are recomputed for context. They do not turn a geometric diagnostic into a transport measurement.</p></div>
      <div className="context-accordions">{contexts.map((context) => <details key={context.number} className="context-detail"><summary><span className="context-number mono">0{context.number}</span><div><h3>{context.title}</h3><p>{context.subtitle}</p></div><span className="context-plus" aria-hidden="true">+</span></summary><div className="context-body"><span className="context-status mono">STANDARD / RECOMPUTED CONTEXT</span><PaperText text={sectionText(context.number)} /></div></details>)}</div>
      <div className="protocol-layout"><div className="protocol-copy"><p className="eyebrow">AN ILLUSTRATIVE PROTOCOL / NOT EXECUTED</p><h2>A passage is an event.<br />Transport is a claim.</h2><p>A regional first-passage experiment can still be defined. But the regions must be stated before measuring, and non-crossing trajectories must not disappear from the statistics.</p><ol className="protocol-steps"><li><span>01</span><div><h3>Partition the section.</h3><p>On <MathText>{String.raw`x^2+p_x^2\le2E`}</MathText>, define an inner region <MathText>{String.raw`\mathcal R_1=\{x^2+p_x^2<\gamma E\}`}</MathText> and outer annulus <MathText>{String.raw`\mathcal R_2`}</MathText>, for fixed <MathText>{String.raw`\gamma\in(0,2)`}</MathText>. The dividing circle is not claimed to be a partial barrier.</p></div></li><li><span>02</span><div><h3>Record censored passages.</h3><p>For a stated ensemble, measure the first return-map passage between regions up to <MathText>{String.raw`T_{\max}`}</MathText>. Trajectories that have not crossed are right-censored, not discarded.</p></div></li><li><span>03</span><div><h3>Use censoring-aware summaries.</h3><p>Report a Kaplan&ndash;Meier survival curve, a restricted mean over <MathText>{String.raw`[0,T_{\max}]`}</MathText>, or a median only if survival reaches 1/2. Do not report an unrestricted mean. <a className="citation" href="#reference-13">[13]</a></p></div></li></ol></div><figure ref={protocolRef} className="protocol-figure" style={{ '--protocol-progress': protocolProgress } as CSSProperties}><svg viewBox="0 0 400 400" role="img" aria-label="Illustrative Poincare section with inner region R1 and outer annulus R2. The dividing circle is a chosen regional boundary, not a demonstrated partial barrier."><circle cx="200" cy="200" r="144" fill="none" stroke="currentColor" strokeWidth="1" /><circle cx="200" cy="200" r="101.82" fill="rgba(119,83,196,.07)" stroke="#7954c5" strokeWidth="1.2" strokeDasharray="4 5" /><path d="M25 200h350M200 25v350" className="diagram-axis" /><text x="209" y="31" className="diagram-radius">p<tspan baselineShift="sub" fontSize="11">x</tspan></text><text x="373" y="205" className="diagram-radius">x</text><text x="181" y="190" className="protocol-region">R<tspan baselineShift="sub" fontSize="15">1</tspan></text><text x="311" y="184" className="protocol-region">R<tspan baselineShift="sub" fontSize="15">2</tspan></text><path d="M271 126l40-44h49" fill="none" stroke="#7954c5" strokeWidth="1" /><text x="314" y="68" className="diagram-tick">CHOSEN BOUNDARY</text></svg><figcaption>Illustration with <MathText>{String.raw`\gamma=1`}</MathText>. A regional dividing circle is not automatically a cantorus barrier. A transport interpretation needs independent justification. <a className="citation" href="#reference-9">[9,10]</a></figcaption></figure></div>
      <p className="protocol-caveat">This is a proposal, not an executed experiment. <strong>No relationship between chaos and transport is claimed.</strong></p>
    </section>
  );
}

const references = [
  <>M. H&eacute;non and C. Heiles. <i>Astron. J.</i> <b>69</b>, 73 (1964).</>,
  <>G. Contopoulos. <i>Astron. J.</i> <b>75</b>, 96 (1970).</>,
  <>A. J. Lichtenberg and M. A. Lieberman. <i>Regular and Chaotic Dynamics</i>, 2nd ed. Springer (1992).</>,
  <>J. Milnor. <i>Morse Theory.</i> Princeton University Press (1963).</>,
  <>A. Hatcher. <i>Algebraic Topology.</i> Cambridge University Press (2002).</>,
  <>A. Deprit. <i>Celest. Mech.</i> <b>1</b>, 12 (1969).</>,
  <>G. Hori. <i>Publ. Astron. Soc. Jpn.</i> <b>18</b>, 287 (1966).</>,
  <>A. H. Nayfeh. <i>Perturbation Methods.</i> Wiley (1973).</>,
  <>R. S. MacKay, J. D. Meiss, and I. C. Percival. <i>Physica D</i> <b>13</b>, 55 (1984).</>,
  <>J. D. Meiss. <i>Rev. Mod. Phys.</i> <b>64</b>, 795 (1992).</>,
  <>F. G. Gustavson. <i>Astron. J.</i> <b>71</b>, 670 (1966).</>,
  <>M. H&eacute;non. <i>Physica D</i> <b>5</b>, 412 (1982).</>,
  <>E. L. Kaplan and P. Meier. <i>J. Am. Stat. Assoc.</i> <b>53</b>, 457 (1958).</>,
];

export function References({ openPaper }: { openPaper: () => void }) {
  return <section id="references" className="references-section page-gutter"><div className="section-topline"><span className="mono">REFERENCES &amp; REPRODUCIBILITY</span><button className="text-link" type="button" onClick={openPaper}>Complete paper + Appendix A <Arrow direction="up-right" /></button></div><ol className="reference-list">{references.map((reference, index) => <li key={index} id={`reference-${index + 1}`}><span className="mono">[{index + 1}]</span><p>{reference}</p></li>)}</ol><div className="source-links"><a href="/research-paper.md" download>Source draft (.md) <Arrow direction="down" /></a><a href="/downloads/appendix_a.py" download>Verification script (.py) <Arrow direction="down" /></a><a href="/downloads/figure1.svg" download>Recomputed Figure 1 (.svg) <Arrow direction="down" /></a><a href="/downloads/original-output.txt" download>Original log (.txt) <Arrow direction="down" /></a></div></section>;
}