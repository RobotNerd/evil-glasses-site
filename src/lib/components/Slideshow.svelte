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

	// Focus on the button itself does not hold the slide, or Play would never resume.
	const isToggle = (target: EventTarget | null) =>
		target instanceof Element && target.classList.contains('toggle');

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
		onfocusin={(event) => (focused = !isToggle(event.target))}
		onfocusout={() => (focused = false)}
	>
		{#if slide}
			<Slide {slide} priority>
				{#snippet overlay()}
					{#if ready}
						<button
							type="button"
							class="toggle"
							aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
							onclick={() => (userPaused = !userPaused)}
						>
							<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
								{#if userPaused}
									<path d="M8 5v14l11-7z" fill="currentColor" />
								{:else}
									<path
										d="M8 5v14M16 5v14"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
									/>
								{/if}
							</svg>
						</button>
					{/if}
				{/snippet}
			</Slide>
		{/if}
	</div>
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
	/* The same size as the phone menu's hamburger, on the image's bottom right corner. */
	.toggle {
		position: absolute;
		right: var(--space-2);
		bottom: var(--space-2);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		color: var(--ink);
		cursor: pointer;
	}
	.toggle:hover {
		color: var(--accent);
	}
	.toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* With a pointer that hovers, the button shows only while the pointer is on the slideshow. */
	@media (hover: hover) {
		.toggle {
			opacity: 0;
		}
		.show:hover .toggle,
		.toggle:focus-visible {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage {
			transition: none;
		}
	}
</style>
