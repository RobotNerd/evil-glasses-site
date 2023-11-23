<script lang="ts">
	import type { MultiView } from '$lib/util/MultiView';
	import ViewMultiple from '$lib/ViewMultiple.svelte';

  import { Games } from '$lib/data/game-meta';

	let items: MultiView[] = [];
	for (let [title, game] of Object.entries(Games)) {
		items.push({
			image: game.image,
			name: title,
			route: `/games/${title}`
		});
	}
	items.reverse();
</script>

<h1 class="h1">Games</h1>

<ViewMultiple {items} />
