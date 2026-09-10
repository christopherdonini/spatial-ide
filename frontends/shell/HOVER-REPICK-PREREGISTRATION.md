# Preregistration — entry 47: the hover readout's re-pick on camera settle

*Drafted 2026-09-10 by the architect agent on the custodian's brief; committed by the custodian on `cut/hover-repick-settle` before any code, under the human's authorization of 2026-09-10 ("Build the two first-post-tag pieces on branches now, through their full gates … entry 47's re-pick on camera settle (anchored to the existing viewport-query debounce). Merges held until after the tag; their operator rows queue into the next sitting bundle per rule 11."). One sentence adjusted at filing, marked in §3 D3.*

**Committed before any code exists.** Every design decision, test, gate, non-goal and falsifier below is fixed by this commit. An amendment made after any implementation or felt result has been seen **must say so in its first line** and invalidates the work it touches. This file is **append-only once committed** — amendments are dated additions, never edits, per this repository's convention (`frontends/shell/RESIDENCY-PREREGISTRATION.md` header).

**Authority.** The human's ruling of record on DECISIONS-PENDING entry 47 (2026-09-06), its sharpening (2026-09-07), its queue placement (2026-09-08), and the human's authorization to build it on a branch through its full gates with the merge held until after the v0.1.0 tag. The design questions this document closes that the ruling did not answer are marked either **anchored by the human** (§2d) or **PROPOSED-PENDING-SIGHT** (§3 D3); nothing else is invented here.

**Semantics of the shipped strings are not defined here.** No user-visible string changes: `K6_REFUSAL_TEXT` (`frontends/shell/e2e/regression.mjs:1059`) and the id readout stay verbatim as shipped.

---

## 0. Disclosure: no pilot, no code, no measurement informs this document

No branch, no spike, no probe. This file rests on the brief `RELEASE-DRAFTS-0.1.0/post-tag/entry-47-repick-brief.draft.md`, the architect consult `RELEASE-DRAFTS-0.1.0/post-tag/architect-consult-lod-47-66b-ordering.md` (§1B, §2 conditions 8–14), and files read directly at `main`. Stated rather than omitted, per the precedent's §0.

---

## 1. What this document may and may not claim

- **No timing figure is published by this piece, ever.** No `docs/08` row is added, amended or scored against; no latency number appears in any commit, PR, walkthrough row or trace read-out.
- **The three instants this piece names — `camera_change_seen`, `camera_settled`, `readout_confirmed` — are this document's own, an extension of ADR-018's discipline, not ADR-018 vocabulary.** ADR-018's own three are `cancel_requested` / `cancel_observed` / `cancel_quiescent` (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:43-47`). What is borrowed is the class-(a) rule (`:82-88`): a declared cadence bounds the quantity it actually bounds — here *camera-change events coalesced before one re-pick* — and **may never be presented as a latency bound**.
- **No ADR is reopened, amended or cited as settled.** ADR-011 is not cited at all.
- **This piece diagnoses nothing.** The entry-47 pick-accuracy half and entry 58 (A9′) stay separate (§10).
- **No protocol, wire, SKP or MCP surface is touched.** Renderer/shell only; both residency arms through the existing `activeBatches()` accessor (`frontends/shell/src/canvas/WorkingCanvas.tsx:684`).

---

## 2. The ruling and its inputs, verbatim

### 2a. The ruling of record (`DECISIONS-PENDING.md:946-949`)

> **RULED 2026-09-06, the human, verbatim:** *"Entry 47 = (b), re-pick on camera settle, as its own named piece on the NEXT cut — not this close-out; the pick-accuracy half stays recorded verbatim for that piece's repro, undiagnosed."*

### 2b. The sharpening (`DECISIONS-PENDING.md:950-963`; quoted with the record's own typos)

> **Criterion sharpened by the human at the 2026-09-07 zoom-out re-run (48-(a) build), verbatim:** *"One thing have not been fixed though. Once i zoom in to a feature and hover over one, even if the feature is as big as the screen whole itself, if i zoom out by just one step, so the feature is still big AF, the id status text disappear. Now this is wrong, as long as I can tell on which feature I'm hovering, there's no reasono to remove the id."*

