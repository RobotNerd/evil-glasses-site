<script lang="ts">
	import '../app.postcss';

	import { AppBar } from '@skeletonlabs/skeleton';
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

<link rel="stylesheet" href="../../node_modules/@fortawesome/fontawesome-free/css/all.min.css" />

<span class="visible sm:hidden">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
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

<span class="hidden sm:block">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">
			<a href="/">
				<img src="/favicon.png" alt="evil glasses logo" />
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
	<SiteNav isDrawer={true} />
</Drawer>

<slot />

<SiteNav isTopNav={false} />
