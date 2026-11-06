import { expect, test } from '@playwright/test';

test('headings use the display font and the rest the system font, all self-hosted', async ({
	page
}) => {
	const fonts: { url: string; size: number }[] = [];
	page.on('response', async (response) => {
		if (response.request().resourceType() === 'font') {
			fonts.push({ url: response.url(), size: (await response.body()).length });
		}
	});
	await page.goto('/books');
	await page.waitForLoadState('networkidle');

	const h1 = await page.locator('h1').evaluate((el) => {
		const style = getComputedStyle(el);
		return [style.fontFamily, style.fontWeight, style.textTransform];
	});
	expect(h1[0]).toMatch(/^"?Big Shoulders Display/);
	expect(h1[1]).toBe('800');
	expect(h1[2]).toBe('uppercase');

	const paragraph = await page.locator('body').evaluate((el) => getComputedStyle(el).fontFamily);
	expect(paragraph).toMatch(/^system-ui/);

	const origin = new URL(page.url()).origin;
	expect(fonts.length).toBeGreaterThan(0);
	for (const { url } of fonts) {
		expect(new URL(url).origin).toBe(origin);
		expect(url).toMatch(/\.woff2$/);
	}
	const preloads = await page.locator('link[rel="preload"][as="font"][type="font/woff2"]').count();
	expect(preloads).toBe(3);
	expect(fonts.reduce((sum, f) => sum + f.size, 0)).toBeLessThan(80 * 1024);
});
