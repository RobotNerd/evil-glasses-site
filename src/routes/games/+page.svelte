<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead title="Games" description="Games by Marshall Bowles." path="/games" />

<h1>Games</h1>

<ul class="games">
	{#each data.games as game (game.slug)}
		<li>
			<a href="/games/{game.slug}">
				<enhanced:img src={game.image} alt="" sizes="(min-width: 40rem) 12rem, 40vw" />
				<span class="title">{game.data.title}</span>
				<span class="subtitle">{game.data.subtitle}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.games {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: var(--space-4);
		padding: 0;
		list-style: none;
	}
	a {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		text-decoration: none;
		color: var(--color-text);
	}
	.title {
		font-weight: 700;
	}
	.subtitle {
		color: var(--color-muted);
	}
	:global(.games img) {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}
</style>
