import { expect, test, type Page } from '@playwright/test';
import { geometricValues } from '../src/lib/geometry';

async function seekPinned(page: Page, selector: string, progress: number) {
  const position = await page.locator(selector).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top + scrollY, span: rect.height - innerHeight * 0.7, inset: innerHeight * 0.2 };
  });
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), position.top - position.inset + position.span * progress);
  await page.waitForTimeout(180);
}

test('rendered text is non-selectable and copy/cut/paste shortcuts are blocked', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.body).userSelect)).toBe('none');
  expect(await page.locator('h1').evaluate((node) => getComputedStyle(node).userSelect)).toBe('none');
  const guard = await page.evaluate(() => {
    const blocked: Record<string, boolean> = {};
    const target = document.querySelector('h1')!;
    for (const type of ['copy', 'cut', 'paste', 'contextmenu']) {
      const event = new Event(type, { bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      blocked[type] = event.defaultPrevented;
    }
    const key = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true, cancelable: true });
    window.dispatchEvent(key);
    blocked['ctrl+c'] = key.defaultPrevented;
    return blocked;
  });
  expect(guard).toEqual({ copy: true, cut: true, paste: true, contextmenu: true, 'ctrl+c': true });
  await page.keyboard.press('Control+A');
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.getSelection()?.toString() || '')).toBe('');

  // No-copy protection must not remove keyboard operation from the research lab.
  const energy = page.getByRole('spinbutton', { name: 'Energy numeric value' });
  await energy.fill('0.05');
  await energy.press('Enter');
  await expect(page.getByTestId('d-value')).toHaveText('0.3196');

  await page.getByRole('button', { name: 'Full paper', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.locator('.full-paper p').first().evaluate((node) => getComputedStyle(node).userSelect)).toBe('none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('the persistent ink thread follows scroll and restores its exact state', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const scrollable = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const seek = async (fraction: number) => {
    await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), scrollable * fraction);
    await page.waitForTimeout(200);
  };
  await seek(0.18);
  const firstProgress = await page.getByTestId('essay-thread').getAttribute('data-scroll-progress');
  const firstPath = await page.getByTestId('thread-path').getAttribute('d');
  const firstOffset = await page.getByTestId('thread-ink').evaluate((node) => (node as SVGPathElement).style.strokeDashoffset);
  await seek(0.72);
  expect(await page.getByTestId('essay-thread').getAttribute('data-scroll-progress')).not.toBe(firstProgress);
  expect(await page.getByTestId('thread-path').getAttribute('d')).not.toBe(firstPath);
  expect(await page.getByTestId('thread-ink').evaluate((node) => (node as SVGPathElement).style.strokeDashoffset)).not.toBe(firstOffset);
  await seek(0.18);
  await expect(page.getByTestId('essay-thread')).toHaveAttribute('data-scroll-progress', firstProgress!);
  await expect(page.getByTestId('thread-path')).toHaveAttribute('d', firstPath!);
});

test('the equation relay hinges through four exact states and reverses', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await seekPinned(page, '.equation-relay', 0.12);
  await expect(page.locator('.relay-plate[data-active="true"]')).toHaveCount(1);
  await expect(page.getByTestId('relay-plate-0')).toHaveAttribute('data-active', 'true');
  const firstWell = await page.getByTestId('relay-well-path').getAttribute('d');
  const firstRibbon = await page.getByTestId('relay-ribbon').getAttribute('style');
  const firstEnergy = Number(await page.getByTestId('relay-energy').textContent());
  const displayedD = Number(await page.locator('.relay-hud > span:nth-child(3) strong').textContent());
  expect(displayedD).toBeCloseTo(geometricValues(firstEnergy).D, 3);

  await seekPinned(page, '.equation-relay', 0.88);
  await expect(page.getByTestId('relay-plate-3')).toHaveAttribute('data-active', 'true');
  expect(Number(await page.getByTestId('relay-energy').textContent())).toBeGreaterThan(firstEnergy);
  expect(await page.getByTestId('relay-well-path').getAttribute('d')).not.toBe(firstWell);
  expect(await page.getByTestId('relay-ribbon').getAttribute('style')).not.toBe(firstRibbon);

  await seekPinned(page, '.equation-relay', 0.12);
  await expect(page.getByTestId('relay-plate-0')).toHaveAttribute('data-active', 'true');
  await expect(page.getByTestId('relay-well-path')).toHaveAttribute('d', firstWell!);
  await expect(page.getByTestId('relay-ribbon')).toHaveAttribute('style', firstRibbon!);
});

test('the closing contour resolves into the Jasper Liu credit at the end', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main > *:last-child')).toHaveClass(/colophon/);
  await expect(page.locator('.site-footer')).toContainText('by Jasper Liu');

  await seekPinned(page, '.colophon', 0.12);
  const firstContour = await page.getByTestId('colophon-contour').getAttribute('d');
  const credit = page.getByTestId('by-jasper-liu');
  const firstClip = await credit.evaluate((node) => getComputedStyle(node).clipPath);
  await seekPinned(page, '.colophon', 0.92);
  await expect(credit).toContainText('Jasper Liu');
  await expect(credit).toBeVisible();
  expect(await page.getByTestId('colophon-contour').getAttribute('d')).not.toBe(firstContour);
  expect(await credit.evaluate((node) => getComputedStyle(node).clipPath)).not.toBe(firstClip);
  const box = await credit.boundingBox();
  expect(box!.y + box!.height).toBeLessThan(900);

  await seekPinned(page, '.colophon', 0.12);
  await expect(page.getByTestId('colophon-contour')).toHaveAttribute('d', firstContour!);
});

test('reduced motion presents the thread, relay, and colophon as static reading', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByTestId('essay-thread')).toBeHidden();
  await expect(page.locator('.relay-stage')).toHaveCSS('position', 'relative');
  await expect(page.locator('.colophon-stage')).toHaveCSS('position', 'relative');
  for (const plate of await page.locator('.relay-plate').all()) {
    await expect(plate).toHaveCSS('visibility', 'visible');
    await expect(plate).toHaveCSS('opacity', '1');
    expect(await plate.getAttribute('aria-hidden')).not.toBe('true');
  }
  const credit = page.getByTestId('by-jasper-liu');
  await expect(credit).toBeVisible();
  expect(await credit.evaluate((node) => getComputedStyle(node).clipPath)).not.toContain('50%');
  await page.getByRole('button', { name: 'MOTION OFF' }).click();
  await expect(page.getByTestId('essay-thread')).toBeVisible();
  await expect(page.locator('.relay-stage')).toHaveCSS('position', 'sticky');
});

test('compact screens keep the new stages readable without horizontal overflow', async ({ page }) => {
  for (const [width, height] of [[320, 568], [320, 700], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (height < 680) {
      await expect(page.locator('.relay-stage')).toHaveCSS('position', 'relative');
      await expect(page.locator('.colophon-stage')).toHaveCSS('position', 'relative');
    } else {
      await seekPinned(page, '.equation-relay', 0.5);
      const frame = await page.locator('.relay-frame').boundingBox();
      expect(frame!.y + frame!.height).toBeLessThan(height - 8);
      await seekPinned(page, '.colophon', 0.5);
      const credit = await page.getByTestId('by-jasper-liu').boundingBox();
      expect(credit!.y + credit!.height).toBeLessThan(height - 8);
    }
  }
});
