import { expect, test } from '@playwright/test';

const pages = [
	{ name: 'landing', path: '/' },
	{ name: 'books', path: '/books' },
	{ name: 'book', path: '/books/mixed-martial-hearts' },
	{ name: 'story', path: '/stories/a-hot-week-in-august' }
];
const schemes = ['light', 'dark'] as const;
const sizes = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 900 }
];

for (const size of sizes) {
	for (const scheme of schemes) {
		test.describe(`${scheme} at ${size.name} size`, () => {
			test.use({
				viewport: { width: size.width, height: size.height },
				colorScheme: scheme,
				reducedMotion: 'reduce'
			});

			for (const { name, path } of pages) {
				test(`${name} page`, async ({ page }) => {
					// The pointer is never moved, so no hover or glow state is captured.
					await page.goto(path);
					// Load every lazy image, then wait for the fonts.
					await page.evaluate(async () => {
						for (const img of document.querySelectorAll('img[loading="lazy"]')) {
							img.setAttribute('loading', 'eager');
						}
						await Promise.all(
							[...document.images].map((img) => img.decode().catch(() => undefined))
						);
						await document.fonts.ready;
					});
					await expect(page).toHaveScreenshot(`${name}-${scheme}-${size.name}.png`, {
						fullPage: true
					});
				});
			}
		});
	}
}
