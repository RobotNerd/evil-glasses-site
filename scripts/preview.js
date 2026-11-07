// Serves build/ the way GitHub Pages does: /path resolves to path.html (or path/index.html),
// and an unknown path gets 404.html with status 404.
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('build');
const port = Number(process.env.PORT ?? 4173);

const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.ico': 'image/x-icon',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.woff2': 'font/woff2'
};

async function isFile(path) {
	try {
		return (await stat(path)).isFile();
	} catch {
		return false;
	}
}

async function resolveFile(pathname) {
	const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
	const base = join(root, clean);
	if (!base.startsWith(root)) return null;
	const candidates = [base, `${base}.html`, join(base, 'index.html')];
	for (const candidate of candidates) {
		if (await isFile(candidate)) return candidate;
	}
	return null;
}

createServer(async (req, res) => {
	const { pathname } = new URL(req.url ?? '/', 'http://localhost');
	let file = await resolveFile(pathname);
	let status = 200;
	if (!file) {
		file = join(root, '404.html');
		status = 404;
	}
	try {
		let body = await readFile(file);
		const type = types[extname(file)] ?? 'application/octet-stream';
		const headers = { 'content-type': type };
		// GitHub Pages compresses text, so do the same here.
		if (/^(text\/|application\/(json|xml)|image\/svg)/.test(type)) {
			body = gzipSync(body);
			headers['content-encoding'] = 'gzip';
		}
		res.writeHead(status, headers);
		res.end(body);
	} catch {
		res.writeHead(404, { 'content-type': 'text/plain' });
		res.end('Not found');
	}
}).listen(port, () => console.log(`Serving build/ at http://localhost:${port}`));
