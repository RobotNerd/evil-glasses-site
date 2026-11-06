import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { redirects } from '../../src/lib/content/redirects';

const kept = ['/', '/about', '/books', '/games', '/legal', '/legal/inflation-buster'];

function builtFile(path: string): string {
	return path === '/' ? 'build/index.html' : `build${path}.html`;
}

describe('redirect map', () => {
	it('has no duplicate old path', () => {
		const source = Object.keys(redirects);
		expect(new Set(source).size).toBe(source.length);
	});

	it('points every target at a page in the build', () => {
		for (const target of Object.values(redirects)) {
			expect(existsSync(builtFile(target.split('#')[0])), target).toBe(true);
		}
	});

	it('does not redirect any of the six kept URLs', () => {
		for (const path of kept) expect(redirects).not.toHaveProperty(path);
	});
});
