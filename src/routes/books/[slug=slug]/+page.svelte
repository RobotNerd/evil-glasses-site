<script lang="ts">
	import { storeBadges } from '../../../lib/content/stores';

	let { data } = $props();
	const book = $derived(data.book);
</script>

<svelte:head>
	<title>{book.data.title} | Evil Glasses</title>
	<meta name="description" content={book.data.synopsis} />
</svelte:head>

<article>
	<enhanced:img
		class="cover"
		src={book.cover}
		alt="Cover of {book.data.title}"
		sizes="(min-width: 40rem) 20rem, 90vw"
	/>
	<h1>{book.data.title}</h1>
	<p class="subtitle">{book.data.subtitle}</p>
	<p class="author">By {book.data.author}</p>

	<h2>Synopsis</h2>
	<p class="synopsis">{book.data.synopsis}</p>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html book.html}

	<h2>About the author</h2>
	<p class="bio">{book.data.authorBio}</p>

	<h2>Get the book</h2>
	<ul class="stores">
		{#each book.data.storeLinks as link (link.url)}
			{@const badge = storeBadges[link.store]}
			<li>
				<a href={link.url}>
					{#if badge}
						<enhanced:img src={badge} alt="" />
					{/if}
					<span>{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</article>

<style>
	.subtitle {
		color: var(--color-muted);
		font-size: 1.25rem;
	}
	.stores {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}
	.stores a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}
	:global(.cover) {
		max-width: min(20rem, 100%);
		height: auto;
		border-radius: var(--radius);
	}
	:global(.stores img) {
		width: 10rem;
		height: auto;
	}
</style>
