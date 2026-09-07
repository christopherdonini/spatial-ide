#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Prebuild step (RELEASE-0.1 Amendment 3, item 2, "Notice channel"; wired as `pretypecheck` and
// `prebuild` in `package.json`, so both `npm run typecheck` and `npm run build` -- and therefore
// `npm run verify` -- always regenerate this file first): writes `src/generated/NOTICE.txt`, the
// ONE text every notice surface in a packaged build reads -- the frontend's own "Notices" view
// (`?raw` import, `src/notices/NoticesPanel.tsx`) and, byte-identical, the `NOTICE.txt` that
// `tauri.conf.json`'s `bundle.resources` places beside the installed executable.
//
// The text itself is never hand-copied here. `notice()` (`renderer/bundle-viewer/notice.mjs`) is
// imported directly and called with the SAME esbuild metafile the bundle viewer's own build just
// produced (`renderer/bundle-viewer/dist-metafile.json`, written by that package's own
// `build.mjs`, sibling to `dist/` so it never becomes a published-bundle viewer asset) -- so this
// script's output is `notice()`'s own output, not a copy of it, and it cannot drift from the text
// every published bundle's own `viewer/NOTICE.txt` already carries.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { notice } from '../../../renderer/bundle-viewer/notice.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const viewerDir = join(here, '..', '..', '..', 'renderer', 'bundle-viewer');
const metafilePath = join(viewerDir, 'dist-metafile.json');

if (!existsSync(metafilePath)) {
  throw new Error(
    `${metafilePath} does not exist -- run \`npm run build\` in renderer/bundle-viewer first. ` +
      'It writes this metafile alongside dist/NOTICE.txt; this script reads it rather than ' +
      "re-running esbuild itself or copying notice.mjs's text by hand."
  );
}

const metafile = JSON.parse(readFileSync(metafilePath, 'utf8'));
const text = notice(metafile);

const outDir = join(here, '..', 'src', 'generated');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'NOTICE.txt'), text, 'utf8');
// `Buffer.byteLength`, not `text.length` -- the text carries non-ASCII characters (©, —), so a
// JS string's `.length` (UTF-16 code units) understates the actual UTF-8 byte count on disk.
console.log(`src/generated/NOTICE.txt (${Buffer.byteLength(text, 'utf8')} bytes)`);
