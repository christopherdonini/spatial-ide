// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import type { DescribeResponse } from "../skp/types";
import { AdmitOptions, Admitted, AdmissionOutcome } from "./admitDataset";
import {
  AdmitPathDeps,
  CANCELLED_REFUSAL_CODE,
  formFamilyForCode,
  isOpenInFlight,
  nextFormFamily,
  openCancelKey,
  openLivenessText,
  openLivenessTextShouldShow,
  OPEN_LIVENESS_DELAY_MS,
  requestOpenCancel,
  runAdmitPath,
  State,
} from "./AdmissionPanel";
import { FormattedRefusal } from "./formatRefusal";

// `AdmissionPanel.tsx` renders `<WorkingCanvas>`-adjacent JSX no harness in this package can
// mount (App.test.ts's own top comment); `formFamilyForCode`/`nextFormFamily` are exported
// specifically so the actual decision -- which remediation form (if any) stays reachable for a
// given refusal -- is testable on its own terms, the same pattern as `App.tsx`'s `nextScanState`.

describe("formFamilyForCode", () => {
  it("engine.crs_undeclared starts the CRS family", () => {
    expect(formFamilyForCode("engine.crs_undeclared")).toBe("crs");
  });

  it("engine.identity_unusable starts the identity family", () => {
    expect(formFamilyForCode("engine.identity_unusable")).toBe("identity");
  });

  it("every other code starts no family on its own", () => {
    expect(formFamilyForCode("engine.axis_order_unestablished")).toBeNull();
    expect(formFamilyForCode("engine.axis_order_unsupported")).toBeNull();
    expect(formFamilyForCode("engine.crs_assertion_conflict")).toBeNull();
    expect(formFamilyForCode("engine.ceiling_exceeded")).toBeNull();
  });
});

describe("nextFormFamily (NEXT-CUT.md P3 item D: 're-refusal ... form still reachable')", () => {
  it("a fresh crs_undeclared refusal opens the CRS form regardless of what came before", () => {
    expect(nextFormFamily(null, "engine.crs_undeclared")).toBe("crs");
    expect(nextFormFamily("identity", "engine.crs_undeclared")).toBe("crs");
  });

  it("a fresh identity_unusable refusal opens the identity form regardless of what came before", () => {
    expect(nextFormFamily(null, "engine.identity_unusable")).toBe("identity");
    expect(nextFormFamily("crs", "engine.identity_unusable")).toBe("identity");
  });

  it("a re-refusal with the SAME code keeps that code's own form reachable", () => {
    expect(nextFormFamily("identity", "engine.identity_unusable")).toBe("identity");
  });

  it("an axis-order re-refusal after an active CRS-assertion attempt keeps the CRS form reachable", () => {
    // ADR-015 §5: an axis-order refusal following a CRS assertion can only be a property of the
    // definition just asserted -- the operator has to be able to try a different one without the
    // panel dead-ending.
    expect(nextFormFamily("crs", "engine.axis_order_unestablished")).toBe("crs");
    expect(nextFormFamily("crs", "engine.axis_order_unsupported")).toBe("crs");
  });

  it("a FRESH axis-order refusal, with no prior remediation attempt, renders no form", () => {
    // Reached by opening a file whose FILE-DECLARED CRS itself has an axis-order problem --
    // asserting a CRS is not even applicable there (ADR-015 §4: assertion only over a file
    // declaring nothing), so there is no form to show, only `refusalGuidance`'s copy.
    expect(nextFormFamily(null, "engine.axis_order_unestablished")).toBeNull();
    expect(nextFormFamily(null, "engine.axis_order_unsupported")).toBeNull();
  });

  it("I1: engine.crs_assertion_conflict NEVER carries a form forward, no matter the prior family", () => {
    expect(nextFormFamily("crs", "engine.crs_assertion_conflict")).toBeNull();
    expect(nextFormFamily("identity", "engine.crs_assertion_conflict")).toBeNull();
    expect(nextFormFamily(null, "engine.crs_assertion_conflict")).toBeNull();
  });

  it("an unrelated code (e.g. ceiling_exceeded) clears no active family but starts none either", () => {
    expect(nextFormFamily(null, "engine.ceiling_exceeded")).toBeNull();
    expect(nextFormFamily("crs", "engine.ceiling_exceeded")).toBe("crs");
  });
});

