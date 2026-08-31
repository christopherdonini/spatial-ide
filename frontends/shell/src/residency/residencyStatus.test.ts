// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { nextResidencyStatus, residencyStatusText, ResidencyStatus } from "./residencyStatus";

// Viewport-residency cut P4 (decisions 24(a)/(b), resolved by the human): the over-budget render
// contract's UI. `residencyStatusText`'s own strings are asserted VERBATIM below -- these are the
// exact strings the human reads at the PR (drafted in the piece, shipped here unamended).
describe("residencyStatusText (decisions 24(a)/(b): the declared partial-view status wording)", () => {
  it("baseline-ceiling: byte-identical to the pre-P4 wording -- 'Baseline arm's wording is UNTOUCHED'", () => {
    const status: ResidencyStatus = { kind: "baseline-ceiling", residentFeatureCount: 97_500, datasetRowCount: "100000" };
    expect(residencyStatusText(status)).toBe(
      "97500 of 100000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)"
    );
  });

  it("candidate, within budget: 'Showing all {N} features in view'", () => {
    const status: ResidencyStatus = { kind: "candidate-within-budget", residentFeatureCount: 42 };
    expect(residencyStatusText(status)).toBe("Showing all 42 features in view");
  });

  it("candidate, over budget, an honest viewport total known: the ~{M} wording", () => {
    const status: ResidencyStatus = { kind: "candidate-over-budget", residentFeatureCount: 900, viewportTotal: 1_500 };
    expect(residencyStatusText(status)).toBe(
      "Showing 900 of ~1500 features — areas farthest from view are not drawn, to stay within the render budget. Pan or zoom in to see them."
    );
  });

  it("candidate, over budget, NO honest total known (the ordinary case -- viewportTotal: null): the degraded wording, never a guessed figure", () => {
    const status: ResidencyStatus = { kind: "candidate-over-budget", residentFeatureCount: 900, viewportTotal: null };
    expect(residencyStatusText(status)).toBe(
      "Showing 900 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail."
    );
  });

  // P4 item 2/binding note 4's own discipline (`App.tsx`'s `scanLivenessText`), extended to the
  // candidate-arm status strings this piece adds: no duration/rate/ETA word or figure anywhere in
  // them (docs/08: no invented numbers; ADR-018's cancellation vocabulary discipline applies the same
  // "never imply a timing claim you cannot measure" reasoning here). No mechanized sweep in this
  // package currently covers `.residency-status` copy specifically (`consoleLanguage.test.ts` and its
  // siblings scan console/GUI-action strings, not this component's own render output) -- this is a
  // direct assertion over the exact strings instead.
  it("no duration/rate/ETA word or figure in any candidate-arm string", () => {
    const withinBudget = residencyStatusText({ kind: "candidate-within-budget", residentFeatureCount: 1 });
    const overHonest = residencyStatusText({ kind: "candidate-over-budget", residentFeatureCount: 1, viewportTotal: 2 });
    const overDegraded = residencyStatusText({ kind: "candidate-over-budget", residentFeatureCount: 1, viewportTotal: null });
    for (const text of [withinBudget, overHonest, overDegraded]) {
      expect(text).not.toMatch(/\b\d+\s?(ms|s|sec|secs|second|seconds|min|mins|minute|minutes)\b/i);
      expect(text).not.toMatch(/%|\beta\b/i);
    }
  });
});

describe("nextResidencyStatus (candidate-arm transitions, viewport-residency cut P4)", () => {
  it("candidate-within-budget sets the within-budget status", () => {
    expect(nextResidencyStatus({ kind: "candidate-within-budget", residentFeatureCount: 10 })).toEqual<ResidencyStatus>({
      kind: "candidate-within-budget",
      residentFeatureCount: 10,
    });
  });

  it("candidate-over-budget sets the over-budget status, carrying viewportTotal through unchanged", () => {
    expect(
      nextResidencyStatus({ kind: "candidate-over-budget", residentFeatureCount: 10, viewportTotal: null })
    ).toEqual<ResidencyStatus>({ kind: "candidate-over-budget", residentFeatureCount: 10, viewportTotal: null });
  });

  // D: "persists across pans while over-budget" -- modelled as two successive over-budget events
  // (what `candidateArmSession.ts`'s own `emitResidencyStatus` sends on each pan while the condition
  // still holds): the status stays non-null and reflects the LATEST counts, never silently nulled
  // between them the way a "clears" event would.
  it("persists (non-null, refreshed) across repeated over-budget events -- e.g. successive pans while still over budget", () => {
    const first = nextResidencyStatus({ kind: "candidate-over-budget", residentFeatureCount: 500, viewportTotal: null });
    expect(first).not.toBeNull();
    const second = nextResidencyStatus({ kind: "candidate-over-budget", residentFeatureCount: 620, viewportTotal: null });
    expect(second).not.toBeNull();
    expect(second).toEqual<ResidencyStatus>({ kind: "candidate-over-budget", residentFeatureCount: 620, viewportTotal: null });
  });

  // The shared clearing transitions (rider 1's own "dataset change" / the query-issued refinement) --
  // arm-aware reuse: the SAME three event kinds that clear a baseline ceiling status also clear a
  // candidate-arm one, with no separate candidate-only clearing event needed.
  it("dataset-changed clears a candidate over-budget status", () => {
    const withStatus = nextResidencyStatus({ kind: "candidate-over-budget", residentFeatureCount: 500, viewportTotal: null });
    expect(withStatus).not.toBeNull();
    expect(nextResidencyStatus({ kind: "dataset-changed" })).toBeNull();
  });

  it("query-issued clears a candidate within-budget status", () => {
    const withStatus = nextResidencyStatus({ kind: "candidate-within-budget", residentFeatureCount: 500 });
    expect(withStatus).not.toBeNull();
    expect(nextResidencyStatus({ kind: "query-issued" })).toBeNull();
  });

  it("query-issued clears a candidate over-budget status", () => {
    const withStatus = nextResidencyStatus({ kind: "candidate-over-budget", residentFeatureCount: 500, viewportTotal: null });
    expect(withStatus).not.toBeNull();
    expect(nextResidencyStatus({ kind: "query-issued" })).toBeNull();
  });

  it("delivery-complete (baseline's own event) also clears a candidate status -- shared, arm-agnostic machinery", () => {
    const withStatus = nextResidencyStatus({ kind: "candidate-within-budget", residentFeatureCount: 1 });
    expect(withStatus).not.toBeNull();
    expect(nextResidencyStatus({ kind: "delivery-complete" })).toBeNull();
  });
});
