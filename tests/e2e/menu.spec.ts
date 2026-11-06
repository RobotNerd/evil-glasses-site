import { expect, test } from '@playwright/test';

test('phone: header links are hidden until the menu button is pressed', async ({ page }, info) => {
	test.skip(info.project.name !== 'phone', 'the menu only collapses at phone size');
	await page.goto('/');
	const books = page.locator('header').getByRole('link', { name: 'Books' });
	await expect(books).toBeHidden();
	await page.getByRole('button', { name: 'Menu' }).click();
	await expect(books).toBeVisible();
});

test('desktop: header links are visible without the menu', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop', 'desktop only');
	await page.goto('/');
	await expect(page.locator('header').getByRole('link', { name: 'Books' })).toBeVisible();
});
