import { z } from 'zod';

export const stores = ['amazon', 'apple', 'google-play', 'kindle', 'smashwords'] as const;

export const storeLinkSchema = z.strictObject({
	store: z.enum(stores),
	label: z.string().min(1),
	url: z.url()
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date written as YYYY-MM-DD');

export const bookSchema = z.strictObject({
	title: z.string().min(1),
	subtitle: z.string().min(1),
	author: z.string().min(1),
	date: isoDate,
	cover: z.string().min(1),
	synopsis: z.string().min(1),
	authorBio: z.string().min(1),
	storeLinks: z.array(storeLinkSchema).min(1)
});

export const schemas = { books: bookSchema } as const;

export type ContentType = keyof typeof schemas;
export type StoreLink = z.infer<typeof storeLinkSchema>;
export type BookData = z.infer<typeof bookSchema>;
