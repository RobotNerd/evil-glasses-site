<script lang="ts">
	import '../lib/styles.css';
	import SiteHeader from '../lib/components/SiteHeader.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';
	import display from '../lib/assets/fonts/big-shoulders-display-800.woff2?url';
	import serif from '../lib/assets/fonts/literata.woff2?url';
	import serifItalic from '../lib/assets/fonts/literata-italic.woff2?url';

	let { children } = $props();
</script>

<svelte:head>
	{#each [display, serif, serifItalic] as href (href)}
		<link rel="preload" as="font" type="font/woff2" {href} crossorigin="anonymous" />
	{/each}
</svelte:head>

<SiteHeader />
<main>
	{@render children()}
</main>
<SiteFooter />

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: var(--space-3);
	}
</style>
