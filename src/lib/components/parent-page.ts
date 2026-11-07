const sections = ['books', 'stories', 'games', 'apps'];

/** The page the back arrow falls back to: a page under a section goes to its list, any other to `/`. */
export function parentPage(pathname: string): string {
	const parts = pathname.split('/').filter(Boolean);
	if (parts.length >= 2 && sections.includes(parts[0])) return `/${parts[0]}`;
	return '/';
}
