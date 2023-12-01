<script lang="ts">
	import type { PurchaseInfo } from "$lib/util/Purchase";

	export let items: PurchaseInfo[];
</script>

{#if items.length > 0}
	<h3 class="h3 mb-4">Get your copy now!</h3>
{/if}

<div class="flex flex-col items-center justify-evenly">
	{#each items as link}
		<a
			class="card variant-ghost-primary card-hover my-4 flex flex-col w-1/2 items-center justify-center rounded-lg p-4"
			href={link.url}>
			<img class="m-1 w-8/12" src={link.image} alt={link.label} />
			<span class="text-xs text-center">{link.label}</span>
		</a>
	{/each}
</div>
