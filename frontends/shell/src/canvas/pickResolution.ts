// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";
import {
  confirmingReadout,
  isPickBelowResolution,
  isPickConfirming,
  type HoverReadout,
  type PickResult,
} from "./pick";

/**
 * Viewport-residency cut P6a, decision 24(c): sub-pixel pick refusal by name (ADR-028 item 4, ADR-010
 * rule 6 discipline -- "declared, not discovered"). At extreme zoom-out a single on-screen pixel can
 * cover many resident features; `resolvePick` (`pick.ts`) always returns SOME feature under a raw GPU
 * pick ordinal, but which one is arbitrary once features are smaller than a pixel -- a
 * plausible-but-arbitrary answer, not an honest one. This module names the threshold and the pure
 * comparison; `WorkingCanvas.tsx`'s shared hover site (the same accessor `render()` uses, Defect B)
 * is the one caller, for both arms alike -- the check needs only the batches already resident and the
 * current zoom, neither of which is arm-specific.
 *
 * **The threshold, declared:** `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX` below, sighted by the human at
 * **9 px** on 2026-09-14 (DECISIONS-PENDING entry 89 / 91 (c), question set B, B2;
 * `POLISH-87-88-89-PREREGISTRATION.md` §4.2). It is a **declared choice, not a measurement or a fit**
 * (ADR-010 rule 6, "declared, not discovered") -- see the constant's own comment for the rationale,
 * the measured figure it records beside itself, and the only thing that may revise it.
 *
 * **The mechanic, kept simple and honest:** rather than sizing every individual feature under the
 * cursor (expensive, and picking already resolved to exactly one candidate feature by then), this
 * compares the AVERAGE resident feature's own on-screen extent at the current zoom against the
 * threshold -- "average feature's on-screen extent at the current zoom, computed from resident data"
 * is the whole rule. When the average is below the line, individual features are, on the whole, too
 * small for a single pick to mean anything at this zoom; when it is above, an individual pick is
 * treated as meaningful exactly as it always has been. This is a coarser signal than a per-feature
 * check would be (a handful of oversized features could pull the average up even in a genuinely dense
 * area, or vice versa) -- an honest simplification, not a precise one, consistent with "keep the
 * mechanic simple."
 *
 * **Declared limitation (architect re-verification, viewport-residency cut P6b, item 6b).** This
 * threshold is style-independent: `averageFeatureExtent` measures each feature's own GEOMETRIC
 * extent (the rings `decodeBatch` carries), never a style-resolved on-screen symbol size, while
 * ADR-022 (style v0 as the project's single style model) lets a resolved point/symbol radius vary
 * independently of the geometry underneath it -- a tiny point rendered with a large circle symbol
 * can be genuinely pickable well past this threshold, and a large polygon styled with a hairline
 * stroke may not be. Rule 6's own framing applies to the gap itself, not only the number: a
 * style-dependent threshold (folding the resolved symbol/stroke size into the on-screen extent this
 * module compares) is future work, owed once pick discrimination becomes style-aware -- not
 * attempted here.
 */
/**
 * **The declared refusal threshold: 9 CSS pixels of average on-screen feature extent.** Below it a
 * hover is refused by name instead of answered.
 *
 * **Rationale (the human's own, RULED 2026-09-14, question set B, B2, verbatim):** *"human pointer
 * targeting, not pixel resolution, decides whether "which feature" is answerable."* That is the
 * quantity this number bounds -- not what the pick machinery can resolve, but what a person can aim
 * at well enough for the answer to mean anything.
 *
 * **The measured figure, recorded beside it and NEVER presented as its measurement** (ADR-010 rule
 * 6, `docs/adr/ADR-010-render-frames-origins-boundaries.md:74`): id discrimination was reliable only
 * from **2.27 px** separation (0.30 m at 1:500). Both of that figure's own caveats travel with it,
 * in the ADR's words (its own emphasis marks omitted): *"scale invariance was never verified at a second zoom, so 2.27 px is a
 * measurement at 1:500 rather than a demonstrated invariant"*, and *"because the figure moves with
 * style, a heavier symbol raises it with no change to the data or the CRS"* -- which this module's
 * own style-independence limitation (above) compounds. 9 px is roughly four times 2.27 px; that
 * relation is how the declared value was ARRIVED at
 * (`POLISH-87-88-89-PREREGISTRATION.md` §4.2), not evidence for it. **No claim is made that 9 px is
 * where discrimination or targeting fails.**
 *
 * **Revisable only by a walkthrough-recorded felt verdict** (the same ruling): a sitting row
 * hovering features of roughly 5, 9 and 15 px, recorded in `MANUAL-WALKTHROUGH.md` -- **never by a
 * guess**, and never by a number fitted after the fact.
 *
 * **Recorded tension, sighted with the value** (`POLISH-87-88-89-PREREGISTRATION.md` §4.2): entry
 * 47's sharpened criterion pulls the other way -- a higher threshold necessarily refuses at some
 * cameras where the operator could still tell which feature is under the pointer. The trade was the
 * human's to make, and was made here.
 */
