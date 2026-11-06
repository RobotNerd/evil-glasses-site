import { error } from '@sveltejs/kit';
import { readingMinutes } from '../../../lib/content/reading-time';
import { loadStories, nextStory } from '../../../lib/content/stories';

export function entries() {
	return loadStories().map((story) => ({ slug: story.slug }));
}

export function load({ params }) {
	const stories = loadStories();
	const story = stories.find((s) => s.slug === params.slug);
	if (!story) error(404, 'Story not found');
	const next = nextStory(stories, story);
	return {
		story,
		minutes: readingMinutes(story.html),
		next: next && { slug: next.slug, title: next.data.title }
	};
}
