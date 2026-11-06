import { expect, test } from '@playwright/test';

test('body background differs between light and dark color schemes', async ({ page }) => {
	const background = async (colorScheme: 'light' | 'dark') => {
		await page.emulateMedia({ colorScheme });
		await page.goto('/');
		return page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor);
	};
	const light = await background('light');
	const dark = await background('dark');
	expect(light).not.toEqual(dark);
});
