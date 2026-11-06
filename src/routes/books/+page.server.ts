import { loadBooks } from '../../lib/content/books';

export function load() {
	return { books: loadBooks() };
}
