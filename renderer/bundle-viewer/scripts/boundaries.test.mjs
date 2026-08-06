// Two boundaries this module has to hold, checked mechanically rather than remembered.
//
// 1. **Zero external requests.** The brief requires the viewer to work from any generic static file
//    server with the network otherwise blocked. That is a property of the *built* bundle, not of the
//    sources, so the built bundle is what is scanned.
//
// 2. **No probe code was promoted.** `frontends/canvas-probe` is an instrument, not a predecessor
//    implementation. This module derives its behaviour from ADR-010 directly and cites the ADR;
//    the probe is named only in `renderer/README.md`, and only as an instrument. The mechanical form
//    of that rule is that `renderer/` contains no reference to it at all.
//
// Symmetric with the boundary scans `engine/tests/slice.rs` and `protocol/data-plane` already run on
// themselves.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

test('the built bundle contains no absolute URL and no remote import', () => {
  const app = readFileSync('dist/app.js', 'utf8');
  const html = readFileSync('dist/index.html', 'utf8');

  for (const [name, source] of [
    ['app.js', app],
    ['index.html', html],
  ]) {
    // Any absolute http(s) URL is a request waiting to happen — a CDN, a font, a tile, an analytics
    // beacon. There is no allowlist here on purpose: a bundle that needs one is not self-contained.
    const urls = source.match(/https?:\/\/[^\s"'`)]+/g) ?? [];
    assert.deepEqual(urls, [], `${name} carries absolute URLs: ${urls.slice(0, 5).join(', ')}`);
    // Protocol-relative is the same request with the scheme left off.
    assert.equal(/["'`]\/\/[a-z0-9.-]+\//i.test(source), false, `${name} carries a protocol-relative URL`);
  }

  // Every fetch is relative. The three the viewer makes are the manifest, the style and the
  // partitions, all named by the manifest.
  assert.equal(/fetch\(\s*["'`]https?:/i.test(app), false, 'app.js fetches an absolute URL');
  // …and no dynamic import of anything remote.
  assert.equal(/import\(\s*["'`]https?:/i.test(app), false, 'app.js imports from a remote origin');
});

test('the viewer verifies rather than trusting, and it does not branch on SubtleCrypto', () => {
  const app = readFileSync('dist/app.js', 'utf8');
  // `crypto.subtle` is undefined on the plain-HTTP and file:// origins ADR-008 targets. A
  // "use it if present" design would make whether verification happens at all depend on the origin,
  // which is the silent degradation the pure-JS implementation exists to prevent.
  assert.equal(app.includes('crypto.subtle'), false, 'the viewer reaches for SubtleCrypto');
});

/**
 * Strip comments so the scan reads code rather than prose.
 *
 * Without this the check fails on the modules that *document* the rule — which is the classic
 * self-defeating scan: it would push the explanation out of the code to make the test pass.
 */
function code(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

test('no innerHTML anywhere: attribute values and metadata are untrusted input', () => {
  // docs/09 names dataset contents, filenames, attribute values and metadata as untrusted input, and
  // all of them reach this page's DOM. Every one of them is set with `textContent`.
  for (const path of walk('src')) {
    const source = code(readFileSync(path, 'utf8'));
    for (const sink of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'document.write']) {
      assert.equal(source.includes(sink), false, `${path} uses ${sink}`);
    }
  }
});

test('no source in renderer/ refers to the canvas probe', () => {
  // Addendum 6, mechanically. The probe independently exercised ADR-010 rules 1, 3, 5 and 7 on the
  // *streaming* data plane; this module derives the same rules from the ADR. Neither depends on the
  // other, and a reference here would be the first step of promotion.
  const offenders = [];
  for (const path of walk('..')) {
    if (!/\.(ts|mjs|js|rs|json|html|toml|md)$/.test(path)) continue;
    // `renderer/README.md` is the one place the relationship is described, and this test is the
    // place the rule is written down. Everything else must be silent about the probe.
    if (path.endsWith('README.md') || path.endsWith('boundaries.test.mjs')) continue;
    if (readFileSync(path, 'utf8').includes('canvas-probe')) offenders.push(path);
  }
  assert.deepEqual(offenders, [], `renderer/ refers to the probe outside its README`);
});
