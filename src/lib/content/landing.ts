import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { loadApps, type App } from './apps';
import { loadBooks, type Book } from './books';
import { loadGames, type Game } from './games';
import { loadStories, type Story } from './stories';

type Image = EnhancedImgAttributes['src'];

export type Section = { href: string; title: string };

export type Slide = {
	/** The item's page. */
	href: string;
	title: string;
	/** `YYYY-MM-DD`. */
	date: string;
	summary: string;
	image: Image;
};

/** The four landing sections in tab order: books, stories, games, apps. */
export const sections: Section[] = [
	{ href: '/books', title: 'Books' },
	{ href: '/stories', title: 'Stories' },
	{ href: '/games', title: 'Games' },
	{ href: '/apps', title: 'Apps' }
];

// The slide shows its image at part of the screen, so the landing page uses small widths of its
// own rather than the full-size images the detail pages use.
const small = import.meta.glob('/src/content/{books,editions,games,apps}/*/*.{jpg,jpeg,png}', {
	query: { enhanced: true, w: '320;480;640' },
	import: 'default',
	eager: true
}) as Record<string, Image>;

function findImage(indexPath: string, name: string): Image {
	const image = small[indexPath.replace(/index\.md$/, name)];
	if (!image) throw new Error(`${indexPath}: no image file named "${name}" in the folder`);
	return image;
}

/** One slide per book, story, game and app, newest first. The sort is stable, so ties keep the input order. */
export function listSlides(
	items: { books: Book[]; stories: Story[]; games: Game[]; apps: App[] },
	inFolder: (indexPath: string, name: string) => Image = findImage
): Slide[] {
	const slides: Slide[] = [
		...items.books.map((b) => ({
			href: `/books/${b.slug}`,
			title: b.data.title,
			date: b.data.date,
			summary: b.data.summary,
			image: inFolder(b.path, b.data.cover)
		})),
		...items.stories.map((s) => ({
			href: `/stories/${s.slug}`,
			title: s.data.title,
			date: s.data.date,
			summary: s.data.summary,
			image: inFolder(s.edition.path, s.edition.data.cover)
		})),
		...items.games.map((g) => ({
			href: `/games/${g.slug}`,
			title: g.data.title,
			date: g.data.date,
			summary: g.data.summary,
			image: inFolder(g.path, g.data.image)
		})),
		...items.apps.map((a) => ({
			href: `/apps/${a.slug}`,
			title: a.data.title,
			date: a.data.date,
			summary: a.data.summary,
			image: inFolder(a.path, a.data.screenshots[0])
		}))
	];
	return slides.sort((a, b) => b.date.localeCompare(a.date));
}

export function loadSlides(): Slide[] {
	return listSlides({
		books: loadBooks(),
		stories: loadStories(),
		games: loadGames(),
		apps: loadApps()
	});
}
