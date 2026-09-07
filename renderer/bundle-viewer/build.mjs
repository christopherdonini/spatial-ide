#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';

// `notice()` itself lives in `./notice.mjs`, not here — this file runs a build as a side effect of
// being loaded, so `scripts/notice.test.mjs` cannot import it directly without also running (and
// needing to succeed at) a full esbuild bundle. `notice.mjs` has no side effects on import.
import { notice } from './notice.mjs';

mkdirSync('dist', { recursive: true });

const result = await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: 'dist/app.js',
  sourcemap: false,
  // No absolute paths in the output, and no build-time environment leaking into it.
  absWorkingDir: process.cwd(),
  logLevel: 'info',
  // `notice()` (in `./notice.mjs`) derives the notice file from what was *actually* bundled, not
  // from a list.
  metafile: true,
});

copyFileSync('index.html', 'dist/index.html');
writeFileSync('dist/NOTICE.txt', notice(result.metafile), 'utf8');
console.log('dist/index.html + dist/app.js + dist/NOTICE.txt');
