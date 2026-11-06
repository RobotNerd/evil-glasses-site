<script lang="ts">
	import SeoHead from '../../../lib/components/SeoHead.svelte';
	import { storeBadges } from '../../../lib/content/stores';

	let { data } = $props();
	const game = $derived(data.game);
</script>

<SeoHead
	title={game.data.title}
	description={game.data.synopsis}
	path="/games/{game.slug}"
	image={game.image}
/>

<article>
	<div class="detail">
		<enhanced:img
			class="cover"
			src={game.image}
			alt="Artwork for {game.data.title}"
			sizes="(min-width: 48rem) 16rem, 70vw"
			style="view-transition-name: cover-{game.slug}"
		/>
		<div class="text">
			<h1>{game.data.title}</h1>
			<p class="subtitle">{game.data.subtitle}</p>

			<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
			{@html game.html}

			<h2>Get your copy now!</h2>
			<ul class="stores">
				{#each game.data.storeLinks as link (link.url)}
					{@const badge = storeBadges[link.store]}
					<li>
						<a href={link.url}>
							{#if badge}
								<enhanced:img src={badge} alt={link.label} />
							{:else}
								<span>{link.label}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>

			<p><a class="policy" href={game.data.privacyPolicy}>Privacy policy</a></p>
		</div>
	</div>
</article>
