import { readFileSync } from 'node:fs';
import { sourceText } from './checks';
import { expect, test } from '@playwright/test';

const sizes = [
	{ name: 'phone', width: 390, height: 844, touch: true },
	{ name: 'sideways phone', width: 844, height: 390, touch: true },
	{ name: 'desktop', width: 1440, height: 900, touch: false },
	{ name: 'short desktop', width: 1440, height: 500, touch: false }
];

type Box = { x: number; y: number; width: number; height: number };
const inside = (inner: Box, outer: Box) =>
	inner.x >= outer.x - 1 &&
	inner.y >= outer.y - 1 &&
	inner.x + inner.width <= outer.x + outer.width + 1 &&
	inner.y + inner.height <= outer.y + outer.height + 1;

const sections = [
	{ name: 'Books', href: '/books' },
	{ name: 'Stories', href: '/stories' },
	{ name: 'Games', href: '/games' },
	{ name: 'Apps', href: '/apps' }
];

for (const size of sizes) {
	test.describe(`at ${size.name} size`, () => {
		test.use({
			viewport: { width: size.width, height: size.height },
			hasTouch: size.touch,
			isMobile: size.touch
		});

		test('the landing page is one screen', async ({ page }) => {
			await page.goto('/');
			const m = await page.evaluate(() => ({
				sh: document.documentElement.scrollHeight,
				ch: document.documentElement.clientHeight,
				sw: document.documentElement.scrollWidth,
				cw: document.documentElement.clientWidth
			}));
			expect(m.sh).toBe(m.ch);
			expect(m.sw).toBe(m.cw);
			const footer = (await page.locator('footer').boundingBox())!;
			expect(footer.y + footer.height).toBeLessThanOrEqual(size.height);
		});

		test('four section links in tab order', async ({ page }) => {
			await page.goto('/');
			const links = page.locator('.links a');
			expect(await links.evaluateAll((as) => as.map((a) => a.textContent?.trim()))).toEqual(
				sections.map((s) => s.name)
			);
			const focused: (string | null)[] = [];
			for (let i = 0; i < 4; i++) {
				await page.keyboard.press('Tab');
				focused.push(
					await page.evaluate(() => document.activeElement?.getAttribute('href') ?? null)
				);
			}
			expect(focused).toEqual(sections.map((s) => s.href));
		});

		test('a click on the logo stays on the landing page', async ({ page }) => {
			await page.goto('/');
			const box = (await page.locator('.logo svg').boundingBox())!;
			await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
			await expect(page).toHaveURL(/\/$/);
			expect(await page.locator('.logo a').count()).toBe(0);
		});

		test('the logo is above the links and the slide', async ({ page }) => {
			test.skip(size.name === 'sideways phone');
			await page.goto('/');
			const logo = (await page.locator('.logo svg').boundingBox())!;
			expect(Math.abs(logo.x + logo.width / 2 - size.width / 2)).toBeLessThanOrEqual(2);
			await expect(page.locator('.logo svg')).toHaveCount(1);
			expect((await page.locator('.logo').innerText()).trim()).toBe('');
			for (const target of ['.links', '.slide']) {
				const box = (await page.locator(target).boundingBox())!;
				expect(box.y).toBeGreaterThanOrEqual(logo.y + logo.height);
			}
			const banner = (await page.locator('.banner').boundingBox())!;
			const links = (await page.locator('.links').boundingBox())!;
			expect(links.y).toBeGreaterThanOrEqual(banner.y + banner.height - 1);
		});

		test('the slide shows the newest item and its summary only on wide screens', async ({
			page
		}) => {
			await page.goto('/');
			const slide = page.locator('.slide');
			await expect(slide.locator('h2 a')).toHaveAttribute(
				'href',
				/^\/(books|stories|games|apps)\/./
			);
			await expect(slide.locator('.date')).toHaveText(/\w+ \d+, \d{4}/);
			const kinds = { books: 'Book', stories: 'Short story', games: 'Game', apps: 'App' };
			const section = (await slide.locator('h2 a').getAttribute('href'))!.split('/')[1];
			await expect(slide.locator('.category')).toHaveText(kinds[section as keyof typeof kinds]);
			const below = async (sel: string) => (await slide.locator(sel).boundingBox())!.y;
			expect(await below('.category')).toBeGreaterThan(await below('h2'));
			await expect(slide.locator('a.image img')).toBeVisible();
			expect(await slide.locator('a.image').getAttribute('href')).toBe(
				await slide.locator('h2 a').getAttribute('href')
			);
			if (size.width >= 1000 || size.name === 'sideways phone')
				await expect(slide.locator('.summary')).toBeVisible();
			else await expect(slide.locator('.summary')).toBeHidden();
		});

		test('the footer has About, Legal and the copyright', async ({ page }) => {
			await page.goto('/');
			const footer = page.locator('footer');
			await expect(footer.locator('a[href="/about"]')).toHaveCount(1);
			await expect(footer.locator('a[href="/legal"]')).toHaveCount(1);
			await expect(footer).toContainText(`© ${new Date().getFullYear()} Evil Glasses`);
			await expect(page.locator('.menu')).toHaveCount(0);
		});

		if (size.name === 'sideways phone') {
			test('the logo and the links share the banner row', async ({ page }) => {
				await page.goto('/', { waitUntil: 'networkidle' });
				const banner = (await page.locator('.banner').boundingBox())!;
				const logo = (await page.locator('.logo').boundingBox())!;
				expect(inside(logo, banner)).toBe(true);
				let previous = logo;
				const anchors = page.locator('.links a');
				for (let i = 0; i < sections.length; i++) {
					const box = (await anchors.nth(i).boundingBox())!;
					expect(inside(box, banner)).toBe(true);
					expect(box.x).toBeGreaterThanOrEqual(previous.x + previous.width - 1);
					expect(box.height).toBeGreaterThanOrEqual(44);
					previous = box;
				}
			});

			test('the slide sits between the banner and the footer, image left of text', async ({
				page
			}) => {
				await page.goto('/', { waitUntil: 'networkidle' });
				const banner = (await page.locator('.banner').boundingBox())!;
				const footer = (await page.locator('footer').boundingBox())!;
				const image = (await page.locator('.slide a.image img').boundingBox())!;
				const text = (await page.locator('.slide .text').boundingBox())!;
				const slide = (await page.locator('.slide').boundingBox())!;
				expect(image.x + image.width).toBeLessThanOrEqual(text.x);
				expect(image.height).toBeGreaterThanOrEqual(160);
				expect(slide.y).toBeGreaterThanOrEqual(banner.y + banner.height);
				expect(slide.y + slide.height).toBeLessThanOrEqual(footer.y);
				expect(text.y + text.height).toBeLessThanOrEqual(footer.y);
			});
		}

		if (size.width < 500) {
			test('each section link is at least 44 px tall', async ({ page }) => {
				await page.goto('/');
				for (const box of await page
					.locator('.links a')
					.evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height))) {
					expect(box).toBeGreaterThanOrEqual(44);
				}
			});
		}
	});
}

test('the landing page has one hidden h1 with the site name', async ({ page }) => {
	await page.goto('/');
	const h1 = page.locator('h1');
	await expect(h1).toHaveCount(1);
	await expect(h1).toHaveText('Evil Glasses');
	const box = (await h1.boundingBox())!;
	expect(box.width).toBeLessThanOrEqual(1);
	expect(box.height).toBeLessThanOrEqual(1);
});

test('/about opens with the intro the home page had', async ({ page }) => {
	await page.goto('/about');
	const text = await sourceText(page.locator('main'));
	const intro =
		'Two people. A pair of cursed glasses. We make books, stories, games, and apps. Enjoy!';
	expect(text.replace(/\s+/g, ' ').trim().startsWith(`About Evil Glasses ${intro}`)).toBe(true);
	expect(readFileSync('tests/fixtures/about-text.txt', 'utf8')).toContain(intro);
});
