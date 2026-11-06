import { expect, test } from '@playwright/test';
import { checkPage } from './checks';

async function internalLinks(page: import('@playwright/test').Page): Promise<string[]> {
	const hrefs = await page
		.locator('a[href]')
		.evaluateAll((anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
	const origin = new URL(page.url()).origin;
	return hrefs
		.map((href) => new URL(href))
		.filter((url) => url.origin === origin)
		.map((url) => url.pathname);
}

test('every internal link reachable from / passes the page checks', async ({ page }) => {
	// One axe pass per page, and the site now has 60+ pages.
	test.setTimeout(240_000);
	const queue = ['/'];
	const seen = new Set<string>();
	const problems: string[] = [];

	while (queue.length > 0) {
		const path = queue.shift()!;
		if (seen.has(path)) continue;
		seen.add(path);

		const fresh = page.context().newPage();
		const tab = await fresh;
		const pageProblems = await checkPage(tab, path);
		problems.push(...pageProblems);
		for (const link of await internalLinks(tab)) if (!seen.has(link)) queue.push(link);
		await tab.close();
	}

	expect(problems, problems.join('\n')).toEqual([]);
});
