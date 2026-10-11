// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Guards the shipped notice text (entry 51 fix batch, SHOULD-FIX 2). `notice()` writes every
// published bundle's `viewer/NOTICE.txt` (`build.mjs`, `kernel/src/bundle/mod.rs`'s `notice_path`);
// this test is what stops the EPSG/IOGP acknowledgement section from silently dropping out of a
// future edit to `notice.mjs` — nothing else in this repository checks the text this function
// produces.

import test from 'node:test';
import assert from 'node:assert/strict';

import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { notice, AMALGAMATION_END_SENTINEL } from '../notice.mjs';

// A minimal but real esbuild-metafile shape: one `node_modules/<pkg>` input is enough to pass
// `notice()`'s own "found no third-party packages" guard. `apache-arrow` is a real dependency
// (`package.json`), so `notice()`'s package.json/LICENSE read against it exercises the real
// third-party-section code path too, not just a mock.
const fakeMetafile = {
  inputs: {
    'node_modules/apache-arrow/index.js': {},
  },
};

test('the notice acknowledges IOGP ownership of the EPSG Geodetic Parameter Dataset', () => {
  const text = notice(fakeMetafile);
  // Two separate array lines in `notice.mjs` (wrapped for plain-text width), so the match spans
  // the line break rather than assuming one contiguous line.
  assert.match(text, /derived from the EPSG\n/);
  assert.match(
    text,
    /Geodetic Parameter Dataset, © IOGP \(International Association of Oil & Gas Producers\)/,
  );
});

test('the notice names the exact EPSG Terms of Use URL', () => {
  const text = notice(fakeMetafile);
  assert.match(text, /used under the EPSG Terms of Use: https:\/\/epsg\.org\/terms-of-use\.html/);
});

test('the notice informs the recipient of those Terms of Use, per the terms\' own obligation', () => {
  const text = notice(fakeMetafile);
  assert.match(
    text,
    /This notice informs you, the recipient, of those Terms of Use, as their own text requires/,
  );
});

test('the CRS-data section sits ahead of the third-party-code section', () => {
  // Entry 51's own framing (`notice.mjs`'s doc comment): the CRS data acknowledgement is a
  // different kind of thing than the compiled-in third-party code below it, and is placed first.
  const text = notice(fakeMetafile);
  const crsAt = text.indexOf('COORDINATE REFERENCE SYSTEM DATA');
  const thirdPartyAt = text.indexOf('THIRD-PARTY WORKS COMPILED INTO THIS VIEWER');
  assert.ok(crsAt !== -1, 'CRS section present');
  assert.ok(thirdPartyAt !== -1, 'third-party section present');
  assert.ok(crsAt < thirdPartyAt, 'CRS section precedes the third-party-code section');
});

// RELEASE-0.1 Amendment 3, item 2: the packaged installer's own AGPL notice + corresponding-source
// route (ADR-009 item 1 + AGPL-3.0 §6, route §6(d)) -- added to `notice()` itself, the ONE source
// both the viewer's own `dist/NOTICE.txt` and the packaged shell's beside-the-exe `NOTICE.txt`
// read. **§6/§6(d), not "§§4/5"** (release-cut fix batch, MUST-FIX 12 nit): this comment carried
// the same wrong section numbers `notice.mjs`'s own text carried before the architect correction
// recorded at `notice.mjs`'s "§6, not §4/§5" comment -- §4 governs conveying verbatim SOURCE and
// §5 conveying MODIFIED source, neither of which is shipping a built binary; §6 is the
// object-code section and §6(d) the network-server route this notice actually names.
test('the notice carries the installer\'s AGPL notice, distinct from the viewer\'s own', () => {
  const text = notice(fakeMetafile);
  assert.match(text, /THE SPATIAL IDE APPLICATION, WHEN DISTRIBUTED AS AN INSTALLED PROGRAM/);
  assert.match(text, /GNU Affero General Public License/);
});

test('the notice names the corresponding-source URL for an installed application', () => {
  const text = notice(fakeMetafile);
  assert.match(text, /https:\/\/github\.com\/christopherdonini\/spatial-ide/);
});

test('the installer section sits ahead of the third-party-code section, after the CRS section', () => {
  const text = notice(fakeMetafile);
  const crsAt = text.indexOf('COORDINATE REFERENCE SYSTEM DATA');
  const installerAt = text.indexOf('THE SPATIAL IDE APPLICATION, WHEN DISTRIBUTED AS AN INSTALLED PROGRAM');
  const thirdPartyAt = text.indexOf('THIRD-PARTY WORKS COMPILED INTO THIS VIEWER');
  assert.ok(crsAt !== -1 && installerAt !== -1 && thirdPartyAt !== -1);
  assert.ok(crsAt < installerAt && installerAt < thirdPartyAt);
});

