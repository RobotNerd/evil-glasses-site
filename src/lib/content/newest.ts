export type Newest = {
	type: 'books' | 'stories' | 'games' | 'apps';
	slug: string;
	title: string;
	date: string;
};

/** The `count` newest items by `date`; ties sort by title. */
export function newestItems(items: Newest[], count: number): Newest[] {
	return [...items]
		.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
		.slice(0, count);
}
