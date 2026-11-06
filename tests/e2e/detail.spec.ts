import { expect, test } from '@playwright/test';

const pages = [
	'/books/mixed-martial-hearts',
	'/books/press-start-for-love',
	'/games/inflation-buster',
	'/apps/what-size-will-they-be'
];

for (const path of pages) {
	test(`${path} puts the image left of the text on a wide screen`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(path);
		const image = await page.locator('img.cover').boundingBox();
		const title = await page.locator('h1').boundingBox();
		expect(image && title && image.x + image.width).toBeLessThanOrEqual(title?.x ?? 0);
	});

	test(`${path} puts the image above the text on a phone`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(path);
		const image = await page.locator('img.cover').boundingBox();
		const title = await page.locator('h1').boundingBox();
		expect(image && title && image.y + image.height).toBeLessThanOrEqual(title?.y ?? 0);
		const scroll = await page.evaluate(() => [
			document.documentElement.scrollWidth,
			document.documentElement.clientWidth
		]);
		expect(scroll[0]).toBe(scroll[1]);
	});

	test(`${path} names the cover view-transition-name like the list does`, async ({ page }) => {
		await page.goto(path);
		const slug = path.split('/').pop();
		const name = await page
			.locator('img.cover')
			.evaluate((img) => getComputedStyle(img).viewTransitionName);
		expect(name).toBe(`cover-${slug}`);
	});
}

test('every app screenshot has alt text', async ({ page }) => {
	await page.goto('/apps/what-size-will-they-be');
	const alts = await page
		.locator('.screenshots img')
		.evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).alt));
	expect(alts.length).toBeGreaterThan(0);
	for (const alt of alts) expect(alt.trim()).not.toBe('');
});