// Release-cut fix batch, MUST-FIX 1. The TWO-ARGUMENT form is the one every published bundle ships
// (`build.mjs`) AND the one the installer places at `bundle-viewer\NOTICE.txt` (`tauri.conf.json`'s
// own resource glob; `kernel/src/bundle/mod.rs`'s `notice_path` for the bundle side) -- ONE file in
// TWO places, so its header has to read true in both. It used to say the installed copy's two
// further notice sets were "OWED, not yet done", which stopped being true the moment
// `generateNotice.mjs` began generating them: the installed tree carries the application's complete
// notice set in the `NOTICE.txt` beside the executable. Nothing in this output may claim an unmet
// obligation that is in fact met.
//
// **Word-boundaried and case-matched exactly as `frontends/shell/scripts/checkDistNotice.mjs`'s own
// `FORBIDDEN_PATTERNS` are** (closing commit, architect advisory A6). The bare alternation this test
// carried, `/OWED|not yet done|named gap/`, matched "OWED" as a substring -- so the word "ALLOWED"
// or "DISALLOWED" inside any third-party licence text this notice embeds (it embeds the whole
// AGPL-3.0, and apache-arrow's own files) would have failed it as a forbidden marker. Two checks of
// the same property that disagree about what the property IS are worse than one; these three
// patterns are now the same three, `\b` for `\b` and `i` for `i`, including the deliberate ABSENCE
// of `i` on OWED (lower-case "owed" is ordinary English and appears in this very file's own
// "the whole notice set the bundle owes" family).
test('the two-argument (bundle/viewer) header names no unmet obligation', () => {
  const text = notice(fakeMetafile);
  assert.doesNotMatch(text, /\bOWED\b/);
  assert.doesNotMatch(text, /\bnot yet done\b/i);
  assert.doesNotMatch(text, /\bnamed gap\b/i);
});

// The positive half of the same fix: the rewritten paragraph must actually SAY what the installed
// copy's scope is, in both places, rather than merely having had the false sentences deleted.
//
// **"application-wide", not "complete" (closing commit, architect advisory A2).** This paragraph
// pointed at the beside-the-executable NOTICE.txt as "the application's complete notice set", which
// asserted more about that file than that file asserted about itself: at the time its own header
// named an open gap outright -- the third-party sources inside DuckDB's amalgamated build that no
// build manifest here can see. That gap is CLOSED as of DECISIONS-PENDING entry 62 = (a)
// (2026-09-08): those works now carry their full upstream licence texts in their own section of the
// installed copy. "application-wide" still stands rather than becoming "complete", because the wider
// file states its four sources rather than claiming exhaustiveness, and a pointer should not upgrade
// that. Both halves are asserted, so neither the wording nor the claim can drift back silently.
//
// **The scope sentence names FOUR sets** (architect Q4, release-cut fix batch on the entry-62
// piece). It named three -- viewer, packaged frontend's npm dependencies, linked Rust crates --
// which was complete until the fourth section landed and stopped being complete the moment it did.
// The fourth is asserted BY NAME below, not merely admitted by the window: a bounded `[\s\S]` window
// proves the two anchors are near each other, and would have gone on passing with the DuckDB clause
// absent. The window itself is measured, not guessed: the gap between the two anchors is **207
// characters** on the current wording (was 134 with three sets -- bisected against 44d61b3's output
// with this test's own regex: a bound of 133 does not match, 134 does), so the existing 240 bound still
// holds it with room, and is deliberately left at 240 rather than widened to fit -- a window that
// grows to fit whatever the text became stops being a check.
test('the two-argument header states both of the file\'s two distribution scopes', () => {
  const text = notice(fakeMetafile);
  assert.match(text, /inside a published\nbundle, this is the whole notice set the bundle owes/);
  assert.match(text, /at bundle-viewer\\NOTICE\.txt/);
  assert.match(
    text,
    /The application-wide notice set[\s\S]{0,240}?is the separate NOTICE\.txt installed beside the executable/,
  );
  assert.match(
    text,
    /the third-party works inside DuckDB's own amalgamated C\/C\+\+ source tree --\nis the separate NOTICE\.txt/,
  );
  assert.doesNotMatch(text, /complete notice set/);
});

