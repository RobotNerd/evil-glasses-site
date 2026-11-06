<script lang="ts">
	import { absoluteUrl, imageUrl, siteName } from '../content/site';

	type Props = {
		/** The page's own title; the site name is appended. */
		title: string;
		description: string;
		/** The page's path on the site, such as `/books/my-book`. */
		path: string;
		/** A cover, image or icon from an `?enhanced` or `?url` import; defaults to the logo image. */
		image?: Parameters<typeof imageUrl>[0];
		/** The image's alt text for sharing. */
		imageAlt?: string;
	};

	let { title, description, path, image, imageAlt }: Props = $props();

	const fullTitle = $derived(path === '/' ? siteName : `${title} | ${siteName}`);
	const url = $derived(absoluteUrl(path));
	const picture = $derived(imageUrl(image));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={picture} />
	{#if imageAlt}<meta property="og:image:alt" content={imageAlt} />{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={picture} />
</svelte:head>
