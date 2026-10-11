// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The reader and the checks for the ported-source notice route (PORTED-CODE-NOTICE-ROUTE-
// PREREGISTRATION.md, section 2.2 and Amendment 1; ADR-030's note of 2026-10-09, reopen 4). A file
// ported from an outside project into this repository's own source is a third-party work that no
// build manifest reports: this module reads the in-tree registry that names such files, re-hashes
// the upstream licence texts it pins, and checks the tree against the registry in both directions.
//
// It sits beside `notice.mjs` so the renderer gains no dependency on `frontends/` (docs/02's module
// direction, which `notice.mjs` already keeps). Node's standard library only; no network access.
// Paths come from `git ls-files` (forward slashes on every platform) and are compared as POSIX
// strings, so nothing here depends on the operating system (PORTABILITY R1 to R6).
//
// What it cannot do: an unmarked copy, pasted under this project's own header with no `Ported-
// From:` line, is not detectable mechanically. Review and the DCO's clause (b) cover that case.

import { createHash } from 'node:crypto';
import { closeSync, lstatSync, openSync, readFileSync, readSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Amendment 1 (a): exactly these eight ids, compared case-sensitively. A port under any other
// licence is a per-port ruling of the human's and brings its own change.
export const ALLOWED_UPSTREAM_LICENSE_IDS = Object.freeze([
  '0BSD',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BSL-1.0',
  'ISC',
  'MIT',
  'Zlib',
]);

// The layer ids (ADR-009 items 1 and 3): `CC-BY-4.0` under `docs/`, `AGPL-3.0-or-later` elsewhere.
const LAYER_ID = 'AGPL-3.0-or-later';
const DOCS_LAYER_ID = 'CC-BY-4.0';

// The header window and the scanned extensions (section 7). `LICENSES/**` holds licence texts and
// is never scanned.
const HEADER_WINDOW_LINES = 12;
const SCANNED_EXTENSIONS = [
  '.rs', '.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs', '.css', '.html', '.py', '.sh', '.ps1',
];
const COMMENT_PREFIXES = ['<!--', '/*', '//', '#', '*'];
const PORTED_FROM_TOKEN = 'Ported-From:';
const SPDX_TOKEN = 'SPDX-License-Identifier:';
const PROJECT_COPYRIGHT = 'Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors';

// The shapes `notice.mjs` renders, mirrored here on purpose: `portedSectionFindings` is the
// consumer of the producer's text, and the end-to-end test (`frontends/shell/src/notices/
// portedNotices.test.ts`) is what keeps the two copies agreeing. Latent wording, like the producer's
// (Amendment 1 (c)): the human sights it in the first port piece.
const APPLICATION_HEADING = 'SOURCE FILES PORTED FROM OTHER PROJECTS INTO THIS APPLICATION';
const VIEWER_HEADING = 'SOURCE FILES PORTED FROM OTHER PROJECTS COMPILED INTO THIS VIEWER';
const PORTED_END_SENTINEL = 'END OF THE PORTED SOURCE FILES SECTION';
const FILE_LINE = /^ {2}ported file (.+) \(from (.+)\)$/gm;

const WORK_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const TEXT_FILE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const COMMIT = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ADOPTED_DIRECTIVE = /^state\/directives\/[^/]+\.md$/;
const ADOPTED_ROUND = /^round \d+, item \d+$/;

const NOTE_NOT_A_CHECKOUT = (repoRoot) =>
  `generateNotice: NOTE -- ${repoRoot} is not a git checkout (no .git entry); the ported-file ` +
  'registry was checked; unregistered port markers were not searched';

/**
 * Reads the registry at `<root>/MANIFEST.json` and re-hashes every pinned text against its bytes
 * on disk (sha256 and byte count, with the UTF-8 round trip the DuckDB route also applies: what a
 * notice embeds is the decoded text, so the decode must lose nothing). Throws, naming every fault
 * found, on a missing manifest, a schema fault, or any mismatch. Returns the manifest with a `text`
 * added to each `texts[]` entry.
 */
export function readPortedRegistry({ root }) {
  const manifestPath = join(root, 'MANIFEST.json');
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    throw new Error(`portedNotices: cannot read the registry ${manifestPath}: ${err.message}`);
  }
  const faults = [];
  if (manifest?.schema !== 1) faults.push('schema must be 1');
  if (!Array.isArray(manifest?.works)) {
    faults.push('works must be an array');
    throw new Error(`portedNotices: ${manifestPath}: ${faults.join('; ')}`);
  }
  const seenWorks = new Set();
  const seenPaths = new Set();
  for (const [i, w] of manifest.works.entries()) {
    const at = `works[${i}]${typeof w?.work === 'string' ? ` (${w.work})` : ''}`;
    const need = (ok, what) => ok || faults.push(`${at}: ${what}`);
    need(typeof w?.work === 'string' && WORK_ID.test(w.work), 'work must be a directory-safe id');
    need(!seenWorks.has(w?.work), 'work id is listed twice');
    seenWorks.add(w?.work);
    need(typeof w?.upstream_repository === 'string' && w.upstream_repository !== '', 'upstream_repository must be a URL');
    need(COMMIT.test(w?.upstream_commit ?? ''), 'upstream_commit must be 40 lowercase hex characters');
    need(typeof w?.license_id === 'string' && w.license_id !== '', 'license_id must be a string');
    need(['self-declared', 'read-from-body'].includes(w?.license_id_basis), 'license_id_basis must be self-declared or read-from-body');
    need(DATE.test(w?.retrieved ?? ''), 'retrieved must be a YYYY-MM-DD date');
    need(Array.isArray(w?.texts) && w.texts.length > 0, 'texts must be a non-empty array');
    need(Array.isArray(w?.files) && w.files.length > 0, 'files must be a non-empty array');
    for (const t of Array.isArray(w?.texts) ? w.texts : []) {
      const tat = `${at} text ${t?.file}`;
      if (typeof t?.file !== 'string' || !TEXT_FILE.test(t.file) || typeof t?.upstream_path !== 'string' ||
        !Number.isInteger(t?.bytes) || !SHA256.test(t?.sha256 ?? '') || typeof w?.work !== 'string') {
        faults.push(`${tat}: file, upstream_path, bytes and sha256 must be well-formed`);
        continue;
      }
      let bytes;
      try {
        bytes = readFileSync(join(root, w.work, t.file));
      } catch {
        faults.push(`${tat}: the pinned text is missing from ${join(root, w.work)}`);
        continue;
      }
      const actual = createHash('sha256').update(bytes).digest('hex');
      if (actual !== t.sha256) faults.push(`${tat}: sha256 ${actual} on disk, MANIFEST.json pins ${t.sha256}`);
      else if (bytes.length !== t.bytes) faults.push(`${tat}: ${bytes.length} bytes on disk, MANIFEST.json pins ${t.bytes}`);
      else {
        const text = bytes.toString('utf8');
        if (!Buffer.from(text, 'utf8').equals(bytes)) faults.push(`${tat}: the pinned bytes are not valid UTF-8`);
        else t.text = text;
      }
    }
    for (const f of Array.isArray(w?.files) ? w.files : []) {
      const ok = typeof f?.path === 'string' && f.path !== '' && typeof f?.upstream_path === 'string' &&
        Array.isArray(f?.copyright) && f.copyright.every((c) => typeof c === 'string');
      if (!ok) faults.push(`${at}: each file needs path, upstream_path and copyright[]`);
      else if (seenPaths.has(f.path)) faults.push(`${at}: ${f.path} is registered twice`);
      else seenPaths.add(f.path);
    }
  }
  if (faults.length > 0) {
    throw new Error(`portedNotices: ${faults.length} fault(s) in the ported-file registry ${manifestPath}:\n  ${faults.join('\n  ')}`);
  }
  return manifest;
}

