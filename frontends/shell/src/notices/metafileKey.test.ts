// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Guards the nested-`node_modules` attribution fix (closing commit, reviewer R1). The release-cut
// fix batch's SHOULD-FIX 6 changed `lastIndexOf("node_modules/")` to `indexOf("node_modules/")` in
// `vite.config.ts`'s own metafile plugin, and until this file nothing in the repository failed if it
// were changed back -- the regression is silent by construction: the build still succeeds and the
// notice simply attributes the WRONG copy of a nested package (a different version's license text,
// or a degraded "could not be read" line for the copy actually compiled in).
//
// The plugin's slicing was extracted to `scripts/metafileKey.mjs` so this can be a fixture-level
// unit test with no `vite build` and no filesystem access at all -- the function is pure over
// (module id, root).
//
// **Reverting `indexOf` -> `lastIndexOf` in `scripts/metafileKey.mjs` must fail the first case
// below.** That is the mutation this file exists to be checked against.
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { metafileKeyForModuleId } from "../../scripts/metafileKey.mjs";

// A platform-native absolute root; nothing here is ever read from disk, so it need not exist.
const ROOT = resolve("/fixture/frontends/shell");

describe("metafileKeyForModuleId (vite.config.ts's packageMetafilePlugin key slicing)", () => {
  it("keeps the whole nested path for a package resolved from a nested node_modules", () => {
    // The real, non-hypothetical case named in the fix's own comment: `command-line-usage` bundles
    // its own `array-back`, a different version from the top-level one.
    const id = join(ROOT, "node_modules", "command-line-usage", "node_modules", "array-back", "index.js");

    const key = metafileKeyForModuleId(id, ROOT);

    expect(key).toBe("node_modules/command-line-usage/node_modules/array-back/index.js");
    // Exactly what `lastIndexOf` yields, spelled out so the mutation this test guards is named in
    // the failure rather than left to be inferred: with `lastIndexOf` the nesting prefix is dropped
    // and `notice.mjs`'s `extractPackages` resolves the TOP-LEVEL `array-back` instead.
    expect(key).not.toBe("node_modules/array-back/index.js");
  });

  it("slices a plain top-level package to its own key", () => {
    const id = join(ROOT, "node_modules", "react", "index.js");
    expect(metafileKeyForModuleId(id, ROOT)).toBe("node_modules/react/index.js");
  });

  it("keeps a scoped package's scope in the key", () => {
    const id = join(ROOT, "node_modules", "@deck.gl", "core", "dist", "index.js");
    expect(metafileKeyForModuleId(id, ROOT)).toBe("node_modules/@deck.gl/core/dist/index.js");
  });

  it("returns null for first-party source, which belongs in no package set", () => {
    expect(metafileKeyForModuleId(join(ROOT, "src", "main.tsx"), ROOT)).toBeNull();
  });

  it("refuses a third-party module resolved from OUTSIDE this package's root", () => {
    // Its key would be attributed to `frontends/shell`'s own node_modules tree by every consumer of
    // this metafile, which is a wrong-tree read of the class MUST-FIX 1 fixed -- and silently wrong,
    // since a same-named package usually exists there too.
    const id = join(resolve("/fixture"), "node_modules", "react", "index.js");
    expect(() => metafileKeyForModuleId(id, ROOT)).toThrow(/resolves OUTSIDE this package's root/);
  });
});
