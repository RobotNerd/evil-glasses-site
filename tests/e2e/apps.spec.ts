import { expect, test } from '@playwright/test';

test('the header links to /apps after /games', async ({ page }) => {
	await page.goto('/');
	const hrefs = await page
		.locator('header nav a')
		.evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
	expect(hrefs.indexOf('/apps')).toBe(hrefs.indexOf('/games') + 1);
});

test('/apps lists the app with its icon and title', async ({ page }) => {
	await page.goto('/apps');
	const link = page.locator('main ul a');
	await expect(link).toHaveCount(1);
	await expect(link).toHaveAttribute('href', '/apps/what-size-will-they-be');
	await expect(link).toContainText('What Size Will They Be?');
	await expect(link.locator('img')).toBeVisible();
});

test('/apps/what-size-will-they-be shows every field', async ({ page }) => {
	await page.goto('/apps/what-size-will-they-be');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('What Size Will They Be?');
	await expect(page.getByText('By Sara Lufrano', { exact: true })).toBeVisible();
	await expect(
		page.getByText("Buying clothes for later shouldn't require baby math.", { exact: true })
	).toBeVisible();
	await expect(page.locator('img.cover')).toBeVisible();

	const screenshots = page.locator('.screenshots img');
	await expect(screenshots).toHaveCount(3);
	for (const image of await screenshots.all()) {
		await expect(image).toBeVisible();
		expect(await image.getAttribute('alt')).toBeTruthy();
	}

	const store = page.locator('.stores a');
	await expect(store).toHaveCount(1);
	await expect(store).toHaveAttribute(
		'href',
		'https://apps.apple.com/us/app/what-size-will-they-be/id6813648830'
	);
	await expect(store.locator('img')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
		'href',
		'/legal/what-size-will-they-be'
	);
});
