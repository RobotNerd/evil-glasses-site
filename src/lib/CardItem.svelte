<script lang="ts">
	import PurchaseLinks from '$lib/PurchaseLinks.svelte';
	import type { PurchaseInfo } from '$lib/util/Purchase';

	export let description: string = 'DESCRIPTION';
	export let image: string = 'IMAGE';
	export let imageDescription: string = 'IMAGE DESCRIPTION';
	export let purchaseLinks: PurchaseInfo[] = [];
	export let title: string = 'TITLE';
	export let url: string = '';
</script>

<div class="card variant-outline m-4 flex w-3/4 flex-col items-center rounded-lg p-4 xl:hidden">
	<a class="mb-8 w-2/3" href={url}>
		<img src={image} alt={imageDescription} />
	</a>

	<h3 class="h3 mb-4">{title}</h3>

	<p class="mb-4">
		{description}
	</p>

	<div class="flex flex-col items-center">
		{#if purchaseLinks}
			<PurchaseLinks items={purchaseLinks} />
		{/if}
	</div>

	{#if url}
		<a
			class="card variant-filled-secondary card-hover my-4 flex w-1/2 justify-center rounded-lg p-4"
			href={url}>More Info</a
		>
	{/if}
</div>

<div class="card variant-outline m-4 w-3/4 flex-col items-start rounded-lg p-4 xl:flex xl:flex-row">
	<a class="mr-8 w-1/3" href={url}>
		<img src={image} alt={imageDescription} />
	</a>

	<div class="flex w-full flex-col xl:w-2/3">
		<h3 class="h3 mb-4">{title}</h3>

		<p class="mb-4">
			{description}
		</p>

		{#if purchaseLinks}
			<PurchaseLinks items={purchaseLinks} />
		{/if}

		{#if url}
			<a
				class="card variant-filled-secondary card-hover my-2 w-fit justify-center rounded-lg p-4 xl:p-2"
				href={url}>More Info</a
			>
		{/if}
	</div>
</div>
