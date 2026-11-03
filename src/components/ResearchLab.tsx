import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { clamp, thresholdValues, UNIT_THRESHOLD_ONSET } from '../lib/geometry';
import { Equation, MathText } from './Formula';
import { WellDiagram } from './Charts';
import { Arrow } from './Icons';

function Slider({ name, symbol, value, min, max, step, digits, onChange }: { name: string; symbol: string; value: number; min: number; max: number; step: number; digits: number; onChange: (value: number) => void }) {
  const id = useId();
  const [draft, setDraft] = useState(String(Number(value.toFixed(digits))));
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!editing) setDraft(String(Number(value.toFixed(digits))));
  }, [value, digits, editing]);
  const finishEditing = () => {
    const parsed = Number(draft);
    const next = draft.trim() && Number.isFinite(parsed) ? clamp(parsed, min, max) : value;
    onChange(next);
    setDraft(String(Number(next.toFixed(digits))));
    setEditing(false);
  };
  return (
    <div className="lab-control">
      <div className="control-label-row"><label htmlFor={`${id}-range`}>{name} <MathText>{symbol}</MathText></label><input className="control-number" type="number" aria-label={`${name} numeric value`} min={min} max={max} step={step} value={draft} onFocus={() => setEditing(true)} onBlur={finishEditing} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }} onChange={(event) => { setDraft(event.target.value); const next = event.target.valueAsNumber; if (Number.isFinite(next) && next >= min && next <= max) onChange(next); }} /></div>
      <input id={`${id}-range`} className="range-input" type="range" min={min} max={max} step={step} value={value} aria-valuetext={`${name} ${value.toFixed(digits)}`} onChange={(event) => onChange(Number(event.target.value))} style={{ '--range-fill': `${(value - min) / (max - min) * 100}%` } as CSSProperties} />
      <div className="control-range-labels"><span>{min}</span><span>{name === 'Energy' ? '1/6 (excluded)' : max}</span></div>
    </div>
  );
}

