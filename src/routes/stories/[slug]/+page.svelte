<script lang="ts">
	import SeoHead from '../../../lib/components/SeoHead.svelte';
	import { editionId, formatDate } from '../../../lib/content/format';

	let { data } = $props();
	const story = $derived(data.story);
</script>

<SeoHead
	title={story.data.title}
	description={story.data.synopsis}
	path="/stories/{story.slug}"
	image={story.edition.cover}
/>

<article>
	<enhanced:img
		class="cover"
		src={story.edition.cover}
		alt="Cover of Evil Glasses Short Stories, Edition {story.edition.data.number}"
		sizes="(min-width: 40rem) 12rem, 60vw"
	/>
	<h1>{story.data.title}</h1>
	<p class="author">By {story.data.author}</p>
	<p class="edition">
		<a href="/stories#{editionId(story.edition.data.number)}">Edition {story.edition.data.number}</a
		>,
		<time datetime={story.data.date}>{formatDate(story.data.date)}</time>
	</p>
	<div class="story">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
		{@html story.html}
	</div>
</article>

<style>
	.author {
		font-size: 1.25rem;
	}
	.edition {
		color: var(--color-muted);
	}
	:global(.cover) {
		max-width: min(12rem, 100%);
		height: auto;
		border-radius: var(--radius);
	}
	.story {
		max-width: 40rem;
	}
</style>
