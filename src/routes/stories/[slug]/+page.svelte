<script lang="ts">
	import SeoHead from '../../../lib/components/SeoHead.svelte';
	import { editionId } from '../../../lib/content/format';

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
	<header>
		<enhanced:img
			class="cover"
			src={story.edition.cover}
			alt="Cover of Evil Glasses Short Stories, Edition {story.edition.data.number}"
			sizes="6rem"
		/>
		<div>
			<h1>{story.data.title}</h1>
			<p class="meta">
				By {story.data.author} ·
				<a href="/stories#{editionId(story.edition.data.number)}"
					>Edition {story.edition.data.number}</a
				>
				· {data.minutes} min read
			</p>
		</div>
	</header>
	<div class="story">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
		{@html story.html}
	</div>
	{#if data.next}
		<p class="next">
			<a href="/stories/{data.next.slug}" rel="next">Next story: {data.next.title}</a>
		</p>
	{/if}
</article>

<style>
	header {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
		margin-block-end: var(--space-4);
	}
	h1 {
		margin: 0;
		line-height: 1.1;
	}
	.meta {
		margin: var(--space-2) 0 0;
		color: var(--color-muted);
	}
	:global(.cover) {
		width: 6rem;
		flex: none;
		height: auto;
		border-radius: var(--radius);
	}
	.story {
		max-width: 65ch;
		font-family: var(--font-serif);
		font-size: 1.125rem;
		line-height: 1.6;
	}
	.story :global(p) {
		margin: 0;
	}
	.story :global(p ~ p) {
		text-indent: 1.5em;
	}
	.next {
		margin-block-start: var(--space-5);
		font-family: var(--font-display);
		font-size: 1.5rem;
		text-transform: uppercase;
	}
</style>
