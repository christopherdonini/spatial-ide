// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { CrsInfo, IdentityInfo, SourceChecks, SourceCoverage } from "../skp/types";
import {
  checksOnlyStatusLine,
  crsProvenanceLine,
  crsSummaryLine,
  degradedChecksLine,
  displayConventionLine,
  identitySummaryLine,
  sessionStatementLine,
} from "./describeSummaryText";

function fileCrs(overrides: Partial<CrsInfo> = {}): CrsInfo {
  return {
    identifier: "EPSG:2056",
    definition_json: null,
    source: "file",
    asserted_by: null,
    asserted_at: null,
    definition_provenance: null,
    axis_order: "easting,northing",
    axis_normalization: "none-performed",
    // skp/0.3 (Brief A boundary 9): additive, so this builder keeps the shape the wire has.
    provenance: "crs:declared",
    axis_provenance: "axis:declared",
    display_convention: null,
    unit: "metre",
    ...overrides,
  };
}

describe("crsSummaryLine (I3: caller-asserted renders distinguishably from file-declared)", () => {
  it("a file-declared CRS renders exactly as before this cut -- identifier, source, axis order, no attribution", () => {
    const line = crsSummaryLine(fileCrs());
    expect(line).toBe("EPSG:2056 — file, axis order easting,northing");
    expect(line).not.toMatch(/asserted/i);
  });

  it("a caller-asserted CRS (catalog provenance) names identifier, by, at, and the provenance verbatim", () => {
    const line = crsSummaryLine(
      fileCrs({
        source: "caller_asserted",
        asserted_by: "chris",
        asserted_at: "2026-08-18T12:00:00Z",
        definition_provenance: "catalog:epsg-2056@sha256:abc123abc123",
      })
    );
    expect(line).toContain("EPSG:2056");
    expect(line).toContain("asserted by chris at 2026-08-18T12:00:00Z");
    expect(line).toContain("catalog:epsg-2056@sha256:abc123abc123");
  });

  it("a caller-asserted CRS with a pasted definition renders the literal word 'pasted', not a summary", () => {
    const line = crsSummaryLine(
      fileCrs({
        source: "caller_asserted",
        asserted_by: "chris",
        asserted_at: "2026-08-18T12:00:00Z",
        definition_provenance: "pasted",
      })
    );
    expect(line).toContain("pasted");
  });
});

describe("identitySummaryLine (I6: the payload's own uniqueness fact, verbatim, never the bare word 'unique')", () => {
  it("the native file:id path", () => {
    const identity: IdentityInfo = {
      source: "file:id",
      uniqueness: "verified-at-open-full-file",
      verified_rows: "100000",
      max_value: "99999",
      js_exact: true,
      class: "native",
      session_statement: null,
    };
    expect(identitySummaryLine(identity)).toBe("file:id — verified-at-open-full-file");
  });

  it("a mapped identity declaration renders mapped:<column> with its own recorded uniqueness statement", () => {
    const identity: IdentityInfo = {
      source: "mapped:parcel_key",
      uniqueness: "verified-at-open-full-file",
      verified_rows: "20",
      max_value: null,
      js_exact: null,
      class: "mapped",
      session_statement: null,
    };
    const line = identitySummaryLine(identity);
    expect(line).toBe("mapped:parcel_key — verified-at-open-full-file");
    expect(line).not.toBe("mapped:parcel_key — unique");
  });
});

describe("crsProvenanceLine (round 16, item 1: crs.provenance and crs.axis_provenance rendered verbatim)", () => {
  // RECORDED MUTATION for "crsProvenanceLine renders crs.provenance and crs.axis_provenance verbatim, comma-separated":
  // swap the two fields (`return `${crs.axis_provenance}, ${crs.provenance}`;`). Expected failure:
  // the exact-string assertion below no longer matches ("axis:declared, crs:declared" instead of
  // "crs:declared, axis:declared").
  it("crsProvenanceLine renders crs.provenance and crs.axis_provenance verbatim, comma-separated", () => {
    const line = crsProvenanceLine(fileCrs({ provenance: "crs:declared", axis_provenance: "axis:declared" }));
    expect(line).toBe("crs:declared, axis:declared");
  });
});

