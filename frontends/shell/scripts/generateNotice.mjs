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
// imported directly and called with FOUR sets (RELEASE-0.1 item 9 and DECISIONS-PENDING entry 62;
// ADR-030 candidate (a)). The first three are each read from a BUILD MANIFEST; the fourth is not,
// and that difference is stated in the generated notice itself rather than smoothed over:
//
//   1. the bundle viewer's own esbuild metafile (`renderer/bundle-viewer/dist-metafile.json`,
//      written by that package's own `build.mjs`, sibling to `dist/` so it never becomes a
//      published-bundle viewer asset) -- as before this piece;
//   2. this package's OWN Vite/Rollup build manifest (`frontends/shell/dist-metafile.json`, written
//      by `vite.config.ts`'s own inline `packageMetafilePlugin`, same sibling-of-`dist/` placement);
//   3. the Rust crates linked into `frontends/shell/src-tauri`'s own binary, from its own
//      `Cargo.lock` via `cargo metadata`/`cargo tree` (`./rustCrateNotices.mjs`);
//   4. the third-party works embedded in DuckDB's amalgamated C/C++ source tree, which
//      `libduckdb-sys` compiles into the application and which NO build manifest here reports --
//      enumerated from DuckDB's own upstream source tree at the pinned version and hash-pinned
//      in-tree under `LICENSES/third-party/duckdb-<version>/` (`./duckdbAmalgamationNotices.mjs`).
//      This set closes the one gap set (3) structurally cannot see; until entry 62 was ruled, the
//      notice named those works and stated that their licence texts were not carried.
//
// ## The two-pass build this script's placement in `package.json`'s "build" script exists for
//
// Set (2) above does not exist until THIS package's own `vite build` has produced it -- but
// `NoticesPanel.tsx`'s `?raw` import bakes whatever `src/generated/NOTICE.txt` held AT THAT BUILD's
// own module-load time into the built `dist/` output; regenerating the file afterward does not
// change what a COMPLETED build already embedded. So `package.json`'s "build" script runs
// `vite build` TWICE: the first pass (after this script's own `prebuild`-hook invocation, which
// runs before `vite build` has ever produced set (2) and so calls `notice()` in its BOOTSTRAP mode,
// `extra.bootstrap: true` -- named as provisional in the file itself, never silently claiming a
// scope it does not yet enumerate) produces a fresh `dist-metafile.json` for set (2); this script
// then runs AGAIN, this time with set (2) available, producing the FINAL, fully-scoped
// `src/generated/NOTICE.txt`; the second `vite build` embeds THAT text. Byte-identity between
// `src/generated/NOTICE.txt` and what actually ships is asserted by a real test
// (`src/notices/noticeByteIdentity.test.ts`).
//
// ## ONLY `npm run build` produces a shippable NOTICE (release-cut fix batch, SHOULD-FIX 8)
//
// Running this script by hand (`npm run generate:notice`), or running a lone `vite build`, does NOT
// produce a shippable artifact, and neither does any other ordering of the two:
//
//   - this script alone rewrites `src/generated/NOTICE.txt` but changes NOTHING in `dist/`, because
//     the `?raw` import that carries it into the bundle is resolved at BUILD time;
//   - a lone `vite build` embeds whatever `src/generated/NOTICE.txt` happened to hold, which after
//     any dependency change is the PREVIOUS build's scope, and rewrites `dist-metafile.json` so it
//     no longer describes the notice that was just embedded.
//
// Only `package.json`'s "build" script (`tsc --noEmit && vite build && npm run generate:notice &&
// vite build`) leaves `src/generated/NOTICE.txt`, `dist/`, and `dist-metafile.json` describing the
// SAME build. `scripts/checkDistNotice.mjs` enforces the cheap mtime consequence of that ordering
// (`npm run build` leaves `src/generated/NOTICE.txt` OLDER than both `dist-metafile.json` and
// `dist/`'s newest entry, because the second `vite build` follows it) -- so a hand-run of this
// script after a build, which is the common way to end up with a `dist/` whose embedded notice is
// not the one on disk, is refused rather than silently believed.
//
// **This process's own cwd is `frontends/shell`, not `renderer/bundle-viewer`** -- `notice()`
// resolves each package set's own third-party directories against THAT SET's own `baseDir`
// (`notice.mjs`'s `baseDir` parameter and `extra.npmSets[].baseDir`, release-cut fix batch MUST-FIX
// 1, generalised by this piece), precisely so a caller running from a different cwd (this script)
// never silently reads the WRONG `node_modules` tree for a given set.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { notice } from '../../../renderer/bundle-viewer/notice.mjs';
import { collectLinkedCrates, buildCanonicalLicenseTexts, TARGET_TRIPLE } from './rustCrateNotices.mjs';
import { buildAmalgamationSet } from './duckdbAmalgamationNotices.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const shellDir = join(here, '..');
const repoRoot = join(shellDir, '..', '..');
const viewerDir = join(shellDir, '..', '..', 'renderer', 'bundle-viewer');
const viewerMetafilePath = join(viewerDir, 'dist-metafile.json');
const shellMetafilePath = join(shellDir, 'dist-metafile.json');

