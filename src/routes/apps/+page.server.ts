import { loadApps } from '../../lib/content/apps';

export function load() {
	return { apps: loadApps() };
}
