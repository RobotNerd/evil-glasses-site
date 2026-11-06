import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const workflow = parse(readFileSync('.github/workflows/ci.yml', 'utf8'));
const steps: Record<string, unknown>[] = workflow.jobs.ci.steps;

describe('ci workflow', () => {
	it('runs on pull requests and pushes to main', () => {
		expect(Object.keys(workflow.on)).toEqual(['pull_request', 'push']);
		expect(workflow.on.push.branches).toEqual(['main']);
	});

	it('reads the Node version from .nvmrc', () => {
		const setupNode = steps.find((s) => String(s.uses).startsWith('actions/setup-node'));
		expect((setupNode?.with as Record<string, string>)['node-version-file']).toBe('.nvmrc');
	});

	it('runs lint, prettier, test and lighthouse in order', () => {
		const runs = steps.map((s) => s.run).filter(Boolean);
		const order = ['npm run lint', 'npx prettier --check .', 'npm test', 'npm run lighthouse'].map(
			(c) => runs.indexOf(c)
		);
		expect(order.every((i) => i >= 0)).toBe(true);
		expect(order).toEqual([...order].sort((a, b) => a - b));
	});

	it("runs lighthouse in the runner's Google Chrome", () => {
		const step = steps.find((s) => s.run === 'npm run lighthouse');
		expect((step?.env as Record<string, string>).CHROME_PATH).toBe('/usr/bin/google-chrome');
	});
});

describe('deploy workflow', () => {
	const deploy = parse(readFileSync('.github/workflows/deploy.yml', 'utf8'));
	const buildSteps: Record<string, unknown>[] = deploy.jobs.build.steps;

	it('runs on pushes to main and by hand', () => {
		expect(Object.keys(deploy.on)).toEqual(['push', 'workflow_dispatch']);
		expect(deploy.on.push.branches).toEqual(['main']);
	});

	it('deploys only when PAGES_DEPLOY is true', () => {
		expect(deploy.jobs.deploy.if).toBe("vars.PAGES_DEPLOY == 'true'");
		expect(deploy.jobs.deploy.needs).toBe('build');
		expect(deploy.jobs.build.if).toBeUndefined();
	});

	it('has the Pages permissions, environment and a non-cancelling concurrency group', () => {
		expect(deploy.permissions.pages).toBe('write');
		expect(deploy.permissions['id-token']).toBe('write');
		expect(deploy.jobs.deploy.environment.name).toBe('github-pages');
		expect(deploy.concurrency['cancel-in-progress']).toBe(false);
		expect(deploy.concurrency.group).toBeTruthy();
	});

	it('builds with the .nvmrc Node version and uploads build/', () => {
		const setupNode = buildSteps.find((s) => String(s.uses).startsWith('actions/setup-node'));
		expect((setupNode?.with as Record<string, string>)['node-version-file']).toBe('.nvmrc');
		expect(buildSteps.map((s) => s.run)).toContain('npm run build');
		const upload = buildSteps.find((s) =>
			String(s.uses).startsWith('actions/upload-pages-artifact')
		);
		expect((upload?.with as Record<string, string>).path).toBe('build');
		expect(String(deploy.jobs.deploy.steps[0].uses)).toMatch(/^actions\/deploy-pages@/);
	});
});
