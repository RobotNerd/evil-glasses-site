<script lang="ts">
	export let items: any;
</script>

<div class="flex flex-row flex-wrap justify-center">
	{#each [...items].reverse() as item}
    <a href="/short-stories/{item.date}/{item.edition}/">
		<div class="card card-hover m-8 block rounded-lg p-4">
      <img class="w-xs sm:max-w-xs" src="/short-stories/{item.date}-edition-{item.edition}.png" alt="TODO">
			<div>{item.name}</div>
		</div>
  </a>
	{/each}
</div>