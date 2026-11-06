<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead title="Apps" description="Apps from Evil Glasses." path="/apps" />

<h1>Apps</h1>

<ul class="cover-grid icons">
	{#each data.apps as app, index (app.slug)}
		<li>
			<a href="/apps/{app.slug}">
				<enhanced:img
					src={app.image}
					alt=""
					sizes="(min-width: 40rem) 13rem, 45vw"
					loading={index < 4 ? undefined : 'lazy'}
					style="view-transition-name: cover-{app.slug}"
				/>
				<span class="title">{app.data.title}</span>
				{#if app.data.subtitle}<span class="subtitle">{app.data.subtitle}</span>{/if}
			</a>
		</li>
	{/each}
</ul>
