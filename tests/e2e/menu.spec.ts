import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const labels = ['Home', 'Books', 'Stories', 'Games', 'Apps', 'About', 'Legal'];
const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const web = { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false };

test.describe('on a phone', () => {
	test.use(phone);

	test('the hamburger is at least 44 by 44 and at the right of the bar', async ({ page }) => {
		await page.goto('/books');
		const box = (await page.getByRole('button', { name: 'Menu' }).boundingBox())!;
		expect(box.width).toBeGreaterThanOrEqual(44);
		expect(box.height).toBeGreaterThanOrEqual(44);
		const name = (await page.getByRole('link', { name: 'evilglasses.com' }).boundingBox())!;
		expect(box.x).toBeGreaterThan(name.x + name.width);
	});

	test('the hamburger opens the menu, moves focus to Home, and Esc returns focus to it', async ({
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
		await page.mouse.click(5, 800);
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
});

test.describe('on a phone without JavaScript', () => {
	test.use({ ...phone, javaScriptEnabled: false });

	test('there is no hamburger', async ({ page }) => {
		await page.goto('/books');
		await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
		await expect(page.getByRole('link', { name: 'Menu' })).toBeHidden();
	});
});

test.describe('on the web', () => {
	test.use(web);

	test('the bar shows the arrow and the section links, and no menu button', async ({ page }) => {
		await page.goto('/books');
		await expect(page.getByRole('link', { name: 'Back', exact: true })).toBeVisible();
		const links = page.getByRole('navigation', { name: 'Sections' }).getByRole('link');
		await expect(links).toHaveText(['Home', 'Books', 'Stories', 'Games', 'Apps']);
		await expect(links.filter({ hasText: 'Books' })).toHaveAttribute('aria-current', 'page');
		await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
	});
});

test.describe('the removed menu page', () => {
	test('/menu is a 404 and not in the sitemap', async ({ page }) => {
		const response = await page.goto('/menu');
		expect(response?.status()).toBe(404);
		expect(readFileSync('build/sitemap.xml', 'utf8')).not.toContain('/menu');
	});
});
