import { loadSlides, sections } from '../lib/content/landing';

export function load() {
	return { sections, slides: loadSlides() };
}
