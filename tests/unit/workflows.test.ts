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
});
