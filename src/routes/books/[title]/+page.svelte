<script lang="ts">
	import { page } from '$app/stores';
	import { Books } from '$lib/data/book-meta';
	import type { BookMeta } from '$lib/util/Story';

	let book: BookMeta = Books[$page.params.title];
</script>

<h1 class="h1 mb-8">{$page.params.title}</h1>

<div class="w-3/4 sm:w-1/2">
	<img class="mb-8" src={book.coverImage} alt="book cover" />

	<h3 class="h3 mb-4">Get your copy now!</h3>

	<div class="flex flex-col justify-evenly sm:w-auto sm:flex-row">
		{#each book.bookLinks as link}
			<a
				class="card variant-ghost-primary card-hover mb-4 flex w-3/4 flex-col items-center justify-center rounded-lg p-4 sm:w-1/4"
				href={link.url}
			>
				<img class="w-8/12 m-1" src={link.image} alt={link.label} />
				<span class="text-xs">{link.label}</span>
			</a>
		{/each}
	</div>

	<h3 class="h3 mb-4">{book.subtitle}</h3>

	<p class="mb-4">
		{book.synopsis}
	</p>

	<h3 class="h3 mb-4">About the Author</h3>

	<p class="mb-4">
		{book.authorDescription}
	</p>
</div>
