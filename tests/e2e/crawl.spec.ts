import { expect, test } from '@playwright/test';
import { checkPage } from './checks';
import { pendingPages } from './pending-pages';

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

test('every internal link reachable from / passes the page checks', async ({ page, request }) => {
	const queue = ['/'];
	const seen = new Set<string>();
	const problems: string[] = [];
	const pendingNow = new Set(pendingPages);

	while (queue.length > 0) {
		const path = queue.shift()!;
		if (seen.has(path)) continue;
		seen.add(path);

		if (pendingNow.has(path)) {
			const status = (await request.get(path)).status();
			if (status === 200) problems.push(`${path}: now exists, remove it from pending-pages.ts`);
			continue;
		}

		const fresh = page.context().newPage();
		const tab = await fresh;
		const pageProblems = await checkPage(tab, path);
		problems.push(...pageProblems);
		for (const link of await internalLinks(tab)) if (!seen.has(link)) queue.push(link);
		await tab.close();
	}

	expect(problems, problems.join('\n')).toEqual([]);
});
