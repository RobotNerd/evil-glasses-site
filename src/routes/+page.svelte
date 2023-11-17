<script lang="ts">
	import Featured from '$lib/Featured.svelte';
	import * as featured from '$lib/data/featured.json';
</script>

<Featured featuredItems={featured.default} />
