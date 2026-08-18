// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ClassBRow } from "./surfaceRegistry";
import { classBRows, classCRows } from "./surfaceRegistry";

/**
 * NEXT-CUT.md P2, part C: tests beyond the completeness scan. `surfaceCompleteness.test.ts`
 * proves every real `invoke()` call site is accounted for; this file proves the registry's own
 * *shape* and *content* honor I6 (no class-B/C entry may carry a copy affordance, a JSON block,
 * or the string "SKP") -- one half at compile time (the type has no field an argument object
 * could occupy), one half at run time (a cheap regex guard over the actual row text).
 */

describe("SurfaceRow types structurally reject an argument-object field (I6, compile-time)", () => {
  // Asserted at TYPECHECK time (`npm run typecheck`/`tsc`), not at `vitest` runtime: the
  // `@ts-expect-error` comment below is the actual assertion -- if the annotated line ever stops
  // erroring, tsc itself fails the build; `vitest` running this `it` to completion proves only
  // that the surrounding runtime code (the `void withArgs` statement) does not throw, not that
  // the type-level fence held.
  it("a class-B row with an extra args field fails tsc's excess-property check", () => {
    const withArgs: ClassBRow = {
      class: "B",
      command: "binding_publish_prepare",
      effect: "opens the native OS destination picker host-side",
      citation: "host-local, not part of the API (SKP-V0 §4; ADR-024)",
      // @ts-expect-error -- ClassBRow has no field an argument object could occupy
      // (command/effect/citation are all `string`); adding one here must fail tsc, not merely a
      // lint at review time.
      args: { datasetHandle: "ds_1", styleDoc: "{}" },
    };
    void withArgs;
  });

  // Same typecheck-time caveat as the `it` above: the `@ts-expect-error` line is the assertion.
  it("a class-B row's citation field is typed string -- an object value fails tsc", () => {
    const objectCitation: ClassBRow = {
      class: "B",
      command: "binding_publish_prepare",
      effect: "opens the native OS destination picker host-side",
      // @ts-expect-error -- `citation` is `string`; a caller may not smuggle an argument object
      // in through an existing field either.
      citation: { note: "not a string" },
    };
    void objectCitation;
  });

  it("(sanity) a well-formed class-B row compiles with no error", () => {
    const ok: ClassBRow = {
      class: "B",
      command: "binding_publish_prepare",
      effect: "opens the native OS destination picker host-side",
      citation: "host-local, not part of the API (SKP-V0 §4; ADR-024)",
    };
    expect(ok.class).toBe("B");
  });
});

describe("every class-B citation names the fence (I6 / ADR-024)", () => {
  it("contains \"ADR-024\" or \"SKP-V0\"", () => {
    for (const row of classBRows()) {
      const namesTheFence = row.citation.includes("ADR-024") || row.citation.includes("SKP-V0");
      expect(namesTheFence, `${row.command}'s citation must name ADR-024 or SKP-V0: "${row.citation}"`).toBe(true);
    }
  });
});

describe("no B/C registry string contains a JSON brace block (cheap regex guard backing I6)", () => {
  // I6 bans a copy affordance, a JSON block, and the string "SKP" on any class-B/C *rendered*
  // entry -- the P4 lint's job over the final displayed text. The registry's own `citation`
  // field is explicitly asked (NEXT-CUT.md P2's brief) to NAME "SKP-V0" as the spec section that
  // EXCLUDES the command from the SKP catalog, so a literal "no substring SKP anywhere in the
  // registry" guard would contradict that requirement; this guard covers only the JSON-block half
  // of I6, which the registry's own prose text can and must avoid regardless.
  const braceBlock = /\{[^{}]*\}/;

  it("no field on any B/C row contains a JSON brace block", () => {
    for (const row of [...classBRows(), ...classCRows()]) {
      for (const [field, value] of Object.entries(row)) {
        if (typeof value !== "string") continue;
        expect(braceBlock.test(value), `${field} on ${JSON.stringify(row)} looks like a JSON block`).toBe(false);
      }
    }
  });
});
