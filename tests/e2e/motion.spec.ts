import { expect, test, type Page } from '@playwright/test';

declare global {
	interface Window {
		__vt: Promise<{ pseudo: string; duration: number }[]>;
		__vtCalls: number;
		__glints: number;
		__vtAnimations: Promise<Captured[]>;
	}
}

type Timing = { pseudo: string; duration: number };
type Captured = { pseudo: string; duration: number; properties: string[] };

/**
 * Wraps startViewTransition again, so `window.__vtAnimations` resolves with the next transition's
 * animations once it is ready: their durations and the properties their keyframes hold.
 */
const captureOnNavigate = () => {
	const start = document.startViewTransition.bind(document);
	window.__vtAnimations = new Promise((resolve) => {
		document.startViewTransition = ((callback: () => Promise<void>) => {
			const transition = start(callback);
			transition.ready.then(
				() =>
					resolve(
						document
							.getAnimations()
							.filter((a) =>
								(a.effect as KeyframeEffect).pseudoElement?.startsWith('::view-transition')
							)
							.map((a) => ({
								pseudo: (a.effect as KeyframeEffect).pseudoElement!,
								duration: Number(a.effect!.getTiming().duration),
								properties: [
									...new Set(
										(a.effect as KeyframeEffect)
											.getKeyframes()
											.flatMap((k) =>
												Object.keys(k).filter(
													(key) =>
														!['offset', 'easing', 'composite', 'computedOffset'].includes(key)
												)
											)
									)
								]
							}))
					),
				() => resolve([])
			);
			return transition;
		}) as typeof document.startViewTransition;
	});
};

const expectOpacityFade = (captured: Captured[]) => {
	expect(captured.length).toBeGreaterThan(0);
	for (const a of captured) {
		expect(a.duration, a.pseudo).toBe(300);
		expect(a.properties, a.pseudo).toEqual(['opacity']);
	}
};

const sectionNames = (page: Page) =>
	page.evaluate(() =>
		[...document.querySelectorAll('*')]
			.map((el) => getComputedStyle(el).viewTransitionName)
			.filter((n) => n.startsWith('section-'))
	);

/**
 * Wraps startViewTransition before the page scripts run. `window.__vt` resolves, once the first
 * transition is ready, with the pseudo-element animations it runs and their durations, so the
 * tests wait on a promise and never on a sleep.
 */
const recordTransitions = () => {
	window.__vtCalls = 0;
	window.__glints = 0;
	document.addEventListener(
		'animationstart',
		(event) => {
			if (event.animationName.endsWith('glint')) window.__glints++;
		},
		true
	);
	const start = document.startViewTransition?.bind(document);
	if (!start) return;
	let resolve: (timings: { pseudo: string; duration: number }[]) => void;
	window.__vt = new Promise((r) => (resolve = r));
	document.startViewTransition = ((callback: () => Promise<void>) => {
		window.__vtCalls++;
		const transition = start(callback);
		transition.ready.then(
			() =>
				resolve(
					document
						.getAnimations()
						.filter((a) =>
							(a.effect as KeyframeEffect).pseudoElement?.startsWith('::view-transition')
						)
						.map((a) => ({
							pseudo: (a.effect as KeyframeEffect).pseudoElement!,
							duration: Number(a.effect!.getTiming().duration)
						}))
				),
			() => resolve([])
		);
		return transition;
	}) as typeof document.startViewTransition;
};

const open = async (page: Page, path: string) => {
	await page.addInitScript(recordTransitions);
	await page.goto(path);
	// Wait for hydration, so clicks are handled by the router.
	await page.locator('button.menu-button').waitFor();
};

// A section link is the whole screen, cut to its quadrant, so click inside the quadrant.
const clickBooks = (page: Page) =>
	page.locator('.landing a', { hasText: 'Books' }).click({ position: { x: 100, y: 200 } });

const durationsOf = (timings: Timing[], pseudo?: string) =>
	new Set(timings.filter((t) => !pseudo || t.pseudo.includes(pseudo)).map((t) => t.duration));

