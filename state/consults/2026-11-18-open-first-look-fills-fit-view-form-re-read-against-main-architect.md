*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 38774 bytes, sha256 56eb4b2ead6dfdc85177b93b7cca2018409bb8baa3b745c4ae38fdf457b9c4b7, below the rule with one final newline added; calls Read 38, Grep 30, Glob 3, from 2026-11-18T16:34:39Z to 16:45:53Z. A consult, read only, at main 26141ebe; nothing in it is ruled by its filing.*

---

Re-read: main @ 26141ebedc900de0d4f4eefb9a7332d6c8ac791d (a consult, not a gate, so there is no verdict)

# open-first-look-fills-fit-view: the 2026-11-12 form draft re-read against main

Every code cite below is by symbol at 26141ebe unless it says otherwise. I read only. I ran nothing and wrote nothing.

## 1. What still holds and what moved

**Placement P-B is still the one I recommend.** Every first look goes through `reissueUnrestricted` into `issueUntiledQuery`, and so into the same untiled sink `onTerminal`. That covers the open, Apply, Clear and the Colour-by refill. So P-B reaches all of them with no extra guard. Main changed where P-B's request sits inside that `onTerminal`. It did not change whether P-B works.

- **Header lines: moved.**
  - The draft waited on PR B and #311. Both have merged (PR B at 1d2d4af9; #311 is done in PLAN), and so has S1 (18802abd).
  - The form class now rests on ADV-2026-11-16-06 item 2 (a), not on §21a alone.
