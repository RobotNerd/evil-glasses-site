export const siteUrl = 'https://evilglasses.com';
export const siteName = 'Evil Glasses';
export const defaultImage = '/og-default.png';

type BuiltImage = string | { img: { src: string } };

/** The absolute URL of a path on the site. */
export function absoluteUrl(path: string): string {
	return `${siteUrl}${path === '/' ? '' : path}`;
}

/** The absolute URL of an image from `?enhanced` (an object) or `?url` (a string) imports. */
export function imageUrl(image?: BuiltImage): string {
	const src =
		image === undefined ? defaultImage : typeof image === 'string' ? image : image.img.src;
	// The image tooling may emit an absolute URL on the build's own origin; keep just the path.
	const { pathname, search } = new URL(src, siteUrl);
	return `${siteUrl}${pathname}${search}`;
}
