import { error } from '@sveltejs/kit';
import { redirects } from '../../lib/content/redirects';

export const prerender = true;

/** One entry per old path, without the leading slash. */
export function entries() {
	return Object.keys(redirects).map((old) => ({ path: old.slice(1) }));
}

export function load({ params }) {
	const target = redirects[`/${params.path}`];
	if (!target) error(404, 'Page not found');
	return { target, canonical: `https://evilglasses.com${target}` };
}
