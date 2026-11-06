import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const source = readFileSync('.claude/skills/add-content/SKILL.md', 'utf8');
const [, frontmatter] = source.split('---\n');

describe('add-content skill', () => {
	it('has a name and a description', () => {
		const data = parse(frontmatter);
		expect(data.name).toBe('add-content');
		expect(data.description).toMatch(/Use when/);
	});

	it('names the architecture doc as the field reference', () => {
		expect(source).toContain('docs/guidelines/architecture.md');
	});

	it('lists no fields of its own', () => {
		for (const field of ['synopsis', 'storeLinks', 'authorBio']) {
			expect(source).not.toContain(field);
		}
	});

	it('names the five supported types', () => {
		for (const type of ['app', 'book', 'edition', 'game', 'story']) {
			expect(source).toContain(`\`${type}\``);
		}
	});
});
