export type MenuLink = { href: string; label: string; display: boolean };

/** The site's menu, in order. `display` links use the display face; the rest the system font. */
export const menuLinks: MenuLink[] = [
	{ href: '/', label: 'Home', display: true },
	{ href: '/books', label: 'Books', display: true },
	{ href: '/stories', label: 'Stories', display: true },
	{ href: '/games', label: 'Games', display: true },
	{ href: '/apps', label: 'Apps', display: true },
	{ href: '/about', label: 'About', display: false },
	{ href: '/legal', label: 'Legal', display: false }
];

/** Whether a menu link is the current page, or an ancestor of it (`/books` for `/books/x`). */
export function isCurrent(href: string, pathname: string): boolean {
	if (href === '/') return pathname === '/';
	return pathname === href || pathname.startsWith(`${href}/`);
}
