import { expect, test } from '@playwright/test';
import { sitemapUrls, localPath } from './sitemap-urls';

test('the header and the home page show the logo with its alt text', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('header').getByRole('img', { name: 'Evil Glasses' })).toBeVisible();
	await expect(page.locator('main').getByRole('img', { name: 'Evil Glasses' })).toBeVisible();
});

test('the favicon files are built with the stated sizes', async ({ request }) => {
	for (const file of ['/favicon.svg', '/favicon.png', '/apple-touch-icon.png']) {
		expect((await request.get(file)).status(), file).toBe(200);
	}
	// PNG width and height sit at bytes 16-23 of the IHDR chunk.
	const size = async (file: string) => {
		const body = await (await request.get(file)).body();
		return [body.readUInt32BE(16), body.readUInt32BE(20)];
	};
	expect(await size('/favicon.png')).toEqual([32, 32]);
	expect(await size('/apple-touch-icon.png')).toEqual([180, 180]);
});

test('every page links to all three icons', async ({ request }) => {
	// Read the served HTML, which is what crawlers and browsers see before any script runs.
	const paths = [...(await sitemapUrls(request)).map(localPath), '/no-such-page'];
	for (const path of paths) {
		const html = await (await request.get(path)).text();
		expect(html, path).toContain('<link rel="icon" href="/favicon.svg"');
		expect(html, path).toContain('<link rel="icon" href="/favicon.png"');
		expect(html, path).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png"');
	}
});