test.describe('with motion', () => {
	test.use({ reducedMotion: 'no-preference' });

	test('a navigation cross-fades in 180 ms', async ({ page }) => {
		await open(page, '/books');
		await page.locator('button.menu-button').click();
		await page.locator('#site-menu').getByRole('link', { name: 'About' }).click();
		const timings = await page.evaluate(() => window.__vt);
		expect(timings.length).toBeGreaterThan(0);
		expect(durationsOf(timings)).toEqual(new Set([180]));
		await expect(page).toHaveURL(/\/about$/);
	});

	for (const [name, quadrant] of [
		['Books', { x: 0.25, y: 0.25 }],
		['Stories', { x: 0.75, y: 0.25 }],
		['Games', { x: 0.25, y: 0.75 }],
		['Apps', { x: 0.75, y: 0.75 }]
	] as const) {
		test(`the landing page fades into ${name} in 300 ms`, async ({ page }) => {
			await open(page, '/');
			await page.evaluate(captureOnNavigate);
			const size = page.viewportSize()!;
			await page.mouse.click(size.width * quadrant.x, size.height * quadrant.y);
			await expect(page).toHaveURL(new RegExp(`/${name.toLowerCase()}$`));
			const captured = await page.evaluate(() => window.__vtAnimations);
			expectOpacityFade(captured);
			expect(await sectionNames(page)).toEqual([]);
		});
	}

	test('the back arrow fades back to the landing page in 300 ms', async ({ page }) => {
		await open(page, '/books');
		await page.evaluate(captureOnNavigate);
		await page.getByRole('link', { name: 'Back' }).click();
		await expect(page).toHaveURL(/\/$/);
		expectOpacityFade(await page.evaluate(() => window.__vtAnimations));
	});

	test('a cover moves into its page in 250 ms', async ({ page }) => {
		await open(page, '/books');
		const cover = page.locator('.cover-grid a').first();
		const name = await cover
			.locator('img')
			.evaluate((el) => getComputedStyle(el).viewTransitionName);
		expect(name).toMatch(/^cover-/);
		await cover.click();
		const timings = await page.evaluate(() => window.__vt);
		expect(durationsOf(timings)).toEqual(new Set([250]));
		expect(timings.some((t) => t.pseudo === `::view-transition-group(${name})`)).toBe(true);
		await expect(page.locator('.detail img.cover')).toHaveCSS('view-transition-name', name);
	});

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

	test('the glint plays on each visit and never on hover', async ({ page }) => {
		await open(page, '/');
		await page.waitForFunction(() => window.__glints === 1);
		const glintDone = () =>
			page
				.locator('.glint')
				.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)).then(() => true));
		await glintDone();
		const box = (await page.locator('.hub svg').boundingBox())!;
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.move(box.x + box.width / 3, box.y + box.height / 2);
		// A frame later, nothing new has started.
		await page.evaluate(
			() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
		);
		expect(await page.evaluate(() => window.__glints)).toBe(1);

		await clickBooks(page);
		await expect(page).toHaveURL(/\/books$/);
		await page.goBack();
		await expect(page).toHaveURL(/\/$/);
		await page.waitForFunction(() => window.__glints === 2);
	});

	test.describe('cover lift', () => {
		const lift = async (page: Page) => {
			await open(page, '/books');
			const img = page.locator('.cover-grid a').first().locator('img');
			await img.hover();
			return img.evaluate(async (el) => {
				await Promise.all(el.getAnimations().map((a) => a.finished));
				const style = getComputedStyle(el);
				return {
					transform: style.transform,
					shadow: style.boxShadow,
					duration: style.transitionDuration
				};
			});
		};

		test.describe('with hover', () => {
			test.use({ hasTouch: false, isMobile: false });
			test('a cover rises 4 px with a shadow in 150 ms', async ({ page }) => {
				const result = await lift(page);
				expect(result.transform).toBe('matrix(1, 0, 0, 1, 0, -4)');
				expect(result.shadow).not.toBe('none');
				expect(result.duration).toBe('0.15s, 0.15s');
			});
		});

		test.describe('on touch', () => {
			test.use({ hasTouch: true, isMobile: true });
			test('a cover does not change', async ({ page }) => {
				const result = await lift(page);
				expect(result.transform).toBe('none');
				expect(result.shadow).toBe('none');
			});
		});
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
		await page.locator('button.menu-button').waitFor();
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
