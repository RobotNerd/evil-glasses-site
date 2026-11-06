<script lang="ts">
	import SeoHead from '../../../lib/components/SeoHead.svelte';
	import { storeBadges } from '../../../lib/content/stores';

	let { data } = $props();
	const game = $derived(data.game);
</script>

<SeoHead
	title={game.data.title}
	description={game.data.synopsis}
	path="/games/{game.slug}"
	image={game.image}
/>

<article>
	<enhanced:img
		class="cover"
		src={game.image}
		alt="Artwork for {game.data.title}"
		sizes="(min-width: 40rem) 20rem, 90vw"
	/>
	<h1>{game.data.title}</h1>
	<p class="subtitle">{game.data.subtitle}</p>

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html game.html}

	<h2>Get your copy now!</h2>
	<ul class="stores">
		{#each game.data.storeLinks as link (link.url)}
			{@const badge = storeBadges[link.store]}
			<li>
				<a href={link.url}>
					{#if badge}
						<enhanced:img src={badge} alt={link.label} />
					{:else}
						<span>{link.label}</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>

	<p><a class="policy" href={game.data.privacyPolicy}>Privacy policy</a></p>
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
