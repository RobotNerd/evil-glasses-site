<script lang="ts">
	import { formatDate } from '../content/format';
	import type { Snippet } from 'svelte';
	import type { Slide } from '../content/landing';

	type Props = {
		slide: Slide;
		/** Loads the image ahead of the others, for the slide that shows first. */
		priority?: boolean;
		/** Drawn over the image's bottom right corner, such as the slideshow's pause button. */
		overlay?: Snippet;
	};

	let { slide, priority = false, overlay }: Props = $props();
</script>

<article class="slide">
	<div class="media">
		<!-- The frame shrinks to the picture, so the overlay sits on the picture's corner. -->
		<div class="frame">
			<a class="image" href={slide.href} tabindex="-1" aria-hidden="true">
				<enhanced:img
					src={slide.image}
					alt=""
					sizes="(min-width: 48rem) 24rem, 60vw"
					fetchpriority={priority ? 'high' : 'low'}
				/>
			</a>
			{@render overlay?.()}
		</div>
	</div>
	<div class="text">
		<h2><a href={slide.href}>{slide.title}</a></h2>
		<p class="date">{formatDate(slide.date)}</p>
		<p class="summary">{slide.summary}</p>
	</div>
</article>

<style>
	.slide {
		display: grid;
		grid-template-rows: auto auto;
		align-content: start;
		gap: var(--space-2);
		min-height: 0;
		height: 100%;
	}

	.media {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		min-height: 0;
	}
	.frame {
		position: relative;
		max-width: 100%;
	}
	.image {
		display: block;
	}
	/* Both limits keep the picture's shape, so the image box is the picture. */
	.image :global(picture),
	.image :global(img) {
		display: block;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: calc(100dvh - 20rem);
	}

	.text {
		min-width: 0;
	}

	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: 1.15;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	h2 a {
		color: inherit;
		text-decoration: none;
	}
	h2 a:hover,
	h2 a:focus-visible {
		text-decoration: underline;
	}

	p {
		margin: var(--space-1) 0 0;
	}
	.date {
		color: var(--muted);
		font-size: 0.875rem;
	}
	.summary {
		display: none;
	}

	@media (min-width: 48rem) {
		.slide {
			grid-template-rows: none;
			grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
			align-items: start;
			gap: var(--space-4);
		}
		.image :global(picture),
		.image :global(img) {
			max-height: min(24rem, calc(100dvh - 24rem));
		}
		h2 {
			font-size: 2rem;
		}
		.date {
			font-size: 1rem;
		}
		.summary {
			display: block;
			font-family: var(--font-serif);
			font-size: 1.125rem;
			line-height: 1.4;
		}
	}
</style>
