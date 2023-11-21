<script lang="ts">
	import type { MultiView } from './util/MultiView';

	export let items: MultiView[];
</script>

<div class="flex flex-row flex-wrap justify-center">
	{#each items as item}
		<a
			class="card variant-ghost-secondary card-hover m-4 flex w-1/2 flex-col rounded-lg p-4 text-center sm:w-1/5"
			href={item.route}
		>
			<img src={item.image} alt={item.name} />
			{item.name}
		</a>
	{/each}
</div>
