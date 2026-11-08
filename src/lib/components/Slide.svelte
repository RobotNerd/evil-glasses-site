<script lang="ts">
	import { formatDate } from '../content/format';
	import type { Slide } from '../content/landing';

	type Props = {
		slide: Slide;
		/** Loads the image ahead of the others, for the slide that shows first. */
		priority?: boolean;
	};

	let { slide, priority = false }: Props = $props();
</script>

<article class="slide">
	<a class="image" href={slide.href} tabindex="-1" aria-hidden="true">
		<enhanced:img
			src={slide.image}
			alt=""
			sizes="(min-width: 48rem) 40vw, 50vw"
			fetchpriority={priority ? 'high' : 'low'}
		/>
	</a>
	<div class="text">
		<h2><a href={slide.href}>{slide.title}</a></h2>
		<p class="date">{formatDate(slide.date)}</p>
		<p class="summary">{slide.summary}</p>
	</div>
</article>

<style>
	.slide {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: var(--space-2);
		min-height: 0;
		height: 100%;
	}

	.image {
		display: flex;
		justify-content: center;
		min-height: 0;
	}
	.image :global(picture),
	.image :global(img) {
		display: block;
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: 100%;
		object-fit: contain;
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
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: center;
			gap: var(--space-4);
		}
		.image {
			height: 100%;
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
