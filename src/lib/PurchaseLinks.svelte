<script lang="ts">
	import type { PurchaseInfo } from '$lib/util/Purchase';

	export let items: PurchaseInfo[];
</script>

{#if items.length > 0}
	<h3 class="h3 mb-4">Get your copy now!</h3>
{/if}

<div class="flex flex-col items-center justify-evenly xl:flex-row xl:items-start xl:justify-start xl:content-start">
	{#each items as link}
		<a class="my-1 flex flex-col items-center xl:items-start" href={link.url}>
			<img class="mr-2 w-8/12 xl:w-11/12" src={link.image} alt={link.label} />
		</a>
	{/each}
</div>
