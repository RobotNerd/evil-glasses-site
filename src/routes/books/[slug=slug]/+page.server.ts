import { error } from '@sveltejs/kit';
import { getBook, loadBooks } from '../../../lib/content/books';

export function entries() {
	return loadBooks().map((book) => ({ slug: book.slug }));
}

export function load({ params }) {
	const book = getBook(params.slug);
	if (!book) error(404, 'Book not found');
	return { book };
}
