*Custodian's filing note (2026-11-12): the architect's draft of the full form for slot 2's recentre-crossing-view-displaced-fix, read only at main 7d7261a7, from its hand-back (44742 bytes, sha256 2c6c18c09d362c52a80d74973b8f76bb415804ccc1b14a63c7684480a1a83846), below the rule unchanged; one final newline is added. Its brief by file (10123 bytes, sha256 2342b67ca61015f2f125ba99e56453d886877b448c1c783c26ec42186f30f14d), with the reuse index's output byte for byte; the run 01:29:32Z to 01:51:59Z by its transcript, 102 calls (Read 57, Grep 36, Glob 8, the hand-back), two errored (a Grep at each of two paths that do not exist), none writing, model claude-opus-5-5. A draft, a reading and not Authority. The form is committed at this commit from its fenced block (`governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md`), each pin filled by script, with the custodian's settlement of its §14 as its Amendment 1; each `<H>` stays as written here.*

---

Drafted: recentre-crossing-view-displaced-fix full form

Read at `main @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055`. This is a form draft, not a gate, so it carries no verdict.

````
# shell: after a pan crosses the re-centring bound, the view stays where it was — the re-centre's camera move is returned from deck's view-state callback instead of written by `setProps` inside it; full form, both gates

*File: `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md`. PLAN node `recentre-crossing-view-displaced-fix` (C1), slot 2, S1.*
*Drafted by the architect (claude-opus-5-5) on 2026-11-12 for the custodian. The custodian commits it before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, with both gates from dispatch. The human ordered this in their message of 2026-11-11 (21:49Z), item 5 (b), last paragraph (C6).*
*Code starts when OPEN-1 is settled (§14).*

## §0 Disclosure

**0.1 Authority.**
- The human's message of 2026-11-11 (21:49Z), item 5 (b) (C5; its last paragraph, C6).
  - The candidate, its readings and the reproducer's outcomes bind this form.
  - S1, the full form, both gates and slot 2 at once.
  - The architect proposes the fix's shape.
  - Slot 1 keeps PR #307.
  - v0.2 does not tag with this defect on main.

**0.2 Evidence, not Authority.**
- The reproducer's form, `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md`, cited by note: note 3 (the drags), note 4 (the records), note 5 (the outcomes and the image rule), note 8 (the deck.gl fact and the frozen suite's blind spot) and note 10 (what it hands on).
- Run rc's report (C7–C11).
- Its single reviewer's PASS: `state/consults/gates/2026-11-12-recentre-crossing-view-displaced-by-origin-move-gate-rc-reviewer.md`, filed sha256 ff082b51eea36f271782cdeaedce8a20d8a36383cf8bcc084ecff351e7fb6acf, cited whole.
- The diagnostic consult's H1 and H2 (C12, C13).
- deck's installed source, D1–D20. It is untracked and read for what it does; it is not Authority.

**0.3 The reuse index.** Byte-copied from the custodian's brief and marked so. The custodian ran it in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-12.

```
$ node tools/reuse.mjs deck view state callback overwrite recentre snap origin   (exit 1)
No prior art recorded for "deck view state callback overwrite recentre snap origin". Research it before planning an implementation.
$ node tools/reuse.mjs view state controlled deck onViewStateChange snap
No prior art recorded for "view state controlled deck onviewstatechange snap". Research it before planning an implementation.
(exit 1)
$ node tools/reuse.mjs world origin rebase precision float32 pan
No prior art recorded for "world origin rebase precision float32 pan". Research it before planning an implementation.
(exit 1)
```

Misses: all three searches found no prior art. The research behind §1 and §2 is a reading of deck 9.3.9's own source (D1–D20).

**0.4 Cites.**

Tracked cites are all at main, `@ 7d7261a7ccfe3ffe605499b460338d0dd10e3055`. The custodian computes each `<H>` as sha256 over the cited whole lines, LF bytes.

PLAN and the human's message:
- C1 `governance/PLAN.yaml:5571-5587` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C2 `governance/PLAN.yaml:5520-5536` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C3 `governance/PLAN.yaml:5554-5570` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C4 `governance/PLAN.yaml:5741-5757` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C5 `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:20-23` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C6 `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:23` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

