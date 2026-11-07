<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import Badge from './Badge.svelte';
	import Logo from './Logo.svelte';
	import { isCurrent, menuLinks, sectionLinks } from './menu-links';
	import { parentPage } from './parent-page';

	// The landing page has no bar: the button floats in the top-right corner.
	const landing = $derived(page.url.pathname === '/');
	let open = $state(false);
	// Until the page hydrates the button is a link to /menu, which works without JavaScript.
	let hydrated = $state(false);
	let root: HTMLElement | undefined = $state();
	let button: HTMLButtonElement | undefined = $state();

	onMount(() => {
		hydrated = true;
	});

	// A non-null `from` means the page was reached from another page of this site.
	let fromSite = false;

	afterNavigate((navigation) => {
		open = false;
		fromSite = navigation.from !== null;
	});

	function goBack(event: MouseEvent) {
		if (!fromSite || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
		event.preventDefault();
		history.back();
	}

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

<div class="menu" class:floating={landing} class:bar={!landing} bind:this={root}>
	{#if !landing}
		<!-- Without JavaScript this is a plain link to the parent page. -->
		<a class="back" href={parentPage(page.url.pathname)} aria-label="Back" onclick={goBack}>
			<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
				<path
					d="M19 12H5m6-6-6 6 6 6"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
		<a class="site-name" href="/">evilglasses.com</a>
		<nav class="sections" aria-label="Sections">
			<ul>
				{#each sectionLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							aria-current={isCurrent(link.href, page.url.pathname) ? 'page' : undefined}
							>{link.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
	<div class="trigger">
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
					{#if index === 5}<li class="divider section-item" role="separator"></li>{/if}
					<li class:section-item={index < 5}>
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
</div>

<style>
	.menu.floating {
		position: fixed;
		z-index: 10;
		top: calc(var(--space-3) + env(safe-area-inset-top));
		right: calc(var(--space-3) + env(safe-area-inset-right));
	}

	/* The bar sticks to the top. Its opaque background hides text scrolling under it. */
	.menu.bar {
		position: sticky;
		z-index: 10;
		top: 0;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		min-height: 4rem;
		padding: var(--space-2) var(--space-3);
		padding-top: calc(var(--space-2) + env(safe-area-inset-top));
		background: var(--paper);
		border-bottom: 1px solid var(--line);
	}

	.back {
		display: inline-flex;
		grid-area: 1 / 1;
		justify-self: start;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		color: var(--ink);
	}

	.back:hover {
		color: var(--accent);
	}

	.trigger {
		position: relative;
		grid-area: 1 / 3;
		justify-self: end;
	}

	.site-name {
		grid-area: 1 / 2;
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.25rem;
		text-decoration: none;
		text-transform: uppercase;
	}

	.sections {
		display: none;
		grid-area: 1 / 2;
	}

	.sections ul {
		display: flex;
		gap: var(--space-4);
	}

	.sections a {
		padding: var(--space-1) 0;
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.25rem;
		text-decoration: none;
		text-transform: uppercase;
	}

	.sections a:hover,
	.sections a[aria-current='page'] {
		color: var(--accent);
	}

	@media (min-width: 768px) {
		.site-name {
			display: none;
		}

		.sections {
			display: block;
		}

		/* The bar carries the section links, so the popup keeps only About and Legal. */
		.bar .section-item {
			display: none;
		}
	}

	.menu-button {
		display: inline-flex;
		min-width: 3.75rem;
		min-height: 2.75rem;
		padding: 0;
		border: 0;
		border-radius: 0.75rem;
		background: none;
		cursor: pointer;
		/* A soft drop shadow and a 2px white ring lift the button off busy images. */
		box-shadow:
			0 0 0 2px #fff,
			0 0.25rem 0.75rem rgb(0 0 0 / 0.3);
		transition: transform 140ms ease-out;
	}

	@media (hover: hover) {
		.menu-button:hover {
			transform: scale(1.06);
		}
	}

	.menu-button :global(.badge) {
		flex: 1;
	}

	.menu-button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	#site-menu {
		position: absolute;
		z-index: 1;
		top: calc(100% + var(--space-3));
		right: 0;
		min-width: 12rem;
		padding: var(--space-2) 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.2);
	}

	#site-menu[hidden] {
		display: none;
	}

	#site-menu:not([hidden]) {
		transform-origin: top right;
		animation: menu-in 140ms ease-out;
	}

	@keyframes menu-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
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
