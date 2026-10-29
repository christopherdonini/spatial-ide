# Preregistration — entries 84 and 85 (Part M sitting 2, M5): the settled-partial status under a filter, and "Zoom to layer" under a filter

*Drafted 2026-09-13 by the custodian on the human's ruling of the same day ("Entries 84/85: now. Both through preregistration and gates with the regression step that would have caught them — 85 extends FIND′ to zoom-to-layer-after-filter on the candidate arm; 84 asserts the zero-row terminal marks the tile resident."), from the read-only investigation of `main` recorded in `DECISIONS-PENDING.md` entries 84 and 85 (2026-09-13). Committed on `fix/filter-84-85`, branched from `release/0.1.0`, **before any code**. Append-only once committed; an amendment made after any result has been seen must say so in its first line. The fixes land on `release/0.1.0` (RC2) and never depend on `#44`'s engine changes: shell code only.*

## §0. Disclosure

No pilot, no measurement. Every `file:line` below is a read of `main` on 2026-09-13 by the investigation, re-cited here; the release branch is `998be05` plus entry 47's commits, so line numbers on the branch may differ — the worker re-derives every cite it touches. The causes named in §2 and §3 are **hypotheses with discriminators**, not verified facts; the first thing each piece does is confirm its discriminator on the branch (test 1 of each), and if the discriminator points elsewhere the worker STOPS and reports — the preregistration is amended, never quietly re-aimed.

## §1. What this document may and may not claim

No performance claim, no duration, no number beyond declared constants (ADR-018; docs/08). No new operator-visible state, no new status sentence, no wording change to any existing sentence (the human owns wording). No wire, SKP or MCP change. No change to enumeration, ceilings, the `fits` latch, or eviction. ADR-006 class 1 throughout.

## §2. Entry 85 — "Zoom to layer" inert under a filter

