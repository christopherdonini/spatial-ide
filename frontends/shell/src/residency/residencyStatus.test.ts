// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { fillActivity, nextResidencyStatus, residencyStatusText, ResidencyStatus } from "./residencyStatus";

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
    const stalled = residencyStatusText({ kind: "candidate-over-budget", residentFeatureCount: 1, viewportTotal: null, stalled: true });
    const relinquished = residencyStatusText({ kind: "candidate-relinquished", residentFeatureCount: 1 });
    const relinquishedUntiledRunning = residencyStatusText({
      kind: "candidate-relinquished",
      residentFeatureCount: 1,
      untiledStreamStillRunning: true,
    });
    for (const text of [withinBudget, overHonest, overDegraded, stalled, relinquished, relinquishedUntiledRunning]) {
      expect(text).not.toMatch(/\b\d+\s?(ms|s|sec|secs|second|seconds|min|mins|minute|minutes)\b/i);
      expect(text).not.toMatch(/%|\beta\b/i);
    }
  });

  // Item A (residency-debt cut 1b, decisions 32a/33b): the two new DRAFT strings this piece adds --
  // asserted verbatim, same discipline as every other string in this describe block.
  describe("Item A's two new strings (drafts for the human's 24(b) sight)", () => {
    it("candidate-over-budget, NOT stalled: byte-identical to the pre-existing wording -- the ordinary over-budget sentence is unamended", () => {
      const status: ResidencyStatus = { kind: "candidate-over-budget", residentFeatureCount: 900, viewportTotal: null };
      expect(residencyStatusText(status)).toBe(
        "Showing 900 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail."
      );
    });

    it("candidate-over-budget, stalled: the ordinary sentence PLUS a named freeze, never a duration", () => {
      const status: ResidencyStatus = { kind: "candidate-over-budget", residentFeatureCount: 900, viewportTotal: null, stalled: true };
      expect(residencyStatusText(status)).toBe(
        "Showing 900 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail. Filling is paused until the next pan or zoom."
      );
    });

    it("candidate-relinquished: states the partiality, NEVER 'complete' (32a's own rider)", () => {
      const status: ResidencyStatus = { kind: "candidate-relinquished", residentFeatureCount: 500 };
      const text = residencyStatusText(status);
      expect(text).toBe("Filling stopped — showing 500 features already loaded; the rest of this view was not fetched.");
      expect(text.toLowerCase()).not.toContain("complete");
      expect(text.toLowerCase()).not.toContain("all ");
    });

    // M1 (reviewer gate, residency-debt cut 1b): the third draft string -- the honest alternative
    // when the untiled first-look/reissue stream is still running at relinquish time, when the
    // ordinary "Filling stopped" wording above would be false (DECISIONS-PENDING.md entry 35).
    it("candidate-relinquished, untiledStreamStillRunning: true: never claims 'Filling stopped' -- states the truth that Cancel does not reach that stream", () => {
      const status: ResidencyStatus = {
        kind: "candidate-relinquished",
        residentFeatureCount: 500,
        untiledStreamStillRunning: true,
      };
      const text = residencyStatusText(status);
      expect(text).toBe(
        "Tile filling stopped — showing 500 features already loaded; the initial data load for this view is still running and Cancel does not stop it."
      );
      expect(text.toLowerCase()).not.toContain("complete");
      // Never the plain "Filling stopped" claim -- that would be false while the untiled stream
      // keeps delivering.
      expect(text).not.toBe("Filling stopped — showing 500 features already loaded; the rest of this view was not fetched.");
    });
  });
});

// Item A (residency-debt cut 1b), BS3: the pure stall/filling predicate, unit-tested directly against
// its own four declared inputs -- the pre-committed test case 3 (RESIDENCY-DEBT-1B.md), no manager/
// canvas/timer involved anywhere in this describe block.
describe("fillActivity (Item A, BS3: a pure function of overBudget/queuedCount/inFlightCount/hasHeadroom)", () => {
  it("reads stalled exactly under queuedCount > 0 && overBudget && !hasHeadroom", () => {
    expect(fillActivity({ queuedCount: 1, overBudget: true, hasHeadroom: false, inFlightCount: 0 })).toBe("stalled");
    expect(fillActivity({ queuedCount: 5, overBudget: true, hasHeadroom: false, inFlightCount: 2 })).toBe("stalled");
  });

  it("hasHeadroom true breaks the stall -- reads filling instead (the over-budget drain-stop exception can still make progress)", () => {
    expect(fillActivity({ queuedCount: 1, overBudget: true, hasHeadroom: true, inFlightCount: 1 })).toBe("filling");
  });

  it("queuedCount === 0 breaks the stall -- reads filling while inFlight > 0, idle otherwise", () => {
    expect(fillActivity({ queuedCount: 0, overBudget: true, hasHeadroom: false, inFlightCount: 1 })).toBe("filling");
    expect(fillActivity({ queuedCount: 0, overBudget: true, hasHeadroom: false, inFlightCount: 0 })).toBe("idle");
  });

  it("overBudget === false breaks the stall -- reads filling while inFlight > 0, regardless of queuedCount/hasHeadroom", () => {
    expect(fillActivity({ queuedCount: 3, overBudget: false, hasHeadroom: false, inFlightCount: 1 })).toBe("filling");
  });

  it("filling otherwise, exactly while inFlightCount > 0", () => {
    expect(fillActivity({ queuedCount: 0, overBudget: false, hasHeadroom: true, inFlightCount: 4 })).toBe("filling");
  });

  it("idle when neither condition holds", () => {
    expect(fillActivity({ queuedCount: 0, overBudget: false, hasHeadroom: true, inFlightCount: 0 })).toBe("idle");
  });
});

describe("nextResidencyStatus: candidate-relinquished (Item A, decisions 32a/33b)", () => {
  it("sets the relinquished status, carrying residentFeatureCount through", () => {
    expect(nextResidencyStatus({ kind: "candidate-relinquished", residentFeatureCount: 42 })).toEqual<ResidencyStatus>({
      kind: "candidate-relinquished",
      residentFeatureCount: 42,
    });
  });

  // M1 (reviewer gate, residency-debt cut 1b): the event carries `untiledStreamStillRunning` through
  // unchanged, the same "carried through, never re-derived" contract every other field on this event
  // already gets (e.g. `candidate-over-budget`'s own `viewportTotal`).
  it("carries untiledStreamStillRunning through when present, and never invents it when absent", () => {
    expect(
      nextResidencyStatus({ kind: "candidate-relinquished", residentFeatureCount: 42, untiledStreamStillRunning: true })
    ).toEqual<ResidencyStatus>({ kind: "candidate-relinquished", residentFeatureCount: 42, untiledStreamStillRunning: true });
    expect(nextResidencyStatus({ kind: "candidate-relinquished", residentFeatureCount: 42 })).toEqual<ResidencyStatus>({
      kind: "candidate-relinquished",
      residentFeatureCount: 42,
    });
  });

  it("dataset-changed/query-issued/delivery-complete still clear it -- the same shared machinery every other status already goes through", () => {
    expect(nextResidencyStatus({ kind: "candidate-relinquished", residentFeatureCount: 1 })).not.toBeNull();
    expect(nextResidencyStatus({ kind: "dataset-changed" })).toBeNull();
    expect(nextResidencyStatus({ kind: "query-issued" })).toBeNull();
    expect(nextResidencyStatus({ kind: "delivery-complete" })).toBeNull();
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
