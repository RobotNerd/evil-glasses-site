// Compares the rebuilt site with the live (old) site, page by page.
//
//   npm run compare:live            build, serve build/, compare, write the report
//   npm run compare:live -- --no-build   reuse the existing build/
//
// For each of the old pages it renders the live page and its counterpart on the local build in
// Playwright, then compares content text, external links and content images. A difference must be
// listed in scripts/compare-live-allowed.json (an intended change, with its reason); anything else
// is "unexplained", and the script exits 1. Only GET requests are made to the live site.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium, type Page } from '@playwright/test';
import sharp from 'sharp';

const LIVE = process.env.LIVE_URL ?? 'https://evilglasses.com';
const PORT = Number(process.env.COMPARE_PORT ?? 4174);
const LOCAL = `http://localhost:${PORT}`;
const REPORT = '.sdlc/local/compare-live/report.md';
const KEPT = ['/', '/about', '/books', '/games', '/legal', '/legal/inflation-buster'];
const HASH_DISTANCE = 12; // of 64 bits

type Kind = 'text' | 'link' | 'image' | 'page';
/**
 * One intended change. A rule says which differences it explains: `pages` is a regex on the live
 * path, `live` and `local` are regexes for fragments of the live and the local text. A text
 * difference is explained when every word of it on both sides is covered by fragments of rules.
 * For a link, image or page difference only `live` (the URL, the image name or the path) is tested.
 */
type Rule = { kinds?: Kind[]; pages?: string; live?: string[]; local?: string[] };
type Allowed = { id: string; reason: string; rules: Rule[] };
type Difference = { kind: Kind; live: string; local: string; context?: string };
type Row = {
	livePath: string;
	localPath: string;
	removed: boolean;
	found: Difference[];
	explained: Map<string, number>;
	unexplained: Difference[];
	error?: string;
};
type Captured = { text: string; links: string[]; images: { url: string; alt: string }[] };

// ---- Content extraction (runs in the browser) ----

/**
 * Reads the content of the page. The live layout has no <main>: its content sits between the first
 * and second rule spans, after the site title and tagline, which are kept as part of the text so
 * the allowlist can account for them. Locally the content is <main>, or one edition's section.
 */
function extract(arg: { live: boolean; hash: string }): Captured {
	let nodes: Element[];
	let prefix = '';
	if (arg.live) {
		const kids = Array.from((document.querySelector('body > div') as HTMLElement).children);
		const isRule = (el: Element) =>
			el.tagName === 'SPAN' && el.children.length === 1 && el.children[0].tagName === 'HR';
		const first = kids.findIndex(isRule);
		const second = kids.findIndex((el, i) => i > first && isRule(el));
		if (first < 0 || second < 0) throw new Error('the live page has no content area');
		nodes = kids.slice(first + 1, second);
		prefix = 'Evil Glasses Storytelling, software, and mobile games ';
	} else {
		const scope = arg.hash ? document.getElementById(arg.hash) : document.querySelector('main');
		if (!scope) throw new Error(`no content element for #${arg.hash}`);
		nodes = [scope];
	}
	const text: string[] = [];
	const links = new Set<string>();
	const images = new Map<string, string>();
	for (const node of nodes) {
		text.push((node as HTMLElement).innerText);
		for (const el of [node, ...Array.from(node.querySelectorAll('*'))]) {
			if (el instanceof HTMLAnchorElement && /^(https?:|mailto:)/.test(el.href)) {
				if (!el.href.startsWith(location.origin)) links.add(el.href);
			}
			if (el instanceof HTMLImageElement) {
				const url = el.currentSrc || el.src;
				if (url && !images.has(url)) images.set(url, el.alt);
			}
		}
	}
	return {
		text: prefix + text.join(' '),
		links: [...links],
		images: [...images].map(([url, alt]) => ({ url, alt }))
	};
}

// ---- Comparison ----

