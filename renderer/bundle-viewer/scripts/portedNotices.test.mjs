// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Tests of the ported-source notice route's reader and checks (PORTED-CODE-NOTICE-ROUTE-
// PREREGISTRATION.md section 4, T1 to T9, and Amendment 1 (f), T16 and T17). Every fixture tree is
// built by the tests themselves under `os.tmpdir()`: no tracked file carries a port marker.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ALLOWED_UPSTREAM_LICENSE_IDS,
  checkPortedFiles,
  listTrackedFiles,
  portedPrebuildCheck,
  portedSectionFindings,
  readPortedRegistry,
} from '../portedNotices.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const COMMIT = 'a'.repeat(40);
const REPO = 'https://example.org/upstream/project';
const LICENSE_TEXT = 'MIT License\n\nCopyright (c) 2020 The Upstream Authors\n\nPermission is hereby granted.\n';
const COPYRIGHT = 'Copyright (c) 2020 The Upstream Authors';
const NOTE = (root) =>
  `generateNotice: NOTE -- ${root} is not a git checkout (no .git entry); the ported-file registry was checked; unregistered port markers were not searched`;

function tmp() {
  return mkdtempSync(join(tmpdir(), 'ported-notices-'));
}

function put(root, rel, text) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), text, 'utf8');
}

// The header section 2.3 gives a ported file, in `//` comment syntax.
function header(licenseId = 'MIT', path = 'src/p.ts') {
  return [
    `// SPDX-License-Identifier: AGPL-3.0-or-later AND ${licenseId}`,
    '// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors',
    `// ${COPYRIGHT}`,
    `// Ported-From: ${REPO} @ ${COMMIT} upstream/${path}`,
    '',
    'export const x = 1;',
    '',
  ].join('\n');
}

// A registry directory (`<root>/ported`) pinning one text for one work with one registered file.
function writeRegistry(root, { licenseId = 'MIT', adoptedBy = 'round 1, item 1', path = 'src/p.ts' } = {}) {
  const dir = join(root, 'LICENSES', 'third-party', 'ported');
  put(dir, 'w/LICENSE', LICENSE_TEXT);
  const bytes = Buffer.from(LICENSE_TEXT, 'utf8');
  const manifest = {
    schema: 1,
    works: [
      {
        work: 'w',
        upstream_repository: REPO,
        upstream_commit: COMMIT,
        license_id: licenseId,
        license_id_basis: 'self-declared',
        texts: [
          {
            file: 'LICENSE',
            upstream_path: 'LICENSE',
            bytes: bytes.length,
            sha256: createHash('sha256').update(bytes).digest('hex'),
          },
        ],
        retrieved: '2026-10-11',
        adopted_by: adoptedBy,
        files: [{ path, upstream_path: `upstream/${path}`, copyright: [COPYRIGHT] }],
      },
    ],
  };
  put(dir, 'MANIFEST.json', JSON.stringify(manifest, null, 2));
  return dir;
}

const emptyRegistry = { schema: 1, works: [] };

