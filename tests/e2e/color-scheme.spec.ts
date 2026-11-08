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

for (const colorScheme of ['light', 'dark'] as const) {
	test(`the menu bar background is --bar in ${colorScheme}`, async ({ page }) => {
		await page.emulateMedia({ colorScheme });
		await page.goto('/books');
		const { bar, token } = await page.locator('.menu.bar').evaluate((el) => {
			const probe = document.createElement('div');
			probe.style.backgroundColor = 'var(--bar)';
			document.body.append(probe);
			const token = getComputedStyle(probe).backgroundColor;
			probe.remove();
			return { bar: getComputedStyle(el).backgroundColor, token };
		});
		expect(bar).toEqual(token);
	});
}
