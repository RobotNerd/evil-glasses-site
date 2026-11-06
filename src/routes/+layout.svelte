<script lang="ts">
	import '../lib/styles.css';
	import { page } from '$app/state';
	import SiteMenu from '../lib/components/SiteMenu.svelte';
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

<SiteMenu />
<main>
	{@render children()}
</main>
{#if page.url.pathname !== '/'}
	<SiteFooter />
{/if}

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
		/* The column starts below the floating menu button. */
		padding: calc(4.5rem + env(safe-area-inset-top)) var(--space-3) var(--space-3);
	}
</style>
