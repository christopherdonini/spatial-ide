#!/usr/bin/env node
// Bundles the viewer into `dist/`, which the publish operation reads as its `ViewerAssets`.
//
// **Bundled rather than served as loose modules**, for the same reason the probe is: `apache-arrow`
// is a package, and a published bundle must work from a plain static file server with no import-map
// and no module resolution beyond relative paths.
//
// **Deterministic on purpose.** The manifest lists a content hash for every viewer asset, so two
// builds of the same sources must produce the same bytes or a bundle's hashes would depend on when
// it was built. `sourcemap: false` because a sourcemap embeds absolute paths — which would both
// break determinism and put a filesystem path in a published artifact (docs/09).

import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: 'dist/app.js',
  sourcemap: false,
  // No absolute paths in the output, and no build-time environment leaking into it.
  absWorkingDir: process.cwd(),
  logLevel: 'info',
});

copyFileSync('index.html', 'dist/index.html');
console.log('dist/index.html + dist/app.js');
