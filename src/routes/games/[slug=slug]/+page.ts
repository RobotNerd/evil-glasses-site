import { error } from '@sveltejs/kit';
import { getGame, loadGames } from '../../../lib/content/games';

export function entries() {
	return loadGames().map((game) => ({ slug: game.slug }));
}

export function load({ params }) {
	const game = getGame(params.slug);
	if (!game) error(404, 'Game not found');
	return { game };
}
