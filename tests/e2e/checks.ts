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
	page.on('requestfailed', (request) =>
		report(`failed request: ${request.url()} (${request.failure()?.errorText})`)
	);
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
	const button = await page.locator('.menu-button').boundingBox();
	if (!button) report('missing logo menu button');
	else if (button.width < 60 || button.height < 44) {
		report(`logo menu button is ${button.width}x${button.height}, expected at least 60x44`);
	}
	if ((await page.locator('header nav a').count()) > 0) report('found header links');
	const footers = await page.locator('footer').count();
	if (path === '/') {
		if (footers > 0) report('the landing page has a footer');
	} else if (footers < 1) report('missing footer');
	else if ((await page.locator('footer a[href="/legal"]').count()) < 1) {
		report('footer has no link to /legal');
	}

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
