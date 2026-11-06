<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>This page has moved | Evil Glasses</title>
	<meta name="robots" content="noindex" />
	<meta http-equiv="refresh" content="0; url={data.target}" />
	<link rel="canonical" href={data.canonical} />
</svelte:head>

<h1>This page has moved</h1>
<p>
	Taking you to the new page. If nothing happens, go to <a href={data.target}>{data.target}</a>.
</p>
