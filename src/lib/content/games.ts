import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { newestFirst, validateEntry, type Entry } from './loader';
import type { GameData } from './schemas';

export type Game = Entry<GameData> & { image: EnhancedImgAttributes['src'] };

const files = import.meta.glob('/src/content/games/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const images = import.meta.glob('/src/content/games/*/*.{jpg,jpeg,png}', {
	query: { enhanced: true },
	import: 'default',
	eager: true
}) as Record<string, EnhancedImgAttributes['src']>;

/** Every game, validated, newest first. Fails the build on the first bad file. */
export function loadGames(): Game[] {
	const games = Object.entries(files).map(([path, source]) => {
		const entry = validateEntry('games', { path, source });
		const imagePath = path.replace(/index\.md$/, entry.data.image);
		const image = images[imagePath];
		if (!image) {
			throw new Error(
				`${path}: field "image": no image file named "${entry.data.image}" in the folder`
			);
		}
		return { ...entry, image };
	});
	return newestFirst(games);
}

export function getGame(slug: string): Game | undefined {
	return loadGames().find((game) => game.slug === slug);
}
