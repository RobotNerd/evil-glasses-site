<script lang="ts">
	export let featuredItems: any = [
		{ url: '/test', image: '/avatar.png', name: 'placeholder' },
		{ url: '/test', image: '/avatar.png', name: 'placeholder' },
		{ url: '/test', image: '/avatar.png', name: 'placeholder' }
	];
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
  TODO: Gallery
	<!-- {#each featuredItems as item, i}
		<div class="flex flex-col items-center">
			<img class="w-1/2" src={item.image} alt={item.name} />
			{item.url}
			{i}
		</div>
	{/each} -->
</div>
