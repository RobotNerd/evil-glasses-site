import { describe, expect, it } from 'vitest';
import { nextStory, type Edition, type Story } from '../../src/lib/content/stories';

const edition = (number: number) => ({ data: { number } }) as unknown as Edition;
const editions = [edition(2), edition(1)];
const story = (slug: string, number: number): Story =>
	({ slug, edition: editions.find((e) => e.data.number === number) }) as unknown as Story;

// The order loadStories returns: newest edition first, then `order`.
const stories = [story('c', 2), story('d', 2), story('a', 1), story('b', 1), story('z', 1)];

describe('nextStory', () => {
	it('is the next story in the same edition', () => {
		expect(nextStory(stories, stories[2])?.slug).toBe('b');
		expect(nextStory(stories, stories[0])?.slug).toBe('d');
	});

	it("is the first story of the next edition after an edition's last story", () => {
		expect(nextStory(stories, stories[4])?.slug).toBe('c');
	});

	it("is none after the newest edition's last story", () => {
		expect(nextStory(stories, stories[1])).toBeUndefined();
	});
});
