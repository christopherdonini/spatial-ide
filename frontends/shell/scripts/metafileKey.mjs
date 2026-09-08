// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The key-slicing half of `vite.config.ts`'s own `packageMetafilePlugin`, extracted so a unit test
// can exercise it against fixture paths without running a real `vite build` (closing commit,
// reviewer R1). Nothing else changed: the plugin calls this function per Rollup module id and the
// behaviour is the behaviour it already had.
//
// **Why this needed its own test at all.** The release-cut fix batch's SHOULD-FIX 6 changed
// `lastIndexOf("node_modules/")` to `indexOf("node_modules/")` here, and nothing in the repository
// would have failed if it were changed back. The failure it prevents is silent by construction:
// with `lastIndexOf`, a nested path (`node_modules/command-line-usage/node_modules/array-back/…`)
// emits the key `node_modules/array-back/…`, so the consumer -- `renderer/bundle-viewer/
// notice.mjs`'s `extractPackages`, which is `lastIndexOf`-based CORRECTLY on the full key --
// resolves and reads the TOP-LEVEL `array-back` instead of the nested copy actually compiled in. The
// build still succeeds; the notice simply attributes a different version, or degrades to a line
// saying it could not read one. `metafileKey.test.ts`'s nested case is what fails on that revert.

import { relative } from 'node:path';

/**
 * The esbuild-metafile-shaped key for one Rollup module id, or `null` when the module is not a
 * third-party one (no `node_modules/` segment) and so belongs in no package set.
 *
 * `root` is the build's own working directory (`process.cwd()` when `vite build` runs, always
 * `frontends/shell` under this repository's own npm scripts). Keys are relative to it and
 * forward-slashed, matching esbuild's own metafile convention exactly, so `extractPackages` reads
 * either build tool's output without caring which produced it -- and so a hashed artifact never
 * depends on where the build was invoked from.
 *
 * Throws for a module that lives under a `node_modules/` OUTSIDE `root`: every consumer resolves
 * this metafile's keys against `frontends/shell`, so attributing such a module here would read the
 * wrong `node_modules` tree, silently, since a same-named package usually exists there too.
 */
export function metafileKeyForModuleId(id, root) {
  const rel = relative(root, id).replace(/\\/g, '/');
  const withinRoot = rel.replace(/^(?:\.\.\/)+/, '');
  // **FIRST `node_modules/`, not the last (release-cut fix batch, SHOULD-FIX 6).** Slicing from the
  // first occurrence keeps the WHOLE nested path, which is exactly what `extractPackages` needs in
  // order to land on the nested copy; slicing from the last discards the nesting prefix and names
  // the wrong package.
  const at = withinRoot.indexOf('node_modules/');
  if (at === -1) return null;
  if (withinRoot !== rel) {
    throw new Error(
      `packageMetafilePlugin: module id ${id} resolves OUTSIDE this package's root ` +
        `(${root}) yet lives under node_modules/. This metafile's keys are ` +
        'resolved against frontends/shell by every consumer, so attributing it here ' +
        'would read the wrong node_modules tree. Vendor it, or give this set its own ' +
        'metafile entry with its own baseDir.',
    );
  }
  return withinRoot.slice(at);
}
