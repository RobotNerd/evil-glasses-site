<script lang="ts">
	import { page } from '$app/stores';

	let [date, edition, title] = $page.params.story.split('/');
	let contentPath = `../../../../lib/data/short-stories/${date}-edition-${edition}`;
</script>

<h1 class="h1 mb-4">{title}</h1>
<h3 class="h3 mb-8">TODO AUTHOR</h3>

<div class="w-3/4 md:w-1/2">
	{#await import(contentPath) then Module}
		{@html Module.content[title]}
	{/await}
</div>