describe("sessionStatementLine (round 16, item 1: identity.session_statement rendered verbatim, only when non-null)", () => {
  // sessionStatementLine is a pass-through (describeSummaryText.ts:56-58); this unit test drives it
  // from a plainly-marked placeholder, not the wire's sentence. The real fixture's own bytes --
  // the shared fixture `protocol/skp/tests/fixtures.rs:120` also reads -- reach this function
  // unchanged, proven by the seam test named at fixtures.test.ts:174 ("describe response for a
  // session-ordinal dataset..."), which loads v0-describe-response-session-ordinal.json. The
  // fixture's transcription of `SESSION_IDENTITY_STATEMENT` (engine/src/identity.rs:145) is not
  // asserted byte-for-byte by any test (only a substring, fixtures.test.ts:186, and is_some(),
  // protocol/skp/tests/fixtures.rs:129) -- a pre-existing fixture-regime gap this piece did not create.
  //
  // RECORDED MUTATION for "sessionStatementLine renders identity.session_statement verbatim, and null when the identity is not session-ordinal":
  // replace the returned value with a paraphrase (`return identity.session_statement === null ? null : "a session-ordinal identity";`).
  // Expected failure: the first assertion below no longer matches the placeholder string.
  it("sessionStatementLine renders identity.session_statement verbatim, and null when the identity is not session-ordinal", () => {
    const sessionOrdinal: IdentityInfo = {
      source: "session-ordinal:file_row_number",
      uniqueness: "by-construction-within-generation",
      verified_rows: null,
      max_value: null,
      js_exact: null,
      class: "session-ordinal",
      session_statement: "<session statement placeholder>",
    };
    expect(sessionStatementLine(sessionOrdinal)).toBe("<session statement placeholder>");

    const native: IdentityInfo = {
      source: "file:id",
      uniqueness: "verified-at-open-full-file",
      verified_rows: "100000",
      max_value: "99999",
      js_exact: true,
      class: "native",
      session_statement: null,
    };
    expect(sessionStatementLine(native)).toBeNull();
  });
});

describe("displayConventionLine (DECISIONS-PENDING.md RULED 2026-09-23 (late), entry 119 item (5): crs.display_convention rendered verbatim, only when non-null)", () => {
  // displayConventionLine is a pass-through (describeSummaryText.ts:67-69); this unit test drives it
  // from a plainly-marked placeholder, not the wire's sentence (the same discipline
  // sessionStatementLine's test above uses, and for the same reason -- the real sentence is never
  // retyped as a TypeScript literal, types.ts:93-99). The real fixture's own bytes reach this
  // function unchanged, proven by the seam assertion in fixtures.test.ts.
  //
  // RECORDED MUTATION for "displayConventionLine renders crs.display_convention verbatim, and null when the dataset has none":
  // replace the returned value with a fixed paraphrase (`return crs.display_convention === null ? null : "a display convention applies";`).
  // Observed failure (applied and reverted, worker run): "AssertionError: expected 'a display
  // convention applies' to be '<display convention placeholder>' // Object.is equality" at this
  // file's `expect(displayConventionLine(degrees)).toBe("<display convention placeholder>")` line.
  it("displayConventionLine renders crs.display_convention verbatim, and null when the dataset has none", () => {
    const degrees = fileCrs({ display_convention: "<display convention placeholder>" });
    expect(displayConventionLine(degrees)).toBe("<display convention placeholder>");

    const projected = fileCrs({ display_convention: null });
    expect(displayConventionLine(projected)).toBeNull();
  });
});

describe("checksOnlyStatusLine (engine/SOURCE-WATCHER-PREREGISTRATION.md §4, SH1)", () => {
  // RECORDED MUTATION for SH1: render the row unconditionally (drop the `state !== "checks-only"`
  // guard, i.e. `return` the line whatever `coverage.state` is). Expected failure: the second
  // assertion below (`"watching"` renders no row) fails -- it would receive a non-null string.
  it("renders only for checks-only, with its reason -- watching renders no row", () => {
    const checksOnly: SourceCoverage = { state: "checks-only", reason: "<checks-only reason placeholder>" };
    expect(checksOnlyStatusLine(checksOnly)).toContain("<checks-only reason placeholder>");

    const watching: SourceCoverage = { state: "watching", reason: null };
    expect(checksOnlyStatusLine(watching)).toBeNull();
  });
});

describe("degradedChecksLine (engine/SOURCE-WATCHER-PREREGISTRATION.md §4, SH2)", () => {
  // RECORDED MUTATION for SH2: drop the components from the rendered line (e.g. render a bare
  // "degraded" with no component list). Expected failure: the first assertion below fails -- the
  // rendered line no longer contains "mtime".
  it("lists components only for degraded -- full renders no row", () => {
    const degraded: SourceChecks = { state: "degraded", components: ["mtime"] };
    expect(degradedChecksLine(degraded)).toContain("mtime");

    const full: SourceChecks = { state: "full", components: [] };
    expect(degradedChecksLine(full)).toBeNull();
  });
});
