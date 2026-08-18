// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import type { DescribeResponse } from "../skp/types";
import { admitDataset } from "./admitDataset";

function describeFixture(): DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: {
      identifier: "EPSG:2056",
      definition_json: null,
      source: "file",
      asserted_by: null,
      asserted_at: null,
      definition_provenance: null,
      axis_order: "easting,northing",
      axis_normalization: "none-performed",
    },
    geometry: {
      column: "geometry",
      encoding: "geoarrow.polygon",
      coordinate_layout: "interleaved-xy",
      frame: "authoritative-project-crs",
    },
    identity: {
      source: "file:id",
      uniqueness: "verified-at-open-full-file",
      verified_rows: "100000",
      max_value: "99999",
      js_exact: true,
    },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false }],
    covering_bbox: true,
    row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
  };
}

describe("admitDataset", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("open_dataset then describe, on success: admitted with both results", async () => {
    invokeMock.mockImplementation(async (cmd: string) => {
      if (cmd === "open_dataset") return { dataset: "ds_00000000000000000000000000000000" };
      if (cmd === "describe") return describeFixture();
      throw new Error(`unexpected command ${cmd}`);
    });

    const outcome = await admitDataset("C:/data/parcels.parquet", "open-1");
    expect(outcome.kind).toBe("admitted");
    if (outcome.kind === "admitted") {
      expect(outcome.admitted.dataset).toBe("ds_00000000000000000000000000000000");
      expect(outcome.admitted.describe.crs.identifier).toBe("EPSG:2056");
    }

    // The real product-truth check: the same request shape open_dataset's own fixture declares.
    expect(invokeMock).toHaveBeenNthCalledWith(1, "open_dataset", {
      request: {
        skp: "skp/0.2",
        path: "C:/data/parcels.parquet",
        cancel_key: "open-1",
        crs_assertion: null,
        identity: null,
      },
    });
    expect(invokeMock).toHaveBeenNthCalledWith(2, "describe", {
      request: { skp: "skp/0.2", dataset: "ds_00000000000000000000000000000000" },
    });
  });

  it("a typed refusal at open_dataset never reaches describe, and is returned, not thrown", async () => {
    const skpError = {
      code: "engine.crs_undeclared",
      message: "refused: the file declares no CRS and none was asserted by the caller",
      fields: { detail: "no crs key" },
    };
    invokeMock.mockImplementation(async (cmd: string) => {
      if (cmd === "open_dataset") throw skpError;
      throw new Error(`describe must not be called after a refused open (command was ${cmd})`);
    });

    const outcome = await admitDataset("C:/data/no-crs.parquet", "open-2");
    expect(outcome.kind).toBe("refused");
    if (outcome.kind === "refused") {
      expect(outcome.refusal.code).toBe("engine.crs_undeclared");
      expect(outcome.refusal.message).toBe(skpError.message);
    }
    // Exactly one open_dataset call, no describe call. `describe` throwing above would fail the
    // test via the mock's own guard clause; this asserts it positively as well.
    const commandsCalled = invokeMock.mock.calls.map(([cmd]) => cmd);
    expect(commandsCalled.filter((c) => c === "open_dataset")).toHaveLength(1);
    expect(commandsCalled).not.toContain("describe");
  });

  it("an unexpected (non-SkpError) failure is rethrown, not swallowed as a refusal", async () => {
    invokeMock.mockImplementation(async () => {
      throw new TypeError("something the SKP contract never declared");
    });
    await expect(admitDataset("C:/data/parcels.parquet", "open-3")).rejects.toThrow(TypeError);
  });

  // NEXT-CUT.md P3 item H: "form submit -> admitDataset called with exactly the right params" --
  // both remediation forms funnel into `admitDataset`'s own `options` parameter, so proving THIS
  // function forwards it correctly onto the wire is what proves a form submit reaches the SAME
  // admission path a plain retry uses, not a parallel one.
  it("a crsAssertion option is forwarded to open_dataset as crs_assertion, identity stays null", async () => {
    invokeMock.mockImplementation(async (cmd: string) => {
      if (cmd === "open_dataset") return { dataset: "ds_1" };
      if (cmd === "describe") return describeFixture();
      throw new Error(`unexpected command ${cmd}`);
    });

    await admitDataset("C:/data/no-crs.parquet", "open-crs", {
      crsAssertion: { identifier: "EPSG:2056", definition_json: "{\"type\":\"ProjectedCRS\"}" },
    });

    expect(invokeMock).toHaveBeenNthCalledWith(1, "open_dataset", {
      request: {
        skp: "skp/0.2",
        path: "C:/data/no-crs.parquet",
        cancel_key: "open-crs",
        crs_assertion: { identifier: "EPSG:2056", definition_json: "{\"type\":\"ProjectedCRS\"}" },
        identity: null,
      },
    });
  });

  it("an identity option is forwarded to open_dataset as identity, crs_assertion stays null", async () => {
    invokeMock.mockImplementation(async (cmd: string) => {
      if (cmd === "open_dataset") return { dataset: "ds_1" };
      if (cmd === "describe") return describeFixture();
      throw new Error(`unexpected command ${cmd}`);
    });

    await admitDataset("C:/data/missing-identity.parquet", "open-identity", {
      identity: { column: "parcel_key" },
    });

    expect(invokeMock).toHaveBeenNthCalledWith(1, "open_dataset", {
      request: {
        skp: "skp/0.2",
        path: "C:/data/missing-identity.parquet",
        cancel_key: "open-identity",
        crs_assertion: null,
        identity: { column: "parcel_key" },
      },
    });
  });
});
