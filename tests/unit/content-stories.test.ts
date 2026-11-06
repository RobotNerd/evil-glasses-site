import { describe, expect, it } from 'vitest';
import { validateEntry } from '../../src/lib/content/loader';
import { attachEditions, groupByEdition, type Edition } from '../../src/lib/content/stories';

const storyPath = '/src/content/stories/a-story/index.md';
const editionPath = '/src/content/editions/edition-01/index.md';

const source = (fields: Record<string, string | null>) =>
	`---\n${Object.entries(fields)
		.filter(([, value]) => value !== null)
		.map(([key, value]) => `${key}: ${value}`)
		.join('\n')}\n---\n\nThe *text*.\n`;

const storyFields = (overrides: Record<string, string | null> = {}) => ({
	title: 'A Story',
	author: 'Sara Rogers',
	date: '2015-07-01',
	edition: '1',
	synopsis: 'A synopsis.',
	...overrides
});

const editionFields = (overrides: Record<string, string | null> = {}) => ({
	number: '1',
	date: '2015-07-01',
	cover: 'cover.png',
	...overrides
});

const edition = (number: number, date: string): Edition => ({
	...validateEntry('editions', {
		path: `/src/content/editions/edition-${number}/index.md`,
		source: source(editionFields({ number: String(number), date }))
	}),
	cover: {} as Edition['cover']
});

describe('story validation', () => {
	it('accepts a complete story and renders the body', () => {
		const entry = validateEntry('stories', { path: storyPath, source: source(storyFields()) });
		expect(entry.slug).toBe('a-story');
		expect(entry.data.edition).toBe(1);
		expect(entry.html).toContain('<em>text</em>');
	});

	it('names the file and the field when author is missing', () => {
		expect(() =>
			validateEntry('stories', { path: storyPath, source: source(storyFields({ author: null })) })
		).toThrow(/\/src\/content\/stories\/a-story\/index\.md: field "author"/);
	});

	it('names the file and the field when edition is not a number', () => {
		expect(() =>
			validateEntry('stories', {
				path: storyPath,
				source: source(storyFields({ edition: '"one"' }))
			})
		).toThrow(/\/src\/content\/stories\/a-story\/index\.md: field "edition"/);
	});
});

describe('edition validation', () => {
	it('accepts a complete edition', () => {
		const entry = validateEntry('editions', {
			path: editionPath,
			source: source(editionFields())
		});
		expect(entry.data.number).toBe(1);
	});

	it('names the file and the field when number is a string', () => {
		expect(() =>
			validateEntry('editions', {
				path: editionPath,
				source: source(editionFields({ number: '"x"' }))
			})
		).toThrow(/\/src\/content\/editions\/edition-01\/index\.md: field "number"/);
	});

	it('names the file and the field when cover is missing', () => {
		expect(() =>
			validateEntry('editions', {
				path: editionPath,
				source: source(editionFields({ cover: null }))
			})
		).toThrow(/edition-01\/index\.md: field "cover"/);
	});
});

describe('attachEditions and groupByEdition', () => {
	const story = (slug: string, editionNumber: number) =>
		validateEntry('stories', {
			path: `/src/content/stories/${slug}/index.md`,
			source: source(storyFields({ title: slug, edition: String(editionNumber) }))
		});

	it('names the story and the edition when the edition does not exist', () => {
		expect(() => attachEditions([story('a-story', 99)], [edition(1, '2015-07-01')])).toThrow(
			/a-story\/index\.md: field "edition": story "a-story" names edition 99, but there is no edition 99/
		);
	});

	it('groups stories by edition, newest edition first', () => {
		const editions = [edition(1, '2015-07-01'), edition(2, '2015-10-01')];
		const stories = attachEditions([story('a', 1), story('b', 2), story('c', 1)], editions);
		const groups = groupByEdition(stories);
		expect(groups.map((g) => g.edition.data.number)).toEqual([2, 1]);
		expect(groups[1].stories.map((s) => s.slug)).toEqual(['a', 'c']);
	});
});
