<script lang="ts">
  import type { BookMeta } from './util/Story';
  import BookLinks from '$lib/BookLinks.svelte';

  export let book: BookMeta;
  export let description: string = 'DESCRIPTION';
  export let image: string = 'IMAGE';
  export let imageDescription: string = 'IMAGE DESCRIPTION';
  export let title: string = 'TITLE';
</script>

<div class="flex flex-col w-3/4 sm:w-1/2 items-center">
	<img class="mb-8 w-2/3" src="{image}" alt="{imageDescription}" />

  <h3 class="h3 mb-4">{title}</h3>

	<p class="mb-4">
		{description}
	</p>

  {#if book}
    <BookLinks book={book} />
  {/if}
</div>
