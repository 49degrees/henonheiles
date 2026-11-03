import { expect, test, type Page } from '@playwright/test';
import { geometricValues, thresholdValues } from '../src/lib/geometry';

async function seekPinned(page: Page, selector: string, progress: number) {
  const position = await page.locator(selector).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top + scrollY, span: rect.height - innerHeight * 0.7, inset: innerHeight * 0.2 };
  });
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), position.top - position.inset + position.span * progress);
  await page.waitForTimeout(160);
}

async function seekThrough(page: Page, selector: string, progress: number) {
  const position = await page.locator(selector).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top + scrollY, span: rect.height + innerHeight, inset: innerHeight };
  });
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), position.top - position.inset + position.span * progress);
  await page.waitForTimeout(160);
}

test('the well continuously expands into the exact bound and reverses', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await seekPinned(page, '.bound-journey', 0.1);
  const firstEnergy = await page.getByTestId('journey-energy').textContent();
  const firstPath = await page.getByTestId('journey-well-boundary').getAttribute('d');
  const firstPoint = await page.getByTestId('journey-curve-point').getAttribute('cx');
  const firstD = Number(await page.getByTestId('journey-bound').textContent());
  expect(firstD).toBeCloseTo(geometricValues(Number(firstEnergy)).D, 3);
  await seekPinned(page, '.bound-journey', 0.85);
  const laterD = Number(await page.getByTestId('journey-bound').textContent());
  expect(laterD).toBeGreaterThan(firstD);
  expect(await page.getByTestId('journey-well-boundary').getAttribute('d')).not.toBe(firstPath);
  expect(await page.getByTestId('journey-curve-point').getAttribute('cx')).not.toBe(firstPoint);
  await seekPinned(page, '.bound-journey', 0.1);
  await expect(page.getByTestId('journey-energy')).toHaveText(firstEnergy!);
  await expect(page.getByTestId('journey-well-boundary')).toHaveAttribute('d', firstPath!);
  await expect(page.getByTestId('journey-curve-point')).toHaveAttribute('cx', firstPoint!);
});

test('fixed threshold moves as the available range changes, adaptive stays fixed', async ({ page }) => {
  await page.goto('/');
  await seekPinned(page, '.threshold-journey', 0.08);
  const initialEnergy = Number(await page.getByTestId('threshold-energy').textContent());
  const initialFraction = Number((await page.getByTestId('journey-fixed-fraction').textContent())!.replace('%', ''));
  const initialMarker = await page.getByTestId('fixed-scroll-marker').getAttribute('style');
  expect(Math.abs(initialFraction - thresholdValues(initialEnergy, 1).betaEffective * 100)).toBeLessThan(1);
  const track = await page.locator('.threshold-scale-track').boundingBox();
  const marker = await page.locator('.threshold-scale-fixed').boundingBox();
  expect((marker!.x - track!.x) / track!.width).toBeCloseTo(initialFraction / 350, 2);
  await expect(page.getByTestId('threshold-scroll-status')).toHaveText('Geometrically unattainable');
  const adaptivePosition = await page.locator('.threshold-scale-adaptive').getAttribute('style');
  await seekPinned(page, '.threshold-journey', 0.92);
  const laterFraction = Number((await page.getByTestId('journey-fixed-fraction').textContent())!.replace('%', ''));
  expect(laterFraction).toBeLessThan(initialFraction);
  await expect(page.getByTestId('threshold-scroll-status')).toHaveText('Geometrically attainable');
  expect(await page.getByTestId('fixed-scroll-marker').getAttribute('style')).not.toBe(initialMarker);
  await expect(page.locator('.threshold-scale-adaptive')).toHaveAttribute('style', adaptivePosition!);
  await seekPinned(page, '.threshold-journey', 0.08);
  await expect(page.getByTestId('fixed-scroll-marker')).toHaveAttribute('style', initialMarker!);
  await expect(page.getByTestId('journey-fixed-fraction')).toHaveText(`${initialFraction}%`);
});

test('opening, analytic charts, and section transitions respond to native scroll', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('.hero-art');
  const initialHero = await hero.evaluate((node) => getComputedStyle(node).transform);
  await page.evaluate(() => scrollTo({ top: 450, behavior: 'instant' }));
  await page.waitForTimeout(150);
  expect(await hero.evaluate((node) => getComputedStyle(node).transform)).not.toBe(initialHero);
  for (const section of ['.growth-section', '.normalization-section']) {
    await seekThrough(page, section, 0.25);
    const point = page.locator(`${section} .chart-current`);
    const firstX = await point.getAttribute('cx');
    await seekThrough(page, section, 0.7);
    expect(await point.getAttribute('cx')).not.toBe(firstX);
    await seekThrough(page, section, 0.25);
    await expect(point).toHaveAttribute('cx', firstX!);
  }
});

test('reduced motion renders both new scenes as static readable figures', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.bound-stage')).toHaveCSS('position', 'relative');
  await expect(page.locator('.threshold-stage')).toHaveCSS('position', 'relative');
  const firstEnergy = await page.getByTestId('journey-energy').textContent();
  await page.locator('.threshold-journey').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('journey-energy')).toHaveText(firstEnergy!);
  await expect(page.locator('.figure-trace-line')).toHaveCount(0);
  await page.getByRole('button', { name: 'MOTION OFF' }).click();
  await expect(page.locator('.bound-stage')).toHaveCSS('position', 'sticky');
});

test('compact screens never clip the new reading stages', async ({ page }) => {
  for (const [width, height] of [[320, 568], [320, 700], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (height < 680) {
      await expect(page.locator('.threshold-stage')).toHaveCSS('overflow', 'visible');
      await expect(page.locator('.bound-stage')).toHaveCSS('position', 'relative');
    } else {
      for (const [scene, content] of [['.bound-journey', '.bound-figure figcaption'], ['.threshold-journey', '.threshold-status']]) {
        await seekPinned(page, scene, 0.5);
        const box = await page.locator(content).boundingBox();
        expect(box!.y + box!.height).toBeLessThan(height - 8);
      }
    }
  }
});