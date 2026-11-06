// Builds the site's WOFF2 fonts in src/lib/assets/fonts from the @fontsource-variable packages.
// Each is the Latin subset with the weight axis narrowed to what the site uses, to stay small.
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync } from 'node:fs';

const latin = ' -ÿıŒœʻʼˆ˚˜ -⁯€™↑↓−∕﻿�';
const text = [...latin.matchAll(/(.)(?:-(.))?/gu)]
	.map(([, from, to]) => {
		const a = from.codePointAt(0);
		const b = (to ?? from).codePointAt(0);
		return Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i)).join('');
	})
	.join('');

const fonts = [
	{
		from: 'big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2',
		to: 'big-shoulders-display-800.woff2',
		axes: { wght: 800 }
	},
	{
		from: 'literata/files/literata-latin-wght-normal.woff2',
		to: 'literata.woff2',
		axes: { wght: { min: 400, max: 700 } }
	},
	{
		from: 'literata/files/literata-latin-wght-italic.woff2',
		to: 'literata-italic.woff2',
		axes: { wght: 400 }
	}
];

for (const { from, to, axes } of fonts) {
	const source = readFileSync(`node_modules/@fontsource-variable/${from}`);
	const out = await subsetFont(source, text, { targetFormat: 'woff2', variationAxes: axes });
	writeFileSync(`src/lib/assets/fonts/${to}`, out);
	console.log(`${to}: ${(out.length / 1024).toFixed(1)} KB`);
}
