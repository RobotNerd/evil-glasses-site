import { expect, test } from '@playwright/test';
import oldUrls from '../fixtures/old-urls.json' with { type: 'json' };
import { localPath, sitemapUrls } from './sitemap-urls';

/** Follows links from `/` over plain HTTP; redirect pages are never linked, so they stay out. */
async function crawl(request: import('@playwright/test').APIRequestContext): Promise<string[]> {
	const seen = new Set<string>();
	const queue = ['/'];
	while (queue.length > 0) {
		const path = queue.shift()!;
		if (seen.has(path)) continue;
		seen.add(path);
		const html = await (await request.get(path)).text();
		for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) {
			// /menu is the no-JavaScript menu page; every page links to it, and it stays out of the sitemap.
			if (!seen.has(href) && href !== '/menu') queue.push(href);
		}
	}
	return [...seen].filter((path) => /\.(html)?$/.test(path) === false);
}

test('the sitemap lists exactly the crawled pages, as absolute URLs', async ({ request }) => {
	const urls = await sitemapUrls(request);
	expect(urls.every((url) => url.startsWith('https://evilglasses.com'))).toBe(true);
	expect(new Set(urls).size).toBe(urls.length);
	expect(urls.map(localPath).sort()).toEqual((await crawl(request)).sort());
});

test('the sitemap has no redirect page', async ({ request }) => {
	const paths = (await sitemapUrls(request)).map(localPath);
	for (const old of Object.keys(oldUrls)) {
		// The home page is a redirect target ("/software") but not a redirect page.
		if (old !== '/') expect(paths).not.toContain(old);
	}
});

test('robots.txt allows all and names the sitemap', async ({ request }) => {
	const robots = await (await request.get('/robots.txt')).text();
	expect(robots).toContain('Allow: /');
	expect(robots).toContain('Sitemap: https://evilglasses.com/sitemap.xml');
});
