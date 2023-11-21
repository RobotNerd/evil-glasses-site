<script lang="ts">
  import { Stories } from "$lib/data/short-story-meta";
  import ViewMultiple from "$lib/ViewMultiple.svelte";
</script>

<h1 class="h1">Short Stories</h1>

<ViewMultiple items={Object.values(Stories)} />
