import { useEffect, useRef, useState } from 'react';
import { clamp, ESCAPE_ENERGY, geometricValues, smoothstep } from '../lib/geometry';

const SAMPLES = 80;
const MIN_ENERGY = 0.001;
const MAX_ENERGY = ESCAPE_ENERGY - 1e-6;

const chapters = [
  { at: 0, label: '01 / EXACT IDENTITY' },
  { at: 0.18, label: '02 / BOUNDED WELL' },
  { at: 0.38, label: '03 / GLOBAL MAXIMUM' },
  { at: 0.54, label: '04 / D(E) GROWS' },
  { at: 0.7, label: '05 / NORMALIZED \u03B2' },
  { at: 0.86, label: '06 / NO TRANSPORT CLAIM' },
];

// The thread combines the threefold potential with the exact D(E) scale.
// It straightens near the end because the paper's conclusion is a limit, not a trajectory.
function threadPath(progress: number, horizontal: boolean) {
  const points: string[] = [];
  const straighten = smoothstep(0.72, 0.99, progress);
  for (let index = 0; index <= SAMPLES; index++) {
    const t = index / SAMPLES;
    const energy = MIN_ENERGY + t * (MAX_ENERGY - MIN_ENERGY);
    const { D, rMinus } = geometricValues(energy);
    const amplitude = (4 + D * 7 + rMinus * 4) * (1 - straighten * 0.78);
    const threefold = Math.sin(t * Math.PI * 6 + progress * Math.PI * 2) * amplitude;
    const drift = (D - 1) * 12 * (1 - straighten);
    const offset = threefold + drift;
    const x = horizontal ? t * 1000 : 40 + offset;
    const y = horizontal ? 22 + offset * 0.45 : t * 1000;
    points.push(`${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

export function ScrollAtmosphere({ reduced }: { reduced: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const verticalGhost = useRef<SVGPathElement>(null);
  const verticalInk = useRef<SVGPathElement>(null);
  const verticalMarker = useRef<SVGGElement>(null);
  const horizontalGhost = useRef<SVGPathElement>(null);
  const horizontalInk = useRef<SVGPathElement>(null);
  const horizontalMarker = useRef<SVGGElement>(null);
  const [chapter, setChapter] = useState(chapters[0].label);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let lastChapter = chapters[0].label;
    let lastProgress = -1;

    const paintThread = (
      ghost: SVGPathElement | null,
      ink: SVGPathElement | null,
      marker: SVGGElement | null,
      d: string,
      progress: number,
    ) => {
      if (!ghost || !ink || !marker) return;
      ghost.setAttribute('d', d);
      ink.setAttribute('d', d);
      const length = ink.getTotalLength();
      ink.style.strokeDasharray = `${length}`;
      ink.style.strokeDashoffset = `${length * (1 - progress)}`;
      const point = ink.getPointAtLength(length * progress);
      marker.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
    };

    const read = () => {
      frame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp((window.scrollY || document.documentElement.scrollTop || 0) / scrollable);
      paintThread(verticalGhost.current, verticalInk.current, verticalMarker.current, threadPath(progress, false), progress);
      paintThread(horizontalGhost.current, horizontalInk.current, horizontalMarker.current, threadPath(progress, true), progress);

      let label = chapters[0].label;
      for (const item of chapters) if (progress >= item.at) label = item.label;
      if (label !== lastChapter) {
        lastChapter = label;
        setChapter(label);
      }
      if (Math.abs(progress - lastProgress) > 0.0001) {
        wrapper.current?.setAttribute('data-scroll-progress', progress.toFixed(4));
        lastProgress = progress;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduced]);

  return (
    <div className="essay-thread" ref={wrapper} data-testid="essay-thread" data-scroll-progress="0" aria-hidden="true">
      <svg className="thread-vertical" viewBox="0 0 80 1000" preserveAspectRatio="none">
        <path ref={verticalGhost} className="thread-ghost" d="" data-testid="thread-path" />
        <path ref={verticalInk} className="thread-ink" d="" data-testid="thread-ink" />
        <g ref={verticalMarker} className="thread-marker" transform="translate(40 0)">
          <circle r="6" className="thread-marker-ring" />
          <circle r="2.2" className="thread-marker-core" />
        </g>
      </svg>
      <svg className="thread-horizontal" viewBox="0 0 1000 44" preserveAspectRatio="none">
        <path ref={horizontalGhost} className="thread-ghost" d="" />
        <path ref={horizontalInk} className="thread-ink" d="" />
        <g ref={horizontalMarker} className="thread-marker" transform="translate(0 22)">
          <circle r="6" className="thread-marker-ring" />
          <circle r="2.2" className="thread-marker-core" />
        </g>
      </svg>
      <span className="thread-chapter">{chapter}</span>
      <span className="thread-caption">SCROLL AS A GEOMETRIC OPERATOR</span>
    </div>
  );
}
