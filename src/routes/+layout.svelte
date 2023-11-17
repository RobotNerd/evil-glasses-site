<script lang="ts">
	import '../app.postcss';

	import { AppBar } from '@skeletonlabs/skeleton';

	import SiteNav from '$lib/SiteNav.svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<link rel="stylesheet" href="../../node_modules/@fortawesome/fontawesome-free/css/all.min.css" />

<span class="visible sm:hidden">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">
			<span class="fa-solid fa-bars"></span>
		</svelte:fragment>
		Evil Glasses
	</AppBar>
</span>

<span class="hidden sm:block">
	<SiteNav />
</span>

<slot />

<SiteNav showIcons={false} />
