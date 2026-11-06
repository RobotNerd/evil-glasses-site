import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

describe('brand files', () => {
	it.each([
		['favicon.png', 32],
		['apple-touch-icon.png', 180]
	])('%s is %i pixels square', async (file, size) => {
		const meta = await sharp(`static/${file}`).metadata();
		expect([meta.width, meta.height]).toEqual([size, size]);
	});

	it('the default share image is 1200x630', async () => {
		const meta = await sharp('static/og-default.png').metadata();
		expect([meta.width, meta.height]).toEqual([1200, 630]);
	});

	it('robots.txt allows all and names the sitemap', () => {
		const robots = readFileSync('static/robots.txt', 'utf8');
		expect(robots).toMatch(/^User-agent: \*$/m);
		expect(robots).toMatch(/^Allow: \/$/m);
		expect(robots).toMatch(/^Sitemap: https:\/\/evilglasses\.com\/sitemap\.xml$/m);
	});
});
