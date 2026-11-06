<script lang="ts">
	import { menuLinks } from '../../lib/components/menu-links';
	import SeoHead from '../../lib/components/SeoHead.svelte';
</script>

<SeoHead title="Menu" description="Every section of the Evil Glasses site." path="/menu" />

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<h1>Menu</h1>

<ul>
	{#each menuLinks as link (link.href)}
		<li><a href={link.href}>{link.label}</a></li>
	{/each}
</ul>
