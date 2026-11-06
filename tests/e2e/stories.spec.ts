import { expect, test } from '@playwright/test';

test('/stories lists 29 stories in 14 groups, newest edition first', async ({ page }) => {
	await page.goto('/stories');
	const ids = await page
		.locator('main section[id^="edition-"]')
		.evaluateAll((sections) => sections.map((s) => s.id));
	expect(ids).toEqual(
		Array.from({ length: 14 }, (_, i) => `edition-${String(14 - i).padStart(2, '0')}`)
	);
	await expect(page.locator('main section a[href^="/stories/"]')).toHaveCount(29);
	const first = page.locator('#edition-01 a');
	await expect(first).toHaveCount(2);
	await expect(first.first()).toHaveAttribute('href', '/stories/anorexia');
});

const stories = [
	{
		slug: 'the-bad-comic-episode-2',
		title: 'The Bad Comic, Episode 2',
		author: 'Sara Rogers',
		edition: 'Edition 9',
		date: 'July 1, 2017'
	},
	{
		slug: '12th-ave-north-unit-m',
		title: '12th Ave North, Unit M',
		author: 'Sara Rogers',
		edition: 'Edition 8',
		date: 'April 1, 2017'
	}
];

for (const story of stories) {
	test(`/stories/${story.slug} shows its parts`, async ({ page }) => {
		const response = await page.goto(`/stories/${story.slug}`);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(story.title);
		await expect(page.getByText(`By ${story.author}`)).toBeVisible();
		await expect(page.locator('.edition')).toContainText(story.edition);
		await expect(page.locator('.edition')).toContainText(story.date);
		const cover = page.locator('img.cover');
		await expect(cover).toBeVisible();
		expect(await cover.getAttribute('alt')).toBeTruthy();
		await expect(page.locator('.story p').first()).toBeVisible();
	});
}

test('the edition link on a story returns to its group', async ({ page }) => {
	await page.goto('/stories/anorexia');
	await expect(page.locator('.edition a')).toHaveAttribute('href', '/stories#edition-01');
});