test('an unregistered Ported-From marker fails, naming the path', () => {
  const root = tmp();
  try {
    // The layer SPDX id alone, so that only the Ported-From line marks the file.
    put(
      root,
      'src/a.ts',
      `// SPDX-License-Identifier: AGPL-3.0-or-later\n// Copyright (C) 2026 X\n// Ported-From: ${REPO} @ ${COMMIT} upstream/a.ts\n`,
    );
    put(root, 'src/clean.ts', '// SPDX-License-Identifier: AGPL-3.0-or-later\n// Copyright (C) 2026 X\n');
    const findings = checkPortedFiles({ repoRoot: root, files: ['src/a.ts', 'src/clean.ts'], registry: emptyRegistry });
    assert.equal(findings.length, 1, findings.join('\n'));
    assert.match(findings[0], /^src\/a\.ts: /);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a non-layer SPDX header with no registry entry fails, naming the path', () => {
  const root = tmp();
  try {
    // No Ported-From line at all: the SPDX id alone marks the file.
    put(root, 'src/b.rs', '// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT\n// Copyright (C) 2026 X\n');
    put(root, 'docs/ok.js', '// SPDX-License-Identifier: CC-BY-4.0\n');
    put(root, 'docs/wrong.js', '// SPDX-License-Identifier: AGPL-3.0-or-later\n');
    const findings = checkPortedFiles({
      repoRoot: root,
      files: ['src/b.rs', 'docs/ok.js', 'docs/wrong.js'],
      registry: emptyRegistry,
    });
    assert.deepEqual(findings.map((f) => f.split(':')[0]).sort(), ['docs/wrong.js', 'src/b.rs']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a registered path whose header lacks the port header fails', () => {
  const root = tmp();
  try {
    const dir = writeRegistry(root);
    put(root, 'src/p.ts', '// SPDX-License-Identifier: AGPL-3.0-or-later\n// Copyright (C) 2026 X\n');
    const registry = readPortedRegistry({ root: dir });
    const findings = checkPortedFiles({ repoRoot: root, files: ['src/p.ts'], registry });
    assert.ok(findings.length > 0 && findings.every((f) => f.startsWith('src/p.ts: ')), findings.join('\n'));
    // A registered path that is absent from the tree fails too, in the other direction.
    const absent = checkPortedFiles({ repoRoot: root, files: [], registry });
    assert.match(absent.join('\n'), /src\/p\.ts: registered under w/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a pinned licence text with one changed byte fails, naming the file', () => {
  const root = tmp();
  try {
    const dir = writeRegistry(root);
    readPortedRegistry({ root: dir }); // the unmodified pin reads
    put(dir, 'w/LICENSE', LICENSE_TEXT.replace('MIT License', 'MIT Licensf')); // same length
    assert.throws(() => readPortedRegistry({ root: dir }), /text LICENSE: sha256 .* on disk, MANIFEST\.json pins /);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a licence id outside the allowlist fails', () => {
  const root = tmp();
  try {
    for (const [licenseId, fails] of [['GPL-3.0-only', true], ['mit', true], ['MIT', false]]) {
      const dir = writeRegistry(root, { licenseId });
      put(root, 'src/p.ts', header(licenseId));
      const registry = readPortedRegistry({ root: dir });
      const findings = checkPortedFiles({ repoRoot: root, files: ['src/p.ts'], registry });
      assert.equal(findings.length, fails ? 1 : 0, `${licenseId}: ${findings.join('\n')}`);
      if (fails) assert.match(findings[0], /^w: license_id /);
    }
    assert.deepEqual([...ALLOWED_UPSTREAM_LICENSE_IDS], ['0BSD', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'BSL-1.0', 'ISC', 'MIT', 'Zlib']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a registered port with matching header and texts passes', () => {
  const root = tmp();
  try {
    const dir = writeRegistry(root);
    put(root, 'src/p.ts', header());
    const registry = readPortedRegistry({ root: dir });
    assert.equal(registry.works[0].texts[0].text, LICENSE_TEXT);
    assert.deepEqual(checkPortedFiles({ repoRoot: root, files: ['src/p.ts'], registry }), []);
    assert.deepEqual(checkPortedFiles({ repoRoot: root, files: null, registry }), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a missing or malformed adopted_by fails', () => {
  const root = tmp();
  try {
    const dir = writeRegistry(root);
    put(root, 'src/p.ts', header());
    const registry = readPortedRegistry({ root: dir });
    const check = (adopted_by, files = ['src/p.ts']) => {
      registry.works[0].adopted_by = adopted_by;
      return checkPortedFiles({ repoRoot: root, files, registry });
    };
    for (const bad of [undefined, '', 'verbally', 'round x, item 1', 'state/directives/notes.txt', 'state/directives/untracked.md']) {
      const findings = check(bad);
      assert.equal(findings.length, 1, `${String(bad)}: ${findings.join('\n')}`);
      assert.match(findings[0], /^w: adopted_by /);
    }
    assert.deepEqual(check('round 12, item 3'), []);
    assert.deepEqual(check('state/directives/2026-10-09-x.md', ['src/p.ts', 'state/directives/2026-10-09-x.md']), []);
    // Outside a checkout the form alone is checked: tracked status needs a listing.
    assert.deepEqual(check('state/directives/2026-10-09-x.md', null), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the tracked tree at HEAD yields no finding', () => {
  const files = listTrackedFiles(repoRoot);
  assert.notEqual(files, null, 'the repository root has a .git entry (a directory, or a file in a worktree)');
  assert.ok(files.length > 100);
  const registry = readPortedRegistry({ root: join(repoRoot, 'LICENSES', 'third-party', 'ported') });
  assert.deepEqual(checkPortedFiles({ repoRoot, files, registry }), []);
});

test('portedSectionFindings requires one file line per registered file and the end sentinel', () => {
  const work = (paths) => ({ files: paths.map((path) => ({ path })) });
  const registry = { schema: 1, works: [work(['kernel/src/a.rs']), work(['frontends/shell/src/b.ts'])] };
  const heading = 'SOURCE FILES PORTED FROM OTHER PROJECTS INTO THIS APPLICATION';
  const line = (path) => `  ported file ${path} (from upstream/${path})`;
  const text = (paths, sentinel = true) =>
    ['x', '', heading, '-'.repeat(heading.length), '', ...paths.map(line), sentinel ? 'END OF THE PORTED SOURCE FILES SECTION' : '', ''].join('\n');
  const both = ['kernel/src/a.rs', 'frontends/shell/src/b.ts'];

  assert.deepEqual(portedSectionFindings(text(both), registry), []);
  const dropped = portedSectionFindings(text(['kernel/src/a.rs']), registry);
  assert.equal(dropped.length, 1);
  assert.match(dropped[0], /^frontends\/shell\/src\/b\.ts: registered but has no file line/);
  const extra = portedSectionFindings(text([...both, 'kernel/src/a.rs']), registry);
  assert.equal(extra.length, 1);
  assert.match(extra[0], /^kernel\/src\/a\.rs: /);
  assert.match(portedSectionFindings(text(both, false), registry).join('\n'), /end sentinel .* is absent/);
  assert.match(portedSectionFindings('nothing here', registry).join('\n'), /heading .* is absent/);
  // An empty registry leaves both headings absent.
  assert.deepEqual(portedSectionFindings('nothing here', emptyRegistry), []);
  assert.equal(portedSectionFindings(text([]), emptyRegistry).length, 1);
});

// Amendment 1 (f): F10, a tree with a valid registry (one work, one registered file with the
// section 2.3 header) and one unregistered file carrying a Ported-From line, and no `.git` entry.
function writeF10(root) {
  const dir = writeRegistry(root);
  put(root, 'src/p.ts', header());
  put(root, 'src/unregistered.ts', header('MIT', 'src/unregistered.ts'));
  return dir;
}

test('outside a git checkout the registry side is checked and the not-searched line is the one note', () => {
  const root = tmp();
  try {
    writeF10(root);
    assert.equal(listTrackedFiles(root), null);
    const clean = portedPrebuildCheck({ repoRoot: root });
    assert.deepEqual(clean.findings, []); // the unregistered file is not searched for
    assert.deepEqual(clean.notes, [NOTE(root)]);
    assert.equal(clean.registry.works.length, 1);

    put(root, 'src/p.ts', header('MIT').replace('AGPL-3.0-or-later AND', 'AGPL-3.0-only AND'));
    const broken = portedPrebuildCheck({ repoRoot: root });
    assert.equal(broken.findings.length, 1, broken.findings.join('\n'));
    assert.match(broken.findings[0], /^src\/p\.ts: /);
    assert.deepEqual(broken.notes, [NOTE(root)]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('in a git checkout whose listing fails the prebuild check throws naming the root', () => {
  const root = tmp();
  try {
    writeF10(root);
    put(root, '.git', 'gitdir: missing\n'); // F11: a .git entry exists, so the tree is a checkout
    assert.throws(
      () => portedPrebuildCheck({ repoRoot: root }),
      (err) => err.message.includes(root) && /could not list the tracked files/.test(err.message),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
