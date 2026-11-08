/** How long each slide is shown, including its fade out, in milliseconds. */
export const SLIDE_MS = 5000;

/** How long a slide takes to fade, in milliseconds. It matches `--fade-duration` in `styles.css`. */
export const FADE_MS = 300;

/** Returns a new array in random order (Fisher-Yates). */
export function shuffle<T>(items: readonly T[]): T[] {
	const out = [...items];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}
