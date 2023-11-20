<script lang="ts">
  import DetailView from "$lib/DetailView.svelte";
  import { page } from '$app/stores';

  const edition: string = parseInt($page.params.edition).toString();
  const image = `/short-stories/${$page.params.date}-edition-${$page.params.edition}.png`;
  const imageAlt = `Evil Glasses short stories edition ${edition}`;
</script>

<!-- TODO: TOC -->

<DetailView
  title="Evil Glasses Short Stories"
  subtitle="Edition {edition}"
  image="{image}"
  imageAlt="{imageAlt}" />

<!-- TODO pdf download -->
<!-- TODO html link to each story -->
