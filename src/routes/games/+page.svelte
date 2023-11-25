<script lang="ts">
  import { Games } from '$lib/data/game-meta';
	import CardItem from '$lib/CardItem.svelte';

	let titles: string[] = [...Object.keys(Games)].reverse();
</script>

<h1 class="h1">Games</h1>

<div
	class="flex flex-col flex-wrap items-center justify-center sm:w-2/3 sm:flex-row sm:items-start"
>
	{#each titles as title}
		<CardItem
			description={Games[title].synopsis}
			image={Games[title].image}
			imageDescription={'screenshot'}
			purchaseLinks={Games[title].purchaseLinks}
			title={title}
			url={Games[title].route}
		/>
	{/each}
</div>
