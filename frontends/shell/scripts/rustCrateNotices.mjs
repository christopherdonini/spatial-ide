#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The Rust half of RELEASE-0.1 item 9 / ADR-030 candidate (a): the crates actually LINKED into the
// packaged shell binary, enumerated from this crate's own `Cargo.lock` -- never from a hand-kept
// list, and never from a new tool. `cargo metadata` and `cargo tree` are cargo itself, already
// required to build this crate; no new dependency is added by calling them (the dependency-tree red
// line named in this piece's own brief).
//
// ## Why the shell's OWN lockfile suffices (verified, not assumed)
//
// `frontends/shell/src-tauri/Cargo.lock` (574 `[[package]]` entries) already resolves the path deps
// `spatial-kernel`/`spatial-engine`/`spatial-data-plane`/`spatial-skp`/`spatial-renderer` AND
// `duckdb`/`libduckdb-sys` -- confirmed directly (`grep -n '^name = "duckdb"'` etc. against this
// exact file) before writing this module. The root workspace `Cargo.lock` (232 entries) is a
// DIFFERENT, smaller resolution (this crate is deliberately excluded from the root workspace --
// `frontends/shell/src-tauri/Cargo.toml`'s own `[workspace]` empty-table comment explains why) and
// is not read here.
//
// ## `source === null` excludes first-party crates -- not a name pattern
//
// `cargo metadata`'s own JSON reports `source: null` for a path or workspace package, never for a
// registry crate -- verified against this exact lockfile's six path-dependency entries
// (`spatial-data-plane`, `spatial-engine`, `spatial-ide-shell` itself, `spatial-kernel`,
// `spatial-renderer`, `spatial-skp`; none carries a `source =` line in Cargo.lock at all). Filtering
// on this field is the same signal cargo itself uses to distinguish "build this from a local path"
// from "fetch this from a registry", so it excludes any FUTURE first-party crate too, not just
// today's five `spatial-*` modules (plus this crate) by name.
//
// ## `cargo tree -e normal` -- the linked set, proc-macro over-inclusion named
//
// `-e normal` excludes build-dependencies (`tauri-build`) and dev-dependencies (this crate's own
// test-only `spatial-engine/fixture` and `tokio/macros` unifications) -- the same edge kind
// `--filter-platform` filters by target. Proc-macro crates (`serde_derive`, `syn`, `quote`,
// `proc-macro2`, …) are still reported as "normal" edges by `cargo tree`, even though they compile
// code the shipped binary never itself executes at runtime -- named here as a stated
// over-inclusion (this piece's own brief: "harmless for a notice") rather than specially filtered
// out, since under-attributing is the failure this whole file exists to prevent and over-attributing
// is not.
//
// ## Determinism, and not depending on a developer's own extra registry cache
//
// `collectLinkedCrates()` intersects `cargo metadata`'s reported package graph (itself derived from
// `Cargo.lock`, `--locked` so it never silently re-resolves) with `cargo tree`'s own linked-edge
// names -- so a crate that merely happens to sit in `%USERPROFILE%\.cargo\registry\src\…` on one
// machine, but is not actually reachable from this manifest's dependency graph, is never read: only
// linked crates are read, unconditionally of what else the registry cache holds.

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_TAURI_DIR = join(HERE, '..', 'src-tauri');
const DEFAULT_MANIFEST_PATH = join(SRC_TAURI_DIR, 'Cargo.toml');
export const TARGET_TRIPLE = 'x86_64-pc-windows-msvc';

function runCargo(args) {
  // No CARGO_TARGET_DIR override here: this module inherits `process.env` as-is, so it honours
  // whatever the invoking shell/CI already set (the repository's own CARGO_TARGET_DIR convention
  // for anything under `frontends/shell/src-tauri`) rather than hardcoding a worktree-specific or
  // main-checkout-specific path into shipped code.
  return execFileSync('cargo', args, {
    cwd: SRC_TAURI_DIR,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 256,
    env: process.env,
  });
}

// Splits a declared Cargo SPDX license expression into candidate atomic ids -- deliberately simple
// (no full SPDX-expression boolean parser): strips stray parentheses and splits on `/`, `,`, or the
// keywords `OR`/`AND`. Exported so `notice.mjs`'s per-crate rendering and this module's own
// canonical-text lookup agree on exactly the same tokenisation.
export function extractSpdxIds(license) {
  if (!license) return [];
  return license
    .split(/\s+(?:OR|AND)\s+|\/|,/)
    .map((s) => s.trim().replace(/^[()]+|[()]+$/g, ''))
    .filter(Boolean);
}

