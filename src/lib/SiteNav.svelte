<script lang="ts">
	export let showIcons: boolean = true;
	export let vertical: boolean = false;

	const navHorizontal = 'flex items-center justify-center';

	$: topNavClass = vertical ? '' : navHorizontal;

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

{#if showIcons}
  <!-- Top navigation bar and drawer -->
	<nav class="list-nav">
		<ul class={topNavClass}>
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
  <!-- Bottom of page navigation -->
	<ul class={topNavClass}>
		{#each navItems as navItem, i}
			{#if i > 0}
				<li class="mx-1">|</li>
			{/if}
			<li>
				<a href={navItem.url} class="hover:underline">
					<span class="flex-auto">{navItem.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	<ul class={navHorizontal}>
		{#each additionalNavItems as navItem, i}
			{#if i > 0}
				<li class="mx-1">|</li>
			{/if}
			<li>
				<a href={navItem.url} class="hover:underline">
					<span class="flex-auto">{navItem.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	<span class={navHorizontal}>
		<hr class="w-1/2 !border-t-2" />
	</span>

	<span class={navHorizontal}>
		<a class="hover:underline" href="mailto:contact@evilglasses.com">contact@evilglasses.com</a>
	</span>

	<span class={navHorizontal}> Copyright 2023. All rights reserved. </span>
{/if}