- **§0.1 Authority: moved.** These rulings join it:
  - ADV-2026-11-13-02 (OPEN-2 (ii); OPEN-8; the other OPEN items take the draft's recommendations);
  - ADV-2026-11-14-15 item 6 (b);
  - ADV-2026-11-14-18 items 3 and 4;
  - ADV-2026-11-16-06 items 1 (a), 1 (c), 2, 3, 4 and 5;
  - ADV-2026-11-18-09 item 3, and S1's form Amendment 2 item 3.
- **§0.2: moved.** `recentre-crossing.mjs` is on main. #311's branch at b7ba9f77 is no longer read.
- **§0.3: holds.** The brief's new search is added.
- **§0.4: moved, so the pin list is replaced.** All 70 pins at 6e041829 are now historical, and the tree at 26141ebe is authoritative. The revised draft cites by symbol.
  - `candidateArmSession.ts`, changed by 18802abd:
    - S1's branch in the untiled sink's `onTerminal`, guarded by `wasCurrent && !wasSelfCancelled && !relinquishedReEmitted && (hasPlanned || terminal.kind !== "Completed")`;
    - `firstLookFailureStanding`: declared, consumed in `handleViewportChange`, reset in `reissueUnrestricted`;
    - the handler for the manager's `onTileDropped`.
    - PR B edited nothing under `residency/` (ADV-2026-11-14-15 item 1; ADV-2026-11-14-18 item 1 (d)).
  - `residencyStatus.ts`, changed by 18802abd: the `candidate-first-look-failed` variant, and `FIRST_LOOK_FAILED_NO_FRAME_TEXT` and `FIRST_LOOK_FAILED_TEXT`. `settledState` and the settled sentences are unchanged.
  - `tileViewportStreamManager.ts`, changed by 18802abd: the `onTileDropped` option, and `!this.overBudgetFlag` added to the requeue test. The `no-frame` return in `onCameraChange` is unchanged.
  - `App.tsx`, changed by 1d2d4af9: the Colour-by refill effect calls `issueQueryRef`, which on the candidate arm is `session.reissueUnrestricted`. That makes a third caller of the first look. The session's construction and the open's `reissueUnrestricted(null, …)` keep their shape.
  - `WorkingCanvas.tsx`: only line numbers moved, by 2 to 9 lines. S1 did not edit the file (its §5). The move came from 1d2d4af9 or #311's merge; the worker's S1 diff will name which. The bodies the draft rests on read the same at 26141ebe: `fitToExtent` with its unreported branch and `onViewShown`, `cameraRef`, `lastQueriedRef`, `reportViewport`, `onResize`'s third branch, `currentView?`, and the doc of the `onViewportChanged` prop.
- **§1: holds, with two moves.**
  - A failed first look before any plan now speaks (18802abd, S1 §2.2 (b)).
  - The Colour-by refill is added as a caller (1d2d4af9).
- **§2.1: moved (18802abd).**
  - S1 now owns the current first look's terminal when it is non-`Completed`, or comes after a plan. This node keeps the `Completed` terminal where no plan has run (ADV-2026-11-18-09 item 3).
  - The request becomes a sibling block placed after S1's block. Its guard is S1's three shared terms plus `!hasPlanned && kind === "Completed"`, so the two blocks never both run on one terminal.
  - **One change of mine, not caused by main:** the terminal calls `handleViewportChange(box)` directly instead of the debounced accept. With the debounce, the terminal's `syncScanLiveness()` would reset the scan and hide Cancel for 120 ms before the tiles are issued. The direct call keeps the scan in flight and is still the one planning path.
- **§2.2 and §2.3: hold.**
- **§2.4: holds.** One concurrency line is added: how this block partitions the terminal with S1's.
- **§2.5: holds.** S1's strings are not used by this node.
- **§2.6: holds, with two changes.** S1's files are added as not edited. `recentre-crossing.mjs` is dropped from the files the piece may edit.
- **§2.7: holds.**
- **§3: moved.**
  - The failed-first-look case is now S1's.
  - Apply and Clear are in scope by ruling, and the Colour-by refill is named.
  - One timing case is added: an earlier look's terminal that arrives after a reissue but before the new ticket is minted is read as current. This shares the root of `untiled-reissue-holds-earlier-look-handle-until-mint`.
- **§4: extended.**
  - U-FL2 gains rows (g) and (h); U-FL5 covers a reissue and U-FL6 the scan; M-U5 is new.
  - I correct E-FL, which is the draft's error, not main's. Opening the file needs `openPath`, as #311's E1 calls it. The fixture becomes `100k-happy-path.parquet`, the one the OPEN-C consult's §1 read.
- **§5: moved.**
  - `colour.mjs` is a new row (1d2d4af9).
  - `recentre-crossing.mjs` is read on main.
  - `filter.mjs` and `filter-panel.mjs` change under OPEN-2 (ii).
  - S1's suites are declared unchanged.
- **§6: holds.**
- **§7: re-counted.** The total goes from 1,038 to 1,101 (the table is in §7 of the revised draft).
- **§8: rewritten.** Every wait has been met. The overlap check and the regions remain.
- **§9: moved** by ADV-2026-11-16-06 items 2 (d), 3 and 5.
- **§10.1: moved.**
  - The item is number 64.
  - Item 51's 10,000-row clause goes with it (ADV-2026-11-14-18 item 4).
  - The words follow ADV-2026-11-13-02 item 2.
  - Item 56's first-look sentence holds.
- **§10.2: walkthrough row L2 added.**
- **§10.3: holds,** reworded for the direct call.
- **§10.4: moved.**
  - #311 did not land G2's words. The comment in `capture` (`frontends/shell/e2e/recentre-crossing.mjs:235` @ 26141ebe) says quiet trace lines do not prove the data is drawn, and gives the 3df3e57c observation.
  - That comment stays true after this node. G2's own words would be false after it.
  - So nothing is edited; the gates re-read the comment.
- **§10.5: holds.**
- **§11: updated.**
- **§12: every OPEN item of the draft is ruled** (ADV-2026-11-13-02). Two new items, OPEN-10 and OPEN-11, are left open with recommendations.

## 2. Record class

**Full form and both gates.** The deciding term of ADV-2026-11-16-06 item 2 (a) is "what the user is told about the state of their data (a partial view, a refusal)". The piece ends a partial view with no status, and it withdraws item 64. It also meets two more terms of item 2 (a): cancellation (the request is guarded against Cancel, stop and relinquish), and size (about 1,100 changed lines against the 260 line limit).

## 3. Smaller pieces

**One piece.** Each cut I tried pulls back in:
- The canvas member cannot land before its caller. The caller rule applies, and the round-8 exemption needs the human's pre-commitment, which does not exist here.
- E-FL is the seam's one end-to-end test from the real shape. It is also the evidence that item 64's retirement words are checked against. So it lands with the change.
- Item 64, item 51's clause and walkthrough rows A7, L1, L2 and L5 become untrue at the change's merge. Under proportional gates, a stale record found at the gate must be fixed in the same pull request. A records-only second piece would be pulled back into this one.

What I cut instead:
- the `recentre-crossing.mjs` edit;
- the accept-function refactor;
- product ceilings from 100 to 85;
- E-FL's ceiling from 420 to 380.

OPEN-11 (B) would save about 250 lines more; I recommend against it.

## 4. The revised draft

````markdown
# shell: when a first look ends Completed and no plan has run, the map plans the tiles of the view it shows, so that view fills without a pan and the status line speaks; full form, both gates

*File: `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md`. PLAN node `open-first-look-fills-fit-view`.*
*Drafted by the architect (claude-opus-5-5) for the custodian, read only, at main 26141ebedc900de0d4f4eefb9a7332d6c8ac791d; it revises the draft of 2026-11-12 at 6e041829 (`state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`). The custodian commits it before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-16-06 item 2 (a): what the user is told about a partial view; also cancellation and the size, §7).*
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
- It is called directly, not through the 120 ms debounce. In the same terminal the plan tracks its tiles before the sink's `syncScanLiveness()`, so the scan does not reset and Cancel does not drop out between the first look and its fill.
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
- An earlier look's `Completed` terminal that arrives after a reissue but before the new look's ticket is minted is read as current. It can plan the pre-fit view under the new filter, and the status can settle on that box while the new fit shows another. This is the root of `untiled-reissue-holds-earlier-look-handle-until-mint`.

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
- S1: the branch from main at dispatch (the base). Read each §2 symbol at the base; I0 if one has changed.
- S2: the §5 inventory, in the report.
- S3: commit the unit tests and run them. P-U-base, with the commit id.
- S4: commit E-FL and its script. Build the measure exe at that commit, run E-FL, P-E-base.
- S5: the change, with the comments of §10.3.
- S6: vitest; observe every mutation.
- S7: the head measure build; E-FL; P-head.
- S8: FILL under OPEN-6 (A); E-FL's README entry, and FILL's and the harness's entries re-read; the walkthrough rows; item 64's and item 51's drafts (§10.1).
- S9: one series at the final candidate (ADV-2026-11-16-06 item 3), the report, then both gates.

