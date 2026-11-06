import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('preview script', () => {
	it('maps unknown paths to 404.html with status 404', () => {
		const source = readFileSync('scripts/preview.js', 'utf8');
		expect(source).toContain("'404.html'");
		expect(source).toContain('status = 404');
	});
});
