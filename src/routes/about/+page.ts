import { error } from '@sveltejs/kit';
import { getPage } from '../../lib/content/pages';

export function load() {
	const page = getPage('about');
	if (!page) error(404, 'Not found');
	return { page };
}
