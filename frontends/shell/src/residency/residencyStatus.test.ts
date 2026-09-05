// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { fillActivity, nextResidencyStatus, residencyStatusText, settledState, ResidencyStatus, SettledStateInputs } from "./residencyStatus";

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
    const settledPartial = residencyStatusText({ kind: "candidate-over-budget", residentFeatureCount: 1, viewportTotal: null, settled: "partial" });
    const relinquished = residencyStatusText({ kind: "candidate-relinquished", residentFeatureCount: 1 });
    const relinquishedUntiledRunning = residencyStatusText({
      kind: "candidate-relinquished",
      residentFeatureCount: 1,
      untiledStreamStillRunning: true,
    });
    for (const text of [withinBudget, overHonest, overDegraded, stalled, settledPartial, relinquished, relinquishedUntiledRunning]) {
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

  // Item B (residency-debt cut 1b): the fourth new DRAFT string this piece adds -- asserted verbatim,
  // same discipline as every other string in this describe block.
  describe("Item B's settled-partial string (draft for the human's 24(b) sight)", () => {
    it("candidate-over-budget, settled: 'partial': the ordinary sentence PLUS the fill's own quiescence, never a completeness/total claim", () => {
      const status: ResidencyStatus = {
        kind: "candidate-over-budget",
        residentFeatureCount: 900,
        viewportTotal: null,
        settled: "partial",
      };
      const text = residencyStatusText(status);
      expect(text).toBe(
        "Showing 900 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail. Filling has stopped for this view; pan or zoom to look for more."
      );
      expect(text.toLowerCase()).not.toContain("complete");
      expect(text.toLowerCase()).not.toContain("all ");
    });

    it("candidate-over-budget, settled: 'partial' AND an honest viewportTotal: the suffix still appends to whichever base sentence applies", () => {
      const status: ResidencyStatus = {
        kind: "candidate-over-budget",
        residentFeatureCount: 900,
        viewportTotal: 1_500,
        settled: "partial",
      };
      expect(residencyStatusText(status)).toBe(
        "Showing 900 of ~1500 features — areas farthest from view are not drawn, to stay within the render budget. Pan or zoom in to see them. Filling has stopped for this view; pan or zoom to look for more."
      );
    });

    it("candidate-within-budget, settled: 'complete': byte-identical to the pre-existing 'Showing all N' wording -- no new string needed for this classification", () => {
      const status: ResidencyStatus = { kind: "candidate-within-budget", residentFeatureCount: 42, settled: "complete" };
      expect(residencyStatusText(status)).toBe("Showing all 42 features in view");
    });

    // `stalled`/`settled: "partial"` are structurally mutually exclusive at the session level
    // (`candidateArmSession.ts`'s own `emitResidencyStatus` doc comment, and this file's own
    // `settledState`/`fillActivity` mutual-exclusion test below) -- this only proves the RENDER
    // function's own precedence is deterministic if both were ever somehow present on the same event.
    it("if both stalled and settled: 'partial' were present on the same event, stalled's own suffix wins (an event this codebase's own wiring never actually constructs)", () => {
      const status: ResidencyStatus = {
        kind: "candidate-over-budget",
        residentFeatureCount: 900,
        viewportTotal: null,
        stalled: true,
        settled: "partial",
      };
      expect(residencyStatusText(status)).toBe(
        "Showing 900 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail. Filling is paused until the next pan or zoom."
      );
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

  // Item B (residency-debt cut 1b): `settled` carried through unchanged, the same "carried through,
  // never re-derived" contract every other field on these two events already gets (e.g.
  // `candidate-over-budget`'s own `viewportTotal`/`stalled`, `candidate-relinquished`'s own
  // `untiledStreamStillRunning`, `M1`'s own precedent test above).
  it("carries settled through for candidate-within-budget when present, and never invents it when absent", () => {
    expect(
      nextResidencyStatus({ kind: "candidate-within-budget", residentFeatureCount: 10, settled: "complete" })
    ).toEqual<ResidencyStatus>({ kind: "candidate-within-budget", residentFeatureCount: 10, settled: "complete" });
    expect(nextResidencyStatus({ kind: "candidate-within-budget", residentFeatureCount: 10 })).toEqual<ResidencyStatus>({
      kind: "candidate-within-budget",
      residentFeatureCount: 10,
    });
  });

  it("carries settled through for candidate-over-budget when present, alongside stalled, and never invents either when absent", () => {
    expect(
      nextResidencyStatus({
        kind: "candidate-over-budget",
        residentFeatureCount: 10,
        viewportTotal: null,
        settled: "partial",
      })
    ).toEqual<ResidencyStatus>({ kind: "candidate-over-budget", residentFeatureCount: 10, viewportTotal: null, settled: "partial" });
    expect(
      nextResidencyStatus({ kind: "candidate-over-budget", residentFeatureCount: 10, viewportTotal: null })
    ).toEqual<ResidencyStatus>({ kind: "candidate-over-budget", residentFeatureCount: 10, viewportTotal: null });
  });
});

// Item B (residency-debt cut 1b, RESIDENCY-DEBT-1B.md, BS5): `settledState`'s own five pure inputs,
// unit-tested directly -- no manager/canvas/timer anywhere in this describe block, matching
// `fillActivity`'s own describe block immediately above it in this file.
describe("settledState (Item B, BS5: a pure function of hasPlanned/pendingViewportChange/trackedTileCount/untiledStreamRunning/fillComplete)", () => {
  // The preregistration's own predicate, quoted verbatim (RESIDENCY-DEBT-1B.md, Item B section):
  // `isSettled = hasPlanned && !pendingViewportChange && manager.trackedTileCount === 0`. Classified
  // `"settled-complete"` when `fillComplete` also holds, `"settled-partial"` otherwise. M1 (reviewer
  // gate, residency-debt cut 1b, "Item B input-list amendment", dated 2026-09-05) widens the predicate by one
  // input, `untiledStreamRunning` -- `settledBase` below defaults it `false` (the ordinary case: the
  // untiled first-look/reissue stream has already reached its own terminal), so every PRE-EXISTING test
  // in this describe block keeps exercising exactly the same three-input surface it always did.
  const settledBase: SettledStateInputs = {
    hasPlanned: true,
    pendingViewportChange: false,
    trackedTileCount: 0,
    untiledStreamRunning: false,
    fillComplete: true,
  };

  it("settled-complete: hasPlanned, no pending change, nothing tracked, the untiled stream at its own terminal, and the covering set reads complete", () => {
    expect(settledState(settledBase)).toBe("settled-complete");
  });

  it("settled-partial: the SAME settled preconditions, but the covering set does not read complete", () => {
    expect(settledState({ ...settledBase, fillComplete: false })).toBe("settled-partial");
  });

  it("not-settled: hasPlanned false alone forces not-settled, regardless of every other input", () => {
    expect(settledState({ ...settledBase, hasPlanned: false })).toBe("not-settled");
    expect(settledState({ ...settledBase, hasPlanned: false, fillComplete: false })).toBe("not-settled");
  });

  it("not-settled: pendingViewportChange true alone forces not-settled, regardless of every other input -- BS5's own re-plan-pending clause", () => {
    expect(settledState({ ...settledBase, pendingViewportChange: true })).toBe("not-settled");
    expect(settledState({ ...settledBase, pendingViewportChange: true, fillComplete: false })).toBe("not-settled");
  });

  it("not-settled: trackedTileCount > 0 alone forces not-settled, regardless of every other input -- BS5's own trackedTileCount clause, and the Amendment-1 reopening-exception guarantee", () => {
    expect(settledState({ ...settledBase, trackedTileCount: 1 })).toBe("not-settled");
    expect(settledState({ ...settledBase, trackedTileCount: 4, fillComplete: false })).toBe("not-settled");
  });

  // M1 (reviewer gate, residency-debt cut 1b): the new input's own dedicated case, the same shape as
  // the three siblings immediately above -- the untiled first-look/reissue stream is exempt from
  // `trackedTileCount`, so it needs its own independent forcing clause, never merely folded into an
  // existing one.
  it("not-settled: untiledStreamRunning true alone forces not-settled, regardless of every other input -- M1's own reachability fix (RESIDENCY-DEBT-1B.md, Item B input-list amendment)", () => {
    expect(settledState({ ...settledBase, untiledStreamRunning: true })).toBe("not-settled");
    expect(settledState({ ...settledBase, untiledStreamRunning: true, fillComplete: false })).toBe("not-settled");
  });

  // The exhaustive combination table (BUILD instruction 6, doubled by M1): every reachable combination
  // of the four boolean-shaped preconditions (`hasPlanned`, `pendingViewportChange`, `trackedTileCount
  // === 0` vs `> 0`, `untiledStreamRunning`) crossed with `fillComplete` -- `isSettled` is `true` on
  // exactly ONE combination of the four preconditions (all hold, `trackedTileCount === 0`), and
  // `fillComplete` then selects the classification.
  it("the exhaustive combination table: every reachable (hasPlanned, pendingViewportChange, trackedTileCount, untiledStreamRunning, fillComplete) combination", () => {
    const trackedCounts = [0, 1, 3];
    for (const hasPlanned of [true, false]) {
      for (const pendingViewportChange of [true, false]) {
        for (const trackedTileCount of trackedCounts) {
          for (const untiledStreamRunning of [true, false]) {
            for (const fillComplete of [true, false]) {
              const input: SettledStateInputs = {
                hasPlanned,
                pendingViewportChange,
                trackedTileCount,
                untiledStreamRunning,
                fillComplete,
              };
              const isSettled =
                hasPlanned && !pendingViewportChange && trackedTileCount === 0 && !untiledStreamRunning;
              const expected = !isSettled ? "not-settled" : fillComplete ? "settled-complete" : "settled-partial";
              expect(settledState(input), JSON.stringify(input)).toBe(expected);
            }
          }
        }
      }
    }
  });

  // BS5's own two named cases, restated at the pure-function level (the session-level drive of both is
  // `candidateArmSession.test.ts`'s own "the reopening case" describe block): a state mid-reopening
  // (some covering tile freshly re-tracked, `trackedTileCount > 0`) can never read settled, so the
  // Amendment-1 partial-covering-eviction exception -- which only ever fires from WITHIN a live
  // `onCameraChange` admission -- can never still be in flight at a moment this predicate calls
  // settled.
  it("the reopening case and the partial-covering-eviction case are both not-settled: trackedTileCount > 0 during either", () => {
    // "Not settled, over budget, a durably-partial covering tile mid-reopen, queued work still
    // outstanding" -- `fillComplete: false` mirrors `overBudget: true` forcing `isFillComplete()`
    // false at the session level.
    expect(
      settledState({
        hasPlanned: true,
        pendingViewportChange: false,
        trackedTileCount: 3,
        untiledStreamRunning: false,
        fillComplete: false,
      })
    ).toBe("not-settled");
    // Even a single freshly re-admitted tile (the reopening exception's own admission) is enough.
    expect(
      settledState({
        hasPlanned: true,
        pendingViewportChange: false,
        trackedTileCount: 1,
        untiledStreamRunning: false,
        fillComplete: false,
      })
    ).toBe("not-settled");
  });

  // Stalled/settled mutual exclusion (BUILD instruction/test 5), at the structural level: `fillActivity`
  // reads `"stalled"` only when `queuedCount > 0`, and `queuedCount` is one of the THREE
  // `TileRequestState`s `TileViewportStreamManager.trackedTileCount` sums (`"queued"` + `"issuing"` +
  // `"in-flight"`, `tileViewportStreamManager.ts`'s own `trackedTileCount` getter) -- so
  // `queuedCount > 0` always implies `trackedTileCount > 0`, which `settledState` above excludes
  // unconditionally. This test drives that implication directly: for every `fillActivity` input that
  // reads `"stalled"`, the CORRESPONDING `trackedTileCount` (`queuedCount + inFlightCount`, a lower
  // bound -- real sessions may also have `"issuing"` tiles neither count) is `> 0`, so `settledState`
  // reads `"not-settled"` for it, regardless of `hasPlanned`/`pendingViewportChange`/`fillComplete`.
  it("stalled and settled are mutually exclusive: every stalled-triggering queuedCount forces trackedTileCount > 0, which forces not-settled", () => {
    const stalledInputs = [
      { queuedCount: 1, overBudget: true, hasHeadroom: false, inFlightCount: 0 },
      { queuedCount: 5, overBudget: true, hasHeadroom: false, inFlightCount: 2 },
    ];
    for (const stalledInput of stalledInputs) {
      expect(fillActivity(stalledInput)).toBe("stalled");
      const trackedTileCount = stalledInput.queuedCount + stalledInput.inFlightCount; // a lower bound
      expect(trackedTileCount).toBeGreaterThan(0);
      expect(
        settledState({
          hasPlanned: true,
          pendingViewportChange: false,
          trackedTileCount,
          untiledStreamRunning: false,
          fillComplete: true,
        })
      ).toBe("not-settled");
    }
  });
});
