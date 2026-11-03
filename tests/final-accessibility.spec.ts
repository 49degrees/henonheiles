import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seekPinned(page: Page, selector: string, progress: number) {
  const position = await page.locator(selector).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top + scrollY, span: rect.height - innerHeight * 0.7, inset: innerHeight * 0.2 };
  });
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), position.top - position.inset + position.span * progress);
  await page.waitForTimeout(180);
}

test('new motion scenes remain accessible on desktop and phone', async ({ page }) => {
  test.setTimeout(120_000);
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const [scene, progress] of [['.equation-relay', 0.12], ['.equation-relay', 0.88], ['.colophon', 0.92]] as const) {
      await seekPinned(page, scene, progress);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      expect(results.violations, `${width}x${height} ${scene} ${progress}`).toEqual([]);
    }
  }
});
