<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	import sticker from '../../lib/assets/evil-glasses-sticker.svg?url';
	let { data } = $props();
	const page = $derived(data.page);
</script>

<SeoHead title={page.data.title} description={page.data.description} path="/about" />

<article>
	<img class="sticker" src={sticker} alt="EvilGlasses.com sticker" width="622" height="415" />
	<h1>{page.data.title}</h1>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html page.html}
</article>

<style>
	.sticker {
		display: block;
		width: 14rem;
		max-width: 60%;
		height: auto;
		margin-block: var(--space-2) var(--space-4);
		margin-inline: auto;
		transform: rotate(-6deg);
	}
	@media (min-width: 48rem) {
		.sticker {
			float: right;
			margin-inline: var(--space-4) 0;
		}
	}
	article :global(img:not(.sticker)) {
		display: block;
		width: 100%;
		max-width: 20rem;
		height: auto;
		border-radius: var(--radius);
	}
</style>
