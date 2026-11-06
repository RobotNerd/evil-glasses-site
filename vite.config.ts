import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			prerender: {
				// Content pages arrive in later tasks; the shell already links to them.
				handleHttpError: 'warn'
			}
		})
	]
});
