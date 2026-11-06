import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const labels = ['Home', 'Books', 'Stories', 'Games', 'Apps', 'About', 'Legal'];

test('the button has the same sticker blue and black frames in light and dark', async ({
	page
}) => {
	const read = async (colorScheme: 'light' | 'dark') => {
		await page.emulateMedia({ colorScheme });
		await page.goto('/books');
		const button = page.getByRole('button', { name: 'Menu' });
		return {
			background: await button
				.locator('.badge')
				.evaluate((el) => getComputedStyle(el).backgroundColor),
			frame: await button.locator('path.frame').evaluate((el) => getComputedStyle(el).fill)
		};
	};
	const light = await read('light');
	const dark = await read('dark');
	expect(dark).toEqual(light);
	expect(light).toEqual({ background: 'rgb(108, 172, 219)', frame: 'rgb(0, 0, 0)' });
});

test('the button opens the menu, moves focus to Home, and Esc returns focus to it', async ({
	page
}) => {
	await page.goto('/books');
	const button = page.getByRole('button', { name: 'Menu' });
	const menu = page.locator('#site-menu');
	await expect(menu).toBeHidden();
	await expect(button).toHaveAttribute('aria-expanded', 'false');

	await button.click();
	await expect(button).toHaveAttribute('aria-expanded', 'true');
	await expect(menu.getByRole('link')).toHaveText(labels);
	await expect(menu.getByRole('link', { name: 'Home' })).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(menu).toBeHidden();
	await expect(button).toHaveAttribute('aria-expanded', 'false');
	await expect(button).toBeFocused();
});

test('a click outside closes the menu, and choosing a link closes it on the new page', async ({
	page
}) => {
	await page.goto('/books');
	const button = page.getByRole('button', { name: 'Menu' });
	const menu = page.locator('#site-menu');

	await button.click();
	await expect(menu).toBeVisible();
	await page.mouse.click(5, 700);
	await expect(menu).toBeHidden();

	await button.click();
	await menu.getByRole('link', { name: 'Stories' }).click();
	await expect(page).toHaveURL(/\/stories$/);
	await expect(menu).toBeHidden();
	await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('only the current page has aria-current in the menu', async ({ page }) => {
	await page.goto('/games');
	await page.getByRole('button', { name: 'Menu' }).click();
	const current = page.locator('#site-menu a[aria-current="page"]');
	await expect(current).toHaveCount(1);
	await expect(current).toHaveText('Games');
});

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('the button links to /menu, which lists the links and is not in the sitemap', async ({
		page
	}) => {
		await page.goto('/books');
		await page.getByRole('link', { name: 'Menu' }).click();
		await expect(page).toHaveURL(/\/menu$/);
		await expect(page.locator('main a')).toHaveText(labels);

		const sitemap = readFileSync('build/sitemap.xml', 'utf8');
		expect(sitemap).not.toContain('/menu');
	});
});
