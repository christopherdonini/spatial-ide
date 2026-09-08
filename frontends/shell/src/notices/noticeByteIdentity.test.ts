// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 Amendment 3, item 2 preregistration: "the generated NOTICE.txt is byte-identical to
// notice()'s output (a unit test)". This is the assertion the release cut's own fix batch found
// MISSING (MUST-FIX 2) -- it did not exist before this file. `renderer/bundle-viewer/dist/NOTICE.txt`
// IS notice()'s output (written by that package's own build.mjs, `notice(result.metafile)`); this
// test compares `src/generated/NOTICE.txt` (this package's own `scripts/generateNotice.mjs`
// output) against it byte for byte, which is also what closes the dist-metafile staleness gap
// (S7): if `dist-metafile.json` were ever stale relative to `dist/NOTICE.txt` (e.g. `dist/` rebuilt
// without regenerating the metafile file), the two texts would disagree and this test would fail.
//
// Requires both files to already exist -- `pretest` (`package.json`) builds the bundle viewer and
// runs `generate:notice` first, so `npx vitest run` succeeds on a fresh clone (S9) without a
// human needing to know the two-package build order by hand.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const generatedPath = join(here, "..", "generated", "NOTICE.txt");
const viewerDistPath = join(here, "..", "..", "..", "..", "renderer", "bundle-viewer", "dist", "NOTICE.txt");

describe("src/generated/NOTICE.txt (RELEASE-0.1 item 2, MUST-FIX 2)", () => {
  it("is byte-identical to renderer/bundle-viewer/dist/NOTICE.txt -- notice()'s own output", () => {
    const generated = readFileSync(generatedPath);
    const viewerDist = readFileSync(viewerDistPath);
    expect(generated.equals(viewerDist)).toBe(true);
  });
});
