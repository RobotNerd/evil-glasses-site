<script lang="ts">
	import { Books } from '$lib/data/book-meta';
	import { Games } from '$lib/data/game-meta';

	import CardItem from '$lib/CardItem.svelte';
</script>

<div
	class="flex items-center justify-center w-2/3 sm:w-1/2"
>
	<p>
		Welcome to Evil Glasses, our hub of creativity and innovation. Here at Evil Glasses, we delve
		into the realms of literature and technology, offering an eclectic mix of captivating books,
		immersive short stories, engaging mobile games, and open source software projects. Whether
		you're a book enthusiast, a gamer, or a software developer, Evil Glasses is your destination for
		content that inspires, entertains, and supports you with unique tools. Join us on this journey
		as we expand our horizons and explore new possibilities in the world of multimedia.
	</p>
</div>

<h2 class="h2 my-12">Latest</h2>

<div
	class="flex flex-col flex-wrap items-center justify-center sm:w-2/3 sm:flex-row sm:items-start"
>
	<CardItem
		description={Books['Press Start for Love'].synopsis}
		image={Books['Press Start for Love'].coverImage}
		imageDescription={'cover image'}
		purchaseLinks={Books['Press Start for Love'].purchaseLinks}
		title={'Press Start for Love'}
		url={Books['Press Start for Love'].route}
	/>

	<CardItem
		description={Books['Mixed Martial Hearts'].synopsis}
		image={Books['Mixed Martial Hearts'].coverImage}
		imageDescription={'cover image'}
		purchaseLinks={Books['Mixed Martial Hearts'].purchaseLinks}
		title={'Mixed Martial Hearts'}
		url={Books['Mixed Martial Hearts'].route}
	/>

	<CardItem
		description={Games['Inflation Buster'].synopsis}
		image={Games['Inflation Buster'].image}
		imageDescription={'cover image'}
		purchaseLinks={Games['Inflation Buster'].purchaseLinks}
		title={'Inflation Buster'}
		url={Games['Inflation Buster'].route}
	/>
</div>
