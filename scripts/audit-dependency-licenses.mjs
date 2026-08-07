#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **Dependency-license audit, from metadata already on this machine.** ADR-009 pre-public
 * checklist item 4.
 *
 * Writes `DEPENDENCY-LICENSES.md`. Run it with `node scripts/audit-dependency-licenses.mjs`.
 *
 * ## It downloads nothing, and that is a constraint rather than an optimisation
 *
 * `cargo metadata` runs with `--offline`, and the npm side reads `node_modules/​*​/package.json`
 * off the disk. Nothing here contacts crates.io or the npm registry. The session that wrote this
 * was under a binding no-downloads constraint, and the constraint turns out to be the right default
 * anyway: an audit that fetches metadata is an audit of what the registry says **today**, while the
 * build uses what is **on disk**. Reading the disk audits the thing that actually ships.
 *
 * ## It flags. It does not judge.
 *
 * ADR-009's own Caveat reserves the legal reading for counsel, and this file is a script. So every
 * dependency lands in one of four buckets:
 *
 *   - **recognised** — its SPDX expression is on `RECOGNISED_PERMISSIVE` below, a list the *human*
 *     owns. Being on that list is not a compatibility ruling; it is a record that somebody already
 *     looked at that identifier and had no question about it.
 *   - **decided** — the identifier check failed, and a human then accepted **this exact package, at
 *     this version, declaring this expression, in this tree**, on a dated note the report cites
 *     (`PACKAGE_DECISIONS`). Deliberately package-scoped rather than identifier-scoped: widening the
 *     identifier list to clear a specific package would recognise every future package that declared
 *     it, which is the rubber stamp this header warns about.
 *   - **REVIEW** — anything else: copyleft, reciprocal, unrecognised, an expression this script
 *     cannot parse, a missing field, a package not on disk.
 *   - **NOT AUDITABLE** — a tree that could not be read at all, named rather than skipped.
 *
 * There is deliberately **no "incompatible" bucket and no exit-code failure for a copyleft
 * dependency**. A copyleft library in an AGPL core is usually unremarkable; the same library in the
 * Apache-2.0 SDK layer would not be. That distinction is a human's to draw, and a script that drew
 * it would be handing out legal conclusions in a CI log.
 *
 * ## What this does not establish
 *
 * - **Only the reference platform's graph.** `cargo metadata --offline` cannot resolve the full
 *   multi-platform graph from this machine's cache, so it runs with
 *   `--filter-platform x86_64-pc-windows-msvc` — the `CLAUDE.md` reference profile. Dependencies
 *   that appear only on macOS or Linux are **not in this audit**, and the report says so.
 * - **A declared identifier is not a verified one.** This reads the `license` field a package
 *   author wrote. It does not read license *files*, does not diff them against canonical texts, and
 *   cannot detect a package whose declared license is wrong.
 * - **npm coverage follows what is installed.** A workspace whose `node_modules` is absent is
 *   reported as NOT AUDITABLE with its declared direct dependencies listed, never silently omitted.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The reference profile from `CLAUDE.md`. See the header: this is what makes the cargo side
 * resolvable offline, and it is also the limit on what the cargo side covers.
 */
const PLATFORM = 'x86_64-pc-windows-msvc';

/**
 * SPDX identifiers a human has already looked at and had no question about, under an
 * `AGPL-3.0-or-later` core.
 *
 * **Editing this list is a decision, not a fix.** Adding an identifier here to silence a REVIEW
 * line is exactly the move that turns an audit into a rubber stamp. The right response to a new
 * flag is to look at the dependency.
 */
const RECOGNISED_PERMISSIVE = new Set([
  '0BSD',
  'Apache-2.0',
  'Apache-2.0 WITH LLVM-exception',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BlueOak-1.0.0',
  'CC0-1.0',
  'ISC',
  'MIT',
  'MIT-0',
  'Python-2.0',
  'Unicode-3.0',
  'Unicode-DFS-2016',
  'Unlicense',
  'Zlib',
]);

