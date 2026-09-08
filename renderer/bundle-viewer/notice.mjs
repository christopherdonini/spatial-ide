// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The `notice()` function itself, extracted out of `build.mjs` (entry-51 fix batch, SHOULD-FIX 2)
// so a test can import it without triggering an esbuild run — `build.mjs` executes the build as a
// side effect of being loaded (`await build({...})` at module top level), so it could not itself
// be imported by `scripts/notice.test.mjs` without also running (and needing to succeed at) a full
// bundle build. This module has no side effects on import: it only defines `notice`.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The notice set every published bundle must carry (ADR-009 item 7; ADR-017 Corrigendum 3).
 *
 * ## Derived from the metafile, never from a hand-kept list
 *
 * `bundle: true` compiles third-party code into `dist/app.js` — today `apache-arrow` and
 * `flatbuffers` (Apache-2.0, and Arrow ships a NOTICE whose contents §4(d) requires to travel) and
 * `tslib` (0BSD). A hardcoded list would be correct until the first dependency change and wrong
 * silently afterwards, which for a legal notice is the worst failure shape available. esbuild's
 * metafile records every input it actually read, so this is a function of the build rather than a
 * claim about it.
 *
 * ## Deterministic, because the manifest hashes it
 *
 * The publish operation lists a content hash for every viewer asset, and ADR-017 §12 treats viewer
 * asset bytes as an input to a byte-identical publish; the notice is one of those assets. So this
 * file must not depend on directory order or on the clock. Packages are sorted by name and each
 * package's files by filename. **No timestamp is written.**
 *
 * ## Third-party *data*, not just third-party code (entry 51)
 *
 * A fixed section (unconditional — the viewer build doesn't know which specific bundle it will
 * ship in, or whether that bundle's manifest carries a source CRS definition) acknowledges the
 * EPSG Geodetic Parameter Dataset's ownership by IOGP and names the EPSG Terms of Use URL, per
 * the terms' own acknowledgement and inform-recipients obligations (verbatim quotes in
 * `DEPENDENCY-LICENSES.md`'s "Third-party data terms" section). Placed ahead of the third-party
 * *code* section below because it is a different kind of thing — data compiled into the engine
 * and carried in bundle manifests (`kernel/src/bundle/mod.rs`'s `crs_source_definition`), not
 * code compiled into this viewer. Guarded by `scripts/notice.test.mjs` (entry-51 fix batch,
 * SHOULD-FIX 2) so this section cannot silently drop out of a future edit.
 *
 * ## `baseDir`, and the bug its absence caused (release-cut fix batch, MUST-FIX 1)
 *
 * `metafile.inputs`' own keys are relative to esbuild's `absWorkingDir` — this package's own
 * `build.mjs` sets that to `process.cwd()`, and runs with cwd `renderer/bundle-viewer`, so every
 * key this function reads (`node_modules/apache-arrow/…`, etc.) is relative to THIS PACKAGE, not
 * to whatever process happens to import `notice()` and call it. `frontends/shell/scripts/
 * generateNotice.mjs` runs with cwd `frontends/shell` — before this fix, joining those same
 * relative package paths against the *caller's* cwd silently read `frontends/shell`'s own
 * `node_modules` instead (a real, different tree: shell depends on `apache-arrow@^21.2.0`, the
 * viewer on `^18.1.0`), so the packaged app's `NOTICE.txt` attributed the wrong package versions
 * and, for any package present in one tree but not the other, dropped its retained NOTICE/LICENSE
 * text outright rather than reading it at all. `baseDir` defaults to this file's own directory —
 * the same "resolved from this file's own location, not the cwd" fix already applies to the AGPL
 * text below — so every caller, regardless of its own cwd, resolves package paths against the
 * tree esbuild actually read them from.
 *
 * ## `extra`, the two further sets a packaged artifact also carries (RELEASE-0.1 item 9; ADR-030
 * candidate (a))
 *
 * `notice(metafile, baseDir)` — the two-argument form `build.mjs` calls — is byte-for-byte
 * UNCHANGED by this parameter's addition: every published bundle's own `dist/NOTICE.txt` keeps its
 * viewer-only scope, because `extra` defaults to `null` and nothing below the guard on it runs.
 * The packaged shell's own generator (`frontends/shell/scripts/generateNotice.mjs`) is the only
 * caller that passes a third argument, shaped:
 *
 * ```
 * {
 *   npmSets: [{ heading, metafile, baseDir }, …],   // one more esbuild/Rollup-shaped metafile
 *                                                     // per additional npm package set, each
 *                                                     // resolved from ITS OWN baseDir — the same
 *                                                     // discipline the viewer's own set already
 *                                                     // uses, generalised rather than re-argued.
 *   rustCrates: { heading, crates, canonicalTexts, targetTriple },
 *                                                      // `crates`: collectLinkedCrates()'s own
 *                                                      // return shape; `canonicalTexts`: a
 *                                                      // Map<spdxId, {text, source}> for crates
 *                                                      // whose own registry source ships no
 *                                                      // license file (buildCanonicalLicenseTexts());
 *                                                      // `targetTriple`: the triple that set was
 *                                                      // resolved FOR, named in the rendered
 *                                                      // section's own intro (release-cut fix
 *                                                      // batch, SHOULD-FIX 9) rather than left
 *                                                      // implicit -- the linked set is a fact
 *                                                      // about one target, not about all of them.
 * }
 * ```
 *
 * Passing `extra` also swaps the header's scope paragraph for one that states what the file
 * enumerates rather than naming a gap — see `extraHeaderLines` below.
 */
export function notice(metafile, baseDir = dirname(fileURLToPath(import.meta.url)), extra = null) {
  const packages = extractPackages(metafile);

  // **A notice with no third-party section is a legally incomplete notice, and it must not build
  // quietly.** The viewer bundles `apache-arrow`, `flatbuffers` and `tslib` today; if the metafile
  // shape or the path separators ever change, the extraction above would yield nothing and every
  // published bundle would ship a notice missing every attribution it owes. Failing the build is
  // the only reading of that which is not silent.
  if (packages.size === 0) {
    throw new Error(
      'notice generation found no third-party packages in esbuild\'s metafile. The viewer bundles ' +
        'apache-arrow, flatbuffers and tslib, so this is a bug in the extraction above rather than ' +
        'a viewer with no dependencies — and shipping a notice without them would be shipping an ' +
        'incomplete one (ADR-009 item 7; ADR-017 Corrigendum 3).',
    );
  }

  const out = [
    ...(extra?.bootstrap ? bootstrapHeaderLines() : extra ? extraHeaderLines() : viewerOnlyHeaderLines()),
  ];

  out.push(
    'THE VIEWER',
    '----------',
    '',
    'Spatial IDE bundle viewer',
    'Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors',
    '',
    'This program is free software: you can redistribute it and/or modify it under the terms of',
    'the GNU Affero General Public License as published by the Free Software Foundation, either',
    'version 3 of the License, or (at your option) any later version.',
    '',
    'This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;',
    'without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.',
    'See the GNU Affero General Public License for more details.',
    '',
    'SPDX-License-Identifier: AGPL-3.0-or-later',
    '',
  );

  // The AGPL text itself, when it is present at the path below. AGPL-3.0 section 4 requires a copy
  // of the License to travel with the Program, and that copy is not something this script can
  // invent — see LICENSES/README.md for why it may be absent and the one command that fixes it.
  // Emitting a marked absence is the honest form; emitting nothing would hide an unmet obligation.
  // Resolved from THIS FILE's own directory (`dirname(fileURLToPath(import.meta.url))`), walking
  // up two levels to this repository's `LICENSES/` directory -- never from the repository as an
  // assumed base and never from the caller's cwd, same discipline as `baseDir` above. The notice
  // is content-hashed into every manifest, so a cwd-relative read would make a hashed artifact
  // depend on where the build was invoked from — which is exactly the class of thing ADR-017 §12's
  // determinism guarantee is about.
  const agpl = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'LICENSES', 'AGPL-3.0-or-later.txt');
  if (existsSync(agpl)) {
    out.push('', 'GNU AFFERO GENERAL PUBLIC LICENSE, VERSION 3', '', readFileSync(agpl, 'utf8'), '');
  } else {
    out.push(
      '',
      '*** INCOMPLETE: the verbatim AGPL-3.0 text is not in this bundle. ***',
      '',
      'AGPL-3.0 section 4 requires a copy of the License to accompany the Program. The text was',
      'absent from the repository when this bundle was built (LICENSES/AGPL-3.0-or-later.txt did',
      'not exist), so it could not be embedded. Obtain it from https://www.gnu.org/licenses/agpl-3.0.txt',
      'and rebuild. Until then this notice set is incomplete and this bundle must not be distributed.',
      '',
    );
  }

  out.push(
    '',
    'COORDINATE REFERENCE SYSTEM DATA',
    '---------------------------------',
    '',
    'This bundle may carry a coordinate reference system definition derived from the EPSG',
    'Geodetic Parameter Dataset, © IOGP (International Association of Oil & Gas Producers),',
    'used under the EPSG Terms of Use: https://epsg.org/terms-of-use.html',
    '',
    'This notice informs you, the recipient, of those Terms of Use, as their own text requires',
    '("You are obliged to inform anyone to whom you provide the EPSG Facilities of these Terms',
    'of Use").',
    '',
  );

  // The installer's own AGPL notice + corresponding-source route (RELEASE-0.1 Amendment 3, item
  // 2; ADR-009 item 1 -- core code, not item 7's bundle-scoped viewer clause). Unconditional,
  // worded as a conditional statement ("if this file was installed…"), because `notice()` has
  // exactly one shape shared by every caller: it becomes both the viewer's own `dist/NOTICE.txt`
  // (carried inside every published bundle, where no installer is present) and the packaged
  // shell's own beside-the-executable `NOTICE.txt` (`tauri.conf.json`'s `bundle.resources`) -- one
  // source, never a second copy that could drift, so the sentence must read true in both places
  // rather than only in one of them.
  //
  // **§6, not §4/§5 (release-cut fix batch, MUST-FIX 12, architect correction).** This installed
  // program is conveyed as object code (a compiled executable), never as source -- AGPL-3.0 §4
  // governs verbatim SOURCE copying and §5 governs conveying MODIFIED source, neither of which
  // describes shipping a built binary. The Corresponding Source obligation for conveying non-
  // source forms is §6, and this route is specifically §6(d): "Convey the object code by offering
  // access from a designated place... and offer equivalent access to the Corresponding Source in
  // the same way through the same place at no further charge." The "sections 4 and 5" wording
  // below originated in RELEASE-0.1 Amendment 1 and was carried into this file uncorrected; this
  // comment is the correction, recorded rather than silently fixed.
  out.push(
    '',
    'THE SPATIAL IDE APPLICATION, WHEN DISTRIBUTED AS AN INSTALLED PROGRAM',
    '----------------------------------------------------------------------',
    '',
    'If this file was installed as part of the Spatial IDE desktop application — the packaged',
    'shell, together with the kernel, data engine, renderer and protocol implementation it',
    'embeds — that program is free software: you can redistribute it and/or modify it under the',
    'terms of the GNU Affero General Public License as published by the Free Software Foundation,',
    'either version 3 of the License, or (at your option) any later version, the same terms as',
    'the viewer above.',
    '',
    'This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;',
    'without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.',
    'See the GNU Affero General Public License for more details.',
    '',
    'Its Corresponding Source, as AGPL-3.0 §6 (conveying non-source forms) requires, is available',
    'under route §6(d) (access from a network server) at:',
    '',
    '  https://github.com/christopherdonini/spatial-ide',
    '',
    'SPDX-License-Identifier: AGPL-3.0-or-later',
    '',
  );

  out.push(
    ...packageSectionLines(
      'THIRD-PARTY WORKS COMPILED INTO THIS VIEWER',
      '------------------------------------------',
      packages,
      baseDir,
    ),
  );

  if (extra) {
    for (const set of extra.npmSets ?? []) {
      const setPackages = extractPackages(set.metafile);
      if (setPackages.size === 0) {
        throw new Error(
          `notice generation found no third-party packages in the "${set.heading}" package set's ` +
            'own metafile -- this is a bug in that set\'s extraction (or an empty/stale metafile), ' +
            'not evidence that set genuinely carries no third-party code (ADR-030 candidate (a): no ' +
            'artifact ships with a silently named gap).',
        );
      }
      out.push(
        ...packageSectionLines(
          set.heading,
          set.underline ?? '-'.repeat(set.heading.length),
          setPackages,
          set.baseDir,
        ),
      );
    }
    if (extra.rustCrates) {
      out.push(
        ...rustCrateSectionLines(
          extra.rustCrates.heading,
          extra.rustCrates.underline ?? '-'.repeat(extra.rustCrates.heading.length),
          extra.rustCrates.crates,
          extra.rustCrates.canonicalTexts ?? new Map(),
          extra.rustCrates.targetTriple ?? null,
        ),
      );
    }
    // The FOURTH set (DECISIONS-PENDING entry 62 = (a), 2026-09-08). Rendered from the pinned
    // manifest `frontends/shell/scripts/duckdbAmalgamationNotices.mjs` has already read and
    // hash-verified -- this function receives texts, never paths, so `renderer/bundle-viewer` gains
    // no dependency on `frontends/shell` and no filesystem knowledge of where the pin lives.
    // Replaces `duckdbAmalgamationGapLines()`, which named these 26 works and stated that their
    // licence texts were NOT carried.
    if (extra.duckdbAmalgamation) {
      out.push(...duckdbAmalgamationSectionLines(extra.duckdbAmalgamation));
    }
  }

  return out.join('\n');
}

