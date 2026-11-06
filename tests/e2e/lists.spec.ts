import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parse } from 'yaml';
import { sourceText } from './checks';

const lists = ['/books', '/games', '/apps'];

for (const path of lists) {
	test(`${path} shows two columns on a phone, each item with a title and subtitle`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(path);
		const items = page.locator('.cover-grid li');
		const count = await items.count();
		expect(count).toBeGreaterThan(0);
		const tops = await items.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
		const inFirstRow = tops.filter((top) => top === tops[0]).length;
		expect(inFirstRow).toBe(Math.min(2, count));
		for (const item of await items.all()) {
			await expect(item.locator('.title')).not.toBeEmpty();
		}
	});

	test(`${path} fits items of 180 to 240 px on a wide screen`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(path);
		const widths = await page
			.locator('.cover-grid li')
			.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
		for (const width of widths) {
			expect(width).toBeGreaterThanOrEqual(180);
			expect(width).toBeLessThanOrEqual(240);
		}
		const column = await page.locator('main').evaluate((el) => el.getBoundingClientRect().width);
		expect(column).toBeLessThanOrEqual(960);
		if (path !== '/apps') {
			expect(await page.locator('.cover-grid .subtitle').count()).toBeGreaterThan(0);
		}
	});

	test(`${path} gives each cover a view-transition-name`, async ({ page }) => {
		await page.goto(path);
		const names = await page
			.locator('.cover-grid img')
			.evaluateAll((imgs) => imgs.map((img) => getComputedStyle(img).viewTransitionName));
		for (const name of names) expect(name).toMatch(/^cover-[a-z0-9-]+$/);
	});
}

test('/apps shows each icon square with rounded corners', async ({ page }) => {
	await page.goto('/apps');
	for (const icon of await page.locator('.cover-grid img').all()) {
		const box = await icon.boundingBox();
		expect(box?.width).toBeCloseTo(box?.height ?? -1, 0);
		const radius = await icon.evaluate((img) => parseFloat(getComputedStyle(img).borderRadius));
		expect(radius).toBeGreaterThan(0);
	}
});

/** The editions' numbers, newest first, read from the content. */
function editionNumbers(): number[] {
	const root = 'src/content/editions';
	return readdirSync(root)
		.map((slug) => parse(readFileSync(`${root}/${slug}/index.md`, 'utf8').split('---\n')[1]).number)
		.sort((a: number, b: number) => b - a);
}

test('/stories groups stories under a heading per edition, newest first', async ({ page }) => {
	await page.goto('/stories');
	const groups = page.locator('main section[id^="edition-"]');
	const numbers = editionNumbers();
	await expect(groups).toHaveCount(numbers.length);
	const headings = page.locator('main section h2');
	for (const heading of await headings.all()) {
		expect(await sourceText(heading)).toMatch(/^Edition \d+ · [A-Z][a-z]+ \d{4}$/);
	}
	const first = await groups.first().evaluate((el) => el.id);
	expect(first).toBe(`edition-${String(numbers[0]).padStart(2, '0')}`);
	for (const section of await groups.all()) {
		await expect(section.locator('img.cover')).toBeVisible();
		for (const row of await section.locator('li').all()) {
			await expect(row.locator('> a')).not.toBeEmpty();
			await expect(row.locator('.author')).not.toBeEmpty();
			await expect(row.locator('.synopsis')).not.toBeEmpty();
		}
	}
});
