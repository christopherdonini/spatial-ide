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
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { collectLinkedCrates } from "../../scripts/rustCrateNotices.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..", "..");
const generatedPath = join(here, "..", "generated", "NOTICE.txt");
const viewerDistPath = join(repoRoot, "renderer", "bundle-viewer", "dist", "NOTICE.txt");
const shellMetafilePath = join(here, "..", "..", "dist-metafile.json");
const viewerMetafilePath = join(repoRoot, "renderer", "bundle-viewer", "dist-metafile.json");

// `notice.mjs`'s own emitted per-entry line shape (`packageSectionLines`/`rustCrateSectionLines`:
// `${name} ${version} — ${license}`), anchored to a real line start (release-cut fix batch,
// SHOULD-FIX 5). The substring checks this file used to carry (`generated.includes(name)`) proved
// only that a NAME occurs somewhere in a 3 MB file, which stays true after deleting that package's
// own entry whenever the name recurs in an import specifier, a comment, or another package's own
// license text. Matching the line shape inside the right SECTION, and counting, is what actually
// fails when an entry disappears.
const ENTRY_LINE = /^(\S+) (\S+) — /gm;

function packageNamesFrom(metafilePath: string): Set<string> {
  const metafile = JSON.parse(readFileSync(metafilePath, "utf8"));
  const names = new Set<string>();
  for (const input of Object.keys(metafile.inputs)) {
    const at = input.lastIndexOf("node_modules/");
    if (at === -1) continue;
    const rest = input.slice(at + "node_modules/".length).split("/");
    names.add(rest[0].startsWith("@") ? `${rest[0]}/${rest[1]}` : rest[0]);
  }
  return names;
}

// The three section headings `generateNotice.mjs` passes and `notice()` emits, in file order.
const VIEWER_HEADING = "THIRD-PARTY WORKS COMPILED INTO THIS VIEWER";
const FRONTEND_HEADING = "THIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND";
const RUST_HEADING = "RUST CRATES STATICALLY LINKED INTO THE PACKAGED APPLICATION";

function section(text: string, startHeading: string, endHeading: string | null): string {
  const s = text.indexOf(startHeading);
  if (s === -1) throw new Error(`section: heading ${JSON.stringify(startHeading)} not found`);
  const e = endHeading ? text.indexOf(endHeading, s) : -1;
  return e === -1 ? text.slice(s) : text.slice(s, e);
}

