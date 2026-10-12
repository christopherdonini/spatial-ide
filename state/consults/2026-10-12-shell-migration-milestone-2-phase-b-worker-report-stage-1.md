*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 1 of 8, branch cut/shell-migration-milestone-2-phase-b at 0da5277b310b83ae0d500b6abbf68d3b0ce0352a. The agent's run held stages 1 and 2 (2026-10-12T05:16:51Z to 2026-10-12T06:00:23Z by its transcript; Read 13, Bash 91, Write 17, Edit 9); this is SubagentHandback call 1 of 2, handed back at 05:46:11Z. It arrived as a message and is extracted here by script, with no rooted path:line cite and no profile path in it; one final newline is added and nothing else is changed. Its sha256, from this file's line 5 to the end, is 17a4f4446c02dea2bb836b54bc46be5b19ba7b2d2c5b2561aa4b8199f1d2555f.*

---

REPORT: shell-migration-milestone-2, phase B, stage 1 of 8 (worker-high; model observed: Sonnet 5.5, no override, no context handoff). Stopped after stage 1 as briefed.

## Head and commits
Branch cut/shell-migration-milestone-2-phase-b in C:/dev/wt/mm2b, pushed with a plain push. Head 0da5277b310b83ae0d500b6abbf68d3b0ce0352a = origin. B = c96e5329351fcc9ee40b1df71d379ddd953f15c8 was HEAD at the start; porcelain was empty after git fetch origin. No merge, rebase or force.
- feaa43d329e6d900b6ae672547569f1b591e3052 (X): feat, the workspace layer. Every mutation was observed at this commit.
- 0da5277b310b83ae0d500b6abbf68d3b0ce0352a: feat, the observed mutation of each test recorded (comments only; I checked that no non-comment line changed).
Not touched: state/, PLAN.yaml, the form, e2e. No Rust was built.

## Pin recheck (by script, form read on main at ab1aa7fd, recomputed at B)
My script covers all 125 `path:a-b @ rev sha256` pins, including Amendment 7's 20. 100 are identical at B, 12 moved (hash-identical at the new lines), 13 changed, 0 missing, and 0 are invalid at their own rev.
- Moved: WorkingCanvas.tsx 1907-1918 to 1935-1946, 1186-1195 to 1210-1219, 1989-2021 to 2030-2062, 106-130 to 107-131, 1242-1269 to 1266-1293. App.tsx 1969-1978 to 2034-2043. PublishPanel.tsx 427-429 to 430-432 and 461 to 464. AdmissionPanel.tsx 205-211 to 209-215 and 258-260 to 262-264 (the CRS piece's merge; B3's two pins, a class 3 row per Amendment 2 item 8). SKP-V0.md 175 to 182 and 177-179 to 184-186 (piece e).
- Changed, all named: WorkingCanvas.tsx 499-539, WorkingCanvas.tsx 1302-1329 and App.layout.test.tsx 110-150 are the pins Amendment 2 items 2 to 4 superseded. Ten App.tsx pins are the spans phase A rewrote, named by §2.1(b) and Amendments 4 and 5:
  - 163-205, 770-771, 805, 816-817, 1782-1796 and 1447 and 1640 @ dba12b8c;
  - 1447 and 1640 @ b4dc05e0;
  - 1829-1849 @ 6de584fa. I checked this one by hash: lines 1886-1906 at B, de-indented four spaces, hash to d4e2ee97...12f09, the pin's own. So it is only phase A's re-indent.
- Since phase A's head, only the CRS piece's files and regression.mjs changed under frontends/shell (diff c08cb809 to B). regression.mjs added DOM clicks on the CRS form and no canvas press, so H2 stands.
- No invalidator.

## Base suites at B, unedited
- `npm run verify` rc 0: 84 files and 1217 tests, residency-trace 76 passed, citation-integrity 30 passed. The first run overlapped my first new files, so I stashed them and re-ran on a clean tree. The clean run is the one that counts.
- verify-cites rc 0 (1797 files, 37 loose advisories). verify-quotes rc 0 (121 checked, 90 verified, 30 baselined). verify-test-claims rc 0 (545 claimed). verify.mjs rc 0.
- node --test scripts/plan, hooks and evidence: rc 0, 457 pass, 0 fail.
- No failing suite at B, so no I14.
- Environment: the worktree had no node_modules. A junction to main's tree makes `npm run build` fail in the metafile plugin, which refuses node_modules outside the package root. So I ran `npm ci` in frontends/shell and in renderer/bundle-viewer. Both are gitignored.

