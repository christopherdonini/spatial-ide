// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import type { DescribeResponse } from "../skp/types";
import { AdmitOptions, Admitted, AdmissionOutcome } from "./admitDataset";
import { AdmitPathDeps, formFamilyForCode, nextFormFamily, runAdmitPath, State } from "./AdmissionPanel";
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
  const box: { state: State } = { state: { kind: "idle" } };
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
