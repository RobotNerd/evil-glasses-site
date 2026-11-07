import { readFileSync } from 'node:fs';
import { sourceText } from './checks';
import { expect, test, type Page } from '@playwright/test';

const sizes = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 }
];

const sections = [
	{ name: 'Books', href: '/books', right: false, bottom: false },
	{ name: 'Stories', href: '/stories', right: true, bottom: false },
	{ name: 'Games', href: '/games', right: false, bottom: true },
	{ name: 'Apps', href: '/apps', right: true, bottom: true }
];

const link = (page: Page, name: string) => page.locator('.landing a', { hasText: name });

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

		test('four section links in tab order, one per quadrant', async ({ page }) => {
			await page.goto('/');
			const hrefs = await page
				.locator('.landing a')
				.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
			expect(hrefs).toEqual(['/books', '/stories', '/games', '/apps']);

			// Tab through the page and collect the section links in the order they take focus.
			const focused: string[] = [];
			for (let i = 0; i < 5; i++) {
				await page.keyboard.press('Tab');
				const href = await page.evaluate(() =>
					(document.activeElement as HTMLAnchorElement | null)
						?.closest('.landing')
						?.contains(document.activeElement)
						? document.activeElement?.getAttribute('href')
						: null
				);
				if (href) focused.push(href);
			}
			expect(focused).toEqual(['/books', '/stories', '/games', '/apps']);

			for (const s of sections) {
				const box = (await link(page, s.name).boundingBox())!;
				const cx = box.x + box.width / 2;
				const cy = box.y + box.height / 2;
				// The link is the whole screen; its title sits in the quadrant.
				const t = (await link(page, s.name).locator('.t').boundingBox())!;
				const tx = t.x + t.width / 2;
				const ty = t.y + t.height / 2;
				expect(cx).toBeGreaterThan(0);
				expect(cy).toBeGreaterThan(0);
				expect(tx > size.width / 2).toBe(s.right);
				expect(ty > size.height / 2).toBe(s.bottom);
			}
		});

		test('a click 10 px inside each outer corner follows that section', async ({ page }) => {
			for (const s of sections) {
				await page.goto('/');
				const x = s.right ? size.width - 10 : 10;
				const y = s.bottom ? size.height - 10 : 10;
				await page.mouse.click(x, y);
				await expect(page).toHaveURL(new RegExp(`${s.href}$`));
			}
		});

		test('the badge is centered, holds the logo and says the tagline', async ({ page }) => {
			await page.goto('/');
			const badge = page.locator('.landing .hub .badge');
			const box = (await badge.boundingBox())!;
			expect(Math.abs(box.x + box.width / 2 - size.width / 2)).toBeLessThanOrEqual(2);
			expect(Math.abs(box.y + box.height / 2 - size.height / 2)).toBeLessThanOrEqual(2);
			await expect(badge.locator('svg')).toHaveCount(1);
			expect((await badge.innerText()).trim()).toBe('books, stories, games, and apps');
		});
	});
}

test.describe('hover and focus', () => {
	test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });

	const state = (page: Page, name: string) =>
		link(page, name).evaluate((a) => {
			const get = (sel: string, prop: 'transform' | 'opacity') =>
				getComputedStyle(a.querySelector(sel)!)[prop];
			const scale = (t: string) => Number(new DOMMatrix(t).a.toFixed(3));
			return {
				image: scale(get('.bg', 'transform')),
				fade: Number(get('.fade', 'opacity')),
				vig: getComputedStyle(a).getPropertyValue('--vig').trim(),
				title: scale(get('.t', 'transform'))
			};
		});

	// Waits for every running transition inside the section to finish.
	const settle = (page: Page, name: string) =>
		link(page, name).evaluate((a) =>
			Promise.all(a.getAnimations({ subtree: true }).map((x) => x.finished)).then(() => true)
		);

	// Parks the pointer in the Apps quadrant, away from Books.
	const parkPointer = (page: Page) => page.mouse.move(1000, 700);

	const resting = { image: 1.12, fade: 0.8, vig: '30%', title: 1 };

	test('the pointer zooms out, lightens, opens the vignette and grows the title', async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.goto('/');
		await parkPointer(page);
		await settle(page, 'Books');
		expect(await state(page, 'Books')).toEqual(resting);
		await page.mouse.move(300, 200);
		await settle(page, 'Books');
		expect(await state(page, 'Books')).toEqual({ image: 1, fade: 0.6, vig: '50%', title: 1.12 });
		await parkPointer(page);
		await settle(page, 'Books');
		expect(await state(page, 'Books')).toEqual(resting);
	});

	test('keyboard focus does the same', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.goto('/');
		await parkPointer(page);
		await link(page, 'Books').focus();
		await page.keyboard.press('Shift+Tab');
		await page.keyboard.press('Tab');
		await expect(link(page, 'Books')).toBeFocused();
		await settle(page, 'Books');
		expect(await state(page, 'Books')).toEqual({ image: 1, fade: 0.6, vig: '50%', title: 1.12 });
		await page.keyboard.press('Tab');
		await expect(link(page, 'Books')).not.toBeFocused();
		await settle(page, 'Books');
		expect(await state(page, 'Books')).toEqual(resting);
	});
});

test('the landing page has one hidden h1 with the site name and no footer', async ({ page }) => {
	await page.goto('/');
	const h1 = page.locator('h1');
	await expect(h1).toHaveCount(1);
	await expect(h1).toHaveText('Evil Glasses');
	const box = (await h1.boundingBox())!;
	expect(box.width).toBeLessThanOrEqual(1);
	expect(box.height).toBeLessThanOrEqual(1);
	await expect(page.locator('footer')).toHaveCount(0);
});

test('/about opens with the intro the home page had', async ({ page }) => {
	await page.goto('/about');
	const text = await sourceText(page.locator('main'));
	const intro =
		'Two people. A pair of cursed glasses. We make books, stories, games, and apps. Enjoy!';
	expect(text.replace(/\s+/g, ' ').trim().startsWith(`About Evil Glasses ${intro}`)).toBe(true);
	expect(readFileSync('tests/fixtures/about-text.txt', 'utf8')).toContain(intro);
});
