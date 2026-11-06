import { error } from '@sveltejs/kit';
import { getApp, loadApps } from '../../../lib/content/apps';

export function entries() {
	return loadApps().map((app) => ({ slug: app.slug }));
}

export function load({ params }) {
	const app = getApp(params.slug);
	if (!app) error(404, 'App not found');
	return { app };
}
