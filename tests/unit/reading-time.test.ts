import { describe, expect, it } from 'vitest';
import { readingMinutes } from '../../src/lib/content/reading-time';

const words = (n: number) => Array.from({ length: n }, () => 'word').join(' ');

describe('readingMinutes', () => {
	it.each([
		[1, 1],
		[230, 1],
		[231, 2],
		[4600, 20]
	])('%i words take %i minutes', (count, minutes) => {
		expect(readingMinutes(words(count))).toBe(minutes);
	});

	it('does not count HTML tags as words', () => {
		expect(readingMinutes(`<p>${words(230)}</p>\n<p><em>${words(1)}</em></p>`)).toBe(2);
		expect(readingMinutes('<p class="a b c">one</p>')).toBe(1);
	});
});
