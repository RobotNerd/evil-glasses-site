import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const css = readFileSync('src/lib/styles.css', 'utf8');

/** Reads the custom properties declared in the first block whose selector is `:root`. */
function properties(block: string): Record<string, string> {
	const found: Record<string, string> = {};
	for (const [, name, value] of block.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
		found[name] = value.trim();
	}
	return found;
}

const darkStart = css.indexOf('@media (prefers-color-scheme: dark)');
const darkEnd = css.indexOf('\n}\n', darkStart);
const light = properties(css.slice(css.indexOf(':root {'), darkStart));
const dark = properties(css.slice(darkStart, darkEnd));

// The Color table of the "Site presentation" spec.
const table: Record<string, [string, string]> = {
	'--paper': ['#f6f1e7', '#1b1815'],
	'--paper-2': ['#ece5d8', '#26221d'],
	'--ink': ['#1f1b16', '#eee7db'],
	'--muted': ['#6a6157', '#a59c8f'],
	'--line': ['#d8cfc0', '#3b352d'],
	'--accent': ['#2a72a5', '#7dbbe6'],
	'--badge': ['#6cacdb', '#6cacdb'],
	'--badge-ink': ['#111111', '#111111'],
	'--lens': ['#d9efff', '#d9efff'],
	'--fade': ['rgb(246 241 231 / 0.8)', 'rgb(27 24 21 / 0.78)'],
	'--vignette': ['rgb(31 27 22 / 0.55)', 'rgb(0 0 0 / 0.7)']
};

test.each(Object.entries(table))(
	'%s has its light and dark values',
	(name, [lightValue, darkValue]) => {
		expect(light[name]).toBe(lightValue);
		if (lightValue === darkValue) {
			expect(dark[name]).toBeUndefined();
		} else {
			expect(dark[name]).toBe(darkValue);
		}
	}
);

test('the dark block redefines only tokens from the table', () => {
	for (const name of Object.keys(dark)) expect(table).toHaveProperty(name);
});
