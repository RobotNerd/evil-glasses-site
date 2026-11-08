<script lang="ts">
	import Badge from '../lib/components/Badge.svelte';
	import Logo from '../lib/components/Logo.svelte';
	import SeoHead from '../lib/components/SeoHead.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';
	import Slide from '../lib/components/Slide.svelte';

	let { data } = $props();

	// The next task cycles through the slides; for now the newest one shows.
	const slide = $derived(data.slides[0]);
</script>

<SeoHead
	title="Evil Glasses"
	description="Evil Glasses makes books, stories, games and apps with a little heart and a little mischief."
	path="/"
/>

<h1 class="visually-hidden">Evil Glasses</h1>

<div class="landing">
	<div class="logo">
		<Badge size="large">
			<Logo width={200} glint />
		</Badge>
	</div>
	<nav class="links" aria-label="Sections">
		{#each data.sections as section (section.href)}
			<a href={section.href}><span class="t">{section.title}</span></a>
		{/each}
	</nav>
	<div class="slot">
		{#if slide}<Slide {slide} priority />{/if}
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
		grid-template-columns: auto minmax(0, 1fr);
		grid-template-rows: auto minmax(0, 1fr) auto;
		grid-template-areas:
			'logo logo'
			'links slot'
			'footer footer';
		gap: var(--space-3) var(--space-4);
		padding: var(--space-3) var(--space-3) 0;
		background: var(--paper);
	}

	.landing > :global(footer) {
		grid-area: footer;
		width: 100%;
		margin: 0;
		max-width: none;
		box-sizing: border-box;
	}

	.logo {
		grid-area: logo;
		justify-self: center;
		width: clamp(9rem, 16vw, 13rem);
	}

	.links {
		grid-area: links;
		display: flex;
		flex-direction: column;
		justify-content: center;
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
		grid-area: slot;
		min-height: 0;
	}

	@media (min-width: 48rem) {
		.landing {
			grid-template-columns: 14rem minmax(0, 1fr);
			padding-inline: var(--space-5);
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
