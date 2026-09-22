// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";

export interface PickResult {
  streamHandle: string;
  batchSeq: number;
  /** Authoritative stable identity (ADR-016 §7) -- a `bigint`, never narrowed to `Number`. */
  id: bigint;
  /** Authoritative f64 anchor coordinate for display: the exterior ring's first vertex. **Never**
   * derived from deck.gl's own unprojected pick coordinate, which is a renderer-local value with no
   * CRS tag (ADR-010 rule 1) -- see `PICKING.md` in this directory. */
  anchor: [number, number] | null;
}

/**
 * Viewport-residency cut P6a, decision 24(c) (ADR-028 item 4): the typed refusal a hover shows when
 * the cursor resolves to a real GPU pick ordinal but the resident data's own average feature size at
 * the current zoom is below `pickResolution.ts`'s declared threshold -- a distinct hover-readout
 * state, never null-silence (a plausible-but-arbitrary single feature would otherwise be shown, or
 * the hover would say nothing at all, both dishonest here). `kind` is the only field: there is no
 * feature identity to report, by construction -- naming one would be exactly the arbitrary answer
 * this state exists to refuse.
 */
export interface PickBelowResolution {
  kind: "below-pick-resolution";
}

/**
 * **The labelled state** (`HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` M1/M2; DECISIONS-PENDING
 * entry 88 with entry 75 (3), RULED 2026-09-14 question set B, B1): the readout between a camera
 * change and its settle re-pick -- *"the standing id stays visible with a plain, muted marker ...
 * never the bare id"*. It is a TYPE rather than a CSS class deliberately: the id it carries lives in
 * `standing` and this variant has **no `id` of its own**, so no render path can reach the id without
 * naming the variant first -- the bare-id branch simply stops compiling on it (ADR-010 rule 5,
 * `:68`: staleness is signalled, never silently served, and here the signal cannot be bypassed).
 *
 * `standing` is the id the operator was ALREADY shown, re-displayed under the marker; it is never a
 * fresh claim about the new camera (rule 2's indirection is untouched -- only a settle re-pick's own
 * GPU-ordinal resolution ever produces a new id). Construct it through `confirmingReadout` below,
 * the one place it is built.
 */
export interface PickConfirming {
  kind: "confirming";
  standing: PickResult;
}

/**
 * **Brief A boundary 4, P3b §2a(iv): picks are refused because the session ended** -- the source
 * this dataset was opened against was observed to have changed, so the residency behind every pick
 * was cleared and the identities it handed out no longer refer to anything this client can resolve.
 *
 * **Why this is a state and not silence.** With residency cleared, `onHover` resolves no layer and
 * emits `null` (`WorkingCanvas.tsx:1968-1972`), and `null` means *"nothing under the cursor"* --
 * which is a different, and false, statement. ADR-010 rule 5 (`:68`, *"Staleness is signalled,
 * never silently served"*) forbids exactly that reading, so the refusal is named.
 *
 * `kind` is the only field, for the reason `PickBelowResolution` above has only `kind`: there is no
 * feature identity to report, by construction. Built by `latchedHoverReadout` below, which is the
 * one place it is constructed.
 */
export interface PickSessionEnded {
  kind: "session-ended";
}

/** `WorkingCanvasProps.onHover`'s own full result type -- `null` (nothing under the cursor),
 * `PickResult` (an ordinary, above-threshold pick, confirmed at the camera it was picked at),
 * `PickBelowResolution` (24(c)'s refusal), `PickConfirming` (B1's labelled state), or
 * `PickSessionEnded` (boundary 4's refusal).
 * Discriminate with the guards below, never a bare `"kind" in value` at a call site. */
export type HoverReadout = PickResult | PickBelowResolution | PickConfirming | PickSessionEnded | null;

export function isPickBelowResolution(value: HoverReadout): value is PickBelowResolution {
  return value !== null && "kind" in value && value.kind === "below-pick-resolution";
}

export function isPickSessionEnded(value: HoverReadout): value is PickSessionEnded {
  return value !== null && "kind" in value && value.kind === "session-ended";
}

/**
 * **The pick latch** (P3b §2a(iv)). Once this dataset's session has ended, every hover readout --
 * whatever the canvas resolved -- becomes the named refusal.
 *
 * **One site covers both arms**, because hover is arm-independent: `App.tsx` wraps its single
 * `onHover={setHover}` with this call, and the baseline and candidate arms share that surface.
 *
 * **Every input state is latched, including `null` and `PickConfirming`.** `null` matters because
 * silence is the wrong answer (see `PickSessionEnded`'s own doc); `PickConfirming` matters because
 * it *carries a standing id* (`pick.ts:44-47`) and rendering an id after the identities behind it
 * were voided is precisely the stale-service ADR-010 rule 5 forbids.
 *
 * **The latch is permanent for the session.** It is cleared only by reopening the dataset --
 * boundary 4's own "until reopen" (`state/NEXT-CUT.md:58-59`), and §7's declared lifetime: no
 * timeout, because a timeout would resurrect exactly what the never-resurrect rule prevents.
 * **N8 correction (2026-09-22):** the latch is App-owned `sessionEndedRef.current` (`App.tsx`, this
 * function's `sessionEnded` argument), not something a `WorkingCanvas` remount clears -- a reopen
 * clears it because `handleAdmitted`'s own `admitAndResetStaleUiState` call resets it, the same
 * clear the session-ended status block above relies on (`App.tsx`'s own doc comment on
 * `sessionEnded` has the full account); `WorkingCanvas` keyed on `admitted.dataset` rebuilds the
 * managers, a separate mechanism from this latch's own reset.
 */
export function latchedHoverReadout(readout: HoverReadout, sessionEnded: boolean): HoverReadout {
  return sessionEnded ? { kind: "session-ended" } : readout;
}

export function isPickConfirming(value: HoverReadout): value is PickConfirming {
  return value !== null && "kind" in value && value.kind === "confirming";
}

/** The one constructor for the labelled state (M2). A confirmed pick goes in; what comes out cannot
 * be rendered as a bare id, and cannot be un-labelled by anything except a re-pick result. */
export function confirmingReadout(standing: PickResult): PickConfirming {
  return { kind: "confirming", standing };
}

/**
 * Resolve a GPU pick ordinal against the resident batch its layer was built from -- ADR-010 rule
 * 2's whole indirection, restated as code: **GPU ordinal → stable feature ID → authoritative f64**.
 *
 * `gpuOrdinal` is `info.index`, used for exactly one thing: indexing into the *same* `ids`/`rings`
 * arrays the picked layer was built from (`buildLayers.ts`). It never leaves this function as a
 * bare number, and the caller must pass the batch `info.layer.id` actually names — see
 * `batchForLayerId` in `buildLayers.ts` — never any other batch, since an ordinal is only meaningful
 * relative to the buffer it indexes.
 */
export function resolvePick(batch: ResidentBatch, gpuOrdinal: number): PickResult | null {
  if (!Number.isInteger(gpuOrdinal) || gpuOrdinal < 0 || gpuOrdinal >= batch.ids.length) {
    return null;
  }
  const id = batch.ids[gpuOrdinal];
  const rings = batch.rings[gpuOrdinal];
  const anchor = rings.length > 0 && rings[0].length > 0 ? rings[0][0] : null;
  return { streamHandle: batch.streamHandle, batchSeq: batch.batchSeq, id, anchor };
}
