import { describe, expect, it } from 'vitest';
import { validateEntry } from '../../src/lib/content/loader';

const game = (omit?: string) => {
	const fields: Record<string, string> = {
		title: 'A Game',
		subtitle: 'A subtitle',
		date: '2023-01-01',
		image: 'image.png',
		synopsis: 'A synopsis.',
		summary: 'A summary.',
		storeLinks: '\n  - store: apple\n    label: Apple\n    url: https://example.com/game',
		privacyPolicy: '/legal/a-game'
	};
	if (omit) delete fields[omit];
	return `---\n${Object.entries(fields)
		.map(([k, v]) => `${k}: ${v}`)
		.join('\n')}\n---\nLong description.`;
};

describe('game validation', () => {
	it('accepts a complete game', () => {
		const entry = validateEntry('games', {
			path: '/src/content/games/a-game/index.md',
			source: game()
		});
		expect(entry.slug).toBe('a-game');
		expect(entry.html).toContain('Long description.');
	});

	it('names the file and the field when storeLinks is missing', () => {
		expect(() =>
			validateEntry('games', {
				path: '/src/content/games/a-game/index.md',
				source: game('storeLinks')
			})
		).toThrow(/\/src\/content\/games\/a-game\/index\.md: field "storeLinks"/);
	});
});

describe('legal validation', () => {
	const legal = (updated: string) =>
		`---\ntitle: A Policy\napp: A Game\nupdated: ${updated}\n---\nText.`;

	it('accepts a complete policy', () => {
		const entry = validateEntry('legal', {
			path: '/src/content/legal/a-game/index.md',
			source: legal('2023-11-29')
		});
		expect(entry.data.app).toBe('A Game');
	});

	it('names the file and the field when updated is not a date', () => {
		expect(() =>
			validateEntry('legal', {
				path: '/src/content/legal/a-game/index.md',
				source: legal('true')
			})
		).toThrow(/\/src\/content\/legal\/a-game\/index\.md: field "updated"/);
	});
});
