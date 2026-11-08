<script lang="ts">
	import Logo from '../lib/components/Logo.svelte';
	import SeoHead from '../lib/components/SeoHead.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';
	import Slideshow from '../lib/components/Slideshow.svelte';

	let { data } = $props();
</script>

<SeoHead
	title="Evil Glasses"
	description="Evil Glasses makes books, stories, games and apps with a little heart and a little mischief."
	path="/"
/>

<h1 class="visually-hidden">Evil Glasses</h1>

<div class="landing">
	<header class="banner">
		<div class="logo">
			<Logo width={200} glint />
		</div>
	</header>
	<div class="body">
		<nav class="links" aria-label="Sections">
			{#each data.sections as section (section.href)}
				<a href={section.href}><span class="t">{section.title}</span></a>
			{/each}
		</nav>
		<div class="slot">
			<Slideshow slides={data.slides} />
		</div>
	</div>
	<SiteFooter />
</div>

<style>
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* The landing page fills the screen, over the layout's padded column. */
	.landing {
		position: fixed;
		inset: 0;
		height: 100dvh;
		overflow: hidden;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		background: var(--paper);
	}

	/* A full-width banner, taller than the other pages' menu bar, with the logo in its middle. */
	.banner {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4) var(--space-3);
		padding-top: calc(var(--space-4) + env(safe-area-inset-top));
		background: var(--banner);
	}

	.logo {
		width: 7.25rem;
	}
	.logo :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	/* The links and the slide share the other pages' content width. */
	.body {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-4);
		width: 100%;
		max-width: var(--content-width);
		min-height: 0;
		margin: 0 auto;
		padding: var(--space-4) var(--space-3);
	}

	.landing > :global(footer) {
		width: 100%;
		margin-top: 0;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.links a {
		display: flex;
		align-items: center;
		min-height: 2.75rem;
		color: var(--ink);
		text-decoration: none;
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: 1.5rem;
	}
	.t {
		display: inline-block;
		transform-origin: left center;
		transition: transform 300ms ease;
	}
	.links a:focus-visible {
		outline: none;
	}
	.links a:focus-visible .t {
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 6px;
	}

	.slot {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	@media (min-width: 48rem) {
		/* Half again as big as on a phone. */
		.logo {
			width: clamp(10.75rem, 19vw, 15.5rem);
		}
		.body {
			grid-template-columns: 14rem minmax(0, 1fr);
			gap: var(--space-5);
			padding-block: var(--space-5);
		}
		.links a {
			font-size: clamp(2rem, 4vw, 3rem);
		}
		.links a:hover .t,
		.links a:focus-visible .t {
			transform: scale(1.12);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.t {
			transition: none;
		}
	}
</style>
