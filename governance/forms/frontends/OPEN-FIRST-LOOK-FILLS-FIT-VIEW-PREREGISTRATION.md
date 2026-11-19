# shell: when a first look ends Completed and no plan has run, the map plans the tiles of the view it shows, so that view fills without a pan and the status line speaks; full form, both gates

*File: `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md`. PLAN node `open-first-look-fills-fit-view`.*
*Drafted by the architect (claude-opus-5-5) for the custodian, read only, at main 26141ebedc900de0d4f4eefb9a7332d6c8ac791d; it revises the draft of 2026-11-12 at 6e041829 (`state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`). The custodian commits it before any code.*
*Committed by the custodian at S0, at main 6c46d3b2, with the advisor's ruling ADV-2026-11-18-16 items 1 to 7 applied, each marked by the ruling's id where it lands.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-16-06 item 2 (a): what the user is told about a partial view; also cancellation and the size, §7; ADV-2026-11-18-16 item 6).*
*PR B (1d2d4af9), #311 and S1 (18802abd) are on main. Code starts at dispatch, once §8's overlap check is recorded.*

## §0 Disclosure

**0.1 Authority.**
- The human's third message of 2026-11-12, `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md`: item 3 (a), the node, graded S1, with v0.2 waiting for it; item 3 (b), item 64, which this node withdraws; item 2, the reading rule for a typed check; item 8, the order.
- ADV-2026-11-13-02, `state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-02-first-look-open-2-ii-every-first-look-open-8-item-18-words-after-the-code.md`, the advisor's wording under the delegation of 2026-11-13:
  - item 1: OPEN-2 (ii), every first look. **This is a scope change on item 3 (a), recorded here:** the node covers the open's first look and the one after an Apply or a Clear;
  - item 2: OPEN-8, the item-18 retirement form, words written after the code;
  - item 3: the draft's other OPEN items take its recommendations at this form's commit.
- ADV-2026-11-14-15, `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-15-pr-b-open-4-a-the-re-issue-stays-residency-not-edited-the-move-stated-in-item-51-a-read-before-code-a-refill-node.md`, item 6 (b).
- ADV-2026-11-14-18, `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-18-the-step-1-read-stands-colour-by-refill-keeps-the-view-placed-after-the-first-look-node-s3-filler-queue.md`:
  - item 3: the Colour-by refill is a third caller of the first look; §2.1 and §4 (U-FL5) answer it;
  - item 4: item 51's 10,000-row clause goes with item 64's words.
- ADV-2026-11-16-06, `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md`:
  - item 1 (a): the slot;
  - item 1 (c): §3 answers it;
  - item 2: the class, and what is filed;
  - item 3: runs;
  - item 4: regions (§8);
  - item 5: models.
- ADV-2026-11-18-09, `state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-09-s1-takes-the-fix-the-completed-terminal-after-a-plan-moves-to-s1-the-success-case-claimed-the-on-main-words.md`, item 3: this node keeps the `Completed` terminal where no plan has run. The same in S1's form, `governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md`, is Amendment 2 item 3.
- ADV-2026-11-18-16, `state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-16-the-first-look-form-the-five-questions-all-taken-the-class-and-one-piece-the-workers-model-by-step.md`, the advisor's wording under the delegation of 2026-11-13:
  - item 1: the first look's terminal calls `handleViewportChange` directly, from this block alone (§2.1). Within P-B this replaces the accept-function route that ADV-2026-11-13-02 item 3 took with the first draft;
  - item 2: **a scope change on the last sentence of item 3 (a) of the human's third message of 2026-11-12, recorded here by this ruling:** G2's comment words are not added and `recentre-crossing.mjs` is not edited, because the comment #311 landed meets G2's finding (§10.4);
  - items 3 and 4: OPEN-10 and OPEN-11 (§12; §7, S2);
  - item 5: the not-covered case of §3, and the reviewer's probe of it (§9);
  - item 6: the class, and one piece;
  - item 7: the model, by step (§7).

**0.2 Evidence, not Authority.**
- The OPEN-C consult, `state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md`, §1 to §4, and G1 and G2 by name. No new numbers are added here.

**0.3 The reuse index.** Byte-copied from the custodian's briefs and marked so. Run in the read-only clone at 89bbac3.

```text
$ node tools/reuse.mjs plan tiles for fit view on open   (exit 1)
No prior art recorded for "plan tiles for fit view on open". Research it before planning an implementation.
$ node tools/reuse.mjs first look partial view status line   (exit 1)
No prior art recorded for "first look partial view status line". Research it before planning an implementation.
$ node tools/reuse.mjs initial viewport tile request after fit to extent   (exit 1)
No prior art recorded for "initial viewport tile request after fit to extent". Research it before planning an implementation.
No prior art recorded for "tile viewport fit first look". Research it before planning an implementation.
```

All four searches missed. §2 rests on this repository's code.

**0.4 Cites.** By symbol, at main 26141ebe. The 2026-11-12 draft's pins at 6e041829 are historical; the tree at the base is authoritative. Rulings are cited by file and item.

## §1 The defect