// `metafile.inputs` -> `Map<packageName, relativeDirectory>`. Shared by the viewer's own metafile
// and by every additional npm package set in `extra.npmSets` (each an esbuild-metafile-shaped
// object, whether it actually came from esbuild or -- for `frontends/shell`'s own Vite/Rollup
// build -- from a small inline plugin that writes the same `{ inputs: {...} }` shape so this one
// extraction function serves both, per its own base directory).
function extractPackages(metafile) {
  // `name -> directory`. **The directory comes from the input path, not from `node_modules/<name>`.**
  // A nested tree (`node_modules/a/node_modules/b`) resolves to the *nested* `b`, which is the copy
  // actually compiled in. Reading the top-level `b` instead would put a different version's notice
  // in the file — or throw `ENOENT` when no top-level `b` exists — and both fail silently in the
  // sense that matters: the bundle still builds, carrying the wrong notice. Nested trees already
  // exist here (`command-line-usage/node_modules/array-back`), so this is not hypothetical.
  const packages = new Map();
  for (const input of Object.keys(metafile.inputs)) {
    // `node_modules/name/…` or `node_modules/@scope/name/…`, taking the last occurrence so a
    // nested `node_modules` attributes to the package that actually supplied the file.
    const at = input.lastIndexOf('node_modules/');
    if (at === -1) continue;
    const prefix = input.slice(0, at + 'node_modules/'.length);
    const rest = input.slice(at + 'node_modules/'.length).split('/');
    const name = rest[0].startsWith('@') ? `${rest[0]}/${rest[1]}` : rest[0];
    // Metafile keys are always forward-slashed here, including on Windows (esbuild's own
    // convention; the Vite/Rollup plugin that produces the shell's own set matches it deliberately
    // so this one function reads either without caring which build tool produced its input).
    packages.set(name, prefix + name);
  }
  return packages;
}

