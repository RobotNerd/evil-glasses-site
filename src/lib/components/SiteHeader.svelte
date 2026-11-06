<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import logo from '../assets/evil-glasses.svg';
	import X from '@lucide/svelte/icons/x';

	const links = [
		{ href: '/books', label: 'Books' },
		{ href: '/stories', label: 'Stories' },
		{ href: '/games', label: 'Games' },
		{ href: '/apps', label: 'Apps' },
		{ href: '/about', label: 'About' }
	];

	let open = $state(false);
</script>

<header>
	<a class="brand" href="/"><img src={logo} alt="Evil Glasses" width="105" height="50" /></a>
	<button
		type="button"
		class="menu-button"
		aria-expanded={open}
		aria-controls="site-nav"
		aria-label="Menu"
		onclick={() => (open = !open)}
	>
		{#if open}<X aria-hidden="true" />{:else}<Menu aria-hidden="true" />{/if}
	</button>
	<nav id="site-nav" aria-label="Main" class:open>
		<ul>
			{#each links as link (link.href)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		max-width: var(--content-width);
		margin: 0 auto;
		padding: var(--space-3);
	}

	.brand {
		display: inline-flex;
		font-weight: 700;
		color: var(--color-text);
		text-decoration: none;
	}

	.brand img {
		height: 2.5rem;
		width: auto;
	}

	.menu-button {
		display: none;
		padding: var(--space-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		color: var(--color-text);
		cursor: pointer;
	}

	ul {
		display: flex;
		gap: var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (max-width: 40rem) {
		.menu-button {
			display: inline-flex;
		}

		nav {
			display: none;
			width: 100%;
		}

		nav.open {
			display: block;
		}

		ul {
			flex-direction: column;
			gap: var(--space-2);
		}
	}
</style>
