import { expect, test } from '@playwright/test';

test('a built page is served at its extensionless path with status 200', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.status()).toBe(200);
	await expect(page.locator('h1')).toHaveText('Evil Glasses');
});

test('an unknown path returns status 404 with the 404 page', async ({ page }) => {
	const response = await page.goto('/no-such-page');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('Page not found');
});
