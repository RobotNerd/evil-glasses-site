<script lang="ts">
	import '../lib/styles.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import SiteMenu from '../lib/components/SiteMenu.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';
	import display from '../lib/assets/fonts/big-shoulders-display-800.woff2?url';

	let { children } = $props();

	const sections = ['/books', '/stories', '/games', '/apps'];
	const lists = ['/books', '/games', '/apps'];

	/** Picks the transition: the landing page and a list fade, a cover moves into its page. */
	function kind(from: string, to: string): 'fade' | 'cover' | 'page' {
		if ((from === '/' && sections.includes(to)) || (to === '/' && sections.includes(from)))
			return 'fade';
		if (
			lists.some(
				(l) => (from === l && to.startsWith(`${l}/`)) || (to === l && from.startsWith(`${l}/`))
			)
		)
			return 'cover';
		return 'page';
	}

	let current = 0;

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const root = document.documentElement;
		const id = ++current;
		root.dataset.vt = kind(navigation.from?.url.pathname ?? '', navigation.to?.url.pathname ?? '');
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// A newer navigation skips this transition, which is not an error.
			transition.ready.catch(() => {});
			transition.finished.finally(() => {
				// A newer transition may already have set its own kind.
				if (id === current) delete root.dataset.vt;
			});
		});
	});
</script>

<svelte:head>
	<!-- Only the display font is needed for the first view; the body fonts load when the CSS asks. -->
	<link rel="preload" as="font" type="font/woff2" href={display} crossorigin="anonymous" />
</svelte:head>

<SiteMenu />
<main class:landing-main={page.url.pathname === '/'}>
	{@render children()}
</main>
{#if page.url.pathname !== '/'}
	<SiteFooter />
{/if}

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: var(--space-3);
	}

	/* The landing page has no bar; its column starts below the floating menu button. */
	main.landing-main {
		padding-top: calc(4.5rem + env(safe-area-inset-top));
	}
</style>
