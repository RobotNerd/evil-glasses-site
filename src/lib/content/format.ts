/** Writes `2015-07-01` as `July 1, 2015`, independent of the reader's time zone. */
export function formatDate(date: string): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		dateStyle: 'long',
		timeZone: 'UTC'
	});
}
