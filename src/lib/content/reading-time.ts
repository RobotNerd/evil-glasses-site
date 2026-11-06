const wordsPerMinute = 230;

/** Counts the words in a string of text or HTML; tags are not words. */
export function countWords(source: string): number {
	return source
		.replace(/<[^>]*>/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
}

/** Minutes to read `source` at 230 words a minute, rounded up, never less than 1. */
export function readingMinutes(source: string): number {
	return Math.max(1, Math.ceil(countWords(source) / wordsPerMinute));
}