/**
 * **Package-scoped decisions a human has made — deliberately not identifiers.**
 *
 * Every entry here records a decision about *this package, at this version, declaring this exact
 * expression, in this tree*. Adding the identifier to `RECOGNISED_PERMISSIVE` instead would
 * recognise **every future package** that declares it, which is the rubber stamp this file's header
 * warns about — and in one case it would destroy the human's own qualifier: the five MPL-2.0 crates
 * were accepted as *spike-only, transitive via Tauri*. A global `MPL-2.0` entry would silently pass
 * an MPL-2.0 crate that appeared tomorrow in the **workspace** — the shipped `AGPL-3.0-or-later`
 * core — which is a different question nobody has answered.
 *
 * **Never add an entry without its dated decision comment and the note it cites.** An entry with no
 * citation is indistinguishable from someone silencing a line.
 *
 * All four key components are load-bearing:
 *
 *   - **name alone** would recognise every future version, and a version bump is exactly when a
 *     license can change;
 *   - **name + version** would still cover a re-publish that corrected the metadata within a
 *     version, so the decision would no longer be about the text the human read;
 *   - **the declared expression** pins that text;
 *   - **the tree** preserves the spike-only qualifier mechanically rather than in prose.
 *
 * A package that moves, is bumped, or changes its declared expression **re-flags**, and that is the
 * intended behaviour rather than a rough edge: re-reading a one-line diff is cheap, and the event
 * that would be silently passed is precisely the event that can change a license.
 */
const PACKAGE_DECISIONS = [
  // 2026-08-07 — PRE-PUBLIC-CHECKLIST.md, "Human decisions — 2026-08-07" item 1: accepted under the
  // **Apache-2.0 branch** of its OR expression. The BSL-1.0 alternative is not relied on, and this
  // is not a decision about BSL-1.0.
  {
    tree: 'Cargo.toml', name: 'ryu', version: '1.0.23', license: 'Apache-2.0 OR BSL-1.0',
    decided: '2026-08-07',
    why: 'accepted under the Apache-2.0 branch of its OR expression; BSL-1.0 is not relied on',
  },
  // 2026-08-07 — same note, item 1: CDLA-Permissive-2.0 is a permissive **data** license, accepted
  // for the root certificate set `webpki-roots` distributes.
  {
    tree: 'Cargo.toml', name: 'webpki-roots', version: '1.0.9', license: 'CDLA-Permissive-2.0',
    decided: '2026-08-07',
    why: 'CDLA-Permissive-2.0, a permissive data license, over a distributed root certificate set',
  },
  // 2026-08-07 — same note, item 1. The bake-off crate is ADR-012 decision evidence, pinned to the
  // trees its phases were measured on; the same OR-branch reasoning applies to the same version.
  {
    tree: 'protocol/transport-bakeoff/Cargo.toml', name: 'ryu', version: '1.0.23',
    license: 'Apache-2.0 OR BSL-1.0', decided: '2026-08-07',
    why: 'accepted under the Apache-2.0 branch of its OR expression; BSL-1.0 is not relied on',
  },
  // 2026-08-07 — same note, item 1, and the same OR-branch reasoning again in the third tree.
  {
    tree: 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml', name: 'ryu', version: '1.0.23',
    license: 'Apache-2.0 OR BSL-1.0', decided: '2026-08-07',
    why: 'accepted under the Apache-2.0 branch of its OR expression; BSL-1.0 is not relied on',
  },
  // ---- 2026-08-07 — same note, item 1: the five MPL-2.0 crates ----------------------------------
  //
  // Accepted **as spike-only, transitive via Tauri, compatible regardless**. The tree key is what
  // makes "spike-only" mechanical: any of these five appearing in the workspace re-flags, because
  // an MPL-2.0 crate in the shipped AGPL core is a question the human has not been asked.
  {
    tree: 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml', name: 'cssparser',
    version: '0.36.0', license: 'MPL-2.0', decided: '2026-08-07',
    why: 'spike-only, transitive via Tauri, compatible regardless',
  },
  {
    tree: 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml', name: 'cssparser-macros',
    version: '0.6.1', license: 'MPL-2.0', decided: '2026-08-07',
    why: 'spike-only, transitive via Tauri, compatible regardless',
  },
  {
    tree: 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml', name: 'dtoa-short',
    version: '0.3.5', license: 'MPL-2.0', decided: '2026-08-07',
    why: 'spike-only, transitive via Tauri, compatible regardless',
  },
  {
    tree: 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml', name: 'option-ext',
    version: '0.2.0', license: 'MPL-2.0', decided: '2026-08-07',
    why: 'spike-only, transitive via Tauri, compatible regardless',
  },
  {
    tree: 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml', name: 'selectors',
    version: '0.36.1', license: 'MPL-2.0', decided: '2026-08-07',
    why: 'spike-only, transitive via Tauri, compatible regardless',
  },
];

