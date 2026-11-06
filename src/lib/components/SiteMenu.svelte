<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import Badge from './Badge.svelte';
	import Logo from './Logo.svelte';
	import { isCurrent, menuLinks } from './menu-links';

	let open = $state(false);
	// Until the page hydrates the button is a link to /menu, which works without JavaScript.
	let hydrated = $state(false);
	let root: HTMLElement | undefined = $state();
	let button: HTMLButtonElement | undefined = $state();

	onMount(() => {
		hydrated = true;
	});

	afterNavigate(() => {
		open = false;
	});

	async function toggle() {
		open = !open;
		if (open) {
			await tick();
			root?.querySelector<HTMLAnchorElement>('#site-menu a')?.focus();
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			open = false;
			button?.focus();
		}
	}

	function onClick(event: MouseEvent) {
		if (open && root && !root.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onkeydown={onKeydown} onclick={onClick} />

<div class="menu" bind:this={root}>
	{#if hydrated}
		<button
			type="button"
			class="menu-button"
			aria-label="Menu"
			aria-expanded={open}
			aria-controls="site-menu"
			bind:this={button}
			onclick={toggle}
		>
			<Badge><Logo width={44} /></Badge>
		</button>
	{:else}
		<a class="menu-button" href="/menu" aria-label="Menu">
			<Badge><Logo width={44} /></Badge>
		</a>
	{/if}
	<nav id="site-menu" aria-label="Main" hidden={!open}>
		<ul>
			{#each menuLinks as link, index (link.href)}
				{#if index === 5}<li class="divider" role="separator"></li>{/if}
				<li>
					<a
						href={link.href}
						class:display={link.display}
						aria-current={isCurrent(link.href, page.url.pathname) ? 'page' : undefined}
						>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<style>
	.menu {
		position: fixed;
		z-index: 10;
		top: calc(var(--space-3) + env(safe-area-inset-top));
		left: calc(var(--space-3) + env(safe-area-inset-left));
	}

	.menu-button {
		display: inline-flex;
		min-width: 3.75rem;
		min-height: 2.75rem;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}

	.menu-button :global(.badge) {
		flex: 1;
	}

	.menu-button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	nav {
		position: absolute;
		top: calc(100% + var(--space-2));
		left: 0;
		min-width: 12rem;
		padding: var(--space-2) 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.2);
	}

	nav[hidden] {
		display: none;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li a {
		display: block;
		padding: var(--space-2) var(--space-4);
		color: var(--ink);
		text-decoration: none;
	}

	li a:hover {
		background: var(--paper-2);
	}

	li a.display {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		line-height: 1.2;
		text-transform: uppercase;
	}

	li a[aria-current='page'] {
		color: var(--accent);
	}

	.divider {
		margin: var(--space-2) 0;
		border-top: 1px solid var(--line);
	}
</style>
