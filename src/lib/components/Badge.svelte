<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		/** The large badge stacks the logo over a tagline, as on the landing page. */
		size?: 'small' | 'large';
		tagline?: string;
	};

	let { children, size = 'small', tagline }: Props = $props();
</script>

<!-- The sticker-blue rounded rectangle the logo always sits on, the same in light and dark mode. -->
<span class="badge" class:large={size === 'large'}>
	{@render children()}
	{#if size === 'large' && tagline}<span class="tagline">{tagline}</span>{/if}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--badge);
		color: var(--badge-ink);
		border: 1.5px solid var(--badge-ink);
		border-radius: 0.75rem;
	}

	.large {
		flex-direction: column;
		gap: 0.15em;
		width: 100%;
		padding: 12% 14% 10%;
		border-width: 2px;
		border-radius: 26% / 34%;
	}

	.large :global(svg) {
		width: 100%;
		height: auto;
	}

	.tagline {
		font-family: var(--font-serif);
		font-style: italic;
		text-align: center;
		text-wrap: balance;
		font-size: clamp(0.85rem, 1.5vw, 1.15rem);
		line-height: 1.25;
	}
</style>
