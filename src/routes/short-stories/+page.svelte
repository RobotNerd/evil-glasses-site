<script lang="ts">
	import { Stories } from '$lib/data/short-story-meta';
	import type { MultiView } from '$lib/util/MultiView';
	import ViewMultiple from '$lib/ViewMultiple.svelte';

	let items: MultiView[] = [];
	for (let story of Object.values(Stories)) {
		items.push({
			image: `/short-stories/${story.date}-edition-${story.edition}.png`,
			name: story.name,
			route: story.route
		});
	}
	items.reverse();
</script>

<h1 class="h1">Short Stories</h1>

<ViewMultiple {items} />
