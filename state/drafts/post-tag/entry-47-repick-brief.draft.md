> **Status: draft — the entry-47 re-pick brief (2026-09-09); superseded by `frontends/shell/HOVER-REPICK-PREREGISTRATION.md`, its pre-committed form.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# DRAFT — Preregistration: entry 47, the hover readout's re-pick on camera settle (next cut's first piece)

*Drafted 2026-09-09 during the away window by the Plan agent on the custodian's brief; read-only against `main`. For the human's sight after the v0.1.0 tag. Nothing dispatched, no code written, no file touched. The recommendation line at the end is the drafting agent's, not the custodian's and not a ruling. Ruling of record: entry 47 = (b), 2026-09-06, sharpened 2026-09-07 ("as long as I can tell on which feature I'm hovering, there's no reason to remove the id"); "next cut's first piece" 2026-09-08.*

### Facts binding the design (read, not assumed)

- **There is no camera-settle signal in this codebase today.** `onViewStateChange` fires once per input event and calls `reevaluateHoverForZoom(vs.zoom)` *synchronously*; so do `fitToExtent` and the DEV-only view-state seam (`frontends/shell/src/canvas/WorkingCanvas.tsx`). The only settle-shaped mechanism in product code is `frontends/shell/src/streaming/debounce.ts` (trailing edge, "fired only after `settleMs` has passed with no further call"), used for viewport queries at `VIEWPORT_QUERY_MIN_INTERVAL_MS = 120` (`streaming/viewportStreamManager.ts:24`). `canvas/coalesceOncePerFrame.ts` is once-per-frame and its own doc comment says that is deliberately *not* a settle. `waitForSettle(renderTrace, quietMs)` is an E2E-harness notion only.
- **The pointer's position is not stored anywhere.** A grep over `frontends/shell/src` for `clientX`, `pointermove`, `pickObject`, `info.x` returns nothing. deck.gl's `PickingInfo` carries screen pixels; `info.coordinate` is banned by scan (`canvas/noCoordinateLeak.test.ts`, `canvas/PICKING.md`) — screen pixels are not that value and the scan is untouched by storing them.
- **Off-canvas is already self-clearing.** On `pointerleave` the installed `@deck.gl/core` 9.3.9 sets its pick request to `x = -1, y = -1` (`dist/lib/deck.js:146-170`) and still runs the hover callback, so `onHover` emits `null` and nothing stands.
- **A programmatic pick exists**: `Deck.pickObject({x, y, radius})`, synchronous on a WebGL device (`_resolveInternalPickingMode`), marked `@deprecated WebGL only` in the installed dist beside `pickObjectAsync`.
- **The refusal is threshold-first**: `onHover` checks `isBelowPickResolution` (declared `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 2`) *before* `resolvePick`, and only then emits. `reevaluateStandingHoverOnCameraChange` re-runs only that threshold and never re-asserts an id — its doc comment ("deliberately NOT a re-pick") is precisely what this piece reverses, under ADR-010 rule 6's "declared, not discovered".

### Scope

One named piece: when a readout was standing and the camera settles, confirm it with **one real pick at the pointer's last known position** instead of clearing it. Renderer/shell only; no protocol, no wire, no ADR decision reopened; both residency arms via the existing `activeBatches()` accessor.

### Design