export const SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 9;

/**
 * The average resident feature's own bounding-box extent (the larger of its width/height, across
 * every ring/hole a feature carries), in the dataset's own CRS units -- `0` when `batches` carries no
 * feature with any real geometry at all (nothing to average). Pure and O(total vertices), the same
 * order of work `buildLayers` already does over the same batches each render -- computed once per
 * render (`WorkingCanvas.tsx`'s own `averageFeatureExtentRef`), never per hover event.
 */
export function averageFeatureExtent(batches: readonly Pick<ResidentBatch, "rings">[]): number {
  let sumExtent = 0;
  let count = 0;
  for (const batch of batches) {
    for (const featureRings of batch.rings) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let sawVertex = false;
      for (const ring of featureRings) {
        for (const [x, y] of ring) {
          sawVertex = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (!sawVertex) continue;
      sumExtent += Math.max(maxX - minX, maxY - minY);
      count++;
    }
  }
  return count > 0 ? sumExtent / count : 0;
}

/**
 * The pure threshold comparison -- `averageFeatureExtentWorldUnits` (`averageFeatureExtent` above)
 * times `pixelsPerWorldUnit` (`WorkingCanvas.tsx`'s own `pixelsPerWorldUnitAtZoom`, evaluated at the
 * CURRENT zoom) is the average feature's own on-screen size in CSS pixels; below the declared
 * threshold, a single pick is refused by name rather than answered.
 */
export function isBelowPickResolution(averageFeatureExtentWorldUnits: number, pixelsPerWorldUnit: number): boolean {
  return averageFeatureExtentWorldUnits * pixelsPerWorldUnit < SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX;
}

/**
 * **The MID-GESTURE decision** (entry 47's piece: `HOVER-REPICK-PREREGISTRATION.md` D2; originally
 * residency-debt cut 1b, Item C -- DECISIONS-PENDING entry 29, "K6", `RESIDENCY-DEBT-1B.md`): what
 * the standing hover readout becomes at a NEW camera while camera changes are still arriving. Its
 * behaviour is unchanged by entry 47; only its name in the design is now explicit, because a SECOND
 * decision now sits beside it (`decideHoverReadoutAtSettle` below), for the moment the burst stops.
 *
 * K6's repro: hover a feature fully zoomed in (its id shows), keep the pointer stationary, zoom OUT
 * past this module's declared threshold -- `WorkingCanvas.tsx`'s `onHover` only fires on pointer
 * MOVE, so without this function the stale id readout would persist past the zoom where a fresh
 * hover would refuse by name. It re-runs the same pure threshold comparison `isBelowPickResolution`
 * already makes on a fresh pointer move, against the SAME `averageFeatureExtentWorldUnits`
 * (unaffected by a camera move -- it is the resident set's own geometric average,
 * `WorkingCanvas.tsx`'s `averageFeatureExtentRef`) but the NEW zoom's `pixelsPerWorldUnit`.
 *
 * **Declared, not discovered (ADR-010 rule 6): mid-gesture, this piece does NOT re-pick.** That is
 * this piece's own choice, stated as one. A GPU re-pick per camera-change event is per-frame
 * picking during a gesture, which entry 47's preregistration declares a non-goal; the re-pick
 * belongs to the settle instant instead (`decideHoverReadoutAtSettle` below), where exactly one
 * pick answers the whole burst. Mid-gesture the honest answer is therefore the threshold's own:
 * refuse by name below it, and above it show the id the operator already had **under a marker that
 * says nothing has re-confirmed it** -- never a bare id.
 *
 * **CHANGED by DECISIONS-PENDING entry 88 / 75 (3), RULED 2026-09-14 (question set B, B1;
 * `HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` M1):** the above-threshold branch returned `null`
 * (a clear) until that ruling -- the blink per notch the sitting felt. It now returns the **labelled
 * state** (`confirmingReadout`, `pick.ts`), in the human's own words: *"Between a camera change and
 * its settle re-pick, the standing id stays visible with a plain, muted marker ... never the bare
 * id. The marker is removed only by a re-pick result."* Nothing else about this decision moves.
 *
 * Returns the readout the caller should now emit, or `undefined` when nothing should be emitted at
 * all (the caller's own `lastHoverReadoutRef` -- mirroring the last EMITTED readout, not merely the
 * last-computed one -- is left exactly as it was):
 *
 * - `standing === null` (nothing shown): `undefined` -- a later real `onHover` evaluates normally
 *   once the pointer actually moves; there is nothing standing to go stale.
 * - Below the new threshold: the named refusal (`PickBelowResolution`) -- UNLESS `standing` is
 *   already that same refusal, in which case `undefined` (no redundant re-emit, test case (d)). A
 *   standing LABELLED state is replaced by the refusal here: crossing the threshold is exactly the
 *   ruling's "below-threshold -> the readout becomes the refusal", and the refusal names no id.
 * - Not below the new threshold, `standing` a resolved feature id (test case (b)): the **labelled
 *   state** carrying that id. A previously-shown id still cannot be confirmed to sit under the
 *   pointer without a fresh GPU pick, and mid-gesture this piece still declines to run one -- so it
 *   is shown as what it is, unconfirmed at this camera, until the settle's re-pick result replaces
 *   or clears it. No id is ever ASSERTED across a camera change: an id is only ever emitted bare
 *   from a FRESH GPU-ordinal to stable-id resolution (ADR-010 rules 2 and 5), which at settle is
 *   exactly what happens.
 * - Not below the new threshold, `standing` already the labelled state: `undefined` -- **only a
 *   re-pick result removes it** (the ruling's second named test); a burst's later camera changes
 *   leave it exactly as it stands, with no re-emit.
 * - Not below the new threshold, `standing` the refusal itself (test case (c)): `null` -- a
 *   previously-shown refusal is no longer known true, and it names no id to keep standing.
 */
export function reevaluateStandingHoverOnCameraChange(
  standing: HoverReadout,
  averageFeatureExtentWorldUnits: number,
  pixelsPerWorldUnit: number
): HoverReadout | undefined {
  if (standing === null) return undefined;
  const below = isBelowPickResolution(averageFeatureExtentWorldUnits, pixelsPerWorldUnit);
  if (below) {
    if (isPickBelowResolution(standing)) return undefined;
    return { kind: "below-pick-resolution" };
  }
  if (isPickConfirming(standing)) return undefined;
  if (isPickBelowResolution(standing)) return null;
  return confirmingReadout(standing);
}

/**
 * **D5 -- what a pending re-pick stores about the pointer: screen x/y and nothing else.** No
 * unprojected renderer-local value is ever read or kept (ADR-010 rule 1; `PICKING.md`, and the scan
 * `noCoordinateLeak.test.ts` runs). `x`/`y` are deck's own screen pixel values as delivered to
 * `onHover`, in the same CSS-pixel basis `deck.pickObject` takes back.
 *
 * **D4 -- the framebuffer identity captured WITH the pixel, and part of its meaning.** ADR-010 rule
 * 1 makes framebuffer identity and dimensions part of what a screen pixel means, so the three
 * values that fix that basis travel with the pixel: the canvas's CSS width and height (the basis
 * this canvas already uses everywhere) and the device pixel ratio in force when it was captured. A
 * stored pixel whose basis no longer holds is not the same pixel, and is not re-mapped into the new
 * one here (that is listed as undecided by the preregistration) -- it is refused, below.
 */
export interface HoverPointerCapture {
  x: number;
  y: number;
  clientWidth: number;
  clientHeight: number;
  devicePixelRatio: number;
}

/** The three values above, read at settle rather than at capture -- compared against the capture by
 * `isFramebufferIdentical`. */
export interface FramebufferIdentity {
  clientWidth: number;
  clientHeight: number;
  devicePixelRatio: number;
}

/**
 * D5: deck.gl's own pointerleave sentinel is a NEGATIVE screen x/y, and it is recorded like any
 * other capture (the pointer's last known state, "off canvas") rather than dropped -- so a burst
 * that settles after the pointer has left the canvas has something explicit to refuse against
 * instead of a stale on-canvas pixel.
 */
export function isPointerOnCanvas(capture: HoverPointerCapture): boolean {
  return capture.x >= 0 && capture.y >= 0;
}

/** D4: the captured pixel's basis, re-validated at settle. A resize or a device-pixel-ratio change
 * between capture and settle makes this `false`, and `mayRepickAtSettle` then refuses to pick at
 * all -- never a pick aimed at a framebuffer other than the one its pixel was captured against. */
export function isFramebufferIdentical(capture: HoverPointerCapture, now: FramebufferIdentity): boolean {
  return (
    capture.clientWidth === now.clientWidth &&
    capture.clientHeight === now.clientHeight &&
    capture.devicePixelRatio === now.devicePixelRatio
  );
}

/**
 * **D3/D6(a) -- whether a camera change arms the pending re-pick at all.** Pure, and the switch is a
 * PARAMETER rather than a module read, so both of `HOVER_REPICK_ON_PAN`'s values are exercised by
 * tests rather than one being dormant (`hoverRepickConstants.ts` carries the switch itself and the
 * standing of its default).
 *
 * - `readoutWasStanding`: was a readout actually shown to the operator at the burst's FIRST camera
 *   change. Only that first change can see one -- the mid-gesture decision above clears or refuses
 *   it immediately after -- so arming is sticky for the rest of the burst, and a burst that began
 *   with nothing shown arms nothing (there is no readout whose staleness a re-pick would answer).
 * - `zoomChanged`: read at the call site BEFORE the new zoom is written, i.e. "did this camera
 *   change move the zoom axis at all".
 * - `repickOnPan`: `true` = pan and zoom settle alike (the ruling's words); `false` = zoom-only,
 *   where a pure pan arms nothing and today's mid-gesture clear stands as the whole behaviour.
 */
export function shouldArmHoverRepick(readoutWasStanding: boolean, zoomChanged: boolean, repickOnPan: boolean): boolean {
  if (!repickOnPan && !zoomChanged) return false;
  return readoutWasStanding;
}

/**
 * **D6 -- the three conditions that must ALL hold before any pick runs at settle**, in one place so
 * the caller's "should I even pick" question and the decision's own guard cannot drift apart:
 * (a) the burst was armed, (b) the pointer is on canvas, (c) the captured pixel's framebuffer basis
 * still holds. When this is `false` the caller runs NO pick and emits nothing at all -- refusal to
 * act, the cheap and safe answer, leaving the standing readout whatever the mid-gesture decision
 * already made it.
 */
export function mayRepickAtSettle(armed: boolean, onCanvas: boolean, framebufferIdentical: boolean): boolean {
  return armed && onCanvas && framebufferIdentical;
}

/**
 * **The AT-SETTLE decision** (D6/D10) -- the pure counterpart of the mid-gesture decision above, for
 * the instant a burst of camera changes has stopped. Returns the readout to emit, or `undefined`
 * for "emit nothing".
 *
 * Order is load-bearing and declared: **the threshold decides first, and the refusal always wins
 * over any id** (ADR-028 Decision item 4; 24(c)) -- a fresh pick can perfectly well return a
 * feature at a camera where naming any single feature would be arbitrary, and that answer is
 * refused by name, not shown. Only above the threshold does the pick's own outcome speak:
 *
 * - `pickOutcome` a `PickResult`: that id -- always a FRESH GPU-ordinal to stable-id resolution made
 *   at this camera by the caller (ADR-010 rule 2), never a retained string re-asserted across the
 *   change (rule 5). The same id as before is a legitimate result and means the pick confirmed it.
 * - `pickOutcome` `null`: clear. Nothing resolved under that pixel -- including over a tile that is
 *   not resident (D8: the re-pick only ever resolves against the batches actually resident; nothing
 *   is guessed, and a later ingest does not re-arm it).
 *
 * All three of those outcomes are re-pick RESULTS, and each of them removes the labelled state
 * (`HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` M1) -- the id bare, a different id bare, or the
 * refusal/clear. `standing` is what the operator currently sees, and it is read for exactly one
 * thing: the no-re-pick branch below (M4).
 *
 * **M4, the disarm case:** when the three conditions do NOT hold, no pick runs and no result will
 * ever arrive -- so a standing labelled state is **cleared** rather than left marked forever (the
 * ruling: *"the marker never outlives a settle"*). A standing confirmed id or refusal still emits
 * nothing at all in that state, exactly as before this piece: refusal to act, unchanged.
 */
export function decideHoverReadoutAtSettle(
  armed: boolean,
  onCanvas: boolean,
  framebufferIdentical: boolean,
  belowThreshold: boolean,
  pickOutcome: PickResult | null,
  standing: HoverReadout
): HoverReadout | undefined {
  if (!mayRepickAtSettle(armed, onCanvas, framebufferIdentical)) return clearLabelledStateWithoutRepick(standing);
  if (belowThreshold) return { kind: "below-pick-resolution" };
  return pickOutcome;
}

/**
 * **M4 -- the one rule for every path on which no re-pick result can arrive** (the settle that
 * refuses to pick, above; a camera change under a held pointer button; the `pointerdown` edge that
 * cancels a pending settle -- `WorkingCanvas.tsx`'s two cancel sites). The ruling makes the marker's
 * removal the exclusive business of a re-pick result *and* forbids it outliving a settle; where no
 * result is coming, the only answer that satisfies both is to clear the readout.
 *
 * Returns `null` (clear) for a standing labelled state and `undefined` (emit nothing, leave the
 * readout exactly as it is) for everything else -- a confirmed id, the named refusal, or nothing
 * shown at all are all untouched by this piece.
 */
export function clearLabelledStateWithoutRepick(standing: HoverReadout): HoverReadout | undefined {
  return isPickConfirming(standing) ? null : undefined;
}

/**
 * **D11 (preregistration §12 Amendment 2, recorded before this code) -- what a camera change does,
 * including while a pointer button is held down.** The architect gate's falsifier: deck.gl does not
 * deliver `onHover` while a mouse button is down (`@deck.gl/core/dist/lib/deck.js`: "Do not trigger
 * onHover callbacks if mouse button is down"), so through a whole drag pan neither the pointer
 * capture nor the cancel that a real hover performs ever runs, while the camera-change site arms and
 * schedules on every drag frame -- a settle would then pick at the PRE-DRAG pixel and confirm an id
 * for a feature that is not under the pointer. That is refused here rather than papered over: while
 * a button is down, arming is blocked AND any pending settle is cancelled; the first camera change
 * after the button is released arms as D1/D3 say.
 *
 * The three answers, and what the caller does with each:
 * - `"cancel"`: forget the burst entirely -- disarm and cancel the pending settle, schedule nothing.
 * - `"arm"`: a readout was standing and this axis counts (D3) -- arm, then (re)start the settle.
 * - `"schedule"`: nothing to arm, but the burst is still in motion -- (re)start the settle, which
 *   will find nothing armed and emit nothing. Keeping the timer honest here costs one `setTimeout`
 *   and keeps "settle" meaning the same thing at every site.
 */
export type HoverRepickCameraChangeAction = "cancel" | "arm" | "schedule";

export function hoverRepickActionForCameraChange(
  readoutWasStanding: boolean,
  zoomChanged: boolean,
  repickOnPan: boolean,
  pointerButtonDown: boolean
): HoverRepickCameraChangeAction {
  if (pointerButtonDown) return "cancel";
  return shouldArmHoverRepick(readoutWasStanding, zoomChanged, repickOnPan) ? "arm" : "schedule";
}

/**
 * DECISIONS-PENDING entry 89 §4.3: the canvas's own pointer cursor, wired into `Deck`'s `getCursor`
 * prop (`WorkingCanvas.tsx`'s Deck construction) -- deck.gl's own default is a grab/grabbing hand
 * (`@deck.gl/core`'s `getCursor` default: `isDragging ? "grabbing" : "grab"`), which reads as a
 * pannable-surface affordance. Declared instead (ADR-010 rule 6: a declared choice, not a
 * discovered one): a crosshair while nothing is held -- this canvas' primary interaction is aiming
 * a pick, not grabbing an object -- and `"grabbing"` only while deck's own controller reports an
 * active drag. Exactly two values, never `"pointer"`: the `Deck` construction wires no `onClick`
 * handler (`WorkingCanvas.tsx`'s Deck construction, hover-only picking via `onHover`), so there is
 * no click affordance on this canvas for a pointer hand to signal.
 */
export function cursorForPointerState(isDragging: boolean): "crosshair" | "grabbing" {
  return isDragging ? "grabbing" : "crosshair";
}
