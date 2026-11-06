import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import oldUrls from '../fixtures/old-urls.json';
import { redirects } from '../../src/lib/content/redirects';

describe('redirect pages in build/', () => {
	it('matches the fixture', () => {
		expect(redirects).toEqual(oldUrls);
	});

	for (const [oldPath, newPath] of Object.entries(oldUrls)) {
		it(`${oldPath} has noindex, a canonical link and an anchor`, () => {
			const html = readFileSync(`build${oldPath}.html`, 'utf8');
			expect(html).toMatch(/<meta name="robots" content="noindex"/);
			expect(html).toContain(`<link rel="canonical" href="https://evilglasses.com${newPath}"`);
			expect(html).toContain(`<a href="${newPath}"`);
		});
	}
});
