<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	import { editionId } from '../../lib/content/stories';
	import { formatDate } from '../../lib/content/format';

	let { data } = $props();
</script>

<SeoHead
	title="Stories"
	description="Short stories by Sara Rogers, Marshall Bowles and friends."
	path="/stories"
/>

<h1>Stories</h1>

{#each data.groups as group (group.edition.data.number)}
	<section
		id={editionId(group.edition.data.number)}
		aria-labelledby="{editionId(group.edition.data.number)}-title"
	>
		<h2 id="{editionId(group.edition.data.number)}-title">
			Edition {group.edition.data.number}
			<time datetime={group.edition.data.date}>{formatDate(group.edition.data.date)}</time>
		</h2>
		<enhanced:img
			class="cover"
			src={group.edition.cover}
			alt="Cover of Evil Glasses Short Stories, Edition {group.edition.data.number}"
			sizes="(min-width: 40rem) 12rem, 60vw"
		/>
		<ul>
			{#each group.stories as story (story.slug)}
				<li>
					<a href="/stories/{story.slug}">{story.data.title}</a>
					<span class="author">by {story.data.author}</span>
					<p>{story.data.synopsis}</p>
				</li>
			{/each}
		</ul>
	</section>
{/each}

<style>
	h2 time {
		color: var(--color-muted);
		font-size: 1rem;
		font-weight: 400;
	}
	ul {
		padding: 0;
		list-style: none;
	}
	li {
		margin-block-end: var(--space-3);
	}
	.author {
		color: var(--color-muted);
	}
	p {
		margin-block: 0;
	}
</style>
