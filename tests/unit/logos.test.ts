import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const uncropped = ['0 0 210 297', '0 0 744.09448819 1052.3622047'];

describe.each(['evil-glasses', 'evil-glasses-sticker'])('%s.svg', (name) => {
	const svg = readFileSync(`src/lib/assets/${name}.svg`, 'utf8');

	it('has a viewBox fitted to the drawing', () => {
		const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
		expect(viewBox).toBeDefined();
		expect(uncropped).not.toContain(viewBox);
	});

	it('has no Inkscape or Sodipodi metadata', () => {
		expect(svg).not.toMatch(/inkscape:|sodipodi:/);
	});
});
