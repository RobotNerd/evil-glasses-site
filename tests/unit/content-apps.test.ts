import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateEntry } from '../../src/lib/content/loader';

const dir = 'src/content/apps/what-size-will-they-be';

const app = (overrides: Record<string, string> = {}, omit?: string) => {
	const fields: Record<string, string> = {
		title: 'An App',
		author: 'An Author',
		date: '2026-01-01',
		image: 'icon.png',
		synopsis: 'A synopsis.',
		screenshots: '\n  - screenshot-1.png',
		storeLinks: '\n  - store: apple\n    label: Apple\n    url: https://example.com/app',
		privacyPolicy: '/legal/an-app',
		...overrides
	};
	if (omit) delete fields[omit];
	return `---\n${Object.entries(fields)
		.map(([k, v]) => `${k}: ${v}`)
		.join('\n')}\n---\nLong description.`;
};

const path = '/src/content/apps/an-app/index.md';

describe('app validation', () => {
	it('accepts a complete app without a subtitle', () => {
		const entry = validateEntry('apps', { path, source: app() });
		expect(entry.slug).toBe('an-app');
		expect(entry.data.subtitle).toBeUndefined();
	});

	it('names the file and the field when storeLinks is missing', () => {
		expect(() => validateEntry('apps', { path, source: app({}, 'storeLinks') })).toThrow(
			/\/src\/content\/apps\/an-app\/index\.md: field "storeLinks"/
		);
	});

	it('names the file and the field when the title is a number', () => {
		expect(() => validateEntry('apps', { path, source: app({ title: '42' }) })).toThrow(
			/\/src\/content\/apps\/an-app\/index\.md: field "title"/
		);
	});

	it('names the file and the field when the author is missing', () => {
		expect(() => validateEntry('apps', { path, source: app({}, 'author') })).toThrow(
			/field "author"/
		);
	});
});

describe('What Size Will They Be? content', () => {
	const entry = validateEntry('apps', {
		path: `/${dir}/index.md`,
		source: readFileSync(`${dir}/index.md`, 'utf8')
	});

	it('holds the listed title, author, store link and policy path', () => {
		expect(entry.data.title).toBe('What Size Will They Be?');
		expect(entry.data.author).toBe('Sara Lufrano');
		expect(entry.data.storeLinks).toEqual([
			{
				store: 'apple',
				label: 'Apple',
				url: 'https://apps.apple.com/us/app/what-size-will-they-be/id6813648830'
			}
		]);
		expect(entry.data.privacyPolicy).toBe('/legal/what-size-will-they-be');
	});

	it('has an icon and at least two screenshots in the folder', () => {
		const files = readdirSync(dir);
		expect(files).toContain(entry.data.image);
		expect(entry.data.screenshots.length).toBeGreaterThanOrEqual(2);
		for (const name of entry.data.screenshots) expect(files).toContain(name);
	});
});