- The tile arm's one-shot fit (`pushTileBatch` → `fitToExtent(…, false)`) reports no viewport. It gives the box only to `onViewShown`.
- The grid frame exists only from the first look's terminal (`establishFrameFromExtent`). Before that, `TileViewportStreamManager.onCameraChange` returns `no-frame`.
- Planning runs only from `handleViewportChange`, which the debounced `onViewportChanged` reaches.
- `settledState` reads not-settled while `hasPlanned` is false, so `emitResidencyStatus` is silent.
- So after a first look that ends `Completed`, the view holds the first look's rows (at most `UNTILED_FIRST_LOOK_ROW_LIMIT`) and the status says nothing until a pan or zoom. That holds for each of the three callers of `reissueUnrestricted`:
  - the open (App's session construction);
  - an Apply or a Clear (`applyFilter` through `issueQueryRef`);
  - the Colour-by refill (App's colour-column effect through `issueQueryRef`, since 1d2d4af9).
- A pan reported before that terminal meets `no-frame`, and nothing plans at the terminal (item 64's timing case).
- Not this node's: a first look that fails before any plan now speaks, by S1's branch (W1, W2 or the partial-failure sentence). A terminal after a plan is S1's too.

## §2 The change

### 2.1 Placement P-B: plan the shown view at the first look's Completed terminal

**Where.**
- `frontends/shell/src/canvas/WorkingCanvas.tsx`: one read-only member on `WorkingCanvasHandle`, and its implementation in the handle object.
- `frontends/shell/src/residency/candidateArmSession.ts`: one block in `issueUntiledQuery`'s sink `onTerminal`, and the top doc comment's paragraph on why planning waits.
- No other product file changes.

**The canvas member.** `shownViewportBbox?(): AuthoritativeBbox | null`, declared after `currentView?`.
- It returns `computeAuthoritativeViewportBbox({ ...cameraRef.current, widthPx: clientWidth, heightPx: clientHeight })`, which is `onResize`'s unreported-branch computation.
- It returns null before the first camera write, or at a zero client size.
- It changes nothing and issues nothing.
- It is optional in the type only, as `currentView?` and `fitToBbox?` are; the component always provides it.
- Its product caller is the session, through `CandidateArmSessionDeps.canvas`. It is not an instrument accessor.

**The block.** It sits after S1's block and before the sink's final `syncScanLiveness()`. S1's block is byte for byte unchanged. The block runs when all of these hold:
- (i) `wasCurrent`;
- (ii) `!wasSelfCancelled`: neither an operator Cancel with a frame nor `stop()`;
- (iii) `!relinquishedReEmitted`;
- (iv) `!hasPlanned`;
- (v) `terminal.kind === "Completed"`;
- (vi) `!stopped` and `!sessionEnded`. A session-ended terminal has already returned above;
- (vii) `!relinquishClearPending`: after a Cancel in the frameless window, tiling resumes at the next camera change, as now (walkthrough L4);
- (viii) `!pendingViewportChange`: a pending change already plans, and now finds a frame.

Terms (i) to (iii) are S1's guard. Terms (iv) and (v) are its complement. So exactly one of the two blocks can act on a terminal, and S1's guard reads `hasPlanned` before this block can set it.

Then: `const box = canvas?.shownViewportBbox?.() ?? null`. If `box !== null && manager.gridFrame !== null`, the block calls `logSessionEvent("candidate-first-look-view-planned", <box>)` and then `handleViewportChange(box)`.

**One planning path, no debounce.**
- `handleViewportChange` is the function the debounce calls. `hasPlanned`, the failure-window reset, the relinquished and `firstLookFailureStanding` clears, the status emit and `syncScanLiveness()` are the code that already runs.
- It is called directly, from this block alone, not through the 120 ms debounce (ADV-2026-11-18-16 item 1). In the same terminal the plan tracks its tiles before the sink's `syncScanLiveness()`, so the scan does not reset and Cancel does not drop out between the first look and its fill.
- When the plan tracks no tile (every covering tile already resident, or an empty cover), the status settles at once.

**What the box is.** The view the canvas shows at the terminal: with no input, the fit's; after a pan during the first look, the panned view (OPEN-3 (A), ruled). After an Apply whose look admits no geometry, the fit does not fire, and the box is the camera left standing.

**Unchanged.**
- The fit, `notifyViewport: false`, `lastQueriedRef` and `onViewShown`.
- `onViewportChanged`'s documented property.
- Export's Current view.
- Item 39's exception: the plan is not a report, so `lastQueriedRef` stays null.
- The first look's query, its limit and the moment it is issued.
- Every ceiling; the baseline arm; `App.tsx`; S1's code.

**Logged (docs/01 principle 8).** The session line above. The plan's `viewport_query` and `stream-issued` lines are the manager's always-on trace.

### 2.2 P-A, report the tile arm's fit: not recommended

Alone, it plans nothing (`no-frame`). It breaks `onViewportChanged`'s auto-fit sentence, `lastQueriedRef`'s null after a fit and item 39's exception. It edits `App.tsx`.

### 2.3 P-C, App forwards `onViewShown`: not recommended

The box would have two sources and would be stale after a pan. It edits `App.tsx` and adds a session method.

### 2.4 Under ADR-010 and docs/01

- **Rule 1.** The box leaves the canvas only in authoritative CRS: target plus origin in f64, inside `computeAuthoritativeViewportBbox`.
- **Rules 2 and 4.** Not engaged.
- **Rule 3.** Unchanged.
- **Rule 5.** Ends the silent window at the fill's settle. During the fill the status is silent by the existing design (walkthrough L5), not claimed here.
- **Rule 6.** No new ceiling: `MAX_IN_FLIGHT_TILE_STREAMS`, `MAX_QUEUED_TILES` and `MAX_COVERING_TILES` bound it.
- **Rule 7, and principle 7.** The fill's streams report through the existing liveness, and Cancel reaches them through `relinquishFill`.
- **Concurrency.** The terminal is partitioned with S1's, as §2.1 shows. The orphan-terminal case is §3's.
- **§21a's fourth category: yes.** The session's top comment says planning waits for a genuine `onViewportChanged`; that property is reversed for this terminal.
- `engine/`, `kernel/`, `protocol/` and the wire are not touched. The control plane only.

### 2.5 The status line

No new string. At the settle, `settledState` and `residencyStatusText` give the existing sentences: complete in view; over budget with its suffixes; settled-partial; partial-failure.

### 2.6 Boundaries

**Not edited:**
- `App.tsx`, `residencyStatus.ts`, `tileViewportStreamManager.ts`, `tileGridConstants.ts`, `viewportBbox.ts`;
- S1's block in the sink;
- `recentre-crossing.mjs`, `residency-harness.mjs`, `pan-anchor.mjs`;
- `engine/`, `kernel/`, `protocol/`, `renderer/`, `src-tauri`;
- any dependency or lockfile.

The one new member's caller is the session.

### 2.7 Portability

Page code. E-FL runs on Windows/WebView2 only.

## §3 Claims

**May be claimed:**
- After a first look that ends `Completed` with no plan, the session plans the view the canvas shows, with no input. This covers the open, an Apply, a Clear and the Colour-by refill (U-FL1, U-FL5).
- On `100k-happy-path.parquet` at the shipped default arm and level, the fit view fills, and the status shows the complete-in-view sentence at the settle (E-FL).

**May not be claimed:**
- Any docs/08 figure; macOS; Linux.
- That every file's view fills completely: over budget or truncated, the partial sentences speak instead.
- Anything after a failed first look: that is S1's sentences, and this node plans nothing there (ADV-2026-11-16-06 item 1 (c): the fix does not reach that case; S1 covers it).
- Anything after a Cancel during the first look, until the next camera change.
- That the status speaks during the fill.
- An over-budget sentence from the first look standing during the fill: S1's out-of-scope A3 staleness, now reached at an over-budget open without input.

**Not covered (AUTONOMY §31 (c)), timing inside one request round trip, for the source comment:**
- An earlier look's `Completed` terminal that arrives after a reissue but before the new look's ticket is minted is read as current. It can plan the pre-fit view under the new filter, and the status can settle on that box while the new fit shows another. This is the root of `untiled-reissue-holds-earlier-look-handle-until-mint` (ADV-2026-11-18-16 item 5).

## §4 Tests (declared before code)

| ID | File | Asserts | Mutation |
|---|---|---|---|
| U-FL1 | `candidateArmSession.test.ts` (OPEN-5 (A)) | `fakeCanvas` with `shownViewportBbox` returning a box inside the frame. The first look is driven to `Completed`, with no `onViewportChanged`. Synchronously in that terminal, with no timer advanced, the manager issues covering-tile `viewport_query` calls for that box. One `candidate-first-look-view-planned` line. | M-U1: delete the block. No tile query. |
| U-FL2 | the same, table-driven | No plan at the terminal when: (a) `relinquishFill()` ran during the look; (b) `stop()` ran first; (c) the terminal is non-`Completed`, and S1's emission is unchanged; (d) it is an orphan after `reissueUnrestricted`; (e) the box is null; (g) a plan already ran this generation, where S1's `emitResidencyStatus` runs and this block does not; (h) the session ended. (f) With a change pending at the terminal, exactly one plan runs in total, of the pending box, after the debounce. | M-U2: drop term (vii); (a) fails. M-U2g: drop term (iv); (g) fails, with two status emits. |
| U-FL3 | the same | After U-FL1's plan, when every covering stream completes, the status callback receives `candidate-within-budget` with `settled: "complete"`; `residencyStatusText` renders the complete-in-view sentence. | M-U3: call `manager.onCameraChange` directly in place of `handleViewportChange`. `hasPlanned` stays false; no settled status. |
| U-FL4 | `WorkingCanvas.wiring.test.tsx` (OPEN-5 (A)) | `shownViewportBbox()` is null before any camera write. After the one-shot fit, it equals the box `onViewShown` received. After an interactive tick, it equals the box `onViewportChanged` received. | M-U4: drop the origin. It fails at the fit (`forceRecenter`). |
| U-FL5 | `candidateArmSession.test.ts` | After a settled plan, `reissueUnrestricted(null, f)` (the shared seam of Apply, Clear and the Colour-by refill): the new look ends `Completed`, and one plan of the shown box runs under `f`. | M-U1. |
| U-FL6 | the same | Across U-FL1's terminal, the scan events hold no `reset` until the last covering tile ends; then exactly one. | M-U5: route the block through the debounced accept. A `reset` appears at the terminal. |
| E-FL | new `frontends/shell/e2e/open-fills-fit-view.mjs`; npm `e2e:open-fills-fit-view -- --measure-build <exe>` | Below. | M-E-FL: the base build (§7 S4); (a), (c) and (d) fail. |

**E-FL.**
- **Launch.** Through `attachOrLaunchExe`; a fresh launch only. The one page hook called is `openPath`, the instrumented-build open that #311's E1 calls. No arm or level call. No input after the open.
- **Precondition** (else exit 2, VOID):
  - the open's first `stream-issued` line arrives, with `batch` rows reaching 10,000;
  - the fit's `view-state` line arrives;
  - the describe extent is read.
- **(a)** After that stream's last batch, at least one further `stream-issued` line arrives, with no input.
- **(b)** Settle: no `viewport_query`, `stream-issued` or `batch` line for 3 s, within 180 s.
- **(c)** `.residency-status` reads the complete-in-view sentence, matched by a pattern built from `residencyStatusText`'s `candidate-within-budget` template, with a comment naming that symbol.
- **(d)** `Page.captureScreenshot` clipped to `.working-canvas`, as an 8×8 grid.
  - A cell qualifies when its world rectangle lies wholly inside the extent, computed from the fit's `view-state` line (W = target + origin, CSS px per unit = 2^zoom).
  - Every qualifying cell holds a pixel with alpha above 0.
  - PNGs are decoded with `node:zlib`.
- **(e)** At the base, at least one qualifying cell lies outside the first look's rows and is blank. Otherwise VOID.
- **Exits.** 0 if (a) to (d) pass; 1 on any failure.

**Observing mutations.**
- Each mutation is applied by hand, its named test is run, its failure is recorded with its commit id, and it is reverted. The reviewer re-applies each one by Bash.
- A `verify-mutation` run is a check of the mutation's text, never its observation.
- A branch test-text span is named with its commit id and never pinned by hash at a branch commit.

**The seam.**
- U-FL1 to U-FL3, U-FL5 and U-FL6 use the fake typed against the real `WorkingCanvasHandle`, with no cast.
- E-FL is the end-to-end test from the real shape: the shipped session on the shipped canvas.

## §5 Predictions, the suites, invalidators

**Predictions.**
- P-U-base: U-FL1, U-FL3, U-FL5 and U-FL6 fail; U-FL4 fails, because the member is absent; U-FL2 passes, because there is no plan to suppress.
- P-E-base: the precondition is met; (a), (c) and (d) fail; (e) holds.
- P-head: all pass. That the fit view at the default level is within budget and not truncated is my derivation from the consult's §1 and §2. It is not asserted beyond E-FL.

**What each suite sees after a first look.** By reading. Step S2 lists every assertion; a change not in this table stops the piece.

| Suite | After | Changed? |
|---|---|---|
| `layout.mjs` FILL | the open's plan has already loaded the fit view's tiles, so the cells the Inspector's close exposes may be resident | yes: OPEN-6 (A), ruled; the covered set counts the open's planned box |
| `layout.mjs` RESIZEQ | unchanged; item 39's exception holds | no |
| `recentre-crossing.mjs` | case 1's start image is after the fill; (c) is reported only; (d)'s edges inside both images, by reading | no; its comment in `capture` stays true (§10.4) |
| `residency-harness.mjs` | `open-drain` drains the fill too; `identity-open` carries tile streams in both its ON and OFF runs | I5 |
| `regression.mjs` | more filled; the Zoom to layer anchor grows (item 61) | no |
| `filter.mjs`, `filter-panel.mjs` | each Apply's fit view fills (OPEN-2 (ii)) | a fraction comparison is re-read at S2; a changed assertion is I7 |
| `colour.mjs` | PB-E1's settle (2 s quiet) covers the fill; the dominant colours read over more features | re-read at S2 |
| `export-view.mjs` | unchanged: `onViewShown` and `lastQueriedRef` are untouched | no |
| `selection.mjs`, `attributes.mjs`, `table.mjs` | more features resident after an open | a resident count after an open is re-read at S2 |
| the rest of `package.json`'s suites, and `pan-anchor.mjs` | settle later | no |

**Declared unchanged:**
- every existing vitest test, including S1's refusal file, `App.streamFailure.test.tsx` and M1; their fakes lack the member;
- the wire; every string; item 39; item 56; the baseline arm.

**Invalidators.** Each stops the piece; nothing is adjusted.
- I0: a §2 symbol whose body has changed at the base.
- I1: U-FL1, U-FL3, U-FL5 or U-FL6 passes at the base.
- I2: E-FL's precondition or (e) fails at the base: VOID.
- I3: E-FL (a), (c) or (d) passes at the base.
- I4: a failure in a shared run that depends on timing is recorded as such, run again, and not counted.
- I5: the harness's identity guard fails at the head.
- I6: any settle times out after an open, outside I4.
- I7: an S2 assertion that changes and is not in the table.

**Falsification.** A failure at the head is the change failing, recorded as seen.

## §6 Instruments and measurement

No performance claim.
- First pixels: the first look is not moved.
- Time to stable view lengthens by the fill. It is declared, not measured (OPEN-7 (B), ruled).

## §7 Steps, files, ceilings, budget

**Steps.**
- S0, the custodian's: this form on main.
- S1 (the Sonnet worker): the branch from main at dispatch (the base). Read each §2 symbol at the base; I0 if one has changed.
- S2 (the Sonnet worker): the §5 inventory, in the report. It also says whether `colour.mjs` drives a Colour-by refill, and if it does, at which step; if it does not, the report says so and nothing is added (ADV-2026-11-18-16 item 3).
- S3 (worker-high, on the strongest model): commit the unit tests and run them. P-U-base, with the commit id.
- S4 (the Sonnet worker): commit E-FL and its script. Build the measure exe at that commit, run E-FL, P-E-base.
- S5 (worker-high, on the strongest model): the change, with the comments of §10.3.
- S6 (worker-high, on the strongest model): vitest; observe every mutation.
- S7 (the Sonnet tester): the head measure build; E-FL; P-head.
- S8 (the Sonnet worker): FILL under OPEN-6 (A); E-FL's README entry, and FILL's and the harness's entries re-read; the walkthrough rows; item 64's and item 51's drafts (§10.1).
- S9 (the Sonnet tester): one series at the final candidate (ADV-2026-11-16-06 item 3), the report, then both gates.

Nothing after S5 is committed before S3's and S4's records exist. S4 may be committed before S3 (ADV-2026-11-18-16 item 7 (c)).

**Ceilings.** By `git diff --numstat <base>...HEAD -- frontends/shell KNOWN-LIMITATIONS.md`:

| Group | File | Ceiling |
|---|---|---|
| product | `src/residency/candidateArmSession.ts` | 60 |
| product | `src/canvas/WorkingCanvas.tsx` | 25 |
| unit | `src/residency/candidateArmSession.test.ts` | 320 |
| unit | `src/canvas/WorkingCanvas.wiring.test.tsx` | 110 |
| e2e | `e2e/open-fills-fit-view.mjs` (new) | 380 |
| e2e | `package.json` | 2 |
| e2e | `e2e/layout.mjs` (FILL) | 30 |
| docs | `e2e/README.md` | 60 |
| docs | `MANUAL-WALKTHROUGH.md` | 40 |
| docs | `KNOWN-LIMITATIONS.md` (items 64 and 51) | 14 |

- Totals: product 85, unit 430, e2e 412, docs 114; 1,041 in all.
- An overrun is class 8, and §7 is not edited to match.
- A file outside this table is class 9, declared before any of its code.

**Budget.** 400 minutes, my estimate:

| Work | Who | Minutes |
|---|---|---|
| S1 and S2 | the Sonnet worker | 50 |
| U-FL1, U-FL2, U-FL3, U-FL5 and U-FL6 | worker-high (S3) | 100 |
| U-FL4 | worker-high (S3) | 40 |
| E-FL | the Sonnet worker (S4) | 110 |
| the change | worker-high (S5) | 30 |
| records | the Sonnet worker (S8) | 20 |
| runs and mutations | worker-high (S6); the Sonnet tester (S7, S9) | 20 |
| report | each, for its own steps | 30 |

Builds and waits for a hold are stamped and reported apart. PLAN's `budget_minutes` is the custodian's.

**Model, by step (ADV-2026-11-18-16 item 7; ADV-2026-11-18-02 item 2 (a)).** worker-high on the strongest model for S3, S5 and S6. Ground: the order of the first look's terminal, the plan and Cancel in the session's state. The Sonnet worker for S1, S2, S4 and S8, and the Sonnet tester for S7 and S9, as named beside each step and in the budget table.

## §8 Order and regions

- The slot: after PR B (ADV-2026-11-16-06 item 1 (a)). Met.
- Regions (ADV-2026-11-16-06 item 4):
  - `candidateArmSession.ts`: the new block in `issueUntiledQuery`'s sink `onTerminal`, after S1's block; the top doc comment's paragraph on planning.
  - `WorkingCanvas.tsx`: `WorkingCanvasHandle` after `currentView?`, and the handle object after `currentView()`.
- At dispatch, `git diff --name-only origin/main...<branch>` is run for each piece in progress and each PR awaiting merge. Under rule (00a), KNOWN-LIMITATIONS items, walkthrough Parts and README entries count apart. An overlap holds the dispatch.
- After this node: `colour-by-refill-keeps-the-view`, and the reopen's P4 (ADV-2026-11-16-10 item 1 (c)).
- If `untiled-reissue-holds-earlier-look-handle-until-mint` is placed, its region overlaps this one (`wasCurrent` in the same sink), and it goes after this node.

## §9 Gates

Architect and reviewer from dispatch. Verdicts under §22. A Documentation finding is must-fix before the merge.

**The architect:**
- ADR-010 rules 1, 3, 5, 6 and 7, and docs/01 principles 7 and 8;
- the partition with S1's guard;
- §2.6;
- §10's words, clause by clause;
- §11.

**The reviewer:**
- recomputes §7's counts;
- does the fresh-worktree setup, with `npm ci` in `renderer/bundle-viewer` as well;
- runs `npm run verify` whole, and the CI scripts, cite, quote and plan checks;
- reuses the series run tied to its commit and environment, reproduces what it doubts, and says which it reused and which it reproduced;
- re-applies every mutation;
  - runs one probe of §3's not-covered window at the head, and reports what a person would see: which box is planned, whether the new look's fit view then fills without a pan, and what the status says and until when. No test pins the gap (ADV-2026-11-18-16 item 5 (a));
- recomputes E-FL's verdicts from its records;
- runs heavy commands in a shared hold.

**The operator:** §10.2's rows, queued blank.

## §10 Records

**10.1 KNOWN-LIMITATIONS.**
- **Item 64**: the item-18 retirement form, its number kept, its text replaced, a source comment under it (ADV-2026-11-13-02 item 2).
  - The worker drafts the words at S8 from the built code, starting from the 2026-11-12 draft's §10.1. Both gates check them clause by clause. They go to the advisor before the PR leaves draft.
  - The source comment names §3's not-covered cases. A Cancel during a first look stays reachable. An Apply or a Clear is not named as reachable (ADV-2026-11-13-02 item 2 (c)).
- **Item 51**: its clause on the first 10,000 rows after the Colour-by refill goes with item 64's words (ADV-2026-11-14-18 item 4). The camera clause stays.
- **Items 7, 39, 56 and 61: no change, by reading.** The gates re-read item 7 (G1).

**10.2 The walkthrough** (OPEN-9 (A), ruled). The words go to the advisor (ADV-2026-11-16-06 item 2 (b)).
- Part L's strip note: the open now fills the strip view itself.
- L1 and L5: the open's own fill runs before Zoom to layer.
- L2: tiles from the open's fill arrive before the click.
- A7: the anchor can frame more than A4's fit (item 61).

**10.3 Code comments** (the worker's words; the gates check each clause against the code).
- The top doc paragraph. Tile planning begins at the first of:
  - a genuine `onViewportChanged` once the frame exists;
  - the first look's own `Completed` terminal with no plan this generation, which plans the box the canvas then shows (`shownViewportBbox`) by calling `handleViewportChange`, unless a self-cancel, a relinquish, a stop, an ended session or a pending change decides the next plan.
- The block's comment names S1's region and §3's orphan case.
- The member's doc names its one product caller and its precedent (`currentView?`).

**10.4 G2.** Not added. The comment in `recentre-crossing.mjs`'s `capture` that #311 landed stays true after this node, and G2's drafted words would be false. Both gates re-read it at the head; a clause they find untrue there is a Documentation finding, fixed in this pull request by class 9 (ADV-2026-11-18-16 item 2).

**10.5 v0.2.** The node is in `release-v0-2-0`'s `depends_on`. The tag and its notes are the human's.

## §11 Block on sight

1. A new or changed string the app shows.
2. An edit to any file of §2.6, or to S1's block.
3. The first look's query, limit or issue moment changed.
4. A call to `manager.onCameraChange` other than inside `handleViewportChange`.
5. The fit made to report; `lastQueriedRef` or `onViewShown` changed.
6. A plan at a self-cancelled, orphaned (outside §3's case), non-`Completed`, post-stop, session-ended or already-planned terminal, or while a relinquish stands.
7. The block placed before S1's.
8. A member, option or path with no product caller.
9. A fake not typed against `WorkingCanvasHandle`, or a cast around it.
10. E-FL calling any page hook but `openPath`, or run on a dev build.
11. A tolerance or prediction changed after a run.
12. A dependency or lockfile change.
13. A `verify-mutation` run called an observation; a branch span pinned by hash at a branch commit, or named without its commit id.
14. The change before S3's and S4's records.
15. KNOWN-LIMITATIONS or walkthrough words landed without the advisor's ruling.

## §12 Open items

| OPEN | Settled by |
|---|---|
| 1 (P-B), 3 (A), 4 (A), 5 (A), 6 (A), 7 (B), 9 (A) | ADV-2026-11-13-02 item 3, at this form's commit |
| 2 (ii) | ADV-2026-11-13-02 item 1 |
| 8 (the item-18 form, words after the code) | ADV-2026-11-13-02 item 2 |
| 10: a test of the Colour-by refill at App level | ADV-2026-11-18-16 item 3: none; one line in S2 (§7) |
| 11: E-FL as its own file (A), or as a case of `recentre-crossing.mjs` reusing its helpers (B, about 250 lines fewer) | ADV-2026-11-18-16 item 4: (A), its own file |

## §13 Amendments (opens empty; append-only)

## Amendment 1 — step S2 stopped on I7: two rows added to §5's table, observed at the base and the head; a new invalidator, I8; step S2's remainder; step S3's order

*Written by the custodian, 2026-11-18, by the advisor's ruling ADV-2026-11-18-17 (`state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-17-the-first-look-stopped-at-s2-on-i7-two-suite-rows-observed-at-base-and-head-i8-and-s2s-remainder.md`), before any code and any run of this piece. It adds scope. It changes no prediction, tolerance or test above.*

1. **The stop.** S1 at the base, 349cec82e5ecbfab40db3ae9b6811d471d9ea2de, found no §2 symbol changed (I0 not hit). S2 stopped on I7: two assertions that could change are not in §5's table. Nothing was committed, built or run. The worker's report, handed back at 2026-11-18T18:07:14Z by its transcript, is `state/consults/2026-11-18-open-first-look-fills-fit-view-s1-s2-worker-report.md`.
2. **Two rows added to §5's table**, each "could change; observed":
   - `filter-panel.mjs` FIND'. After the Apply's first look ends, the block plans the fit view under the filter, and each tile's stream scans the slow file again. Cancel and the liveness line stay until the last one ends, so the step's 180 s wait covers the first look and the fill.
   - `table.mjs` PC-E4. The step finds the table's handle by counting `stream-issued` lines after the point it marks before the Table tab is shown. The fill's lines can fall after that point if the Apply's first look is still scanning when the settle returns. The count of one is how the step finds the handle, not a claim about the map.
3. **The runs of the two suites.**
   - (a) Each suite whole, as its README entry runs it, in a shared hold: once at the base, in S4, and once at the head, in S7. Each run records its exit code and every step's line with its milliseconds.
   - (b) P-S-base: at the base both exit 0. A failure there voids that row and goes to the advisor before S5.
   - (c) At the head nothing is predicted. A failure of FIND' or of PC-E4 at the head is I8 (item 5).
   - (d) PC-E4 can pass by luck. S7's record says where the fill's `stream-issued` lines fell in the head run's trace: before the Table tab was shown, inside the lines the step reads, or after them. If by that trace's timing they can fall inside, it goes to the advisor as a question, not a stop.
   - (e) If a product file changes after S7, both suites run again in S9's series.
4. **FIND's durations.** S7's record puts the base and head durations of FIND' side by side. No pass or fail hangs on them; OPEN-7 (B) stands. They go to the advisor with item 64's draft.
5. **I8**, added to §5's invalidators: a failure of FIND' or of PC-E4 at the head. The piece stops, and the failure goes to the advisor with the step's line and the trace lines around it. I4 does not excuse these two steps: a failure of either at the head is I8 whether or not a second run passes. At an I8, an edit of either suite is class 9, declared before its code by the advisor's ruling; a change of the block's design goes to the architect first, then to the advisor.
6. **S2's remainder.** The Sonnet worker reads `regression.mjs` and `residency-harness.mjs` whole and finishes the inventory before S4's commit. A further assertion that could change and is not in the table as amended here is I7 again. Its report lists every e2e suite of `package.json` as read whole or not read whole.
7. **Order.** S3 may be dispatched once this amendment is on main, under the cap of ADV-2026-11-18-02 item 1. S5 waits for S2 whole and for S3's and S4's records (§7).
8. **`colour.mjs`.** Nothing is added (ADV-2026-11-18-16 item 3). By the worker's reading, its Apply re-issues the first look only when the app says the attributes were not held, which the script neither reads nor forces.
9. **Budget.** The node's `budget_minutes` goes from 400 to 440, my estimate: S2's remainder and the four runs of item 3. §7's budget table is not edited.

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — step S4 stopped on I2: E-FL's precondition named a value `describe` never sends; the rectangle (d) and (e) read, and (d)'s blank test, replaced before the base's (d) and (e) were evaluated

*Written by the custodian, 2026-11-18, by the advisor's ruling ADV-2026-11-18-21 (`state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-21-amendment-2-goes-in-as-drafted-with-six-changes-a-second-table-base-run-s2s-remainder-ruled.md`), from the architect's draft `state/consults/2026-11-18-open-first-look-fills-fit-view-e-fl-extent-amendment-2-draft-architect.md`. Authority: that ruling. The reuse index, byte-copied from the custodian's brief and marked so, missed: `node tools/reuse.mjs end-to-end screenshot check that the fit view is filled within the dataset bounds` (exit 1), run in the read-only clone at 89bbac3. It changes no prediction and no product file; I2 and I8 each reach one more case (items 6 and 12). The draft's OPEN items A2-1 to A2-7 are ruled there.*

1. **The stop.** E-FL ran once at the base, on the measure build of B, at E = ff3c1465eea3724c3840485febb2a5da05765623. It exited 2 (VOID, I2) at line 147 of `frontends/shell/e2e/open-fills-fit-view.mjs` at E: the precondition's third item is unmet in v0 by design (`kernel/src/skp.rs:2053` at E; `protocol/skp/SKP-V0.md:92` at E). Lines 148 onward did not run, so nothing of (a) to (e) was evaluated. The log is `<S>/fl1-efl-base.log` (413 bytes, sha256 23c1bb4ddb38b2d121099dd670d9401fd8c5cc27cefd928e5ffc4c315c1a71ea), filed byte for byte as `state/consults/2026-11-18-open-first-look-fills-fit-view-e-fl-base-void-log.txt` (OPEN-A2-7); it is evidence, not Authority.
2. **§4 E-FL, the precondition's third item, replaced:** the fixture file's sha256 equals fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 (`state/consults/2026-11-18-open-first-look-fills-fit-view-s1-s2-worker-report.md:8`); else VOID. The `describe.extent` line is printed and decides nothing.
3. **§4 E-FL (d), the first sub-item's rectangle, replaced:** the fixture's parcel area in EPSG:2056 metres, {2,600,000, 1,200,000, 2,612,680, 1,212,600}. It is an e2e-local value restated from the generator (`engine/src/fixture.rs:67-68,93,1404-1412` at E), as `frontends/shell/e2e/layout.mjs:419` at E restates it. It is valid only under item 2's hash.
4. **§4 E-FL (d), the second sub-item, and (e)'s "blank", replaced:** a qualifying cell is blank when none of its pixels differs from the ring background B (the commonest RGB on the image's outer ring) by more than 8 on any channel. This is the rule at lines 202-207 and 217-218 of `frontends/shell/e2e/open-fills-fit-view.mjs` at E, which now decides. The alpha reading is printed and decides nothing. The tolerance of 8 is declared here, before any (d) was evaluated. The alpha test is replaced because, by reading, the page screenshot is composited and opaque: every pixel would read alpha 255 and (d) could not fail. The script's own header at E says the same. The re-run's record states the alpha reading it printed.
5. **§3, the second "may be claimed" item, read as:** on `100k-happy-path.parquet` at the shipped default arm and level, with no input after the open, every cell of an 8×8 grid over the fit view that lies wholly inside the fixture's parcel area holds a pixel unlike the background colour of item 4, and the status shows the complete-in-view sentence at the settle (E-FL). The fill of any part of the fit view smaller than one such cell, or on its edge, is not claimed beyond (c).
6. **Unchanged:** §4's launch, (a), (b), (c), the exits and M-E-FL; §5's P-E-base, P-head, I2 and I3 in their words. I2 now also reaches a hash mismatch, through item 2.
7. **The test commit E'.** On the branch, before any change commit, the script only. Its ceiling: at most 40 lines in `git diff --numstat E E'`, and the file within §7's 380 against the base. `package.json` is not edited. E' is named by its commit id, and no span of it is hash-pinned.
8. **The re-run.** E-FL once at the base, at E', in a shared hold, with `--measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe`. The build stands if its sha256 equals d8309b1ecc1906d597a07e9a04d1d17ed57da3a07dc88472a6189bbc541148d9 at the run and `git diff --name-only B E'` names no path outside `frontends/shell/e2e/` and `frontends/shell/package.json`. Otherwise it is rebuilt at E'. P-E-base is read from that run. The build's provenance (OPEN-A2-5; ADV-2026-11-18-21 item 4 (a)): it was built at E after E's commit, its mtime 2026-11-18T19:27:32Z by step B's report (`state/consults/2026-11-18-open-first-look-fills-fit-view-s2-remainder-worker-report.md`); E adds to B only the script and its `package.json` entry. The re-run's record also gives one reading from its printed lines (the ruling's item 4 (b)): whether every qualifying cell that is not wholly above the first look's rows holds a marked pixel. If one of them reads blank, it goes to the advisor before S5. That reading is not a sixth check and changes no exit. The two suites' base runs are item 11.
9. **The record.** This stop's closing line: `S4 stopped on I2 at <run end, from the run's transcript or the log's mtime, date -u>: E-FL VOID at E (exit 2), precondition item 3 unmet by design; resumed under Amendment 2.`
10. **§11 item 11 is not engaged** (OPEN-A2-4; ADV-2026-11-18-21 item 5). No value of (a) to (e) was produced at E: the script throws at the precondition before the settle, the screenshot and every check, and the log records zero checks (item 1). The rectangle, the blank test and its tolerance are declared here, before the run that first evaluates them. Both gates read the filed log and this item, and say so if they disagree.
11. **The two suites' base runs** (OPEN-A2-6; Amendment 1 item 3 (a) and (b); ADV-2026-11-18-21 item 8).
   - `filter-panel.mjs` ran whole at E in S4 and exited 0, with FIND' passing (`state/consults/2026-11-18-open-first-look-fills-fit-view-s4-d-to-f-worker-report.md`). P-S-base is met for it by that run, and its FIND' duration there is the base duration of Amendment 1 item 4.
   - The first `table.mjs` run at E is recorded as not made as its README entry runs it: `SPATIAL_E2E_FILTER_ZONE_COUNTS` was not set, so PC-E1 failed in its setup. It is not I4 and it is not counted.
   - `table.mjs` runs once more at E, in a shared hold, with `SPATIAL_E2E_FILTER_ZONE_COUNTS` set to [402, 392, 389, 421] and nothing else changed, after the full sha256 of `filter-zoned.parquet` is checked equal to 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46, the hash in PR B's head series report (`state/consults/2026-11-16-b1-shell-half-pr-b-head-series-tester-report.md`); if it is not equal, no run, and it goes to the advisor. P-S-base for `table.mjs` is read from that run; a failure of any step there voids the row and goes to the advisor before S5. Its report: `state/consults/2026-11-18-open-first-look-fills-fit-view-s4-table-base-2-and-six-reads-worker-report.md`.
   - S7's head run of `table.mjs` sets the same value.
12. **Step S2's remainder** (ADV-2026-11-18-21 item 7).
   - (a) No I7, by step B's report.
   - (b) One row is added to §5's table, "could change; observed": `regression.mjs` PT' and LN'. The open's fill issues bboxed tile queries on a point fixture and a line fixture that carry a covering, under each step's no-refusal assertion. No step of that file issued them before.
   - (c) Its base is the S1 piece's series at d144373b (`state/consults/2026-11-18-shell-tiled-arm-stream-refusal-shown-to-the-user-series-at-d144373b-tester-report.md`; `regression.mjs` exit 0). By the custodian's diff, `git diff --name-only d144373b 349cec82` over `frontends`, `kernel`, `engine`, `protocol` and `renderer` names no path. At the head, `regression.mjs` runs whole in S7 with Amendment 1 item 3's two suites, and its record gives the lines of PT' and LN'. A failure of either at the head is I8, as Amendment 1 item 5 words it.
   - (d) The departure from Amendment 1 item 6: the first reading of `regression.mjs` and `residency-harness.mjs` was not whole before E's commit (2026-11-18T19:04:25Z); both were read whole from 19:36:28Z to 19:38:07Z, by step B's report. Nothing is redone: E holds the script and its `package.json` entry only, and the whole reading found no I7.
   - (e) The rows of §5 that say re-read at S2 are met by a whole read: the Sonnet worker reads `filter.mjs`, `filter-panel.mjs`, `colour.mjs`, `selection.mjs`, `attributes.mjs` and `table.mjs` whole before S5 and reports I7 or no I7, with its calls. It needs no hold and may go beside E'. Its report: item 11's. The other suites stay as read in part, and the closing says so.
13. **Order** (ADV-2026-11-18-21 item 9). E' and the E-FL re-run go once this amendment is on main. S5 then goes with no further word from the advisor when all of these hold: P-E-base is met at E' as predicted; item 8's reading shows the marked pixels; the second `table.mjs` run exits 0; item 12 (e)'s reads find no I7; S3's and S4's records exist. Anything else stops and goes to the advisor.

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — step S8 stopped on I3 at FILL's precondition: FILL's set-up adds one declared drag east of the fit view before the toggle, with OPEN-6 (A)'s counting kept

*Drafted by the architect (claude-opus-5-5), read only, at main 1067f753bd4f4226260575cbd3bbe3ece8fc7180 and at the worktree's commit 1, 476936642cddefe4a7652918f7674907a9f2b183, under the advisor's ruling ADV-2026-11-18-27, items 3 and 4. Appended by the custodian's script. It declares FILL's set-up before the code for it. It changes no product file and no line of `stepFill` from the line that takes `mark` onward. The reuse index missed. The line below is byte-copied from the custodian's brief and marked so: `No prior art recorded for "e2e check set-up that moves the view off the open's planned box before a resize". Research it before planning an implementation.` Code is cited by symbol at 476936642cdd unless another commit is named. Figures come from the files named, or are worked here.*

1. **(a) The set-up.** After the wheel notch, its settle and its zoom check, `stepFill` makes one declared drag before it reads the size, the growth and the status. The drag starts at the canvas centre and goes 160 CSS px to the left in 16 steps. That moves the view east. It is not a search.
   - The lines, added to `frontends/shell/e2e/layout.mjs`. The first three go after `FILL_WINDOW_MS`:
     ```js
     // FILL's declared drag (open-first-look-fills-fit-view Amendment 3, item 1): from the canvas centre, 160 CSS px to the left in 16 steps. Not a search.
     const FILL_PAN_PX = 160;
     const FILL_PAN_STEPS = 16;
     ```
     These seven go after the `view.zoom === zoom0` check in `stepFill`:
     ```js
       // The open's own plan asked for the fit view's cells, so the view moves east off them before the toggle: one declared drag after the notch.
       // Its effect is read back from the view-state lines, as the notch's is, and the drag's views count as asks below.
       await page.mouse.move(centre.x, centre.y);
       await page.mouse.down();
       await page.mouse.move(centre.x - FILL_PAN_PX, centre.y, { steps: FILL_PAN_STEPS });
       await page.mouse.up();
       await settleFully(page, consoleHandle, "FILL: after the drag");
     ```
   - The drag is worked out and recorded the same way the notch is. Its effect is never assumed. `markView` is taken before the notch, so every view-state line the drag emits (`WorkingCanvas.tsx` `onViewStateChange` traces one per tick) counts as an ask in `qualifying`. The grown view is read from the last view-state line. The run's result line records both qualifying counts.
   - Unchanged, as ADV-2026-11-18-27 item 2 rules:
     - the notch, its settle and its I3 check;
     - `PARCEL_AREA`;
     - `qualifying` as commit 1 left it;
     - the status precondition, which is now read after the drag and still ends in I3;
     - the precondition's form, at least one qualifying cell or else I3;
     - everything from `const mark` onward.

2. **(b) Where the boxes and cells lie, with the working.**
   - **Frame.** The 100k dataset's `candidate-grid-frame-established` line (`<S>/fl8-layout-s8.session.log:257`; the same values at `<S>/fl8-layout-c.session.log:260`) gives:
     - baseSpan 25346.079664039426, originX 2593667.074747726, originY 1187966.9847111297, level medium;
     - 16 cells per axis (`tileGridConstants.ts` `TILE_GRID_DIMENSIONS`), so a cell is 1584.129979 m (`tileGrid.ts` `cellSizeForLevel`).
   - **Column and row edges.** Column c starts at originX + c × cell, and row r at originY + r × cell. Cells are half-open (`coveringIndexRange`).
     - Columns 3, 4, 5, 8, 9, 10 and 12 start at 2598419.465, 2600003.595, 2601587.725, 2606340.115, 2607924.245, 2609508.375 and 2612676.634.
     - Rows 4, 5, 6, 7, 8, 9, 10 and 11 start at 1194303.505, 1195887.635, 1197471.765, 1199055.895, 1200640.025, 1202224.155, 1203808.285 and 1205392.414. Row 14 ends at 1211728.934.
   - **Cells wholly inside `PARCEL_AREA`.** These are columns 4 to 11 and rows 8 to 14, 56 cells.
     - Column 3 starts west of 2,600,000.
     - Column 11 ends at 2612676.634, which is not past 2,612,680.
     - Row 7 starts south of 1,200,000.
     - Row 15 ends at 1213313.064, which is past 1,212,600.
   - **The open's planned box, at this suite's sizes.** The 100k dataset's `candidate-first-look-view-planned` line (`<S>/fl8-layout-s8.session.log:258`; the same box at `<S>/fl8-layout-c.session.log:261`) is x 2599141.846 to 2607778.383 and y 1195053.894 to 1204985.911.
     - That is the fit's view-state, centre (2603460.114, 1200019.902) at zoom -4.169346624228335, at 480 × 552 CSS px. The box is 8636.537 m ÷ 480 = 9932.018 m ÷ 552 = 17.99279 m per px. The view-state is at `<H>/fl-e2e-layout-s8.rep.layout-results-1795045054002.json:4166` and at `:4184` of the C results file.
     - Its cover is columns 3 to 8 and rows 4 to 10, 42 cells. Of those, 15 are wholly inside (columns 4 to 8, rows 8 to 10).
     - The other 41 wholly-inside cells lie outside the open's cover: columns 9 to 11 in rows 8 to 14, and columns 4 to 8 in rows 11 to 14.
   - **The notch, as observed.** The zoom goes to -3.2394433553937008 at the same centre (`:6050`; `:6080` at C). That is 9.44430 m per px.
     - At 480 px the view covers x 2601193.483 to 2605726.745 and y 1197413.276 to 1202626.528, so columns 4 to 7 and rows 5 to 9.
     - At 480 + 312 px it covers x 2599720.173 to 2607200.055, so columns 3 to 8.
     - At C the exposed wholly-inside cells were 8:8 and 9:8, so 2, as C's line says. Both are in the open's cover, so commit 1 counted 0, as its line says.
   - **The drag.** 160 px in 16 steps moves the view 150 px, because deck drops the first step (`e2e/pan-anchor.mjs` `instrumentA`, its `dx / steps` term). At 9.44430 m per px that is 1416.644 m east, so the centre x becomes 2604876.758.
     - Before the toggle, the view covers x 2602610.127 to 2607143.389, so columns 5 to 8.
     - Grown, it covers x 2601136.817 to 2608616.699, so columns 4 to 9.
     - Rows stay 5 to 9.
   - **The asked set.** It is the union of:
     - the open's cover;
     - the notch's and the drag's view-state lines at 480 × 552, which give columns 4 to 8 and rows 5 to 9;
     - the first dataset's tile lines (item 7), which give columns 3 to 5 and rows 7 to 8.
   - **Predicted count.** In the grown cover, only column 9 is unasked, in rows 5 to 9. Of those cells, 8:9 and 9:9 are wholly inside. **The prediction is 2 qualifying cells before the toggle and 2 after.**
   - **Margins.** The count stays 2 for any effective drag from 77 px to 232 px:
     - column 9 enters the grown view past 76.68 px;
     - column 9 enters the view before the toggle past 232.68 px;
     - column 10 enters the grown view only past 244.41 px.
     - Row 9 is inside by 42.6 px, and row 10 is outside by 125.1 px.
   - **At the toggle.** The grown view's plan has five unresident cells, column 9 in rows 5 to 9. Rows 7 to 9 of that column hold parcels, so streams and rows are due.

3. **(c) What FILL proves after the change.** On `100k-happy-path.parquet`, after the open's own fill, one notch in, and a move about 150 px east, a growth that uncovers a cell wholly inside the parcel area that no earlier ask covered issues a stream that delivers rows within 10 s.
   - It no longer tests the growth at the centred one-notch view. There, since this node, the open's fill has already loaded the uncovered cells, no stream is due, and FILL asserts nothing about that case.
   - FILL's mutation (`SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md`, Amendment 2, item 7) still fails by name. The mutated handler re-reports the last asked box, which is now the drag's view. The status precondition shows that every cell of that box is complete, so no stream is issued.

4. **(d) The stop.**
   - **Step 1, at C (e4c1dfba), with the script unedited, failed as §5's table said it might.** The two exposed cells were already resident from the open's fill. Byte-copied from `<H>/fl-e2e-layout-c.log:14`: `[FILL] FAIL (21546ms): FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`. The run went from 2026-11-18T23:34:01Z to 2026-11-18T23:35:14Z, by the log's first and last lines.
   - **Step 3, at commit 1, stopped at the precondition.** Byte-copied from `<H>/fl-e2e-layout-s8.log:14`: `[FILL] FAIL (9725ms): FILL: 0 qualifying cells before the toggle (zoom -3.2394433553937008, 480x552 + 312px): invalidator I3, STOP and report`. The run went from 2026-11-18T23:36:41Z to 2026-11-18T23:37:34Z.
   - So OPEN-6 (A) alone was not enough. §5's P-head predicted that every test passes, and that did not hold for FILL at commit 1.

5. **(e) The worker's deviations: (1) and (3) as its S8 report (`<S>/fl-s8-report-1.md`) states them, (2) as the custodian reported it to the advisor.**
   - (1) Before step 1, it applied the FILL edit by mistake. It saved the edit to `<S>/fl8-fill.patch` and reverted it with `git checkout -- frontends/shell/e2e/layout.mjs`. It then ran the busy check and the run with `git status --porcelain` empty, so step 1 ran on the unedited file at C.
   - (2) It drafted the README, KNOWN-LIMITATIONS and walkthrough words while step 3 ran, before step 3's result; none of them was committed, and ADV-2026-11-18-28 replaced the KNOWN-LIMITATIONS and walkthrough drafts.
   - (3) Beyond its brief, it wrote seven scratch files under `<S>` with `fl8-` names.

6. **(f) The prediction for the next run.** `layout.mjs` runs once, whole, at the worker's commit. Every step passes, FILL among them, with 2 qualifying cells before the toggle and 2 after.
   - The run's record copies:
     - the 100k dataset's `candidate-grid-frame-established` and `candidate-first-look-view-planned` session-log lines;
     - the last view-state line before the toggle.
   - It also says whether the planned box equals the fit view-state's box at FILL's measured size.
   - If FILL passes with any other count, or the box differs, the run goes to the advisor before S8 continues. Anything else follows ADV-2026-11-18-27 item 7.

7. **The ruling's item 4: the size at the plan.**
   - **The 100k open, which FILL counts, planned at 480 × 552.** That is the size FILL measures. Item 2 shows the session-log box is the fit's view-state at that size, in both runs. No script action between E-REOPEN's `openPath` and FILL's size read changes the window or a region, and the notch and the drag change no size.
   - **Commit 1's scan also counts another dataset.** It runs from the trace's first line, so it also counts the first dataset's tile lines. That open planned at 668 × 712 (`<S>/fl8-layout-s8.session.log:7`: 2239.774 × 2387.304 m at zoom -1.7454331102923848), and RESIZEQ asked at a grown size. The scan counts both at FILL's size in the 100k frame, which adds columns 3 to 5 and rows 7 to 8.
   - **Those extra asks can only remove a qualifying cell.** They only add cells to the asked set, so they can never add a qualifying cell. All of them lie in the open's cover, so they remove nothing here.
   - **A larger canvas at the plan could make FILL fail, never pass falsely.** If a page reflow without input ever made the canvas larger at the plan than at FILL's read, FILL could fail although the app is right. It could not pass where no stream is issued. Item 6's record checks this.
   - **No counting fix is made.**

8. **The lines, against §7.** The change adds 10 lines to `e2e/layout.mjs` and removes none, so `git diff --numstat 476936642cdd <commit>` gives 10 and 0.
   - Against the base, the file then stands at 20 of §7's 30: commit 1's 10 (9 added, 1 removed) plus these 10.
   - A count over 30 is class 8, recorded in the closing, and §7 is not edited.
   - No other e2e file changes. The README's FILL entry is redrawn afterwards from the script, under ADV-2026-11-18-27 item 8 (b).

9. **The walkthrough's Part V (class 9, a scope addition beside §10.2's rows).** Rows V2 and V3 of `frontends/shell/MANUAL-WALKTHROUGH.md` each gain a note, in the advisor's words (ADV-2026-11-19-02 item 4): since this node the strip V2 gains can already be loaded. Both rows join `operator-sitting-queue`.

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — step S9 stopped on I7: each first look's fill now goes into the console's 256-entry ring, so `command-bar.mjs` E-AND and `project.mjs` STYLE count `record_step` rows the ring has dropped; both suites read the newest rows by their content, declared here (class 9)

*Drafted by the architect (claude-opus-5-5), read only, at main 3d94561d50dc9bebd7f8346cf8d9cdbfeb3634dc and at F = e1fd84957b7ae042a075e7ccc5628a3de5670eb7, for the advisor's ruling; appended by the custodian's script after it. Code is cited by symbol and line at F. Reuse index: the custodian's line, byte-copied, the output of `node tools/reuse.mjs console ring record_step e2e suite rows dropped` in the reuse clone: `No prior art recorded for "console ring record_step e2e suite rows dropped". Research it before planning an implementation.`. It changes no product file, no test of §4 and no prediction of §5.*

1. **The stop.**
   - S9 at F failed `command-bar.mjs` E-AND and `project.mjs` STYLE twice each, with the same line each time. The reports are `state/consults/2026-11-19-open-first-look-fills-fit-view-s9-series-at-e1fd8495-tester-report.md` and `state/consults/2026-11-19-open-first-look-fills-fit-view-s9-re-runs-at-e1fd8495-tester-report.md`.
   - At the base, 9a4c58332661b6fd69fb477b1184f0147f38df2b, both suites passed once (`<S>/flbr-1.md`).
   - These are assertions not in §5's table, so this is I7. I4 is not engaged.
2. **The cause.**
   - The block (`candidateArmSession.ts:1490-1505`) plans the cover at every `Completed` first look.
   - Each tile is minted by `viewportQuery` (`tileViewportStreamManager.ts:955`). Every call is recorded in the console (`skp/client.ts:57`).
   - The console's ring drops its oldest entry when it holds 256 (`console/recorder.ts:141`, `:284`).
   - Evidence: in `<S>/fl9-s9-command-bar.session.log` the fills at `:140-252`, `:260-372` and `:379-490` hold 110 tile terminals each; in `<S>/fl9-s9-project.session.log` the fill at `:195-306` holds 110.
3. **What a user sees.**
   - After an open, and more after each Apply or Clear, the Console fills with the fill's `viewport_query` rows.
   - Older rows leave, and the label shows them as dropped (`ConsolePanel.tsx:65-68`).
   - Steps still reach the session history. No string changes.
   - §3 did not name this change. KNOWN-LIMITATIONS gains item 67, in the advisor's words (ADV-2026-11-19-06 item 5; class 9, a scope addition), and a node is proposed (item 14, A4-6).
4. **The fix (class 9, declared here before its code).**
   - `e2e/command-bar.mjs` `stepAnd` and `e2e/project.mjs` (`readRecordStepRows`, `waitRecorded`, `stepClauses`, `stepStyle`) read each `record_step` row's request and outcome.
   - After each commit they wait until the rows' requests end with the tail of the steps the suite has committed, in order, and the last row is `ok`.
   - Ceilings, `git diff --numstat` against F, added plus removed: `command-bar.mjs` 30; `project.mjs` 40.
   - No other file changes, except the records. §7's table is not edited.
5. **§5's last row failed for two suites, and is recorded as failed.** The row predicted no change for `command-bar.mjs` and `project.mjs`. At F, E-AND and STYLE failed; CLAUSES passed, and its reading changes with theirs. The row is not rewritten. Three rows are added below it, each marked "found at S9, not predicted", each with the cause of item 2:
   - `command-bar.mjs` E-AND;
   - `project.mjs` CLAUSES;
   - `project.mjs` STYLE.
6. **§11 item 11 is engaged, and the advisor lifts it for this case (ADV-2026-11-19-06 item 3).** A prediction of §5 failed at S9, and two suites' readings change after that run. The block is lifted on three conditions. The failed prediction is recorded as failed (item 5). The new reading is declared here before its code and keeps the property each step asserted: one row per commit, in order, `ok`. Each of item 7's three mutations is seen to fail. Both gates check all three. A gate that finds the property weakened reports it as a Correctness finding.
7. **Mutations.** Each is applied by hand on the frontend, its suite is run whole, the failing line is recorded with its commit id, and it is reverted with the porcelain empty. None is committed. A `verify-mutation` run is a check of a mutation's text, not its observation.
   - **M-A4-1:** delete `App.tsx:1060`. Expect E-AND to fail after B, and CLAUSES to fail.
   - **M-A4-2:** delete the loop at `App.tsx:2051`. Expect STYLE to fail after the opacity.
   - **M-A4-3:** enqueue the `App.tsx:1060` step twice. Expect E-AND to fail on the tail.
8. **The worker's steps** (the Sonnet worker, ADV-2026-11-18-16 item 7 (b)):
   - (a) Read the real request text of a `record_step` row (`console/render.ts`; `StepIntent` in `skp/types.ts`) before writing any matcher.
   - (b) Commit item 4's edits as F'.
   - (c) Run both suites whole at F', each in its own shared hold, with the S9 debug exe and its sha256 checked.
   - (d) Run item 7's three mutations.
   - (e) Report each run's lines byte-copied, with the commit ids.
9. **The custodian's steps:**
   - commit this amendment after the ruling;
   - dispatch item 8;
   - file the report;
   - give the reviewer `git diff --name-only e1fd8495 F'`;
   - the closing names F', the two runs and the three mutations by reference.
10. **The runs at F'.**
    - Only `command-bar.mjs` and `project.mjs` run. The product and the exe are unchanged, so S9's other results stand at F' by that diff.
    - Prediction: both exit 0, and each mutation fails as item 7 says.
    - A failure of E-AND, CLAUSES or STYLE at F' is I7 again. It goes to the advisor, with no second run.
11. **Budget.** `budget_minutes` goes from 440 to 500, my estimate. §7's table is not edited.
12. **Superseded index.**
    - Nothing of §5 is superseded: its last row stands, as a prediction that failed for `command-bar.mjs` and `project.mjs` (item 5).
    - The S9 series report's "as seen" for those two suites, and the re-runs report's reading of `s9-command-bar-2` as I4: by item 1.
13. **Packet for the advisor.**
    - **A4-1, the fix:** Option 1, the two suites (recommended); Option 2 adds `recording.mjs`; Options 3 and 4 are rejected.
    - **A4-2:** confirm item 6's reading of §11 item 11 (recommended: confirm).
    - **A4-3, the runs at F':** the two suites only (recommended), or the whole series again.
    - **A4-4:** base runs of the edited suites: none (recommended; item 7 shows the strength), or one each.
    - **A4-5:** `console`'s REGRESS' through K7 stays as the custodian classed it. It is not diagnosed here.
    - **A4-6:** the group that collapses when its first entry is dropped is reached right after an open now. Recommended: a proposed node, not this piece.
    - **A4-7:** a note on walkthrough rows AA1 and AA2: none (recommended; AA1 stays true by my reading), or a note in the advisor's words.
14. **The packet, as the advisor ruled it (ADV-2026-11-19-06).** Where an item above says "recommended", this item settles it.
    - **A4-1:** Option 1. `recording.mjs` is not changed. Not covered: its `waitForRecordedRows` counts the `record_step` rows since the open, and passed at F with one open's fill and one Apply's fill in the ring. The proposed node of A4-6 names it, and the form of the next piece that adds a first look to that suite's path reads it.
    - **A4-2:** item 6, as it now reads.
    - **A4-3:** the two suites only, if `git diff --name-only` from F to the merge request's head names only `frontends/shell/e2e/command-bar.mjs`, `frontends/shell/e2e/project.mjs` and `KNOWN-LIMITATIONS.md`. Any other path there comes to the advisor.
    - **A4-4:** no base runs of the edited suites.
    - **A4-5:** the `console` suite's one failure through K7 stays as classed (I4; its re-run passed). The reviewer's brief carries one question on it (ADV-2026-11-19-06 item 7).
    - **A4-6:** one node is proposed, not placed, and not on v0.2's list: the Console's ring against a view load's tile requests. Its summary names three things: the entries before two or three loads are dropped, a recorded step among them; an opened group closes when its first entry is dropped; `recording.mjs` counts rows since the open.
    - **A4-7:** no note on AA1 or AA2. J1 says "at least one `viewport_query`" and stays true by the advisor's reading.
    - **The reuse index:** the slot in this amendment's first paragraph takes the custodian's line, byte-copied and marked.

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — C1: `command-bar.mjs` E-AND after card B counts the `record_step` rows recorded since a mark taken from the Console's label, and fails where it cannot tell (class 9)

*Drafted by the architect (claude-opus-5-5), read only, at main 65a72f7243d205e519f194de1b9175dd669286fd and at H = e374eb711caaeae4dd898e8ddb49a35d4d80c619, for the advisor's ruling (ADV-2026-11-19-08 item 3); appended by the custodian's script after it. Code is cited `<path>:<line> at H`. Reuse index: the custodian's line, byte-copied, the output of `node tools/reuse.mjs console ring dropped entries sequence e2e record step count` in the reuse clone, run after the architect's hand-back because its brief carried none (a disclosed departure, class 1, ADV-2026-11-19-09 item 8): `No prior art recorded for "console ring dropped entries sequence e2e record step count". Research it before planning an implementation.`. It changes no product file, no test of §4 and no prediction of §5. "(mine)" marks the architect's choices.*

1. **The finding.** The reviewer's gate report at H (`state/consults/gates/2026-11-19-open-first-look-fills-fit-view-gate-reviewer.md`), C1 and check 8's M-X2 line; ADV-2026-11-19-08 items 1 and 2. §11 item 11 is not engaged (ADV-2026-11-19-08 item 4).
2. **What the code gives.**
   - Label: `frontends/shell/src/console/ConsolePanel.tsx:64-68 at H`. Held + dropped = entries recorded since the page loaded: `frontends/shell/src/console/recorder.ts:205-213`, `:282-288`, `:339 at H`.
   - Label and rendered entries come from one update: `ConsolePanel.tsx:48-52 at H`.
   - Order and groups: `recorder.ts:300-302`, `frontends/shell/src/console/consoleViewModel.ts:177-189`, `ConsolePanel.tsx:106-131 at H`.
   - Hence (mine): in one reading, counting a closed group as its `×N`, the entry at position k is entry number dropped + k.
3. **The reading after card B** (class 9, declared before its code; mine).
   - (a) Mark: after card A's wait (`frontends/shell/e2e/command-bar.mjs:433-434 at H`, unchanged), one read of the label; mark = held + dropped. An unparsable label fails with F1.
   - (b) Readings: one `page.evaluate` every 200 ms. They start once card B's cards read as applied (after `command-bar.mjs:437 at H`), go on while the step waits for the map to settle and makes its map checks (`:438-441 at H`), and end at (e)'s decision or at F3. The draft started them after `:439-441 at H`; the earlier start is the advisor's change (item 12). Each one: opens the Console if it is closed, and discards that reading; numbers each rendered entry by item 2; discards the reading if the entries and `×N` counts do not sum to held; returns each rendered `record_step` row's number, `stepKey` (`:368-373 at H`) and outcome; in the same call, clicks each closed group that holds an entry numbered at or above the mark.
   - (c) An entry is seen once a reading has rendered it. A row's outcome is the latest one read.
   - (d) An entry numbered at or above the mark that is unseen and below the reading's dropped count fails the step with F2. The step never passes on what the Console still holds.
   - (e) At the first reading after the check at `command-bar.mjs:441 at H` in which every entry from the mark up to the reading's total has been seen, and the newest `record_step` row at or above the mark is `ok`: the rows at or above the mark must be exactly one, keyed `filter:` + `ZONE_AB`, at `ok`. Otherwise F4.
   - (f) If no such reading comes within 30 s of that check: F3.
   - (g) Unchanged: card A's wait (`waitCommitted`, `:375 at H`), `readRecordStepRows` and `project.mjs` (ADV-2026-11-19-08 item 5). Replaced: `:442-444 at H`.
   - (h) Texts (test strings):
     - F1 `E-AND: the Console's label could not be read after card A's wait (<text>)`
     - F2 `E-AND: cannot tell how many record_step rows card B's commit added: entry <n>, recorded after the mark at <mark>, was dropped before it was read (label after card A's wait: <held> actions, <dropped> dropped; now: <held> actions, <dropped> dropped)`
     - F3 `E-AND: within 30000ms of card B's map settling no reading had read every entry since the mark with a record_step row since it at ok (<last reading>)`
     - F4 `E-AND: card B's commit added <n> record_step rows, expected exactly one, at ok, carrying the combined text: <[[key, outcome], ...]>`
     - In the PASS text (`:451 at H`), `one more record_step row reached ok` becomes `card B's commit added exactly one record_step row, at ok (Console after card A's wait: <held> actions, <dropped> dropped; after card B's map settled: <held> actions, <dropped> dropped)`. The second pair is the reading of (e).
   - (i) Why order needs no timing (by reading): the mark is read before `sendCondition` for B (`:435 at H`). The queue sends one step at a time, and the next step is recorded in the same task that resolves the one before (`frontends/shell/src/workspace/stepRecorder.ts:52-60`, `frontends/shell/src/skp/client.ts:57-60 at H`).
4. **Ceiling.** `command-bar.mjs`: 70 added plus removed, `git diff --numstat` against F, the E-AND-b header line included (the advisor's figure, item 12; the draft's was 60); this supersedes Amendment 4 item 4's 30 for this file. `project.mjs`: 40, not edited. No other path but the words commit's two (ADV-2026-11-19-08 items 8 and 9).
5. **Unmutated run.** E-AND passes with 3(h)'s PASS text. It decides if every entry recorded since the mark is rendered by some reading before 256 newer entries are recorded. The readings run during the load (3 (b)), so that asks for fewer than 256 entries in about two reading intervals (400 ms). The draft's reader started after the settle and had at most 36 entries of room, by ADV-2026-11-19-08 item 6's floor of 220. Prediction: it decides; not measured. F2 here is I7: it goes to the advisor with the four numbers, with no second run.
6. **Mutations** (as Amendment 4 item 7; a `verify-mutation` run is a check of a mutation's text, not its observation).
   - M-A4-1 (`App.tsx:1060 at H` deleted): fails at card A's wait, the unchanged line `E-AND: the newest record_step rows did not end with card A's step at ok before card B (<rows>)` (`command-bar.mjs:434 at H`).
   - M-A4-3 (the `App.tsx:1060 at H` step enqueued twice): card A's wait passes (the architect's gate at H, O1). Then F4 with n = 2, both rows `filter:` + `ZONE_AB`, at `ok`.
   - M-X2 (the reviewer's line, as applied in its gate report at H, C1): F4 with n = 2, `["filter:\"zone\" = 'residential'","ok"]` then `["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]`.
   - F2 in place of F4 still fails, but it is not the predicted line: recorded as such, with the four numbers.
7. **Unit layer** (by reading; no run required (mine)). `frontends/shell/src/App.command.test.tsx` RC3 (`:505`, `:512 at H`), RC5 (`:543`, `:548 at H`) and RC16 (`:644 at H`) pin the recorded steps of card changes. Under M-X2, RC3 fails at `:512` and RC5 at `:543`; RC16 passes.
8. **Worker's steps.** (a) Item 3's edits and the E-AND-b header line (the architect's draft, section 4), as one commit; the other words of ADV-2026-11-19-08 items 6 to 8 are a second commit, by the custodian's script, after (c). (b) `command-bar.mjs` run whole once, unmutated, in its own shared hold, with the S9 debug exe and its sha256 checked. (c) Item 6's three mutations. (d) Each run's lines byte-copied, with the commit ids. (e) One focused vitest run of `frontends/shell/src/App.command.test.tsx` under M-X2, reverted after it with the porcelain empty: RC3 and RC5 are predicted to fail and RC16 to pass (item 7).
9. **Not covered** (mine): a duplicate of card A's commit (the architect's gate O1; ADV-2026-11-19-08 item 5).
10. **Budget.** `budget_minutes` from 500 to 560, my estimate. §7's table is not edited.
11. **Superseded index.** Amendment 4 item 4, for `command-bar.mjs` after card B: the tail reading and the ceiling of 30, by items 3 and 4 here. Amendment 4 item 7 is not edited; its lines stand as the predictions for H.
12. **As the advisor ruled it (ADV-2026-11-19-09).** Items 3 (b), (e) and (f), the PASS line of 3 (h), and items 4, 5 and 8 carry the advisor's changes: the readings start once card B's cards are applied and run during the load, and the decision is still taken only after the map checks, when every entry since the mark has been read; the ceiling is 70; the words are a second commit; one vitest run under M-X2 is added. Confirmed as drafted: item 6's predictions, F2 in the unmutated run as I7 with no second run, item 9, and item 10's budget. The reuse slot in the first paragraph takes the custodian's line, byte-copied and marked.

Read the last amendment first.

Nothing above is edited.
