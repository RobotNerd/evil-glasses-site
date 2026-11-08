import { expect, test } from '@playwright/test';

const book = '/books/press-start-for-love';

test('the arrow goes back through the pages of the site and forward returns', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	// A click a quarter of the way in lands inside the Books quadrant, clear of the badge.
	const view = page.viewportSize()!;
	await page.mouse.click(view.width * 0.25, view.height * 0.25);
	await expect(page).toHaveURL(/\/books$/);
	await page.locator(`a[href="${book}"]`).first().click();
	await expect(page).toHaveURL(new RegExp(`${book}$`));

	const back = page.getByRole('link', { name: 'Back', exact: true });
	await back.click();
	await expect(page).toHaveURL(/\/books$/);
	await back.click();
	await expect(page).toHaveURL((url) => url.pathname === '/');
	await page.evaluate(() => history.forward());
	await expect(page).toHaveURL(/\/books$/);
});

test('a book reached from /about goes back to /about', async ({ page }) => {
	await page.goto('/about');
	// Wait for hydration, so the click is handled by the router.
	await page.waitForLoadState('networkidle');
	// /about links to no book, so add a link; the router handles its click like any other.
	await page.evaluate((href) => {
		const link = document.createElement('a');
		link.href = href;
		link.id = 'to-book';
		link.textContent = 'book';
		document.querySelector('main')!.append(link);
	}, book);
	await page.locator('#to-book').click();
	await expect(page).toHaveURL(new RegExp(`${book}$`));
	await page.getByRole('link', { name: 'Back', exact: true }).click();
	await expect(page).toHaveURL(/\/about$/);
});

test('a book opened directly goes to its list', async ({ page }) => {
	await page.goto(book);
	await expect(page.getByRole('link', { name: 'Back', exact: true })).toHaveAttribute(
		'href',
		'/books'
	);
	await page.getByRole('link', { name: 'Back', exact: true }).click();
	await expect(page).toHaveURL(/\/books$/);
});

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('the arrow is a plain link to the parent page', async ({ page }) => {
		await page.goto(book);
		await page.getByRole('link', { name: 'Back', exact: true }).click();
		await expect(page).toHaveURL(/\/books$/);
	});
});
