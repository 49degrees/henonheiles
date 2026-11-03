import { useEffect, useRef } from 'react';
import { boundaryPoints, boundaryRadius, potential, smoothstep, mix } from '../lib/geometry';

type Point3 = { x: number; y: number; z: number };

const mesh: Point3[][] = [];
for (let axis = 0; axis < 2; axis++) {
  for (let j = -26; j <= 26; j++) {
    const line: Point3[] = [];
    for (let i = 0; i <= 100; i++) {
      const a = j / 25;
      const b = -1.15 + (i / 100) * 2.3;
      const x = axis === 0 ? a : b;
      const y = axis === 0 ? b : a;
      const z = potential(x, y);
      if (x * x + y * y <= 1.32 ** 2 && z < 0.66) line.push({ x, y, z });
      else if (line.length > 1) {
        mesh.push([...line]);
        line.length = 0;
      }
    }
    if (line.length > 1) mesh.push(line);
  }
}

const contours = Array.from({ length: 15 }, (_, i) => {
  const energy = 0.008 + (i / 14) * 0.1585;
  return boundaryPoints(energy, 200).map(({ x, y }) => ({ x, y, z: energy }));
});

export function WellCanvas({
  energy = 0.125,
  progress = 0,
  variant = 'hero',
}: {
  energy?: number;
  progress?: number;
  variant?: 'hero' | 'argument' | 'ending';
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useRef({ width: 800, height: 680 });
  const props = useRef({ energy, progress, variant });
  const paint = useRef<() => void>(() => {});
  props.current = { energy, progress, variant };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    paint.current = () => {
      const { width, height } = size.current;
      const { energy: E, progress: p, variant: mode } = props.current;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const flatten = mode === 'argument' ? smoothstep(0.02, 0.55, p) : mode === 'ending' ? 0.8 : smoothstep(0.12, 1, p) * 0.62;
      const angle = mode === 'hero' ? -0.32 + p * 0.72 : mix(-0.2, 0, flatten);
      const scale = Math.min(width / 2.8, height / 2.2) * (mode === 'hero' ? 1.05 + p * 0.1 : 0.9);
      const centerX = width * (mode === 'hero' ? width < 700 ? 0.52 : 0.73 : 0.5);
      const centerY = height * (mode === 'hero' ? 0.68 : 0.55);
      const tilt = mix(0.52, 1, flatten);
      const zScale = mix(2.18, 0, flatten);
      const project = ({ x, y, z }: Point3) => {
        const u = x * Math.cos(angle) - y * Math.sin(angle);
        const v = x * Math.sin(angle) + y * Math.cos(angle);
        return [centerX + u * scale, centerY - (v * tilt + z * zScale) * scale];
      };
      const path = (points: Point3[]) => {
        context.beginPath();
        points.forEach((point, index) => {
          const [x, y] = project(point);
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
      };

      context.strokeStyle = `rgba(64, 62, 64, ${mix(0.27, 0.035, flatten)})`;
      context.lineWidth = 0.58;
      mesh.forEach((line) => {
        path(line);
        context.stroke();
      });

      context.lineWidth = 0.85;
      context.strokeStyle = `rgba(93, 77, 124, ${mix(0.12, 0.19, flatten)})`;
      contours.forEach((line) => {
        path(line);
        context.stroke();
      });

      const boundary = boundaryPoints(E, 260).map(({ x, y }) => ({ x, y, z: E }));
      path(boundary);
      context.fillStyle = `rgba(119, 83, 196, ${mix(0.09, 0.055, flatten)})`;
      context.fill();
      context.strokeStyle = '#7954c5';
      context.lineWidth = mode === 'hero' ? 2.3 : 2;
      context.stroke();

      // These rays terminate at the actual saddle coordinates, not at the well boundary.
      const rays = [Math.PI / 2, (7 * Math.PI) / 6, (11 * Math.PI) / 6];
      context.font = '11px "IBM Plex Mono", monospace';
      rays.forEach((phi, index) => {
        const x = Math.cos(phi);
        const y = Math.sin(phi);
        context.setLineDash([3, 6]);
        context.strokeStyle = `rgba(77, 68, 86, ${mode === 'hero' ? 0.32 : 0.5})`;
        context.lineWidth = 0.8;
        path([{ x: 0, y: 0, z: E }, { x, y, z: E }]);
        context.stroke();
        context.setLineDash([]);
        const [sx, sy] = project({ x, y, z: E });
        context.beginPath();
        context.arc(sx, sy, 3, 0, Math.PI * 2);
        context.fillStyle = '#f7f6f2';
        context.fill();
        context.strokeStyle = '#89828d';
        context.stroke();
        if (mode !== 'hero' || width > 550) {
          context.fillStyle = '#827a89';
          context.fillText(`S${index + 1}`, sx + 9, sy - 8);
        }
      });

      const phi = mode === 'hero' ? 2.55 + p * 3.8 : 0.9 + p * 8;
      const sampleRadius = boundaryRadius(E, phi) * 0.72;
      const sampleX = sampleRadius * Math.cos(phi);
      const sampleY = sampleRadius * Math.sin(phi);
      const sample = project({ x: sampleX, y: sampleY, z: potential(sampleX, sampleY) });
      const origin = project({ x: 0, y: 0, z: 0 });
      context.beginPath();
      context.arc(origin[0], origin[1], 2, 0, Math.PI * 2);
      context.fillStyle = '#6f6777';
      context.fill();
      context.beginPath();
      context.arc(sample[0], sample[1], 6, 0, Math.PI * 2);
      context.fillStyle = '#7954c5';
      context.fill();
      context.strokeStyle = '#f7f6f2';
      context.lineWidth = 3;
      context.stroke();

      context.fillStyle = '#746c7b';
      context.font = 'italic 14px Georgia, serif';
      const axisX = project({ x: 1.17, y: 0, z: 0 });
      const axisY = project({ x: 0, y: 1.17, z: 0 });
      context.fillText('x', axisX[0], axisX[1]);
      context.fillText('y', axisY[0], axisY[1]);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      paint.current();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => paint.current(), [energy, progress, variant]);

  return (
    <canvas ref={ref} className={`well-canvas well-canvas-${variant}`} role="img" aria-label={`H\u00e9non-Heiles potential surface and bounded configuration-space contour at energy ${energy.toFixed(4)}. Three dotted rays point to the saddles. The violet point is a scroll-position sample, not a simulated trajectory.`}>
      The potential is V = (x squared + y squared)/2 + x squared y - y cubed/3. Its bounded well has threefold symmetry and grows toward three saddles as energy approaches 1/6 from below.
    </canvas>
  );
}