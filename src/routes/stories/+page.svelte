<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	import { editionId, formatMonth } from '../../lib/content/format';

	let { data } = $props();
</script>

<SeoHead
	title="Stories"
	description="Short stories by Sara Lufrano, Marshall Bowles and friends."
	path="/stories"
/>

<h1>Stories</h1>

{#each data.groups as group, index (group.edition.data.number)}
	<section
		id={editionId(group.edition.data.number)}
		aria-labelledby="{editionId(group.edition.data.number)}-title"
	>
		<div class="edition">
			<enhanced:img
				class="cover"
				src={group.edition.cover}
				alt="Cover of Evil Glasses Short Stories, Edition {group.edition.data.number}"
				sizes="6rem"
				loading={index < 2 ? undefined : 'lazy'}
			/>
			<h2 id="{editionId(group.edition.data.number)}-title">
				Edition {group.edition.data.number} ·
				<time datetime={group.edition.data.date}>{formatMonth(group.edition.data.date)}</time>
			</h2>
		</div>
		<ul>
			{#each group.stories as story (story.slug)}
				<li>
					<a href="/stories/{story.slug}">{story.data.title}</a>
					<span class="author">by {story.data.author}</span>
					<p class="synopsis">{story.data.synopsis}</p>
				</li>
			{/each}
		</ul>
	</section>
{/each}

<style>
	section {
		margin-block-end: var(--space-5);
	}
	.edition {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-block-end: var(--space-2);
		border-block-end: 1px solid var(--line);
	}
	.edition :global(img) {
		width: 6rem;
		height: auto;
		border-radius: 0.25rem;
	}
	h2 {
		margin: 0;
		font-size: 1.75rem;
	}
	ul {
		padding: 0;
		list-style: none;
	}
	li {
		margin-block-end: var(--space-3);
	}
	li > a {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 800;
		text-transform: uppercase;
		text-decoration: none;
	}
	.author {
		display: block;
		color: var(--muted);
		font-size: 0.9rem;
	}
	.synopsis {
		margin-block: 0;
	}
</style>
