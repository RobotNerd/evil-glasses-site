<script lang="ts">
	import SeoHead from '../../../lib/components/SeoHead.svelte';
	import { storeBadges } from '../../../lib/content/stores';

	let { data } = $props();
	const book = $derived(data.book);
</script>

<SeoHead
	title={book.data.title}
	description={book.data.synopsis}
	path="/books/{book.slug}"
	image={book.cover}
/>

<article>
	<div class="detail">
		<enhanced:img
			class="cover"
			src={book.cover}
			alt="Cover of {book.data.title}"
			sizes="(min-width: 48rem) 16rem, 70vw"
			style="view-transition-name: cover-{book.slug}"
		/>
		<div class="text">
			<h1>{book.data.title}</h1>
			<p class="subtitle">{book.data.subtitle}</p>
			<p class="author">By {book.data.author}</p>
			<p class="synopsis">{book.data.synopsis}</p>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
			{@html book.html}

			<h2>Get your copy now!</h2>
			<ul class="stores">
				{#each book.data.storeLinks as link (link.url)}
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

			<h2>About the Author</h2>
			<p class="bio">{book.data.authorBio}</p>
		</div>
	</div>
</article>
