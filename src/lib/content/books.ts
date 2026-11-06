import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { newestFirst, validateEntry, type Entry } from './loader';
import type { BookData } from './schemas';

export type Book = Entry<BookData> & { cover: EnhancedImgAttributes['src'] };

const files = import.meta.glob('/src/content/books/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const images = import.meta.glob('/src/content/books/*/*.{jpg,jpeg,png}', {
	query: { enhanced: true, w: '320;480;640;960' },
	import: 'default',
	eager: true
}) as Record<string, EnhancedImgAttributes['src']>;

/** Every book, validated, newest first. Fails the build on the first bad file. */
export function loadBooks(): Book[] {
	const books = Object.entries(files).map(([path, source]) => {
		const entry = validateEntry('books', { path, source });
		const imagePath = path.replace(/index\.md$/, entry.data.cover);
		const cover = images[imagePath];
		if (!cover) {
			throw new Error(
				`${path}: field "cover": no image file named "${entry.data.cover}" in the folder`
			);
		}
		return { ...entry, cover };
	});
	return newestFirst(books);
}

export function getBook(slug: string): Book | undefined {
	return loadBooks().find((book) => book.slug === slug);
}
