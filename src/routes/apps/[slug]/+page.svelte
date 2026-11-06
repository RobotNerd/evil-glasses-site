<script lang="ts">
	import { storeBadges } from '../../../lib/content/stores';

	let { data } = $props();
	const app = $derived(data.app);
</script>

<svelte:head>
	<title>{app.data.title} | Evil Glasses</title>
	<meta name="description" content={app.data.synopsis} />
</svelte:head>

<article>
	<enhanced:img
		class="cover"
		src={app.image}
		alt="Icon for {app.data.title}"
		sizes="(min-width: 40rem) 12rem, 60vw"
	/>
	<h1>{app.data.title}</h1>
	{#if app.data.subtitle}<p class="subtitle">{app.data.subtitle}</p>{/if}
	<p class="author">By {app.data.author}</p>

	<h2>About the app</h2>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html app.html}

	<h2>Screenshots</h2>
	<ul class="screenshots">
		{#each app.screenshots as screenshot (screenshot.alt)}
			<li>
				<enhanced:img
					src={screenshot.src}
					alt={screenshot.alt}
					sizes="(min-width: 40rem) 15rem, 60vw"
				/>
			</li>
		{/each}
	</ul>

	<h2>Get the app</h2>
	<ul class="stores">
		{#each app.data.storeLinks as link (link.url)}
			{@const badge = storeBadges[link.store]}
			<li>
				<a href={link.url}>
					{#if badge}
						<enhanced:img src={badge} alt="" />
					{/if}
					<span>{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>

	<p><a class="policy" href={app.data.privacyPolicy}>Privacy policy</a></p>
</article>

<style>
	.subtitle {
		color: var(--color-muted);
		font-size: 1.25rem;
	}
	.author {
		color: var(--color-muted);
	}
	.screenshots,
	.stores {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}
	.stores a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}
	:global(.cover) {
		max-width: min(12rem, 100%);
		height: auto;
		border-radius: var(--radius);
	}
	:global(.screenshots img) {
		width: 15rem;
		max-width: 100%;
		height: auto;
		border-radius: var(--radius);
	}
	:global(.stores img) {
		width: 10rem;
		height: auto;
	}
</style>
