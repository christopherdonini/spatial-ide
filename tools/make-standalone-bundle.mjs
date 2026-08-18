#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Repackages a published static bundle (docs/07's publish output — `manifest.json`, `style.json`,
 * `data/*`, `viewer/index.html` + `viewer/app.js`) as ONE self-contained `.html` file: open by
 * double-click, no server, no terminal.
 *
 * ## What this is, and what it deliberately is not
 *
 * This is a delivery repackaging, not a second bundle format. The published bundle directory (served
 * over HTTP or a file share) stays the canonical, verifiable artifact; this script produces a
 * *viewer artifact* that carries the same bytes the viewer already fetches at runtime — inlined
 * instead of requested. It emits no manifest claim of its own and does not touch `bundle_version`
 * semantics. The banner it inserts says exactly that, in the reader's own words, per docs/01's
 * honesty rule.
 *
 * ## What it reads, and what it never touches
 *
 * `renderer/bundle-viewer/src/main.ts` has exactly two `fetch()` call sites: `fetch('manifest.json')`
 * in `load()`, and `fetch(asset.path)` in `fetchAsset()` — called for the style and for every
 * partition the manifest lists. Nothing else in that package fetches anything (checked directly,
 * not assumed). This script mirrors those three kinds of request and embeds exactly what they ask
 * for: `manifest.json` itself, `manifest.style.resource.locators[0].at` (the style file), and every
 * `manifest.data.partitions[].path`. `viewer/NOTICE.txt` is linked from the page but never `fetch()`-
 * ed by the viewer's own code, so it is not embedded — the link simply will not resolve from a
 * single-file artifact, which is a stated limitation, not a silent gap (see this repo's piece report
 * for the day this was built).
 *
 * This script reads `viewer/index.html` and `viewer/app.js` **from the bundle directory it is given**
 * — the artifact a real publish actually produced, not `renderer/bundle-viewer/dist`, which could be
 * a newer build than what shipped. It never writes to `renderer/bundle-viewer/src/`: nothing here
 * edits viewer source, only the generated output file.
 *
 * ## The fetch shim's key design: never a pre-resolved absolute URL
 *
 * The viewer computes `BUNDLE_BASE = new URL('../', window.location.href)` and fetches
 * `new URL(relative, BUNDLE_BASE).href` (see `main.ts`'s own comment on why: it keeps every request
 * relative to *this page's own location*, wherever that turns out to be). This script's embedded map
 * is keyed by the same bundle-relative strings the manifest already uses (`"manifest.json"`,
 * `"style.json"`, `"data/part-00000.arrows"`, …) — not by an absolute URL baked in at build time,
 * because this file's final resting place (which directory, `file://` vs a hosted origin) is not
 * knowable until it is opened. The injected shim recomputes `BUNDLE_BASE` with the *identical*
 * formula, in the *identical* document, before the viewer's own script runs, and builds its lookup
 * table from that — so the two computations are guaranteed to agree, whatever machine or origin the
 * file is opened from. That is what makes "confirm it opens the same served or `file://`" true by
 * construction rather than by testing every hosting arrangement.
 *
 * ## Why `app.js` is inlined as a `data:` URI script `src`, not literal text
 *
 * HTML's script-parsing rule looks for the literal byte sequence `</script` anywhere inside a
 * `<script>` element's raw text — including inside a string literal a bundler emitted, which this
 * script has no practical way to prove absent from a 400+ KB bundled file. A `data:` URI `src`
 * sidesteps the question entirely: there is no raw text content inside the tag to break out of.
 *
 * Zero dependencies — plain Node (`node:fs`, `node:path`) only.
 *
 * Usage: `node tools/make-standalone-bundle.mjs <bundle-dir> <output.html>`
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

function fail(message) {
  console.error(`make-standalone-bundle: ${message}`);
  process.exit(1);
}

const [, , bundleDirArg, outputPathArg] = process.argv;
if (!bundleDirArg || !outputPathArg) {
  fail('usage: node tools/make-standalone-bundle.mjs <bundle-dir> <output.html>');
}
const bundleDir = resolve(bundleDirArg);
const outputPath = resolve(outputPathArg);
if (!existsSync(bundleDir)) fail(`no such bundle directory: ${bundleDir}`);

/**
 * Mirrors `renderer/bundle-viewer/src/manifest.ts`'s own `safeRelativePath`. The manifest is
 * untrusted input in the `docs/09` sense here too, and every path this accepts is handed straight to
 * a filesystem join — the same reason that function exists in the viewer.
 */
function safeRelative(relPath, where) {
  if (
    typeof relPath !== 'string' ||
    relPath.length === 0 ||
    relPath.startsWith('/') ||
    relPath.includes('..') ||
    relPath.includes('\\') ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(relPath)
  ) {
    fail(`${where} = ${JSON.stringify(relPath)} is not a safe bundle-relative path`);
  }
  return relPath;
}

function readBundleFile(relPath) {
  // Keys are always forward-slashed (manifest convention, and what this script writes itself);
  // `join` needs OS-native separators to actually find the file on Windows.
  const onDisk = join(bundleDir, ...relPath.split('/'));
  if (!existsSync(onDisk)) {
    fail(`"${relPath}" does not exist at ${onDisk}`);
  }
  return readFileSync(onDisk);
}

// -------------------------------------------------------------------------------------------------
// 1. What the viewer fetches, discovered from the manifest — not guessed, not hardcoded per bundle.
// -------------------------------------------------------------------------------------------------

const manifestPath = join(bundleDir, 'manifest.json');
if (!existsSync(manifestPath)) fail(`no manifest.json under ${bundleDir}`);
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (e) {
  fail(`manifest.json did not parse: ${e.message}`);
}

const stylePath = safeRelative(
  manifest?.style?.resource?.locators?.[0]?.at,
  'manifest.style.resource.locators[0].at',
);
const partitionPaths = (manifest?.data?.partitions ?? []).map((p, i) =>
  safeRelative(p?.path, `manifest.data.partitions[${i}].path`),
);
if (partitionPaths.length === 0 && manifest?.bounds !== null) {
  // Not fatal on its own — a publish whose filter selected nothing legitimately has zero partitions
  // (see main.ts's own `bounds: null` branch) — but only when `bounds` is also null. Any other shape
  // is a manifest this script does not recognize as internally consistent, and guessing at recovery
  // would be exactly the silent-partial-artifact failure docs/01 forbids.
  fail('manifest.data.partitions is empty but manifest.bounds is not null — refusing to guess');
}

// literal 'manifest.json', because that is the literal string `main.ts`'s `load()` fetches — not a
// manifest-declared path.
const embeddedPaths = ['manifest.json', stylePath, ...partitionPaths];

// -------------------------------------------------------------------------------------------------
// 2. Build the embedded map (relative path -> base64), verifying as we go — the piece's part (a).
// -------------------------------------------------------------------------------------------------

const embedded = {}; // relPath -> base64
const rawBytesByPath = {}; // relPath -> raw byte count, for the report below
let totalRawBytes = 0;
for (const relPath of embeddedPaths) {
  if (relPath in embedded) continue; // no duplicate path in this bundle shape; defensive only
  const bytes = readBundleFile(relPath); // fails loudly if the manifest names a file that is not there
  embedded[relPath] = bytes.toString('base64');
  rawBytesByPath[relPath] = bytes.length;
  totalRawBytes += bytes.length;
}

const TEN_MB = 10 * 1024 * 1024;
if (totalRawBytes > TEN_MB) {
  fail(
    `embedded assets total ${totalRawBytes} bytes, above the 10 MB sanity ceiling for this ` +
      `packaging path — this bundle is not "small" and belongs served, not standalone`,
  );
}

console.log(`make-standalone-bundle: ${embeddedPaths.length} asset(s) verified present, ${totalRawBytes} raw bytes total:`);
for (const relPath of embeddedPaths) {
  console.log(`  - ${relPath} (${rawBytesByPath[relPath]} B)`);
}

// -------------------------------------------------------------------------------------------------
// 3. The viewer's own index.html + app.js, read from THIS bundle.
// -------------------------------------------------------------------------------------------------

const viewerIndexPath = join(bundleDir, 'viewer', 'index.html');
const viewerAppJsPath = join(bundleDir, 'viewer', 'app.js');
if (!existsSync(viewerIndexPath)) fail(`no viewer/index.html under ${bundleDir}`);
if (!existsSync(viewerAppJsPath)) fail(`no viewer/app.js under ${bundleDir}`);

const viewerIndexHtml = readFileSync(viewerIndexPath, 'utf8');
const appJsBase64 = readFileSync(viewerAppJsPath).toString('base64');

const ORIGINAL_SCRIPT_TAG = '<script type="module" src="./app.js"></script>';
if (!viewerIndexHtml.includes(ORIGINAL_SCRIPT_TAG)) {
  fail(
    `viewer/index.html does not contain the expected ${JSON.stringify(ORIGINAL_SCRIPT_TAG)} tag — ` +
      `this script's assumption about the viewer's structure is stale; refusing to guess a fix`,
  );
}
if (!viewerIndexHtml.includes('<body>')) {
  fail('viewer/index.html has no bare "<body>" tag to insert the banner after — refusing to guess');
}

// -------------------------------------------------------------------------------------------------
// 4. The fetch shim + embedded map.
// -------------------------------------------------------------------------------------------------

/**
 * Safe inside a `<script>` element regardless of what a manifest-supplied path or an asset's base64
 * happens to contain: HTML's script-parsing rule looks for the literal bytes `</script` anywhere in
 * the element's raw text, not just inside "real" JS syntax. Base64 alone can never produce it (no
 * `<` in its alphabet); a manifest-supplied *path string* is untrusted input (docs/09) and this
 * replacement always lands inside a JSON string value here, so it is a no-op for anything that was
 * not already going to break the tag.
 */
function escapeForInlineScript(source) {
  return source.replace(/<\/(script)/gi, '<\\/$1');
}

const embeddedMapJson = escapeForInlineScript(JSON.stringify(embedded));

const shimScript = `<script>
// Installed before the viewer's own script (the next tag) runs. Not part of the published bundle's
// viewer — generated by tools/make-standalone-bundle.mjs; see that file's own doc comment for why
// the keys below are bundle-relative paths, never pre-resolved absolute URLs.
(function () {
  var EMBEDDED_B64 = ${embeddedMapJson};
  // The identical formula renderer/bundle-viewer/src/main.ts uses for BUNDLE_BASE, evaluated in
  // this same document before that script runs, so both resolve every relative path to the same
  // absolute URL regardless of where this file is opened from.
  var BASE = new URL('../', window.location.href);
  function mimeFor(relPath) {
    return relPath.slice(-5) === '.json' ? 'application/json' : 'application/octet-stream';
  }
  function bytesFromBase64(b64) {
    var binary = atob(b64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  var byAbsoluteUrl = Object.create(null);
  Object.keys(EMBEDDED_B64).forEach(function (relPath) {
    byAbsoluteUrl[new URL(relPath, BASE).href] = relPath;
  });
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var requested = typeof input === 'string' ? input : (input && input.url) || String(input);
    var absolute;
    try {
      absolute = new URL(requested, window.location.href).href;
    } catch (e) {
      absolute = requested;
    }
    var relPath = byAbsoluteUrl[absolute];
    if (relPath !== undefined) {
      var bytes = bytesFromBase64(EMBEDDED_B64[relPath]);
      return Promise.resolve(
        new Response(bytes, { status: 200, statusText: 'OK', headers: { 'Content-Type': mimeFor(relPath) } }),
      );
    }
    // Unmatched: falls through to the real fetch, which fails loudly on file:// — that means the
    // embedded map missed something, and the loud failure is the point, not a bug to suppress.
    if (!realFetch) throw new Error('standalone shim: no native fetch to fall back to for ' + absolute);
    return realFetch(input, init);
  };
  console.info(
    '[spatial-ide standalone] fetch shim installed: ' + Object.keys(EMBEDDED_B64).length + ' asset(s) embedded',
  );
})();
</script>`;

const appJsScript = `<script src="data:text/javascript;base64,${appJsBase64}"></script>`;

// -------------------------------------------------------------------------------------------------
// 5. The honesty banner (docs/01) — a repackaging notice, never a manifest or bundle claim.
// -------------------------------------------------------------------------------------------------

const generatedDate = new Date().toISOString().slice(0, 10);
const publishedDate = (() => {
  const buildInfoPath = join(bundleDir, 'build-info.json');
  if (!existsSync(buildInfoPath)) return 'an unrecorded-date';
  try {
    const info = JSON.parse(readFileSync(buildInfoPath, 'utf8'));
    if (typeof info.started_at === 'string' && info.started_at.includes('T')) {
      return info.started_at.slice(0, info.started_at.indexOf('T'));
    }
  } catch {
    // build-info.json is explicitly unverified sidecar wall-clock data (its own note, in every
    // manifest) and every reader "must work when it is absent" — this banner is a courtesy, not a
    // claim, so it degrades rather than failing the build.
  }
  return 'an unrecorded-date';
})();

const bannerText =
  `Standalone offline copy — generated ${generatedDate} from the ${publishedDate} published bundle; ` +
  `the served original is the canonical form.`;

const bannerHtml =
  `<div id="standalone-copy-notice" style="background:#1d3a5f;color:#eaf2ff;padding:8px 12px;` +
  `font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;` +
  `border-bottom:2px solid #4a7fc4;">${bannerText}</div>`;

// -------------------------------------------------------------------------------------------------
// 6. Assemble and write.
// -------------------------------------------------------------------------------------------------

let html = viewerIndexHtml;
html = html.replace('<body>', `<body>\n    ${bannerHtml}`);
html = html.replace(ORIGINAL_SCRIPT_TAG, `${shimScript}\n    ${appJsScript}`);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html, 'utf8');

const outputBytes = readFileSync(outputPath).length;
console.log(`make-standalone-bundle: wrote ${outputPath} (${outputBytes} bytes)`);
