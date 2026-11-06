import { expect, test } from '@playwright/test';

test('/games links to Inflation Buster', async ({ page }) => {
	await page.goto('/games');
	const hrefs = await page
		.locator('main ul a')
		.evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
	expect(hrefs).toEqual(['/games/inflation-buster']);
});

test('/games/inflation-buster shows the old content and links', async ({ page }) => {
	await page.goto('/games/inflation-buster');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Inflation Buster');
	await expect(page.getByText('Destroy the economy to save it?', { exact: true })).toBeVisible();

	const paragraphs = [
		'Stop inflation in its tracks in this fast-paced arcade shooter.',
		'INFLATION is out of control! After years of quantitative easing, the Federal Reserve must reverse course. Who would have guessed that pumping free money into the economy would have negative consequences?',
		'It is your job to stop inflation before it gets out of control. How do you do that? Do you address wealth inequality, fix our healthcare system, or build more housing? Nope. You RAISE INTEREST RATES!',
		"How will you know if the plan is working? JOB DESTRUCTION! When regular working Americans don't have money to spend, demand goes down, and so does inflation."
	];
	for (const text of paragraphs) {
		await expect(page.getByText(text, { exact: true })).toBeVisible();
	}

	const storeLinks = page.locator('.stores a');
	await expect(storeLinks).toHaveCount(2);
	await expect(storeLinks.nth(0)).toHaveAttribute(
		'href',
		'https://play.google.com/store/apps/details?id=org.godotengine.inflationbuster&hl=en&gl=US'
	);
	await expect(storeLinks.nth(1)).toHaveAttribute(
		'href',
		'https://apps.apple.com/us/app/inflation-buster/id6449170617'
	);
	await expect(storeLinks.nth(0).locator('img')).toBeVisible();
	await expect(storeLinks.nth(1).locator('img')).toBeVisible();

	await expect(page.locator('img.cover')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
		'href',
		'/legal/inflation-buster'
	);
});
