<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!-- The sticker-blue rounded rectangle the logo always sits on, the same in light and dark mode. -->
<span class="badge">{@render children()}</span>

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
</style>
