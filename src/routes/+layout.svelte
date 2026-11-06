<script lang="ts">
	import '../lib/styles.css';
	import SiteHeader from '../lib/components/SiteHeader.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

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
