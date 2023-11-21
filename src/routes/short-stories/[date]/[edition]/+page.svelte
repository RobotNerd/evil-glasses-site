<script lang="ts">
	import DetailHeader from '$lib/DetailHeader.svelte';
	import { page } from '$app/stores';
	import { Stories } from '$lib/data/short-story-meta';

	const edition: number = parseInt($page.params.edition);
	const image = `/short-stories/${$page.params.date}-edition-${$page.params.edition}.png`;
	const imageAlt = `Evil Glasses short stories edition ${edition}`;
	const pdfLink = `/short-stories/${$page.params.date}-edition-${$page.params.edition}.pdf`;
</script>

<DetailHeader title="Evil Glasses Short Stories" subtitle="Edition {edition}" {image} {imageAlt} />

<h3 class="h3 mb-4">Read Online</h3>

<div>
	{#each Stories[edition].stories as story}
		<div>
			<a class="underline" href="/short-stories/read/{$page.params.date}/{story.title}"
				>{story.title}</a
			>
			by {story.author}
		</div>
	{/each}
</div>

<h3 class="h3 my-4">Or</h3>

<a class="variant-filled-secondary rounded-lg p-4" href={pdfLink}>
	<span class="fa-regular fa-file-pdf" />
	Download PDF
</a>
