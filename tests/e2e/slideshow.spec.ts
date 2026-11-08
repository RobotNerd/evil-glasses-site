import { expect, test, type Page } from '@playwright/test';

// These values match the constants in src/lib/slideshow.ts.
const SLIDE_MS = 5000;
const FADE_MS = 300;

const title = (page: Page) => page.locator('.slide h2 a');

async function open(page: Page) {
	await page.clock.install();
	await page.goto('/');
	// The button appears once the script has run and the first fade has begun.
	await expect(page.getByRole('button', { name: /slideshow$/ })).toBeVisible();
	await page.clock.runFor(FADE_MS);
}

async function titles(page: Page, count: number) {
	const seen: string[] = [];
	for (let i = 0; i < count; i++) {
		seen.push((await title(page).textContent())!.trim());
		await page.clock.runFor(SLIDE_MS);
	}
	return seen;
}

test('the slides change every 5 s, show every item once, and loop in the same order', async ({
	page
}) => {
	await open(page);
	const total = await page.evaluate(
		async () =>
			(await (await fetch('/sitemap.xml')).text()).match(/\/(books|stories|games|apps)\/[^</]+</g)
				?.length ?? 0
	);
	expect(total).toBeGreaterThan(2);
	const seen = await titles(page, total + 1);
	expect(new Set(seen.slice(0, total)).size).toBe(total);
	expect(seen[total]).toBe(seen[0]);
	expect(seen[1]).not.toBe(seen[0]);
});

test('two loads with different random values show different orders', async ({ browser }) => {
	const orders: string[][] = [];
	for (const value of [0, 0.99]) {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.addInitScript((v) => {
			Math.random = () => v;
		}, value);
		await open(page);
		orders.push(await titles(page, 3));
		await context.close();
	}
	expect(orders[0]).not.toEqual(orders[1]);
});

test('the button pauses and plays the slideshow', async ({ page }) => {
	await open(page);
	const before = await title(page).textContent();
	await page.getByRole('button', { name: 'Pause slideshow' }).click();
	await page.mouse.move(0, 0);
	await page.clock.runFor(2 * SLIDE_MS);
	await expect(title(page)).toHaveText(before!);
	await page.getByRole('button', { name: 'Play slideshow' }).click();
	await expect(page.getByRole('button', { name: 'Pause slideshow' })).toBeVisible();
	// The button is on the slide, and the pointer on the slide holds it.
	await page.mouse.move(0, 0);
	await page.clock.runFor(SLIDE_MS);
	await expect(title(page)).not.toHaveText(before!);
});

test('the slide holds while the pointer or focus is on it', async ({ page }) => {
	await open(page);
	const before = await title(page).textContent();
	await page.locator('.stage').hover();
	await page.clock.runFor(2 * SLIDE_MS);
	await expect(title(page)).toHaveText(before!);
	await page.mouse.move(0, 0);
	await title(page).focus();
	await page.clock.runFor(2 * SLIDE_MS);
	await expect(title(page)).toHaveText(before!);
});

test.describe('with reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('the slideshow starts paused', async ({ page }) => {
		await page.clock.install();
		await page.goto('/');
		const button = page.getByRole('button', { name: 'Play slideshow' });
		await expect(button).toBeVisible();
		const before = await title(page).textContent();
		await page.clock.runFor(2 * SLIDE_MS);
		await expect(title(page)).toHaveText(before!);
	});
});

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('the newest slide shows and there is no button', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.slide')).toHaveCount(1);
		await expect(page.getByRole('button', { name: /slideshow$/ })).toHaveCount(0);
	});
});