export function ResearchLab() {
  const [energy, setEnergy] = useState(0.1);
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(0.5);
  const [compare, setCompare] = useState(false);
  const values = useMemo(() => thresholdValues(energy, alpha, beta), [energy, alpha, beta]);
  const fixedPercent = values.betaEffective * 100;
  const gaugeMax = Math.max(1.25, values.betaEffective * 1.12);
  const presets = [
    { label: '0.05', value: 0.05 },
    { label: '1/12', value: 1 / 12 },
    { label: '9/64', value: UNIT_THRESHOLD_ONSET },
    { label: 'Near escape', value: 0.165 },
  ];

  return (
    <section id="lab" className="lab-section page-gutter" aria-labelledby="lab-title">
      <div className="section-topline"><span className="mono">04 / THE RESEARCH LAB</span><span className="mono">EXACT GEOMETRY. LIVE CALCULATION.</span></div>
      <div className="lab-intro"><h2 id="lab-title">Put the threshold<br /><em>in perspective.</em></h2><p>Change the energy. Move the threshold.<br />See what the criterion can actually reach.</p></div>
      <div className="lab-workspace">
        <div className="lab-toolbar">
          <div className="lab-tabs" role="tablist" aria-label="Threshold comparison mode">
            <button id="fixed-tab" type="button" role="tab" aria-controls="lab-panel" aria-selected={!compare} tabIndex={!compare ? 0 : -1} onClick={() => setCompare(false)} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { setCompare(true); document.getElementById('compare-tab')?.focus(); } }}>Fixed threshold</button>
            <button id="compare-tab" type="button" role="tab" aria-controls="lab-panel" aria-selected={compare} tabIndex={compare ? 0 : -1} onClick={() => setCompare(true)} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { setCompare(false); document.getElementById('fixed-tab')?.focus(); } }}>Compare normalization <Arrow direction="up-right" /></button>
          </div>
          <button type="button" className="reset-control" onClick={() => { setEnergy(0.1); setAlpha(1); setBeta(0.5); setCompare(false); }}>Reset <span aria-hidden="true">&#x21BB;</span></button>
        </div>
        <div className="lab-main" id="lab-panel" role="tabpanel" aria-labelledby={compare ? 'compare-tab' : 'fixed-tab'}>
          <div className="lab-controls">
            <p className="mono lab-control-heading">CHOOSE THE TEST</p>
            <Slider name="Energy" symbol="E" value={energy} min={0.001} max={0.1665} step={0.000001} digits={6} onChange={setEnergy} />
            <div className="energy-presets" aria-label="Exact energy presets"><span>TRY E =</span>{presets.map((preset) => <button type="button" key={preset.label} aria-pressed={Math.abs(energy - preset.value) < 1e-9} onClick={() => setEnergy(preset.value)}>{preset.label}</button>)}</div>
            <Slider name="Fixed threshold" symbol={String.raw`\alpha`} value={alpha} min={0.05} max={1} step={0.01} digits={2} onChange={setAlpha} />
            {compare && <Slider name="Normalized fraction" symbol={String.raw`\beta`} value={beta} min={0.05} max={1} step={0.01} digits={2} onChange={setBeta} />}
            <div className="lab-criterion"><span className="mono">FIXED CRITERION</span><Equation>{String.raw`|V_3|\ge ${alpha.toFixed(2)}\,E`}</Equation>{compare && <><span className="mono">ADAPTIVE CRITERION</span><Equation>{String.raw`\alpha(E)=${beta.toFixed(2)}\,D(E)=${values.adaptiveAlpha.toFixed(4)}`}</Equation></>}</div>
          </div>
          <figure className="lab-figure">
            <div className="figure-topline"><span>THE ADMISSIBLE WELL</span><span>0 &lt; E &lt; 1/6</span></div>
            <WellDiagram energy={energy} alpha={alpha} beta={beta} compare={compare} />
            <figcaption className="lab-diagram-caption"><span><i className="legend-line violet" />Well boundary</span><span><i className="legend-line hatched" />Fixed criterion met</span>{compare && <span><i className="legend-line violet-fill" />Normalized criterion met</span>}</figcaption>
          </figure>
          <div className="lab-results">
            <p className="mono lab-control-heading">COMPUTED FROM THE EQUATIONS</p>
            <dl className="result-table">
              <div><dt>Saddle radius <MathText>r_-</MathText></dt><dd data-testid="r-minus">{values.rMinus.toFixed(4)}</dd></div>
              <div><dt>Steep radius <MathText>r_+</MathText></dt><dd data-testid="r-plus">{values.rPlus.toFixed(4)}</dd></div>
              <div className="result-emphasis"><dt>Geometric bound <MathText>D(E)</MathText></dt><dd data-testid="d-value">{values.D.toFixed(4)}</dd></div>
              <div><dt>Absolute maximum <MathText>{String.raw`|V_3|_{\max}`}</MathText></dt><dd data-testid="max-value">{values.maxAbs.toFixed(6)}</dd></div>
              <div><dt>Positive steep value <MathText>V_3/E</MathText></dt><dd data-testid="steep-value">{values.steepRatio.toFixed(4)}</dd></div>
              <div><dt>Effective fraction <MathText>{String.raw`\beta_{\rm eff}`}</MathText></dt><dd data-testid="beta-effective">{values.betaEffective.toFixed(4)}</dd></div>
              <div><dt>Fixed onset energy <MathText>{String.raw`E_\alpha`}</MathText></dt><dd data-testid="onset-energy">{values.onsetEnergy.toFixed(6)}</dd></div>
              {compare && <div className="result-emphasis"><dt>Adaptive <MathText>{String.raw`\alpha(E)`}</MathText></dt><dd data-testid="adaptive-alpha">{values.adaptiveAlpha.toFixed(4)}</dd></div>}
            </dl>
            <div className="fraction-gauge">
              <span className="mono">FRACTION OF THE ABSOLUTE MAXIMUM</span>
              <div className="fraction-gauge-track"><span className="fraction-available" style={{ width: `${100 / gaugeMax}%` }} /><span className="fraction-fixed-marker" style={{ left: `${values.betaEffective / gaugeMax * 100}%` }} />{compare && <span className="fraction-adaptive-marker" style={{ left: `${beta / gaugeMax * 100}%` }} />}</div>
              <div className="fraction-gauge-labels"><span>0</span><span style={{ left: `${100 / gaugeMax}%` }}>100%</span><span>{fixedPercent.toFixed(1)}% fixed</span></div>
              {compare && <p className="adaptive-fraction">Normalized: {(beta * 100).toFixed(0)}% at every energy.</p>}
            </div>
          </div>
        </div>
        <div className={`attainability-result ${values.attainable ? 'is-attainable' : ''}`}>
          <div><span className="status-dot" /><h3 data-testid="attainability">Geometrically {values.attainable ? 'attainable' : 'unattainable'}</h3><span className="mono">FIXED &#x03B1; = {alpha.toFixed(2)}</span></div>
          <p>{values.attainable ? 'Some states in the bounded well meet this fixed criterion. That does not mean a chosen trajectory will reach those states.' : 'The fixed threshold lies above the global absolute maximum. No state in the bounded well can meet it at this energy.'}{Math.abs(values.betaEffective - 1) < 1e-9 && ' At this onset, the fixed criterion is met only at three extremal configuration points.'}{compare && ` The normalized criterion is geometrically attainable and stays at ${(beta * 100).toFixed(0)}% of the available maximum.`}{compare && beta === 1 && ' At beta = 1, this set is three extremal configuration points, marked with circles rather than shaded area.'}</p>
        </div>
        <output className="sr-only" aria-live="polite">At energy {energy.toFixed(6)}, D is {values.D.toFixed(4)}, effective fraction is {values.betaEffective.toFixed(4)}, and the fixed threshold is geometrically {values.attainable ? 'attainable' : 'unattainable'}.{compare ? ` Adaptive alpha is ${values.adaptiveAlpha.toFixed(4)} at normalized fraction ${beta.toFixed(2)}.` : ''}</output>
      </div>
      <p className="lab-caveat"><span className="caveat-symbol" aria-hidden="true">!</span><span><strong>Geometry is not dynamics.</strong> Attainable means that such states exist somewhere in the bounded well. It is not evidence of transport, nor a prediction of crossing probability or time. The shading is not a fraction of configuration-space area.</span></p>
    </section>
  );
}