function normalize(text: string): string {
	// The new story pages capitalise the byline ("By Sara Rogers"); that is styling, not content.
	return text
		.replace(/\s+/g, ' ')
		.replace(/\bBy (?=[A-Z])/g, 'by ')
		.trim();
}

/** Word-level diff: the runs of words that differ, with a few words of context. */
function diffText(a: string, b: string): Difference[] {
	const x = a ? a.split(' ') : [];
	const y = b ? b.split(' ') : [];
	let start = 0;
	while (start < x.length && start < y.length && x[start] === y[start]) start++;
	let endX = x.length;
	let endY = y.length;
	while (endX > start && endY > start && x[endX - 1] === y[endY - 1]) {
		endX--;
		endY--;
	}
	const xs = x.slice(start, endX);
	const ys = y.slice(start, endY);
	const n = xs.length;
	const m = ys.length;
	const table = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			table[i][j] =
				xs[i] === ys[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
		}
	}
	const found: Difference[] = [];
	let i = 0;
	let j = 0;
	let live: string[] = [];
	let local: string[] = [];
	let at = start;
	const flush = () => {
		if (!live.length && !local.length) return;
		const before = x.slice(Math.max(0, at - 4), at).join(' ');
		found.push({ kind: 'text', live: live.join(' '), local: local.join(' '), context: before });
		live = [];
		local = [];
	};
	while (i < n || j < m) {
		if (i < n && j < m && xs[i] === ys[j]) {
			flush();
			i++;
			j++;
			at = start + i + 1;
		} else if (j >= m || (i < n && table[i + 1][j] >= table[i][j + 1])) {
			if (!live.length && !local.length) at = start + i;
			live.push(xs[i++]);
		} else {
			if (!live.length && !local.length) at = start + i;
			local.push(ys[j++]);
		}
	}
	flush();
	return found;
}

async function hashImage(page: Page, url: string): Promise<bigint | null> {
	let body: Buffer;
	if (url.startsWith('data:')) {
		body = Buffer.from(await (await fetch(url)).arrayBuffer());
	} else {
		const response = await page.request.get(url);
		if (!response.ok()) return null;
		body = await response.body();
	}
	let image = sharp(body, { density: 144 }).flatten({ background: '#ffffff' });
	try {
		image = sharp(await image.png().toBuffer()).trim();
		await image.clone().toBuffer();
	} catch {
		image = sharp(await sharp(body, { density: 144 }).flatten({ background: '#fff' }).toBuffer());
	}
	// Shrink in two steps (an area average), so lossy re-encoding (AVIF, WebP) doesn't move the hash.
	const small = await image.resize(72, 64, { fit: 'fill' }).greyscale().toBuffer();
	const pixels = await sharp(small)
		.resize(9, 8, { fit: 'fill' })
		.toColourspace('b-w')
		.raw()
		.toBuffer();
	let hash = 0n;
	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			hash = (hash << 1n) | (pixels[row * 9 + col] < pixels[row * 9 + col + 1] ? 1n : 0n);
		}
	}
	return hash;
}

function distance(a: bigint, b: bigint): number {
	let bits = a ^ b;
	let count = 0;
	while (bits) {
		count += Number(bits & 1n);
		bits >>= 1n;
	}
	return count;
}

async function compareImages(
	livePage: Page,
	localPage: Page,
	live: Captured['images'],
	local: Captured['images']
): Promise<Difference[]> {
	const localHashes: (bigint | null)[] = [];
	for (const image of local) localHashes.push(await hashImage(localPage, image.url));
	const found: Difference[] = [];
	for (const image of live) {
		const hash = await hashImage(livePage, image.url);
		const name = `${new URL(image.url).pathname}${image.alt ? ` (${image.alt})` : ''}`;
		if (hash === null) {
			found.push({ kind: 'image', live: name, local: 'live image did not load' });
			continue;
		}
		const best = Math.min(64, ...localHashes.map((h) => (h === null ? 64 : distance(h, hash))));
		if (best > HASH_DISTANCE) {
			found.push({
				kind: 'image',
				live: name,
				local: `(no matching image; the closest differs in ${best} of 64 bits)`
			});
		}
	}
	return found;
}

