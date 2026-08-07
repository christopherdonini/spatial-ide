// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Bundles and runs the TS regression suite under node. esbuild is already a dev dependency, so
// this needs no new tooling.
import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

for (const suite of ['regression', 'analysis']) {
  const out = join(tmpdir(), `bakeoff-${suite}-${process.pid}.mjs`);
  await build({
    entryPoints: [`src/${suite}.test.ts`],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    outfile: out,
    logLevel: 'error',
  });
  await import(pathToFileURL(out).href);
}
