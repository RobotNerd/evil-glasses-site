import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { newestFirst, validateEntry, type Entry } from './loader';
import type { EditionData, StoryData } from './schemas';

type Image = EnhancedImgAttributes['src'];

export type Edition = Entry<EditionData> & { cover: Image };
export type Story = Entry<StoryData> & { edition: Edition };
export type EditionGroup = { edition: Edition; stories: Story[] };

const storyFiles = import.meta.glob('/src/content/stories/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const editionFiles = import.meta.glob('/src/content/editions/*/index.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const images = import.meta.glob('/src/content/editions/*/*.{jpg,jpeg,png}', {
	query: { enhanced: true, w: '320;480;640;960' },
	import: 'default',
	eager: true
}) as Record<string, Image>;

/** Every edition, validated, newest first. Fails the build on the first bad file. */
export function loadEditions(): Edition[] {
	const editions = Object.entries(editionFiles).map(([path, source]) => {
		const entry = validateEntry('editions', { path, source });
		const cover = images[path.replace(/index\.md$/, entry.data.cover)];
		if (!cover) {
			throw new Error(
				`${path}: field "cover": no image file named "${entry.data.cover}" in the folder`
			);
		}
		return { ...entry, cover };
	});
	return newestFirst(editions);
}

/**
 * Attaches each story to its edition. Throws, naming the story and the edition number,
 * when a story's `edition` has no edition.
 */
export function attachEditions(stories: Entry<StoryData>[], editions: Edition[]): Story[] {
	return stories.map((story) => {
		const edition = editions.find((e) => e.data.number === story.data.edition);
		if (!edition) {
			throw new Error(
				`${story.path}: field "edition": story "${story.slug}" names edition ${story.data.edition}, but there is no edition ${story.data.edition}`
			);
		}
		return { ...story, edition };
	});
}

/** Every story, validated, in edition order (newest first), then `order` within the edition, then title. */
export function loadStories(): Story[] {
	const entries = Object.entries(storyFiles).map(([path, source]) =>
		validateEntry('stories', { path, source })
	);
	return attachEditions(entries, loadEditions()).sort(
		(a, b) =>
			b.data.edition - a.data.edition ||
			(a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
			a.data.title.localeCompare(b.data.title)
	);
}

/** Groups stories by edition, newest edition first. Editions with no stories are left out. */
export function groupByEdition(stories: Story[]): EditionGroup[] {
	const groups = new Map<number, EditionGroup>();
	for (const story of stories) {
		const group = groups.get(story.edition.data.number) ?? { edition: story.edition, stories: [] };
		group.stories.push(story);
		groups.set(story.edition.data.number, group);
	}
	return [...groups.values()].sort((a, b) => b.edition.data.number - a.edition.data.number);
}

/**
 * The story after `story`: the next one in its edition by `order`, else the first story of
 * the next edition. `stories` must be in the order `loadStories` returns. Undefined for the
 * last story of the newest edition.
 */
export function nextStory<T extends Story>(stories: T[], story: T): T | undefined {
	const number = story.edition.data.number;
	const inEdition = stories.filter((s) => s.edition.data.number === number);
	const next = inEdition[inEdition.indexOf(story) + 1];
	if (next) return next;
	const later = stories
		.filter((s) => s.edition.data.number > number)
		.sort((a, b) => a.edition.data.number - b.edition.data.number);
	return later[0];
}

export function getStory(slug: string): Story | undefined {
	return loadStories().find((story) => story.slug === slug);
}

export { editionId } from './format';
