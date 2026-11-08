<script lang="ts">
	import { onMount } from 'svelte';
	import type { Slide as SlideItem } from '../content/landing';
	import { FADE_MS, SLIDE_MS, shuffle } from '../slideshow';
	import Slide from './Slide.svelte';

	type Props = { slides: SlideItem[] };

	let { slides }: Props = $props();

	// Before the script runs, the built slide (the newest) shows and there is no button.
	let ready = $state(false);
	let order = $state<SlideItem[]>([]);
	// -1 is the built slide; the shuffled order starts at 0.
	let index = $state(-1);
	let fading = $state(false);
	let userPaused = $state(false);
	let hovered = $state(false);
	let focused = $state(false);

	const paused = $derived(userPaused || hovered || focused);
	const slide = $derived(index < 0 ? slides[0] : order[index % order.length]);

	onMount(() => {
		order = shuffle(slides);
		userPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Fade from the built slide to the first of the shuffled order.
		fading = true;
		ready = true;
	});

	$effect(() => {
		if (!ready || paused || order.length < 2) return;
		const timer = setTimeout(
			() => {
				if (fading) {
					index += 1;
					fading = false;
				} else {
					fading = true;
				}
			},
			fading ? FADE_MS : SLIDE_MS - FADE_MS
		);
		return () => clearTimeout(timer);
	});
</script>

<div class="show">
	<div
		class="stage"
		class:out={fading && !paused}
		role="group"
		aria-roledescription="slideshow"
		aria-label="Featured"
		onmouseenter={() => (hovered = true)}
		onmouseleave={() => (hovered = false)}
		onfocusin={() => (focused = true)}
		onfocusout={() => (focused = false)}
	>
		{#if slide}<Slide {slide} priority />{/if}
	</div>
	{#if ready}
		<button type="button" class="toggle" onclick={() => (userPaused = !userPaused)}>
			{userPaused ? 'Play slideshow' : 'Pause slideshow'}
		</button>
	{/if}
</div>

<style>
	.show {
		position: relative;
		height: 100%;
		min-height: 0;
	}
	.stage {
		height: 100%;
		transition: opacity var(--fade-duration) ease;
	}
	.stage.out {
		opacity: 0;
	}
	.toggle {
		position: absolute;
		top: 0;
		right: 0;
		min-height: 2.75rem;
		padding: 0 var(--space-2);
		border: 1px solid var(--ink);
		border-radius: var(--radius);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		.stage {
			transition: none;
		}
	}
</style>
