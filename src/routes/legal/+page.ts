import { loadLegal } from '../../lib/content/legal';

export function load() {
	return { policies: loadLegal() };
}
