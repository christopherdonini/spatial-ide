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
// script's output IS `notice()`'s own output, not a hand-copy of it.
//
// **This process's own cwd is `frontends/shell`, not `renderer/bundle-viewer`** -- `notice()`
// resolves the third-party package directories its own metafile names against ITS OWN file
// location by default (`notice.mjs`'s own `baseDir` parameter, release-cut fix batch MUST-FIX 1),
// precisely so a caller running from a different cwd (this script) does not silently read a
// DIFFERENT `node_modules` tree (this package's own, which declares different dependency versions
// than the viewer's). Byte-identity with `renderer/bundle-viewer/dist/NOTICE.txt` is not merely
// asserted in this comment -- it is a real vitest assertion,
// `src/notices/noticeByteIdentity.test.ts`.

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
