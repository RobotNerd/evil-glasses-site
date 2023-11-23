<script lang="ts">
	import type { BookMeta } from './util/Story';
	import BookLinks from '$lib/BookLinks.svelte';

	export let book: BookMeta;
	export let description: string = 'DESCRIPTION';
	export let image: string = 'IMAGE';
	export let imageDescription: string = 'IMAGE DESCRIPTION';
	export let title: string = 'TITLE';
	export let url: string = '';
</script>

<div class="card variant-outline m-4 flex w-3/4 flex-col items-center rounded-lg p-4">
	<a class="mb-8 w-2/3" href={url}>
		<img  src={image} alt={imageDescription} />
	</a>

	<h3 class="h3 mb-4">{title}</h3>

	<p class="mb-4">
		{description}
	</p>

	<div class="flex flex-col items-center">
		{#if book}
			<BookLinks {book} />
		{/if}
	</div>

	{#if url}
		<a
			class="card variant-filled-secondary card-hover my-4 flex w-1/2 justify-center rounded-lg p-4"
			href={url}>More Info</a
		>
	{/if}
</div>
