import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { useReducedMotion } from './hooks/useScrollProgress';
import { Arrow, WellMark } from './components/Icons';
import { Hero, ArgumentScene, EndScene } from './components/ScrollScenes';
import { Introduction, GeometryArticle, GrowthSection, NormalizationSection, ContextSections, References } from './components/Article';
import { ResearchLab } from './components/ResearchLab';
import { BoundJourney, ThresholdJourney } from './components/MotionJourneys';
import { ScrollAtmosphere } from './components/ScrollAtmosphere';
import { EquationRelay } from './components/EquationRelay';
import { Colophon } from './components/Colophon';
import PaperReader from './components/PaperReader';

const blockEvent = (event: SyntheticEvent) => event.preventDefault();

// A UI-level no-copy layer: it blocks selection, clipboard shortcuts, native
// copy/cut/paste, drag-copy and context-menu copy. It is not DRM: browser
// developer tools and the deliberately preserved source downloads remain.
function useNoCopy() {
  useEffect(() => {
    const blockNative = (event: Event) => event.preventDefault();
    const clearSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length) selection.removeAllRanges();
    };
    const blockShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const command = event.ctrlKey || event.metaKey;
      if (command && ['c', 'x', 'v', 'a'].includes(key)) event.preventDefault();
      if (event.shiftKey && event.key === 'Insert') event.preventDefault();
      if (event.ctrlKey && event.key === 'Insert') event.preventDefault();
    };
    const events = ['copy', 'cut', 'paste', 'contextmenu', 'dragstart', 'selectstart'] as const;
    events.forEach((type) => document.addEventListener(type, blockNative, true));
    document.addEventListener('selectionchange', clearSelection);
    window.addEventListener('keydown', blockShortcuts, true);
    return () => {
      events.forEach((type) => document.removeEventListener(type, blockNative, true));
      document.removeEventListener('selectionchange', clearSelection);
      window.removeEventListener('keydown', blockShortcuts, true);
    };
  }, []);
}

export default function App() {
  useNoCopy();
  const systemReduced = useReducedMotion();
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const reduced = motionOverride === null ? systemReduced : !motionOverride;
  const [paperOpen, setPaperOpen] = useState(() => window.location.hash === '#paper');
  const [menuOpen, setMenuOpen] = useState(false);
  const paperOpener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => setPaperOpen(window.location.hash === '#paper');
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const openPaper = () => {
    paperOpener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPaperOpen(true);
    history.pushState(null, '', '#paper');
    setMenuOpen(false);
  };
  const closePaper = () => {
    setPaperOpen(false);
    if (window.location.hash === '#paper') history.replaceState(null, '', window.location.pathname + window.location.search);
    requestAnimationFrame(() => paperOpener.current?.focus({ preventScroll: true }));
  };

  return (
    <div
      className={`site-shell ${reduced ? 'motion-reduced' : 'motion-enabled'}`}
      data-no-copy="ui"
      onCopyCapture={blockEvent}
      onCutCapture={blockEvent}
      onPasteCapture={blockEvent}
      onContextMenuCapture={blockEvent}
      onDragStartCapture={blockEvent}
    >
      <a href="#main" className="skip-link">Skip to the research</a>
      <header className="site-header page-gutter">
        <a className="site-brand" href="#top" aria-label="Henon-Heiles visual research paper, back to top"><WellMark /><span>H&Eacute;NON<span className="brand-slash">/</span>HEILES<span className="brand-subtitle">A STUDY IN GEOMETRY</span></span></a>
        <nav id="mobile-menu" aria-label="Main navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#argument" onClick={() => setMenuOpen(false)}>The argument</a>
          <a href="#lab" onClick={() => setMenuOpen(false)}>Research lab<span className="nav-lab-dot" /></a>
          <a href="#references" onClick={() => setMenuOpen(false)}>References</a>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className={`motion-control ${reduced ? 'is-paused' : ''}`}
            onClick={() => setMotionOverride(reduced)}
            aria-pressed={!reduced}
            title={reduced ? 'Scroll animation is paused. Press to resume the scroll-driven motion.' : 'Pause the scroll-driven animation. It also pauses automatically if your system requests reduced motion.'}
          >
            {reduced ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 7 5-7 5Z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.6" /></svg>}
            <span className="motion-control-label">MOTION {reduced ? 'OFF' : 'ON'}</span>
          </button>
          <button type="button" className="header-paper-link" onClick={openPaper}>Full paper <Arrow direction="up-right" /></button>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        </div>
      </header>
      {reduced && (
        <p className="motion-paused-notice" role="status">
          <span className="motion-paused-dot" aria-hidden="true" />
          MOTION PAUSED &middot; STATIC READING
        </p>
      )}
      <ScrollAtmosphere reduced={reduced} />
      <main id="main">
        <div id="top" />
        <Hero reduced={reduced} />
        <Introduction reduced={reduced} />
        <EquationRelay reduced={reduced} />
        <ArgumentScene reduced={reduced} />
        <GeometryArticle />
        <BoundJourney reduced={reduced} />
        <GrowthSection reduced={reduced} />
        <ThresholdJourney reduced={reduced} />
        <NormalizationSection reduced={reduced} />
        <ResearchLab />
        <ContextSections reduced={reduced} />
        <EndScene reduced={reduced} openPaper={openPaper} />
        <References openPaper={openPaper} />
        <Colophon reduced={reduced} />
      </main>
      <footer className="site-footer page-gutter"><a href="#top" className="footer-brand"><WellMark /><span>INSTABILITY IS NOT TRANSPORT.</span></a><p>An interactive companion by Jasper Liu.</p><a href="#top" className="back-to-top">Back to top <Arrow direction="up-right" /></a></footer>
      {paperOpen && <PaperReader onClose={closePaper} />}
    </div>
  );
}
