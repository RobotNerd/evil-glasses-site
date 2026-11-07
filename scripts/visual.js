// Runs the screenshot tests in the official Playwright image, so fonts render the same everywhere.
// Serves the build on the host and points the container's browser at it. Pass --update to rewrite
// the snapshots.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const update = process.argv.includes('--update');
const port = '4174';
const { version } = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8'));
const image = `mcr.microsoft.com/playwright:v${version}-noble`;

const run = (command, args, options = {}) =>
	spawnSync(command, args, { stdio: 'inherit', ...options }).status ?? 1;

if (run('npm', ['run', 'build']) !== 0) process.exit(1);

const server = spawn('node', ['scripts/preview.js'], {
	stdio: 'ignore',
	env: { ...process.env, PORT: port }
});
await new Promise((resolve) => setTimeout(resolve, 1000));

const status = run('docker', [
	'run',
	'--rm',
	'--ipc=host',
	'--add-host=host.docker.internal:host-gateway',
	'-v',
	`${process.cwd()}:/work`,
	'-w',
	'/work',
	'-e',
	`VISUAL_BASE_URL=http://host.docker.internal:${port}`,
	'-e',
	`CI=${process.env.CI ?? ''}`,
	image,
	'npx',
	'playwright',
	'test',
	'-c',
	'tests/visual/playwright.config.ts',
	...(update ? ['--update-snapshots'] : [])
]);

server.kill();
process.exit(status);
