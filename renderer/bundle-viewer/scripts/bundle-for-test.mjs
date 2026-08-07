// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Build one TypeScript module into a temporary ESM file so a Node test can import it.
//
// The viewer's own `dist/app.js` is not importable here on purpose: it touches `document` at module
// scope, because it is a page and not a library. And it must not gain a test-only export surface —
// `dist/` is exactly what the publish operation copies into a bundle, so anything extra in it would
// ship to every reader.
//
// Building to the OS temp directory keeps that boundary: nothing test-shaped is ever written into
// the directory that becomes `viewer/`.

import { build } from 'esbuild';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function importModule(entry) {
  const dir = mkdtempSync(join(tmpdir(), 'bundle-viewer-test-'));
  const outfile = join(dir, 'module.mjs');
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    target: 'es2022',
    outfile,
    logLevel: 'silent',
  });
  return import(pathToFileURL(outfile).href);
}