// SF11 (reviewer gate, admission-remediation cut): `formFamilyForCode`/`nextFormFamily` above are
// pure, but they were exercised through a `setState` updater whose only real caller (`admitPath`)
// always reset `kind` to `"opening"` first -- so `priorFamily` was ALWAYS `null` in the running
// product, and the non-trivial "carry the family forward" branch above was unreachable outside
// this unit test file (that's WHY MF1/MF2 both shipped green). `runAdmitPath` is `AdmissionPanel`'s
// actual state-transition function, exported specifically so the refused -> submit -> re-refusal
// transition is drivable here without a render harness -- see its own doc comment in
// `AdmissionPanel.tsx`.

function refusal(code: string, fields: Array<[string, string]> = []): FormattedRefusal {
  return { code, message: `refused: ${code}`, fields };
}

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
      source: "declared:parcel_id",
      uniqueness: "verified-at-open-full-file",
      verified_rows: "100000",
      max_value: "99999",
      js_exact: true,
    },
    schema: [{ name: "parcel_id", arrow_type: "UInt64", nullable: false }],
    covering_bbox: true,
    row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
  };
}

function admittedFixture(): Admitted {
  return { dataset: "ds_00000000000000000000000000000000", describe: describeFixture() };
}

/** A tiny, non-React stand-in for `useState`: `state` always holds the value the most recent
 * `setState` updater produced, exactly the way the real hook would after a synchronous re-render. */
function fakeState(): { state: State; setState: AdmitPathDeps["setState"] } {
  const box: { state: State } = { state: { kind: "idle", note: null } };
  return {
    get state() {
      return box.state;
    },
    setState: (updater) => {
      box.state = updater(box.state);
    },
  };
}

function depsFor(admit: (path: string, cancelKey: string, options?: AdmitOptions) => Promise<AdmissionOutcome>) {
  const harness = fakeState();
  const onAdmitted = vi.fn();
  let cancelKeySeq = 0;
  const deps: AdmitPathDeps = {
    admit,
    setState: harness.setState,
    onAdmitted,
    makeCancelKey: () => `k${++cancelKeySeq}`,
  };
  return { harness, onAdmitted, deps };
}

