import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { loadApps } from './apps';
import { loadBooks } from './books';
import { loadGames } from './games';
import { pickHero } from './hero';
import { loadStories } from './stories';

type Image = EnhancedImgAttributes['src'];

export type Section = {
	href: string;
	title: string;
	/** The hero image, absent when the type has no items. */
	image?: Image;
};

// Each section shows its image at half the screen, so the landing page uses small widths of its
// own rather than the full-size images the detail pages use.
const small = import.meta.glob('/src/content/{books,editions,games,apps}/*/*.{jpg,jpeg,png}', {
	query: { enhanced: true, w: '320;480;640' },
	import: 'default',
	eager: true
}) as Record<string, Image>;

function inFolder(indexPath: string, name: string): Image {
	const image = small[indexPath.replace(/index\.md$/, name)];
	if (!image) throw new Error(`${indexPath}: no image file named "${name}" in the folder`);
	return image;
}

/** The four landing sections in tab order: books, stories, games, apps. */
export function loadSections(): Section[] {
	const book = pickHero(loadBooks());
	const story = pickHero(loadStories());
	const game = pickHero(loadGames());
	const app = pickHero(loadApps());
	return [
		{
			href: '/books',
			title: 'Books',
			image: book && inFolder(book.path, book.data.cover)
		},
		{
			href: '/stories',
			title: 'Stories',
			image: story && inFolder(story.edition.path, story.edition.data.cover)
		},
		{
			href: '/games',
			title: 'Games',
			image: game && inFolder(game.path, game.data.image)
		},
		{
			href: '/apps',
			title: 'Apps',
			image: app && inFolder(app.path, app.data.screenshots[0])
		}
	];
}
