// Runs the screenshot tests. Builds the site, serves it and drives the browser all inside the
// official Playwright image, pinned to linux/amd64, so the build (image encoding), the fonts and
// the browser are the same on a Mac and on the CI runner. Pass --update to rewrite the snapshots.
// Linux node_modules, build and .svelte-kit live in named Docker volumes, so the host's own are
// left alone. The build lands in build/ on the host, now a Linux build.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const update = process.argv.includes('--update');
const { version } = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8'));
const image = `mcr.microsoft.com/playwright:v${version}-noble`;

const script = [
	'set -e',
	'cmp -s package-lock.json node_modules/.installed-lock || { npm ci --no-audit --no-fund && cp package-lock.json node_modules/.installed-lock; }',
	'npm run build',
	'node scripts/preview.js > /dev/null &',
	'for i in $(seq 1 50); do curl -sf http://localhost:4173/ > /dev/null && break; sleep 0.2; done',
	`npx playwright test -c tests/visual/playwright.config.ts${update ? ' --update-snapshots' : ''}`
].join('\n');

const volume = (name, path) => ['-v', `evil-glasses-visual-${name}:/work/${path}`];

const { status } = spawnSync(
	'docker',
	[
		'run',
		'--rm',
		'--platform',
		'linux/amd64',
		'--ipc=host',
		'-v',
		`${process.cwd()}:/work`,
		...volume('node-modules', 'node_modules'),
		...volume('svelte-kit', '.svelte-kit'),
		'-w',
		'/work',
		'-e',
		`CI=${process.env.CI ?? ''}`,
		image,
		'bash',
		'-c',
		script
	],
	{ stdio: 'inherit' }
);
process.exit(status ?? 1);
