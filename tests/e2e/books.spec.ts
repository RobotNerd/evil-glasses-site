import { expect, test } from '@playwright/test';

const books = [
	{
		slug: 'mixed-martial-hearts',
		title: 'Mixed Martial Hearts',
		subtitle: 'A tale of love and MMA',
		synopsis: "Emily and Matt were college lovers. After Matt's bad choices",
		bio: "Mixed Martial Hearts is Sara Rogers' freshmen publication.",
		links: [
			['Paperback', 'https://www.amazon.com/Mixed-Martial-Hearts-Sara-Rogers/dp/B0BF31V262/'],
			[
				'Kindle eBook',
				'https://www.amazon.com/Mixed-Martial-Hearts-Sara-Rogers-ebook/dp/B0BF93GZX4/'
			],
			['Smashwords eBook', 'https://www.smashwords.com/books/view/1165784']
		]
	},
	{
		slug: 'press-start-for-love',
		title: 'Press Start for Love',
		subtitle: 'Gaming for the Heart',
		synopsis: "Anna Brier doesn't think esports is a sport",
		bio: 'Sara Rogers lives in Seattle, Washington with her family and adopted pets.',
		links: [
			['Paperback', 'https://www.amazon.com/dp/B0CJDDKSS4/'],
			['Kindle eBook', 'https://www.amazon.com/Press-Start-Love-Sara-Rogers-ebook/dp/B0CJD99KVP/'],
			['Smashwords eBook', 'https://www.smashwords.com/books/view/1451808']
		]
	}
];

test('/books lists the newest book first', async ({ page }) => {
	await page.goto('/books');
	const hrefs = await page
		.locator('main ul a')
		.evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
	expect(hrefs).toEqual(['/books/press-start-for-love', '/books/mixed-martial-hearts']);
});

for (const book of books) {
	test(`/books/${book.slug} shows every field`, async ({ page }) => {
		await page.goto(`/books/${book.slug}`);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(book.title);
		await expect(page.getByText(book.subtitle, { exact: true })).toBeVisible();
		await expect(page.getByText(book.synopsis)).toBeVisible();
		await expect(page.getByText(book.bio)).toBeVisible();
		await expect(page.getByText('By Sara Rogers')).toBeVisible();
		await expect(page.locator('main')).toContainText('Sara Rogers');

		const storeLinks = page.locator('.stores a');
		await expect(storeLinks).toHaveCount(3);
		for (const [i, [name, url]] of book.links.entries()) {
			const link = storeLinks.nth(i);
			await expect(link).toHaveAccessibleName(name);
			expect(await link.getAttribute('href')).toContain(url);
			await expect(link.locator('img')).toBeVisible();
		}

		const cover = page.locator('img.cover');
		await expect(cover).toBeVisible();
		const src = await cover.evaluate((img: HTMLImageElement) => img.currentSrc);
		expect(src).toMatch(/\.(avif|webp)$/);
	});
}
