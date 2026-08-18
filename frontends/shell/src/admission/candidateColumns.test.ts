// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { splitCandidateColumns } from "./candidateColumns";

describe("splitCandidateColumns", () => {
  it("splits a comma-joined field back into a schema-order list", () => {
    expect(splitCandidateColumns("parcel_key,tile_id,osm_id")).toEqual(["parcel_key", "tile_id", "osm_id"]);
  });

  it("a single candidate yields a one-element list, not preselected by this function", () => {
    expect(splitCandidateColumns("parcel_key")).toEqual(["parcel_key"]);
  });

  it("an empty string (no 64-bit integer column at all) yields an empty list, not [\"\"]", () => {
    expect(splitCandidateColumns("")).toEqual([]);
  });

  it("undefined (the field absent) yields an empty list", () => {
    expect(splitCandidateColumns(undefined)).toEqual([]);
  });
});
