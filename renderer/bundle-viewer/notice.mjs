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
 */
export function notice(metafile) {
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
    // esbuild's metafile keys are always forward-slashed, including on Windows.
    packages.set(name, prefix + name);
  }

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
    'NOTICES FOR THIS VIEWER',
    '=======================',
    '',
    'This file is the notice set for the program distributed in this bundle: the viewer\'s own',
    'copyright and license notice, followed by the retained notices of every third-party work',
    'compiled into it.',
    '',
    'It is generated by renderer/bundle-viewer/build.mjs from esbuild\'s metafile, so it lists what',
    'was actually bundled rather than what someone remembered to write down.',
    '',
    '',
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
  ];

  // The AGPL text itself, when the repository has it. AGPL-3.0 section 4 requires a copy of the
  // License to travel with the Program, and that copy is not something this script can invent —
  // see LICENSES/README.md for why it may be absent and the one command that fixes it. Emitting a
  // marked absence is the honest form; emitting nothing would hide an unmet obligation.
  // Resolved from this file's own location, not from the cwd. The notice is content-hashed into
  // every manifest, so a cwd-relative read would make a hashed artifact depend on where the build
  // was invoked from — which is exactly the class of thing ADR-017 §12's determinism guarantee is
  // about.
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
  // 2; ADR-009 item 1 -- core code, not item 7's bundle-scoped viewer clause -- + AGPL-3.0
  // sections 4/5). Unconditional, worded as a conditional statement ("if this file was
  // installed…"), because `notice()` has exactly one shape shared by every caller: it becomes
  // both the viewer's own `dist/NOTICE.txt` (carried inside every published bundle, where no
  // installer is present) and the packaged shell's own beside-the-executable `NOTICE.txt`
  // (`tauri.conf.json`'s `bundle.resources`) -- one source, never a second copy that could drift,
  // so the sentence must read true in both places rather than only in one of them.
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
    'Its corresponding source, as AGPL-3.0 sections 4 and 5 require, is available at:',
    '',
    '  https://github.com/christopherdonini/spatial-ide',
    '',
    'SPDX-License-Identifier: AGPL-3.0-or-later',
    '',
  );

  out.push('', 'THIRD-PARTY WORKS COMPILED INTO THIS VIEWER', '------------------------------------------', '');

  for (const pkg of [...packages.keys()].sort()) {
    const dir = packages.get(pkg);
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

  return out.join('\n');
}
