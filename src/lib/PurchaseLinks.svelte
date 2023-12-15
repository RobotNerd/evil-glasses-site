<script lang="ts">
	import type { PurchaseInfo } from '$lib/util/Purchase';

	export let items: PurchaseInfo[];
</script>

{#if items.length > 0}
	<h3 class="h3 mb-4">Get your copy now!</h3>
{/if}

<div class="flex flex-col flex-wrap items-center justify-evenly xl:flex-row xl:justify-start">
	{#each items as link}
		<a class="my-1 mr-2 flex w-1/5 flex-col items-center xl:flex-row" href={link.url}>
			<img class="m-1" src={link.image} alt={link.label} />
		</a>
	{/each}
</div>
