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
