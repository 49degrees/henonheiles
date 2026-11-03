import { expect, test } from '@playwright/test';

test('the motion control is labeled, self-explanatory, and reversible', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const control = page.getByRole('button', { name: /^MOTION/ });
  await expect(control).toBeVisible();
  await expect(control).toHaveText('MOTION ON');
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await expect(control).toHaveAttribute('title', /Pause the scroll-driven animation/);
  await expect(page.locator('.motion-paused-notice')).toHaveCount(0);

  await control.click();
  await expect(control).toHaveText('MOTION OFF');
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await expect(control).toHaveAttribute('title', /Scroll animation is paused/);
  const notice = page.locator('.motion-paused-notice');
  await expect(notice).toBeVisible();
  await expect(notice).toHaveText('MOTION PAUSED · STATIC READING');
  await expect(notice).toHaveRole('status');
  await expect(page.locator('.site-shell')).toHaveClass(/motion-reduced/);

  await control.click();
  await expect(control).toHaveText('MOTION ON');
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.motion-paused-notice')).toHaveCount(0);
  await expect(page.locator('.site-shell')).toHaveClass(/motion-enabled/);

  // Keyboard operation with a visible focus indicator.
  await control.focus();
  await expect(control).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(control).toHaveText('MOTION OFF');
  await page.keyboard.press('Enter');
  await expect(control).toHaveText('MOTION ON');
});

test('the motion control and paused notice stay readable on every layout', async ({ page }) => {
  for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1280, 720], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const control = page.getByRole('button', { name: /^MOTION/ });
    const box = await control.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

    const header = await page.locator('.site-header').boundingBox();
    await control.click();
    const notice = await page.locator('.motion-paused-notice').boundingBox();
    expect(notice!.x).toBeGreaterThanOrEqual(0);
    expect(notice!.x + notice!.width).toBeLessThanOrEqual(width);
    expect(notice!.y).toBeGreaterThan(header!.y + header!.height - 1);
  }
});
