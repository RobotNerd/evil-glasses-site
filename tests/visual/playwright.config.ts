import { defineConfig } from '@playwright/test';

// Run through `npm run test:visual`, which serves the build and starts the Playwright container.
export default defineConfig({
	testDir: '.',
	snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
	forbidOnly: !!process.env.CI,
	reporter: 'list',
	use: { baseURL: process.env.VISUAL_BASE_URL ?? 'http://localhost:4173' },
	expect: { toHaveScreenshot: { animations: 'disabled', maxDiffPixels: 0, threshold: 0 } }
});
