<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead
	title="Legal"
	description="Privacy policies for Evil Glasses apps and games."
	path="/legal"
/>

<h1>Legal</h1>

<ul>
	{#each data.policies as policy (policy.slug)}
		<li><a href="/legal/{policy.slug}">{policy.data.title}</a></li>
	{/each}
</ul>
