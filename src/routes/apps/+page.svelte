<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead title="Apps" description="Apps from Evil Glasses." path="/apps" />

<h1>Apps</h1>

<ul class="apps">
	{#each data.apps as app (app.slug)}
		<li>
			<a href="/apps/{app.slug}">
				<enhanced:img src={app.image} alt="" sizes="(min-width: 40rem) 12rem, 40vw" />
				<span class="title">{app.data.title}</span>
				{#if app.data.subtitle}<span class="subtitle">{app.data.subtitle}</span>{/if}
			</a>
		</li>
	{/each}
</ul>

<style>
	.apps {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: var(--space-4);
		padding: 0;
		list-style: none;
	}
	a {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		text-decoration: none;
		color: var(--color-text);
	}
	.title {
		font-weight: 700;
	}
	.subtitle {
		color: var(--color-muted);
	}
	:global(.apps img) {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}
</style>
