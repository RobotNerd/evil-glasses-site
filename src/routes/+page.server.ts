import { loadNewest } from '../lib/content/home';

export function load() {
	return { newest: loadNewest(3) };
}
