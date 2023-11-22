<script lang="ts">
	import type { MultiView } from '$lib/util/MultiView';
	import ViewMultiple from '$lib/ViewMultiple.svelte';

  import { Books } from '$lib/data/book-meta';

	let items: MultiView[] = [];
	for (let [title, book] of Object.entries(Books)) {
		items.push({
			image: book.coverImage,
			name: title,
			route: `/books/${title}`
		});
	}
	items.reverse();
</script>

<h1 class="h1">Books</h1>

<ViewMultiple {items} />
