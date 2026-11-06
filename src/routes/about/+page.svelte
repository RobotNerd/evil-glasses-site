<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
	const page = $derived(data.page);
</script>

<SeoHead title={page.data.title} description={page.data.description} path="/about" />

<article>
	<h1>{page.data.title}</h1>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html page.html}
</article>

<style>
	article :global(img) {
		display: block;
		width: 100%;
		max-width: 20rem;
		height: auto;
		border-radius: var(--radius);
	}
</style>
