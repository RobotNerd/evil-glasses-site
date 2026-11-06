export type HeroCandidate = { path: string; data: { date: string; hero?: boolean } };

/**
 * The item whose image fronts its type on the landing page: the one flagged `hero: true`,
 * else the newest by `date`. Throws, naming both files, when two items are flagged.
 */
export function pickHero<T extends HeroCandidate>(items: T[]): T | undefined {
	const flagged = items.filter((item) => item.data.hero === true);
	if (flagged.length > 1) {
		throw new Error(
			`${flagged[1].path}: field "hero": ${flagged[0].path} is already the hero; only one item of a type can have "hero: true"`
		);
	}
	if (flagged.length === 1) return flagged[0];
	return [...items].sort((a, b) => b.data.date.localeCompare(a.data.date))[0];
}
