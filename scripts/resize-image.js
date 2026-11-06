// Copies an image into a content folder, shrinking it to at most 1600 pixels on its long side.
// Smaller images are copied at their size.
// Run: node scripts/resize-image.js <source image> <destination file>
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

const maxSide = 1600;
const [source, destination] = process.argv.slice(2);

if (!source || !destination) {
	console.error('Usage: node scripts/resize-image.js <source image> <destination file>');
	process.exit(1);
}

await mkdir(dirname(destination), { recursive: true });
const info = await sharp(source)
	.rotate()
	.resize(maxSide, maxSide, { fit: 'inside', withoutEnlargement: true })
	.toFile(destination);
console.log(`${destination} ${info.width}x${info.height}`);
