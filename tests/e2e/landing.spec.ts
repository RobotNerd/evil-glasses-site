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

test.describe('the badge stands out', () => {
	test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });

	// Waits for every running transition and animation on the page to finish.
	const settleAll = (page: Page) =>
		page.evaluate(() =>
			Promise.all(document.getAnimations().map((x) => x.finished.catch(() => null))).then(
				() => true
			)
		);

	// Mean luminance of the 48 px band around the badge's box, from a PNG screenshot.
	const bandLuminance = (
		page: Page,
		png: Buffer,
		box: { x: number; y: number; width: number; height: number }
	) =>
		page.evaluate(
			async ({ b64, box }) => {
				const img = new Image();
				img.src = `data:image/png;base64,${b64}`;
				await img.decode();
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(img, 0, 0);
				const { data } = ctx.getImageData(0, 0, img.width, img.height);
				// Screenshots are in device pixels; the box and the band are in CSS pixels.
				const k = img.width / window.innerWidth;
				const band = 48 * k;
				box = {
					x: box.x * k,
					y: box.y * k,
					width: box.width * k,
					height: box.height * k
				};
				let sum = 0;
				let count = 0;
				for (let y = Math.floor(box.y - band); y < box.y + box.height + band; y++) {
					for (let x = Math.floor(box.x - band); x < box.x + box.width + band; x++) {
						const inside =
							x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height;
						if (inside || x < 0 || y < 0 || x >= img.width || y >= img.height) continue;
						const i = (y * img.width + x) * 4;
						sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
						count++;
					}
				}
				return sum / count;
			},
			{ b64: png.toString('base64'), box }
		);

	for (const scheme of ['light', 'dark'] as const) {
		test(`the glow darkens the band around the badge in ${scheme} mode`, async ({ page }) => {
			await page.emulateMedia({ colorScheme: scheme });
			await page.goto('/');
			await page.mouse.move(1000, 700);
			await page.mouse.move(1439, 899);
			await settleAll(page);
			const box = (await page.locator('.landing .hub .badge').boundingBox())!;
			const withGlow = await bandLuminance(page, await page.screenshot(), box);
			await page.locator('.landing .glow').evaluate((el) => (el.style.visibility = 'hidden'));
			const without = await bandLuminance(page, await page.screenshot(), box);
			expect(withGlow).toBeLessThanOrEqual(without * 0.85);
		});
	}

	test('the badge has a drop shadow with a blur of 24 px or more', async ({ page }) => {
		await page.goto('/');
		const blurs = await page.locator('.landing .hub .badge').evaluate((el) => {
			const style = getComputedStyle(el);
			const shadows = [style.boxShadow, style.filter].join(' ');
			// A shadow reads like "rgba(0, 0, 0, 0.5) 0px 12px 40px 0px": offsets, then the blur.
			const found: number[] = [];
			for (const m of shadows.matchAll(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/g)) {
				found.push(Number(m[3]));
			}
			return found;
		});
		expect(Math.max(0, ...blurs)).toBeGreaterThanOrEqual(24);
	});

	test('a click 30 px outside the badge corner, inside the glow, follows the section', async ({
		page
	}) => {
		await page.goto('/');
		const box = (await page.locator('.landing .hub .badge').boundingBox())!;
		await page.mouse.click(box.x - 30, box.y - 30);
		await expect(page).toHaveURL(/\/books$/);
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
