import { loadApps } from './apps';
import { loadBooks } from './books';
import { loadGames } from './games';
import { loadLegal } from './legal';
import { loadStories } from './stories';
import { absoluteUrl } from './site';

/** Every page that belongs in the sitemap: all of them except the old-URL redirect pages. */
export function sitemapPaths(): string[] {
	return [
		'/',
		'/about',
		'/books',
		...loadBooks().map((x) => `/books/${x.slug}`),
		'/games',
		...loadGames().map((x) => `/games/${x.slug}`),
		'/apps',
		...loadApps().map((x) => `/apps/${x.slug}`),
		'/stories',
		...loadStories().map((x) => `/stories/${x.slug}`),
		'/legal',
		...loadLegal().map((x) => `/legal/${x.slug}`)
	];
}

/** The sitemap.xml text, with absolute URLs. */
export function sitemapXml(paths = sitemapPaths()): string {
	const urls = paths.map((path) => `\t<url><loc>${absoluteUrl(path)}</loc></url>`).join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
