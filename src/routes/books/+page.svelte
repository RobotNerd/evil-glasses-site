<script lang="ts">
	import { Books } from '$lib/data/book-meta';
	import CardItem from '$lib/CardItem.svelte';

	let titles: string[] = [...Object.keys(Books)].reverse();
</script>

<h1 class="h1">Books</h1>

<div
	class="flex flex-col flex-wrap items-center justify-center sm:w-2/3 sm:flex-row sm:items-start"
>
	{#each titles as title}
		<CardItem
			description={Books[title].synopsis}
			image={Books[title].coverImage}
			imageDescription={'cover image'}
			purchaseLinks={Books[title].purchaseLinks}
			title={title}
			url={Books[title].route}
		/>
	{/each}
</div>
