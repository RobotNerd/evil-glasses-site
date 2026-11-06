import type { APIRequestContext } from '@playwright/test';

export const origin = 'https://evilglasses.com';

/** The `<loc>` URLs in the built sitemap.xml. */
export async function sitemapUrls(request: APIRequestContext): Promise<string[]> {
	const response = await request.get('/sitemap.xml');
	const xml = await response.text();
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

/** `https://evilglasses.com/books/x` -> `/books/x`; the home page is `/`. */
export function localPath(url: string): string {
	return url.slice(origin.length) || '/';
}
