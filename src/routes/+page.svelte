<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Badge from '../lib/components/Badge.svelte';
	import Logo from '../lib/components/Logo.svelte';
	import SeoHead from '../lib/components/SeoHead.svelte';

	let { data } = $props();

	// Quadrant classes, in the same order as the sections: books, stories, games, apps.
	const quadrants = ['books', 'stories', 'games', 'apps'];

	// The glint plays as the page mounts, which covers back and forward too. Restart it after a
	// client navigation in case the page was kept alive.
	afterNavigate(({ type }) => {
		if (type === 'enter') return;
		for (const animation of document.querySelector('.landing .glint')?.getAnimations() ?? []) {
			animation.currentTime = 0;
		}
	});
</script>

<SeoHead
	title="Evil Glasses"
	description="Evil Glasses makes books, stories, games and apps with a little heart and a little mischief."
	path="/"
/>

<h1 class="visually-hidden">Evil Glasses</h1>

<div class="landing">
	{#each data.sections as section, index (section.href)}
		<a class="sec {quadrants[index]}" href={section.href}>
			<span class="bg" style="view-transition-name: section-{quadrants[index]}">
				{#if section.image}
					<enhanced:img
						src={section.image}
						alt=""
						sizes="50vw"
						fetchpriority={index === 0 ? 'high' : 'low'}
					/>
				{/if}
			</span>
			<span class="fade"></span>
			<span class="vig"></span>
			<span class="t">{section.title}</span>
		</a>
	{/each}
	<span class="line horizontal"></span>
	<span class="line vertical"></span>
	<span class="glow"></span>
	<div class="hub">
		<Badge size="large" tagline="books, stories, games, and apps">
			<Logo width={200} glint />
		</Badge>
	</div>
</div>

<style>
	@property --vig {
		syntax: '<percentage>';
		inherits: true;
		initial-value: 30%;
	}

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
		container-type: inline-size;
		isolation: isolate;
		background: var(--paper);
	}

	/*
	 * Each section is the full screen, cut to its quadrant by a clip-path polygon, so the
	 * motion task can grow one polygon to the whole screen. Its layers sit in the quadrant box
	 * given by --top, --right, --bottom and --left.
	 */
	.sec {
		--vig: 30%;
		--top: 0%;
		--right: 0%;
		--bottom: 0%;
		--left: 0%;
		position: absolute;
		inset: 0;
		display: block;
		overflow: hidden;
		color: var(--ink);
		text-decoration: none;
		transition: --vig 300ms ease;
	}

	.books {
		--right: 50%;
		--bottom: 50%;
		clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
	}
	.stories {
		--left: 50%;
		--bottom: 50%;
		clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
	}
	.games {
		--top: 50%;
		--right: 50%;
		clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%);
	}
	.apps {
		--top: 50%;
		--left: 50%;
		clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
	}

	.bg,
	.fade,
	.vig {
		position: absolute;
		inset: var(--top) var(--right) var(--bottom) var(--left);
	}

	.bg {
		filter: saturate(0.85);
		transform: scale(1.12);
		transition: transform 300ms ease;
	}
	.bg :global(img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.fade {
		background: var(--paper);
		opacity: 0.8;
		transition: opacity 300ms ease;
	}

	.vig {
		background: radial-gradient(ellipse at 50% 50%, transparent var(--vig), var(--vignette) 115%);
	}

	.t {
		position: absolute;
		left: calc((var(--left) + 100% - var(--right)) / 2);
		top: calc((var(--top) + 100% - var(--bottom)) / 2);
		transform: translate(-50%, -50%) scale(1);
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: clamp(1.25rem, 5.4cqi, 3rem);
		white-space: nowrap;
		transition: transform 300ms ease;
	}

	.sec:hover,
	.sec:focus-visible {
		--vig: 50%;
	}
	.sec:hover .bg,
	.sec:focus-visible .bg {
		transform: scale(1);
	}
	.sec:hover .fade,
	.sec:focus-visible .fade {
		opacity: 0.6;
	}
	.sec:hover .t,
	.sec:focus-visible .t {
		transform: translate(-50%, -50%) scale(1.12);
	}
	.sec:focus-visible {
		outline: none;
	}
	.sec:focus-visible .t {
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 6px;
	}

	.line {
		position: absolute;
		background: var(--ink);
		opacity: 0.75;
		pointer-events: none;
	}
	.horizontal {
		left: 0;
		right: 0;
		top: calc(50% - 0.5px);
		height: 1px;
	}
	.vertical {
		top: 0;
		bottom: 0;
		left: calc(50% - 0.5px);
		width: 1px;
	}

	.hub {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: clamp(13rem, 24vw, 22rem);
		pointer-events: none;
	}

	/* A soft dark pool behind the badge that darkens the section images near the center. */
	.glow {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(clamp(13rem, 24vw, 22rem) * 2);
		aspect-ratio: 1;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: radial-gradient(
			circle closest-side,
			rgb(0 0 0 / 0.6) 0%,
			rgb(0 0 0 / 0.45) 55%,
			transparent 100%
		);
		pointer-events: none;
	}

	@media (prefers-color-scheme: dark) {
		.fade {
			opacity: 0.78;
		}
		.sec:hover .fade,
		.sec:focus-visible .fade {
			opacity: 0.56;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sec,
		.bg,
		.fade,
		.t {
			transition: none;
		}
	}
</style>
