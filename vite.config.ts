import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: { include: ['tests/unit/**/*.test.ts'] },
	plugins: [
		sveltekit({
			adapter: adapter({ fallback: '404.html' }),
			prerender: {
				// Content pages arrive in later tasks; the shell already links to them.
				handleHttpError: 'warn'
			}
		})
	]
});
