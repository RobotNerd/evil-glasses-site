<script lang="ts">
  import DetailHeader from "$lib/DetailHeader.svelte";
  import { page } from '$app/stores';
  import { Stories } from "$lib/data/short-story-meta";

  const edition: number = parseInt($page.params.edition);
  const image = `/short-stories/${$page.params.date}-edition-${$page.params.edition}.png`;
  const imageAlt = `Evil Glasses short stories edition ${edition}`;
</script>

<DetailHeader
  title="Evil Glasses Short Stories"
  subtitle="Edition {edition}"
  image="{image}"
  imageAlt="{imageAlt}" />

<h3 class="h3 mb-4">Read Online</h3>

<div>
  {#each Stories[edition].stories as story}
    <div>
      <a href="">{story.title}</a>  <!-- TODO html link to each story -->
      by {story.author}
    </div>
  {/each}
</div>

<h3 class="h3 my-4">Or</h3>

<button type="button" class="btn variant-filled-primary">  <!-- TODO pdf download -->
  <span class="fa-regular fa-file-pdf" />
  <span>Download PDF</span>
</button>
