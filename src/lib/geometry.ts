export const ESCAPE_ENERGY = 1 / 6;
export const UNIT_THRESHOLD_ONSET = 9 / 64;
export const TAU = 2 * Math.PI;

export const clamp = (value: number, low = 0, high = 1) =>
  Math.min(high, Math.max(low, value));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function smoothstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function potential(x: number, y: number) {
  return (x * x + y * y) / 2 + cubicPotential(x, y);
}

export function cubicPotential(x: number, y: number) {
  return x * x * y - (y * y * y) / 3;
}

export function geometricValues(energy: number) {
  if (!(energy > 0 && energy < ESCAPE_ENERGY)) {
    throw new RangeError('The bounded-well theorem requires 0 < E < 1/6.');
  }
  const theta = Math.acos(clamp(1 - 12 * energy, -1, 1));
  const rMinus = 0.5 + Math.cos(theta / 3 - (2 * Math.PI) / 3);
  const rPlus = -0.5 - Math.cos(theta / 3 + (2 * Math.PI) / 3);
  const maxAbs = rMinus ** 3 / 3;
  const maxPositive = rPlus ** 3 / 3;
  const D = (2 * rMinus) / (3 - 2 * rMinus);
  return {
    theta,
    rMinus,
    rPlus,
    maxAbs,
    maxPositive,
    D,
    steepRatio: maxPositive / energy,
    rangeRatio: (maxAbs + maxPositive) / energy,
  };
}

export function thresholdValues(energy: number, alpha: number, beta = 0.5) {
  const geometry = geometricValues(energy);
  const betaEffective = alpha / geometry.D;
  const rAlpha = (3 * alpha) / (2 * (1 + alpha));
  const onsetEnergy = (rAlpha ** 2 * (3 - 2 * rAlpha)) / 6;
  return {
    ...geometry,
    betaEffective,
    rAlpha,
    onsetEnergy,
    attainable: betaEffective <= 1 + 1e-12,
    fixedThreshold: alpha * energy,
    adaptiveAlpha: beta * geometry.D,
    adaptiveThreshold: beta * geometry.maxAbs,
  };
}

// The unique inner root is bracketed by (0, 1), including on saddle rays.
export function boundaryRadius(energy: number, phi: number) {
  const s = Math.sin(3 * phi);
  let low = 0;
  let high = 1;
  for (let i = 0; i < 34; i++) {
    const r = (low + high) / 2;
    const value = (r * r) / 2 + (s * r * r * r) / 3;
    if (value < energy) low = r;
    else high = r;
  }
  return (low + high) / 2;
}

export function boundaryPoints(energy: number, samples = 240) {
  return Array.from({ length: samples + 1 }, (_, i) => {
    const phi = (i / samples) * TAU;
    const r = boundaryRadius(energy, phi);
    return { x: r * Math.cos(phi), y: r * Math.sin(phi), phi, r };
  });
}

export const TABLE_ROWS = [
  { label: '0.050', energy: 0.05 },
  { label: '1/12', energy: 1 / 12 },
  { label: '0.100', energy: 0.1 },
  { label: '1/8', energy: 1 / 8 },
  { label: '0.150', energy: 0.15 },
  { label: '0.165', energy: 0.165 },
];