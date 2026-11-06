import { expect, test } from '@playwright/test';

test('a story page shows the cover, the title and the meta line', async ({ page }) => {
	await page.goto('/stories/the-lava-farmer');
	await expect(page.locator('img.cover')).toBeVisible();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Lava Farmer');
	await expect(page.locator('.meta')).toHaveText(/Sara Rogers · Edition 1 · \d+ min read/);
});

test('the story body is set like a book page', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/stories/the-lava-farmer');
	await page.evaluate(() => document.fonts.ready);
	const body = await page.locator('.story').evaluate((el) => {
		const style = getComputedStyle(el);
		const probe = document.createElement('span');
		probe.textContent = '0';
		probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
		el.append(probe);
		const zero = probe.getBoundingClientRect().width;
		probe.remove();
		const paragraphs = [...el.querySelectorAll(':scope > p')].map((p) => {
			const s = getComputedStyle(p);
			return { indent: s.textIndent, top: s.marginTop, bottom: s.marginBottom };
		});
		return {
			family: style.fontFamily,
			size: parseFloat(style.fontSize),
			measure: el.getBoundingClientRect().width / zero,
			paragraphs
		};
	});
	expect(body.family).toMatch(/^"?Literata/);
	expect(body.size).toBeGreaterThanOrEqual(17);
	expect(body.size).toBeLessThanOrEqual(19);
	expect(body.measure).toBeGreaterThanOrEqual(60);
	expect(body.measure).toBeLessThanOrEqual(70);
	expect(body.paragraphs.length).toBeGreaterThan(1);
	body.paragraphs.forEach((p, i) => {
		expect(p.top).toBe('0px');
		expect(p.bottom).toBe('0px');
		if (i > 0) expect(parseFloat(p.indent)).toBeGreaterThan(0);
	});
});

test('the next story link follows the edition order', async ({ page }) => {
	await page.goto('/stories/the-lava-farmer');
	await expect(page.getByRole('link', { name: /^Next story/ })).toHaveAttribute(
		'href',
		'/stories/anorexia'
	);
	await page.goto('/stories/anorexia');
	await expect(page.getByRole('link', { name: /^Next story/ })).toHaveAttribute(
		'href',
		'/stories/plane-jumper'
	);
	await page.goto('/stories/two');
	await expect(page.getByRole('link', { name: /^Next story/ })).toHaveCount(0);
});
