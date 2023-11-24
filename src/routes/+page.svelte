<script lang="ts">
	import Featured from '$lib/Featured.svelte';
	import { featured } from '$lib/data/featured';
	import { Books } from '$lib/data/book-meta';
	import { Games } from '$lib/data/game-meta';

	import LatestItem from '$lib/LatestItem.svelte';
</script>

<h2 class="h2 mb-8">Featured</h2>

<Featured featuredItems={featured} />

<h2 class="h2 my-12">Latest</h2>

<div
	class="flex flex-col flex-wrap items-center justify-center sm:w-2/3 sm:flex-row sm:items-start"
>
	<LatestItem
		description={Books['Press Start for Love'].synopsis}
		image={Books['Press Start for Love'].coverImage}
		imageDescription={'cover image'}
		purchaseLinks={Books['Press Start for Love'].purchaseLinks}
		title={'Press Start for Love'}
		url={Books['Press Start for Love'].route}
	/>

	<LatestItem
		description={Books['Mixed Martial Hearts'].synopsis}
		image={Books['Mixed Martial Hearts'].coverImage}
		imageDescription={'cover image'}
		purchaseLinks={Books['Mixed Martial Hearts'].purchaseLinks}
		title={'Mixed Martial Hearts'}
		url={Books['Mixed Martial Hearts'].route}
	/>

	<LatestItem
		description={Games['Inflation Buster'].synopsis}
		image={Games['Inflation Buster'].image}
		imageDescription={'cover image'}
		title={'Inflation Buster'}
		url={Games['Inflation Buster'].route}
	/>
</div>
