// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { FieldInfo } from "../skp/types";
import { ATTRIBUTE_PROJECTION_MAX, projectionFor, projectionSummary } from "./projection";

const field = (name: string, projectable: boolean): FieldInfo => ({ name, arrow_type: "Utf8", nullable: true, projectable });
const GEOMETRY = { column: "geometry" } as never;
const IDENTITY = { source: "file:id" } as never;
const summary = (schema: FieldInfo[]) => projectionSummary({ schema, geometry: GEOMETRY, identity: IDENTITY });

describe("projectionFor (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.2 (a))", () => {
  // RECORDED MUTATION for "PA-U1": return `[]` when no column is projectable (`names.length === 0 ? [] : ...`). Expected failure: the
  // `toBeNull()` assertion below ("expected [] to be null").
  it("PA-U1: lists the projectable rows only, in schema order, capped at 32, and is null when there are none", () => {
    const schema = [field("id", false), field("zone", true), field("d32", false), field("area", true), field("geometry", false)];
    expect(projectionFor({ schema })).toEqual(["zone", "area"]);
    const many = Array.from({ length: ATTRIBUTE_PROJECTION_MAX + 3 }, (_, i) => field(`c${i}`, true));
    expect(projectionFor({ schema: many })).toEqual(many.slice(0, 32).map((f) => f.name));
    expect(projectionFor({ schema: [field("id", false), field("geometry", false)] })).toBeNull();
    expect(projectionFor({ schema: [] })).toBeNull();
  });

  it("names the columns that are not projected, without the geometry and identity columns, and the number left out over the cap", () => {
    const schema = [field("id", false), field("zone", true), field("d32", false), field("geometry", false)];
    expect(summary(schema)).toEqual({ projected: ["zone"], notProjected: ["d32"], leftOut: 0 });
    const many = Array.from({ length: ATTRIBUTE_PROJECTION_MAX + 3 }, (_, i) => field(`c${i}`, true));
    const over = summary(many);
    expect(over.projected).toHaveLength(32);
    expect(over.leftOut).toBe(3);
    expect(projectionSummary({ schema: [field("key", false), field("a", true)], geometry: GEOMETRY, identity: { source: "mapped:key" } as never }).notProjected).toEqual([]);
    expect(projectionSummary({ schema: [field("key", false)], geometry: GEOMETRY, identity: { source: "session-ordinal:file_row_number" } as never }).notProjected).toEqual(["key"]);
  });
});
