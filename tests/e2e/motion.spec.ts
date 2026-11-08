import { expect, test, type Page } from '@playwright/test';

declare global {
	interface Window {
		__vtCalls: number;
	}
}

/** Counts the calls to startViewTransition before the page scripts run. */
const recordTransitions = () => {
	window.__vtCalls = 0;
	const start = document.startViewTransition?.bind(document);
	if (!start) return;
	document.startViewTransition = ((callback: () => Promise<void>) => {
		window.__vtCalls++;
		return start(callback);
	}) as typeof document.startViewTransition;
};

const open = async (page: Page, path: string) => {
	await page.addInitScript(recordTransitions);
	await page.goto(path);
	// Wait for hydration, so clicks are handled by the router.
	await page.waitForLoadState('networkidle');
};

// A section link is the whole screen, cut to its quadrant, so click inside the quadrant.
const clickBooks = (page: Page) =>
	page.locator('.landing a', { hasText: 'Books' }).click({ position: { x: 100, y: 200 } });

test.describe('with motion', () => {
	test.use({ reducedMotion: 'no-preference' });

	test('no animation delays a click', async ({ page }) => {
		await open(page, '/');
		// The glint is running or waiting to start.
		await expect
			.poll(() => page.locator('.glint').evaluate((el) => el.getAnimations().length))
			.toBe(1);
		const clicked = Date.now();
		await clickBooks(page);
		await expect(page).toHaveURL(/\/books$/, { timeout: 400 });
		expect(Date.now() - clicked).toBeLessThan(400 + 200);
	});
});

test.describe('without View Transitions', () => {
	test.use({ reducedMotion: 'no-preference' });

	test('navigation works and no error is logged', async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (e) => errors.push(e.message));
		page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
		await page.addInitScript(() => {
			// @ts-expect-error simulating a browser without the API
			delete Document.prototype.startViewTransition;
		});
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		expect(await page.evaluate(() => 'startViewTransition' in document)).toBe(false);
		await clickBooks(page);
		await expect(page).toHaveURL(/\/books$/);
		await expect(page.locator('h1')).toHaveText('Books');
		expect(errors).toEqual([]);
	});
});

test.describe('with reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('no transition starts, the glint is still and every duration is 0s', async ({ page }) => {
		await open(page, '/');
		expect(await page.locator('.glint').evaluate((el) => el.getAnimations().length)).toBe(0);
		await clickBooks(page);
		await expect(page).toHaveURL(/\/books$/);
		await page.locator('.cover-grid a').first().click();
		await expect(page.locator('.detail')).toBeVisible();
		expect(await page.evaluate(() => window.__vtCalls)).toBe(0);

		for (const path of ['/', '/books', '/books/mixed-martial-hearts']) {
			await page.goto(path);
			const nonZero = await page.evaluate(() =>
				[...document.querySelectorAll('*')].flatMap((el) => {
					const style = getComputedStyle(el);
					return [style.transitionDuration, style.animationDuration]
						.flatMap((d) => d.split(',').map((x) => x.trim()))
						.filter((d) => d !== '0s')
						.map((d) => `${el.tagName}.${el.getAttribute('class')}: ${d}`);
				})
			);
			expect(nonZero, path).toEqual([]);
		}
	});
});