// The header block a published bundle's own `dist/NOTICE.txt` carries -- BYTE-IDENTICAL to what
// this function returned before `extra` existed (release-cut fix batch MUST-FIX 3's own text,
// scope-corrected by RELEASE-0.1 Amendment 6's authorized sweep). Every published bundle carries
// nothing but this viewer, so this paragraph's claim about that artifact was and remains true;
// nothing about adding `extra` for a DIFFERENT artifact (the packaged shell) changes what this one
// says about ITSELF.
//
// **"application-wide", not "complete" (closing commit, architect advisory A2).** This paragraph
// pointed at the beside-the-executable NOTICE.txt as "the application's complete notice set", which
// that artifact's own header did not claim -- at the time it named one open gap outright, the
// third-party sources inside DuckDB's amalgamated build that no build manifest here can see. That
// gap is closed now (entry 62; `duckdbAmalgamationSectionLines()` below carries those texts in
// full), but the wording stays "application-wide" rather than becoming "complete": a pointer must
// not assert more about the thing it points at than that thing asserts about itself, and the wider
// file states its four sources rather than claiming exhaustiveness. Saying what the SCOPE is remains
// the accurate form.
function viewerOnlyHeaderLines() {
  return [
    'NOTICES',
    '=======',
    '',
    'This file is the notice set for the viewer program compiled by renderer/bundle-viewer/build.mjs',
    'from esbuild\'s metafile: the viewer\'s own copyright and license notice, followed by the',
    'retained notices of every third-party work compiled into it. It lists what was actually',
    'bundled rather than what someone remembered to write down.',
    '',
    'This SAME file is distributed in two different places, and its scope differs between them',
    '(release-cut fix batch, MUST-FIX 3; scope corrected, RELEASE-0.1 Amendment 6\'s authorized',
    'sweep; this paragraph rewritten, release-cut fix batch, MUST-FIX 1): inside a published',
    'bundle, this is the whole notice set the bundle owes (the bundle carries nothing but this',
    'viewer). Installed inside the packaged application, at bundle-viewer\\NOTICE.txt',
    '(tauri.conf.json\'s own resource glob), this file is the VIEWER\'s OWN notice -- the',
    'third-party works compiled into the bundle viewer specifically, not the whole application\'s',
    'notice set. The application-wide notice set -- covering this viewer, the packaged',
    'frontend\'s own npm dependencies, and the Rust crates statically linked into the application --',
    'is the separate NOTICE.txt installed beside the executable, generated by',
    'frontends/shell/scripts/generateNotice.mjs, whose own header names that wider scope',
    'explicitly.',
    '',
    '',
  ];
}