// The fifth set (PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md section 4, T10 to T14; ADR-030's note of
// 2026-10-09): source files ported from outside projects, enumerated from an in-tree registry. Every
// registry here is a fixture the tests write under `os.tmpdir()`; the real registry is empty.

const PORTED_VIEWER_HEADING = 'SOURCE FILES PORTED FROM OTHER PROJECTS COMPILED INTO THIS VIEWER';
const PORTED_APPLICATION_HEADING = 'SOURCE FILES PORTED FROM OTHER PROJECTS INTO THIS APPLICATION';
const VIEWER_PORT = 'renderer/bundle-viewer/src/ported-view.ts';
const STYLE_PORT = 'renderer/style-ts/src/ported-style.ts';
const KERNEL_PORT = 'kernel/src/ported_kernel.rs';
const SHELL_PORT = 'frontends/shell/src/ported-shell.ts';
const PINNED_TEXT = 'MIT License\n\nCopyright (c) 2020 The Upstream Authors\n\nPermission is hereby granted.\n';
const UPSTREAM_COMMIT = 'b'.repeat(40);

function portedFixture(workFiles) {
  const root = mkdtempSync(join(tmpdir(), 'notice-ported-'));
  const bytes = Buffer.from(PINNED_TEXT, 'utf8');
  const works = Object.entries(workFiles).map(([work, paths]) => {
    mkdirSync(join(root, work), { recursive: true });
    writeFileSync(join(root, work, 'LICENSE'), PINNED_TEXT, 'utf8');
    return {
      work,
      upstream_repository: `https://example.org/${work}`,
      upstream_commit: UPSTREAM_COMMIT,
      license_id: 'MIT',
      license_id_basis: 'self-declared',
      texts: [
        { file: 'LICENSE', upstream_path: 'LICENSE', bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') },
      ],
      retrieved: '2026-10-11',
      adopted_by: 'round 1, item 1',
      files: paths.map((path) => ({ path, upstream_path: `up/${path}`, copyright: ['Copyright (c) 2020 The Upstream Authors'] })),
    };
  });
  writeFileSync(join(root, 'MANIFEST.json'), JSON.stringify({ schema: 1, works }), 'utf8');
  return root;
}

// The smallest DuckDB set `notice()` renders, so its end sentinel exists to be ordered against.
const fakeAmalgamation = {
  heading: 'DUCKDB\'S BUNDLED THIRD-PARTY SOURCES',
  works: [{ lib: 'x', licenseId: 'MIT', note: null, files: [{ file: 'LICENSE', upstreamPath: 'x/LICENSE', text: 'text' }] }],
  crateName: 'libduckdb-sys',
  crateVersion: '0.0.0',
  duckdbTag: 'v0',
  duckdbCommit: 'c'.repeat(40),
  upstreamRepository: 'https://example.org/duckdb',
  pinnedDirName: 'LICENSES/third-party/duckdb-0',
  retrieved: '2026-10-11',
};
const viewerDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const withViewerPort = { inputs: { 'node_modules/apache-arrow/index.js': {}, 'src/ported-view.ts': {}, '../style-ts/src/ported-style.ts': {} } };
const portedExtra = {
  npmSets: [{ heading: 'THIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND (x)', metafile: fakeMetafile, baseDir: viewerDir }],
  duckdbAmalgamation: fakeAmalgamation,
};

test('a registered viewer port present in the metafile reaches the viewer notice with its full pinned text', () => {
  const portedRoot = portedFixture({ vw: [VIEWER_PORT, STYLE_PORT], kw: [KERNEL_PORT] });
  try {
    const text = notice(withViewerPort, undefined, null, { portedRoot });
    const at = text.indexOf(PORTED_VIEWER_HEADING);
    assert.ok(at !== -1, 'the viewer subsection is present');
    assert.ok(text.indexOf('THIRD-PARTY WORKS COMPILED INTO THIS VIEWER') < at, 'it follows the package section');
    const section = text.slice(at);
    assert.match(section, new RegExp(`^vw: https://example\\.org/vw @ ${UPSTREAM_COMMIT} — MIT$`, 'm'));
    assert.match(section, new RegExp(`^ {2}ported file ${VIEWER_PORT} \\(from up/${VIEWER_PORT}\\)$`, 'm'));
    // A port under renderer/style-ts that the viewer imports is an input too (key `../style-ts/...`).
    assert.match(section, new RegExp(`^ {2}ported file ${STYLE_PORT} `, 'm'));
    assert.ok(section.includes(`--- vw/LICENSE (upstream LICENSE) ---\n\n${PINNED_TEXT}\n`), 'the pinned text, in full');
    assert.ok(!section.includes(KERNEL_PORT), 'a kernel port is not an input of the viewer');
    assert.ok(!section.includes('kw:'), 'a work with no viewer input is not listed');
  } finally {
    rmSync(portedRoot, { recursive: true, force: true });
  }
});

test('a registered viewer port absent from the metafile is not in the viewer notice', () => {
  const portedRoot = portedFixture({ vw: [VIEWER_PORT, STYLE_PORT] });
  try {
    const text = notice(fakeMetafile, undefined, null, { portedRoot });
    assert.ok(!text.includes(PORTED_VIEWER_HEADING));
    assert.ok(!text.includes(VIEWER_PORT));
    assert.ok(!text.includes(PINNED_TEXT));
  } finally {
    rmSync(portedRoot, { recursive: true, force: true });
  }
});

test('every registered port, kernel and shell paths included, reaches the application section after the DuckDB sentinel', () => {
  const portedRoot = portedFixture({ vw: [VIEWER_PORT], kw: [KERNEL_PORT], sw: [SHELL_PORT] });
  try {
    const text = notice(withViewerPort, undefined, portedExtra, { portedRoot });
    const duckdbEnd = text.indexOf(AMALGAMATION_END_SENTINEL);
    const appAt = text.indexOf(PORTED_APPLICATION_HEADING);
    assert.ok(duckdbEnd !== -1 && appAt > duckdbEnd, 'the application section follows the DuckDB sentinel');
    const section = text.slice(appAt);
    for (const path of [VIEWER_PORT, KERNEL_PORT, SHELL_PORT]) {
      assert.match(section, new RegExp(`^ {2}ported file ${path} \\(from up/${path}\\)$`, 'm'), path);
    }
    for (const work of ['kw', 'sw', 'vw']) assert.ok(section.includes(`--- ${work}/LICENSE (upstream LICENSE) ---`), work);
    assert.match(section, /not\nfrom a build manifest/, 'the intro says it is a registry, not a build manifest');
    assert.ok(section.trimEnd().endsWith('END OF THE PORTED SOURCE FILES SECTION'));
    // Without `extra` there is no application section.
    assert.ok(!notice(withViewerPort, undefined, null, { portedRoot }).includes(PORTED_APPLICATION_HEADING));
  } finally {
    rmSync(portedRoot, { recursive: true, force: true });
  }
});

test('an empty registry emits neither ported heading', () => {
  const emptyRoot = portedFixture({});
  try {
    for (const options of [{ portedRoot: emptyRoot }, {}]) {
      for (const extra of [null, portedExtra]) {
        const text = notice(withViewerPort, undefined, extra, options);
        assert.ok(!text.includes('SOURCE FILES PORTED FROM OTHER PROJECTS'), JSON.stringify(options));
        assert.ok(!text.includes('END OF THE PORTED SOURCE FILES SECTION'));
      }
    }
    // And the real registry is empty today, so the default root leaves the output as it was.
    assert.equal(notice(withViewerPort), notice(withViewerPort, undefined, null, { portedRoot: emptyRoot }));
  } finally {
    rmSync(emptyRoot, { recursive: true, force: true });
  }
});

// The range `frontends/shell/src/notices/noticeByteIdentity.test.ts` holds identical between a
// published bundle's notice and the packaged application's: "THE VIEWER" through whatever precedes
// the packaged-frontend section, trailing blank lines trimmed.
function viewerRange(text) {
  const start = text.indexOf('THE VIEWER\n----------');
  const next = text.indexOf('\nTHIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND', start);
  return (next === -1 ? text.slice(start) : text.slice(start, next)).trimEnd();
}

test('the viewer range is identical between notice(m) and notice(m, undefined, extra) with a viewer port present', () => {
  const portedRoot = portedFixture({ vw: [VIEWER_PORT, STYLE_PORT], kw: [KERNEL_PORT] });
  try {
    const viewerOnly = notice(withViewerPort, undefined, null, { portedRoot });
    const packaged = notice(withViewerPort, undefined, portedExtra, { portedRoot });
    assert.ok(viewerRange(viewerOnly).includes(PORTED_VIEWER_HEADING), 'the range carries the subsection');
    assert.equal(viewerRange(packaged), viewerRange(viewerOnly));
  } finally {
    rmSync(portedRoot, { recursive: true, force: true });
  }
});
