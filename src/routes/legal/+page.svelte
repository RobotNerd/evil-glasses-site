<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Legal | Evil Glasses</title>
	<meta name="description" content="Privacy policies for Evil Glasses apps and games." />
</svelte:head>

<h1>Legal</h1>

<ul>
	{#each data.policies as policy (policy.slug)}
		<li><a href="/legal/{policy.slug}">{policy.data.title}</a></li>
	{/each}
</ul>
