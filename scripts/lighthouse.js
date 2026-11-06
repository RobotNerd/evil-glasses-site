// Builds the site, then runs Lighthouse CI (see lighthouserc.cjs) against the preview server.
// Prints each page's median scores, and exits non-zero naming the page and category below 95.
import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { readdirSync, readFileSync, rmSync } from 'node:fs';

const outDir = '.lighthouseci';
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const minScore = 0.95;

function run(command, args) {
	return spawnSync(command, args, { stdio: 'inherit' }).status ?? 1;
}

// Use the Chromium Playwright installed unless the caller picked a browser.
process.env.CHROME_PATH ??= chromium.executablePath();

rmSync(outDir, { recursive: true, force: true });
if (run('npm', ['run', 'build']) !== 0) process.exit(1);
const status = run('npx', ['lhci', 'autorun', '--config=lighthouserc.cjs']);

const runs = new Map();
for (const file of readdirSync(outDir).filter((f) => /^lhr-.*\.json$/.test(f))) {
	const lhr = JSON.parse(readFileSync(`${outDir}/${file}`, 'utf8'));
	const path = new URL(lhr.finalDisplayedUrl ?? lhr.finalUrl).pathname;
	if (!runs.has(path)) runs.set(path, []);
	runs.get(path).push(lhr);
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const failures = [];
console.log('\nLighthouse median scores (mobile, 3 runs per page)');
for (const [path, lhrs] of runs) {
	const scores = categories.map((c) => {
		const score = median(lhrs.map((l) => l.categories[c].score ?? 0));
		if (score < minScore) failures.push(`${path} ${c}: ${Math.round(score * 100)}`);
		return `${c} ${Math.round(score * 100)}`;
	});
	console.log(`${path}  ${scores.join('  ')}`);
}
if (failures.length) {
	console.error(`\nBelow ${minScore * 100}:\n  ${failures.join('\n  ')}`);
}
process.exit(status !== 0 || failures.length ? 1 : 0);
