*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 3 of 8, branch cut/shell-migration-milestone-2-phase-b at 1de68a6120453b000c9eedaa9379113220c6d12b. The run 2026-10-12T06:00:50Z to 2026-10-12T06:21:41Z by its transcript (Read 10, Bash 71, Edit 21, Write 9); its one SubagentHandback call, at 06:21:41Z. It arrived as a message and is extracted here by script, with no rooted path:line cite and no profile path in it; one final newline is added and nothing else is changed. Its sha256, from this file's line 5 to the end, is d7504dc261b9f84fb24dbdee8e5e9c43e368f53bcbb74f5bd7987a1d8a3937e2.*

---

STAGE 3 OF 8, PHASE B (WorkingCanvas wiring): DONE. All checks green. One file lies outside section 2.7's list and needs your ruling (item 1 under "Not done as written").

HEAD
- Worktree C:/dev/wt/mm2b, branch cut/shell-migration-milestone-2-phase-b. Pushed with a plain push; head 1de68a6120453b000c9eedaa9379113220c6d12b.
- Start state: head 147643c5 as briefed, empty porcelain, fetch done.
- Commits above 147643c5:
  - 6069214e: the wiring, plus tests in clickPick.test.ts and highlightLayers.test.ts.
  - d708d479: new file src/canvas/WorkingCanvas.wiring.test.tsx.
  - 6488360f: test-only fix to that file.
  - 110f9d2d: records the mutations of the two stage 2 test files (comments only).
  - 1de68a61: records the mutations of the wiring test (comments only).
- Every mutation was applied at 6488360ffa1f58bf392e731f605e5a7255d24260. No verify-mutation run was used.
- Every commit uses -s and the Co-Authored-By trailer.

CHANGES BY FILE
- src/canvas/WorkingCanvas.tsx: +98/-14.
  - Five new optional props:
    - tool (default "navigate", typed CanvasTool from pickResolution);
    - onClickPick;
    - highlight (default an empty highlight);
    - onSelectionDrawnChange;
    - onViewShown.
  - Each prop is mirrored in a ref.
  - Handle method fitToBbox(bbox) calls fitToExtent(bbox, true), so it notifies as fitToBounds does (Amendment 2 item 3).
  - The settle re-pick's inline pick body is now the named pickCandidateAt, moved unchanged; the hover scheduler and the tap both use it.
  - The Deck gets onClick: (_info, event) => onTap(event). Deck's picking info is never read.
  - getCursor passes the tool ref to cursorForPointerState.
  - render() now sets layers to the data layers followed by buildHighlightLayers' layers, and emits the drawn set after the watchdog span.
  - A new effect keyed on highlight.selected and highlight.inspected schedules the coalesced render, as the style effect does.
  - onViewShown is called in exactly two places:
    - (1) fitToExtent's unreported branch, which is the auto-fit's camera write, with bboxForFit's box. lastQueriedRef is nulled as before.
    - (2) onResize, when viewportAfterResize answered none, a camera exists, lastQueriedRef is null and the size is usable. The box comes from computeAuthoritativeViewportBbox.
  - Neither place goes through reportViewport, so neither issues a query nor writes lastQueriedRef.
- src/canvas/clickPick.ts: +16. Tap type and createTapHandler(deps, emit).
  - It resolves at the tap's offsetCenter through resolveClickPick.
  - A tap with no pixel emits nothing.
- src/canvas/highlightLayers.ts: +21. sameIds and createDrawnEmitter(emit).
  - The first set is compared with the empty set, so an empty first pass emits nothing.
  - A clear to empty after a non-empty set does emit.
- clickPick.test.ts +28/-1 and highlightLayers.test.ts +39: 4 tests. The -1 is an import line.
- src/canvas/WorkingCanvas.wiring.test.tsx: new, 345 lines, 13 tests. See item 1 under "Not done as written".

THE CALLER RULE
- Product callers in canvas now exist for stage 2's producers: createTapHandler, buildHighlightLayers and createDrawnEmitter (WorkingCanvas.tsx lines 1052, 1328, 1998).
- None of the five props or fitToBbox has an App.tsx caller at this head; a grep outside canvas/ and tests finds none.
- I rely on the second exemption. The form names App as the consumer of each:
  - onClickPick: section 2.2, "App latches it". Gated by RB1, RB2, RB5, RB13.
  - highlight and onSelectionDrawnChange: sections 2.2 and 2.3. Gated by UB3, RB3, E-SELECT, E-SEL-FILTER.
  - tool: Amendment 2 item 6, "App is the product caller". Gated by RB9 and E-NODRAG.
  - fitToBbox: section 2.5, selection.zoomTo. Gated by RB6 and E-ZOOMSEL.
  - onViewShown: Amendments 2 item 2(a) and 3. Gated by RB3, RB17, RB18, E-SEL-FILTER and W4.
