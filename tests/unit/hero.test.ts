import { describe, expect, it } from 'vitest';
import { pickHero } from '../../src/lib/content/hero';

const item = (slug: string, date: string, hero?: boolean) => ({
	path: `/src/content/books/${slug}/index.md`,
	data: { date, ...(hero === undefined ? {} : { hero }) }
});

describe('pickHero', () => {
	it('picks the flagged item even when it is older', () => {
		const items = [item('new', '2024-01-01'), item('old', '2020-01-01', true)];
		expect(pickHero(items)?.path).toContain('/old/');
	});

	it('picks the newest item when none is flagged', () => {
		const items = [item('old', '2020-01-01'), item('new', '2024-01-01'), item('mid', '2022-01-01')];
		expect(pickHero(items)?.path).toContain('/new/');
	});

	it('ignores hero: false', () => {
		const items = [item('a', '2020-01-01', false), item('b', '2021-01-01')];
		expect(pickHero(items)?.path).toContain('/b/');
	});

	it('returns nothing for an empty type', () => {
		expect(pickHero([])).toBeUndefined();
	});

	it('throws, naming both files, when two items are flagged', () => {
		const items = [item('one', '2020-01-01', true), item('two', '2021-01-01', true)];
		expect(() => pickHero(items)).toThrow('/src/content/books/one/index.md');
		expect(() => pickHero(items)).toThrow('/src/content/books/two/index.md');
	});
});