/** The note every entry above cites, named once so the report can print the citation. */
const DECISION_SOURCE = 'PRE-PUBLIC-CHECKLIST.md — "Human decisions — 2026-08-07", item 1';

/** Which decisions were actually matched this run, so a stale one becomes visible (see the report). */
const usedDecisions = new Set();

/**
 * The decision covering this exact package in this exact tree, or `null`.
 *
 * Keyed on the **manifest path / npm directory** rather than the display label: the labels are prose
 * a future edit can reword, while `CARGO_TREES` and `NPM_TREES` are already keyed on paths.
 */
function decisionFor(tree, name, version, license) {
  const i = PACKAGE_DECISIONS.findIndex(
    (d) => d.tree === tree && d.name === name && d.version === version && d.license === license,
  );
  if (i === -1) return null;
  usedDecisions.add(i);
  return PACKAGE_DECISIONS[i];
}

/** The cargo manifests to audit: the workspace, and the two crates it deliberately excludes. */
const CARGO_TREES = [
  ['workspace (kernel, engine, renderer, protocol/data-plane)', 'Cargo.toml'],
  ['protocol/transport-bakeoff (ADR-012 decision evidence)', 'protocol/transport-bakeoff/Cargo.toml'],
  ['spikes/adr-003-crs-rendering (spike app)', 'spikes/adr-003-crs-rendering/app/src-tauri/Cargo.toml'],
];

/** The npm workspaces to audit. */
const NPM_TREES = [
  ['renderer/bundle-viewer (ships inside every published bundle)', 'renderer/bundle-viewer'],
  ['frontends/canvas-probe', 'frontends/canvas-probe'],
  ['protocol/transport-bakeoff/web', 'protocol/transport-bakeoff/web'],
  ['spikes/adr-003-crs-rendering/app', 'spikes/adr-003-crs-rendering/app'],
];

/**
 * Split an SPDX expression into the identifiers it mentions, so `MIT OR Apache-2.0` is recognised
 * when both halves are.
 *
 * **Deliberately not an SPDX expression evaluator.** It does not model `AND` versus `OR`, so it
 * cannot conclude that `MIT OR GPL-3.0` is satisfiable permissively. That is the point: an
 * expression containing anything unrecognised goes to a human, and being conservative here costs a
 * review line while being clever could cost a wrong answer.
 */