// The header block the packaged shell's own installed `NOTICE.txt` carries once `extra` is passed
// (RELEASE-0.1 item 9; ADR-030 candidate (a)). Replaces the two "OWED, not yet done" sentences the
// bundle-only header above used to carry (removed from it too, release-cut fix batch MUST-FIX 1)
// with a scope sentence naming what THIS artifact's copy actually enumerates -- itself generated,
// per section, from that section's own build manifest, never hand-copied.
//
// **Widened to FOUR sets** (DECISIONS-PENDING entry 62 = (a), 2026-09-08). The narrowing this
// paragraph carried until now -- "one further, narrower gap ... is named, not silently folded into
// that claim" -- described a real gap that this piece closes: the third-party works inside DuckDB's
// amalgamated build now have their own section, with their full licence texts, enumerated from
// DuckDB's upstream source tree at the pinned version. The scope sentence below therefore names four
// sources, and says plainly that the fourth is not a build manifest -- because it is not, and the
// difference is exactly what the human's entry-62 ruling turned on.
function extraHeaderLines() {
  return [
    'NOTICES',
    '=======',
    '',
    'This file is the notice set for the packaged Spatial IDE desktop application: the shell',
    'executable together with the kernel, data engine, renderer and protocol implementation it',
    'embeds. It is generated, never hand-copied, from four sources: three build manifests -- the',
    'bundle viewer\'s own esbuild metafile (renderer/bundle-viewer/build.mjs), the packaged',
    'frontend\'s own Vite/Rollup build output (frontends/shell/vite.config.ts), and',
    'frontends/shell/src-tauri/Cargo.lock read via `cargo metadata`/`cargo tree` -- and, for the',
    'third-party works embedded inside DuckDB\'s own amalgamated C/C++ source tree, which no build',
    'manifest here reports, that tree\'s own upstream directory listing at the version this',
    'repository pins, hash-pinned in-tree under LICENSES/third-party/ (RELEASE-0.1\'s item 9, both',
    'notice generators, and DECISIONS-PENDING entry 62, the amalgamation set, both before the v0.1.0',
    'tag; ADR-030, docs/adr/ADR-030-conveyed-artifact-notice-set.md). It lists what was actually',
    'compiled into and shipped beside this executable, rather than what someone remembered to write',
    'down.',
    '',
    'This SAME text -- specifically the portion below from the "THE VIEWER" heading through the end',
    'of the "THIRD-PARTY WORKS COMPILED INTO THIS VIEWER" section -- is ALSO, byte for byte, the',
    'whole notice set a published bundle owes on its own (renderer/bundle-viewer/dist/NOTICE.txt;',
    'a published bundle carries nothing but this viewer, so its own copy of this file stops there).',
    'This installed copy scopes wider, because the installed application carries more than the',
    'viewer alone: it enumerates every npm package compiled into the bundle VIEWER, every npm',
    'package compiled into the packaged frontend\'s OWN build (frontends/shell/dist, conveyed via',
    'tauri.conf.json\'s `frontendDist`), every Rust crate statically linked into the',
    'kernel/data-engine/renderer/protocol binary this application also embeds, and every third-party',
    'work embedded inside DuckDB\'s own amalgamated C/C++ source tree, which the data engine compiles',
    'in and which none of those three build manifests can see -- each in its own section below. That',
    'fourth section states its own, different source where it begins; it is the one set here that no',
    'build manifest reports.',
    '',
    '',
  ];
}