- Those callers are App.tsx's phase B wiring, which is stage 4 (or 5 if you split it); the form does not number stages.
- Why the props are optional: App.tsx and the base suites' stand-ins (typed, including WorkingCanvasHandle) cannot be edited in this stage.
- Why fitToBbox is optional in the handle type: the stand-ins in App.test.ts, App.layout.test.tsx, App.lateResult.test.tsx and candidateArmSession.test.ts would otherwise fail tsc, and H3 forbids editing them. The component always provides it.
- App must call it as canvasRef.current?.fitToBbox?.(...). Stage 4 may make the props required once App passes them.

TESTS, ONE MUTATION EACH
All are applied, run, read and reverted at 6488360f, and recorded in the test comments.

clickPick.test.ts, "UB7 (tap)":

| Test | Mutation | Observed failure |
|---|---|---|
| tap at (5, 6) looks up at (5, 6) | swap pixel | expected [[6,5]] to deeply equal [[5,6]] |
| tap with no pixel runs no pick, emits nothing | invent {0,0} | expected [[0,0]] to deeply equal [] |

highlightLayers.test.ts, "UB9 (drawn set)":

| Test | Mutation | Observed failure |
|---|---|---|
| empty first pass and equal ids emit nothing | delete the equality return | the empty first pass: expected [Set{}] length 0, got 1 |
| same size, other ids is a change | compare sizes only | expected [[1n,2n]] to equal [[1n,2n],[3n,4n]] |

WorkingCanvas.wiring.test.tsx. The first four are RB18's canvas side, and are the mutations Amendment 3 item 3 names.

| Test | Mutation | Observed failure |
|---|---|---|
| auto-fit calls onViewShown once, no query | route into reportViewport | onViewShown expected 1 call, got 0 |
| size change with no area asked is shown, asks nothing | route into reportViewport | expected 2 calls, got 1 |
| once an area is asked, a resize reports as before and shows nothing; Reset un-asks | also call onViewShown in the within branch | expected 1 call, got 2 |
| size change before any camera write shows nothing | drop the camera guard | expected no call, got 1 |
| fitToBbox notifies | notify false | expected 1 call, got 0 |
| getCursor follows the tool | ignore the tool | expected crosshair to be default |
| no tool means Navigate | default tool select | expected default to be crosshair |
| tap picks at its own pixel whatever deck's info says | return early when info.index < 0 | expected undefined to match {x:12,y:34} |
| tap on nothing emits kind nothing; tap without pixel emits no result | never call onTap | expected [] to equal [[{kind:'nothing'}]] |
| line open's tap carries the radius | drop the radius in pickCandidateAt | TypeError: actual value must be number or bigint, received "undefined" |
| highlight layers come after the data layers | reverse the order | expected 'highlight:selected:sh_a:0' to be 'sh_a:0' |
| highlight change schedules a render, a clear removes layers | empty effect body | expected 3 to be greater than 3 |
| onSelectionDrawnChange once on change, empty on clear | emit every pass | nothing highlighted: expected no call, got 2 |

Two things found while applying mutations:
- Dropping the lastQueriedRef null condition in the new resize branch is an equivalent mutation. viewportAfterResize answers none with a camera and usable size only when nothing was asked. The condition is a guard, and the test comment says so.
- The render the mount schedules had masked the highlight-effect mutation. I fixed the test in 6488360f and re-observed it.

RB18'S CANVAS SIDE
- It can be reached, but only by mounting the real WorkingCanvas with a stand-in for deck's Deck class. It is covered by the first four wiring tests above.
- Section 7 names no test file where it could live.
- The App side of RB18 still belongs to stage 4/5, with the stand-in canvas.

H3
- npm run verify passes (run under a shared hold): tsc, the four checks, the build, the dist checks, vitest, the residency-trace test and the citation test. Vitest: 89 files, 1275 tests passed.
- No base suite was edited apart from the accepted UA4 line. By numstat from B, the only base test file with deletions is viewTransitions.test.ts (4, the UA4 line). pickResolution.test.ts (+29) and workspaceState.test.ts (+67) are additions only.
- App.tsx, the base stand-ins and every base e2e file are untouched.

GOVERNANCE (all rc 0, run in the worktree)
- verify-cites: PASS, 38 loose references advised, none mine.
- verify-quotes: PASS, 121 checked. Run with --show-cites on my changed files, it checks 0 (I quote no governing text).
- verify-test-claims: PASS, 545 claimed tests.
- plan verify.mjs: PASS.
- node --test scripts/plan, scripts/hooks and scripts/evidence: 457 pass, 0 fail, run under a shared hold.