describe("runAdmitPath (SF11: the actual refused -> submit -> re-refusal transition)", () => {
  it("(a) crs_undeclared -> assert -> axis_order_unestablished keeps the CRS form reachable, and " +
    "never drops through a bare 'opening' state while the resubmit is in flight -- which is what " +
    "keeps CrsAssertionForm mounted (same instance, same JSX position) so its pasted text/route " +
    "survives the re-refusal (MF1/SF7)", async () => {
    const admit = vi
      .fn()
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.crs_undeclared") })
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.axis_order_unestablished") });
    const { harness, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);
    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") {
      expect(harness.state.formFamily).toBe("crs");
      expect(harness.state.inFlight).toBe(false);
    }

    const inFlight = runAdmitPath(
      "C:/f.parquet",
      { crsAssertion: { identifier: "EPSG:2056", definition_json: "{}" } },
      deps
    );
    // Synchronously, before the mocked `admit()` promise resolves: the refused state is RETAINED
    // (only `inFlight` flips), never replaced by `{kind: "opening"}`.
    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") {
      expect(harness.state.formFamily).toBe("crs");
      expect(harness.state.inFlight).toBe(true);
    }

    await inFlight;
    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") {
      expect(harness.state.formFamily).toBe("crs"); // axis-order carries the CRS family forward
      expect(harness.state.inFlight).toBe(false);
    }
  });

  it("(b) crs_undeclared -> assert -> identity_unusable -> declare -> the final submit carries " +
    "BOTH options (MF2: accumulated remediation options, not a single-option resubmit loop)", async () => {
    const admit = vi
      .fn()
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.crs_undeclared") })
      .mockResolvedValueOnce({
        kind: "refused",
        refusal: refusal("engine.identity_unusable", [["candidate_columns", "parcel_id"]]),
      })
      .mockResolvedValueOnce({ kind: "admitted", admitted: admittedFixture() });
    const { harness, onAdmitted, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);
    expect(harness.state.kind).toBe("refused");

    // The CRS form's own submit: merges its key over whatever options produced the CURRENT refusal
    // -- exactly what `AdmissionPanel`'s `onSubmit` does with `state.options`.
    const crsAssertion = { identifier: "EPSG:2056", definition_json: "{}" };
    const priorOptions = harness.state.kind === "refused" ? harness.state.options : {};
    await runAdmitPath("C:/f.parquet", { ...priorOptions, crsAssertion }, deps);
    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") {
      expect(harness.state.formFamily).toBe("identity"); // identity_unusable wins its own family
      expect(harness.state.options).toEqual({ crsAssertion }); // carried into the NEXT refused state
    }

    // The identity form's own submit: merges its key over the CARRIED crsAssertion.
    const identity = { column: "parcel_id" };
    const nextPriorOptions = harness.state.kind === "refused" ? harness.state.options : {};
    await runAdmitPath("C:/f.parquet", { ...nextPriorOptions, identity }, deps);

    expect(admit).toHaveBeenNthCalledWith(3, "C:/f.parquet", "k3", { crsAssertion, identity });
    expect(harness.state.kind).toBe("admitted");
    expect(onAdmitted).toHaveBeenCalledTimes(1);
  });

  it("(c) I1 through the real transition: a re-refusal with engine.crs_assertion_conflict yields " +
    "no form, even with an active CRS family from the immediately prior refusal", async () => {
    const admit = vi
      .fn()
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.crs_undeclared") })
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.crs_assertion_conflict") });
    const { harness, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);
    expect(harness.state.kind === "refused" && harness.state.formFamily).toBe("crs");

    await runAdmitPath(
      "C:/f.parquet",
      { crsAssertion: { identifier: "EPSG:4326", definition_json: "{}" } },
      deps
    );
    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") expect(harness.state.formFamily).toBeNull();
  });

  it("(d) inFlight is true for the exact window a remediation submit is pending, and false again " +
    "once it resolves -- the value the forms' own `disabled` prop is set to", async () => {
    let resolveSecond: (outcome: AdmissionOutcome) => void = () => {};
    const admit = vi
      .fn()
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.identity_unusable") })
      .mockImplementationOnce(
        () =>
          new Promise<AdmissionOutcome>((resolve) => {
            resolveSecond = resolve;
          })
      );
    const { harness, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);
    expect(harness.state.kind === "refused" && harness.state.inFlight).toBe(false);

    const pending = runAdmitPath("C:/f.parquet", { identity: { column: "parcel_id" } }, deps);
    expect(harness.state.kind === "refused" && harness.state.inFlight).toBe(true);

    resolveSecond({ kind: "admitted", admitted: admittedFixture() });
    await pending;
    expect(harness.state.kind).toBe("admitted");
  });
});

// NEXT-CUT.md P4 (principle 7): liveness + a working Cancel on `open` -- the ADR-021 filter-panel
// acceptance-condition pattern (`App.tsx`'s `SCAN_LIVENESS_DELAY_MS`/`scanLivenessText`/
// `isScanInFlight`) applied to the whole-column uniqueness scan a declared identity mapping
// triggers at open.