## Stage plan (stage 1 done)
1. **Done: the workspace layer.** viewTransitions.ts, workspaceState.ts, selection.ts, scope.ts, selectionConstants.ts, and UB1 to UB6, UB12, UB14, UA3's resolveScope clause, UA4's union. No e2e.
2. **Canvas pure modules.**
   - canvas/clickPick.ts: UB7, UB8.
   - canvas/highlightLayers.ts with B2's constants: UB9, UB9-b.
   - pickResolution.ts, the cursor per tool: UB11 and its second mutation.
   - HoverReadoutView exports (`idLine`, the two refusal constants): Amendment 2 item 7.
   - No e2e.
3. **WorkingCanvas wiring.**
   - Deck onClick, onClickPick and the shared pickCandidateAt.
   - The highlight prop and onSelectionDrawnChange.
   - The tool prop, with the cursor and the re-set effect if deck needs it.
   - fitToBbox.
   - onViewShown (OPEN-11), called in exactly two places.
   - Caution: Amendment 2 item 7 says the HoverReadoutView constants must be byte-compared with the base spans.
4. **Layout surfaces.**
   - contributions (the Feature tab, the topBar.tools slot), actionRegistry (tool.*, selection.zoomTo, selection.clear, matchToolKey), StudioLayout.
   - ToolSwitch.tsx and FeatureTab.tsx as views, plus styles and surfaceRegistry rows.
   - The two Amendment 2 item 5 edits: App.layout.test R4's tab arrays and the U5 exact-id test.
   - UB10.
5. **App wiring.**
   - Click handling by tool and mode, inspection and pin (the A5 and B1 rules), the counts' box ref fed by onViewportChanged and onViewportWithinLastQuery plus onViewShown, highlight and drawn set, zoomTo.
   - The notice, status.selectionEnded, the console rows, and the `[admitted]` re-acquire.
   - The S1 order pin (stop, close, start) and S4: RB4 and E-GEN start from the real dataset_session_ended route.
   - Tests RB1 to RB6, RB9 to RB11, RB13 to RB18.
6. **Scope and export.**
   - PublishPanel stageScope, checkStagedScope and the export statement.
   - RB7, RB8, and the staged-scope wrapper that stage 7 reuses.
7. **B3 under Amendment 7.**
   - AdmissionPanel confirmOpen: UB13.
   - PublishPanel's onExportRunning `{cancel, ended}` through the execute wrapper.
   - OpenDuringExportAsk.tsx with the two late-cancel strings, marked pending sight (item 2e).
   - App mints the export-n consumers, acquires and releases them (not on unmount), and decides the statement from the run's own outcome.
   - RB12a to RB12d. The render site in App waits for OPEN-12, with tests only up to their render queries.
