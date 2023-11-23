<script lang="ts">
	import type { BookMeta } from './util/Story';

	export let book: BookMeta;
</script>

<h3 class="h3 mb-4">Get your copy now!</h3>

<div class="flex flex-col items-center justify-evenly">
	{#each book.bookLinks as link}
		<a
			class="card variant-ghost-primary card-hover mb-4 flex w-3/4 flex-col items-center justify-center rounded-lg p-4"
			href={link.url}
		>
			<img class="m-1 w-8/12" src={link.image} alt={link.label} />
			<span class="text-xs">{link.label}</span>
		</a>
	{/each}
</div>
