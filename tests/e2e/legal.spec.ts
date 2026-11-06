import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const fixture = readFileSync('tests/fixtures/inflation-buster-policy.txt', 'utf8')
	.replace(/\s+/g, ' ')
	.trim();

const appFixture = readFileSync('tests/fixtures/what-size-will-they-be-policy.txt', 'utf8')
	.replace(/\s+/g, ' ')
	.trim();

test('/legal lists the Inflation Buster policy', async ({ page }) => {
	await page.goto('/legal');
	await expect(page.locator('main a[href="/legal/inflation-buster"]')).toHaveText(
		'Privacy Policy for Inflation Buster'
	);
});

test('/legal/inflation-buster serves the old policy text without a redirect', async ({ page }) => {
	const response = await page.goto('/legal/inflation-buster');
	expect(response?.status()).toBe(200);
	expect(response?.request().redirectedFrom()).toBeNull();
	const text = await page.locator('main').innerText();
	expect(text.replace(/\s+/g, ' ').trim()).toBe(fixture);
});

test('/legal links to both policies', async ({ page }) => {
	await page.goto('/legal');
	await expect(page.locator('main a[href="/legal/inflation-buster"]')).toBeVisible();
	await expect(page.locator('main a[href="/legal/what-size-will-they-be"]')).toBeVisible();
});

test('/legal/what-size-will-they-be serves the policy text without a redirect', async ({
	page
}) => {
	const response = await page.goto('/legal/what-size-will-they-be');
	expect(response?.status()).toBe(200);
	expect(response?.request().redirectedFrom()).toBeNull();
	const text = await page.locator('main').innerText();
	expect(text.replace(/\s+/g, ' ').trim()).toBe(appFixture);
});