/**
 * The Rust crates actually linked into `frontends/shell/src-tauri`'s own binary, third-party only
 * (first-party `spatial-*` crates and this crate itself excluded), sorted by name then version.
 * Each entry: `{ name, version, license, dir, licenseFiles }` -- `dir` is the crate's own registry
 * source directory (`%USERPROFILE%\.cargo\registry\src\index.crates.io-*\<name>-<version>\`),
 * `licenseFiles` the sorted list of `LICENSE*`/`NOTICE*`/`COPYING*` filenames found directly in it
 * (empty if none ships -- a real, checked fact, not an assumption).
 */
export function collectLinkedCrates({ manifestPath = DEFAULT_MANIFEST_PATH, target = TARGET_TRIPLE } = {}) {
  const metadataRaw = runCargo([
    'metadata',
    '--format-version',
    '1',
    '--manifest-path',
    manifestPath,
    '--filter-platform',
    target,
    '--locked',
  ]);
  const metadata = JSON.parse(metadataRaw);

  const treeRaw = runCargo([
    'tree',
    '-e',
    'normal',
    '--prefix',
    'none',
    '-f',
    '{p}',
    '--target',
    target,
    '--manifest-path',
    manifestPath,
    '--locked',
  ]);

  // `cargo tree`'s own `{p}` format is `name vVERSION`, optionally followed by `(proc-macro)` or
  // `(*)` (a repeat of a node already printed elsewhere in the tree) or a local path in parens for
  // the root package -- all three suffix shapes are dropped by capturing only up to the next
  // whitespace or `(`.
  const linkedIds = new Set();
  for (const rawLine of treeRaw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const m = /^(\S+) v([0-9][^\s(]*)/.exec(line);
    if (!m) continue;
    linkedIds.add(`${m[1]} ${m[2]}`);
  }

  const byId = new Map(metadata.packages.map((p) => [`${p.name} ${p.version}`, p]));
  const crates = [];
  for (const id of linkedIds) {
    const pkg = byId.get(id);
    if (!pkg) {
      // `cargo tree`'s own graph and `cargo metadata`'s own package list are two views of the SAME
      // resolved lockfile (both `--locked`, both `--filter-platform`/`--target` pinned to the same
      // triple) -- a name `cargo tree` reports that `cargo metadata` never resolved would mean the
      // two commands disagreed about what this manifest links, which is exactly the kind of silent
      // gap this file exists to refuse rather than paper over.
      throw new Error(
        `rustCrateNotices: "cargo tree" reported "${id}" as linked, but "cargo metadata" did not ` +
          'resolve a package with that exact name+version. This should not happen for two cargo ' +
          'subcommands reading the same locked manifest -- investigate rather than silently skipping.',
      );
    }
    if (pkg.source == null) continue; // first-party (path/workspace) crate
    const dir = dirname(pkg.manifest_path);
    let licenseFiles = [];
    try {
      // Also matches `UNLICENSE` (release-cut fix batch, MUST-FIX 12 nit): it does not start with
      // "LICENSE"/"LICENCE" so `LICEN[CS]E` alone never matched it, and six linked crates in this
      // exact set declare `Unlicense OR MIT` and ship exactly that file, not a `LICENSE*` one.
      licenseFiles = readdirSync(dir)
        .filter((f) => /^(LICEN[CS]E|NOTICE|COPYING|UNLICENSE)/i.test(f))
        .sort();
    } catch {
      licenseFiles = [];
    }
    // `authors`/`repository`/`license_file` kept rather than discarded (release-cut fix batch,
    // MUST-FIX 2 / MUST-FIX 12 nit): `cargo metadata` reports all three for every package; a gap
    // crate (one with no bundled LICENSE/NOTICE/COPYING file, `notice.mjs`'s `rustCrateSectionLines`)
    // prints them so a reader has this crate's OWN declared attribution to trace, rather than only
    // ever seeing either its real text or nothing.
    crates.push({
      name: pkg.name,
      version: pkg.version,
      license: pkg.license ?? null,
      licenseFile: pkg.license_file ?? null,
      authors: Array.isArray(pkg.authors) ? pkg.authors : [],
      repository: pkg.repository ?? null,
      dir,
      licenseFiles,
    });
  }

  crates.sort((a, b) => (a.name === b.name ? a.version.localeCompare(b.version) : a.name.localeCompare(b.name)));
  return crates;
}

/**
 * `Map<spdxId, {text, source}>` for every SPDX id a linked crate declares but whose own registry
 * source ships no LICENSE/NOTICE/COPYING file. Never invents license text, and -- as of the
 * release-cut fix batch, MUST-FIX 2 -- never BORROWS one either: an earlier version of this
 * function, when this repository's own `LICENSES/<id>.txt` did not exist, fell back to the
 * alphabetically-first OTHER linked crate that declared the id alone and shipped its own license
 * file. That was wrong for any license whose own body embeds a copyright-holder line (MIT and
 * BSD-3-Clause both do): it printed a DIFFERENT crate's real copyright notice under a crate that
 * never wrote it -- `duckdb`/`webview2-com`(`-macros`/`-sys`)/the five `unic-*` crates all
 * borrowed `atoi`'s blank "Copyright (c) 2017 " line, and `alloc-stdlib` borrowed
 * `alloc-no-stdlib`'s Dropbox copyright line, neither of which is that crate's own. This function
 * therefore only ever supplies a canonical text from this repository's OWN vetted copy
 * (`LICENSES/<id>.txt`).
 *
 * ## Fails closed by THROWING, not by placing a placeholder (coordinator follow-up, item 1)
 *
 * The first version of this fix emitted an explicit "no canonical text available" placeholder for an
 * id `LICENSES/` carried no copy of. That is honest, but it still SHIPS: `selectors 0.36.1` declares
 * `MPL-2.0` and bundles no license file, so the generated notice carried a real one-crate
 * attribution gap in a conveyed artifact -- the opposite of what ADR-030 candidate (a) exists to
 * guarantee. This function now throws instead, naming the id and the crates that need it, so the
 * gap surfaces as a failed build (in `generateNotice.mjs`'s own `prebuild` hook, before anything is
 * embedded) rather than as a paragraph a recipient is left to act on. Closing such a failure is one
 * file: fetch the licence's own text into `LICENSES/<id>.txt` and record its URL, retrieval date
 * and `sha256` in `LICENSES/README.md`, as the four texts already there are.
 *
 * Today the linked set needs exactly four ids (`Apache-2.0`, `BSD-3-Clause`, `MIT`, `MPL-2.0`) and
 * `LICENSES/` carries all four, so this throw is unreachable on the current tree -- which is the
 * point: it becomes reachable the moment a dependency change introduces a fifth.
 */
export function buildCanonicalLicenseTexts(crates, { repoRoot }) {
  // `Map<spdxId, cratesThatNeedIt>` rather than a bare Set, so a throw below can name WHICH crates
  // are left unattributed by the missing text -- the actionable half of the message.
  const needed = new Map();
  for (const crate of crates) {
    if (crate.licenseFiles.length > 0) continue;
    for (const id of extractSpdxIds(crate.license)) {
      if (!needed.has(id)) needed.set(id, []);
      needed.get(id).push(`${crate.name} ${crate.version}`);
    }
  }

  const texts = new Map();
  for (const id of [...needed.keys()].sort()) {
    const repoPath = join(repoRoot, 'LICENSES', `${id}.txt`);
    if (!existsSync(repoPath)) {
      // Fails CLOSED (coordinator follow-up, item 1): a build that cannot attribute a linked crate
      // must not produce a notice at all, rather than produce one with the gap written into it.
      throw new Error(
        `rustCrateNotices: no canonical license text for SPDX id "${id}". ` +
          `${needed.get(id).length} linked crate(s) declare it and ship no ` +
          `LICENSE/NOTICE/COPYING file of their own (${needed.get(id).sort().join(', ')}), so the ` +
          'generated notice would carry no license text for them at all. This function does not ' +
          "borrow another crate's bundled text (release-cut fix batch, MUST-FIX 2: for a license " +
          'whose body embeds a copyright-holder line, that attributed one project\'s copyright ' +
          `notice to another), and does not ship a placeholder. Fetch the ${id} license text to ` +
          `${repoPath} and record its URL, retrieval date and sha256 in LICENSES/README.md ` +
          'beside the texts already there.',
      );
    }
    texts.set(id, {
      text: readFileSync(repoPath, 'utf8'),
      source: `LICENSES/${id}.txt (this repository's own copy)`,
    });
  }
  return texts;
}
