import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parse } from 'yaml';
import { sourceText } from './checks';

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