/** Removes every fragment the rules allow from the text; returns what is left and what was used. */
function consume(text: string, patterns: [string, RegExp][]): { rest: string; used: string[] } {
	const used: string[] = [];
	let rest = text;
	for (const [id, pattern] of patterns) {
		rest = rest.replace(pattern, () => {
			used.push(id);
			return ' ';
		});
	}
	return { rest: rest.trim(), used };
}

/** The ids of the entries that explain the difference, or null when it is not fully explained. */
function explain(allowed: Allowed[], livePath: string, diff: Difference): string[] | null {
	const rules = allowed.flatMap((entry) =>
		entry.rules
			.filter((r) => (r.kinds ?? ['text']).includes(diff.kind))
			.filter((r) => !r.pages || new RegExp(r.pages).test(livePath))
			.map((r) => ({ id: entry.id, rule: r }))
	);
	const fragments = (side: 'live' | 'local'): [string, RegExp][] =>
		rules.flatMap(({ id, rule }) =>
			(rule[side] ?? []).map((p): [string, RegExp] => [id, new RegExp(p, 'g')])
		);
	if (diff.kind !== 'text') {
		const hit = rules.find(({ rule }) =>
			(rule.live ?? []).some((p) => new RegExp(p).test(diff.live))
		);
		return hit ? [hit.id] : null;
	}
	const live = consume(diff.live, fragments('live'));
	const local = consume(diff.local, fragments('local'));
	if (live.rest || local.rest) return null;
	return [...new Set([...live.used, ...local.used])];
}

// ---- Run ----

async function waitForServer(): Promise<void> {
	for (let attempt = 0; attempt < 100; attempt++) {
		try {
			if ((await fetch(LOCAL)).ok) return;
		} catch {
			// not up yet
		}
		await new Promise((r) => setTimeout(r, 200));
	}
	throw new Error(`the preview server did not start on ${LOCAL}`);
}

/** GitHub Pages sometimes answers with an error page; try a few times before giving up. */
async function readLive(page: Page, path: string): Promise<Captured> {
	for (let attempt = 1; ; attempt++) {
		try {
			await page.goto(LIVE + encodeURI(path), { waitUntil: 'networkidle' });
			return await page.evaluate(extract, { live: true, hash: '' });
		} catch (error) {
			if (attempt === 3) throw error;
			await new Promise((r) => setTimeout(r, 2000 * attempt));
		}
	}
}