// The header block a BOOTSTRAP pass of `frontends/shell/scripts/generateNotice.mjs` carries, used
// only when `frontends/shell/dist-metafile.json` does not exist yet (a fresh clone, before this
// package's own `vite build` has ever run once) -- see that script's own doc comment for why this
// pass must still succeed rather than deadlock the build. Named as provisional rather than silently
// claiming the full scope the artifact does not yet carry; superseded within the SAME `npm run
// build` invocation once `vite build`'s own metafile plugin has written that file.
//
// The "by the SECOND generateNotice.mjs pass THAT `npm run build`'s own script body runs" sentence
// below was missing its relative pronoun ("pass `npm run build`'s own script body runs"), which
// read as a run-on -- restored, release-cut fix batch, MUST-FIX 12 nit.
function bootstrapHeaderLines() {
  return [
    'NOTICES',
    '=======',
    '',
    '*** BOOTSTRAP PASS -- PROVISIONAL, SUPERSEDED WITHIN THE SAME BUILD ***',
    '',
    'frontends/shell/dist-metafile.json (the packaged frontend\'s own Vite/Rollup build manifest)',
    'does not exist yet, so this pass of frontends/shell/scripts/generateNotice.mjs could not read',
    'it -- this happens once, on a fresh clone, before this package\'s own `vite build` has ever run.',
    'This file therefore enumerates only the bundle viewer\'s own third-party works, the Rust crates',
    'statically linked into the application, and the third-party works inside DuckDB\'s amalgamated',
    'source tree below; the packaged frontend\'s OWN npm',
    'dependencies (react, react-dom, @deck.gl/core, @deck.gl/layers, apache-arrow, …) are added, and',
    'this whole header replaced with the full scope statement, by the SECOND generateNotice.mjs pass',
    'THAT `npm run build`\'s own script body runs immediately after its first `vite build` -- see',
    'that script (frontends/shell/package.json\'s "build") for the two-pass sequence this bootstraps.',
    '',
    '',
  ];
}

// Renders one third-party npm PACKAGE set (the viewer's own, or any `extra.npmSets` entry) in the
// established visual shape: a heading, then per package sorted by name, its declared license and
// every retained LICENSE/NOTICE/COPYING file's verbatim text.
function packageSectionLines(heading, underline, packages, baseDir) {
  const out = ['', heading, underline, ''];

  for (const pkg of [...packages.keys()].sort()) {
    // Resolved against `baseDir` (this file's own directory by default), never against the
    // CALLER's cwd -- `packages.get(pkg)` is a metafile-relative path (esbuild's own
    // `absWorkingDir`), and a caller running from a different directory (`frontends/shell/scripts/
    // generateNotice.mjs`, cwd `frontends/shell`) must still land on the SAME package tree esbuild
    // actually read from, `renderer/bundle-viewer/node_modules` (MUST-FIX 1, this fix batch).
    const dir = join(baseDir, packages.get(pkg));
    let meta = {};
    try {
      meta = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    } catch {
      // A package whose manifest cannot be read is named with what is known rather than skipped:
      // a silently omitted dependency is the failure this whole file exists to prevent.
    }
    // npm's legacy `{"type": "MIT", "url": …}` object form still appears in the wild, and
    // interpolating it would print `[object Object]` where a license name belongs — text no author
    // wrote, in the one field whose whole job is to carry what they did. Same normalisation the
    // audit script applies.
    const license =
      typeof meta.license === 'string'
        ? meta.license
        : typeof meta.license?.type === 'string'
          ? meta.license.type
          : '(license not declared in package.json)';
    out.push('', `${pkg} ${meta.version ?? '(version unknown)'} — ${license}`, '');

    // A missing directory is reported in the notice rather than crashing the build or being
    // dropped: the reader needs to know an attribution could not be read.
    let files = [];
    try {
      files = readdirSync(dir)
        .filter((f) => /^(LICEN[CS]E|NOTICE|COPYING)/i.test(f))
        .sort();
    } catch {
      out.push(`  (${dir} could not be read; the declared license above is all that is known)`, '');
      continue;
    }
    if (files.length === 0) {
      out.push(`  (no LICENSE or NOTICE file ships in ${pkg}; its declared license is above)`, '');
      continue;
    }
    for (const f of files) {
      out.push(`--- ${pkg}/${f} ---`, '', readFileSync(join(dir, f), 'utf8'), '');
    }
  }

  return out;
}

