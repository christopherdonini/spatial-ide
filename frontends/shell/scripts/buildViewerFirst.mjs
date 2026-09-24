#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// `prebuild`/`pretypecheck`/`prebuild:frontend:measure` precondition
// (frontends/shell/VIEWER-BUILD-ORDER-PREREGISTRATION.md, Amendment 2): builds
// `renderer/bundle-viewer` before any of this package's own build-ish scripts run, so a bare
// `npm run build` (or `typecheck`, or `build:frontend:measure`) here succeeds on a clean clone
// without the caller having to know about the cross-package dependency `scripts/generateNotice.mjs`
// already documents (it reads that package's `dist-metafile.json`).
//
// If the viewer's own `node_modules` is missing, this refuses with a message naming the fix
// (`npm ci` there) instead of letting `node build.mjs` fail on a missing `esbuild` import with a
// bare stack trace. CI installs the viewer's dependencies before this runs, so this check never
// fires there — it only fires for a bare clone where nothing has been installed yet.
// `tauri.conf.json`'s `beforeBuildCommand` does NOT install them itself; it only runs `npm run
// build` here, which reaches this same script through `prebuild`.

import { execFileSync, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const viewerDir = join(here, '..', '..', '..', 'renderer', 'bundle-viewer');

if (!existsSync(join(viewerDir, 'node_modules'))) {
  console.error(
    `buildViewerFirst: ${join(viewerDir, 'node_modules')} not found -- run \`npm ci\` in ` +
      'renderer/bundle-viewer first (frontends/shell\'s build reads its dist-metafile.json).'
  );
  process.exit(1);
}

try {
  if (process.platform === 'win32') {
    // Windows resolves `npm` to `npm.cmd`, which `execFileSync` cannot spawn directly (EINVAL) and
    // can only reach through a shell; a fixed literal command (no interpolated argument) avoids
    // Node's DEP0190 warning about unescaped shell args.
    execSync('npm run build', { cwd: viewerDir, stdio: 'inherit' });
  } else {
    execFileSync('npm', ['run', 'build'], { cwd: viewerDir, stdio: 'inherit' });
  }
} catch (err) {
  console.error(`buildViewerFirst: renderer/bundle-viewer's \`npm run build\` failed.`);
  process.exit(typeof err?.status === 'number' ? err.status : 1);
}