async function main(): Promise<number> {
	if (!process.argv.includes('--no-build')) {
		const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
		if (build.status !== 0) throw new Error('npm run build failed');
	}
	const allowed = (JSON.parse(await readFile('scripts/compare-live-allowed.json', 'utf8'))
		.entries ?? []) as Allowed[];
	const oldUrls = JSON.parse(await readFile('tests/fixtures/old-urls.json', 'utf8')) as Record<
		string,
		string
	>;
	const pages: [string, string][] = [
		...KEPT.map((p): [string, string] => [p, p]),
		...Object.entries(oldUrls)
	];

	const server: ChildProcess = spawn('npm', ['run', 'preview'], {
		env: { ...process.env, PORT: String(PORT) },
		stdio: 'ignore'
	});
	const browser = await chromium.launch();
	const rows: Row[] = [];
	try {
		await waitForServer();
		const livePage = await browser.newPage();
		const localPage = await browser.newPage();
		for (const [livePath, localPath] of pages) {
			const row: Row = {
				livePath,
				localPath,
				removed: livePath === '/software',
				found: [],
				explained: new Map(),
				unexplained: []
			};
			rows.push(row);
			if (row.removed) {
				const gone: Difference = { kind: 'page', live: livePath, local: '(removed)' };
				const ids = explain(allowed, livePath, gone);
				if (!ids) row.unexplained.push(gone);
				for (const id of ids ?? []) row.explained.set(id, 1);
				continue;
			}
			try {
				const [path, hash = ''] = localPath.split('#');
				const live = await readLive(livePage, livePath);
				await localPage.goto(LOCAL + path, { waitUntil: 'networkidle' });
				if (hash) await localPage.waitForSelector(`#${hash}`);
				const local = await localPage.evaluate(extract, { live: false, hash });
				row.found.push(...diffText(normalize(live.text), normalize(local.text)));
				for (const link of live.links) {
					if (!local.links.includes(link)) {
						row.found.push({ kind: 'link', live: link, local: '(missing)' });
					}
				}
				row.found.push(...(await compareImages(livePage, localPage, live.images, local.images)));
			} catch (error) {
				row.error = error instanceof Error ? error.message : String(error);
			}
			for (const diff of row.found) {
				const ids = explain(allowed, livePath, diff);
				if (!ids) row.unexplained.push(diff);
				for (const id of ids ?? []) row.explained.set(id, (row.explained.get(id) ?? 0) + 1);
			}
			console.log(
				`${livePath}: ${row.error ? 'error' : `${row.unexplained.length} unexplained, ${row.found.length - row.unexplained.length} explained`}`
			);
		}
	} finally {
		await browser.close();
		server.kill();
	}

	await writeReport(rows, allowed);
	const bad = rows.filter((r) => r.unexplained.length || r.error).length;
	return bad ? 1 : 0;
}

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const quote = (s: string) => '`' + s.replace(/`/g, "'") + '`';

async function writeReport(rows: Row[], allowed: Allowed[]): Promise<void> {
	const unexplained = rows.reduce((n, r) => n + r.unexplained.length, 0);
	const explained = rows.reduce((n, r) => n + r.found.length - r.unexplained.length, 0);
	const errors = rows.filter((r) => r.error).length;
	const used = new Map<string, number>();
	for (const row of rows)
		for (const [id, n] of row.explained) used.set(id, (used.get(id) ?? 0) + n);

	const lines: string[] = [
		'# Live site comparison',
		'',
		`Live: ${LIVE}. Local: build/ served on ${LOCAL}.`,
		'',
		`**${rows.length} pages compared: ${explained} explained differences, ${unexplained} unexplained differences, ${errors} errors.**`,
		'',
		'| Live URL | Local URL | Result |',
		'| --- | --- | --- |'
	];
	for (const row of rows) {
		const result = row.removed
			? 'removed (intended: the software page is gone)'
			: row.error
				? `error: ${row.error}`
				: row.unexplained.length
					? `${row.unexplained.length} unexplained`
					: row.found.length
						? `ok, ${row.found.length} explained (${[...row.explained.keys()].join(', ')})`
						: 'identical';
		lines.push(`| ${LIVE}${cell(row.livePath)} | ${cell(row.localPath)} | ${cell(result)} |`);
	}
	lines.push('', '## Allowlist use', '');
	for (const entry of allowed) {
		lines.push(`- \`${entry.id}\`: ${used.get(entry.id) ?? 0} differences. ${entry.reason}`);
	}
	lines.push('', '## Unexplained differences', '');
	if (!unexplained && !errors) lines.push('None.');
	for (const row of rows) {
		if (!row.unexplained.length && !row.error) continue;
		lines.push(`### ${row.livePath}`, '');
		if (row.error) lines.push(`Error: ${row.error}`, '');
		for (const diff of row.unexplained) {
			lines.push(`- ${diff.kind}${diff.context ? ` after ${quote(diff.context)}` : ''}`);
			lines.push(`  - live: ${quote(diff.live || '(nothing)')}`);
			lines.push(`  - local: ${quote(diff.local || '(nothing)')}`);
		}
		lines.push('');
	}
	await mkdir('.sdlc/local/compare-live', { recursive: true });
	await writeFile(REPORT, lines.join('\n') + '\n');
	console.log(
		`${rows.length} pages, ${explained} explained, ${unexplained} unexplained differences. Report: ${REPORT}`
	);
}

main().then(
	(code) => process.exit(code),
	(error) => {
		console.error(error);
		process.exit(2);
	}
);
