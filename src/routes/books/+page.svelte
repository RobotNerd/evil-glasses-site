<script lang="ts">
	import SeoHead from '../../lib/components/SeoHead.svelte';
	let { data } = $props();
</script>

<SeoHead title="Books" description="Books by Sara Rogers." path="/books" />

<h1>Books</h1>

<ul class="books">
	{#each data.books as book (book.slug)}
		<li>
			<a href="/books/{book.slug}">
				<enhanced:img src={book.cover} alt="" sizes="(min-width: 40rem) 12rem, 40vw" />
				<span class="title">{book.data.title}</span>
				<span class="subtitle">{book.data.subtitle}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.books {
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
	:global(.books img) {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}
</style>