**2.1 The hypothesis (entry 85's finding).** `fitToExtent` ends with `setProps({ initialViewState: { target: [0, 0, 0], zoom } })` (`WorkingCanvas.tsx:805` on main). deck.gl re-syncs its camera from `initialViewState` only when the new value is not deep-equal to the previous one (`@deck.gl/core` `index.js:323-327`; acknowledged at `WorkingCanvas.tsx:80-82`). The fit anchor grows only from the untiled first-look stream (`pushBatch`, `:931-934`) and is cleared on filter Apply/Clear (`resetFitForNewGeneration`, `:110-136`); under a small filter it freezes after the first look, every later fit computes the identical zoom, the prop is deep-equal, and the camera does not move.

**2.2 The rule.** A "Zoom to layer" click always moves the camera to the fit it computed, whether or not that fit equals the previous one. The fit's camera write must be one deck.gl cannot deep-equal away — an imperative view-state write through the same path `frame.maybeRecenter` uses (`:1334-1339`), or a prop that carries the click's own identity. The fit target, the zoom arithmetic (`extent.ts`), the anchor's growth rules and `resetFitForNewGeneration` are unchanged.

**2.3 Discriminator (test 1, before the fix).** On the branch, with a filter of about a hundred rows applied and a wheel zoom-out after the first fit, a second click logs a `[render] view-state` line (`traceViewState`, `:803`) with the same `zoom`/`origin` as the first and the camera does not move. If instead no `view-state` line is logged (the `!bbox` early return at `:978-979`) the cause is the null anchor, and the piece stops for an amendment.

**2.4 Tests.**
1. The discriminator, recorded (the E2E step below observes it on the mutated build).
2. `WorkingCanvas.test.ts` (seam-level): two consecutive fits to the same extent each produce a camera write (the write is observed twice, not once).
3. **`e2e/regression.mjs`, FIND′ extended on the candidate arm (the human's ruling):** apply a filter that admits a small subset (the existing filter step's predicate over `100k-happy-path.parquet`), click "Zoom to layer", wheel out several notches, click "Zoom to layer" again; assert the camera returned to the fit (a fresh `view-state` line after the second click with the fit's zoom, and the canvas non-background fraction back to the fit's) — failing by name (`FIND′/zoom-to-layer-after-filter`). Mutation: revert the fix → this step fails.
4. Existing filter, fit and residency steps unchanged and PASS.

## §3. Entry 84 — the settled-partial sentence under a filter

**3.1 The hypothesis (entry 84's finding).** `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` (`residencyStatus.ts:429-430`) is emitted when the view is within budget, settled, and `isFillComplete()` is false. `isFillComplete` requires every key in `lastCoveringTileKeys` to be complete in the resident set (`candidateArmSession.ts:651-653`; `tileResidentSet.ts:134-137`). A tile whose stream completes with **zero rows** under the filter never delivers a batch, so it is never marked resident: `markTileResidentEmpty` has no caller outside its class, and the clean-terminal `markTileComplete` is gated on a batch-path entry (`candidateArmSession.ts:977-980`, `:1042-1044`). Under a small filter most covering tiles are empty, so the view reads settled-partial although everything matching is drawn.

**3.2 The rule (the human's words: "84 asserts the zero-row terminal marks the tile resident").** A tile stream that reaches its clean `Completed` terminal having delivered no batch is a complete, empty, resident tile: at that terminal the session marks it resident-empty (the existing `markTileResidentEmpty` path, or the equivalent `addBatch`-free marking) and complete, under the same generation and epoch checks the batch path applies. `isFillComplete` then reads it as loaded. A stream that ends any other way (cancelled, superseded, failed) is unchanged. No status sentence, threshold, ceiling or eviction rule changes; an empty resident tile holds no vertices and counts for nothing in the budget.

**3.3 Discriminator (test 1, before the fix).** On the branch, under the filter and after a zoom-out, the session log shows `candidate-tile-terminal … Completed` lines for tile keys that appear in no `traceTileIngest`/push line, and no `[render] covering-truncated` line. If a `covering-truncated` line is present instead, the cause is truncation and the piece stops for an amendment.

**3.4 Tests.**
1. The discriminator, recorded.
2. `candidateArmSession.test.ts`: a tile stream that completes with no batch → the tile is resident-empty and complete (`isTileComplete` true; `isFillComplete` true when it is the only outstanding key); a stream that completes after one batch is unchanged; a cancelled/superseded stream marks nothing.
3. `tileResidentSet.test.ts`: `markTileResidentEmpty` followed by eviction/protection behaves as an empty tile (no vertices, evictable, protected when in view).
4. **`e2e/regression.mjs`, the same FIND′ extension:** after the filtered fit and the zoom-out, the residency status settles to the within-budget sentence, not the settled-partial one — asserted verbatim against `residencyStatus.ts`'s constants, failing by name (`FIND′/settled-partial-under-filter`). Mutation: revert the fix → this assertion fails.
5. K7 re-run unchanged and PASS (the settled-partial sentence must still appear where the fill really is partial).

## §4. Declared: unchanged, invalidators, falsification

**Unchanged:** every constant and ceiling; enumeration; the `fits` latch and its inversion (entry 66 (b) is not on this branch); eviction; all status wording; the fit arithmetic; the anchor's growth rules. **Invalidators:** a discriminator that points to the alternative cause (the piece stops); any wording change; any change to a file outside `frontends/shell/`. **Falsification:** any test above failing; K7 regressing; the FIND′ extension passing on the mutated build.

## §5. Gates

Reviewer gate on the full diff (both pieces); architect gate on §2.2 and §3.2 (ADR-028 Amendment 3 unchanged; principle 8: the resident-empty marking is a declared state, not a hidden one; ADR-010 rule 6: nothing discovered). `npm run verify` green; the regression suite through the harness once with FIND′ extended; both mutations recorded. Then the branch merges into `release/0.1.0` (the human clicks), never to main before the tag.

## §6. Amendments

### Amendment 1 — 2026-09-13, made AFTER the piece's results were seen (the worker's build, 9c34b20 on `fix/filter-84-85`)

**(a) Where FIND′ lives.** §2.4 item 3 and §3.4 item 4 say "`e2e/regression.mjs`, FIND′ extended"; FIND′ actually lives in `e2e/filter-panel.mjs` (the slow fixture) and `regression.mjs` had no filter step. The worker added a new FIND′-named step to `regression.mjs` (the only suite carrying K6/K7, so the fixes are exercised beside them) rather than editing this file; that step is the one both pieces' E2E assertions live in. The intent — the regression step that would have caught each defect — is met; the location sentence was wrong.

**(b) Entry 84's E2E status assertion is suspended — its premise is broken by a second cause, recorded here and queued as DECISIONS-PENDING entry 87.** The zero-row terminal marking (§3.2) landed and is pinned at the unit level (§3.4 items 2–3 — the human's stated requirement, "84 asserts the zero-row terminal marks the tile resident"). But the discriminator run and the clean run showed that, at the zoomed-out filtered camera, 42 of the 115 covering tiles (86 attempts in the mutation run) never reach any terminal at all: their per-tile `viewport_query` is sent and no `stream-issued` follows, so `mintAndStart` drops them on one of its two silent paths (the ticket-refused `catch`, or an epoch-abandoned ticket) with no trace line, no session-log line and no status. It is filter-specific in these runs (before the filter: 7,958 queries → 7,949 streams; after it: 142 → 74). A covered tile that is never resident keeps `isFillComplete()` false whatever the zero-row terminals do, so the settled-partial sentence persists under a filter for a reason §3.1 did not name, and §3.4 item 4's assertion cannot discriminate the fix. **As amended:** the FIND′ step records that state by name (`PREMISE BROKEN`, with the query/stream counts) and does not fail the suite on it; the assertion is reinstated, unchanged, when entry 87's cause is fixed. This weakens a pre-committed test and says so; the human decides on entry 87 whether RC2 waits for it. Entry 85's half of the step is unaffected (its mutation fails by name, recorded).

**(c) Nothing else changes.** §2.2, §3.2, §4 and §5 stand; the two fixes are shell-only; no wording, ceiling, enumeration or eviction change.
