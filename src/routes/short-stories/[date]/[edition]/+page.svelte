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

<div class="w-1/2 sm:w-1/3">
	{#each Stories[edition].stories as story}
		<a
			class="card variant-ghost card-hover mb-8 flex flex-col rounded-lg p-4"
			href="/short-stories/read/{$page.params.date}/{story.title}"
		>
			<h3 class="h3">{story.title}</h3>
			by {story.author}
			<div class="my-4">{story.synopsis}</div>
		</a>
	{/each}
</div>

<h3 class="h3 my-4">Or</h3>

<a class="variant-filled-secondary rounded-lg p-4" href={pdfLink}>
	<span class="fa-regular fa-file-pdf" />
	Download PDF
</a>
