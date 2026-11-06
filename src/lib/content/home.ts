import { loadApps } from './apps';
import { loadBooks } from './books';
import { loadGames } from './games';
import { newestItems, type Newest } from './newest';
import { loadStories } from './stories';

/** The newest `count` items across books, stories, games and apps. */
export function loadNewest(count = 3): Newest[] {
	const all: Newest[] = [
		...loadBooks().map((x) => ({
			type: 'books' as const,
			slug: x.slug,
			title: x.data.title,
			date: x.data.date
		})),
		...loadStories().map((x) => ({
			type: 'stories' as const,
			slug: x.slug,
			title: x.data.title,
			date: x.data.date
		})),
		...loadGames().map((x) => ({
			type: 'games' as const,
			slug: x.slug,
			title: x.data.title,
			date: x.data.date
		})),
		...loadApps().map((x) => ({
			type: 'apps' as const,
			slug: x.slug,
			title: x.data.title,
			date: x.data.date
		}))
	];
	return newestItems(all, count);
}
