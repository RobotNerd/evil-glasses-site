<script lang="ts">
	import { page } from '$app/stores';

	let [date, edition, title] = $page.params.story.split('/');
	let contentPath = `../../../../lib/data/short-stories/${date}-edition-${edition}`;
</script>

<span class="w-3/4 md:w-1/2">
	{#await import(contentPath) then Module}

		<h1 class="h2 sm:h1 mb-1 sm:mb-4">{title}</h1>
		<h3 class="h4 sm:h3 mb-8">by TODO AUTHOR</h3>

    {@html Module.content[title]}

    {/await}
</span>
