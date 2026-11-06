<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead title="Games" description="Games by Marshall Bowles." path="/games" />

<h1>Games</h1>

<ul class="cover-grid">
	{#each data.games as game, index (game.slug)}
		<li>
			<a href="/games/{game.slug}">
				<enhanced:img
					src={game.image}
					alt=""
					sizes="(min-width: 40rem) 13rem, 45vw"
					loading={index < 4 ? undefined : 'lazy'}
					style="view-transition-name: cover-{game.slug}"
				/>
				<span class="title">{game.data.title}</span>
				<span class="subtitle">{game.data.subtitle}</span>
			</a>
		</li>
	{/each}
</ul>
