<script lang="ts">
	import '../app.postcss';

	import { AppBar } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import SiteNav from '$lib/SiteNav.svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Drawer
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	initializeStores();
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />

<span class="visible md:hidden">
	<AppBar
		gridColumns="grid-cols-4"
		slotDefault="place-self-center col-span-2"
		slotTrail="place-content-end"
	>
		<svelte:fragment slot="lead">
			<button class="btn-icon btn-sm" on:click={drawerOpen}>
				<span class="fa-solid fa-bars"></span>
			</button>
		</svelte:fragment>
		Evil Glasses
		<svelte:fragment slot="trail">
			<LightSwitch />
		</svelte:fragment>
	</AppBar>
</span>

<span class="hidden md:block">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">
			<a href="/">
				<Avatar src="/avatar.png" width="w-12" rounded="rounded-full" />
			</a>
		</svelte:fragment>
		<SiteNav />
		<svelte:fragment slot="trail">
			<LightSwitch />
		</svelte:fragment>
	</AppBar>
</span>

<Drawer>
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">
			<span class="fa-solid fa-bars"></span>
		</svelte:fragment>
		Evil Glasses
		<svelte:fragment slot="trail">
			<button class="btn-icon btn-sm" on:click={drawerClose}>
				<span class="fa-solid fa-xmark"></span>
			</button>
		</svelte:fragment>
	</AppBar>
	<SiteNav isDrawer={true} on:drawerClose={drawerClose} />
</Drawer>

<span class="flex items-center justify-center">
	<img class="my-8 w-1/3 xl:w-1/4" src="/glasses.png" alt="evil glasses logo" />
</span>

<div class="container mx-auto flex h-full w-3/4 flex-col items-center justify-center">
	<h1 class="h1">Evil Glasses</h1>
	<h5 class="h5 text-center">Storytelling, software, and mobile games</h5>
</div>

<span class="my-4 flex flex-col items-center justify-center sm:flex-row">
	<hr class="w-1/2 !border-t-2" />
</span>

<div class="my-10 flex h-full flex-col items-center justify-center">
	<slot />
</div>

<SiteNav isTopNav={false} />

<div class="mb-20"></div>
