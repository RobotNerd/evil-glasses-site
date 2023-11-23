<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';

	export let featuredItems: any = [
		{ route: '/test', image: '/avatar.png', name: 'placeholder' },
		{ route: '/test', image: '/avatar.png', name: 'placeholder' },
		{ route: '/test', image: '/avatar.png', name: 'placeholder' }
	];

	let emblaOptions: any = { loop: true };
	let emblaApi: any;

	function onInit(event: any) {
		emblaApi = event.detail;
	}

	function slideLeft() {
		emblaApi.scrollPrev();
	}

	function slideRight() {
		emblaApi.scrollNext();
	}
</script>

<div class="hidden w-1/2 flex-row items-center justify-evenly md:flex">
	{#each featuredItems as item}
		<a href="{item.route}">
			<div class="flex flex-col items-center">
				<img class=" w-32" src={item.image} alt={item.name} />
			</div>
		</a>
	{/each}
</div>

<div class="flex w-1/2 flex-row items-center justify-evenly md:hidden">
	<button class="btn-icon btn-sm mr-4" on:click={slideLeft}>
		<span class="fa-solid fa-chevron-left"></span>
	</button>

	<div class="embla" use:emblaCarouselSvelte={{ 
			// @ts-ignore
			emblaOptions
		}} on:emblaInit={onInit}>
		<div class="embla__container">
			{#each featuredItems as item}
				<div class="embla__slide">
          <a href="{item.route}">
					  <img src={item.image} alt={item.name} />
          </a>
				</div>
			{/each}
		</div>
	</div>

	<button class="btn-icon btn-sm ml-4" on:click={slideRight}>
		<span class="fa-solid fa-chevron-right"></span>
	</button>
</div>

<style>
	.embla {
		overflow: hidden;
	}
	.embla__container {
		display: flex;
	}
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
	}
</style>
