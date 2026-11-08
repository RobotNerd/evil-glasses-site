<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		/** The large badge fills its container, as on the landing page. */
		size?: 'small' | 'large';
	};

	let { children, size = 'small' }: Props = $props();
</script>

<!-- The sticker-blue rounded rectangle the logo always sits on, the same in light and dark mode. -->
<span class="badge" class:large={size === 'large'}>
	{@render children()}
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
		width: 100%;
		padding: 8% 10%;
		border-width: 2px;
		border-radius: 26% / 34%;
	}

	.large :global(svg) {
		width: 100%;
		height: auto;
	}
</style>
