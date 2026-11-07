import { expect, test } from '@playwright/test';

test('every app screenshot has alt text', async ({ page }) => {
	await page.goto('/apps/what-size-will-they-be');
	const alts = await page
		.locator('.screenshots img')
		.evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).alt));
	expect(alts.length).toBeGreaterThan(0);
	for (const alt of alts) expect(alt.trim()).not.toBe('');
});
