<script lang="ts">
	import Featured from '$lib/Featured.svelte';
	import {featured} from '$lib/data/featured';
	import { Books } from '$lib/data/book-meta';

	import LatestItem from '$lib/LatestItem.svelte';
</script>

<Featured featuredItems={featured} />

<h3 class="h3 my-12">Latest</h3>

<LatestItem
	book={Books["Press Start for Love"]}
	description={Books["Press Start for Love"].synopsis}
	image={Books["Press Start for Love"].coverImage}
	imageDescription={"cover image"}
	title={"Press Start for Love"}
	url="{Books["Press Start for Love"].route}"
/>

	<hr class="w-1/2 !border-t-2 my-8" />

<LatestItem
	book={Books["Mixed Martial Hearts"]}
	description={Books["Mixed Martial Hearts"].synopsis}
	image={Books["Mixed Martial Hearts"].coverImage}
	imageDescription={"cover image"}
	title={"Mixed Martial Hearts"}
	url="{Books["Mixed Martial Hearts"].route}"
/>