// The first `HEADER_WINDOW_LINES` lines of a file, read from its first 16 KiB only.
function readHeaderWindow(path) {
  let fd;
  try {
    fd = openSync(path, 'r');
    const buf = Buffer.alloc(16384);
    const n = readSync(fd, buf, 0, buf.length, 0);
    return buf.subarray(0, n).toString('utf8').split(/\r?\n/, HEADER_WINDOW_LINES);
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') return null;
    throw err;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

// One header line without its comment syntax, or null when it is not a comment line.
function commentBody(line) {
  const t = line.trim();
  const prefix = COMMENT_PREFIXES.find((p) => t.startsWith(p));
  if (prefix === undefined) return null;
  return t.slice(prefix.length).replace(/(\*\/|-->)\s*$/, '').trim();
}

function layerIdFor(path) {
  return path.startsWith('docs/') ? DOCS_LAYER_ID : LAYER_ID;
}

// Is this window a port marker: a `Ported-From:` line, or an SPDX id other than the layer id?
function isMarked(window, path) {
  return window.some((line) => {
    const body = commentBody(line);
    if (body === null) return false;
    if (body.startsWith(PORTED_FROM_TOKEN)) return true;
    return body.startsWith(SPDX_TOKEN) && body.slice(SPDX_TOKEN.length).trim() !== layerIdFor(path);
  });
}

// The header section 2.3 gives a registered file, one entry per line, without comment syntax.
function expectedHeader(work, file) {
  return [
    `${SPDX_TOKEN} ${layerIdFor(file.path)} AND ${work.license_id}`,
    PROJECT_COPYRIGHT,
    ...file.copyright,
    `${PORTED_FROM_TOKEN} ${work.upstream_repository} @ ${work.upstream_commit} ${file.upstream_path}`,
  ];
}

function headerFindings(window, work, file) {
  const bodies = window.map(commentBody).filter((b) => b !== null);
  const expected = expectedHeader(work, file);
  const absent = expected.filter((line) => !bodies.includes(line));
  if (absent.length > 0) return absent.map((line) => `${file.path}: the header window lacks ${JSON.stringify(line)}`);
  const start = bodies.indexOf(expected[0]);
  return expected.every((line, i) => bodies[start + i] === line)
    ? []
    : [`${file.path}: the header lines are not the registered block, in order`];
}

function adoptedByFindings(work, files) {
  const by = work.adopted_by;
  if (typeof by !== 'string' || by === '') return [`${work.work}: adopted_by is missing`];
  if (ADOPTED_ROUND.test(by)) return [];
  if (!ADOPTED_DIRECTIVE.test(by)) return [`${work.work}: adopted_by ${JSON.stringify(by)} is neither a state/directives/*.md path nor "round <n>, item <m>"`];
  return files === null || files.includes(by) ? [] : [`${work.work}: adopted_by ${by} is not a tracked file`];
}

/**
 * Checks the tree against the registry in both directions and returns findings (strings, each
 * naming the path or the work and the missing item). `files` is `git ls-files` output, or `null`
 * outside a git checkout, where (i) cannot run, (ii) checks the disk under `repoRoot` instead, and
 * (iv) checks form only.
 */
export function checkPortedFiles({ repoRoot, files, registry, allowlist = ALLOWED_UPSTREAM_LICENSE_IDS }) {
  const findings = [];
  const allowed = new Set(allowlist);
  const registered = new Map();
  for (const work of registry.works) {
    for (const file of work.files) registered.set(file.path, { work, file });
  }

  // (i) every marked file is registered.
  if (files !== null) {
    for (const path of files) {
      if (path.startsWith('LICENSES/') || !SCANNED_EXTENSIONS.some((e) => path.endsWith(e))) continue;
      const window = readHeaderWindow(join(repoRoot, path));
      if (window !== null && isMarked(window, path) && !registered.has(path)) {
        findings.push(`${path}: carries a port marker (a ${PORTED_FROM_TOKEN} line or an SPDX id other than ${layerIdFor(path)}) but has no registry entry`);
      }
    }
  }

  // (ii) every registered path exists and carries the registered header.
  const listed = files === null ? null : new Set(files);
  for (const [path, { work, file }] of registered) {
    const window = listed !== null && !listed.has(path) ? null : readHeaderWindow(join(repoRoot, path));
    if (window === null) findings.push(`${path}: registered under ${work.work} but ${files === null ? 'absent from the tree' : 'not a tracked file'}`);
    else findings.push(...headerFindings(window, work, file));
  }

  for (const work of registry.works) {
    // (iii) the licence id is on the allowlist.
    if (!allowed.has(work.license_id)) findings.push(`${work.work}: license_id ${JSON.stringify(work.license_id)} is not an allowed upstream licence id`);
    // (iv) adopted_by is well-formed.
    findings.push(...adoptedByFindings(work, files));
  }
  return findings;
}

/**
 * The artifact predicate `checkDistNotice.mjs` calls on the built text: with an empty registry
 * neither heading may appear; otherwise the application section must carry exactly one file line
 * per registered file and its end sentinel.
 */
export function portedSectionFindings(text, registry) {
  const registered = registry.works.flatMap((w) => w.files.map((f) => f.path));
  const headingAt = (heading) => text.search(new RegExp(`^${heading}$`, 'm'));
  const appAt = headingAt(APPLICATION_HEADING);
  if (registered.length === 0) {
    return [APPLICATION_HEADING, VIEWER_HEADING]
      .filter((h) => headingAt(h) !== -1)
      .map((h) => `the registry is empty but the heading ${JSON.stringify(h)} is present`);
  }
  if (appAt === -1) return [`the application section heading ${JSON.stringify(APPLICATION_HEADING)} is absent`];
  const findings = [];
  const endAt = text.indexOf(PORTED_END_SENTINEL, appAt);
  if (endAt === -1) findings.push(`the end sentinel ${JSON.stringify(PORTED_END_SENTINEL)} is absent`);
  const section = text.slice(appAt, endAt === -1 ? undefined : endAt);
  const remaining = [...section.matchAll(FILE_LINE)].map((m) => m[1]);
  for (const path of registered) {
    const at = remaining.indexOf(path);
    if (at === -1) findings.push(`${path}: registered but has no file line in the application section`);
    else remaining.splice(at, 1);
  }
  for (const path of remaining) findings.push(`${path}: a file line in the application section that the registry does not list once`);
  return findings;
}

/**
 * `string[]` of tracked paths, or `null` (running nothing) exactly when `<repoRoot>/.git` does not
 * exist: every checkout has a `.git` entry (a directory, or a file for a worktree or submodule) and
 * no source archive does. Any other lstat error throws, and so does a git that cannot list.
 * `--git-dir=.git --work-tree=.` stops git finding a repository above the root.
 */
export function listTrackedFiles(repoRoot) {
  try {
    lstatSync(join(repoRoot, '.git'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
  const run = spawnSync('git', ['-C', repoRoot, '--git-dir=.git', '--work-tree=.', 'ls-files', '-z'], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    shell: false,
  });
  if (run.error || run.status !== 0) {
    const why = run.error ? run.error.message : (run.stderr ?? '').split('\n')[0];
    throw new Error(`portedNotices: git could not list the tracked files of ${repoRoot}: ${why}`);
  }
  return run.stdout.split('\0').filter((p) => p !== '');
}

/**
 * The prebuild step: the registry, the listing, the checks. Outside a git checkout the listing is
 * `null` and `notes` holds the one named line saying unregistered markers were not searched.
 */
export function portedPrebuildCheck({ repoRoot, root = join(repoRoot, 'LICENSES', 'third-party', 'ported'), allowlist = ALLOWED_UPSTREAM_LICENSE_IDS }) {
  const registry = readPortedRegistry({ root });
  const files = listTrackedFiles(repoRoot);
  const findings = checkPortedFiles({ repoRoot, files, registry, allowlist });
  return { registry, findings, notes: files === null ? [NOTE_NOT_A_CHECKOUT(repoRoot)] : [] };
}
