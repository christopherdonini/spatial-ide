*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 5 of 8, branch cut/shell-migration-milestone-2-phase-b at f60329ef90a70a8c20014540695f724b25a8a6d2, the run 2026-10-12T06:51:14Z to 2026-10-12T07:35:16Z by its transcript (Read 25, Bash 85, Edit 9, Write 7); its one SubagentHandback call, at 07:35:15Z. It arrived as a message and is extracted here by script, with no rooted path:line cite and no profile path in it; one final newline is added and nothing else is changed. Its sha256, from this file's line 5 to the end, is 38ef87ab901d7dbb16e963469c46c64eab2c3dc4d52698ec4d499fbc14edeef2.*

---

REPORT: shell-migration-milestone-2, phase B, stage 5 of 8, the App wiring (worker; model observed: Sonnet 5.5, no override, no context handoff). Stopped after stage 5 as briefed.

## Head and commits
Worktree C:/dev/wt/mm2b, branch cut/shell-migration-milestone-2-phase-b. Start: head e4940dbe, empty porcelain after `git fetch origin`. Pushed with a plain push; head f60329ef90a70a8c20014540695f724b25a8a6d2 = origin. No merge, rebase or force. Not touched: state/, PLAN.yaml, the form, WorkingCanvas.wiring.test.tsx, StudioLayout.test.tsx, the base stand-ins, other e2e files. Every commit is `-s` with the Co-Authored-By trailer.
- f81a1310 (X1) the wiring and the first tests.
- 86329b49 and f51b96a9 (X3) test-only: a missing element fails with its selector named, and order, mount and fit assertions compare readable strings. **Every mutation was observed at f51b96a9cafbaf57b5f562edb8a0d64b51d9a604.**
- 968ff05c the observed mutations recorded (comments only; I checked that no non-comment line changed). **Its body says "21 observations for 21 tests"; the true figures are 21 observations for 18 tests (RB4, RB17 and RB-DRAWN have two each). It is pushed and I did not amend it.**
- caa69a83 e2e selection.mjs (written, not run).
- f60329ef three type exports with no importer made local.

## Changes by file (src = frontends/shell/src)
- App.tsx (+143/-4 in stage 5):
  - Passes WorkingCanvas tool, onClickPick, highlight, onSelectionDrawnChange and onViewShown. Passes StudioLayout onSelectTool.
  - Fills topBar.tools (ToolSwitch), inspector.feature (FeaturePanel) and status.selectionEnded.
  - Handlers: tool, mode, click, pin, clear, zoomTo. The class-C rows are recorded in them.
  - The `[admitted]` effect's setup dispatches `consumer.acquired`.
  - A new open resets the view box and the last click.
  - `highlight` and the selected Set are memoised on the reducer's Map, so the Set's identity is stable while the selection is unchanged.
  - The drawn set is stored tagged with the resource whose canvas reported it, and read as empty for any other resource. This is "cleared on a rebind".
  - The view box is one store written by one guarded writer, `showBox`. onViewportChanged and onViewportWithinLastQuery call it after their existing statements. onViewShown IS `showBox` and writes the box and nothing else (no lastViewportBboxRef, no hasSettledView, no query).
  - `fitToBbox` is called as `canvasRef.current?.fitToBbox?.(union)`.
  - `countSelection`'s facts: filterApplied = activeFilter !== null; viewComplete = scanState.kind === "complete" (the only completeness fact App holds). `countSelection` still reads neither (Amendment 2 item 9). If the architect reads "invents nothing" as "pass a constant", it is a one-token change.
- feature/clickEffect.ts (new, 72), pure `clickEffect(view, click, sessionEnded)` returning the last-click line, the transitions and the row. It covers:
  - the session-ended latch;
  - below resolution: nothing changes;
  - a click on nothing (B1): Navigate clears an unpinned inspection, Select does nothing;
  - Select by mode: never inspects;
  - Navigate: inspects, or keeps the pinned one and names the clicked one (A5).
  - A row is recorded only when something applied.
