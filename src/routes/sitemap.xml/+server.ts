import { sitemapXml } from '../../lib/content/sitemap';

export const prerender = true;

export function GET() {
	return new Response(sitemapXml(), { headers: { 'content-type': 'application/xml' } });
}