function identifiers(expression) {
  return expression
    .replace(/[()]/g, ' ')
    // `/` is crates.io's **pre-SPDX** separator and means the same as `OR` — `MIT/Apache-2.0`,
    // `Unlicense/MIT`, `Apache-2.0 / MIT`. Dozens of long-lived crates still declare it that way.
    //
    // **Splitting on it is parsing, not judging.** Without this the report drowned five genuine
    // questions (MPL-2.0, BSL-1.0, CDLA-Permissive-2.0) under forty entries whose only defect was a
    // separator this function did not know — and a report where the real questions are outnumbered
    // eight to one by noise is one nobody reads to the end.
    .split(/\s*\/\s*|\s+(?:OR|AND)\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** `recognised`, or the reason a human is being asked. */
function classify(license, licenseFile) {
  if (!license) {
    return licenseFile
      ? { verdict: 'REVIEW', why: `no SPDX expression; ships a license file (${licenseFile}) that must be read` }
      : { verdict: 'REVIEW', why: 'no license declared in its own metadata' };
  }
  const parts = identifiers(license);
  const unknown = parts.filter((p) => !RECOGNISED_PERMISSIVE.has(p));
  if (unknown.length === 0) return { verdict: 'recognised', why: '' };
  return { verdict: 'REVIEW', why: `not on the recognised list: ${unknown.join(', ')}` };
}

/**
 * `classify`, then the package-scoped decision list — **in that order, and only in that order.**
 *
 * A decision is consulted *after* identifier recognition fails, never before, so an entry in
 * `PACKAGE_DECISIONS` can only ever move a line out of REVIEW. It cannot make a recognised package
 * look decided, and — the direction that matters — it cannot be used to override a future stricter
 * reading of the identifier list.
 *
 * `decided` is a **third verdict**, distinct from `recognised`, because the two say different
 * things. `recognised`: somebody looked at that *identifier* and had no question about it.
 * `decided`: somebody looked at *this package* and accepted it, on a date, for a reason, in a note
 * this report cites. Collapsing them would lose the citation, which is the only thing that makes an
 * entry auditable.
 */
function verdictFor(tree, name, version, license, licenseFile) {
  const base = classify(license, licenseFile);
  if (base.verdict !== 'REVIEW') return base;
  const d = decisionFor(tree, name, version, license ?? '');
  if (!d) return base;
  return { verdict: 'decided', why: d.why, decided: d.decided, flaggedFor: base.why };
}

function cargoTree(label, manifest) {
  const path = join(ROOT, manifest);
  if (!existsSync(path)) {
    return { label, notAuditable: `${manifest} does not exist` };
  }
  let raw;
  try {
    raw = execFileSync(
      'cargo',
      [
        'metadata',
        '--format-version', '1',
        '--offline',
        '--filter-platform', PLATFORM,
        '--manifest-path', path,
      ],
      { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] },
    );
  } catch (e) {
    // Named, never skipped: a tree that could not be read is a gap in the audit, and an audit that
    // hides its own gaps is worth less than no audit.
    return { label, notAuditable: `cargo metadata --offline failed: ${String(e.message).split('\n')[0]}` };
  }
  const meta = JSON.parse(raw);
  const workspaceMembers = new Set(meta.workspace_members ?? []);
  const rows = meta.packages
    // The project's own crates are not third-party dependencies; their license is ADR-009's answer.
    .filter((p) => !workspaceMembers.has(p.id))
    .map((p) => ({
      name: p.name,
      version: p.version,
      license: p.license ?? '',
      ...verdictFor(manifest, p.name, p.version, p.license, p.license_file),
    }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version));
  return { label, rows };
}

/**
 * Every installed package under a `node_modules`, including scoped ones **and nested trees**.
 *
 * npm hoists what it can, but a version conflict leaves a nested
 * `node_modules/a/node_modules/b` — a real second copy, at a different version, with its own
 * license. This tree already has three (`command-line-usage/node_modules/{array-back,typical}`,
 * `table-layout/node_modules/array-back`). Walking only the top level would have left them out of a
 * report whose own text says nothing installed is silently dropped.
 *
 * Nested copies are reported under a **path-qualified name** so two versions of one package are two
 * rows rather than one row that silently keeps whichever was read last.
 */
function installedPackages(nodeModules, prefix = '') {
  const out = [];
  for (const entry of readdirSync(nodeModules, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    // A leading dot is npm's own bookkeeping (`.bin`, `.package-lock.json`) or a tool's cache
    // (`.vite`, `.vite-temp`). None is a package, and reporting them as packages with unreadable
    // metadata put two entries in the review table that no human could act on.
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    if (entry.name.startsWith('@')) {
      const scope = join(nodeModules, entry.name);
      for (const inner of readdirSync(scope, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (!inner.isDirectory()) continue;
        const dir = join(scope, inner.name);
        out.push([`${prefix}${entry.name}/${inner.name}`, dir]);
        out.push(...nested(dir, `${prefix}${entry.name}/${inner.name}/`));
      }
      continue;
    }

    const dir = join(nodeModules, entry.name);
    out.push([`${prefix}${entry.name}`, dir]);
    out.push(...nested(dir, `${prefix}${entry.name}/`));
  }
  return out;
}

/** Recurse into a package's own `node_modules`, if it has one. */
function nested(packageDir, prefix) {
  const inner = join(packageDir, 'node_modules');
  return existsSync(inner) ? installedPackages(inner, prefix) : [];
}

function npmTree(label, dir) {
  const abs = join(ROOT, dir);
  const nodeModules = join(abs, 'node_modules');
  if (!existsSync(nodeModules)) {
    // `npm ci` would fix this, and `npm ci` is a download. Reported as a gap with what *can* be
    // read — the declared direct dependencies — rather than passed over.
    let declared = [];
    try {
      const pkg = JSON.parse(readFileSync(join(abs, 'package.json'), 'utf8'));
      declared = [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.devDependencies ?? {}),
      ].sort();
    } catch {
      /* the package.json is the next thing reported as missing */
    }
    return {
      label,
      notAuditable:
        `node_modules is not installed, and installing it is a download. Declared direct ` +
        `dependencies, from package.json: ${declared.length ? declared.join(', ') : '(none readable)'}`,
    };
  }

  const rows = [];
  for (const [name, path] of installedPackages(nodeModules)) {
    let pkg = {};
    try {
      pkg = JSON.parse(readFileSync(join(path, 'package.json'), 'utf8'));
    } catch {
      rows.push({ name, version: '', license: '', verdict: 'REVIEW', why: 'package.json is missing or unreadable' });
      continue;
    }
    // npm's historical `{ "type": "MIT" }` object form and the deprecated `licenses` array still
    // appear in the wild; both are normalised rather than reported as "no license declared", which
    // would send a human to look at a field that is in fact present.
    const license =
      typeof pkg.license === 'string'
        ? pkg.license
        : typeof pkg.license?.type === 'string'
          ? pkg.license.type
          : Array.isArray(pkg.licenses)
            ? pkg.licenses.map((l) => l.type ?? l).filter((l) => typeof l === 'string').join(' OR ')
            : '';
    rows.push({
      name,
      version: pkg.version ?? '',
      license,
      ...verdictFor(dir, name, pkg.version ?? '', license, undefined),
    });
  }
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return { label, rows };
}

// ---- report ------------------------------------------------------------------------------------

const cargo = CARGO_TREES.map(([l, m]) => cargoTree(l, m));
const npm = NPM_TREES.map(([l, d]) => npmTree(l, d));
const all = [...cargo, ...npm];

const flagged = all.flatMap((t) => (t.rows ?? []).filter((r) => r.verdict === 'REVIEW').map((r) => ({ tree: t.label, ...r })));
const decided = all.flatMap((t) => (t.rows ?? []).filter((r) => r.verdict === 'decided').map((r) => ({ tree: t.label, ...r })));
const notAuditable = all.filter((t) => t.notAuditable);
const audited = all.reduce((n, t) => n + (t.rows?.length ?? 0), 0);
/** Entries in the decision list that matched nothing this run — staleness, made visible. */
const unusedDecisions = PACKAGE_DECISIONS.filter((_, i) => !usedDecisions.has(i));

const lines = [];
const w = (s = '') => lines.push(s);

w('# Dependency-license audit');
w();
w('**Generated by `scripts/audit-dependency-licenses.mjs`. Do not edit by hand — re-run it.**');
w();
w('ADR-009 pre-public checklist item 4. Read from metadata already on this machine: `cargo metadata');
w('--offline` and the `license` field of each installed `node_modules/*/package.json`. **Nothing here');
w('contacts a registry.**');
w();
w('## How to read this');
w();
w('This report **flags; it does not judge.** A line under "Needs human review" is a question, not a');
w('finding — ADR-009\'s own Caveat reserves the legal reading for counsel. A dependency is listed as');
w('`recognised` only when every SPDX identifier in its expression is on the list in the script, which');
w('records that somebody already looked at that identifier. That is not a compatibility ruling.');
w();
w('There is deliberately no "incompatible" verdict: a copyleft library in the `AGPL-3.0-or-later` core');
w('is usually unremarkable, while the same library in the Apache-2.0 SDK layer would not be, and that');
w('distinction is a human\'s to draw.');
w();
w('A line listed as **`decided`** is a third thing again, and the distinction is the point.');
w('`recognised` means somebody looked at that *SPDX identifier*. `decided` means somebody looked at');
w('*that exact package, at that exact version, declaring that exact expression, in that exact tree*');
w('and accepted it — on a date, for a reason, recorded in a note this report cites. Neither is a');
w('compatibility ruling, and a decision covers nothing but the four things it names: a version bump,');
w('a changed expression, or the same package appearing in a different tree all return it to review.');
w();
w('## What this audit does not cover, stated so it is not assumed');
w();
w(`- **Only the \`${PLATFORM}\` graph.** The full multi-platform dependency graph cannot be resolved`);
w('  offline from this machine\'s cache, so the cargo side is platform-filtered to the `CLAUDE.md`');
w('  reference profile. **Dependencies that appear only on macOS or Linux are not in this report.**');
w('- **Declared identifiers, not verified ones.** This reads what each package author wrote in their');
w('  own metadata. It reads no license *files* and diffs nothing against a canonical text, so it');
w('  cannot detect a package whose declared license is wrong.');
w('- **Only what is installed.** A workspace with no `node_modules` is listed under "Not auditable"');
w('  with its declared direct dependencies, never silently dropped. Nested trees');
w('  (`node_modules/a/node_modules/b`) *are* walked, and a nested copy is reported under a');
w('  path-qualified name, so two versions of one package are two rows.');
w('- **The cargo side counts dev- and build-dependencies.** `cargo metadata` resolves them, so the');
w('  package total overstates what actually ships. That is the conservative direction — a license');
w('  question is raised about a build-time tool that may never be distributed — but it is not the');
w('  shipped surface, and this report does not separate the two.');
w('- **Nothing about the code itself** — vendored sources, copied snippets, or a dependency that');
w('  bundles third-party code under a different license than its own. `engine/` builds DuckDB from');
w('  vendored C++, which this sees as one crate.');
w();
w('## Summary');
w();
w(`| | |`);
w(`|---|---|`);
w(`| Packages audited | ${audited} |`);
w(`| Recognised without question | ${audited - flagged.length - decided.length} |`);
w(`| Decided by a human, with a dated citation | ${decided.length} |`);
w(`| **Needs human review** | **${flagged.length}** |`);
w(`| Trees not auditable | ${notAuditable.length} |`);
w();

if (decided.length) {
  w('## Decided packages');
  w();
  w('Each of these was flagged by the mechanical check and then **accepted by a human**, on the date');
  w('and for the reason shown. They are printed rather than merely omitted: a decision that only');
  w('shows up as the absence of a review line is one nobody can audit.');
  w();
  w('| Tree | Package | Version | Declared | Flagged because | Decided | Reason |');
  w('|---|---|---|---|---|---|---|');
  for (const d of decided) {
    w(
      `| ${d.tree} | \`${d.name}\` | ${d.version} | \`${d.license}\` | ${d.flaggedFor} | ` +
        `${d.decided} | ${d.why} |`,
    );
  }
  w();
  w(`Source for every decision above: **${DECISION_SOURCE}**. Counsel confirms per ADR-009's Caveat`);
  w('before anything commercial; nothing here is a legal conclusion.');
  w();
}

if (unusedDecisions.length) {
  w('## Unused decisions');
  w();
  w('Entries in the script\'s decision list that matched no package this run. A decision whose');
  w('package has moved, been bumped, or left the tree is **stale**, and staleness that nobody can');
  w('see accumulates into a list that quietly recognises things nobody checked.');
  w();
  w('| Tree | Package | Version | Declared | Decided |');
  w('|---|---|---|---|---|');
  for (const d of unusedDecisions) {
    w(`| ${d.tree} | \`${d.name}\` | ${d.version} | \`${d.license}\` | ${d.decided} |`);
  }
  w();
}

if (notAuditable.length) {
  w('## Not auditable');
  w();
  w('Named rather than skipped: an audit that hides its own gaps is worth less than no audit.');
  w();
  for (const t of notAuditable) w(`- **${t.label}** — ${t.notAuditable}`);
  w();
}

w('## Needs human review');
w();
if (flagged.length === 0) {
  // **The sentence has to name the decisions, or it is false.** With a package-scoped decision list
  // in play, "every identifier is on the recognised list" stops being true the moment one entry is
  // used — nine packages here reach zero-review through a *human decision*, not through the
  // identifier list. A summary that hid that would be the audit claiming something it cannot honor.
  if (decided.length) {
    w(`None. Every audited package either declares an SPDX expression whose every identifier is on`);
    w(`the recognised list in the script, **or is one of the ${decided.length} package-scoped`);
    w('decisions listed above** — each accepted by a named human, on a date, with its citation.');
  } else {
    w('None. Every audited package declares an SPDX expression whose every identifier is on the');
    w('recognised list in the script.');
  }
  w();
  w('**This is not a statement that the dependency tree is legally clear**, and it must not be cited');
  w('as one. It says the mechanical check found nothing to ask about, over the coverage stated above.');
} else {
  w('| Tree | Package | Version | Declared | Why it is here |');
  w('|---|---|---|---|---|');
  for (const f of flagged) {
    w(`| ${f.tree} | \`${f.name}\` | ${f.version} | ${f.license ? `\`${f.license}\`` : '*(none)*'} | ${f.why} |`);
  }
}
w();

w('## Full inventory');
w();
for (const t of all) {
  w(`### ${t.label}`);
  w();
  if (t.notAuditable) {
    w(`*Not auditable: ${t.notAuditable}*`);
    w();
    continue;
  }
  if (t.rows.length === 0) {
    w('*No third-party dependencies.*');
    w();
    continue;
  }
  w('| Package | Version | Declared license | |');
  w('|---|---|---|---|');
  for (const r of t.rows) {
    const mark =
      r.verdict === 'REVIEW' ? '**REVIEW**' : r.verdict === 'decided' ? `decided ${r.decided}` : '';
    w(`| \`${r.name}\` | ${r.version} | ${r.license ? `\`${r.license}\`` : '*(none)*'} | ${mark} |`);
  }
  w();
}

writeFileSync(join(ROOT, 'DEPENDENCY-LICENSES.md'), lines.join('\n'), 'utf8');
console.log(
  `DEPENDENCY-LICENSES.md — ${audited} packages audited, ${decided.length} decided by a human, ` +
    `${flagged.length} need human review, ${notAuditable.length} tree(s) not auditable` +
    (unusedDecisions.length ? `, ${unusedDecisions.length} unused decision(s)` : ''),
);
// **Exit 0 even with flags.** A flag is a question for a person, and failing the process would push
// the next reader toward editing the recognised list to make it stop.
