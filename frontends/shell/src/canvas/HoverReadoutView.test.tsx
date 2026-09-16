// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { HoverReadoutView, HOVER_CONFIRMING_MARKER_TEXT } from "./HoverReadoutView";
import { confirmingReadout, type PickResult } from "./pick";

// React 18.3's own `act` (not `react-dom/test-utils`'s deprecated re-export), exactly as
// `OriginMismatchState.test.tsx` sets it up -- this suite renders the real component into a real
// jsdom tree, which is what makes "cannot render without the marker" a RENDER-level assertion
// rather than a claim about a helper's return value.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ID_WITH_ANCHOR: PickResult = {
  streamHandle: "sh_test",
  batchSeq: 1,
  id: 6430n,
  anchor: [2600000.5, 1200000.25],
};
const ID_WITHOUT_ANCHOR: PickResult = { streamHandle: "sh_test", batchSeq: 1, id: 6430n, anchor: null };

/**
 * DECISIONS-PENDING entry 88 / 75 (3), RULED 2026-09-14 (question set B, B1); the tests the ruling
 * itself names, in `HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` §6 (1) and (2).
 */
describe("HoverReadoutView (B1's labelled state, at the render)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function render(readout: Parameters<typeof HoverReadoutView>[0]["readout"]): void {
    act(() => {
      root.render(<HoverReadoutView readout={readout} />);
    });
  }

  it("the labelled state cannot render without the marker", () => {
    // Both shapes a standing id can have -- with and without its authoritative anchor -- because the
    // marker's presence may not depend on anything about the id it labels.
    for (const standing of [ID_WITH_ANCHOR, ID_WITHOUT_ANCHOR]) {
      render(confirmingReadout(standing));
      const readout = container.querySelector(".hover-readout");
      expect(readout).not.toBeNull();
      // The id the operator was already shown is still there (B1: "the standing id stays visible")...
      expect(readout?.textContent).toContain("id 6430");
      // ...and it is NEVER there alone: the marker is its own element, rendered by the same return.
      const marker = container.querySelector(".hover-readout-confirming-marker");
      expect(marker).not.toBeNull();
      expect(marker?.textContent).toBe(HOVER_CONFIRMING_MARKER_TEXT);
      // Structurally distinguishable, not merely dimmer: the container names the state too.
      expect(container.querySelector(".hover-readout-confirming")).not.toBeNull();
      // And the marker is never concatenated into the id: removing the marker element's own text
      // from the line leaves exactly the confirmed id line, unchanged.
      expect(readout?.textContent?.replace(HOVER_CONFIRMING_MARKER_TEXT, "")).not.toContain("confirming");
    }

    // The other two states are untouched by this piece and carry no marker at all.
    render(ID_WITH_ANCHOR);
    expect(container.querySelector(".hover-readout")?.textContent).toBe("id 6430 @ (2600000.500, 1200000.250)");
    expect(container.querySelector(".hover-readout-confirming-marker")).toBeNull();
    expect(container.querySelector(".hover-readout-confirming")).toBeNull();

    render({ kind: "below-pick-resolution" });
    expect(container.querySelector(".hover-readout-below-resolution")?.textContent).toBe(
      "Features here are below pick resolution — zoom in to inspect them."
    );
    expect(container.querySelector(".hover-readout-confirming-marker")).toBeNull();

    render(null);
    expect(container.querySelector(".hover-readout")).toBeNull();
  });

  it("the bare id is never rendered for a labelled state -- the type carries no id of its own", () => {
    // The type-level half of invariant 3 (`HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` §4): the
    // labelled state is not a `PickResult` and has no `id` to reach for, so a render path that shows
    // a bare id cannot accept it. Both directives below are checked by `npm run typecheck`: if the
    // variant ever gained an `id`, or became assignable to `PickResult`, tsc fails here on the unused
    // `@ts-expect-error` -- and the runtime assertion fails in this test by name too.
    const labelled = confirmingReadout(ID_WITH_ANCHOR);

    // @ts-expect-error -- `PickConfirming` has no `id` of its own; the id lives in `standing`.
    const bypassed = labelled.id;
    expect(bypassed).toBeUndefined();

    const bareIdLine = (pick: PickResult): string => `id ${pick.id.toString()}`;
    // @ts-expect-error -- the labelled state cannot stand in for a confirmed pick.
    expect(() => bareIdLine(labelled)).toThrow();

    // The id it labels is reachable only by naming the variant -- which is the branch that renders
    // the marker beside it.
    expect(bareIdLine(labelled.standing)).toBe("id 6430");
  });
});

/**
 * **T8's second half (P3b §4): the session-ended readout, at the render.**
 *
 * The property is structural, not textual: whatever the operator reads, it is a refusal and it is
 * never an id. The wording itself is the human's at P6 (§9) and nothing here asserts it verbatim.
 */
describe("HoverReadoutView, boundary 4's session-ended refusal", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function render(readout: Parameters<typeof HoverReadoutView>[0]["readout"]): void {
    act(() => {
      root.render(<HoverReadoutView readout={readout} />);
    });
  }

  // RECORDED MUTATION for "renders the refusal in the hover slot, and never a bare or standing id":
  // delete the `isPickSessionEnded` branch from `HoverReadoutView.tsx`, so the readout falls through
  // to the bare-id line. Expected failure: that test fails on the class assertion -- the slot
  // renders an id line for a readout that carries no id, which is the silent-service ADR-010 rule 5
  // forbids, in its worst form.
  // OBSERVED: FAILED -- `TypeError: Cannot read properties of undefined (reading 'toString')`, i.e.
  // the id line reaching for an id that does not exist.
  it("renders the refusal in the hover slot, and never a bare or standing id", () => {
    render({ kind: "session-ended" });

    const el = container.querySelector(".hover-readout");
    expect(el).not.toBeNull();
    expect(el!.className).toContain("hover-readout-session-ended");
    // It says something -- silence is the one answer boundary 4 and ADR-010 rule 5 forbid here.
    expect(el!.textContent!.trim().length).toBeGreaterThan(0);
    // And it is not an identity, in any of the three forms this slot can otherwise take.
    expect(container.textContent).not.toMatch(/\bid \d/);
    expect(container.textContent).not.toContain(HOVER_CONFIRMING_MARKER_TEXT);
    expect(container.querySelector(".hover-readout-confirming-marker")).toBeNull();
  });

  // RECORDED MUTATION for "the refusal replaces a standing id rather than sitting beside it":
  // return `null` from the session-ended branch -- silence instead of a named refusal, which is
  // exactly the answer boundary 4 and ADR-010 rule 5 forbid. Expected failure: that test fails on
  // the single-element assertion (nothing renders at all).
  // OBSERVED: FAILED -- `AssertionError: expected  to have a length of 1 but got +0` (and the first
  // test of this block on `expected null not to be null`).
  it("the refusal replaces a standing id rather than sitting beside it", () => {
    render(confirmingReadout(ID_WITH_ANCHOR));
    expect(container.textContent).toContain("id 6430");

    render({ kind: "session-ended" });
    expect(container.querySelectorAll(".hover-readout")).toHaveLength(1);
    expect(container.textContent).not.toContain("6430");
  });

  it("the type carries no identity for a render path to reach", () => {
    const refused = { kind: "session-ended" } as const;
    // @ts-expect-error -- `PickSessionEnded` has no `id`; there is nothing to render as one.
    expect(refused.id).toBeUndefined();
    // @ts-expect-error -- and no `standing` either, unlike the labelled state.
    expect(refused.standing).toBeUndefined();
  });
});