Nothing after S5 is committed before S3's and S4's records exist.

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

| Work | Minutes |
|---|---|
| S1 and S2 | 50 |
| U-FL1, U-FL2, U-FL3, U-FL5 and U-FL6 | 100 |
| U-FL4 | 40 |
| E-FL | 110 |
| the change | 30 |
| records | 20 |
| runs and mutations | 20 |
| report | 30 |

Builds and waits for a hold are stamped and reported apart. PLAN's `budget_minutes` is the custodian's.

**Model.** worker-high (ADV-2026-11-16-06 item 5 (a)). Ground: the order of the first look's terminal, the plan and Cancel in the session's state.

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

**10.4 G2.** Not added. The comment in `recentre-crossing.mjs`'s `capture` that #311 landed stays true after this node, and G2's drafted words would be false. The gates re-read it.

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
| 10: a test of the Colour-by refill at App level | OPEN. Recommendation: none; U-FL5 proves the shared `reissueUnrestricted`, and App's binding is one line |
| 11: E-FL as its own file (A), or as a case of `recentre-crossing.mjs` reusing its helpers (B, about 250 lines fewer) | OPEN. Recommendation: (A); a suite's exit code then means one thing |

## §13 Amendments (opens empty; append-only)
````

**Gate findings I see (not ruled):**
- F1 (Documentation, on main, outside this node): the complete-in-view sentence's count includes resident features outside the view.
- F4 (Documentation): the session's top comment says the open-drain step is not expected to show more than one tile stream. That becomes false at the head, and §10.3 replaces it. Any README or harness line that says the same is re-read at S2.
- The draft's F2 is closed by S1. Its F3 is dropped under the record cap.

## 5. Take to the advisor before the form's commit

1. ADV-2026-11-13-02 item 3 took the draft's recommendations. Within P-B, the terminal now calls `handleViewportChange` directly instead of the 120 ms debounced accept. The reason: so the scan does not reset and hide Cancel between the first look and its fill.
2. G2's words are not added. The comment #311 landed in `capture` stays true after this node, and G2's own would be false. The advisor should confirm that this answers item 3 (a)'s G2 clause.
3. On ADV-2026-11-14-18 item 3 (b): the placement reaches every first look issued through `reissueUnrestricted`, the Colour-by refill included. U-FL5 shows it. Nothing needs to be raised on this point.
4. On ADV-2026-11-16-06 item 1 (c): the fix does not reach a first look that fails at open with no batch. S1's W1 now covers that case.
5. A new §31 (c) timing case: an orphan `Completed` terminal read as current after a reissue. It shares the root of `untiled-reissue-holds-earlier-look-handle-until-mint`. If that node is placed, its region overlaps this one, and it should go after this node.
6. The class is full under item 2 (a); ADV-2026-11-16-06 runs for a week from 2026-11-16. The worker is worker-high, on the concurrency ground.

Files read:
- C:/dev/spatial-ide/state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md
- C:/dev/spatial-ide/governance/PLAN.yaml
- the six rulings named in the brief, plus the human's directive of 2026-11-16, under C:/dev/spatial-ide/state/directives/
- C:/dev/spatial-ide/governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md
- C:/dev/spatial-ide/governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md, its Amendments 4 and 5
- C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.ts
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyStatus.ts
- C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx
- C:/dev/spatial-ide/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/frontends/shell/e2e/recentre-crossing.mjs, layout.mjs, colour.mjs and lib.mjs
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md, items 7, 18, 39, 51, 56, 61 and 64
- C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md, A7 and Part L
- the OPEN-C consult's G1 and G2

Model: claude-opus-5-5.
