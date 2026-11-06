<script lang="ts">
	type Props = {
		/** Rendered width in CSS pixels; the height follows. */
		width?: number;
		/** An accessible name. Without it the logo is decorative and hidden from assistive tech. */
		label?: string;
		/** Plays a light streak across the lenses once, 250 ms after the logo appears. */
		glint?: boolean;
	};

	let { width = 113, label, glint = false }: Props = $props();

	// Ids are unique per instance, so two logos on a page never clash.
	const uid = $props.id();
	const id = `eg-logo-${uid}`;
</script>

<!-- The logo in its original black, white and lens blue, from assets/logos/evil-glasses.svg. -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 113.312 54.419"
	{width}
	height={width * (54.419 / 113.312)}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	focusable="false"
>
	<defs>
		<!-- The lens shapes, also usable as a clip path (url(#{id}-lens-clip)) for the glint. -->
		<path
			id="{id}-lens"
			d="M10866.63 13500.865c26.76 2.678 65.015 30.403 65.015 30.403s-26.649 118.221-35.655 140.541c-10.006 19.641-38.735 49.197-56.453 52.985-18.427 5.238-206.358 3.481-217.678-.938-35.114-14.564-63.321-42.992-64.029-63.679 0 0-1.363-194.894 2.883-203.101 7.075-3.788 305.917 43.789 305.917 43.789zm222.816 0c-26.76 2.678-65.015 30.403-65.015 30.403s26.649 118.221 35.655 140.541c7.005 17.856 33.731 49.197 56.453 52.984 18.427 5.239 206.358 3.482 217.678-.937 35.114-14.564 63.321-42.992 64.029-63.679 0 0 1.363-194.894-2.883-203.101-7.075-3.788-305.917 43.789-305.917 43.789z"
			transform="translate(-1266.687 -1602.805)scale(.12054)"
		/>
		<clipPath id="{id}-lens-clip"><use href="#{id}-lens" /></clipPath>
		{#if glint}
			<linearGradient id="{id}-glint-fill">
				<stop offset="0" stop-color="#fff" stop-opacity="0" />
				<stop offset="0.5" stop-color="#fff" stop-opacity="0.9" />
				<stop offset="1" stop-color="#fff" stop-opacity="0" />
			</linearGradient>
		{/if}
	</defs>
	<path
		class="frame"
		d="M10988.336 13547.898c7.782.109 19.825 17.046 19.825 22.096l20.576 90.548c5.203 35.537 46.491 84.127 91.34 82.501h201.593c36.251.631 97.687-40.282 99.187-83.448l1-143.907c7.076-5.682 20.038-.627 21.452-8.203l-1.001-86.461-344.312 51.766c-17.442 2.623-68.615 29.016-80.643 29.016h-76.329c-12.028 0-63.209-26.515-80.676-29.016l-347.523-50.874 1.001 86.462c1.414 7.576 13.343 1.628 20.419 7.31l-1.001 143.907c1.5 43.166 62.966 84.079 99.218 83.448h201.593c44.85 1.626 78.405-48.227 90.683-82.501l19.818-90.548c0-5.05 12.041-21.999 19.824-22.096l12.685-.158z"
		fill="#000"
		stroke="#000"
		stroke-width="9.45172"
		transform="translate(-1266.687 -1602.805)scale(.12054)"
	/>
	<g transform="matrix(.12062 0 0 .10762 -2200.141 -920.936)"
		><circle cx="18262.482" cy="8731.65" r="10" fill="#fff" stroke="#000" stroke-width="5" /><circle
			cx="18262.482"
			cy="8765.65"
			r="10"
			style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:#000;stroke-width:5;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
		/></g
	>
	<g transform="matrix(-.12062 0 0 .10762 -2202.674 -920.828)"
		><circle
			cx="-19174.416"
			cy="8730.65"
			r="10"
			fill="#fff"
			stroke="#000"
			stroke-width="5"
		/><circle
			cx="-19174.416"
			cy="8764.65"
			r="10"
			style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:#000;stroke-width:5;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
		/></g
	>
	<path
		d="m15450.561 7845.336 15.775-5.096c6.855-9.934-3.19-23.037-3.19-23.037s3.074 16.632-12.585 28.133zm72.049 0-15.775-5.096c-6.855-9.934 3.19-23.037 3.19-23.037s-3.074 16.632 12.585 28.133z"
		fill="#000"
		stroke="#000"
		stroke-width=".692417"
		transform="translate(-1810.48 -925.087)scale(.12054)"
	/>
	<path
		d="M15453.753 7759.744s-27.02 31.106-54.626 18.46l-285.378-101.809c-47.014-15.99-88.684 88.143-88.684 88.143s40.381-42.55 121.033-29.41c0 0 145.326 23.005 258.446 88.533 20.626 17.977 49.209-63.917 49.209-63.917m61.312 0s27.02 31.106 54.626 18.46l285.378-101.809c47.014-15.99 88.684 88.143 88.684 88.143s-40.381-42.55-121.033-29.41c0 0-145.326 23.005-258.446 88.533-20.626 17.977-49.209-63.917-49.209-63.917"
		fill="#000"
		stroke="#000"
		stroke-width="1"
		transform="translate(-1810.218 -925.087)scale(.12054)"
	/>
	<use href="#{id}-lens" fill="#d9efff" stroke="#464646" stroke-width="7.5" />
	<path
		d="M10941.752 13510.774c-1.768 15.202 3.182 33.941 3.182 33.941s2.828-19.446 4.596-29.345c5.303-11.668 55.155-7.425 55.155-7.425-11.873-4.894-58.69-9.192-62.933 2.829"
		fill="#fff"
		fill-opacity=".456522"
		transform="translate(-1266.687 -1602.805)scale(.12054)"
	/>
	<path
		d="M10511.304 13420.09c4.786-3.384 355.465 52.065 355.465 52.065 3.008 2.463-12.354 1.075-12.354 1.075s-325.916-50.764-336.346-48.112c-4.358 3.265-2.862 23.491-2.862 23.491-2.329 3.42-1.868-1.169-1.868-1.169s-5.387-24.27-2.035-27.35"
		fill="#fff"
		fill-opacity=".454902"
		transform="translate(-1266.687 -1602.805)scale(.12054)"
	/>
	<path
		d="M11406.285 13680.493c2.789-8.463 5.093-54.003-.486-50.54 1.265 48.57-3.186 53.111-33.588 81.695.575 7.241 31.739-22.211 34.074-31.155m-870.954-15.747c-2.121-10.463-2.253-126.769 2.795-108.034-.79 115.402-.502 115.97 33.411 158.6-3.618 7.485-36.005-33.475-36.206-50.566m561.205-189.82c-17.785 2.912-57.447 23.811-54.741 18.479 28.704-15.342 48.185-20.782 53.478-22.313 5.694-1.648 113.262-16.925 118.481-18.233 9.567 5.706-110.5 21.36-117.218 22.067"
		fill="#fff"
		fill-opacity=".456522"
		transform="translate(-1266.687 -1602.805)scale(.12054)"
	/>
	<path
		d="m11388.416 13589.37.646 64.429c.354 22.192-44.439 60.364-68.631 60.217l-27.015.354s51.525-16.686 68.354-39.439c19.071-25.082 26.646-85.561 26.646-85.561m-487.5 22.5-11.354 46.929c-5.646 23.192-46.939 57.364-71.131 57.217l-27.015.354s51.525-16.686 68.354-39.439c19.071-25.082 41.146-65.061 41.146-65.061m155.5 2.5-15.146-68.429c1.146-15.192 34.939-37.364 59.131-37.217l36.015-3.854s-55.525 8.686-72.354 31.439c-16.571 29.582-7.646 78.061-7.646 78.061m-486.573-63.376 1.208-64.418c0-5.304 12.059-14.481 23.951-13.225l82.596 11.166s-81.916-2.125-88.364 7.48c-6.802 11.378-19.391 58.997-19.391 58.997"
		fill="#fff"
		fill-opacity=".521739"
		transform="translate(-1266.687 -1602.805)scale(.12054)"
	/>
	{#if glint}
		<g clip-path="url(#{id}-lens-clip)">
			<rect class="glint" x="-30" y="-6" width="16" height="70" fill="url(#{id}-glint-fill)" />
		</g>
	{/if}
</svg>

<style>
	/* Off to the left until it plays, so a missing animation shows nothing. */
	.glint {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: glint 700ms ease-in-out 250ms 1 backwards;
	}

	@keyframes glint {
		from {
			opacity: 1;
			transform: translateX(0) skewX(-20deg);
		}
		to {
			opacity: 1;
			transform: translateX(160px) skewX(-20deg);
		}
	}
</style>
