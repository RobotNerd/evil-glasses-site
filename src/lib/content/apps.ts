import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { newestFirst, validateEntry, type Entry } from './loader';
import type { AppData } from './schemas';

type Image = EnhancedImgAttributes['src'];

export type App = Entry<AppData> & {
	image: Image;
	screenshots: { src: Image; alt: string }[];
};

const files = import.meta.glob('/src/content/apps/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const images = import.meta.glob('/src/content/apps/*/*.{jpg,jpeg,png}', {
	query: { enhanced: true },
	import: 'default',
	eager: true
}) as Record<string, Image>;

function findImage(path: string, field: string, name: string): Image {
	const image = images[path.replace(/index\.md$/, name)];
	if (!image) {
		throw new Error(`${path}: field "${field}": no image file named "${name}" in the folder`);
	}
	return image;
}

/** Every app, validated, newest first. Fails the build on the first bad file. */
export function loadApps(): App[] {
	const apps = Object.entries(files).map(([path, source]) => {
		const entry = validateEntry('apps', { path, source });
		return {
			...entry,
			image: findImage(path, 'image', entry.data.image),
			screenshots: entry.data.screenshots.map((name, index) => ({
				src: findImage(path, `screenshots.${index}`, name),
				alt: `Screenshot ${index + 1} of ${entry.data.title}`
			}))
		};
	});
	return newestFirst(apps);
}

export function getApp(slug: string): App | undefined {
	return loadApps().find((app) => app.slug === slug);
}