describe("openLivenessText / openLivenessTextShouldShow (P4 item A)", () => {
  const openingPlain: State = { kind: "opening", cancelKey: "k1", options: {} };
  const openingIdentity: State = {
    kind: "opening",
    cancelKey: "k1",
    options: { identity: { column: "parcel_id" } },
  };
  const refusedInFlightIdentity: State = {
    kind: "refused",
    path: "C:/f.parquet",
    refusal: refusal("engine.crs_undeclared"),
    formFamily: "crs",
    options: {},
    inFlight: true,
    cancelKey: "k2",
    pendingOptions: { identity: { column: "parcel_id" } },
  };
  const idle: State = { kind: "idle", note: null };

  it("a plain open in flight: 'Opening…', no identity mentioned", () => {
    expect(openLivenessText(openingPlain)).toBe("Opening…");
  });

  it("an in-flight identity declaration (first submit OR a resubmit): the whole-file uniqueness " +
    "line verbatim (I11: what is being paid, named plainly)", () => {
    expect(openLivenessText(openingIdentity)).toBe("Opening — checking the declared column across the whole file…");
    expect(openLivenessText(refusedInFlightIdentity)).toBe(
      "Opening — checking the declared column across the whole file…"
    );
  });

  it("null (no line at all) when nothing is in flight", () => {
    expect(openLivenessText(idle)).toBeNull();
  });

  it("openLivenessTextShouldShow is false below OPEN_LIVENESS_DELAY_MS, true at and above it", () => {
    expect(openLivenessTextShouldShow(openingPlain, 0)).toBe(false);
    expect(openLivenessTextShouldShow(openingPlain, OPEN_LIVENESS_DELAY_MS - 1)).toBe(false);
    expect(openLivenessTextShouldShow(openingPlain, OPEN_LIVENESS_DELAY_MS)).toBe(true);
    expect(openLivenessTextShouldShow(openingPlain, OPEN_LIVENESS_DELAY_MS + 500)).toBe(true);
  });

  it("openLivenessTextShouldShow is false when not in flight, regardless of elapsed time", () => {
    expect(openLivenessTextShouldShow(idle, OPEN_LIVENESS_DELAY_MS + 1000)).toBe(false);
  });
});

describe("openCancelKey / requestOpenCancel (P4 item B)", () => {
  it("openCancelKey reads a plain open's own retained cancel_key", () => {
    expect(openCancelKey({ kind: "opening", cancelKey: "k9", options: {} })).toBe("k9");
  });

  it("openCancelKey reads an in-flight remediation resubmit's own retained cancel_key", () => {
    expect(
      openCancelKey({
        kind: "refused",
        path: "C:/f.parquet",
        refusal: refusal("engine.identity_unusable"),
        formFamily: "identity",
        options: {},
        inFlight: true,
        cancelKey: "k10",
        pendingOptions: { identity: { column: "parcel_id" } },
      })
    ).toBe("k10");
  });

  it("openCancelKey is null for idle, admitted, and a refused state that is NOT in flight", () => {
    expect(openCancelKey({ kind: "idle", note: null })).toBeNull();
    expect(openCancelKey({ kind: "admitted", admitted: admittedFixture() })).toBeNull();
    expect(
      openCancelKey({
        kind: "refused",
        path: "C:/f.parquet",
        refusal: refusal("engine.identity_unusable"),
        formFamily: "identity",
        options: {},
        inFlight: false,
        cancelKey: null,
        pendingOptions: null,
      })
    ).toBeNull();
  });

  it("requestOpenCancel calls the client with the EXACT retained cancel_key, once, nothing else", () => {
    const cancelClient = vi.fn().mockResolvedValue({ state: "requested" });
    requestOpenCancel({ kind: "opening", cancelKey: "k11", options: {} }, cancelClient);
    expect(cancelClient).toHaveBeenCalledTimes(1);
    expect(cancelClient).toHaveBeenCalledWith("k11");
  });

  it("requestOpenCancel is a no-op when nothing is in flight", () => {
    const cancelClient = vi.fn();
    requestOpenCancel({ kind: "idle", note: null }, cancelClient);
    expect(cancelClient).not.toHaveBeenCalled();
  });
});

describe("isOpenInFlight (P4 item C: the top-level Open button's own disabled condition)", () => {
  it("true while a plain open is running", () => {
    expect(isOpenInFlight({ kind: "opening", cancelKey: "k1", options: {} })).toBe(true);
  });

  it("true while a remediation resubmit is running, even though `kind` stays 'refused' (MF1) -- " +
    "this is the exact gap P3b's own off-scope note named: the button used to check only " +
    "`state.kind === 'opening'`, which a resubmit never is", () => {
    expect(
      isOpenInFlight({
        kind: "refused",
        path: "C:/f.parquet",
        refusal: refusal("engine.crs_undeclared"),
        formFamily: "crs",
        options: {},
        inFlight: true,
        cancelKey: "k1",
        pendingOptions: {},
      })
    ).toBe(true);
  });

  it("false for idle, admitted, and a refused state that is not in flight", () => {
    expect(isOpenInFlight({ kind: "idle", note: null })).toBe(false);
    expect(isOpenInFlight({ kind: "admitted", admitted: admittedFixture() })).toBe(false);
    expect(
      isOpenInFlight({
        kind: "refused",
        path: "C:/f.parquet",
        refusal: refusal("engine.crs_undeclared"),
        formFamily: "crs",
        options: {},
        inFlight: false,
        cancelKey: null,
        pendingOptions: null,
      })
    ).toBe(false);
  });
});

