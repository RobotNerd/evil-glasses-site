<script lang="ts">
	import logo from '../lib/assets/evil-glasses.svg';
	import SeoHead from '../lib/components/SeoHead.svelte';
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

<SeoHead
	title="Evil Glasses"
	description="Evil Glasses makes books, stories, games and apps with a little heart and a little mischief."
	path="/"
/>

<img class="logo" src={logo} alt="Evil Glasses" width="226" height="108" />

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
	.logo {
		max-width: 100%;
		height: auto;
	}
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