Run rc's report:
- C7 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:73-74` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C8 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:75-76` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C9 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:78-81` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C10 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:82-86` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C11 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:88` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

The diagnostic consult:
- C12 `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:231-239` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C13 `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:240-243` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

`WorkingCanvas.tsx`:
- C14 `frontends/shell/src/canvas/WorkingCanvas.tsx:95-111` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C15 `frontends/shell/src/canvas/WorkingCanvas.tsx:443-484` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C16 `frontends/shell/src/canvas/WorkingCanvas.tsx:586-592` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C17 `frontends/shell/src/canvas/WorkingCanvas.tsx:1408-1417` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C18 `frontends/shell/src/canvas/WorkingCanvas.tsx:2035-2041` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C19 `frontends/shell/src/canvas/WorkingCanvas.tsx:2077-2147` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C20 `frontends/shell/src/canvas/WorkingCanvas.tsx:2083-2091` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C21 `frontends/shell/src/canvas/WorkingCanvas.tsx:2101` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C22 `frontends/shell/src/canvas/WorkingCanvas.tsx:2103-2111` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C23 `frontends/shell/src/canvas/WorkingCanvas.tsx:2113-2126` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C24 `frontends/shell/src/canvas/WorkingCanvas.tsx:2127-2134` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C25 `frontends/shell/src/canvas/WorkingCanvas.tsx:2136-2146` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C26 `frontends/shell/src/canvas/WorkingCanvas.tsx:2229-2230` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C27 `frontends/shell/src/canvas/WorkingCanvas.tsx:2319-2357` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

`offsetFrame.ts` and `renderTrace.ts`:
- C28 `frontends/shell/src/canvas/offsetFrame.ts:38` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C29 `frontends/shell/src/canvas/offsetFrame.ts:64-69` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C30 `frontends/shell/src/canvas/offsetFrame.ts:84-91` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C31 `frontends/shell/src/canvas/offsetFrame.ts:128-130` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C32 `frontends/shell/src/canvas/offsetFrame.ts:166-173` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C33 `frontends/shell/src/canvas/offsetFrame.ts:187-193` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C34 `frontends/shell/src/canvas/offsetFrame.ts:196-198` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C35 `frontends/shell/src/diagnostics/renderTrace.ts:52-53` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

The e2e files:
- C36 `frontends/shell/e2e/pan-anchor.mjs:27-34` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C37 `frontends/shell/e2e/pan-anchor.mjs:38-45` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C38 `frontends/shell/e2e/pan-anchor.mjs:47` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C39 `frontends/shell/e2e/pan-anchor.mjs:57-74` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C40 `frontends/shell/e2e/pan-anchor.mjs:108-117` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C41 `frontends/shell/e2e/pan-anchor.mjs:256-265` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C42 `frontends/shell/e2e/pan-anchor.mjs:266-277` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C43 `frontends/shell/e2e/lib.mjs:254-303` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C44 `frontends/shell/e2e/lib.mjs:319-341` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C45 `frontends/shell/e2e/lib.mjs:348-369` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

Tests and forms:
- C46 `frontends/shell/src/canvas/WorkingCanvas.test.ts:745-832` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C47 `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:121-137` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

ADR-010:
- C48 `docs/adr/ADR-010-render-frames-origins-boundaries.md:17-29` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C49 `docs/adr/ADR-010-render-frames-origins-boundaries.md:49-53` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C50 `docs/adr/ADR-010-render-frames-origins-boundaries.md:60` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C51 `docs/adr/ADR-010-render-frames-origins-boundaries.md:62-68` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C52 `docs/adr/ADR-010-render-frames-origins-boundaries.md:70-74` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C53 `docs/adr/ADR-010-render-frames-origins-boundaries.md:76-87` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

AUTONOMY:
- C54 `governance/AUTONOMY.md:315-332` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C55 `governance/AUTONOMY.md:347-357` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C56 `governance/AUTONOMY.md:377-391` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C57 `governance/AUTONOMY.md:482` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

Records and the rest:
- C58 `frontends/shell/MANUAL-WALKTHROUGH.md:164-166` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C59 `KNOWN-LIMITATIONS.md:230-246` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C60 `frontends/shell/e2e/README.md:760-768` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C61 `state/directives/2026-10-06-machine-script-adopted.md:12-22` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>
- C62 `frontends/shell/package.json:25-48` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:<H>

The deck cites are package-relative into `@deck.gl/core` 9.3.9, as installed under `frontends/shell/node_modules/` (its `package.json`, version field). They are untracked and carry no hash.

`dist/lib/`:
- D1 `deck.js:323-328`: the `initialViewState` deep-equal overwrite.
- D2 `deck.js:831-833`: `_getViewState`.
- D3 `deck.js:1044-1057`: `_onViewStateChange`.
- D4 `deck.d.ts:153`: the callback's return type.
- D5 `view-manager.js:93-98`: `getViewState`, per-view entry first.
- D6 `view-manager.js:182-194`: `_setViewState`.
- D7 `view-manager.js:212-235`: `_updateController`.

`dist/views/`:
- D8 `view.js:51-58`: `getViewStateId`.

`dist/controllers/`:
- D9 `controller.js:77-119`: `handleEvent` and the `controllerState` getter.
- D10 `controller.js:158-168`: `setProps` into `processViewStateChange`.
- D11 `controller.js:169-170`: inertia.
- D12 `controller.js:226-240`: `updateViewport`.
- D13 `controller.js:294-320`: `_onPanMoveEnd`.
- D14 `controller.js:528-544`: `_onDoubleClick`.
- D15 `controller.js:615-629`: `_getTransitionProps`.
- D16 `orthographic-controller.js:312-321`: a 300 ms `LinearInterpolator`.
- D17 `transition-manager.js:16-31`: a transition frame calls `onViewStateChange`.
- D18 `transition-manager.js:47-75`: `processViewStateChange`, which cancels a transition.
- D19 `transition-manager.js:80-84`: `_isTransitionEnabled`.
- D20 `transition-manager.js:92-106`: `_shouldIgnoreViewportChange`.

## §1 The defect, from the records

**1.1 What run rc showed.** These are the report's own fields; no new numbers are added here.
- The plan and the canvas box (C7).
- The start line and the end line (C8).
- Five origin changes. Each has dTarget (0, 0), and each ΔO equals the previous line's target (C9).
- S, E, |E − S| ≤ d, and the screenshot pair differs (C10).
- Real's three conditions hold (C11).
- Its single reviewer recomputed every field equal and gave PASS (§0.2).

**1.2 H1 (C12) is confirmed by deck 9.3.9's source, read against those records.**
1. The re-centre's camera move is a `setProps({ initialViewState })` call inside `onViewStateChange` (C24). The handler returns nothing (C19).
2. deck takes the new value into its own view state when it is not deep-equal to the last one (D1).
3. When the callback returns, deck stores the callback's return value under the view's id. If the callback returns nothing, deck stores the tick's own view state there (D3). The view's id is `working` (C18, D8).
4. deck's lookup takes that per-view entry before the root (D5). So the tick's old-frame target shadows the move, while the frame's origin has moved to the view point (C33).
5. The camera that is drawn is therefore the old target against the new origin, and W moves by ΔO. That is what the report shows at every change (C9).

**1.3 A second mechanism compounds H1.**
- The origin moves to the view point (C33), so `toLocal` gives (0, 0) (C34). Every re-centre at one zoom therefore writes the same value.
- deck drops a repeated value (D1; entry 85, C14's last sentence). So at one zoom, every move after the first is dropped before H1 acts.
- The first change in run rc isolates H1. Its move follows the fit's write, which carries a write id (C15, C17). So deck accepts the move, and the target still did not rebase (C9).

**1.4 Consequence.** While the target stays beyond T, each settled tick re-crosses. Run rc shows five changes (C9); a working re-centre would make one per leg (§5).

**1.5 What else could explain the records, and why it does not.**
- (a) A trace artefact. The line is logged before the re-centre (C21 before C24). Excluded: the changes show on the next lines, with the new origin and the target not rebased, and the end image has no data where the start image had some (C10).
- (b) The controller's stale pan state (C23's account). Excluded for these changes, which land on settled ticks. deck rebuilds its controller state from its props on every event (D9), and those props are the per-view entry H1 names (D7).
- (c) The reading itself. The reviewer recomputed it equal (§0.2).
- (d) The drags' own asymmetry. It is bounded by |E − S| ≤ d (C10). It explains the end target (C8), not S.
- Not separated: after the first change, H1 and the deep-equal drop give the same records. No run separates them, so the fix must defeat both.

**1.6 Reach.** Any tick that is not dragging and finds the target beyond T re-centres (C24, C32).
- That covers a drag's end, a wheel tick, and the frames and start tick of deck's 300 ms double-click and keyboard transitions (D14–D17).
- Only drags were run.

**1.7 Why the frozen suite could not see it.** See the reproducer's note 8.
- Its crossing case reads its last line before the gesture-end re-centre (C42).
- Its there-and-back runs at zoom −1, far inside T (C41).

## §2 The fix

### 2.1 Shape A (recommended): the callback returns the re-centred view state

**Where.** `frontends/shell/src/canvas/WorkingCanvas.tsx`, in the handler (C19) and its comments, plus the top doc comment (§2.4). No other product file changes.
- On a re-centring tick, the handler returns `{ ...viewState, target: [localX, localY, vs.target[2] ?? 0] }`.
- The `setProps({ initialViewState })` call in C24 is removed. `render()` stays where it is.
- On every other tick the handler returns nothing, as it does now.

**The guard.** It keeps `!isDragging` and gains two conditions. There is no re-centre:
- (i) on a tick whose `interactionState.inTransition` is true; or
- (ii) on a tick whose view state carries a transition, by deck's own test (D19).

Why the guard is needed:
- A view state returned during a transition is not the transition's own update. deck cancels the transition (D18, reached through D7 and D10), so a double-click zoom would stop short.
- A view state returned on a transition's start tick makes deck animate from the old frame's start to the new frame's end (D18).
- With the guard, the re-centre lands on the next tick that is neither dragging nor in a transition. That is the same deferral the drag already takes (C23).

**The contract.** deck types the callback's return value as a view state (D4) and uses it in place of the tick's own (D3).
- The entry deck stores is the rebased one, so H1 is defeated.
- No `initialViewState` is written, so the deep-equal drop is defeated.
- The rebased state reaches deck's controller as its props (D7, D10). With no transition in progress and none enabled, the transition manager ignores it (D20). The next event builds its state from those props (D9).

**Under ADR-010:**
- Rule 1 (C48):
  - The handler still combines `vs.target` only with the origin it captured before the re-centre (C22). The trace line (C21) and `reportViewport` (C25) keep that pair.
  - The returned value is renderer-local in the new frame. It stays inside the renderer, and it is the frame in which `render()` rebuilt the layers.
  - The defect is this rule's hazard in effect (an old-frame target drawn against the new origin), and Shape A removes it.
  - deck's `info.coordinate` stays unread.
- Rule 3 (C49): unchanged. `toLocal` is f64 subtraction (C34), and the layers' offsets are unchanged.
- Rule 4's sentence on whole-buffer rebase (C50): what a re-centre does is unchanged (C13). No claim is made.
- Rule 5 (C51): `render()` and the returned state land in one deck call (D3), before the next draw. Under the defect, new-frame layers were drawn with an old-frame camera; Shape A closes that window. Not claimed per frame: §4 reads the trace and images, not every frame.
- Rules 6 and 7 (C52, C53): untouched.
- docs/01 principle 8: each re-centre is still recorded in `offsetFrame.events` (C31).

**The settled tick.** Shape A still depends on it, because the drag deferral is kept.
- Read in 9.3.9: inertia is 0 under `controller: true` (C18, D11), and a pan's end calls `updateViewport` with `isDragging: false` (D12, D13).
- Seen on 9.3.9 in run rc: the five changes each land at a drag's settled tick (C9).
- Not read and not run: a gesture ended by `pointercancel`. The code note keeps it as a condition.

**Guarantee or property under test (§21a's fourth category, C54): yes.**
- The property "the view does not move when the frame re-centres" goes from broken at low zoom to held, for a drag's end, a wheel tick and a transition's end. That property is the walkthrough's A5 and A6 (C58) and the top doc comment (C14).
- The deferral on transition frames is a declared change (§3).
- The full form is already ordered (§0.1). §25 (e) (C57) adds nothing here.

### 2.2 Shape B: a deferred `setProps` with a re-centre write id

**Where.** The same handler. The move leaves the callback (a microtask or the next frame) and carries an id from a sequence like the fit's (C15).

**Trade-offs.**
- It works through the route the fit uses (D1, outside the callback).
- Between the return and the deferred write, deck can draw new-frame layers with the old-frame camera (rule 5's window). Avoiding that means deferring `render()` too, which takes the frame pairing out of the tick (rule 1).
- An event in that gap is handled in the old frame.
- It has the same transition hazard and the same settled-tick dependence as A, and changes the same property.
- It needs more code.
- Not recommended.

### 2.3 Shape C: controlled mode (a `viewState` prop owned by the canvas)

**Where.** `WorkingCanvas.tsx`, every camera write: the constructor (C18), the fit (C17), the DEV seam (C27) and the handler. The top doc comment's load-bearing rule (C14) is reversed.

**Trade-offs.**
- It removes both mechanisms for every write.
- It rewrites the camera model that entry 85's tests (C46) and pan-anchor's seam lines rest on, and every camera path needs proof again.
- The settled-tick dependence is unchanged.
- Not now.

**Rejected outright:** a second trace line after the move. It would change the line stream that pan-anchor's route 1 waits on (§8).

### 2.4 Recommendation, and the words it changes

**Recommendation: Shape A.**
- It is the smallest change, in one file.
- It uses deck's typed contract and defeats both mechanisms.
- It opens no new stale window and leaves the line stream unchanged.

**Words.** These are worker-drafted code comments, not the human's words. They are applied with the fix and checked clause by clause at the gate.
- C14, the sentence beginning "A later programmatic jump": it states that the re-centre's jump works uncontrolled, which D3 and D5 contradict. Draft replacement: *A programmatic jump made outside deck's view-state callback (the fit, and the DEV-only test seam) works uncontrolled: `setProps` re-syncs deck's own view state from `initialViewState` whenever the new value is not deep-equal to the last one (`@deck.gl/core@9.3.9` `dist/lib/deck.js`, `setProps`). Inside the callback it does not: deck then stores the callback's view state under the view's id, which its view lookup prefers, so the re-centre's camera move is the callback's return value instead (see `onViewStateChange` below).*
  - Clause check: the fit and the seam are outside the callback (C17, C27). The re-sync rule is D1. The per-view store is D3. The lookup is D5. The return value is §2.1.
- C14, the version label: 9.3.7 becomes 9.3.9. The claim was read again in D2 and D3.
- C20: restate the note on 9.3.9 evidence (§2.1 The settled tick).
  - Name the guards: `e2e/recentre-crossing.mjs` and `e2e/pan-anchor.mjs`, both operator-run and not in CI.
  - Name `WorkingCanvas.recentre.test.tsx` too, and say that it models deck's rules and so cannot see a change in deck.
  - The sentence about re-running after any `@deck.gl/*` bump names both suites.
- C23 and the comment inside C24: the description of the move becomes the return value. Add the transition clauses with their reason (§2.1 The guard).
- C26: not on the fix's path, and left as it is (OPEN-9).

### 2.5 Boundaries

**May edit:** the files in §7.

**Not edited:**
- `frontends/shell/e2e/pan-anchor.mjs` and its tolerance.
- `offsetFrame.ts`, `lib.mjs`, `e2e-test-surface.ts`, `renderTrace.ts`.
- `WorkingCanvas.wiring.test.tsx`, `WorkingCanvas.test.ts`.
- The e2e `project.mjs` and `checkDistClean.mjs`.
- `package-lock.json`, any dependency, and deck's version. Changing a dependency or deck's version is a red line.
- Anything under `kernel/`, `engine/`, `protocol/`, `renderer/` or `src-tauri`.
- No new export, option or `pub` item. If the worker extracts a helper, its only product caller is the handler.

### 2.6 Portability

The fix is page code, and deck's source is the same on every platform. E1 runs on Windows/WebView2 only. Nothing is claimed for macOS or Linux.

## §3 What may and may not be claimed

**May be claimed, on the head's measure build:**
- A drag that crosses the bound re-centres without moving the view (E1 case 1).
- A double-click near the bound does not re-centre until its transition has ended, and the zoom completes (E1 case 2).
- U1 and U2 hold against deck 9.3.9's rules as the test models them.

**May not be claimed:**
- Any docs/08 measurement or performance effect.
- Anything about `pointercancel`.
- macOS or Linux.
- That no frame shows the re-centre (only the trace and two images are read).
- That the deferral on transitions is harmless at every zoom. Until the next qualifying tick, the frame's offset may exceed the bound (offsetFrame.ts, C28–C30). Not measured.
- That deck's trailing tick is an invariant.
- Anything about v0.1.0 until §10's check is made.

## §4 Tests (outcomes declared in §5 before any run)

| ID | Kind and file | Asserts | Mutation and expected failure |
|---|---|---|---|
| U1 | vitest, new `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx` (see the note below) | After the one-shot fit (driven by pushing a batch, as the wiring test does), drag ticks then a settled tick take the target past T. The next traced line's W (C35) equals the line before the change, within 1e-6 world units, and the origin has changed. A second crossing at the same zoom gives the same. | M-U1: restore the in-callback `setProps({ initialViewState })` move and return nothing. U1 fails at the first crossing: W jumps by ΔO. |
| U2 | the same file | No origin change on (a) a settled tick past T with `interactionState.inTransition` true, or (b) one whose view state carries `transitionDuration: 300` with an interpolator. (c) The next tick with no transition re-centres, and W is continuous. | M-U2: remove the guard's transition clauses. U2 fails at (a): the origin changes. |
| E1 | new `frontends/shell/e2e/recentre-crossing.mjs` with npm script `e2e:recentre-crossing`; head measure build; the 100k fixture (C38) | **Precondition** (else exit 2, VOID, not PASS): the fit line arrives, and case 1 has at least one origin change in each leg. **Case 1** (from the fit, with no DEV hook): n1 drags of +L, n1 of −L, then a closing pair. STEPS = 30, L = 30·floor(min(300, floor(cw/2) − 8)/30), d = (L − L/STEPS)·2^−z_fit, n1 = floor(T/d) + 3. (a) Across each origin change, consecutive lines' \|ΔW\|·2^z·(bw/cw) ≤ 4.0 buffer px per axis. (b) \|W_end − W_start\| ≤ d per axis. (c) Start and end images, by the reproducer's note 5 rule, carried in code. **Case 2** (after case 1, from the fit again, reached by its own reload): drag out until the target is within half of a 300 px double-click shift below T, then double-click 300 px off centre, settle, one wheel notch out, settle, one wheel notch in, settle. (i) No origin change among the lines from the double-click to its settle. (ii) The zoom after that settle is the zoom before plus 1, within 1e-6. (iii) Across the origin change at the wheel tick, \|ΔW\| as in (a). Exit 0 if all pass, 1 on any failure. | M-E1: the fix reverted. It is observed by E1's run on the base build (§7 step S3), whose product tree is the base by construction. That record is named a run at the base. Expected: case 1 (a), (b) and (c) fail, and case 2 (i) fails. |

- **The fake.** U1 and U2 run the real `WorkingCanvas` with `@deck.gl/core` mocked by a fake that applies D1, D3 and D5 as written, each rule's comment citing its D-file and line at 9.3.9. Why a new file: the wiring test file is #307's path.
- **E1's methods.** Its own drag helper is pan-anchor's shape (C40), down, move and up, with its own STEPS. Its settle is `waitForSettle` (C45) over the `view-state` lines read as C39 reads them. It launches through `attachOrLaunchExe` (C43). It captures with CDP `Page.captureScreenshot`, clipped to the canvas box. PNGs are decoded with `node:zlib` (no dependency).
- **E1's tolerance.** E1's own constant is 4.0 buffer px, on the basis of C47, restated in its comment (OPEN-2).
- **Observing mutations.** Each mutation is applied by hand, the named test run and its failure recorded, then reverted. A verify-mutation run, if one is made, is recorded as a check of the mutation's text, never as its observation. A test-text span on the branch is named with its commit id and never pinned by hash at a branch commit.

## §5 Predictions, unchanged items, invalidators

**Predictions.**
- P-U-base: at the base, with the test file added (§7 step S2), U1 fails at the first crossing, and U2 fails at (a). The base re-centres on any non-dragging tick (C24).
- P-E1-base: at the base build, the precondition is met. Case 1 (a), (b) and (c) fail, as run rc shows (C9–C11). Case 2 (i) fails and (ii) passes.
- P-head: U1, U2 and E1 all pass. Case 1 gives exactly two origin changes, one per leg: the out leg crosses at drag floor(T/d)+1 and the back leg at its drag n1. This is my derivation, recorded and not asserted.

**Declared unchanged:**
- Every existing vitest test.
- pan-anchor's checks: no trace line is added or removed per tick, and its crossing case reads before the re-centre (C42).
- Every other e2e suite.

**Invalidators.** Each one stops the piece and returns it to the architect by amendment; nothing is adjusted.
- I1: U1 or U2 passes at the base. The fake does not model deck.
- I2: E1's precondition is unmet at the base or at the head. The result is VOID.
- I3: E1 case 1 passes at the base. The suite cannot see the defect.
- I4: a failure seen in a shared run that depends on timing is recorded as such, run again in a later hold, and not counted.

**Falsification.** A failure of U1, U2 or E1 at the head is the fix failing. It is recorded as seen.

## §6 The instrument

The reproducer's instrument was a reverted worktree edit to `pan-anchor.mjs` (rc.patch, sha256 cef12e83bc880f9cd0afdbed601ddbed9607653a2fb485c89d4dba2ddc5eb512, in scratch). It does not land as a patch.

**What lands, rewritten as E1's own committed code:**
- the drag plan's formulas (the reproducer's note 3, with the STEPS change in §4);
- the `view-state` line reading and W;
- the CDP capture written with flag `wx`;
- the note 5 image rule.

**What does not land:**
- the page `console.debug` wrapper;
- the node-side jsonl dumps;
- the clock checks;
- the stall heartbeat;
- any edit to `pan-anchor.mjs`.

## §7 Steps, files, ceilings, budget

**Steps** (S1 is the custodian's; S2–S8 are the worker's):
- S1: this form is committed on main.
- S2: a branch from the base (the main commit named in the report; §14 OPEN-1). Commit the U1/U2 file, run vitest, and record P-U-base with the commit id.
- S3: commit E1 and its npm script. Build the measure exe at that commit (its product tree is the base). Run E1 and record P-E1-base.
- S4: the fix commit (`WorkingCanvas.tsx`: the handler, the guard, the §2.4 words).
- S5: vitest at the head; observe M-U1 and M-U2.
- S6: build the measure exe at the head, run E1, and record P-head.
- S7: the e2e README entry (shaped like C60), and the walkthrough row (OPEN-4).
- S8: the report, then both gates.
- Nothing after S4 is committed before S2's and S3's records exist.

**Files and ceilings.** Insertions plus deletions, comments counted, by `git diff --numstat <base>...HEAD -- frontends/shell`:

| Group | File | Ceiling |
|---|---|---|
| product | `frontends/shell/src/canvas/WorkingCanvas.tsx` | 70 |
| unit | `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx` (new) | 300 |
| e2e | `frontends/shell/e2e/recentre-crossing.mjs` (new) | 450 |
| e2e | `frontends/shell/package.json` (one script line) | 2 |
| docs | `frontends/shell/e2e/README.md` (a new suite entry) | 45 |
| docs | `frontends/shell/MANUAL-WALKTHROUGH.md` (one Part A row, OPEN-4) | 4 |

- An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions), and §7 is not edited to match.
- A file outside this table is class 9, declared by amendment before any of its code.

**Budget:** 290 minutes of work, my estimate and not a measurement:

| Work | Minutes |
|---|---|
| fix | 30 |
| U1/U2 | 60 |
| E1 | 130 |
| docs | 20 |
| runs and mutations | 20 |
| report | 30 |

- The wall time of the two measure builds and of the waits for a hold is stamped and reported separately, not counted against the budget.
- PLAN's `budget_minutes` (C1) is the custodian's to set.

## §8 The order with pan-anchor

`pan-anchor-setcam-waits-for-its-own-reset` (C2) is blocked behind this node.

**What this fix leaves alone.** It adds no trace line and moves none (C21; C17's line at 1410; the seam's line in C27). It changes no seam, and E1 is a separate file. So pan-anchor's checks and its route 1 (waiting on its own lines) are unaffected in substance.

**Its pins.** The fix inserts lines above the seam in `WorkingCanvas.tsx`. pan-anchor's form pins at 544c8971 into that seam's span therefore become historical, not current. Its M-TRACE is named by content and still resolves.

**Its form.** No separate amendment (OPEN-8). Its owed route-1 amendment (its Amendment 4) names this piece's merge commit as its base and M-TRACE by content.

**What the reviewer runs.** pan-anchor at the head (§12) confirms the unchanged predictions.

## §9 Measurements and strings

**Measurements.**
- Per tick, the added work is one extra boolean read. A re-centring tick adds one object spread.
- What `render()` does on a re-centre is unchanged (C13).
- docs/08's frame budget (at most the vsync interval) applies to the canvas and is not claimed: there is no measurement.
- Fewer re-centres in run rc's shape is a prediction (§5), not a claim.

**Strings.** None that the app shows. E1's console output is a harness's. The walkthrough row is operator documentation, not an app string.

## §10 Records

- **v0.1.0.** Tagged at b391e43 (2026-09-13), before the drag deferral. If its callback carried the same in-callback move (unverified), it carries this defect. Mid-drag, entry 95's runaway was consistent with H1 (C42's comment: many origin jumps in one drag). The custodian checks b391e43's handler, and the release record's words go to OPEN-5, a red line.
- **KNOWN-LIMITATIONS.** No item (OPEN-6). The defect is fixed on main by this piece. Item 17 (C59) is not touched.
- **Walkthrough.** One Part A row after A7 (C58), with the words in OPEN-4, for the human's sight before the merge.
- **v0.2.** v0.2 does not tag with this defect on main (C6). The custodian records it by making this node a dependency of v0.2's tag node in PLAN, applying the ruling (OPEN-7). The tag and its release notes are the human's.

## §11 Block on sight

1. Any edit to `pan-anchor.mjs`, its tolerance, or the bound in `offsetFrame.ts`.
2. A dependency, lockfile or deck version change (red line).
3. A trace line added, removed or reordered.
4. A `viewState` prop, or any `setProps({ initialViewState })` inside the callback.
5. A new export, option or code path with no product caller.
6. A read of deck's `info.coordinate`.
7. E1 calling a DEV-only hook, or E1 run on a dev build.
8. A tolerance or prediction changed after a run has been seen.
9. A string the app shows, added or changed.
10. A record that calls a verify-mutation run an observation, or a test-text span on the branch pinned by hash at a branch commit or named without its commit id.
11. The fix commit before the records of §7 steps S2 and S3.
12. Code in `WorkingCanvas.tsx` before OPEN-1 is settled.

## §12 Gates

**Architect and reviewer from dispatch** (C54, C56). Verdicts follow §22. A Documentation finding is must-fix before the merge.

**The reviewer, at the final head:**
- Recomputes the counts in §7.
- Runs the shell's fresh-worktree setup and `npm run verify` in `frontends/shell`, the repository's CI `node --test` scripts suite, and the cite, quote and plan checks.
- Runs every e2e suite in `frontends/shell/package.json` (C62), plus `e2e/pan-anchor.mjs`, on the dev build on port 5400.
- Runs E1 on the head measure build, and recomputes E1's verdicts from its records the way rc's reviewer did.
- Runs each heavy command in a shared hold (§13).
- Records a failure that depends on timing in a shared run as such, not as a failure (§5 I4).

**The operator Part:** X0 is read §15, the last amendment first.

## §13 Heavy runs

Builds, vitest and every e2e suite each run inside a shared hold of the machine script. The machine paragraph (C61) goes into the worker's and the reviewer's briefs as written. Nothing filed names another project.

## §14 Open items

| OPEN | Subject | Red line | Recommendation |
|---|---|---|---|
| 1 | the overlap with #307 | (B) only | (C) |
| 2 | E1's tolerance and location | no | (A) |
| 3 | the transition guard | no | (A) |
| 4 | the walkthrough row | no | (A) |
| 5 | v0.1.0's release record | yes | (A) |
| 6 | KNOWN-LIMITATIONS | no | (A) |
| 7 | the v0.2 tag dependency | no; the tag is the human's | (A) |
| 8 | pan-anchor's form | no | (A) |
| 9 | the 9.3.7 label at C26 | no | (A) |

The options and reasons are in the architect's draft report (`state/consults/2026-11-12-recentre-crossing-view-displaced-fix-form-architect-draft.md`). The custodian records each settlement here by amendment.

## §15 Amendments (opens empty; append-only)
````

**OPEN items**

- **OPEN-1. The overlap with #307 (rule (00)).** Only `WorkingCanvas.tsx` overlaps. #307 adds 12 lines in two hunks, near line 140 and near line 1606, both far from the handler at 2077–2147. The new test file, E1 and `package.json` are new paths or untouched by #307. The README suite entry is a separate path under the custodian's rule (00a).
  - (A) All code starts after #307 merges.
  - (B) All code starts now, on a branch from main. This bends rule (00), so it is a red line and needs the human's typed word.
  - (C) Steps S2 and S3's code (no builds) starts now. The base build, the run at the base and the fix commit (§7 steps S3–S4) wait for #307's merge, and the base is then main after it.
  - Recommendation: (C). It stays within the rule and keeps the run at the base on the true merge base. It is not a red line, so under the direction of 2026-10-31, item 4, it takes this recommendation, recorded with its date.
- **OPEN-2. E1's tolerance and location.**
  - (A) E1 is its own file with its own 4.0 constant, the basis of pan-anchor's §5.1 restated. Pan-anchor's file and constant are untouched.
  - (B) Extend `pan-anchor.mjs`. That is pan-anchor's path and frozen.
  - (C) A fresh basis measured on a build known to be correct.
  - Recommendation: (A). Not a red line.
- **OPEN-3. The transition guard.**
  - (A) Include it, as in §2.1. Without it, a double-click that crosses the bound would end short, a new visible regression.
  - (B) Ship the return value only, with the guard as a later piece.
  - (A′) Re-centre at a transition's start with its transition props removed. The zoom then jumps instead of animating.
  - Recommendation: (A). Not a red line, but it is part of the property change declared in §3.
- **OPEN-4. The walkthrough row.**
  - (A) It lands in this PR, as A7a.
    - Draft step, the architect's words for the human's sight: *Scroll out until the field of parcels is a small patch. Drag left by about a third of the canvas width, many times, until the canvas has long been empty; then drag right the same number of times by about the same amount.*
    - Draft expected outcome: *The parcels come back to about where they started, give or take the difference between your drags. They do not stay away, and Zoom to layer is not needed to find them.*
  - (B) A docs-lane piece before v0.2.
  - Recommendation: (A). Not a red line.
- **OPEN-5 (red line: a release record).**
  - (A) The custodian checks b391e43's handler. If the move is inside the callback there, the human decides whether `governance/RELEASE-0.1.md` gets a known-issue line, in their own typed words.
  - (B) Nothing for v0.1.0. v0.2's notes name the fix in the human's words.
  - Recommendation: (A).
- **OPEN-6. KNOWN-LIMITATIONS.**
  - (A) No item. The defect is fixed on main by this piece. In my reading, ordinary use cannot see the deferral on transitions, but this is not measured.
  - (B) An item for that deferral.
  - Recommendation: (A). Not a red line.
- **OPEN-7. The v0.2 tag hold.**
  - (A) The custodian adds this node to the depends_on of v0.2's tag node, as the application of the human's ruling (C6).
  - (B) The hold is recorded in this form only.
  - Recommendation: (A). Not a red line, because it applies a ruling; the tag itself stays the human's.
- **OPEN-8. Pan-anchor's form.**
  - (A) A line in its owed route-1 amendment (§8).
  - (B) A separate amendment after this merges.
  - Recommendation: (A). Not a red line.
- **OPEN-9. The 9.3.7 label at C26.** It sits in the DEV-only `capturePixels`, off the fix's path.
  - (A) Leave it, as a docs-lane finding.
  - (B) Correct it here. That would need 9.3.9's `onAfterRender` call re-read for this piece.
  - Recommendation: (A). Not a red line.

**Gate findings (not ruled)**

- **F1, Correctness, on main.** The sentence in C14 beginning "A later programmatic jump" states that the re-centre's jump works uncontrolled. deck 9.3.9's D3 and D5 contradict it. It is an untrue guarantee, and this piece corrects it with the words in §2.4.
- **F2, Documentation.** Two of the 9.3.7 labels are on the fix's path: the top doc comment (C14) and the settled-tick note (C20). Both are relabelled to 9.3.9 on fresh reading. The third label (C26) stays, as OPEN-9.
- **F3, Documentation.** The settled-tick note (C20) names `pan-anchor.mjs` as the only guard. After the fix there are three guards, named in §2.4.
- **F4, reading.** Entry 95's account of the mid-drag runaway (C23, and C42's comment) blames the controller's stale pan state. It is also consistent with H1. The drag deferral narrowed the defect from every tick to every settled tick past T, without removing it. Shape A keeps the deferral and claims nothing about the controller's pan state, which I have not read (orthographic state).
- **F5.** The expected outcomes of walkthrough rows A5 and A6 (C58) state properties the defect breaks at low zoom. Row A7's "Zoom to layer" resets the view and so hides the defect.
- **F6.** v0.1.0 likely carries the defect. This is unverified (§10).
- **F7.** Pan-anchor's pins at 544c8971 into the seam's span (C27) become historical when the fix inserts lines above them (§8).

**What I read, by path**

Governance and records:
- `governance/PLAN.yaml`: the four nodes.
- `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md`
- `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md`
- `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md`
- `state/consults/gates/2026-11-12-recentre-crossing-view-displaced-by-origin-move-gate-rc-reviewer.md`
- `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md`
- `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md`: §5.1 and around it.
- `governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md`
- `governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md`
- `docs/PREREGISTRATION-TEMPLATE.md`
- `governance/AUTONOMY.md`: §21a–§22 and §25.
- `docs/adr/ADR-010-render-frames-origins-boundaries.md`
- `docs/08_Testing.md`
- `KNOWN-LIMITATIONS.md`
- `frontends/shell/MANUAL-WALKTHROUGH.md`: Part A.

Shell code and tests:
- `frontends/shell/src/canvas/WorkingCanvas.tsx`
- `frontends/shell/src/canvas/offsetFrame.ts`
- `frontends/shell/src/diagnostics/renderTrace.ts`
- `frontends/shell/src/canvas/WorkingCanvas.test.ts`
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`
- `frontends/shell/e2e/pan-anchor.mjs`
- `frontends/shell/e2e/lib.mjs`
- `frontends/shell/e2e/README.md`
- `frontends/shell/package.json`
- `frontends/shell/vitest.config.ts`

deck, `frontends/shell/node_modules/@deck.gl/core/` at 9.3.9:
- `dist/lib/deck.js`, `dist/lib/deck.d.ts`
- `dist/lib/view-manager.js`, `dist/views/view.js`
- `dist/controllers/controller.js`, `dist/controllers/orthographic-controller.js`, `dist/controllers/transition-manager.js`
- `dist/utils/deep-equal.js`, `dist/index.d.ts`

**The packet's gaps**

- v0.1.0's handler at b391e43: not read (I have no shell).
- deck's orthographic state (the pan start's frame) and its `Transition` class (the order at a transition's end): not read.
- `extent.ts`, `limits.ts` and `e2e-test-surface.ts`: not read whole. The zoom limits behind OPEN-4's "scroll out" are unknown.
- Whether any piece in progress or awaiting merge touches `frontends/shell/package.json` or walkthrough Part A.
- The id of v0.2's tag node in PLAN.
- How the existing measure-build suites take the exe path. E1 follows them; I have not read them.
- The 100k fixture's path from a worktree: pan-anchor's constant is absolute, into the main checkout.
- The rc reviewer report's line numbers. It is cited whole, by the filed sha256.
- Whether the deck keyboard path needs canvas focus. Case 2 uses a double-click, not the keyboard.

Model: claude-opus-5-5 (Opus 5.5).
