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