SECTION 7 COUNT
- Command: git diff --numstat c96e5329...HEAD, with the form's three pathspec excludes. Merge base with origin/main is c96e5329.
- Cumulative at this head: 2,101 insertions + 57 deletions = 2,158. Stage 3 alone is 562.
- Per file (insertions + deletions):

| File | Lines | Ceiling | Note |
|---|---|---|---|
| WorkingCanvas.tsx | 112 | 200 | |
| clickPick.ts | 64 | 120 | |
| highlightLayers.ts | 201 | 220 | |
| pickResolution.ts | 19 | 20 | |
| HoverReadoutView.tsx | 17 | 12 | over: stage 2's, class 8, flagged |
| clickPick.test.ts | 150 | | |
| highlightLayers.test.ts | 215 | | |
| pickResolution.test.ts | 29 | | |
| WorkingCanvas.wiring.test.tsx | 345 | | in no section 7 group |
| selection.ts | 140 | 300 | |
| scope.ts | 85 | 140 | |
| selectionConstants.ts | 21 | 30 | |
| workspaceState.ts | 78 | | with viewTransitions.ts: 187 against 160, or 180 with Amendment 7's +20 |
| viewTransitions.ts | 109 | | see above; stage 1's, flagged |
| selection.test.ts | 285 | | |
| scope.test.ts | 139 | | |
| workspaceState.test.ts | 67 | | |
| viewTransitions.test.ts | 82 | | |

- The six UB test files listed so far (excluding the wiring test and viewTransitions.test.ts) sum to 885 against 1,050. actionRegistry.test.ts is not yet written.

E2E LIST FOR THE CUSTODIAN (I ran none; port 5180 is reserved)
- No e2e step is required at this head. App passes none of the new props, so nothing a user sees has changed. Cursor, render and fit are the same with the defaults.
- Recommended: one e2e:regression run at this head. It is the only suite that exercises the changed shared paths: CURSOR′ (getCursor), render(), fitToExtent and the resize handling.
- The tap path has never run on real deck. The H2 read says no existing suite presses and releases without moving. Real-deck proof is first possible at stage 4/5 (E-CLICK, E-NODRAG, E-SELECT, E-SEL-FILTER, E-ZOOMSEL).
- Cheap additions to look for in stage 4/5 e2e:
  - After a tool key press with the mouse still, canvas.style.cursor changes. The wiring relies on deck.js reading Deck._onRenderFrame calling _updateCursor each frame (9.3.9, read from node_modules, not run).
  - A real CDP click reaches Deck's onClick (H1/H7).
  - A double click.

NOTES
- No cursor re-set effect was added, because deck's own code re-runs getCursor each frame. This is a code read, not a run.
- Deck maps both click and dblclick to onClick, and I did not filter by type. A double-click (also deck's zoom gesture) reaches onClickPick once and would toggle or inspect once. This is not in the form, so it is a walkthrough or ruling question.
- An absent onClickPick still runs the tap's GPU pick (nobody hears it). This disappears once App passes the prop.
- Stage 4 notes:
  - highlightLayers.ts caches by the identity of the selected Set. App should keep a stable Set identity for an unchanged selection, or each render misses the cache.
  - The canvas effect is keyed on selected and inspected, so a fresh wrapper object alone does not re-render.
  - The drawn set is per canvas instance (the canvas is keyed on the handle). App's reducer should treat it as cleared on a rebind.
- Pre-gate self-check, four classes:
  - Interface: written against deck 9.3.9's actual onClick(info, event) with offsetCenter, getCursor, onResize, setProps and pickObject, read from dist/lib/deck.js.
  - Evidence: every completion claim above points to a named test, a command, or a code read labelled as one.
  - Messages: no user-facing string was added.
  - Assertions: each test reaches its assertion, shown by its observed mutation failure.
- Model: Sonnet 5.5, no override, no context handoff.

NOT DONE AS WRITTEN
1. WorkingCanvas.wiring.test.tsx is not in section 7 and is not in section 2.7's list. Section 8 item 1 would flag it, and its 345 lines belong to no section 7 group.
   - The alternatives were to leave RB18's canvas side unproven until e2e, or to edit WorkingCanvas.test.ts, which is also outside the list.
   - The file is its own commit (d708d479) with its fix (6488360f) and its mutation record (1de68a61), so it can be dropped cleanly: drop those three commits and nothing else depends on it.
   - If you keep it, rule it class 9 or a class 2 addition. Its lines count as an overrun, class 8.
2. I did not edit App.tsx, the base suites, state/, PLAN.yaml or the form.
3. I made no change to the base stand-ins. fitToBbox is optional in the handle type because of that (see "The caller rule").

FINAL PORCELAIN: empty (0 lines). Local head equals origin/cut/shell-migration-milestone-2-phase-b at 1de68a61.
