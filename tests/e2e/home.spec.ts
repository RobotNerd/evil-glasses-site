import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parse } from 'yaml';
import { newestItems, type Newest } from '../../src/lib/content/newest';

function readItems(): Newest[] {
	const items: Newest[] = [];
	for (const type of ['books', 'stories', 'games', 'apps'] as const) {
		for (const slug of readdirSync(`src/content/${type}`)) {
			const source = readFileSync(`src/content/${type}/${slug}/index.md`, 'utf8');
			const data = parse(/^---\r?\n([\s\S]*?)\r?\n---/.exec(source)![1]);
			items.push({ type, slug, title: data.title, date: data.date });
		}
	}
	return items;
}

test('the home page has a short intro without "software"', async ({ page }) => {
	await page.goto('/');
	const intro = (await page.locator('main .intro').innerText()).trim();
	expect(intro.split(/\s+/).length).toBeLessThanOrEqual(60);
	expect(intro.toLowerCase()).not.toContain('software');
	for (const word of ['books', 'stories', 'games', 'apps']) expect(intro).toContain(word);
});

test('the home page lists the three newest items, each linking to its page', async ({ page }) => {
	await page.goto('/');
	const hrefs = await page
		.locator('main .newest a')
		.evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
	const expected = newestItems(readItems(), 3).map((item) => `/${item.type}/${item.slug}`);
	expect(hrefs).toEqual(expected);
});

test('the main content links to each category', async ({ page }) => {
	await page.goto('/');
	for (const href of ['/books', '/stories', '/games', '/apps']) {
		await expect(page.locator(`main a[href="${href}"]`)).toBeVisible();
	}
});