function entryLines(sectionText: string): string[] {
  return [...sectionText.matchAll(ENTRY_LINE)].map((m) => `${m[1]} ${m[2]}`);
}

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

  // Release-cut fix batch, SHOULD-FIX 4. `notice()`'s BOOTSTRAP header is provisional by
  // construction: it is written on a fresh clone, before this package's own `vite build` has ever
  // produced `dist-metafile.json`, and it names a scope narrower than the artifact owes. It must be
  // superseded by the second `generateNotice.mjs` pass within the SAME `npm run build`. If that
  // sentinel survives into `src/generated/NOTICE.txt`, the two-pass sequence did not complete and
  // the file on disk is not shippable -- asserted here as well as in `check:dist-notice`, because
  // this test runs against the generator's own output and that check runs against the built `dist/`.
  it("carries no provisional BOOTSTRAP sentinel", () => {
    const generated = readFileSync(generatedPath, "utf8");
    expect(generated).not.toMatch(/BOOTSTRAP PASS/);
  });

  it("carries one anchored entry line per npm package this package's own Vite build compiled in", () => {
    const generated = readFileSync(generatedPath, "utf8");
    const names = packageNamesFrom(shellMetafilePath);
    expect(names.size).toBeGreaterThan(0); // 26 today; read from the manifest, never pinned here
    const entries = entryLines(section(generated, FRONTEND_HEADING, RUST_HEADING));
    expect(entries.length).toBe(names.size);
    const entryNames = new Set(entries.map((e) => e.split(" ")[0]));
    for (const name of names) {
      expect(entryNames.has(name), `NOTICE.txt's frontend section should carry an entry line for "${name}"`).toBe(true);
    }
  });

  it("carries one anchored entry line per npm package the bundle viewer's own build compiled in", () => {
    const generated = readFileSync(generatedPath, "utf8");
    const names = packageNamesFrom(viewerMetafilePath);
    expect(names.size).toBeGreaterThan(0); // 3 today
    const entries = entryLines(section(generated, VIEWER_HEADING, FRONTEND_HEADING));
    expect(entries.length).toBe(names.size);
    const entryNames = new Set(entries.map((e) => e.split(" ")[0]));
    for (const name of names) {
      expect(entryNames.has(name), `NOTICE.txt's viewer section should carry an entry line for "${name}"`).toBe(true);
    }
  });

  // Cardinality by (name, version) PAIR, not by name: 310 linked pairs across 296 distinct names
  // today, because some crates resolve two major versions transitively. Counting names would let a
  // deleted `time 0.3.55` entry pass whenever another `time` entry survives.
  it("carries one anchored entry line per linked Rust crate (name+version pair)", () => {
    const generated = readFileSync(generatedPath, "utf8");
    const crates = collectLinkedCrates();
    expect(crates.length).toBeGreaterThan(0);
    const entries = new Set(entryLines(section(generated, RUST_HEADING, null)));
    for (const crate of crates) {
      expect(
        entries.has(`${crate.name} ${crate.version}`),
        `NOTICE.txt's Rust section should carry an entry line for "${crate.name} ${crate.version}"`
      ).toBe(true);
    }
    expect(entries.size).toBe(crates.length);
  });

  // Release-cut fix batch, SHOULD-FIX 7. `LICENSES/<id>.txt` is not documentation here: for the 12
  // linked crates whose own registry source ships no license file, `buildCanonicalLicenseTexts`
  // embeds these exact bytes into a notice a recipient relies on. A silent edit to one of them
  // silently changes the licence text this application conveys, and nothing else in the repository
  // would notice. Pinned by content hash, and asserted to actually reach the generated notice.
  //
  // Provenance for all four, including the retrieval date and the URL each hash reproduces, is in
  // `LICENSES/README.md`. Updating one of these hashes is a deliberate act; it is not a way to make
  // a failing test pass.
  //
  // **Two conscious updates, coordinator follow-up to the fix batch (2026-09-08):**
  //   - `BSD-3-Clause.txt` `0fe4dd69…` -> `5a93d583…`. The old bytes were SPDX's *matching template*
  //     for that id, carrying `<<var;name=copyright;original= <year> <owner>;match=.+>>` markup —
  //     a specification for licence-detection tooling, which was being rendered into a NOTICE a
  //     human reads. Replaced with the plain-text variant, placeholders as ordinary angle-bracket
  //     text. The `noVarMarkup` assertion below is what keeps that from coming back.
  //   - `MPL-2.0.txt` added (`66c10535…`), no previous value. Without it `selectors 0.36.1` — which
  //     declares MPL-2.0 and ships no licence file — had no text at all in the generated notice.
  const PINNED_LICENSE_TEMPLATES: Record<string, string> = {
    "Apache-2.0.txt": "a60eea817514531668d7e00765731449fe14d059d3249e0bc93b36de45f759f2",
    "MIT.txt": "c3b1b78bc8bd3ea13aa4bc9778442d16560270afa235006d816e5e88cef24db4",
    "BSD-3-Clause.txt": "5a93d5831e1297ab10fe643e1a631e83be392896da14ee2951285a79012df69d",
    "MPL-2.0.txt": "66c10535a495f4cd8115607e890f8116d657064b98557f660c51e123b3f3fee6",
  };

  it("embeds the pinned LICENSES/ template texts, unmodified, in the generated notice", () => {
    const generated = readFileSync(generatedPath, "utf8");
    for (const [file, expectedSha256] of Object.entries(PINNED_LICENSE_TEMPLATES)) {
      const bytes = readFileSync(join(repoRoot, "LICENSES", file));
      expect(createHash("sha256").update(bytes).digest("hex"), `LICENSES/${file} content hash`).toBe(expectedSha256);
      expect(
        generated.includes(bytes.toString("utf8")),
        `NOTICE.txt should embed LICENSES/${file} verbatim (it is the canonical text for crates that ship none)`
      ).toBe(true);
    }
  });

  // SPDX publishes some licences twice: a plain text, and a matching TEMPLATE whose
  // `<<var;name=…;original=…;match=…>>` markup tells licence-detection tooling which substitutions
  // still count as the same licence. The template is a machine specification, not a licence text
  // for a recipient, and one of these files was the template form until this follow-up. Asserted
  // against the shipped notice as well as the source files, since the notice is what a reader sees.
  it("carries no SPDX matching-template markup, in the license files or the generated notice", () => {
    const generated = readFileSync(generatedPath, "utf8");
    for (const file of Object.keys(PINNED_LICENSE_TEMPLATES)) {
      const text = readFileSync(join(repoRoot, "LICENSES", file), "utf8");
      expect(text, `LICENSES/${file} should be SPDX's plain text, not its matching template`).not.toMatch(/<<var/);
    }
    expect(generated).not.toMatch(/<<var/);
  });
});
