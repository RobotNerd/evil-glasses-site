/** Writes `2015-07-01` as `July 1, 2015`, independent of the reader's time zone. */
export function formatDate(date: string): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		dateStyle: 'long',
		timeZone: 'UTC'
	});
}

/** `01`, `14`: the number used in the `edition-NN` anchor. */
export function editionId(number: number): string {
	return `edition-${String(number).padStart(2, '0')}`;
}
