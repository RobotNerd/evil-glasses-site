import { expect, test } from '@playwright/test';

test('an unknown URL shows the not-found page with links home and to stories', async ({ page }) => {
	const response = await page.goto('/no-such-page');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('Page not found');
	await expect(page.locator('main a[href="/"]')).toBeVisible();
	await expect(page.locator('main a[href="/stories"]')).toBeVisible();
});
