<script lang="ts">
	export let items: any;
</script>

<div class="flex flex-row flex-wrap justify-center">
	{#each [...items].reverse() as item}
		<a
			class="card variant-ghost-secondary card-hover m-4 flex w-1/2 flex-col rounded-lg p-4 text-center sm:w-1/5"
			href="/short-stories/{item.date}/{item.edition}/"
		>
			<img src="/short-stories/{item.date}-edition-{item.edition}.png" alt="{item.name}" />
			{item.name}
		</a>
	{/each}
</div>
