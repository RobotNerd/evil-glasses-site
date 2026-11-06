import { loadSections } from '../lib/content/landing';

export function load() {
	return { sections: loadSections() };
}
