import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('essay and live comparison pass automated WCAG A/AA checks', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
  });
  const essay = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(essay.violations).toEqual([]);
  await page.getByRole('tab', { name: 'Compare normalization' }).click();
  await page.getByRole('button', { name: 'Near escape', exact: true }).click();
  const comparison = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(comparison.violations).toEqual([]);
});

test('phone reading state and complete paper pass automated accessibility checks', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const phone = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(phone.violations).toEqual([]);
  await page.getByRole('button', { name: 'Full paper', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const source = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(source.violations).toEqual([]);
});