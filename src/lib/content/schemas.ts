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

export const gameSchema = z.strictObject({
	title: z.string().min(1),
	subtitle: z.string().min(1),
	date: isoDate,
	image: z.string().min(1),
	synopsis: z.string().min(1),
	storeLinks: z.array(storeLinkSchema).min(1),
	privacyPolicy: z.string().regex(/^\/[a-z0-9/-]*$/, 'must be a site path such as /legal/my-app')
});

export const appSchema = gameSchema.extend({
	subtitle: z.string().min(1).optional(),
	author: z.string().min(1),
	screenshots: z.array(z.string().min(1)).min(1)
});

export const legalSchema = z.strictObject({
	title: z.string().min(1),
	app: z.string().min(1),
	updated: isoDate
});

export const storySchema = z.strictObject({
	title: z.string().min(1),
	author: z.string().min(1),
	date: isoDate,
	edition: z.number().int().positive(),
	// Position within the edition. Stories without one sort after those with one, by title.
	order: z.number().int().positive().optional(),
	synopsis: z.string().min(1)
});

export const editionSchema = z.strictObject({
	number: z.number().int().positive(),
	date: isoDate,
	cover: z.string().min(1)
});

export const pageSchema = z.strictObject({
	title: z.string().min(1),
	description: z.string().min(1)
});

export const schemas = {
	books: bookSchema,
	games: gameSchema,
	apps: appSchema,
	legal: legalSchema,
	stories: storySchema,
	editions: editionSchema,
	pages: pageSchema
} as const;

export type ContentType = keyof typeof schemas;
export type StoreLink = z.infer<typeof storeLinkSchema>;
export type BookData = z.infer<typeof bookSchema>;
export type GameData = z.infer<typeof gameSchema>;
export type AppData = z.infer<typeof appSchema>;
export type StoryData = z.infer<typeof storySchema>;
export type EditionData = z.infer<typeof editionSchema>;
export type PageData = z.infer<typeof pageSchema>;
export type LegalData = z.infer<typeof legalSchema>;
