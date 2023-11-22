<script lang="ts">
	import { page } from '$app/stores';
	import { Books } from '$lib/data/book-meta';
	import type { BookMeta } from '$lib/util/Story';
  import BookLinks from '$lib/BookLinks.svelte';

	let book: BookMeta = Books[$page.params.title];
</script>

<h1 class="h1 mb-8">{$page.params.title}</h1>

<div class="w-3/4 sm:w-1/2">
	<img class="mb-8" src={book.coverImage} alt="book cover" />

  <BookLinks book={book} />

	<h3 class="h3 mb-4">{book.subtitle}</h3>

	<p class="mb-4">
		{book.synopsis}
	</p>

	<h3 class="h3 mb-4">About the Author</h3>

	<p class="mb-4">
		{book.authorDescription}
	</p>
</div>
