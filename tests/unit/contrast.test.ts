import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const css = readFileSync('src/lib/styles.css', 'utf8');
const darkStart = css.indexOf('@media (prefers-color-scheme: dark)');

function hex(block: string, name: string): string | undefined {
	return block.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6});`))?.[1];
}

const lightBlock = css.slice(css.indexOf(':root {'), darkStart);
const darkBlock = css.slice(darkStart);

function luminance(color: string): number {
	const [r, g, b] = [1, 3, 5]
		.map((i) => parseInt(color.slice(i, i + 2), 16) / 255)
		.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

// Text token on its background, as the spec's Color table requires.
const pairs: [string, string][] = [
	['--ink', '--paper'],
	['--muted', '--paper'],
	['--accent', '--paper'],
	['--ink', '--bar'],
	['--muted', '--bar'],
	['--accent', '--bar']
];

for (const [mode, block] of [
	['light', lightBlock],
	['dark', darkBlock]
] as const) {
	test.each(pairs)(`${mode}: %s on %s is at least 4.5:1`, (text, background) => {
		const pick = (name: string) => hex(block, name) ?? hex(lightBlock, name)!;
		expect(contrast(pick(text), pick(background))).toBeGreaterThanOrEqual(4.5);
	});
}

test('dark paper is a warm gray of low luminance', () => {
	const paper = hex(darkBlock, '--paper')!;
	const [r, , b] = [1, 3, 5].map((i) => parseInt(paper.slice(i, i + 2), 16));
	expect(luminance(paper)).toBeGreaterThanOrEqual(0.03);
	expect(luminance(paper)).toBeLessThanOrEqual(0.06);
	expect(r).toBeGreaterThanOrEqual(b);
});

test.each([
	['light', lightBlock],
	['dark', darkBlock]
] as const)('%s: the bar is darker than the paper', (_mode, block) => {
	const pick = (name: string) => hex(block, name) ?? hex(lightBlock, name)!;
	expect(luminance(pick('--bar'))).toBeLessThan(luminance(pick('--paper')));
});