8. **e2e and documents.** selection.mjs steps (E-CLICK through E-ASK's third step), layout.mjs's third tab, the Part W rows including W8a, the KNOWN-LIMITATIONS items, and e2e/README. I would write each stage's e2e steps in that stage and run them in the custodian's sessions after stages 5, 7 and 8.

## Changes by file (frontends/shell/src/workspace)
- selectionConstants.ts (new, 21): SELECTION_MAX_FEATURES = 10,000, DEFAULT_TOOL, DEFAULT_SELECTION_MODE (toggle).
- selection.ts (new, 140):
  - the modes, with the ceiling refusing by name (`selection.ceiling`) and the set returned as given;
  - `bboxesMeet` (closed), the notice types, and `countSelection`;
  - `countSelection(members, viewBox | null, drawn, facts)` returns the split as null without a box and a reason that is always null (Amendment 2 item 9).
- scope.ts (new, 85):
  - `ResolvedScope` (view, resource, generation `{session, ended}`, filterAsApplied, selection or "none");
  - `ScopeUses {selection}`;
  - `resolveScope`, which addresses the view by id and never by drawOrder;
  - `checkScope`, which names the five changes and compares the filter by value.
- viewTransitions.ts (+99/-10): the closed union of exactly §2.4's nine names, applyViewTransition, readers with the defaults, and `endViewGeneration`. A transition that changes nothing returns the same view.
- workspaceState.ts (+68/-10):
  - ViewState gains tool, selectionMode, selection, selectionNotice, inspected and pinned;
  - `ConsumerId = ViewId | export-<n>`; `consumer.acquired`, idempotent (Amendment 7 item 4, 2(b));
  - the reducer ends a view's selection and inspection on a rebind (reason reopened) and once on `resource.generationEnded` (reason source-changed).
- Tests: selection.test.ts (new, 285), scope.test.ts (new, 139), viewTransitions.test.ts (+78/-4), workspaceState.test.ts (+67).

## Decisions for the custodian or architect (please read)
1. **ViewState's phase B members are optional,** read through viewTool, viewSelectionMode and the like, which give the defaults.
   - §2.2 says ViewState gains them. As required members they would fail typecheck in UA1 (its exact-shape toEqual), UA3 and UA4 (both build ViewState literals), and the brief and §3 want the base suites unedited.
   - A minted view therefore stays the four-member object, and UB12 asserts the defaults through the readers.
   - The alternative is required members and edits to three phase A test files. It is easy to switch now and costs more after the App stage. If you would rather have the literal form, say so.
2. **H3 is not met in one respect: UA4's union `it`.**
   - Phase A's `it` names exactly two actions, and its own title says phase B adds the rest. Adding §2.4's other seven names makes `npm run typecheck` fail on that one line (src/workspace/viewTransitions.test.ts line 40). I proved this by checking out B's viewTransitions.test.ts and workspaceState.test.ts onto the head's source.
   - At runtime all 9 base tests there still pass, since vitest does not typecheck. I edited that `it` into the nine-name table (a `satisfies` over the union, plus a runtime "every name is applied" loop). UA4's row requires the union to be §2.4's names, and the form (Amendment 2 item 5) lists only R4 and U5 as edits.
   - Every other base test file is unedited. workspaceState.test.ts only has tests appended. Amendment 2 item 5's two edits are not yet made and belong to stage 4.
3. **The stored selection is the members map only.** The form's `{resource, generation, members}` is composed where read: resolveScope builds resource and generation from the view's binding. The reducer ends the selection on the two events that change either, so they cannot disagree.
4. **countSelection has a `_facts` parameter** (`{filterApplied, viewComplete}`) that no code reads. Amendment 2 item 9's UB3 mutation ("produce the filter reason when a filter is applied and the view is reported complete") needs the test to feed those facts. In stage 5 App must pass what it actually holds, and nothing invented for `viewComplete`.
5. **`selectionNotice` holds two kinds,** `ended` and `refused` (the ceiling's). Both stand until the next selection transition.
6. **Rows beyond the form's table:** UB-TI1 (tool.set and mode.set) and UB-TI2 (inspect.set and inspect.pin), each with a mutation; UB2 and UB1 each have more than one `it`. Every `it` I added has its own observed mutation. Only phase A's own `it`s lack one (the reviewer's N3).
7. **Class 8 candidate at file level (§7).** The B-W row says the two phase A files take at most 160 more. viewTransitions.ts is +109 and workspaceState.ts +78 (net of deletions; numstat insertions 99 and 68), 187 together on the form's numstat basis. Amendment 7's AM7-P allows workspaceState.ts +20, so the combined allowance is 180. By the form's own command the group is well inside its ceiling (433 against 630). I edited no §7 line.
8. I added no "lint" or format step because the repo has none in verify.

## Tests and mutations
All 25 were applied to the committed tree of X = feaa43d329e6d900b6ae672547569f1b591e3052, the named test run, the failure read, and the file restored with git checkout. Porcelain was empty after each, and no verify-mutation run was used. Each failure text is recorded in its test's comment. The exact edits are in those comments; failures are abbreviated here.

| Test | Mutation | Failure observed |
|---|---|---|
| UB1 four modes | toggle adds only | "toggle removes a present id: expected [ 1n, 2n ] to deeply equal [ 2n ]" |
| UB1 one id per feature | add loses its present shortcut | second click replaced the first bounds: bounds objects not equal |
| UB1 no write to input | withMember writes into the given map | "expected [ 1n, 2n, 4n ] to deeply equal [ 1n ]" |
| UB2 ceiling | check dropped | add at ceiling is "changed", not "refused" |
| UB2 last place | refuse one early | "expected 9999 to be 10000" |
| UB2 view | return the view on refusal | "expected null to deeply equal { kind: 'refused', ... }" |
| UB3 counts | reason when filter and complete | counts differ (reason not null) |
| UB3-b null box | null box as containing all | "outsideView: +0" where null expected |
| UB4 source change | views left as they are | "expected 2 to be +0" |
| UB4 reopen | carry members across rebind | "expected 2 to be +0" |
| UB4 none when empty | notice always built | "expected { kind: 'ended', ... } to be null" |
| UB5 transitions | filter.apply clears | "filter.apply: expected Map{} to be Map{ 1n => ..." |
| UB5 view box | counting deletes outside members | "selected: +0 ..." where 2 expected |
| UB6 five changes | filter comparison omitted | "expected { ok: true } to deeply equal { ok: false, changed: [ 'filter' ] }" |
| UB6 scope is five things | camera added | key list gains camera |
| UB6 by value | identity compare | same predicate reported as a change |
| UB6 gone view | null current is ok | "expected { ok: true } to deeply equal { ok: false, changed: [ 'view' ] }" |
| UB6 uses | always take selection | "expected Set{} to be 'none'" |
| UA3 resolveScope | read drawOrder[0] | scopes differ after the permutation |
| UB12 | default replace | "expected 'replace' to be 'toggle'" |
| UB14 a | acquire without presence check | "expected [ 'view-1', 'export-1', 'export-1' ] to deeply equal [ 'view-1', 'export-1' ]" |
| UB14 b | rebind empties consumers | "the view left; the export stayed: expected [] to deeply equal [ 'export-1' ]" |
| UB14 c | acquire does nothing | "expected [ 'ds_a' ] to deeply equal []" |
| UA4 union | inspect.pin case deleted | "inspect.pin is applied: expected undefined to be defined" |
| UB-TI1 | tool.set ignores param | "expected 'navigate' to be 'select'" |
| UB-TI2 | pin without an inspected feature | "nothing to pin: expected true to be false" |

## H3 and runs at the head (0da5277b)
- `npm run verify`: rc 0. 86 files and 1242 tests (+2 files, +25 tests over B's 84/1217), residency-trace 76, citation-integrity 30.
- verify-cites rc 0 (1802 files, 37 advisories). verify-quotes rc 0 (121 checked, 90 verified, 30 baselined; I wrote no verbatim quotes). verify-test-claims rc 0 (545). verify.mjs rc 0.
- node --test scripts suites: rc 0, 457 pass, 0 fail.
- All shared holds were granted; no exit 96 to 99. Holds used: three `npm run verify` runs (one failed early on missing node_modules, one superseded, one clean at B, one at the head).
- H3 for unit suites: see decision 2. The base tests pass unedited by running, and the single typecheck exception is UA4's union line.

## §7 count (§7's own command from B, three-dot, at the head)
Insertions 982 plus deletions 24 = 1,006.
- selection.ts 140 (300), scope.ts 85 (140), selectionConstants.ts 21 (30), viewTransitions.ts 109, workspaceState.ts 78. The B-W row totals 433 of 630.
- Tests: selection.test.ts 285, scope.test.ts 139, viewTransitions.test.ts 82, workspaceState.test.ts 67.

## e2e for the custodian
Stage 1 needs no e2e step, and I wrote none. I ran no e2e suite and left e2e/selection.mjs untouched. Nothing is owed for this head. For later: run the full 14-suite list at stage 5's head and at the final head, plus e2e:selection. Each e2e step needs its mutation observed by the custodian: E-CLICK, E-SELECT, E-NODRAG (two), E-SEL-FILTER, E-SEL-PAN, E-GEN, E-REFUSED, E-ZOOMSEL, E-EXPORT, E-SCOPE, E-KINDS, E-CLICK-FAST and E-ASK (third step: show the statement only when cancel() answers true). I will list the exact steps with each stage.

## Not done as written, plainly
- Optional ViewState members (decision 1) and the UA4 union edit (decision 2).
- The first stage-1 verify attempt was not clean (new files present while it ran); I discarded it and re-ran.
- UA3's resolveScope clause is in scope.test.ts, not workspaceState.test.ts, so B10's workspaceState.test.ts +30 stays for UB12.
- The late-cancel strings and the ask's render site (OPEN-12) are stage 7's.
- The pre-gate four-class check: no cross-module interface was touched (workspace only). The only caller-less code is UB-tested pure code: every export except the readers has its caller in the stage 4/5/6/7 plan above (the second exemption, named in the form), and `unionOfBounds` was deliberately left out until its RB6 caller.
- Not claimed: nothing about perf.

## State left
`git status --porcelain` in C:/dev/wt/mm2b: empty. HEAD 0da5277b = origin/cut/shell-migration-milestone-2-phase-b. node_modules in frontends/shell and renderer/bundle-viewer are real installs (ignored). Run artefacts: scratchpad mm2b-b/ (pin recheck script, mutation harness, logs).
