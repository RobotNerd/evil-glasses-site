// Regenerates the brand files from the main logo (run: npm run brand):
// static/favicon.svg, static/favicon.png (32x32), static/apple-touch-icon.png (180x180)
// and static/og-default.png (1200x630), the share image for pages with no image of their own.
import { copyFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';

const logo = new URL('../src/lib/assets/evil-glasses.svg', import.meta.url);
const out = (name) => new URL(`../static/${name}`, import.meta.url).pathname;
const svg = await readFile(logo);
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

await copyFile(logo, out('favicon.svg'));

/** Draws the logo centred on a canvas, fitted inside `fitW` x `fitH`. */
async function draw(width, height, fitW, fitH, background, file) {
	const art = await sharp(svg, { density: 600 })
		.resize(fitW, fitH, { fit: 'contain', background: transparent })
		.png()
		.toBuffer();
	await sharp({ create: { width, height, channels: 4, background } })
		.composite([{ input: art, gravity: 'centre' }])
		.png()
		.toFile(out(file));
}

await draw(32, 32, 30, 30, transparent, 'favicon.png');
await draw(180, 180, 140, 140, white, 'apple-touch-icon.png');
await draw(1200, 630, 900, 400, white, 'og-default.png');
