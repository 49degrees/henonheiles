import { useEffect, useState, type RefObject } from 'react';
import { clamp } from '../lib/geometry';

const scrollReaders = new Set<() => void>();
let scrollFrame = 0;

function scheduleScrollRead() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    scrollReaders.forEach((read) => read());
  });
}

function subscribeToScroll(read: () => void) {
  if (scrollReaders.size === 0) {
    window.addEventListener('scroll', scheduleScrollRead, { passive: true });
    window.addEventListener('resize', scheduleScrollRead);
  }
  scrollReaders.add(read);
  return () => {
    scrollReaders.delete(read);
    if (scrollReaders.size === 0) {
      window.removeEventListener('scroll', scheduleScrollRead);
      window.removeEventListener('resize', scheduleScrollRead);
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    }
  };
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true,
  kind: 'hero' | 'argument' | 'ending' = 'argument',
) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      return;
    }
    let last = -1;
    let nearViewport = true;
    const commit = (next: number) => {
      if (Math.abs(last - next) <= 0.0002) return;
      last = next;
      setProgress(next);
    };
    const read = () => {
      const node = ref.current;
      if (!node || !nearViewport) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      let next: number;
      if (kind === 'hero') next = clamp(-rect.top / (rect.height * 0.9));
      else if (kind === 'ending') next = clamp((viewport - rect.top) / (viewport + rect.height));
      else next = clamp((viewport * 0.2 - rect.top) / Math.max(1, rect.height - viewport * 0.7));
      commit(next);
    };
    const unsubscribe = subscribeToScroll(read);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      if (nearViewport) scheduleScrollRead();
      else commit(entry.boundingClientRect.top > window.innerHeight ? 0 : 1);
    }, { rootMargin: '100% 0px' });
    if (ref.current) observer?.observe(ref.current);
    read();
    return () => {
      observer?.disconnect();
      unsubscribe();
    };
  }, [enabled, kind, ref]);
  return progress;
}