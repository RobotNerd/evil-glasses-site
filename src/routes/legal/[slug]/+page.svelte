<script lang="ts">
	let { data } = $props();
	const policy = $derived(data.policy);
</script>

<svelte:head>
	<title>{policy.data.title} | Evil Glasses</title>
	<meta name="description" content="Privacy policy for {policy.data.app}." />
</svelte:head>

<article>
	<h1>{policy.data.title}</h1>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html policy.html}
</article>
