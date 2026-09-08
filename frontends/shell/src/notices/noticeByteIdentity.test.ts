// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 Amendment 3, item 2 preregistration: "the generated NOTICE.txt is byte-identical to
// notice()'s output (a unit test)". This is the assertion the release cut's own fix batch found
// MISSING (MUST-FIX 2) -- it did not exist before this file. Extended by RELEASE-0.1 item 9 / ADR-030
// candidate (a): `src/generated/NOTICE.txt` is no longer byte-identical to
// `renderer/bundle-viewer/dist/NOTICE.txt` as a WHOLE FILE -- by design, this package's own copy
// gains two more sections (the packaged frontend's own npm set, the linked Rust crates) that a
// published bundle's own copy never carries, and a different scope header describing that wider
// enumeration. What must stay byte-identical, and does, is the VIEWER SECTION -- the shared content
// from the "THE VIEWER" heading through the end of "THIRD-PARTY WORKS COMPILED INTO THIS VIEWER" --
// because `notice()` generates that portion via the exact same code path, given the exact same
// viewer metafile and baseDir, for both callers (`notice.mjs`'s own doc comment on `extra`).
//
// Requires both files to already exist -- `pretest` (`package.json`) builds the bundle viewer AND
// this package itself (`npm run build`, which regenerates `src/generated/NOTICE.txt` with full
// scope as its own second pass) first, so `npx vitest run` succeeds on a fresh clone (S9) without a
// human needing to know the two-package build order by hand.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { collectLinkedCrates } from "../../scripts/rustCrateNotices.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const generatedPath = join(here, "..", "generated", "NOTICE.txt");
const viewerDistPath = join(here, "..", "..", "..", "..", "renderer", "bundle-viewer", "dist", "NOTICE.txt");
const shellMetafilePath = join(here, "..", "..", "dist-metafile.json");

// The exact same slice both files: from "THE VIEWER" heading through whatever follows -- for the
// viewer-only bundle output, that is everything to the end of the string (nothing follows); for
// this package's own wider-scoped output, everything up to (not including) the first section this
// piece appends after it. `trimEnd()`: the two texts legitimately carry a DIFFERENT number of
// trailing blank lines at this exact boundary -- `join('\n')` naturally emits an extra blank
// separator line before whatever section follows next when one exists (here) and none at all when
// nothing follows (the viewer-only bundle's own `dist/NOTICE.txt`, where the string just ends) --
// which is a fact about section CONCATENATION, not about the viewer section's own content; trimming
// it is what makes this a content-identity check rather than a whitespace-layout one.
function viewerSection(fullText: string): string {
  const start = fullText.indexOf("THE VIEWER\n----------");
  if (start === -1) throw new Error('viewerSection: "THE VIEWER" heading not found in notice text');
  const nextSectionMarker = "\nTHIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND";
  const nextIdx = fullText.indexOf(nextSectionMarker, start);
  const section = nextIdx === -1 ? fullText.slice(start) : fullText.slice(start, nextIdx);
  return section.trimEnd();
}

describe("src/generated/NOTICE.txt (RELEASE-0.1 item 2 MUST-FIX 2; extended by item 9 / ADR-030 (a))", () => {
  it("has a viewer section byte-identical to renderer/bundle-viewer/dist/NOTICE.txt's own text", () => {
    const generated = readFileSync(generatedPath, "utf8");
    const viewerDist = readFileSync(viewerDistPath, "utf8");
    expect(viewerSection(generated)).toBe(viewerSection(viewerDist));
  });

  it("no longer carries the two REMOVED 'owed, not yet done' gap sentences", () => {
    const generated = readFileSync(generatedPath, "utf8");
    expect(generated).not.toMatch(/OWED, not yet done/);
    expect(generated).not.toMatch(/it does NOT\nenumerate two further sets/);
  });

  it("names every npm package this package's own Vite build compiled in, by name", () => {
    const generated = readFileSync(generatedPath, "utf8");
    const metafile = JSON.parse(readFileSync(shellMetafilePath, "utf8"));
    const names = new Set<string>();
    for (const input of Object.keys(metafile.inputs)) {
      const at = input.lastIndexOf("node_modules/");
      if (at === -1) continue;
      const rest = input.slice(at + "node_modules/".length).split("/");
      names.add(rest[0].startsWith("@") ? `${rest[0]}/${rest[1]}` : rest[0]);
    }
    expect(names.size).toBeGreaterThan(0);
    for (const name of names) {
      expect(generated.includes(name), `NOTICE.txt should name npm package "${name}"`).toBe(true);
    }
  });

  it("names every Rust crate linked into the shell binary, by name", () => {
    const generated = readFileSync(generatedPath, "utf8");
    const crates = collectLinkedCrates();
    expect(crates.length).toBeGreaterThan(0);
    for (const crate of crates) {
      expect(generated.includes(crate.name), `NOTICE.txt should name crate "${crate.name}"`).toBe(true);
    }
  });
});