// Splits a declared Cargo SPDX license expression into candidate atomic ids -- deliberately simple
// (no full SPDX-expression boolean parser): strips stray parentheses and splits on `/`, `,`, or the
// keywords `OR`/`AND`. Good enough to find which canonical texts a gap crate's declaration needs;
// an id this misses just gets no canonical text offered, named honestly rather than guessed at.
//
// **A DELIBERATE second copy of `frontends/shell/scripts/rustCrateNotices.mjs`'s own exported
// `extractSpdxIds`, kept identical on purpose** (closing commit, reviewer R3). The obvious
// de-duplication -- importing the exported one -- would make `renderer/bundle-viewer` (a module every
// published bundle carries, which builds on its own) depend on `frontends/shell`, inverting the
// direction docs/02's module map states: `frontends` is "Clients only — no logic" there, a client of
// the renderer rather than something the renderer reaches into. The two copies
// have to tokenise identically, because THIS one decides which ids are ANNOUNCED under a crate ("the
// canonical text for X is in the section below") while the OTHER decides which texts are actually
// COLLECTED -- a divergence would either announce a text that is not there or embed one nothing
// points at. `frontends/shell/src/notices/spdxTokenisation.test.ts` imports both and asserts equal
// output over the expression shapes the linked set actually declares; that test is what keeps them
// identical, not this comment.
function extractSpdxIds(license) {
  if (!license) return [];
  return license
    .split(/\s+(?:OR|AND)\s+|\/|,/)
    .map((s) => s.trim().replace(/^[()]+|[()]+$/g, ''))
    .filter(Boolean);
}

