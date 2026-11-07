import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const labels = ['Home', 'Books', 'Stories', 'Games', 'Apps', 'About', 'Legal'];
const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const web = { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false };
const noHover = { ...web, isMobile: true, hasTouch: true };

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

test.describe('menu behavior on a phone', () => {
	test.use(phone);

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

test.describe('the menu bar and button', () => {
	for (const size of ['phone', 'web'] as const) {
		test.describe(`on the landing page at ${size}`, () => {
			test.use(size === 'phone' ? phone : web);

			test('the button is at the top right, there is no bar, and the popup lists all links', async ({
				page
			}) => {
				await page.goto('/');
				const view = page.viewportSize()!;
				const button = page.getByRole('button', { name: 'Menu' });
				const box = (await button.boundingBox())!;
				expect(view.width - (box.x + box.width)).toBeLessThanOrEqual(24);
				expect(box.y).toBeLessThanOrEqual(24);
				await expect(page.locator('.menu.bar')).toHaveCount(0);
				await button.click();
				await expect(page.locator('#site-menu').getByRole('link')).toHaveText(labels);
			});
		});
	}

	test.describe('at 1440 px', () => {
		test.use(web);

		for (const path of ['/books', '/books/press-start-for-love']) {
			test(`${path} has centered section links, a short popup and the button last`, async ({
				page
			}) => {
				await page.goto(path);
				const bar = page.locator('.menu.bar');
				const links = bar.getByRole('navigation', { name: 'Sections' }).getByRole('link');
				await expect(links).toHaveText(['Home', 'Books', 'Stories', 'Games', 'Apps']);
				const first = (await links.first().boundingBox())!;
				const last = (await links.last().boundingBox())!;
				expect(Math.abs((first.x + last.x + last.width) / 2 - 720)).toBeLessThanOrEqual(4);

				const button = page.getByRole('button', { name: 'Menu' });
				const box = (await button.boundingBox())!;
				expect(box.x).toBeGreaterThan(last.x + last.width);
				const barBox = (await bar.boundingBox())!;
				expect(barBox.x + barBox.width - (box.x + box.width)).toBeLessThanOrEqual(24);
				await expect(bar.getByRole('link', { name: 'evilglasses.com' })).toBeHidden();

				await expect(links.filter({ hasText: 'Books' })).toHaveAttribute('aria-current', 'page');
				await button.click();
				await expect(page.locator('#site-menu').getByRole('link')).toHaveText(['About', 'Legal']);
			});
		}
	});

	test.describe('at 390 px', () => {
		test.use(phone);

		test('the bar shows the site name, no section links, and the button last', async ({ page }) => {
			await page.goto('/books');
			const bar = page.locator('.menu.bar');
			const name = bar.getByRole('link', { name: 'evilglasses.com' });
			await expect(name).toHaveAttribute('href', '/');
			await expect(bar.getByRole('navigation', { name: 'Sections' })).toBeHidden();
			await expect(bar.getByRole('link')).toHaveText(['', 'evilglasses.com']);
			const nameBox = (await name.boundingBox())!;
			const box = (await page.getByRole('button', { name: 'Menu' }).boundingBox())!;
			expect(box.x).toBeGreaterThan(nameBox.x + nameBox.width);
			expect(390 - (box.x + box.width)).toBeLessThanOrEqual(24);
			await page.getByRole('button', { name: 'Menu' }).click();
			await expect(page.locator('#site-menu').getByRole('link')).toHaveText(labels);
		});
	});

	for (const colorScheme of ['light', 'dark'] as const) {
		test.describe(`button style in ${colorScheme} mode`, () => {
			test.use({ ...web, colorScheme });

			test('has a drop shadow, a 2 px white ring, and grows on hover', async ({ page }) => {
				await page.goto('/');
				const button = page.getByRole('button', { name: 'Menu' });
				const shadow = await button.evaluate((el) => getComputedStyle(el).boxShadow);
				expect(shadow).toContain('rgb(255, 255, 255) 0px 0px 0px 2px');
				expect(shadow).toMatch(/rgba\(0, 0, 0, [\d.]+\) 0px [1-9][\d.]*px [1-9][\d.]*px/);

				const transform = () => button.evaluate((el) => getComputedStyle(el).transform);
				expect(await transform()).toBe('none');
				await button.hover();
				await expect.poll(transform).toBe('matrix(1.06, 0, 0, 1.06, 0, 0)');
			});
		});
	}

	test.describe('on a touch device', () => {
		test.use(noHover);

		test('hover does not change the button', async ({ page }) => {
			await page.goto('/');
			const button = page.getByRole('button', { name: 'Menu' });
			const transform = () => button.evaluate((el) => getComputedStyle(el).transform);
			expect(await transform()).toBe('none');
			await button.hover();
			expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
			await expect.poll(transform).toBe('none');
		});
	});
});
