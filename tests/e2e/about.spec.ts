import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const fixture = readFileSync('tests/fixtures/about-text.txt', 'utf8').replace(/\s+/g, ' ').trim();

test('/about shows the old text with the new name and both photos', async ({ page }) => {
	const response = await page.goto('/about');
	expect(response?.status()).toBe(200);
	const text = await page.locator('main').innerText();
	expect(text.replace(/\s+/g, ' ').trim()).toBe(fixture);
	const alts = await page
		.locator('main img')
		.evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).alt));
	expect(alts).toHaveLength(2);
	expect(alts.some((alt) => alt.includes('Marshall'))).toBe(true);
	expect(alts.some((alt) => alt.includes('Sara'))).toBe(true);
});
