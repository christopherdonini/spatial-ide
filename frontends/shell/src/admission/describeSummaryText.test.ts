// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { CrsInfo, IdentityInfo } from "../skp/types";
import { crsProvenanceLine, crsSummaryLine, identitySummaryLine, sessionStatementLine } from "./describeSummaryText";

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
  // from a plainly-marked placeholder, not the wire's sentence. The wire's actual bytes
  // (SESSION_IDENTITY_STATEMENT, DECISIONS-PENDING.md round 16, item 1) are proven reaching this
  // same function from the real fixture in the seam assertion
  // `expect(sessionStatementLine(res.identity)).toBe(res.identity.session_statement)` added to
  // fixtures.test.ts's "describe response for a session-ordinal dataset..." test, which loads
  // v0-describe-response-session-ordinal.json.
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