1. **Settle is defined here, by declaration.** A trailing-edge settle on camera changes: every site that updates `currentZoomRef` (interactive `onViewStateChange`, `fitToExtent`, the DEV seam) also calls `scheduleHoverRepick()`; the pick runs when one settle gap passes with no further camera change. Constant declared in the canvas's own constants file (rule 6), reusing `streaming/debounce.ts` rather than a second timer idiom (open question 2 fixes its value).
2. **Instants named, ADR-018 vocabulary, no figure published.** `camera_change_seen` (each camera-change call), `camera_settled` (the gap elapses with no further change), `readout_confirmed` (the re-picked readout is emitted). The settle constant is a class-(a) declared cadence bounding *camera-change events coalesced*, never presented as a latency bound; the piece publishes no timing number.
3. **The re-pick reads the pointer's last position; no fresh pointer event is required.** A `lastPointerPxRef` is written in the deck `onHover` callback from the picking info's screen x/y (all branches, including the null one), with `x < 0 || y < 0` (deck's pointerleave sentinel) recorded as *off canvas*. This is the whole point of the piece: the human's gesture is a stationary pointer.
4. **Mid-gesture, nothing stale is served.** While changes keep arriving, the existing synchronous re-evaluation still runs: below threshold → the named refusal; otherwise the standing id is either cleared as today or held with a declared "unconfirmed" marking (open question 1). Either way an unmarked id that is no longer confirmed is never shown (ADR-010 rule 5, principle 8).
5. **At `camera_settled`, exactly one pick.** Armed only if (a) a readout was standing when the first camera change of this burst arrived, and (b) the pointer is on canvas. The pick goes through the same path `onHover` uses — `deck.pickObject` at the stored pixel → `batchForLayerId(activeBatches(), …)` → threshold check → `resolvePick` — so the refusal still wins over any id, and the id is a re-picked GPU ordinal resolved to a stable id, never a retained string.
6. **One emission choke point.** The result is emitted through `emitHoverReadout`, so `lastHoverReadoutRef` keeps mirroring what the operator sees.
7. **Bounded, never blocks (principle 7).** At most one outstanding timer; a real `onHover` supersedes and cancels it (the pointer path owns the readout again); the timer is cancelled on unmount beside the existing `coalescedRenderRef.cancel()`. If settle never arrives — a gesture that never pauses — no pick ever runs and the readout stays at its mid-gesture value; nothing accumulates and nothing waits.
8. **The pure decision is extracted and exported for unit tests**, following this file's established pattern (`applyStyleChange`, `protectionSetFor`, `shouldScheduleTileRender` are exported from `WorkingCanvas.tsx` and unit-tested): one function deciding *mid-gesture* readout, one deciding *at-settle* readout from (armed, on-canvas, threshold, pick outcome).
9. **Residency / partial views.** The re-pick resolves only against `activeBatches()`. Over a tile not yet resident the pick finds nothing (or a layer with no active batch) → the readout clears; nothing is guessed and nothing is invented from a tile that has not arrived. A later tile ingest does **not** re-arm the re-pick in this piece (open question 3).
10. **Observability.** One `renderTrace` event at `readout_confirmed` naming that a re-pick produced this readout (and, for entry 47's second half and entry 58, the pixel it picked at and what it resolved to). Without it neither the E2E nor the session log can distinguish "confirmed by re-pick" from "stale and retained" — which is the whole difference this piece introduces.

### What changes where

- `frontends/shell/src/canvas/WorkingCanvas.tsx` — hover site, the new pointer-position and armed refs, the settle scheduler, the three camera-change call sites, unmount cancel, the two exported pure decisions.
- `frontends/shell/src/canvas/pickResolution.ts` — `reevaluateStandingHoverOnCameraChange` becomes the *mid-gesture* decision; the settle decision is added beside it; the "deliberately NOT a re-pick" paragraphs are rewritten to declare the re-pick (rule 6).
- `frontends/shell/src/diagnostics/renderTrace.ts` — one trace function beside `traceViewState`/`traceCandidateResidencyStatus`.
- Tests: `canvas/pickResolution.test.ts`, `canvas/WorkingCanvas.test.ts`, `e2e/regression.mjs` (`stepK6`).
- Records: `MANUAL-WALKTHROUGH.md` L7/L8 expected text, `DECISIONS-PENDING.md` entry 47 closing note, KNOWN-LIMITATIONS item 13's hover-readout clause and `NEXT-CUT.md`. No ADR text changes proposed.

### Pre-committed tests

**Unit — `pickResolution.test.ts`.** Stay unchanged in meaning: (a) standing id + crossing below → refusal; (d) standing refusal still below → no redundant re-emit; (e) nothing standing → no-op. Change: (b) standing id + still above threshold and (c) standing refusal + back above threshold are now *mid-gesture* decisions, with new settle-decision cases beside them — re-pick returns the same id → that id is emitted as confirmed; returns a different id → the new id; returns nothing → clear; below threshold at the new camera → the refusal, whatever the pick returned.

**Unit — `WorkingCanvas.test.ts` (fake timers).** N camera changes inside one gap → exactly one pick; a change inside the gap restarts it; off-canvas → no pick; a real `onHover` between change and settle cancels the pending pick; unmount cancels; the emitted readout goes through the one choke point.

**E2E — `stepK6` replaced in place** (same step id, new contract, `K6_REFUSAL_TEXT` verbatim and unchanged; no `page.mouse.move` premise unchanged):
- (i) continuous "Zoom to layer" from a real above-threshold hover → the refusal text: **stays**, now asserted after settle within the step's existing bound.
- (ii) discrete ≥ 8 notches: the assertion "the pre-zoom id after any notch = failure" **is removed** — under the new contract a re-confirmed id is correct. It is replaced by: no readout is ever an *unconfirmed* id (no confirming trace event), and the final state is either the refusal or an id the trace names as re-picked at that camera.
- (iii) **new, the human's own failing case**: hover a large feature, one discrete zoom-out notch, pointer stationary → the same id still shows, and the trace says it was re-picked.
- (iv) **new, bounded**: during a continuous notch burst the page keeps answering a fresh probe and never shows an unmarked stale id.

### Expected outcomes

L7/L8 re-run: a screen-sized feature keeps its id across a one-step zoom-out; a genuine sub-pixel state still refuses by name; K6 green on the default arm; A9′'s flakiness unchanged by this piece (entry 58 stays open unless open question 6 says otherwise).

### Falsification

The piece is wrong if any of these is observed: an id shows at settle that is not the feature under the pointer (then entry 47's undiagnosed pick-accuracy half is *inside* this contract, not beside it); an unmarked id survives a camera change without a confirming re-pick; the refusal is displaced by an id at a camera where the average feature extent is below the declared threshold; the canvas fails to answer a probe during or after a settle burst; the human's re-run still reads as clunky (blank-then-restore flicker) — that falsifies the mid-gesture choice, not the settle mechanism.

### What it does NOT do

No per-frame picking; no re-pick without a standing readout or with the pointer off canvas; no re-arm on tile ingest; no "not resident yet" readout state; no diagnosis of the pick-accuracy half or of A9′; no pick-radius change; no LOD, no wire change, no ADR reopened; no timing figure.

### Gates

Architect (ADR-010 rules 1/5/6, ADR-028 item 4, principles 7/8; the re-pick declared, the settle constant declared, no coordinate leak) **and** reviewer (the decisions pure and unit-tested, one emission choke point, timers cancelled, the E2E asserting the shipped contract). The K6 rewrite is reviewer-gated as an E2E contract change.

### Open questions for the human

1. Mid-gesture: blank-then-restore, or hold the id marked "unconfirmed" until settle — and if marked, in what words?
2. The settle constant: reuse `VIEWPORT_QUERY_MIN_INTERVAL_MS` (120), or declare the canvas's own?
3. Under a partial view, a re-pick over a not-yet-resident tile clears. Does the piece (a) leave it, (b) re-arm on tile ingest, or (c) add a distinct "not resident here" readout state?
4. Is `stepK6` replaced in place, or kept and extended with the new cases as K6b?
5. Is a new `renderTrace` event acceptable as the confirmed-vs-retained signal the E2E needs?
6. Does this piece also carry entry 47's undiagnosed pick-accuracy half and entry 58's A9′ diagnosis, or do they stay separate?
7. Sync `pickObject` (deprecated in the installed dist) or `pickObjectAsync`?
8. Does a pure **pan** settle re-pick too (today a pan clears), or zoom only?

**Recommendation (single, the drafting agent's — not a ruling):** ship the settle mechanism with the mid-gesture behaviour left as today (blank), question 1 answered only after the human sees it in an L7/L8 re-run.

### Critical files for implementation
- `frontends/shell/src/canvas/WorkingCanvas.tsx`
- `frontends/shell/src/canvas/pickResolution.ts`
- `frontends/shell/e2e/regression.mjs`
- `frontends/shell/src/canvas/pickResolution.test.ts`
- `frontends/shell/src/streaming/debounce.ts`
