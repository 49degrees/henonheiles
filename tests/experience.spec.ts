import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { thresholdValues } from '../src/lib/geometry';

test('lab controls update every dependent result and exact energy presets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '1/12', exact: true }).click();
  await expect(page.getByTestId('r-minus')).toHaveText('0.5000');
  await expect(page.getByTestId('r-plus')).toHaveText('0.3660');
  await expect(page.getByTestId('d-value')).toHaveText('0.5000');
  await expect(page.getByTestId('steep-value')).toHaveText('0.1962');
  await expect(page.getByTestId('attainability')).toHaveText('Geometrically unattainable');
  await page.getByRole('spinbutton', { name: 'Fixed threshold numeric value' }).fill('0.5');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('beta-effective')).toHaveText('1.0000');
  await expect(page.getByTestId('attainability')).toHaveText('Geometrically attainable');
  await page.getByRole('button', { name: '9/64', exact: true }).click();
  await expect(page.getByTestId('d-value')).toHaveText('1.0000');
  await page.getByRole('spinbutton', { name: 'Fixed threshold numeric value' }).fill('0.1');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('onset-energy')).toHaveText('0.008452');
  await page.getByRole('tab', { name: 'Compare normalization' }).click();
  await page.getByRole('spinbutton', { name: 'Normalized fraction numeric value' }).fill('0.75');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Near escape', exact: true }).click();
  const expected = thresholdValues(0.165, 0.1, 0.75);
  const checks: Record<string, string> = {
    'r-minus': expected.rMinus.toFixed(4),
    'r-plus': expected.rPlus.toFixed(4),
    'd-value': expected.D.toFixed(4),
    'max-value': expected.maxAbs.toFixed(6),
    'steep-value': expected.steepRatio.toFixed(4),
    'beta-effective': expected.betaEffective.toFixed(4),
    'onset-energy': expected.onsetEnergy.toFixed(6),
    'adaptive-alpha': expected.adaptiveAlpha.toFixed(4),
  };
  for (const [id, value] of Object.entries(checks)) await expect(page.getByTestId(id)).toHaveText(value);
  await expect(page.locator('.adaptive-fraction')).toHaveText('Normalized: 75% at every energy.');
  await page.getByRole('button', { name: /Reset/ }).click();
  await expect(page.getByTestId('d-value')).toHaveText('0.6078');
  await expect(page.getByTestId('adaptive-alpha')).toHaveCount(0);
});

test('numeric editing, keyboard sliders, and comparison tabs work', async ({ page }) => {
  await page.goto('/');
  const energy = page.getByRole('spinbutton', { name: 'Energy numeric value' });
  await energy.fill('');
  await energy.pressSequentially('0.05');
  await energy.press('Enter');
  await expect(page.getByTestId('d-value')).toHaveText('0.3196');
  const slider = page.getByRole('slider', { name: /^Energy/ });
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue('0.050001');
  await page.getByRole('tab', { name: 'Fixed threshold', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Compare normalization' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Compare normalization' })).toHaveAttribute('aria-selected', 'true');
  const beta = page.getByRole('slider', { name: /^Normalized fraction/ });
  await beta.focus();
  await beta.press('ArrowRight');
  await expect(beta).toHaveValue('0.51');
  await energy.fill('1');
  await energy.press('Enter');
  await expect(energy).toHaveValue('0.1665');
});

test('attainable equality sets are shown as points, not shaded area', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '9/64', exact: true }).click();
  await expect(page.getByTestId('attainability')).toHaveText('Geometrically attainable');
  await expect(page.getByTestId('fixed-extremum')).toHaveCount(3);
  await page.getByRole('tab', { name: 'Compare normalization' }).click();
  await page.getByRole('spinbutton', { name: 'Normalized fraction numeric value' }).fill('1');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('adaptive-extremum')).toHaveCount(3);
  await expect(page.locator('.attainability-result')).toContainText('marked with circles rather than shaded area');
  await page.getByRole('button', { name: '0.05', exact: true }).click();
  await expect(page.getByTestId('fixed-extremum')).toHaveCount(0);
  await expect(page.getByTestId('adaptive-extremum')).toHaveCount(3);
});

