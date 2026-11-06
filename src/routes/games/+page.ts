import { loadGames } from '../../lib/content/games';

export function load() {
	return { games: loadGames() };
}
