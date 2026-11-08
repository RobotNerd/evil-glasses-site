import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateEntry } from '../../src/lib/content/loader';

const base: Record<string, Record<string, string>> = {
	books: {
		title: 'A Book',
		subtitle: 'A subtitle',
		author: 'Sara Rogers',
		date: '2022-01-01',
		cover: 'cover.jpg',
		synopsis: 'A synopsis.',
		authorBio: 'A bio.',
		storeLinks: '\n  - store: amazon\n    label: Paperback\n    url: https://example.com/x'
	},
	games: {
		title: 'A Game',
		subtitle: 'A subtitle',
		date: '2023-01-01',
		image: 'image.png',
		synopsis: 'A synopsis.',
		storeLinks: '\n  - store: apple\n    label: Apple\n    url: https://example.com/x',
		privacyPolicy: '/legal/a-game'
	},
	apps: {
		title: 'An App',
		author: 'An Author',
		date: '2026-01-01',
		image: 'icon.png',
		synopsis: 'A synopsis.',
		screenshots: '\n  - screenshot-1.png',
		storeLinks: '\n  - store: apple\n    label: Apple\n    url: https://example.com/x',
		privacyPolicy: '/legal/an-app'
	},
	stories: {
		title: 'A Story',
		author: 'Sara Lufrano',
		date: '2015-07-01',
		edition: '1',
		synopsis: 'A synopsis.'
	}
};

const types = ['books', 'games', 'apps', 'stories'] as const;

const entry = (type: (typeof types)[number], summary: string | null) => {
	const fields = { ...base[type], ...(summary === null ? {} : { summary }) };
	const lines = Object.entries(fields).map(([k, v]) => `${k}: ${v}`);
	return {
		path: `/src/content/${type}/an-entry/index.md`,
		source: `---\n${lines.join('\n')}\n---\nText.`
	};
};

describe.each(types)('%s summary validation', (type) => {
	const named = new RegExp(`/src/content/${type}/an-entry/index\\.md: field "summary"`);

	it('accepts a summary', () => {
		expect(validateEntry(type, entry(type, 'A hero wants a thing.')).data).toMatchObject({
			summary: 'A hero wants a thing.'
		});
	});

	it('names the file and the field when summary is missing', () => {
		expect(() => validateEntry(type, entry(type, null))).toThrow(named);
	});

	it('names the file and the field when summary is empty', () => {
		expect(() => validateEntry(type, entry(type, "''"))).toThrow(named);
	});

	it('names the file and the field when summary is over 200 characters', () => {
		expect(() => validateEntry(type, entry(type, `'${'a'.repeat(200)}.'`))).toThrow(named);
	});
});

describe('summaries in src/content', () => {
	for (const type of types) {
		for (const slug of readdirSync(`src/content/${type}`)) {
			it(`${type}/${slug} has one sentence ending in a period`, () => {
				const path = `/src/content/${type}/${slug}/index.md`;
				const { summary } = validateEntry(type, {
					path,
					source: readFileSync(`.${path}`, 'utf8')
				}).data;
				expect(summary.endsWith('.')).toBe(true);
				expect(summary).not.toContain('. ');
			});
		}
	}
});
