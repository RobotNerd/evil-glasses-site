import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { schemas, type ContentType } from './schemas';

export type RawEntry = { path: string; source: string };

export type Entry<T> = { slug: string; path: string; data: T; html: string };

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Splits an `index.md` file into its YAML frontmatter and Markdown body. */
function splitFrontmatter(path: string, source: string): { data: unknown; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/.exec(source);
	if (!match) throw new Error(`${path}: missing YAML frontmatter between --- lines`);
	let data: unknown;
	try {
		data = parseYaml(match[1]);
	} catch (error) {
		throw new Error(`${path}: frontmatter is not valid YAML (${(error as Error).message})`, {
			cause: error
		});
	}
	return { data, body: match[2] ?? '' };
}

/** The slug is the folder name of `<anything>/<type>/<slug>/index.md`. */
export function slugFromPath(path: string): string {
	const parts = path.split('/');
	const folder = parts[parts.length - 2] ?? '';
	if (!slugPattern.test(folder)) {
		throw new Error(
			`${path}: folder name "${folder}" must be lowercase words joined by hyphens, such as "my-book"`
		);
	}
	return folder;
}

/**
 * Checks one content file against its type's schema and renders its body.
 * Throws an error naming the file path and the failing field or folder.
 */
export function validateEntry<T extends ContentType>(
	type: T,
	raw: RawEntry
): Entry<ReturnType<(typeof schemas)[T]['parse']>> {
	const slug = slugFromPath(raw.path);
	const { data, body } = splitFrontmatter(raw.path, raw.source);
	const result = schemas[type].safeParse(data);
	if (!result.success) {
		const problems = result.error.issues.map((issue) => {
			const field = issue.path.length > 0 ? issue.path.join('.') : '(frontmatter)';
			return `field "${field}": ${issue.message}`;
		});
		throw new Error(`${raw.path}: ${problems.join('; ')}`);
	}
	return {
		slug,
		path: raw.path,
		data: result.data as ReturnType<(typeof schemas)[T]['parse']>,
		html: marked.parse(body, { async: false })
	};
}

/** Returns the items sorted by `date`, newest first. */
export function newestFirst<T extends { data: { date: string } }>(items: T[]): T[] {
	return [...items].sort((a, b) => b.data.date.localeCompare(a.data.date));
}
