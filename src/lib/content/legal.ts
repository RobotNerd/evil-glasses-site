import { validateEntry, type Entry } from './loader';
import type { LegalData } from './schemas';

export type Legal = Entry<LegalData>;

const files = import.meta.glob('/src/content/legal/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

/** Every privacy policy, validated, sorted by title. Fails the build on the first bad file. */
export function loadLegal(): Legal[] {
	return Object.entries(files)
		.map(([path, source]) => validateEntry('legal', { path, source }))
		.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function getLegal(slug: string): Legal | undefined {
	return loadLegal().find((item) => item.slug === slug);
}
