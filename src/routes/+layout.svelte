<script lang="ts">
	import '../lib/styles.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import SiteMenu from '../lib/components/SiteMenu.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';
	import display from '../lib/assets/fonts/big-shoulders-display-800.woff2?url';

	let { children } = $props();

	// The list page's main area shares a name with the landing section it grows from.
	const sectionNames: Record<string, string> = {
		'/books': 'section-books',
		'/stories': 'section-stories',
		'/games': 'section-games',
		'/apps': 'section-apps'
	};
	const lists = ['/books', '/games', '/apps'];

	/** Picks the transition: a section grows into its list, a cover moves into its page. */
	function kind(from: string, to: string): 'section' | 'cover' | 'page' {
		if (from === '/' && to in sectionNames) return 'section';
		if (
			lists.some(
				(l) => (from === l && to.startsWith(`${l}/`)) || (to === l && from.startsWith(`${l}/`))
			)
		)
			return 'cover';
		return 'page';
	}

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const root = document.documentElement;
		root.dataset.vt = kind(navigation.from?.url.pathname ?? '', navigation.to?.url.pathname ?? '');
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// A newer navigation skips this transition, which is not an error.
			transition.ready.catch(() => {});
			transition.finished.finally(() => {
				delete root.dataset.vt;
			});
		});
	});
</script>

<svelte:head>
	<!-- Only the display font is needed for the first view; the body fonts load when the CSS asks. -->
	<link rel="preload" as="font" type="font/woff2" href={display} crossorigin="anonymous" />
</svelte:head>

<SiteMenu />
<main
	class:landing-main={page.url.pathname === '/'}
	style:view-transition-name={sectionNames[page.url.pathname]}
>
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
