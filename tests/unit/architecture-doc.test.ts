import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { schemas } from '../../src/lib/content/schemas';

const doc = readFileSync('docs/guidelines/architecture.md', 'utf8');
const content = doc.split(/^## /m).find((section) => section.startsWith('Content')) ?? '';

describe('architecture.md Content section', () => {
	for (const [type, schema] of Object.entries(schemas)) {
		describe(type, () => {
			const section = content.split(/^### /m).find((s) => s.startsWith(`${type}\n`));

			it('has a heading', () => {
				expect(section, `no "### ${type}" heading`).toBeDefined();
			});

			for (const field of Object.keys(schema.shape)) {
				it(`lists ${field}`, () => {
					expect(section ?? '').toContain(`\`${field}\``);
				});
			}
		});
	}
});

describe('architecture.md Presentation section', () => {
	const css = readFileSync('src/lib/styles.css', 'utf8');
	const presentation =
		doc.split(/^## /m).find((section) => section.startsWith('Presentation')) ?? '';
	const declared = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]));
	const named = new Set(
		[...presentation.matchAll(/`(--[a-z0-9-]+)`/g)]
			.map((m) => m[1])
			.filter((n) => n !== '--space-1')
	);

	it('has a heading', () => {
		expect(presentation).not.toBe('');
	});

	it('names every token in the stylesheet', () => {
		const spaces = presentation.includes('`--space-1` to `--space-5`');
		const found = new Set(named);
		if (spaces) for (let i = 1; i <= 5; i++) found.add(`--space-${i}`);
		expect([...declared].filter((t) => !found.has(t))).toEqual([]);
	});

	it('names only tokens in the stylesheet', () => {
		expect([...named].filter((t) => !declared.has(t) && t !== '--space-5')).toEqual([]);
	});
});
