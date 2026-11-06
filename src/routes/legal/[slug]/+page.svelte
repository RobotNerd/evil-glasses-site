<script lang="ts">
	import SeoHead from '../../../lib/components/SeoHead.svelte';
	let { data } = $props();
	const policy = $derived(data.policy);
</script>

<SeoHead
	title={policy.data.title}
	description="Privacy policy for {policy.data.app}."
	path="/legal/{policy.slug}"
/>

<article>
	<h1>{policy.data.title}</h1>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted Markdown rendered at build time -->
	{@html policy.html}
</article>