- feature/FeaturePanel.tsx (new, 100). `createViewBoxStore` is a ref with a listener set. `FeaturePanel` subscribes through `useSyncExternalStore`, with the snapshot cached on its inputs, so it re-renders only when a count or the inspected status changes. It computes the split and the drawn status from a current box only.
- workspace/selection.ts +17: `unionOfBounds`.
- feature/FeatureTab.tsx +2/-1: `noticeText` exported.
- layout/contributions.ts +6/-1: status item `selectionEnded`.
- styles.css +2/-1: `.selection-ended` shares the `.scan-incomplete` rule.
- App.selection.test.tsx (new, 665), e2e/selection.mjs (+501/-8).

## Caller rule (grep run; every new export or prop has its product caller in this stage)
- unionOfBounds: App.tsx:1781.
- clickEffect and ClickInput: App.tsx:18-19, 1762.
- createViewBoxStore and FeaturePanel: App.tsx:838 and 2141.
- noticeText: App.tsx:2159.
- consumer.acquired: App.tsx:1371. That is Amendment 7 item 4's second caller; item 2(b)'s export consumer is stage 7.
- onSelectTool: App.tsx:1800 and 2138.
- fitToBbox: App.tsx:1783.
- onClickPick, onSelectionDrawnChange, onViewShown, tool, highlight: all passed in App's canvas JSX.
- ToolSwitch and FeatureTab: mounted. All six class-C rows have call sites:
  - tool.set: App.tsx:1751
  - selection.change, feature.inspect: clickEffect.ts
  - selection.clear: App.tsx:1776
  - selection.zoomTo: App.tsx:1784
  - feature.pin: App.tsx:1770
- status.selectionEnded: App.tsx:2157.
- No caller yet, named in the form for a later stage:
  - scope.ts `resolveScope`, `checkScope`, `ResolvedScope` and `ScopeUses`: stage 6, the export's staging (§2.5).
  - `SelectionEndTransition` is applied only through the reducer's `endViewGeneration`.
- The three type exports with no importer (ViewBoxStore, FeaturePanelProps, ClickEffect) were made local.

## Tests: 18 `it`s, 21 observed mutations, all at f51b96a9, each applied, run, read, reverted
Tests are in App.selection.test.tsx; the failures are recorded in each test's comment. RB-SET, RB-S1 and RB-DRAWN are rows beyond §4's table. RB4's real route: the listener App registers with `listenDatasetSessionEnded`, then routeDatasetSessionEndedEvent, the owner dispatch and the manager stand-in's `notifySessionEnded`, which latches into `onSessionEnded` as the real manager does.

| Test | Mutation | Observed failure |
|---|---|---|
| RB1 | invert the Select branch condition (clickEffect) | expected [] to deeply equal [ 1n ] |
| RB2 | mode ignored (always toggle) | Replace: expected [ 1n, 2n ] to deeply equal [ 2n ] |
| RB3 | selection.clear in commitActiveFilter | the count is unchanged: expected 'Selected, ignoring filter: 0' to be '...: 2' |
| RB4 (a) | notice null | expected '(no element matches .feature-notice)' to contain '2 selected features were dropped' |
| RB4 (b) | latch dropped | expected '(no element matches .feature-last-cli…' to contain 'The source file changed...' |
| RB5 | below resolution returns a selection.apply of 99n | expected Set{ 1n, 99n } to be Set{ 1n } |
| RB6 | unionOfBounds returns the first member | fits '{...xmax":10...' not '{...xmax":30...' |
| RB9 | switch rendered in the map region | outside the map region: expected true to be false |
| RB10 | canvas key + tool | mounted 'ds_...01 d…' not 'ds_...01' |
| RB-SET | no memo on the Set | expected Set{ 1n } to be Set{ 1n } (Object.is) |
| RB11 | pin ignored | A stays inspected: expected 'id 2' to be 'id 1' |
| RB13 | clear on nothing in Replace | Replace: the selection is unchanged: expected [] to deeply equal [ 1n ] |
| RB14 | click the Feature tab on inspect | the Layer tab stays active: expected 'false' to be 'true' |
| RB15 | Select also returns inspect.set | A is still inspected: expected 'id 2' to be 'id 1' |
| RB16 | picker in both tools | expected <div…> to be null |
| RB17 (i) | within-report does not feed the box | the within-report shrank the box: ...'Outside the view: 0' to contain ': 1' |
| RB17 (ii) | null box read as containing every member | no box, no split: expected <p class="feature-outside-view"> to be null |
| RB18 | onViewShown routed into onViewportChanged's body | no query: expected 1 to be +0 |
| RB-S1 | close effect moved after the `[admitted]` effect | order differs (request:new before close:old) |
| RB-DRAWN (a) | drawn set not tagged by resource | ...'In the view, not dra…' to contain ': 1' |
| RB-DRAWN (b) | no `viewBox.set(null)` on a new open | the new canvas has reported no box yet: expected <p class="feature-outside-view"> to be null |

