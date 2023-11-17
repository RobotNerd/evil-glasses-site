<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';

	export let featuredItems: any = [
		{ url: '/test', image: '/avatar.png', name: 'placeholder' },
		{ url: '/test', image: '/avatar.png', name: 'placeholder' },
		{ url: '/test', image: '/avatar.png', name: 'placeholder' }
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

<h3 class="h3 mb-8">Featured</h3>

<div class="hidden w-1/2 flex-row items-center justify-evenly md:flex">
	{#each featuredItems as item}
		<div class="flex flex-col items-center">
			<img class="w-1/2" src={item.image} alt={item.name} />
			{item.url}
		</div>
	{/each}
</div>

<div class="flex w-1/2 flex-row items-center justify-evenly md:hidden">
  <button class="btn-icon btn-sm mr-4" on:click={slideLeft}>
    <span class="fa-solid fa-chevron-left"></span>
  </button>

	<div class="embla" use:emblaCarouselSvelte="{{ emblaOptions }}" on:emblaInit="{onInit}">
		<div class="embla__container">
      {#each featuredItems as item}
			  <div class="embla__slide">
          <img src={item.image} alt={item.name} />
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

