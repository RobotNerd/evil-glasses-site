import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readme = readFileSync('README.md', 'utf8');
const claude = readFileSync('CLAUDE.md', 'utf8');
const config = readFileSync('.sdlc/config.toml', 'utf8');
const { scripts } = JSON.parse(readFileSync('package.json', 'utf8')) as {
	scripts: Record<string, string>;
};

const setting = (key: string) => config.match(new RegExp(`^${key} = "(.*)"$`, 'm'))?.[1] ?? '';
const withoutCode = (text: string) => {
	let inside = false;
	return text
		.split('\n')
		.filter((line) => {
			if (line.trim().startsWith('```')) {
				inside = !inside;
				return false;
			}
			return !inside;
		})
		.join('\n');
};

describe('README.md', () => {
	it.each(['Setup', 'Commands', 'Adding content', 'Deploying', 'Privacy policy'])(
		'has a "%s" section',
		(heading) => {
			expect(readme).toMatch(new RegExp(`^## ${heading}$`, 'm'));
		}
	);

	it.each(Object.keys(scripts))('lists the %s script', (name) => {
		expect(readme).toContain(`\`${name}\``);
	});
});

describe('CLAUDE.md', () => {
	it.each(['architecture.md', 'testing.md', 'add-content'])('names %s', (name) => {
		expect(claude).toContain(name);
	});

	it.each(['lint_command', 'format_command', 'test_command'])(
		'lists the command from %s',
		(key) => {
			expect(setting(key)).not.toBe('');
			expect(claude).toContain(setting(key));
		}
	);
});

describe('both files', () => {
	it.each([
		['README.md', readme],
		['CLAUDE.md', claude]
	])('%s has no old references', (_name, text) => {
		expect(text).not.toMatch(
			/skeleton|tailwind|font ?awesome|gh-pages|npm run deploy|src\/lib\/data|paths\.base/i
		);
	});

	it.each([
		['README.md', readme],
		['CLAUDE.md', claude]
	])('%s keeps commands in code blocks', (_name, text) => {
		expect(withoutCode(text)).not.toMatch(/\b(npm|npx) /);
	});
});
