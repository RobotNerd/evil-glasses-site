<script lang="ts">
	export let isTopNav: boolean = true;
	export let isDrawer: boolean = false;

	const navDefault: string = 'flex flex-col sm:flex-row items-center justify-center';
	const navDrawer: string = '';

	let navClass: string = isDrawer ? navDrawer : navDefault;

	const navItems = [
		{
			name: 'Home',
			icon: 'fa-house',
			url: '/'
		},
		{
			name: 'Books',
			icon: 'fa-book',
			url: '/books'
		},
		{
			name: 'Stories',
			icon: 'fa-file-lines',
			url: '/short-stories'
		},
		{
			name: 'Games',
			icon: 'fa-gamepad',
			url: '/games'
		},
		{
			name: 'Software',
			icon: 'fa-code',
			url: '/software'
		}
	];

	const additionalNavItems = [
		{
			name: 'Legal',
			url: '/legal'
		},
		{
			name: 'About',
			url: '/about'
		}
	];
</script>

{#if isTopNav}
	<!-- Top navigation bar and drawer -->
	<nav class="list-nav">
		<ul class={navClass}>
			{#each navItems as navItem, i}
				<li>
					<a href={navItem.url}>
						<span class="fa-solid {navItem.icon}"></span>
						<span class="flex-auto">{navItem.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{:else}
	<span class="{navClass} my-4">
		<hr class="w-1/2 !border-t-2" />
	</span>

	<!-- Bottom of page navigation -->
	<ul class={navClass}>
		{#each navItems as navItem, i}
			{#if i > 0}
				<li class="mx-1 hidden sm:flex">|</li>
			{/if}
			<li>
				<a href={navItem.url} class="hover:underline">
					<span class="flex-auto">{navItem.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	<ul class="{navClass} mt-4">
		{#each additionalNavItems as navItem, i}
			{#if i > 0}
				<li class="mx-1 hidden sm:flex">|</li>
			{/if}
			<li>
				<a href={navItem.url} class="hover:underline">
					<span class="flex-auto">{navItem.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	<span class="{navClass} my-4">
		<hr class="w-1/2 !border-t-2" />
	</span>

	<span class={navClass}>
		<a class="hover:underline" href="mailto:contact@evilglasses.com">contact@evilglasses.com</a>
	</span>

	<span class={navClass}> Copyright 2023. All rights reserved. </span>
{/if}
