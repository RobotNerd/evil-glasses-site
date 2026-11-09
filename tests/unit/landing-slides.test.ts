import { describe, expect, it } from 'vitest';
import { listSlides } from '../../src/lib/content/landing';

const entry = (type: string, slug: string, date: string, extra = {}) => ({
	slug,
	path: `/src/content/${type}/${slug}/index.md`,
	html: '',
	data: { title: slug, date, summary: `About ${slug}`, cover: 'c.jpg', image: 'i.jpg', ...extra }
});

describe('listSlides', () => {
	it('lists one slide per item of every type, newest first', () => {
		const slides = listSlides(
			{
				books: [entry('books', 'book', '2020-01-01')],
				stories: [
					{
						...entry('stories', 'story', '2022-01-01'),
						edition: entry('editions', 'edition-01', '2022-01-01', { cover: 'e.jpg' })
					}
				],
				games: [entry('games', 'game', '2021-01-01')],
				apps: [entry('apps', 'app', '2023-01-01', { screenshots: ['s.png'] })]
			} as never,
			(path, name) => `${path}#${name}` as never
		);
		expect(slides.map((s) => s.href)).toEqual([
			'/apps/app',
			'/stories/story',
			'/games/game',
			'/books/book'
		]);
		expect(slides[0]).toMatchObject({ title: 'app', date: '2023-01-01', summary: 'About app' });
		expect(slides.map((s) => s.category)).toEqual(['App', 'Short story', 'Game', 'Book']);
	});
});
