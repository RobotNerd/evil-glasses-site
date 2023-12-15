<script lang="ts">
	import PurchaseLinks from '$lib/PurchaseLinks.svelte';
	import type { PurchaseInfo } from '$lib/util/Purchase';

	export let description: string = 'DESCRIPTION';
	export let image: string = 'IMAGE';
	export let imageDescription: string = 'IMAGE DESCRIPTION';
	export let purchaseLinks: PurchaseInfo[] = [];
	export let title: string = 'TITLE';
	export let url: string = '';
	export let icon: string = 'fa-circle';
</script>

<div class="card variant-outline m-4 flex w-3/4 flex-col items-center rounded-lg p-4 xl:hidden">
	<a class="mb-8 w-2/3" href={url}>
		<img src={image} alt={imageDescription} />
	</a>

	<h3 class="h3 mb-4">
		<span class="fa-solid {icon}"></span>
		{title}
	</h3>

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

<div class="card variant-outline m-4 hidden w-3/4 flex-row justify-start rounded-lg p-4 xl:flex">
	<a class="mb-8 mr-5 max-h-96 w-2/3" href={url}>
		<img class="h-full" src={image} alt={imageDescription} />
	</a>

	<div class="flex flex-col">
		<h3 class="h3 mb-4">
			<span class="fa-solid {icon}"></span>
			{title}
		</h3>

		<p class="mb-4">
			{description}
		</p>

		<div class="flex flex-col items-center xl:items-start">
			{#if purchaseLinks}
				<PurchaseLinks items={purchaseLinks} />
			{/if}
		</div>

		{#if url}
			<a
				class="card variant-ringed-secondary btn btn-sm card-hover mb-2 mt-4 h-1/3 max-h-10 w-1/4 self-end rounded-lg"
				href={url}
			>
				More...
			</a>
		{/if}
	</div>
</div>
