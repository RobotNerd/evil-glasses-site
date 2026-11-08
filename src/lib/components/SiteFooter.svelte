<footer>
	<nav aria-label="Footer">
		<a href="/about">About</a>
		<span aria-hidden="true">|</span>
		<a href="/legal">Legal</a>
	</nav>
	<p>&copy; {new Date().getFullYear()} Evil Glasses</p>
</footer>

<style>
	footer {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2) var(--space-4);
		max-width: var(--content-width);
		margin: var(--space-5) auto 0;
		padding: var(--space-3);
		border-top: 1px solid var(--color-border);
		font-size: 0.875rem;
	}

	nav {
		display: flex;
		gap: var(--space-2);
	}

	p {
		margin: 0;
		color: var(--color-muted);
	}
</style>
