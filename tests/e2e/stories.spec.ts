import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parse } from 'yaml';

type Story = { slug: string; title: string; edition: number; order: number };

/** Reads every story's frontmatter from src/content/stories, so the test follows the content. */
function readStories(): Story[] {
	const root = 'src/content/stories';
	return readdirSync(root).map((slug) => {
		const source = readFileSync(`${root}/${slug}/index.md`, 'utf8');
		const data = parse(source.split('---\n')[1]);
		return { slug, title: data.title, edition: data.edition, order: data.order ?? Infinity };
	});
}

test('/stories lists every story in its edition group, newest edition first', async ({ page }) => {
	const stories = readStories();
	const numbers = [...new Set(stories.map((s) => s.edition))].sort((a, b) => b - a);
	await page.goto('/stories');
	const ids = await page
		.locator('main section[id^="edition-"]')
		.evaluateAll((sections) => sections.map((s) => s.id));
	expect(ids).toEqual(numbers.map((n) => `edition-${String(n).padStart(2, '0')}`));
	await expect(page.locator('main section a[href^="/stories/"]')).toHaveCount(stories.length);
	for (const number of numbers) {
		const expected = stories
			.filter((s) => s.edition === number)
			.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
		const group = page.locator(`#edition-${String(number).padStart(2, '0')} li > a`);
		await expect(group).toHaveText(expected.map((s) => s.title));
		const hrefs = await group.evaluateAll((links) => links.map((a) => a.getAttribute('href')));
		expect(hrefs).toEqual(expected.map((s) => `/stories/${s.slug}`));
	}
	const first = page.locator('#edition-01 a');
	await expect(first.first()).toHaveAttribute('href', '/stories/the-lava-farmer');
});

const stories = [
	{
		slug: 'the-bad-comic-episode-2',
		title: 'The Bad Comic, Episode 2',
		author: 'Sara Lufrano',
		edition: 'Edition 9'
	},
	{
		slug: '12th-ave-north-unit-m',
		title: '12th Ave North, Unit M',
		author: 'Sara Lufrano',
		edition: 'Edition 8'
	}
];

for (const story of stories) {
	test(`/stories/${story.slug} shows its parts`, async ({ page }) => {
		const response = await page.goto(`/stories/${story.slug}`);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(story.title);
		await expect(page.locator('.meta')).toContainText(`By ${story.author}`);
		await expect(page.locator('.meta')).toContainText(story.edition);
		const cover = page.locator('img.cover');
		await expect(cover).toBeVisible();
		expect(await cover.getAttribute('alt')).toBeTruthy();
		await expect(page.locator('.story p').first()).toBeVisible();
	});
}

test('the edition link on a story returns to its group', async ({ page }) => {
	await page.goto('/stories/the-lava-farmer');
	await expect(page.locator('.meta a')).toHaveAttribute('href', '/stories#edition-01');
});

// The order the old site listed each edition's stories in.
const oldOrder: Record<number, string[]> = {
	1: ['The Lava Farmer', 'Anorexia'],
	2: ['Plane Jumper', 'Sharkrilla'],
	3: ['EOW Insurance', 'Elevator to the Moon', 'Cloned'],
	4: ['Fishing Trip', 'Call'],
	5: ['Capital Hill', 'Sleeping Gods'],
	6: ['Crimes Against Silicon', 'The Bad Comic'],
	7: ["Captain's Log", 'Miss Conception'],
	8: ['Crowds', '12th Ave North, Unit M'],
	9: ['The Bad Comic, Episode 2', 'Night of the Cat'],
	10: ['Transformations', 'Moment in Time'],
	11: ['Glasswood Chest', 'Memories of the End'],
	12: ['Prostitute', 'A Hot Week in August'],
	13: ['I Died', 'No Kill Shelter'],
	14: ['Advertisment Help!', 'Two']
};

test('/stories keeps the old order of stories within each edition', async ({ page }) => {
	await page.goto('/stories');
	for (const [number, titles] of Object.entries(oldOrder)) {
		const id = `edition-${number.padStart(2, '0')}`;
		await expect(page.locator(`#${id} li > a`)).toHaveText(titles);
	}
});
