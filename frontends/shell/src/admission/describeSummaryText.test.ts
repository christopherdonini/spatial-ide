// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { CrsInfo, IdentityInfo } from "../skp/types";
import { crsSummaryLine, identitySummaryLine } from "./describeSummaryText";

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
    };
    const line = identitySummaryLine(identity);
    expect(line).toBe("mapped:parcel_key — verified-at-open-full-file");
    expect(line).not.toBe("mapped:parcel_key — unique");
  });
});
