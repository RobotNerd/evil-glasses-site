<script lang="ts">
  export let title: string = 'TITLE';
  export let subtitle: string = '';
  export let image: string = '';
  export let imageAlt: string = 'ALT TEXT';
  export let content: string = 'CONTENT';
</script>

<h1 class="h1 mb-1">{title}</h1>
<h2 class="h2 mb-4">{subtitle}</h2>

<img class="w-1/3 mb-4" src="{image}" alt="{imageAlt}" />

{content}
