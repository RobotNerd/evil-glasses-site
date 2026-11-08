import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';

export const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Loads a path and returns every problem found, each prefixed with the URL. */
export async function checkPage(page: Page, path: string): Promise<string[]> {
	const problems: string[] = [];
	const report = (message: string) => problems.push(`${path}: ${message}`);

	page.on('console', (msg) => {
		if (msg.type() === 'error') report(`console error: ${msg.text()}`);
	});
	page.on('pageerror', (error) => report(`page error: ${error.message}`));
	page.on('requestfailed', (request) => {
		const error = request.failure()?.errorText;
		// The browser cancels a lazy image when it leaves the page before the image loads.
		// That is not a broken request; a missing file still fails on its status below.
		if (error === 'net::ERR_ABORTED') return;
		report(`failed request: ${request.url()} (${error})`);
	});
	page.on('response', (response) => {
		if (response.status() >= 400 && response.request().resourceType() !== 'document') {
			report(`failed request: ${response.url()} (status ${response.status()})`);
		}
	});

	const response = await page.goto(path);
	if (response?.status() !== 200) report(`status ${response?.status()}, expected 200`);
	await page.waitForLoadState('networkidle');

	const h1s = await page.locator('h1').count();
	if (h1s !== 1) report(`found ${h1s} h1 elements, expected exactly 1`);
	if (
		(await page
			.locator('.menu-button')
			.filter({ has: page.locator('path.frame') })
			.count()) > 0
	) {
		report('found the logo menu button');
	}
	const bars = await page.locator('.menu.bar').count();
	if (path === '/') {
		if (bars > 0) report('the landing page has a menu bar');
	} else if (bars !== 1) report(`found ${bars} menu bars, expected 1`);
	else {
		const bar = page.locator('.menu.bar');
		const top = async () => (await bar.boundingBox())!.y;
		const bottom = await bar.evaluate((el) => el.getBoundingClientRect().bottom);
		const h1Top = await page.locator('h1').evaluate((el) => el.getBoundingClientRect().top);
		if (h1Top < bottom) report(`h1 starts at ${h1Top}, above the bar's bottom edge ${bottom}`);
		if ((await top()) !== 0) report(`menu bar top is ${await top()} before scrolling, expected 0`);
		await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
		await page.waitForFunction(
			() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1
		);
		if ((await top()) !== 0) report(`menu bar top is ${await top()} after scrolling, expected 0`);
		await page.evaluate(() => window.scrollTo(0, 0));
	}
	await checkBackArrow(page, path, report);
	if ((await page.locator('header nav a').count()) > 0) report('found header links');
	const footers = await page.locator('footer').count();
	if (footers < 1) report('missing footer');
	else {
		for (const href of ['/about', '/legal']) {
			if ((await page.locator(`footer a[href="${href}"]`).count()) < 1) {
				report(`footer has no link to ${href}`);
			}
		}
		const year = new Date().getFullYear();
		if (!(await page.locator('footer').innerText()).includes(`© ${year} Evil Glasses`)) {
			report('footer has no copyright line');
		}
	}

	// Lazy images below the fold load when scrolled to: bring each into view and wait for it.
	await page.evaluate(async () => {
		for (const img of document.images) {
			img.scrollIntoView();
			if (!img.complete) {
				await new Promise((done) => {
					img.addEventListener('load', done, { once: true });
					img.addEventListener('error', done, { once: true });
				});
			}
		}
		window.scrollTo(0, 0);
	});
	const brokenImages = await page.evaluate(() =>
		[...document.images]
			.filter((img) => !img.complete || img.naturalWidth === 0)
			.map((img) => img.currentSrc || img.src)
	);
	for (const src of brokenImages) report(`image did not load: ${src}`);

	const axe = await new AxeBuilder({ page }).withTags(axeTags).analyze();
	for (const violation of axe.violations) {
		report(`axe ${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`);
	}
	return problems;
}

/** A locator's rendered text with the headings' capitals undone, so it can be compared to the source. */
export async function sourceText(locator: Locator): Promise<string> {
	await locator.page().addStyleTag({ content: 'h1, h2, h3 { text-transform: none !important; }' });
	return locator.innerText();
}

/** The arrow is the bar's leftmost link and at least 44x44 at both sizes; the landing page has none. */
async function checkBackArrow(page: Page, path: string, report: (message: string) => void) {
	const original = page.viewportSize();
	const back = page.getByRole('link', { name: 'Back', exact: true });
	for (const size of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 }
	]) {
		await page.setViewportSize(size);
		const where = `at ${size.width}px`;
		if (path === '/') {
			if ((await back.count()) > 0) report(`the landing page has a back arrow ${where}`);
			continue;
		}
		if ((await back.count()) !== 1) {
			report(`found ${await back.count()} back arrows ${where}, expected 1`);
			continue;
		}
		const box = (await back.boundingBox())!;
		if (box.width < 44 || box.height < 44) {
			report(`back arrow is ${box.width}x${box.height} ${where}, expected at least 44x44`);
		}
		const leftmost = await page
			.locator('.menu.bar a')
			.evaluateAll((anchors) => anchors[0].getAttribute('aria-label'));
		if (leftmost !== 'Back') report(`back arrow is not the first link in the bar ${where}`);
		const others = await page
			.locator('.menu.bar a:visible')
			.evaluateAll((anchors) => anchors.map((a) => a.getBoundingClientRect().left));
		if (others.some((left) => left < box.x)) report(`back arrow is not leftmost ${where}`);
	}
	if (original) await page.setViewportSize(original);
}
