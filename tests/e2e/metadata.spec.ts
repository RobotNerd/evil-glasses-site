import { expect, test } from '@playwright/test';
import { localPath, origin, sitemapUrls } from './sitemap-urls';

const ownImage = /^\/(books|games|apps|stories)\/[^/]+$/;

test('every page has unique, absolute metadata', async ({ page, request }) => {
	test.setTimeout(120_000);
	const urls = await sitemapUrls(request);
	const titles = new Map<string, string>();
	const problems: string[] = [];

	for (const url of urls) {
		const path = localPath(url);
		await page.goto(path);
		const meta = (selector: string) => page.locator(selector).getAttribute('content');

		const title = await page.title();
		if (!title) problems.push(`${path}: no title`);
		if (titles.has(title)) problems.push(`${path}: title "${title}" repeats ${titles.get(title)}`);
		titles.set(title, path);

		if (!(await meta('meta[name="description"]'))) problems.push(`${path}: no description`);
		if ((await meta('meta[property="og:title"]')) !== title) problems.push(`${path}: og:title`);
		if (!(await meta('meta[property="og:description"]'))) problems.push(`${path}: og:description`);
		if ((await meta('meta[name="twitter:card"]')) !== 'summary_large_image') {
			problems.push(`${path}: twitter:card`);
		}
		if ((await meta('meta[property="og:url"]')) !== url) problems.push(`${path}: og:url`);
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		if (canonical !== url) problems.push(`${path}: canonical is ${canonical}`);

		const image = await meta('meta[property="og:image"]');
		if (!image?.startsWith(`${origin}/`)) problems.push(`${path}: og:image is ${image}`);
		const isDefault = image === `${origin}/og-default.png`;
		if (ownImage.test(path) === isDefault) {
			problems.push(`${path}: og:image ${isDefault ? 'is the default but' : 'is'} unexpected`);
		}
		if ((await meta('meta[name="twitter:image"]')) !== image)
			problems.push(`${path}: twitter:image`);
		if (image && !isDefault) {
			const response = await request.get(image.slice(origin.length));
			if (response.status() !== 200) problems.push(`${path}: og:image does not load`);
		}
	}
	expect(problems, problems.join('\n')).toEqual([]);
});
