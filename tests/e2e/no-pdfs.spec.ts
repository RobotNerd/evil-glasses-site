import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('no PDF files ship in static/ or build/', () => {
	const found: string[] = [];
	const visit = (path: string) => {
		for (const entry of readdirSync(path, { withFileTypes: true })) {
			const full = `${path}/${entry.name}`;
			if (entry.isDirectory()) visit(full);
			else if (entry.name.toLowerCase().endsWith('.pdf')) found.push(full);
		}
	};
	visit('static');
	visit('build');
	expect(found).toEqual([]);
});
