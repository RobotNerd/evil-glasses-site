import { readFileSync } from 'node:fs';
import { sourceText } from './checks';
import { expect, test } from '@playwright/test';

const fixture = readFileSync('tests/fixtures/about-text.txt', 'utf8').replace(/\s+/g, ' ').trim();

test('/about shows the old text with the new name and both photos', async ({ page }) => {
	const response = await page.goto('/about');
	expect(response?.status()).toBe(200);
	const text = await sourceText(page.locator('main'));
	expect(text.replace(/\s+/g, ' ').trim()).toBe(fixture);
	const alts = await page
		.locator('main img:not(.sticker)')
		.evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).alt));
	expect(alts).toHaveLength(2);
	expect(alts.some((alt) => alt.includes('Marshall'))).toBe(true);
	expect(alts.some((alt) => alt.includes('Sara'))).toBe(true);
});

test('/about shows the sticker, tilted', async ({ page }) => {
	await page.goto('/about');
	const sticker = page.getByRole('img', { name: 'EvilGlasses.com sticker' });
	await expect(sticker).toBeVisible();
	const matrix = await sticker.evaluate((img) => getComputedStyle(img).transform);
	const [a, b] = matrix
		.replace(/matrix\(|\)/g, '')
		.split(',')
		.map(Number);
	expect(Math.round((Math.atan2(b, a) * 180) / Math.PI)).toBe(-6);
});
