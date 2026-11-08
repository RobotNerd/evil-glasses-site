import { describe, expect, it } from 'vitest';
import { newestFirst, validateEntry } from '../../src/lib/content/loader';

const frontmatter = (overrides: Record<string, string | null> = {}) => {
	const fields: Record<string, string | null> = {
		title: 'A Book',
		subtitle: 'A subtitle',
		author: 'Sara Rogers',
		date: '2022-01-01',
		cover: 'cover.jpg',
		synopsis: 'A synopsis.',
		summary: 'A summary.',
		authorBio: 'A bio.',
		storeLinks: '\n  - store: amazon\n    label: Paperback\n    url: https://example.com/book',
		...overrides
	};
	const lines = Object.entries(fields)
		.filter(([, value]) => value !== null)
		.map(([key, value]) => `${key}: ${value}`);
	return `---\n${lines.join('\n')}\n---\n`;
};

const path = (slug: string) => `/src/content/books/${slug}/index.md`;

describe('book validation', () => {
	it('accepts a complete book and renders the body', () => {
		const entry = validateEntry('books', {
			path: path('a-book'),
			source: frontmatter() + '\nExtra *text*.'
		});
		expect(entry.slug).toBe('a-book');
		expect(entry.data.title).toBe('A Book');
		expect(entry.html).toContain('<em>text</em>');
	});

	it('names the file and the field when synopsis is missing', () => {
		expect(() =>
			validateEntry('books', { path: path('a-book'), source: frontmatter({ synopsis: null }) })
		).toThrow(/\/src\/content\/books\/a-book\/index\.md: field "synopsis"/);
	});

	it('names the file and the field when date has the wrong type', () => {
		expect(() =>
			validateEntry('books', { path: path('a-book'), source: frontmatter({ date: '12' }) })
		).toThrow(/\/src\/content\/books\/a-book\/index\.md: field "date"/);
	});

	it('names the field inside a store link', () => {
		expect(() =>
			validateEntry('books', {
				path: path('a-book'),
				source: frontmatter({
					storeLinks: '\n  - store: amazon\n    label: Paperback\n    url: nope'
				})
			})
		).toThrow(/field "storeLinks\.0\.url"/);
	});

	it('names the folder when the slug is not lowercase words joined by hyphens', () => {
		expect(() => validateEntry('books', { path: path('Bad_Slug'), source: frontmatter() })).toThrow(
			/\/src\/content\/books\/Bad_Slug\/index\.md: folder name "Bad_Slug" must be lowercase/
		);
	});
});

describe('newestFirst', () => {
	it('sorts by date, newest first, without changing the input', () => {
		const items = [
			{ data: { date: '2022-01-01' } },
			{ data: { date: '2024-06-01' } },
			{ data: { date: '2023-01-01' } }
		];
		expect(newestFirst(items).map((i) => i.data.date)).toEqual([
			'2024-06-01',
			'2023-01-01',
			'2022-01-01'
		]);
		expect(items[0].data.date).toBe('2022-01-01');
	});
});