The same entry states the binding criterion drawn from those words: *"the id stays for as long as the operator can tell which feature is under the pointer"*; *"only a genuine below-pick-resolution state may replace it with the refusal text; a screen-sized feature losing its id on a one-step zoom-out is the failing case the piece must pin with a test."*

### 2c. Queue placement (`DECISIONS-PENDING.md:62`)

> *"47 = next cut's first piece; A9′ flakiness gets its own entry."*

### 2d. The human's anchor closing the draft's open question 2 (2026-09-10)

> **"anchored to the existing viewport-query debounce"**

Applied: the settle signal reuses `frontends/shell/src/streaming/debounce.ts` at `VIEWPORT_QUERY_MIN_INTERVAL_MS` (`frontends/shell/src/streaming/viewportStreamManager.ts:24`). **No new constant value is introduced.**

### 2e. Block-on-sight conditions (verbatim, consult §2 items 8–14; cited in every review of work under this file)

> 8. No re-pick at a stored pixel that does not re-validate the framebuffer it was captured against (ADR-010 rule 1, `:25`); a resize between capture and settle that still fires a pick fails on sight.
> 9. No stored pointer value beyond screen x/y; any `info.coordinate` access, in any of the three shapes the scan knows, fails on sight (ADR-010 rule 1; `canvas/noCoordinateLeak.test.ts:29-35`).
> 10. No settle constant that is not declared in a constants file with the quantity it bounds — camera-change events coalesced — and never presented as a latency bound (ADR-010 rule 6; ADR-018 `:82-88`).
> 11. No unbounded settle: at most one outstanding timer, superseded by a real `onHover`, cancelled on unmount; a gesture that never pauses runs no pick and accumulates nothing (docs/01 principle 7, `:13`).
> 12. No id emitted at settle that is not a fresh GPU-ordinal → stable-id resolution (ADR-010 rule 2); a retained string re-asserted across a camera change fails on sight (rule 5, `:68`).
> 13. No K6 contract change that leaves staleness detectable only by a trace the same code emits: the replacement must include at least one case whose correct answer is a *different* id or an absence, so the assertion can fail on the defect the removed one caught.
> 14. No new operator-visible readout state ("unconfirmed"), and no pan-settle behaviour, without the human's answer — both sit outside entry 47's ruled (b).

*(Note on the consult's own line cites for condition 14: they read `DECISIONS-PENDING.md:873-875` / `:877-890`; on this tree the ruling is `:946-949` and the sharpening `:950-963`. The conditions' text is unchanged; only the pointers are corrected.)*

---

## 3. The design, fixed before code

**D1 — Settle, defined by declaration.** Trailing-edge, one gap, existing mechanism, existing value: `debounce(fn, settleMs)` from `frontends/shell/src/streaming/debounce.ts:35`, whose contract is *"fired only after `settleMs` has passed with no further call"* (`:5-6`), at `VIEWPORT_QUERY_MIN_INTERVAL_MS = 120` (`viewportStreamManager.ts:24`), per §2d. **Exactly three sites call `scheduleHoverRepick()`**, each immediately after it writes `currentZoomRef.current` and calls `reevaluateHoverForZoom(...)`: the interactive deck handler `onViewStateChange` (`WorkingCanvas.tsx:1317-1322`), `fitToExtent` (`:793-802`), and the DEV-only view-state seam (`:1509-1533`). No fourth site; no per-frame arming.

Condition 10 is discharged **without a second number**: `VIEWPORT_QUERY_MIN_INTERVAL_MS` declares a *different* quantity at its own site (`viewportStreamManager.ts:20-22`, a client-side `viewport_query` issue-rate ceiling). The canvas's own constants file therefore declares a named binding — `HOVER_REPICK_SETTLE_MS`, **defined as** `VIEWPORT_QUERY_MIN_INTERVAL_MS`, never a fresh literal — whose doc comment states the quantity it bounds here (*camera-change events coalesced before one re-pick*), states that it is a declared cadence and not a latency bound, and states the **declared coupling**: changing the viewport-query constant changes the hover settle, deliberately, by the human's anchor.

