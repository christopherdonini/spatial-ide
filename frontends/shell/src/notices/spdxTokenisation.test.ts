// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// `extractSpdxIds` exists TWICE on purpose (closing commit, reviewer R3):
// `frontends/shell/scripts/rustCrateNotices.mjs` exports one, `renderer/bundle-viewer/notice.mjs`
// keeps a private copy. De-duplicating by importing the exported one would make the renderer module
// -- which every published bundle carries and which builds on its own -- depend on `frontends/shell`,
// inverting the direction docs/02's module map states: `frontends` is "Clients only — no logic"
// there, a client of the renderer, not something it reaches into. So the copies stay, and this file
// is what keeps them honest.
//
// **Why a divergence would matter, concretely.** The shell's copy decides which canonical texts are
// COLLECTED (`buildCanonicalLicenseTexts`); the renderer's copy decides which ids are ANNOUNCED
// under a crate that ships no license file ("the canonical text for X is in the ... section below").
// If they tokenised a declaration differently, the generated notice would either promise a text it
// does not carry, or embed one nothing points at -- in a conveyed legal notice, in a way no other
// test in this repository would see.
import { describe, expect, it } from "vitest";

import { extractSpdxIds as viewerCopy } from "../../../../renderer/bundle-viewer/notice.mjs";
import { collectLinkedCrates, extractSpdxIds as shellCopy } from "../../scripts/rustCrateNotices.mjs";

// Expression SHAPES, not a licence policy: every separator and wrapper the two copies claim to
// handle (`OR`, `AND`, `/`, `,`, stray parentheses), plus the empty inputs, plus the shapes the
// linked set actually declares today.
const SAMPLE: (string | null | undefined)[] = [
  "MIT",
  "MIT OR Apache-2.0",
  "MIT/Apache-2.0",
  "Apache-2.0 OR BSL-1.0",
  "Unlicense OR MIT",
  "MPL-2.0",
  "Apache-2.0 WITH LLVM-exception",
  "(MIT OR Apache-2.0) AND Unicode-3.0",
  "Zlib OR Apache-2.0 OR MIT",
  "MIT, Apache-2.0",
  "  MIT  OR  Apache-2.0  ",
  "",
  null,
  undefined,
];

describe("the two deliberate copies of extractSpdxIds tokenise identically", () => {
  it("agrees on every sampled expression shape", () => {
    for (const expression of SAMPLE) {
      expect(viewerCopy(expression), `tokenisation of ${JSON.stringify(expression)}`).toStrictEqual(
        shellCopy(expression)
      );
    }
  });

  it("agrees on every license expression the linked crate set actually declares", () => {
    // The live set, not a fixture: this is the input that decides what the shipped notice says, and
    // a shape no sample above anticipated would still be caught here the moment a dependency
    // introduces it.
    const declared = new Set(collectLinkedCrates().map((c) => c.license));
    expect(declared.size).toBeGreaterThan(0);
    for (const expression of declared) {
      expect(viewerCopy(expression), `tokenisation of ${JSON.stringify(expression)}`).toStrictEqual(
        shellCopy(expression)
      );
    }
  });
});
