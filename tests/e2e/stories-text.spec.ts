import { readdirSync, readFileSync } from 'node:fs';
import { sourceText } from './checks';
import { expect, test } from '@playwright/test';

type Fixture = {
	slug: string;
	title: string;
	author: string;
	text: string;
	bold: string[];
	italic: string[];
};

const dir = 'tests/fixtures/stories';
const fixtures: Fixture[] = readdirSync(dir)
	.filter((name) => name.endsWith('.json'))
	.map((name) => JSON.parse(readFileSync(`${dir}/${name}`, 'utf8')));

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

test('there is a fixture for each of the 29 stories', () => {
	expect(fixtures).toHaveLength(29);
});

for (const fixture of fixtures) {
	test(`/stories/${fixture.slug} text matches the old page`, async ({ page }) => {
		await page.goto(`/stories/${fixture.slug}`);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(fixture.title);
		await expect(page.getByText(`By ${fixture.author}`)).toBeVisible();

		const story = page.locator('.story');
		expect(normalize(await sourceText(story))).toBe(fixture.text);

		const texts = (selector: string) =>
			story.locator(selector).evaluateAll((els) => els.map((el) => el.textContent ?? ''));
		expect((await texts('strong')).map(normalize)).toEqual(fixture.bold);
		expect((await texts('em')).map(normalize)).toEqual(fixture.italic);
	});
}

test('no PDF files ship in static/ or build/', () => {
	const found: string[] = [];
	const visit = (path: string) => {
		for (const entry of readdirSync(path, { withFileTypes: true })) {
			const full = `${path}/${entry.name}`;
			if (entry.isDirectory()) visit(full);
			else if (entry.name.toLowerCase().endsWith('.pdf')) found.push(full);
		}
	};
	visit('static');
	visit('build');
	expect(found).toEqual([]);
});
