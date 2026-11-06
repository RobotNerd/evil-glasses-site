import { expect, test } from '@playwright/test';
import oldUrls from '../fixtures/old-urls.json' with { type: 'json' };

for (const [oldPath, newPath] of Object.entries(oldUrls)) {
	test(`${oldPath} ends on ${newPath}`, async ({ page }) => {
		// A browser sends the path URL-encoded.
		await page.goto(encodeURI(oldPath));
		await page.waitForURL((url) => url.pathname + url.hash === newPath);
		await expect(page.locator('h1')).toBeVisible();
		const hash = newPath.split('#')[1];
		if (hash) await expect(page.locator(`#${hash}`)).toBeInViewport();
	});
}