if (!existsSync(viewerMetafilePath)) {
  throw new Error(
    `${viewerMetafilePath} does not exist -- run \`npm run build\` in renderer/bundle-viewer first. ` +
      'It writes this metafile alongside dist/NOTICE.txt; this script reads it rather than ' +
      "re-running esbuild itself or copying notice.mjs's text by hand."
  );
}

const viewerMetafile = JSON.parse(readFileSync(viewerMetafilePath, 'utf8'));

const crates = collectLinkedCrates();
const canonicalTexts = buildCanonicalLicenseTexts(crates, { repoRoot });
const rustCrates = {
  heading: 'RUST CRATES STATICALLY LINKED INTO THE PACKAGED APPLICATION',
  crates,
  canonicalTexts,
  // Passed through so the rendered section's own intro can NAME the triple this set is a fact about
  // (release-cut fix batch, SHOULD-FIX 9) -- `collectLinkedCrates()`'s own default, not a second
  // literal that could drift from the one the collector actually filtered on.
  targetTriple: TARGET_TRIPLE,
};

// Set (4), the DuckDB amalgamation (DECISIONS-PENDING entry 62 = (a)): read from the pinned
// manifest, with every sha256 re-verified and the pinned library list checked against the crate
// tarball's own third_party/ listing. Both guards throw rather than degrade -- see that module's
// own doc comment for why this set, unlike the other three, has no honest degraded rendering.
// Built from the SAME `crates` array set (3) uses, so the tarball it inspects belongs to the
// `libduckdb-sys` cargo actually resolved for this build rather than to a registry path literal.
const duckdbAmalgamation = buildAmalgamationSet(crates);

let extra;
if (existsSync(shellMetafilePath)) {
  const shellMetafile = JSON.parse(readFileSync(shellMetafilePath, 'utf8'));
  extra = {
    npmSets: [
      {
        heading: 'THIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND (frontends/shell/dist)',
        metafile: shellMetafile,
        baseDir: shellDir,
      },
    ],
    rustCrates,
    duckdbAmalgamation,
  };
} else {
  // Bootstrap pass (see this file's own top comment): `frontends/shell/dist-metafile.json` does
  // not exist yet on a fresh clone, before this package's own `vite build` has ever run once.
  // Named provisional in the file itself rather than silently omitting the packaged frontend's own
  // npm set while still claiming full scope.
  console.log(
    'generate:notice: frontends/shell/dist-metafile.json not found yet -- writing a provisional ' +
      '(bootstrap) NOTICE.txt without the packaged frontend\'s own npm section. The "build" script ' +
      'regenerates this file after its first `vite build`, with full scope.'
  );
  extra = { bootstrap: true, rustCrates, duckdbAmalgamation };
}

const text = notice(viewerMetafile, undefined, extra);

const outDir = join(shellDir, 'src', 'generated');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'NOTICE.txt'), text, 'utf8');
// `Buffer.byteLength`, not `text.length` -- the text carries non-ASCII characters (©, —), so a
// JS string's `.length` (UTF-16 code units) understates the actual UTF-8 byte count on disk.
console.log(`src/generated/NOTICE.txt (${Buffer.byteLength(text, 'utf8')} bytes)`);
