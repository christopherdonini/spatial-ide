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
 * The publish operation lists a content hash for every viewer asset and ADR-017 §12 promises
 * byte-identical rebuilds, so this file must not depend on directory order or on the clock.
 * Packages are sorted by name and each package's files by filename. **No timestamp is written.**
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
 *   rustCrates: { heading, crates, canonicalTexts },  // `crates`: collectLinkedCrates()'s own
 *                                                      // return shape; `canonicalTexts`: a
 *                                                      // Map<spdxId, {text, source}> for crates
 *                                                      // whose own registry source ships no
 *                                                      // license file (buildCanonicalLicenseTexts()).
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
        ),
      );
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
    'sweep): inside a published bundle, this is the whole notice set the bundle owes (the bundle',
    'carries nothing but this viewer). Installed beside the packaged application\'s own executable,',
    'this file enumerates ONLY the third-party works compiled into the bundle VIEWER -- it does NOT',
    'enumerate two further sets of third-party works the installed application also carries: (i) the',
    'packaged frontend\'s OWN npm dependencies, compiled into frontends/shell/dist and conveyed via',
    'tauri.conf.json\'s `frontendDist` -- react, react-dom, @deck.gl/core, @deck.gl/layers, and the',
    'shell\'s own apache-arrow, each a separate install from the copies compiled into this viewer;',
    'and (ii) the Rust crates statically linked into the kernel/data-engine/renderer binary the',
    'application also embeds (kernel, engine, protocol, and their own dependencies), listed instead',
    'in this repository\'s own DEPENDENCY-LICENSES.md. Generating BOTH of those into the installed',
    'copy of this file is OWED, not yet done, under RELEASE-0.1\'s item 9 (both notice generators,',
    'before the v0.1.0 tag) and ADR-030 (docs/adr/ADR-030-conveyed-artifact-notice-set.md, Proposed,',
    'candidate (a)) -- named here rather than silently assumed covered by the third-party section',
    'below.',
    '',
    '',
  ];
}

// The header block the packaged shell's own installed `NOTICE.txt` carries once `extra` is passed
// (RELEASE-0.1 item 9; ADR-030 candidate (a)). Replaces the two "OWED, not yet done" sentences the
// bundle-only header above still carries (correctly, for that artifact) with a scope sentence
// naming what THIS artifact's copy actually enumerates -- itself generated, per section, from that
// section's own build manifest, never hand-copied.
function extraHeaderLines() {
  return [
    'NOTICES',
    '=======',
    '',
    'This file is the notice set for the packaged Spatial IDE desktop application: the shell',
    'executable together with the kernel, data engine, renderer and protocol implementation it',
    'embeds. It is generated from three separate build manifests, never hand-copied: the bundle',
    'viewer\'s own esbuild metafile (renderer/bundle-viewer/build.mjs), the packaged frontend\'s own',
    'Vite/Rollup build output (frontends/shell/vite.config.ts), and frontends/shell/src-tauri/',
    'Cargo.lock, read via `cargo metadata`/`cargo tree` (RELEASE-0.1\'s item 9, both notice',
    'generators, before the v0.1.0 tag; ADR-030, docs/adr/ADR-030-conveyed-artifact-notice-set.md,',
    'candidate (a)). It lists what was actually compiled into and shipped beside this executable,',
    'rather than what someone remembered to write down.',
    '',
    'This SAME text -- specifically the portion below from the "THE VIEWER" heading through the end',
    'of the "THIRD-PARTY WORKS COMPILED INTO THIS VIEWER" section -- is ALSO, byte for byte, the',
    'whole notice set a published bundle owes on its own (renderer/bundle-viewer/dist/NOTICE.txt;',
    'a published bundle carries nothing but this viewer, so its own copy of this file stops there).',
    'This installed copy scopes wider, because the installed application carries more than the',
    'viewer alone: it enumerates every third-party work actually compiled into three things -- the',
    'bundle VIEWER; the packaged frontend\'s OWN npm dependencies, compiled into frontends/shell/dist',
    'and conveyed via tauri.conf.json\'s `frontendDist`; and the Rust crates statically linked into',
    'the kernel/data-engine/renderer/protocol binary this application also embeds -- each in its own',
    'section below.',
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
    'This file therefore enumerates only the bundle viewer\'s own third-party works and the Rust',
    'crates statically linked into the application below; the packaged frontend\'s OWN npm',
    'dependencies (react, react-dom, @deck.gl/core, @deck.gl/layers, apache-arrow, …) are added, and',
    'this whole header replaced with the full scope statement, by the SECOND generateNotice.mjs pass',
    '`npm run build`\'s own script body runs immediately after its first `vite build` -- see that',
    'script (frontends/shell/package.json\'s "build") for the two-pass sequence this bootstraps.',
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
// keywords `OR`/`AND`. Good enough to find which canonical texts a gap crate's declaration needs
// (`buildCanonicalLicenseTexts` below); an id this misses just gets no canonical text offered,
// named honestly rather than guessed at.
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
function rustCrateSectionLines(heading, underline, crates, canonicalTexts) {
  const out = ['', heading, underline, ''];

  for (const crate of crates) {
    out.push(
      '',
      `${crate.name} ${crate.version} — ${crate.license ?? '(license not declared in Cargo.toml)'}`,
      '',
    );

    if (crate.licenseFiles.length === 0) {
      const ids = extractSpdxIds(crate.license).filter((id) => canonicalTexts.has(id));
      if (ids.length > 0) {
        out.push(
          `  (no LICENSE/NOTICE/COPYING file ships in ${crate.name}'s registry source; its declared`,
          '  license is above; the canonical text for ' +
            ids.join(', ') +
            ' is in the "LICENSE TEXTS FOR',
          '  CRATES WITH NO BUNDLED LICENSE FILE" section below.)',
          '',
        );
      } else {
        out.push(
          `  (no LICENSE/NOTICE/COPYING file ships in ${crate.name}'s registry source; its declared license is above)`,
          '',
        );
      }
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
      'embedded once here rather than once per crate -- follows. Each is sourced either from this',
      'repository\'s own LICENSES/ directory, or, where this repository does not carry that id, from',
      'the alphabetically-first crate in this EXACT linked dependency set that declares the id alone',
      'and ships its own license file -- a real file already in this dependency tree, named below so',
      'it can be diffed directly against the source it came from.',
      '',
    );
    for (const [id, entry] of [...canonicalTexts.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      out.push(`--- ${id} (source: ${entry.source}) ---`, '', entry.text, '');
    }
  }

  return out;
}

export { extractPackages, packageSectionLines, rustCrateSectionLines, extraHeaderLines, bootstrapHeaderLines };
