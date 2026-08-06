#!/usr/bin/env node
// A **generic static file server**, for serving a published bundle during the acceptance run.
//
// The point of the acceptance criterion is that a bundle works from *any* static host, so this must
// be as ordinary as possible: it serves bytes from a directory over HTTP and does nothing else. No
// bundle-aware routing, no injected headers, no index generation, no rewriting. If a bundle needed
// any of that, it would not be self-contained.
//
// It is a **test instrument**, not part of the bundle and not part of the product. Two things it
// does do, both defensive rather than helpful:
//
// - **Path containment.** A request that resolves outside the served root is refused. A server that
//   happily served `../../` while a bundle was under test would be measuring the wrong thing and
//   would be a real hazard on a machine that has other files on it.
// - **Binds loopback only**, so running the acceptance does not put a directory on the network.
//
// Usage:  node scripts/serve-bundle.mjs <bundle-dir> [port]

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, normalize, resolve, sep, extname } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const port = Number(process.argv[3] ?? 0);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.arrows': 'application/vnd.apache.arrow.stream',
  '.css': 'text/css; charset=utf-8',
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  // Normalize *then* contain: normalizing alone still permits `..` to climb out.
  const target = resolve(join(root, normalize(rel)));
  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403).end('outside the served root');
    return;
  }
  let size;
  try {
    const st = statSync(target);
    if (!st.isFile()) throw new Error('not a file');
    size = st.size;
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(target)] ?? 'application/octet-stream',
    'content-length': String(size),
    // The viewer verifies every asset against the manifest, so a stale cached partition would fail
    // its hash rather than be drawn. Disabling the cache keeps a re-run measuring the bundle rather
    // than the browser.
    'cache-control': 'no-store',
  });
  createReadStream(target).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  const address = server.address();
  console.log(`serving ${root} at http://127.0.0.1:${address.port}/viewer/index.html`);
});
