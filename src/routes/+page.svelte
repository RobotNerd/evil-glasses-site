<script lang="ts">
	import { formatDate } from '../lib/content/format';

	let { data } = $props();

	const categories = [
		{ href: '/books', label: 'Books' },
		{ href: '/stories', label: 'Stories' },
		{ href: '/games', label: 'Games' },
		{ href: '/apps', label: 'Apps' }
	];
	const typeLabel = { books: 'Book', stories: 'Story', games: 'Game', apps: 'App' };
</script>

<svelte:head>
	<title>Evil Glasses</title>
	<meta
		name="description"
		content="Evil Glasses makes books, stories, games and apps with a little heart and a little mischief."
	/>
</svelte:head>

<h1>Evil Glasses</h1>

<p class="intro">
	Two people, one pair of mischievous glasses. We make books, stories, games and apps, each with a
	little heart and a little mischief. Pull up a chair, pick something new, and enjoy.
</p>

<h2>Newest</h2>
<ul class="newest">
	{#each data.newest as item (item.type + item.slug)}
		<li>
			<a href="/{item.type}/{item.slug}">{item.title}</a>
			<span class="meta">{typeLabel[item.type]} &middot; {formatDate(item.date)}</span>
		</li>
	{/each}
</ul>

<h2>Browse</h2>
<ul class="categories">
	{#each categories as category (category.href)}
		<li><a href={category.href}>{category.label}</a></li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		list-style: none;
	}
	li {
		margin-bottom: var(--space-2);
	}
	.meta {
		color: var(--color-muted);
		margin-left: var(--space-2);
	}
	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
</style>
