// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { DescribeResponse } from "../skp/types";
import DescribeSummary from "./DescribeSummary";

/**
 * SH-9 (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` section 4; ADR-034 Decision 3's rider): the
 * describe summary shows the engine's encoding and the file's declaration as two rows, each labelled
 * as what it is. An empty declared list `[]` and an absent key `null` render as two different texts,
 * and the Polygon Geometry row still contains `geometry (geoarrow.polygon)` (the shell E2E reads it).
 *
 * From the shared wire fixture, the bytes the Rust host reads, with only `declared_types` and
 * `encoding` varied in place.
 *
 * RECORDED MUTATION: render `[]` and `null` alike in `declaredTypesLine` (return the empty-list text
 * for `null` too). The distinctness assertion then fails by name.
 *
 * Observed over `ac538440` on the uncommitted tree of the shell commit: `an empty list and an absent key render distinctly, each as a labelled placeholder`
 * FAILED by name with the mutation applied, then reverted.
 */
const FIXTURE = path.resolve(__dirname, "../../../../protocol/skp/tests/data/v0-describe-response.json");

function describeWith(encoding: string, declared: string[] | null): DescribeResponse {
  const base = JSON.parse(fs.readFileSync(FIXTURE, "utf-8")) as DescribeResponse;
  return { ...base, geometry: { ...base.geometry, encoding, declared_types: declared } };
}

/** The text a reader sees, row by row: each `<dt>` with the `<dd>` that follows it. */
function rows(describe: DescribeResponse): Map<string, string> {
  const html = renderToStaticMarkup(<DescribeSummary describe={describe} />);
  const out = new Map<string, string>();
  for (const m of html.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/gs)) {
    out.set(m[1].replace(/<[^>]*>/g, ""), m[2].replace(/<[^>]*>/g, ""));
  }
  return out;
}

const ENCODING_LABEL = "[P6 placeholder] Geometry (encoding chosen by the engine)";
const DECLARED_LABEL = "[P6 placeholder] Geometry types declared by the file";

describe("DescribeSummary: the engine's encoding and the file's declaration, each labelled (SH-9)", () => {
  it("the Polygon Geometry row still contains `geometry (geoarrow.polygon)`, and the declaration is its own row", () => {
    const r = rows(describeWith("geoarrow.polygon", ["Polygon"]));
    expect(r.get(ENCODING_LABEL)).toBe("geometry (geoarrow.polygon)");
    expect(r.get(DECLARED_LABEL)).toBe("Polygon");
  });

  it("a multipolygon encoding over a mixed declaration shows both, the declaration as declared", () => {
    const r = rows(describeWith("geoarrow.multipolygon", ["MultiPolygon", "polygon"]));
    expect(r.get(ENCODING_LABEL)).toBe("geometry (geoarrow.multipolygon)");
    expect(r.get(DECLARED_LABEL)).toBe("MultiPolygon, polygon"); // order and case as declared
  });

  it("an empty list and an absent key render distinctly, each as a labelled placeholder", () => {
    const empty = rows(describeWith("geoarrow.multipolygon", [])).get(DECLARED_LABEL)!;
    const absent = rows(describeWith("geoarrow.multipolygon", null)).get(DECLARED_LABEL)!;
    expect(empty).toMatch(/^\[P6 placeholder\]/);
    expect(absent).toMatch(/^\[P6 placeholder\]/);
    expect(empty).not.toBe(absent);
  });

  it("no row presents the encoding as the file's type: the plain label `Geometry` is gone", () => {
    const labels = [...rows(describeWith("geoarrow.multipolygon", [])).keys()];
    expect(labels).not.toContain("Geometry");
    expect(labels).toContain(ENCODING_LABEL);
    expect(labels).toContain(DECLARED_LABEL);
  });
});
