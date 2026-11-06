<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead title="Books" description="Books by Sara Rogers." path="/books" />

<h1>Books</h1>

<ul class="cover-grid">
	{#each data.books as book, index (book.slug)}
		<li>
			<a href="/books/{book.slug}">
				<enhanced:img
					src={book.cover}
					alt=""
					sizes="(min-width: 40rem) 13rem, 45vw"
					loading={index < 4 ? undefined : 'lazy'}
					style="view-transition-name: cover-{book.slug}"
				/>
				<span class="title">{book.data.title}</span>
				<span class="subtitle">{book.data.subtitle}</span>
			</a>
		</li>
	{/each}
</ul>