RB-S1 expects the order open, stop, close, request. RB12 is stage 7's. RB7 and RB8 are stage 6's.

## e2e steps written (selection.mjs, ASCII, not run; the mutation of each is named in the file header for the custodian)
- E-SCENE is setup, not in §4's table: open filter-zoned, zoom-in notches to the least-zoomed camera where a hover answers, take oracle ids through `hoverIdAfterBarrier` only (§8 item 32).
- E-CLICK: mutation resolves `gpuOrdinal + 1`.
- E-CLICK-FAST: mutation takes the pick from the hover readout, at an odd map height. Race-dependent.
- E-SELECT: mutation sets the highlight alpha to 0. The highlight is read as the rise in alpha-255 pixels (`opaqueCount`); the data fill is alpha 180.
- E-NODRAG: mutation 1 selects on `onDragEnd`; mutation 2 sets `dragPan: false`. The drag goes out and back over the pressed feature; a second drag moves the box, read as the selected feature becoming "Outside the view".
- E-ZOOMSEL: mutation fits a corner point box.
- E-SEL-PAN: mutation clears on view change.
- E-SEL-FILTER: mutation clears on Apply. It selects 4 to 6 features at once, so the filter hides at least one with near certainty.
- E-REFUSED: mutation selects on refusal.
- E-GEN: mutations keep members across a rebind, and across a source change. Reopen via the 100k fixture. The source change uses a scratch copy of the filter fixture under e2e/out, touched by mtime while idle (source-watch-idle's method), so it takes the real dataset_session_ended route.
- E-KINDS: mutation uses the part ordinal as the row. Multipolygon: at most three distinct ids over the hovered pixels, and two pixels of one id give Selected 1. Point and line: one id per click, and a repeated Add only click adds nothing.
- EXPORT-TODAY is unchanged and runs last. A harness failure in the new steps no longer stops it.

## H3, governance, §7
- H3: no base suite edited in stage 5. The base-suite edits in the branch are the accepted ones: UA4's `it` and Amendment 2 item 5's R4 arrays and U5 test.
- `npm run verify` at f60329ef: rc 0. 93 files, 1321 tests; residency-trace 76 passed; citation-integrity 30 passed. Held under THE MACHINE (shared holds granted, no exit 96-99).
- verify-cites, verify-quotes (121 checked, 90 verified, 30 baselined), verify-test-claims (545) and verify.mjs: all pass at f60329ef. `node --test` over scripts/plan, hooks and evidence: 457 pass, 0 fail (run at caa69a83, scripts only; no governed file changed since).
- §7 by its own command from B (c96e5329), three-dot, at f60329ef: cumulative 4,724 ins + 99 del = **4,823** (stage 4 head 3,307; stage 5 alone 1,528).
  - **App.tsx: 147 (143 + 4)** against B-A 420 (465 with Amendment 7's +45). Under.
  - selection.mjs 509. App.selection.test.tsx 665 (that file's allowance across phase B is 700 + 220 + 150 + 220).
  - FeaturePanel.tsx 100 and clickEffect.ts 72 are new files under feature/ (§2.7 allows them) in no §7 row. B-L is about 558 of 700.
  - **Watch:** selection.mjs's phase B allowance is about 660 (650 minus phase A's 100, plus 40 and 70). 509 is already used, with E-EXPORT, E-SCOPE and E-ASK still to write. An overrun there is likely and would be class 8.
  - Per file, as before: HoverReadoutView 17 against 12; viewTransitions plus workspaceState 187 against 180.

## The exact e2e list for the custodian at f60329ef
- `npm run e2e:selection`: E-SCENE, the ten steps, then EXPORT-TODAY. Observe each step's mutation from the header and record it with the commit.
- Recommended with it, because the canvas now receives App's new props and a real tap path exists for the first time: `npm run e2e:regression` and `npm run e2e:layout` (the top bar now holds the tool switch and the Inspector a third tab, so layout.mjs's own edit, G-E ≤ 20, is stage 8's and may be needed).
- The rest of the 14-suite list, at the custodian's discretion: console, filter, filter-panel, style, publish, admission, refusal-contract-baseline, residency-harness; and node e2e/source-changed.mjs, source-watch-idle.mjs and pan-anchor.mjs.

## Not done as written, and notes
1. **status.selectionEnded and `Slots`.** Adding the slot as a required key breaks tsc in the pending StudioLayout.test.tsx (its NO_SLOTS lacks it) and I may not edit that file. So `Slots` has one optional key (`Record<Exclude<SlotId, "status.selectionEnded">, ReactNode> & Partial<...>`) and every other slot stays required. If the human drops or keeps that test file, the clean form is a required key plus one line in NO_SLOTS.
2. **The `[admitted]` re-acquire has no discriminating App-level test.** Deleting the line fails no App test (checked: `vitest run src/App`, 122 pass). A cleanup without a rebind cannot occur through the real App in jsdom: StrictMode double-runs effects only on mount, when admitted is null, and `admitted`'s identity never changes without a rebind. The reducer side is proven (UB14); the line is reached on every admission and is idempotent. The architect should rule whether that is enough or whether stage 7's export consumer is the proof.
3. The mode picker records no console row: §2.6 lists six rows and none is a mode change. Flagged for the architect or the human.
4. Zoom to selection does not call `resolveScope` or `checkScope`: it is staged and run in one synchronous handler, so there is nothing between staging and running to check. Their callers are stage 6's.
5. The e2e steps are unrun, so they are the likeliest place for first-run fixes. Known risks:
   - the pixel search needs a hoverable interior pixel;
   - the E-KINDS point and line samples depend on `samplePoint` landing within the pick radius;
   - the first real tap via CDP, and double-click, remain as stage 3 noted.
6. Pending with the human, left alone: WorkingCanvas.wiring.test.tsx, StudioLayout.test.tsx, the double-click. The Navigate click does not change the Inspector tab (RB14).
7. No cross-module interface was imagined: ClickPick, WorkingCanvas's props and fitToBbox, the readers, countSelection, lib.mjs's helpers and the DOM classes were read at the tree first (cited in the commit bodies).
8. Four-class self-check:
   - interfaces: as read, above;
   - completion claims: each points to a named test or command;
   - messages: every new operator string is an existing stage 4 string or a "[P6 placeholder]" one; the status item reuses `noticeText`;
   - tests reach their assertions: each mutation fails on the intended line (RB1's lands on the first selection assertion, because the inverted branch also breaks the preceding Select click).

## Final state
`git status --porcelain` in C:/dev/wt/mm2b: empty. HEAD f60329ef = origin/cut/shell-migration-milestone-2-phase-b. Run artefacts (outside the repo) are in the scratchpad's mm2b5 folder: the mutation harness, specs, logs and the verify logs.
