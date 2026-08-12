import { describe, expect, it, vi } from "vitest";

import type { Admitted } from "./admission/admitDataset";
import type { FormattedRefusal } from "./admission/formatRefusal";
import type { PickResult } from "./canvas/pick";
import { admitAndResetStaleUiState } from "./App";
import type { DescribeResponse } from "./skp/types";

// D4 (custodian forensic run, evidence: 2,012,436 = 1,961,249 + 51,187): a refusal from one
// dataset survived, verbatim, into every later step's UI because nothing ever reset `canvasRefusal`
// / `viewportRefusal` / `hover` on a fresh admission. This file asserts the fix's actual sequencing
// directly, without rendering `<App />` -- `WorkingCanvas`'s real `Deck` construction needs a WebGL
// context jsdom does not provide, and no `@testing-library/react`-equivalent harness exists in this
// package (every other `.test.ts` here tests non-React logic, per this package's own `description`
// field in `package.json`). `admitAndResetStaleUiState` is exported from `App.tsx` specifically so
// this reset sequencing -- the actual bug fix -- is testable on its own terms.
//
// The *other* half of the D4 fix, `<WorkingCanvas key={admitted.dataset} .../>` forcing a remount
// per dataset, is **not tested here or anywhere in this suite**: it is a React-reconciliation idiom
// with no meaningful assertion available short of that same DOM/WebGL harness this package does not
// carry. `e2e/regression.mjs`'s `REOPEN'` step asserts banner/refusal absence immediately after a
// reopen (before its own "Zoom to layer" click) specifically to give this half of the fix *some*
// live evidence class, but that is a claim about what `REOPEN'` checks, not a claim that it has
// passed -- read `e2e/regression.mjs`'s own run output for the current state of that step, not this
// comment.

function describeFixture(): DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: {
      identifier: "EPSG:2056",
      definition_json: null,
      source: "file",
      asserted_by: null,
      asserted_at: null,
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

function admittedFixture(dataset: string): Admitted {
  return { dataset, describe: describeFixture() };
}

function pickResultFixture(): PickResult {
  return { streamHandle: "sh_a", batchSeq: 0, id: 7n, anchor: [1, 2] };
}

function refusalFixture(): FormattedRefusal {
  return { code: "engine.crs_undeclared", message: "refused: no CRS", fields: [], remediationIsCut2: true };
}

describe("admitAndResetStaleUiState (D4: a stale refusal/hover must not survive a new admission)", () => {
  it("clears canvasRefusal, viewportRefusal, and hover, then adopts the new Admitted value", () => {
    const setCanvasRefusal = vi.fn();
    const setViewportRefusal = vi.fn();
    const setHover = vi.fn();
    const setAdmitted = vi.fn();
    const next = admittedFixture("ds_b");

    admitAndResetStaleUiState(next, { setCanvasRefusal, setViewportRefusal, setHover, setAdmitted });

    expect(setCanvasRefusal).toHaveBeenCalledTimes(1);
    expect(setCanvasRefusal).toHaveBeenCalledWith(null);
    expect(setViewportRefusal).toHaveBeenCalledTimes(1);
    expect(setViewportRefusal).toHaveBeenCalledWith(null);
    expect(setHover).toHaveBeenCalledTimes(1);
    expect(setHover).toHaveBeenCalledWith(null);
    expect(setAdmitted).toHaveBeenCalledTimes(1);
    expect(setAdmitted).toHaveBeenCalledWith(next);
  });

  it("resets even when the previous dataset actually had a live refusal and hover set", () => {
    // Simulates dataset N's UI state right before dataset N+1 is admitted -- the exact live
    // sequence this fix targets: a ceiling refusal banner and a hover readout both up from N.
    const state: { canvasRefusal: string | null; viewportRefusal: FormattedRefusal | null; hover: PickResult | null } = {
      canvasRefusal: "accepting this batch would carry 2012436 resident vertices...",
      viewportRefusal: refusalFixture(),
      hover: pickResultFixture(),
    };
    const setCanvasRefusal = vi.fn((v: string | null) => (state.canvasRefusal = v));
    const setViewportRefusal = vi.fn((v: FormattedRefusal | null) => (state.viewportRefusal = v));
    const setHover = vi.fn((v: PickResult | null) => (state.hover = v));
    const setAdmitted = vi.fn();

    admitAndResetStaleUiState(admittedFixture("ds_b"), { setCanvasRefusal, setViewportRefusal, setHover, setAdmitted });

    expect(state.canvasRefusal).toBeNull();
    expect(state.viewportRefusal).toBeNull();
    expect(state.hover).toBeNull();
  });

  it("resets happen before setAdmitted is called, so a re-render never sees the new dataset alongside stale UI state", () => {
    const order: string[] = [];
    const setCanvasRefusal = vi.fn(() => order.push("canvasRefusal"));
    const setViewportRefusal = vi.fn(() => order.push("viewportRefusal"));
    const setHover = vi.fn(() => order.push("hover"));
    const setAdmitted = vi.fn(() => order.push("admitted"));

    admitAndResetStaleUiState(admittedFixture("ds_c"), { setCanvasRefusal, setViewportRefusal, setHover, setAdmitted });

    expect(order.indexOf("admitted")).toBe(order.length - 1);
  });
});
