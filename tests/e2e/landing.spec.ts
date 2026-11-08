import { readFileSync } from 'node:fs';
import { sourceText } from './checks';
import { expect, test } from '@playwright/test';

const sizes = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 }
];

const sections = [
	{ name: 'Books', href: '/books' },
	{ name: 'Stories', href: '/stories' },
	{ name: 'Games', href: '/games' },
	{ name: 'Apps', href: '/apps' }
];

for (const size of sizes) {
	test.describe(`at ${size.name} size`, () => {
		test.use({ viewport: { width: size.width, height: size.height } });

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
			const box = (await page.locator('.logo .badge').boundingBox())!;
			await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
			await expect(page).toHaveURL(/\/$/);
			expect(await page.locator('.logo a').count()).toBe(0);
		});

		test('the logo is above the links and the slide', async ({ page }) => {
			await page.goto('/');
			const logo = (await page.locator('.logo .badge').boundingBox())!;
			expect(Math.abs(logo.x + logo.width / 2 - size.width / 2)).toBeLessThanOrEqual(2);
			await expect(page.locator('.logo .badge svg')).toHaveCount(1);
			expect((await page.locator('.logo .badge').innerText()).trim()).toBe('');
			for (const target of ['.links', '.slide']) {
				const box = (await page.locator(target).boundingBox())!;
				expect(box.y).toBeGreaterThanOrEqual(logo.y + logo.height);
			}
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
			await expect(slide.locator('a.image img')).toBeVisible();
			expect(await slide.locator('a.image').getAttribute('href')).toBe(
				await slide.locator('h2 a').getAttribute('href')
			);
			if (size.width >= 1000) await expect(slide.locator('.summary')).toBeVisible();
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
