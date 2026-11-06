import { error } from '@sveltejs/kit';
import { getLegal, loadLegal } from '../../../lib/content/legal';

export function entries() {
	return loadLegal().map((item) => ({ slug: item.slug }));
}

export function load({ params }) {
	const policy = getLegal(params.slug);
	if (!policy) error(404, 'Policy not found');
	return { policy };
}
