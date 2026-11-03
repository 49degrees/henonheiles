import { expect, test } from '@playwright/test';
import assert from 'node:assert/strict';
import { boundaryRadius, cubicPotential, ESCAPE_ENERGY, geometricValues, potential, TABLE_ROWS, thresholdValues } from '../src/lib/geometry';

test('closed-form roots satisfy the cubic and exact checks', () => {
  for (const { energy } of TABLE_ROWS) {
    const { rMinus, rPlus, maxAbs, D } = geometricValues(energy);
    expect(Math.abs(2 * rMinus ** 3 - 3 * rMinus ** 2 + 6 * energy)).toBeLessThan(1e-12);
    expect(Math.abs(2 * rPlus ** 3 + 3 * rPlus ** 2 - 6 * energy)).toBeLessThan(1e-12);
    expect(D).toBeCloseTo(maxAbs / energy, 12);
  }
  const exact = geometricValues(1 / 12);
  expect(exact.rMinus).toBeCloseTo(0.5, 12);
  expect(exact.rPlus).toBeCloseTo((Math.sqrt(3) - 1) / 2, 12);
  expect(exact.D).toBeCloseTo(0.5, 12);
  expect(exact.steepRatio).toBeCloseTo(3 * Math.sqrt(3) - 5, 12);
  expect(geometricValues(9 / 64).D).toBeCloseTo(1, 12);
  expect(() => geometricValues(ESCAPE_ENERGY)).toThrow(RangeError);
});

test('global bound holds on the full bounded polar region', () => {
  for (const energy of [0.02, 0.05, 1 / 12, 0.1, 0.15, 0.165]) {
    const { maxAbs, maxPositive } = geometricValues(energy);
    let gridMax = 0;
    for (let i = 0; i < 360; i++) {
      const phi = i / 360 * 2 * Math.PI;
      const rb = boundaryRadius(energy, phi);
      assert(Math.abs(potential(rb * Math.cos(phi), rb * Math.sin(phi)) - energy) < 1e-9);
      for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
        const v = cubicPotential(rb * fraction * Math.cos(phi), rb * fraction * Math.sin(phi));
        assert(Math.abs(v) <= maxAbs + 1e-9);
        assert(v <= maxPositive + 1e-9);
        gridMax = Math.max(gridMax, Math.abs(v));
      }
    }
    expect(gridMax).toBeCloseTo(maxAbs, 8);
  }
});

test('monotonicity, escape limit, and fixed onset are exact', () => {
  let previous = 0;
  for (let i = 1; i < 1000; i++) {
    const { D } = geometricValues(i / 1000 * ESCAPE_ENERGY);
    assert(D > previous);
    previous = D;
  }
  expect(geometricValues(ESCAPE_ENERGY - 1e-12).D).toBeCloseTo(2, 4);
  for (const alpha of [0.05, 0.1, 0.25, 0.5, 0.75, 1]) {
    const { onsetEnergy } = thresholdValues(0.1, alpha);
    expect(geometricValues(onsetEnergy).D).toBeCloseTo(alpha, 12);
    expect(thresholdValues(onsetEnergy, alpha).attainable).toBe(true);
    expect(thresholdValues(onsetEnergy - 0.00001, alpha).attainable).toBe(false);
  }
  expect(thresholdValues(0.1, 0.05).onsetEnergy).toBeCloseTo(0.00242954324587, 12);
  expect(thresholdValues(0.1, 0.1).onsetEnergy).toBeCloseTo(0.00845229151014, 12);
});

test('normalization holds a fixed fraction at every energy', () => {
  for (const energy of [0.001, 0.05, 1 / 12, 0.1, 0.15, 0.1665]) {
    for (const beta of [0.05, 0.5, 0.75, 1]) {
      const value = thresholdValues(energy, 1, beta);
      expect(value.adaptiveThreshold / value.maxAbs).toBeCloseTo(beta, 12);
      expect(value.adaptiveAlpha * energy).toBeCloseTo(value.adaptiveThreshold, 12);
    }
  }
});