describe("runAdmitPath cancellation (P4, I8): a refusal carrying CANCELLED_REFUSAL_CODE " +
  "('engine.cancelled', kernel/src/skp.rs::error_of) is never product refusal UX", () => {
  it("a cancelled PLAIN open returns to idle with the plain 'Open cancelled' note -- no duration, " +
    "no 'acknowledged' (ADR-018 §1)", async () => {
    const admit = vi.fn().mockResolvedValue({ kind: "refused", refusal: refusal(CANCELLED_REFUSAL_CODE) });
    const { harness, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);

    expect(harness.state).toEqual({ kind: "idle", note: "Open cancelled" });
  });

  it("a cancelled remediation RESUBMIT returns to the SAME refused state it started from -- refusal, " +
    "formFamily, and options (the carried-options line's own source) untouched, only " +
    "inFlight/cancelKey/pendingOptions clear -- so the form and whatever the operator had typed " +
    "survive exactly like a re-refusal does (P3b's carry-forward)", async () => {
    const admit = vi
      .fn()
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.crs_undeclared") })
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal(CANCELLED_REFUSAL_CODE) });
    const { harness, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);
    expect(harness.state.kind === "refused" && harness.state.formFamily).toBe("crs");
    const priorOptions = harness.state.kind === "refused" ? harness.state.options : {};

    const crsAssertion = { identifier: "EPSG:2056", definition_json: "{}" };
    await runAdmitPath("C:/f.parquet", { ...priorOptions, crsAssertion }, deps);

    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") {
      expect(harness.state.refusal.code).toBe("engine.crs_undeclared"); // the ORIGINAL refusal, not the cancellation
      expect(harness.state.formFamily).toBe("crs");
      expect(harness.state.options).toEqual({}); // carried-options line stays accurate: unchanged by the cancel
      expect(harness.state.inFlight).toBe(false);
      expect(harness.state.cancelKey).toBeNull();
      expect(harness.state.pendingOptions).toBeNull();
    }
  });

  it("Cancel reaches the EXACT cancel_key runAdmitPath minted and retained for the in-flight " +
    "resubmit -- not a fresh key, not the plain-open key from the FIRST attempt", async () => {
    let resolveSecond: (outcome: AdmissionOutcome) => void = () => {};
    const admit = vi
      .fn()
      .mockResolvedValueOnce({ kind: "refused", refusal: refusal("engine.identity_unusable") })
      .mockImplementationOnce(
        () =>
          new Promise<AdmissionOutcome>((resolve) => {
            resolveSecond = resolve;
          })
      );
    const { harness, deps } = depsFor(admit);

    await runAdmitPath("C:/f.parquet", {}, deps);
    const pending = runAdmitPath("C:/f.parquet", { identity: { column: "parcel_id" } }, deps);

    const cancelClient = vi.fn().mockResolvedValue({ state: "requested" });
    requestOpenCancel(harness.state, cancelClient);
    expect(cancelClient).toHaveBeenCalledTimes(1);
    expect(cancelClient).toHaveBeenCalledWith(admit.mock.calls[1][1]); // the SECOND call's own cancel_key

    resolveSecond({ kind: "refused", refusal: refusal(CANCELLED_REFUSAL_CODE) });
    await pending;
    expect(harness.state.kind).toBe("refused");
    if (harness.state.kind === "refused") {
      expect(harness.state.inFlight).toBe(false);
      expect(harness.state.formFamily).toBe("identity"); // untouched by the cancellation
    }
  });
});