**D2 — Mid-gesture behaviour is today's, unchanged.** While camera changes keep arriving, `reevaluateStandingHoverOnCameraChange` (`pickResolution.ts:119-131`) runs exactly as it does now: below threshold → the named refusal; otherwise → clear. **No "unconfirmed" state is introduced** (condition 14; listed in §10 as not decided). Its doc comment's "deliberately NOT a re-pick" paragraphs (`:97`) are rewritten to declare the re-pick as the *settle-time* behaviour and to restate the mid-gesture rule as this piece's own declared choice (ADR-010 rule 6, "declared, not discovered", `docs/adr/ADR-010-render-frames-origins-boundaries.md:70`).

**D3 — Pan and zoom settle alike. PROPOSED-PENDING-SIGHT.** The ruling's words are *"re-pick on camera settle"* (§2a); a pan is a camera change, and all three arming sites in D1 are camera-change sites without regard to axis. That is the reading this document adopts. Because condition 14 names pan-settle as outside the ruling, the reading is marked **proposed pending the human's sight at this preregistration**, per the precedent's own proposed-pending-sight discipline (`RESIDENCY-PREREGISTRATION.md` §4d/§4e, locked at Amendment 11). **The alternative, for the human:** zoom-only settle (arm only when `newZoom !== currentZoomRef.current`), which leaves a pure pan clearing the readout exactly as today and leaves the sharpened criterion (§2b) satisfied for zoom-out only. *Custodian's adjustment at filing (the architect's draft read "no code lands under either reading until the human answers"): the human has authorized building this piece now with the merge held until after the tag, so the code is built under the words' reading with the zoom-only alternative implemented as one declared, tested switch (`HOVER_REPICK_ON_PAN`, default the words' reading); the human's answer — DECISIONS-PENDING entry 75 — selects the value before any merge. The behaviour decision stays the human's; only the order of build and answer changes.*

**D4 — Framebuffer identity: a resize or DPR change between capture and settle DISARMS the pending re-pick.** ADR-010 rule 1 makes framebuffer identity and dimensions part of a screen coordinate's meaning (`ADR-010:25`). At capture, the piece records `canvas.clientWidth`, `canvas.clientHeight` (the CSS-pixel basis this file already uses, `WorkingCanvas.tsx:1348`, `:386`) and `window.devicePixelRatio` alongside the pixel. At settle, if any of the three differs, **the pending pick is dropped and nothing is emitted** — the standing readout keeps whatever mid-gesture value D2 left it. This is refusal-to-act, the cheap and safe answer, and it can never emit a confirmed id aimed at a stale frame. **The alternative, listed and not taken:** re-map the stored pixel into the new framebuffer and pick there. Not decided (§10).

**D5 — The stored pointer value is screen x/y only.** A `lastPointerPxRef` written in the deck `onHover` callback (`WorkingCanvas.tsx:1355-1379`) from the picking info's screen x/y, on **all** branches including the null one, with deck's pointerleave sentinel (negative x/y) recorded as *off canvas*. **No `info.coordinate` in any of the three shapes the scan matches** (`frontends/shell/src/canvas/noCoordinateLeak.test.ts:28-36`); rule 1's untagged renderer-local value is never read (condition 9).

**D6 — Exactly one pick at settle, through the same path `onHover` uses.** Armed only if (a) a readout was standing when the burst's first camera change arrived, (b) the pointer is on canvas, (c) D4's framebuffer identity holds. Then, in this order: `deck.pickObject` at the stored pixel → `batchForLayerId(activeBatches(), …)` (`:1365`) → `isBelowPickResolution(averageFeatureExtentRef.current, pixelsPerWorldUnitAtZoom(currentZoomRef.current))` (`:1374`, `pickResolution.ts:87-89`, threshold `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 2` at `:45`) → `resolvePick(batch, info.index)` (`:1378`). **Threshold first, then resolve** — the refusal always wins over any id (ADR-028 Decision item 4, `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:35-36`; 24(c) at `:65-68`). The id emitted is always a **fresh GPU-ordinal → stable-id resolution**, never a retained string (condition 12; ADR-010 rule 2 `:33`, rule 5 `:68`). One emission choke point: `emitHoverReadout` (`WorkingCanvas.tsx:656-662`), so `lastHoverReadoutRef` (`:654`) keeps mirroring what the operator sees.

**D7 — Bounded, and it never blocks (docs/01 principle 7, `docs/01_Principles.md:13`).** At most one outstanding timer. A real `onHover` cancels it (the pointer path owns the readout again). It is cancelled on unmount beside the existing `coalescedRenderRef.current.cancel()` (`WorkingCanvas.tsx:1292`). **A gesture that never pauses runs no pick and accumulates nothing** (condition 11).

**D8 — Residency.** The re-pick resolves only against `activeBatches()`. Over a not-yet-resident tile the pick finds nothing → the readout clears; nothing is guessed (principle 8, `docs/01:14`). **A later tile ingest does not re-arm the re-pick** in this piece.

**D9 — Observability, plus a discriminator the implementation cannot rubber-stamp.** One `renderTrace` event at `readout_confirmed`, beside the existing `traceViewState` / `traceCandidateResidencyStatus` (`frontends/shell/src/diagnostics/renderTrace.ts:52`, `:112`), naming that a re-pick produced this readout and what it resolved to. **The trace is not sufficient by itself** (condition 13): the replacement K6 includes at least one case whose *correct answer is a different id or an absence* — a camera change (a zoom-out step, or the pan of D3) chosen so that a **different feature** sits under the same stationary pixel afterwards, asserted as `re-picked id ≠ retained id`. A build that emits the trace and retains the old id fails that case.

**D10 — The pure decisions are extracted, exported and unit-tested**, following the file's established pattern (`applyStyleChange`, `protectionSetFor`, `shouldScheduleTileRender` are already exported from `WorkingCanvas.tsx` and unit-tested): one *mid-gesture* decision (D2, the existing function) and one *at-settle* decision taking `(armed, onCanvas, framebufferIdentical, belowThreshold, pickOutcome)` and returning the readout to emit or "emit nothing".

---

## 4. What changes where

`frontends/shell/src/canvas/WorkingCanvas.tsx` (hover site, the pointer/framebuffer/armed refs, the settle scheduler, the three D1 call sites, unmount cancel, the exported settle decision) · `frontends/shell/src/canvas/pickResolution.ts` (mid-gesture decision relabelled; settle decision beside it; the "NOT a re-pick" paragraphs rewritten as declarations) · the canvas constants file (`HOVER_REPICK_SETTLE_MS`, `HOVER_REPICK_ON_PAN`, D1/D3) · `frontends/shell/src/diagnostics/renderTrace.ts` (one function) · tests (`canvas/pickResolution.test.ts`, `canvas/WorkingCanvas.test.ts`, `e2e/regression.mjs` `stepK6` at `:1129`) · records (`MANUAL-WALKTHROUGH.md` L7/L8 expected text, `DECISIONS-PENDING.md` entry 47 closing note, KNOWN-LIMITATIONS' hover clause, `NEXT-CUT.md`). **No ADR text changes proposed.**

---

## 5. Pre-committed tests (fixed here; a test added later that weakens any of these is an amendment)

**Unit — `pickResolution.test.ts`.** Unchanged in meaning: (a) standing id + crossing below → refusal; (d) standing refusal still below → no redundant re-emit; (e) nothing standing → no-op. Relabelled as *mid-gesture*: (b) standing id, still above threshold; (c) standing refusal, back above threshold. **New settle-decision cases:** re-pick returns the same id → emitted as confirmed; returns a **different** id → the new id; returns nothing → clear; below threshold at the new camera → the refusal whatever the pick returned; framebuffer changed → **nothing emitted** (D4); not armed / off canvas → nothing emitted; the pan switch off → a pure pan arms nothing.

**Unit — `WorkingCanvas.test.ts` (fake timers).** N camera changes inside one gap → exactly one pick; a change inside the gap restarts it; off canvas → no pick; a real `onHover` between change and settle cancels the pending pick; unmount cancels; a resize/DPR change between capture and settle → no pick; every emission goes through the one choke point.

**E2E — `stepK6` replaced in place** (same step id, `K6_REFUSAL_TEXT` verbatim and unchanged), four cases: **(i)** continuous "Zoom to layer" from a real above-threshold hover → the refusal text still, asserted after settle within the step's existing bound. **(ii)** discrete ≥ 8 notches: today's falsifier ("the pre-zoom id after any notch = failure") is removed as the new contract makes a re-confirmed id correct; replaced by "no readout is ever an id without a confirming trace event at that camera". **(iii)** the human's own failing case (§2b): hover a large feature, one discrete zoom-out notch, pointer stationary → the same id still shows and the trace names it re-picked. **(iv) the discriminator (condition 13):** a camera change chosen so a *different* feature lies under the same stationary pixel → the emitted id must **differ** from the retained one (or, where the correct answer is nothing resident there, the readout must be absent). This case fails on the exact defect (ii)'s removed assertion caught.

`e2e/regression.mjs:985-988` already anticipates this replacement and states both current cases must still pass under the new mechanism; they do, as (i) and (ii).

---

## 6. Operator verification

`MANUAL-WALKTHROUGH.md` rows **L7 and L8 are re-run by the human**, felt verdict only, **no durations, no timing claim**. They are **committed with a blank result log and queued into the next accumulated sitting bundle** per `AI_DEVELOPMENT.md` (rule 11) — this piece never demands same-day operator time.

---

## 7. Gates

**Architect** — ADR-010 rules 1 (framebuffer identity, no untagged coordinate), 5 (staleness signalled, never silently served), 6 (the settle cadence and the threshold declared, not discovered); ADR-028 Decision item 4; docs/01 principles 7 and 8; block-on-sight conditions 8–14 (§2e) checked one by one. **Reviewer** — decisions pure and unit-tested, one emission choke point, timers cancelled, the E2E asserting the shipped contract; the K6 rewrite is reviewer-gated as an E2E contract change. **Merge held until after the v0.1.0 tag**, per the human's authorization; the human's answer to entry 75 selects `HOVER_REPICK_ON_PAN` before any merge.

---

## 8. Declared non-goals

No per-frame picking · no re-arm on tile ingest · no pick-radius change · no new operator-visible readout state · no wire, SKP, MCP or `viewport_query` change · no ADR reopened, amended or cited as settled · no `docs/08` row · **no timing figure of any kind** · no LOD · no macOS/Linux claim.

---

## 9. Falsification

The piece is wrong if any of these is observed: an id shows at settle that is not the feature under the pointer (then the undiagnosed pick-accuracy half is *inside* this contract, not beside it); an id survives a camera change without a confirming re-pick; the refusal is displaced by an id at a camera below the declared threshold; a pick fires against a framebuffer other than the one its pixel was captured against; the canvas fails to answer a probe during or after a settle burst; the human's L7/L8 re-run still reads as clunky (blank-then-restore flicker) — which falsifies the mid-gesture choice (D2), not the settle mechanism.

---

## 10. What is NOT decided by this document

1. **The "unconfirmed" mid-gesture marking** — outside the ruling (condition 14); D2 keeps today's behaviour; the human may open it after seeing L7/L8.
2. **Resize/DPR re-mapping** — D4 disarms; re-mapping the stored pixel into a new framebuffer is unbuilt and unruled.
3. **Pan-settle** — D3 adopts the reading the ruling's words force, marked PROPOSED-PENDING-SIGHT; zoom-only is the declared switch's other value; the human's answer (entry 75) selects before merge.
4. **Entry 58 (A9′ flakiness)** stays a separate entry; the recommendation to diagnose it alongside this piece is not adopted here.
5. **Entry 47's pick-accuracy half** stays recorded verbatim and undiagnosed, per the ruling's own words (§2a).

---

## 11. ADR touches

Nothing accepted is amended. Cited: **ADR-010** rules 1 (`:25`), 2 (`:33`), 5 (`:68`), 6 (`:70`, and the style-dependence note at `:74`) · **ADR-018** `:43-47` (whose vocabulary this piece does *not* claim) and `:82-88` (the class-(a) cadence discipline it does apply) · **ADR-028** Decision item 4 (`:35-36`) and 24(c) (`:65-68`) · **docs/01** principles 7 (`:13`) and 8 (`:14`). ADR-006 class 1 (ephemeral) throughout: nothing durable is written.

---

## 12. Amendments

*(none — this file is committed before any code exists)*
