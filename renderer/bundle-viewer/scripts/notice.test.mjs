// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Guards the shipped notice text (entry 51 fix batch, SHOULD-FIX 2). `notice()` writes every
// published bundle's `viewer/NOTICE.txt` (`build.mjs`, `kernel/src/bundle/mod.rs`'s `notice_path`);
// this test is what stops the EPSG/IOGP acknowledgement section from silently dropping out of a
// future edit to `notice.mjs` — nothing else in this repository checks the text this function
// produces.

import test from 'node:test';
import assert from 'node:assert/strict';

import { notice } from '../notice.mjs';

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
// asserts more about that file than that file asserts about itself: its own header names an open gap
// outright (`duckdbAmalgamationGapLines()` -- third-party sources inside DuckDB's amalgamated build
// that no build manifest here can see). Both halves are asserted, so neither the wording nor the
// claim can drift back silently.
test('the two-argument header states both of the file\'s two distribution scopes', () => {
  const text = notice(fakeMetafile);
  assert.match(text, /inside a published\nbundle, this is the whole notice set the bundle owes/);
  assert.match(text, /at bundle-viewer\\NOTICE\.txt/);
  assert.match(
    text,
    /The application-wide notice set[\s\S]{0,240}?is the separate NOTICE\.txt installed beside the executable/,
  );
  assert.doesNotMatch(text, /complete notice set/);
});
