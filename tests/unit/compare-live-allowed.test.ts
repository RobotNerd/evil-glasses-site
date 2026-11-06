import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Entry = { id: string; reason: string; rules: { pages?: string; live?: string[] }[] };
const { entries } = JSON.parse(readFileSync('scripts/compare-live-allowed.json', 'utf8')) as {
	entries: Entry[];
};

describe('compare-live allowlist', () => {
	it('gives every entry a reason and at least one rule', () => {
		for (const entry of entries) {
			expect(entry.reason.trim(), entry.id).not.toBe('');
			expect(entry.rules.length, entry.id).toBeGreaterThan(0);
		}
	});

	it('lists only the intended changes', () => {
		expect(entries.map((e) => e.id).sort()).toEqual(
			[
				'author-name',
				'home-page',
				'software-page-removed',
				'pdf-links-removed',
				'inflation-buster-spacing',
				'editions-merged',
				'item-dates',
				'site-header-footer',
				'what-size-policy',
				// Accepted by the developer after comparing:
				'story-titles',
				'list-pages-redesigned',
				'memories-spacing',
				'detail-page-extras'
			].sort()
		);
	});

	it('has valid regular expressions', () => {
		for (const entry of entries) {
			for (const rule of entry.rules) {
				for (const source of [rule.pages, ...(rule.live ?? [])]) {
					if (source) expect(() => new RegExp(source), entry.id).not.toThrow();
				}
			}
		}
	});
});
