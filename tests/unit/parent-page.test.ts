import { describe, expect, it } from 'vitest';
import { parentPage } from '../../src/lib/components/parent-page';

describe('parentPage', () => {
	it.each([
		['/books/press-start-for-love', '/books'],
		['/stories/the-lava-farmer', '/stories'],
		['/books', '/'],
		['/about', '/'],
		['/books/', '/'],
		['/books/press-start-for-love/', '/books'],
		['/legal', '/']
	])('%s has the parent %s', (path, parent) => {
		expect(parentPage(path)).toBe(parent);
	});
});