// Renders the Rust crate set (`extra.rustCrates`): one entry per linked third-party crate, in the
// same visual shape `packageSectionLines` uses for npm packages, followed once by the shared
// "license texts for crates with no bundled license file" section for any SPDX id this exact linked
// set needs one for.
function rustCrateSectionLines(heading, underline, crates, canonicalTexts, targetTriple = null) {
  const out = ['', heading, underline, ''];

  // The section's own intro (release-cut fix batch, SHOULD-FIX 9): states HOW this set was derived,
  // WHICH target triple it is a fact about, and that it deliberately over-includes build-time-only
  // proc-macro crates. All three were previously true only in `rustCrateNotices.mjs`'s own source
  // comments, where no reader of the shipped notice can see them. Written with `--` rather than an
  // em dash on purpose: `checkDistNotice.mjs` counts this section's package entries by the
  // generator's own `<name> <version> — ` line shape, and a prose line whose third token were an em
  // dash would be counted as an entry.
  out.push(
    'This section lists every third-party Rust crate cargo resolves as a NORMAL dependency edge of',
    'frontends/shell/src-tauri, read from that crate\'s own Cargo.lock via `cargo metadata` and',
    '`cargo tree -e normal` (frontends/shell/scripts/rustCrateNotices.mjs) -- never a hand-kept',
    'list. Build-dependencies and dev-dependencies are excluded, as are this repository\'s own',
    'first-party crates.',
    '',
    'The set is a fact about ONE build target: the crates below are those linked for the target',
    `triple ${targetTriple ?? '(not recorded by this generator run)'}. A build for a different`,
    'target would resolve a different set (a platform-specific crate such as webview2-com is linked',
    'for this triple and would not be for another).',
    '',
    'It deliberately OVER-includes. Proc-macro crates that only ever run at BUILD time (serde_derive,',
    'syn, quote, proc-macro2 and the like) are reported by cargo as normal edges and are kept here,',
    'even though the shipped binary never executes their code at runtime. Listing a work that is not',
    'actually carried is harmless for a notice; omitting one that IS carried is the failure this',
    'section exists to prevent.',
    '',
  );

  // Sorts defensively (release-cut fix batch, MUST-FIX 12 nit): every known caller already passes
  // `collectLinkedCrates()`'s own sorted output, but this function has no way to enforce that on a
  // future caller, and a notice's package order is a determinism property this file's own doc
  // comment promises rather than merely hopes for.
  const sorted = [...crates].sort((a, b) =>
    a.name === b.name ? a.version.localeCompare(b.version) : a.name.localeCompare(b.name),
  );

  for (const crate of sorted) {
    // `license_file` read too (release-cut fix batch, MUST-FIX 12 nit): a crate with no `license`
    // SPDX expression sometimes still declares Cargo's own `license-file` key instead (a path to a
    // non-SPDX or custom text) -- printing that path is real information this crate's own Cargo.toml
    // supplies; "(license not declared)" would be false for it.
    const licenseLabel =
      crate.license ?? (crate.licenseFile ? `license-file: ${crate.licenseFile}` : '(license not declared in Cargo.toml)');
    out.push('', `${crate.name} ${crate.version} — ${licenseLabel}`, '');

    // **A directory that could not be READ is not a crate that ships nothing** (closing commit:
    // architect advisory A3, reviewer R2). `collectLinkedCrates` used to swallow a `readdirSync`
    // failure into an empty `licenseFiles`, which arrived here indistinguishable from a genuine
    // empty listing and rendered as the AFFIRMATIVE sentence "no LICENSE/NOTICE/COPYING file ships
    // in <crate>'s registry source" -- a claim about the crate, manufactured out of a failed read
    // of this machine's disk. The failure is now carried through as `licenseFilesError` and printed
    // as what it is. `checkDistNotice.mjs`'s own `DEGRADED_LINE_PATTERNS` matches this exact wording,
    // so an artifact carrying it fails `npm run check:dist-notice` instead of shipping -- the
    // pipeline fails closed on the anomaly, and no false affirmative reaches a recipient meanwhile.
    if (crate.licenseFilesError || crate.licenseFiles.length === 0) {
      if (crate.licenseFilesError) {
        out.push(
          `  (the registry source directory for ${crate.name} could not be read: ${crate.licenseFilesError};`,
          '  whether it ships a license file of its own is UNKNOWN here, and the declared license',
          '  above is all that this notice can state)',
        );
      } else {
        const ids = extractSpdxIds(crate.license).filter((id) => canonicalTexts.has(id));
        if (ids.length > 0) {
          out.push(
            `  (no LICENSE/NOTICE/COPYING file ships in ${crate.name}'s registry source; its declared`,
            '  license is above; the canonical text for ' +
              ids.join(', ') +
              ' is in the "LICENSE TEXTS FOR',
            '  CRATES WITH NO BUNDLED LICENSE FILE" section below.)',
          );
        } else {
          out.push(
            `  (no LICENSE/NOTICE/COPYING file ships in ${crate.name}'s registry source; its declared license is above)`,
          );
        }
      }
      // `authors`/`repository` from `cargo metadata`, kept rather than discarded (release-cut fix
      // batch, MUST-FIX 2): this crate's own registry source carries no LICENSE/NOTICE/COPYING file
      // and (per the shared section below) no OTHER crate's text stands in for one either -- these
      // two fields are what remains of this crate's OWN declared attribution, printed here so a
      // reader is not left with nothing to trace back to the source.
      if (crate.authors && crate.authors.length > 0) {
        out.push(`  authors (declared in ${crate.name}'s own Cargo.toml): ${crate.authors.join(', ')}`);
      }
      if (crate.repository) {
        out.push(`  repository: ${crate.repository}`);
      }
      out.push('');
      continue;
    }
    for (const f of crate.licenseFiles) {
      out.push(`--- ${crate.name}/${f} ---`, '', readFileSync(join(crate.dir, f), 'utf8'), '');
    }
  }

  if (canonicalTexts.size > 0) {
    out.push(
      '',
      'LICENSE TEXTS FOR CRATES WITH NO BUNDLED LICENSE FILE',
      '-----------------------------------------------------',
      '',
      'The crates above whose own registry source carries no LICENSE/NOTICE/COPYING file still',
      'declare an SPDX license id in their own Cargo.toml; the canonical text for each such id --',
      'embedded once here rather than once per crate -- follows. Every text below is this',
      'repository\'s own vetted copy of that licence, from its LICENSES/ directory, whose README',
      'records for each one its sha256 and how it was obtained — the URL and date it was fetched',
      'from, or the local file it was copied from and the reason that copy is trustworthy.',
      '',
      'No text below is borrowed from another crate. An earlier version of this generator, for an id',
      'this repository carried no copy of, fell back to the licence text bundled by some OTHER linked',
      'crate declaring the same id. For a licence whose own body embeds a copyright-holder line --',
      'MIT and BSD-3-Clause both do -- that put a DIFFERENT project\'s copyright notice into this',
      'crate\'s section, which no crate here actually wrote. That fallback is removed, and nothing',
      'stands in its place: if a crate below declared an id this repository carries no text for, this',
      'notice would not have been generated at all (the generator refuses rather than shipping a gap).',
      '',
      'Each text is the licence itself, not a crate-specific notice. Where a licence\'s own body has a',
      'copyright-holder line, it is left exactly as the unfilled placeholder the licence text carries',
      '(for example "Copyright (c) <year> <owner>"), and no holder is invented here. What was actually',
      'checked is narrower than "this crate published no copyright notice anywhere": no crate below',
      'ships a top-level LICENSE/NOTICE/COPYING/UNLICENSE file in its registry source, which is the',
      'one thing this generator reads (frontends/shell/scripts/rustCrateNotices.mjs). Some licences',
      '(MPL-2.0) have no such line at all, and are reproduced as they stand.',
      '',
      'Where a crate declares a compound "OR" expression (for example "MIT/Apache-2.0"), every atom',
      'the expression names may appear below. Offering more than one text is informational, never an',
      'election of one licence over the other on that crate\'s behalf.',
      '',
    );
    for (const [id, entry] of [...canonicalTexts.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      out.push(`--- ${id} (source: ${entry.source}) ---`, '', entry.text, '');
    }
  }

  return out;
}

// The line that closes the fourth section, and the whole file when that section is present. A
// FIXED sentinel with no counts or versions in it, so `checkDistNotice.mjs` can bound the embedded
// notice text inside the built `dist/` bundle by an exact string (it previously bounded it by the
// gap paragraph's closing line, which this piece deletes). It carries no claim of its own -- the
// claims are all in the section's intro, where a reader meets them before the texts.
const AMALGAMATION_END_SENTINEL = 'END OF THE DUCKDB BUNDLED THIRD-PARTY SOURCES SECTION';

// The FOURTH set's rendered section (DECISIONS-PENDING entry 62 = (a), 2026-09-08; preregistered in
// RELEASE-0.1.md Amendment 10). Replaces `duckdbAmalgamationGapLines()`, which named these 26 works
// and said outright that their licence texts were not carried.
//
// `set` is `frontends/shell/scripts/duckdbAmalgamationNotices.mjs`'s `buildAmalgamationSet()` output:
// every text has already been read from `LICENSES/third-party/duckdb-<version>/` and its `sha256`
// re-verified against that directory's `MANIFEST.json`, and the manifest's library list has already
// been compared against the pinned crate tarball's own `third_party/` listing. This function does no
// I/O -- it receives texts, not paths -- so `renderer/bundle-viewer` gains no dependency on
// `frontends/shell`, the same direction `extractSpdxIds`'s deliberate duplication above preserves
// (docs/02's module map: `frontends` is a client of the renderer, not something it reaches into).
//
// **The entry-line shape, and why it differs from the other three sections.** The other three emit
// `<name> <version> — <license>`; a bundled C/C++ source tree has no per-work version to state, and
// inventing one would be a claim about upstream that nothing here checked. This section emits
// `<lib> (third_party/<lib>) — <license id>` instead: still one anchored line per work at true line
// start, which is what `checkDistNotice.mjs`'s cardinality check needs, and every token in it is a
// fact the manifest records.
function duckdbAmalgamationSectionLines(set) {
  const heading = set.heading;
  const out = ['', heading, '-'.repeat(heading.length), ''];

  // The intro states WHAT this set is, HOW it was enumerated, and -- the preregistration's own
  // requirement -- that its source is the upstream tree's listing at the pinned crate version
  // rather than a build manifest. Written with `--` rather than an em dash for the same reason
  // `rustCrateSectionLines`'s intro is: `checkDistNotice.mjs` counts entry lines by an em-dash line
  // shape, and a prose line shaped like one would be miscounted as an entry.
  out.push(
    `${set.crateName} ${set.crateVersion} (listed in the Rust crate section above) compiles DuckDB's`,
    `own AMALGAMATED source tree into this application. That tree embeds ${set.works.length} further`,
    'third-party works under its own `third_party/` directory. Their licence texts follow, in full.',
    '',
    'This set is enumerated differently from every other section of this file, and that difference is',
    'stated rather than hidden. The three sections above are each read from a BUILD MANIFEST -- two',
    'esbuild/Rollup metafiles, and Cargo.lock. This one has no build manifest to read: no Cargo',
    'manifest names these works individually, and the amalgamation tarball the crate compiles carries',
    'their SOURCES but no licence, notice or copying file of any kind. This set is therefore',
    "enumerated from DuckDB's own UPSTREAM SOURCE TREE at the version the pinned crate corresponds to",
    `-- the directory listing of third_party/ at tag ${set.duckdbTag} (commit ${set.duckdbCommit}) of`,
    `${set.upstreamRepository}, intersected with what that crate's own tarball actually carries. It is`,
    'a manifest of a kind, and a checkable one, but it is not a build manifest.',
    '',
    `The texts below were fetched from that tag on ${set.retrieved} and are pinned in this repository`,
    `under ${set.pinnedDirName}/, each with the URL it came from and its sha256, in that directory's`,
    "own MANIFEST.json. Every one of those hashes is re-verified against the pinned bytes each time",
    'this notice is generated, and the pinned library list is checked against the crate tarball\'s own',
    'third_party/ listing, so this section cannot silently drift from what the application compiles.',
    `The method, the tag, the retrieval date and every URL are recorded in ${set.pinnedDirName}/README.md.`,
    '',
    'DuckDB declares no SPDX identifier for these works. Each licence id below was either self-declared',
    "in the pinned text itself or read from that text's operative clauses -- MANIFEST.json records",
    'which, per work. The text is the authority in every case; the id is a label beside it.',
    '',
  );

  for (const work of set.works) {
    out.push('', `${work.lib} (third_party/${work.lib}) — ${work.licenseId}`, '');
    if (work.note) out.push(`  ${work.note}`, '');
    for (const f of work.files) {
      out.push(`--- ${work.lib}/${f.file} (upstream ${f.upstreamPath}) ---`, '', f.text, '');
    }
  }

  out.push('', AMALGAMATION_END_SENTINEL, '');
  return out;
}

export {
  extractPackages,
  // Exported for `frontends/shell/src/notices/spdxTokenisation.test.ts` only (closing commit,
  // reviewer R3): the equal-tokenisation test needs both copies as values to compare. Nothing
  // imports it to USE it -- see the deliberate-duplication comment on the function itself.
  extractSpdxIds,
  packageSectionLines,
  rustCrateSectionLines,
  extraHeaderLines,
  bootstrapHeaderLines,
  duckdbAmalgamationSectionLines,
  AMALGAMATION_END_SENTINEL,
};