test('scroll choreography is scrubbed, reversible, and uses native scrolling', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const position = await page.locator('.argument-section').evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top + scrollY, span: rect.height - innerHeight * 0.7, inset: innerHeight * 0.2 };
  });
  const setProgress = async (progress: number) => {
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), position.top - position.inset + position.span * progress);
    await page.waitForTimeout(150);
  };
  await setProgress(0.12);
  const firstEnergy = await page.locator('.argument-visual .figure-topline').textContent();
  const firstPixels = await page.locator('.argument-visual canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await setProgress(0.6);
  const laterEnergy = await page.locator('.argument-visual .figure-topline').textContent();
  expect(laterEnergy).not.toEqual(firstEnergy);
  await setProgress(0.94);
  await expect(page.locator('.range-meter-label')).toContainText('NORMALIZED');
  await setProgress(0.12);
  await expect(page.locator('.argument-visual .figure-topline')).toHaveText(firstEnergy!);
  const reversePixels = await page.locator('.argument-visual canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  expect(reversePixels === firstPixels).toBe(true);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(before + 200);
});

test('reduced motion is an unpinned, complete static reading state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-shell')).toHaveClass(/motion-reduced/);
  await expect(page.locator('.argument-visual')).toHaveCSS('position', 'static');
  for (const beat of await page.locator('.argument-beat').all()) await expect(beat).toHaveCSS('opacity', '1');
  await expect(page.getByRole('button', { name: 'MOTION OFF' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'MOTION OFF' })).toBeVisible();
  await expect(page.locator('.motion-paused-notice')).toHaveText('MOTION PAUSED · STATIC READING');
  await page.getByRole('button', { name: 'MOTION OFF' }).click();
  await expect(page.locator('.site-shell')).toHaveClass(/motion-enabled/);
  await expect(page.locator('.motion-paused-notice')).toHaveCount(0);
  await page.getByRole('button', { name: 'MOTION ON' }).click();
  await expect(page.locator('.argument-visual')).toHaveCSS('position', 'static');
});

test('complete paper has valid math, contents navigation, original log, and Escape close', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Full paper', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('.katex-error')).toHaveCount(0);
  await page.getByRole('button', { name: '06 Normal form (context)' }).click();
  await expect(page.locator('#source-section-6')).toBeInViewport();
  await page.getByRole('button', { name: 'A Code & original log' }).click();
  await expect(page.locator('#source-appendix')).toBeInViewport();
  await expect(page.locator('.full-paper pre').last()).toContainText('E_alpha=0.006024');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Full paper', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test('publication downloads and essay anchors resolve without fallback pages', async ({ page, request }) => {
  await page.goto('/');
  const broken = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')!).filter((href) => !document.getElementById(href.slice(1))));
  expect(broken).toEqual([]);
  const source = await request.get('/research-paper.md');
  expect(await source.text()).toBe(readFileSync('research-paper.md', 'utf8'));
  const script = await request.get('/downloads/appendix_a.py');
  expect(await script.text()).toContain('def verify_normal_form():');
  const figure = await request.get('/downloads/figure1.svg');
  expect(figure.headers()['content-type']).toContain('image/svg+xml');
  const log = await request.get('/downloads/original-output.txt');
  expect(await log.text()).toContain('r_alpha=0.2727, E_alpha=0.010300');
});

test('phone and tablet layouts recompose without horizontal page overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
    await page.goto('/');
    const sizes = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
    if (width === 390) {
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Research lab/ }).click();
      await expect(page.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
      await page.getByRole('tab', { name: 'Compare normalization' }).click();
      await expect(page.getByRole('spinbutton', { name: 'Normalized fraction numeric value' })).toBeVisible();
      await page.getByRole('button', { name: 'Full paper', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const readerOverflow = await page.locator('.reader-body').evaluate((node) => node.scrollWidth - node.clientWidth);
      expect(readerOverflow).toBeLessThanOrEqual(1);
      await page.keyboard.press('Escape');
    }
  }
});

test('short desktop viewports preserve space between the hero actions and folio', async ({ page }) => {
  for (const [width, height] of [[1440, 800], [1280, 720]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
    });
    const action = await page.locator('.hero-actions').boundingBox();
    const folio = await page.locator('.hero-footer').boundingBox();
    expect(action!.y + action!.height).toBeLessThan(folio!.y - 16);
  }
});