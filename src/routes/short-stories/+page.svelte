<script lang="ts">
	import { Stories } from '$lib/data/short-story-meta';
	import type { ShortStoryMeta } from '$lib/util/Story';
	import CardItem from '$lib/CardItem.svelte';

	let stories: ShortStoryMeta[] = [...Object.values(Stories)].reverse();
</script>

<h1 class="h1">Short Stories</h1>

<div
	class="flex flex-col flex-wrap items-center justify-center sm:w-2/3 sm:flex-row sm:items-start"
>
	{#each stories as story}
		<CardItem
			description={`Edition ${parseInt(story.edition)}`}
			image={`/short-stories/${story.date}-edition-${story.edition}.png`}
			imageDescription={'cover'}
			title={"Short Stories"}
			url={story.route}
			icon="fa-file-lines"
		/>
	{/each}
</div>
