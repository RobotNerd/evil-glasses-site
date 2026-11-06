import { validateEntry, type Entry } from './loader';
import type { PageData } from './schemas';

export type Page = Entry<PageData>;

const files = import.meta.glob('/src/content/pages/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const images = import.meta.glob('/src/content/pages/*/*.{jpg,jpeg,png}', {
	query: '?url',
	import: 'default',
	eager: true
}) as Record<string, string>;

/** Points `<img src="name.jpg">` in the rendered body at the built image file in the folder. */
function resolveImages(path: string, html: string): string {
	return html.replace(
		/(<img [^>]*?src=")([^"]+)(")/g,
		(whole, before: string, name: string, after: string) => {
			const url = images[path.replace(/index\.md$/, name)];
			if (!url) throw new Error(`${path}: image "${name}" is not a file in the folder`);
			return `${before}${url}${after}`;
		}
	);
}

export function getPage(slug: string): Page | undefined {
	const found = Object.entries(files).find(([path]) => path.endsWith(`/${slug}/index.md`));
	if (!found) return undefined;
	const entry = validateEntry('pages', { path: found[0], source: found[1] });
	return { ...entry, html: resolveImages(found[0], entry.html) };
}
