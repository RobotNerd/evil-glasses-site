<script lang="ts">
	import { page } from '$app/stores';
	import { Games } from '$lib/data/game-meta';
	import type { GameMeta } from '$lib/util/Game';
	import PurchaseLinks from '$lib/PurchaseLinks.svelte';

	let game: GameMeta = Games[$page.params.title];
</script>

<h1 class="h1 mb-8">{$page.params.title}</h1>

<div class="w-3/4 sm:w-1/2">
	<img class="mb-8" src={game.image} alt="game screenshot" />

	<h3 class="h3 mb-4">{game.subtitle}</h3>

	{#each game.description as line}
		<p class="mb-4">{line}</p>
	{/each}

	<div class="flex flex-col items-center">
		{#if game.purchaseLinks}
			<PurchaseLinks items={game.purchaseLinks} />
		{/if}
	</div>
</div>
