Reviewed: PR #295 at 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a (base 1bc349ae), gate 1, architect
Verdict: PASS WITH NOTES

cut/shell-comments-drift-sweep-area-a @ 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a. I have no shell. I could not check the sha256 of the brief or the packet, and I could not confirm the worktree's HEAD. I read `C:/dev/wt/sca` as the packet states it: HEAD 5a45e113 with an empty tracked porcelain at assembly. I left no background shell. Every `:line` below is a line at 5a45e113 as read in that worktree. I give no span hashes because I cannot compute them, and gate reports are exempt from verify-cites.

## Findings by class

**Correctness:** none. No changed comment carries a false clause that ordinary use can reach (clause table below).

**Evidence:** none for me to make. The token proof, the nine-path numstat and CI are the reviewer's, since they need a shell. I checked by reading instead. The header of `e2e-test-surface.ts` (:1-27) is byte-identical to main's copy (main has not changed the file since the base, per packet §1). The five "DEV-ONLY" labels have identical text; the lines moved from 158/175/279/305/316 to 158/175/288/314/329. The two DescribeSummary `<dt>` strings are identical (:88, :95 here against main :87, :94). Main's A5 and A2 blocks (main :193-222, :305-315), set against the head's, show only comment lines changed.

**Documentation (must be fixed before the merge; no re-gate; the worker applies these words and the PR body lists them; none of this is the human's wording):**

- **D1.** The `getResidencyArm` doc, `frontends/shell/src/e2e-test-surface.ts:326-327 @ 5a45e113`.
  - The defect: "unless a prior `setResidencyArm("baseline")` call on this same session succeeded" is untrue if a later `setResidencyArm("candidate")` succeeds.
  - Reaching that case needs the setter hook, which is registered only under `isInstrumentedBuild()` (`App.tsx:1246`, `:1328`). Under the 2026-10-11 wording rule, item 2, a case that needs an instrumented build does not block. It is named here.
  - Words (mine): `/** Reads the current arm back -- the arm the last successful `setResidencyArm` call selected since the page loaded, or `"candidate"` (`DEFAULT_RESIDENCY_ARM`) if none has succeeded. */`
  - Clause check:
    - "the arm the last successful call selected": `residencyArm.ts:96-106` assigns `currentArm` only on success, and `:68-70` returns it. True.
    - "since the page loaded": `currentArm` is module-scoped (`:58`) and is reset only by the test-only `__resetResidencyArmForTests` (`:123-126`). True.
    - "`"candidate"` if none has succeeded": `:50` and `:58`. True.
    - The hook returns this getter: `App.tsx:1329`. True.

- **D2.** A5's declaration, `e2e-test-surface.ts:202-213 @ 5a45e113`, against the rule at `governance/AI_DEVELOPMENT.md:279` (round 5, item 4).
  - The declaration names all three callers truly (check 4). It gives the "why the property must be proven" for source-changed.mjs only ("The reason below is P3b's, written for source-changed.mjs.").
  - For source-watch-idle.mjs the reason holds but is not stated. For export-view.mjs no reason is stated, and none of the shipped-build kind exists (check 4).
  - Words (mine), to replace the sentence at `:213`:
    `The reason below is P3b's, written for source-changed.mjs. It holds unchanged for source-watch-idle.mjs, whose W2 and F2 check the same owner-side consequence, reached by the watcher's event instead of the next query. export-view.mjs reads the count as a precondition of its steps, not as the property it proves; no reason is claimed for it here.`
  - Clause check:
    - "holds unchanged … same owner-side consequence": `source-watch-idle.mjs:8-14` (the running app "clears the resident geometry … exactly as `source-changed.mjs`'s pre-check route already proves"); W2 at `:344-354` asserts >0, F2 at `:534-544` asserts ==0. True.
    - "reached by the watcher's event instead of the next query": `:9-14` (the session ends "over the `skp://dataset_session_ended` event"; "no next query is ever issued here"). True.
    - "a precondition of its steps, not the property it proves": `export-view.mjs:84-90` (`applyAndRefit` waits for a resident feature, then settles). The properties it asserts are box comparisons, at `:116`, `:119` and `:139`. True.
    - "no reason is claimed": the sentence refers to itself. True.
  - Size: +3 lines, about 134 of the 150 budget.

**Notes (preferences; not acceptance conditions):**
- N1. `residencyTileSizeLevel.ts:15` heading "Gated by its callers". The next sentence names the ungated getter, so the heading is not false. My words, if wanted: "Any gate is at its callers, not a check inside this module itself".
- N2. `DescribeSummary.tsx:81-83`, "also render in the status bar". The status item is hidden while the session-ended statement stands (`statusItems.ts:28`; `App.tsx:2379`). I read the sentence as a placement statement, like its neighbour "both render in this existing component" for two conditional rows, so it holds. My optional words: append ", except while the session-ended statement stands". Clause check: `statusItems.ts:28` returns null when `sessionEnded`, and `App.tsx:2379` passes `sessionEnded !== null`. True.
- N3. `FilterPanel.tsx:42-43`, "lists the dataset's column names". `fieldOptions` lists the non-geometry names that match the typed text, capped (`fieldCompletion.ts:46-50`). It holds as a summary.

## Checks 1 to 6

1. **Out-of-scope line.** It holds, as far as I can see from files. The packet's numstat (custodian's script) lists nine files, all under `frontends/shell/src/`, none of them tests, none under `protocol/`, no ADR. I cannot rerun the diff; that is the reviewer's. In every changed comment I read, no sentence says which build keeps the e2e hooks or what `check:dist-clean` proves.
   - A1 states a fact about the list only: `candidateArmSession.ts:47-48` (`startCandidateArmSession` "is not on `check:dist-clean`'s forbidden list"), true by `checkDistClean.mjs:87-124`, where it is absent and removed per `:90-102`. Section 4 allowed exactly that.
   - `residencyTileSizeLevel.ts:15-21` names the gate `isInstrumentedBuild()` and makes no claim about which builds it admits. I-3 was not triggered.
2. **Red-line scan.** No security-posture sentence is written. The header `:1-27` and every "DEV-ONLY" label are untouched (Evidence above). No P6 string is touched: the `<dt>` labels at `DescribeSummary.tsx:88` and `:95` are identical, and no JSX text changed in the regions I read.
3. **Clause table:** below. Every clause holds at the head, apart from D1's instrumented-build case.
4. **A5 against `AI_DEVELOPMENT.md:279`.**
   - source-changed.mjs:
     - States what it reads: yes and true. S2 at `:864-874` (>0), S5b at `:1213-1223` (==0), R2 at `:1320-1333` (>0 after the reopen).
     - Says why: yes, `:215-220`.
     - The why is true: yes. Unit tests can only see the clears called; only the running app shows the residency empty.
   - source-watch-idle.mjs:
     - States what it reads: yes and true. W2 at `:344-354`, F2 at `:534-544`, on the OS-watch route while idle (`:8-14`).
     - Says why: not explicitly.
     - Would the why be true: yes, P3b's reason applies to the same consequence. The gap is this piece's to close, inside the comment and inside Scope: D2.
   - export-view.mjs:
     - States what it reads: yes and true. `:67` reads `totalResidentFeatures`; `:88` fails the step if none is resident within the bound, after `queryWithFilter` (EV3 with a predicate; EV6 with `""`, which the driver calls a clearing predicate at `:84`).
     - Says why: no.
     - Would a why be true: the read is a precondition, not a property that must be proven about the shipped build, so no true reason of that kind exists. D2's words say so honestly.
     - **For the human (a candidate node, not this piece's):** does round 5, item 4 admit a test caller that reads an exempt accessor only as a precondition, or should export-view's wait move to another signal? The second is an e2e driver change, outside this Scope.
   - The callers on the product side: in `frontends/`, `residentCounts` is called only by the three drivers. `App.tsx` only registers it (`:1281`) and unregisters it (`:1342`). "No product module reads it" holds.
5. **Block-on-sight.**
   - (1) Phase 2 after the README PR: holds. 5a45e113's parent f7f38acd merges main 1bc349ae, whose commit records #292 merged. This rests on the packet's graph facts and phase 2's filing note.
   - (2) No path outside the nine: holds on the packet's numstat; the reviewer reruns it.
   - (3) No code token changed: the workers' token proofs say none; my reads of A2, A5 and the eight phase 1 blocks found comment lines only. The reviewer reruns the proof.
   - (4) No clause untrue at the head, D1's instrumented-build case aside.
   - (5) and (6) hold (checks 1 and 2).
   - (7) CI is the reviewer's.
6. **Constitution.** No conflict. The comments describe code that does not change. P7 ("Never block the canvas") is cited unchanged in `tileGrid.ts:308`. The ADR-010 rule 5 cite at `pick.ts:57` (`:68`) is unchanged. No docs/09 posture text is touched, and no ADR text is touched.

## Clause table (head 5a45e113; code at the same commit)

| Item | Comment | Clause | Code it rests on | Holds |
|---|---|---|---|---|
| A1 | candidateArmSession.ts:42-44 | the check is `shouldConstructCandidateSession()`, comparing with `"candidate"` | residencyArm.ts:84-86 | yes |
| A1 | :43-44 | the arm defaults to `"candidate"` | residencyArm.ts:50, :58 | yes |
| A1 | :44-46 | App makes the check with no `isInstrumentedBuild()` operand; the import is live; the session runs by default | App.tsx:1611-1612 | yes |
| A1 | :46-47 | selecting `"baseline"` is a `setResidencyArm` call the e2e harness makes through its hook | residency-harness.mjs:2695-2708; App.tsx:1328 | yes |
| A1 | :47-48 | not on `check:dist-clean`'s forbidden list | checkDistClean.mjs:87-124 | yes |
| A9 | candidateArmSession.ts:149-150 | App reads `getResidencyTileSizeLevel()` ungated, where the session is constructed | App.tsx:1611, :1624 | yes |
| A9 | :150-154 | this module imports neither selector | candidateArmSession.ts:4-33 | yes |
| A9 (OPEN-3) | residencyTileSizeLevel.ts:7-8 | the counterpart to the arm switch (the "DEV-only" word is gone) | — | yes |
| A9 | :16-18 | the setter and getter hooks and the notify calls are behind `isInstrumentedBuild()` | App.tsx:1246, :1334-1335, :1555, :1713, :1907 | yes |
| A9 | :18-19 | the getter is also called ungated at construction | App.tsx:1624 | yes |
| A9 | :19-20 | no export checks a build flag | residencyTileSizeLevel.ts:50-95 | yes |
| A7 | FilterPanel.tsx:41-43 | the command bar lists column names through `fieldOptions`, from `describe.schema` | CommandBar.tsx:95; fieldCompletion.ts:46-50; StudioLayout.tsx:326; App.tsx:2037 | yes (N3) |
| A7 | :43-45 | the 200px floor and the budget are history, per styles.css's header | styles.css:16-23 | yes |
| A8 (OPEN-3) | DescribeSummary.tsx:79 | the form path resolves | governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:188 (§2d) | yes |
| A8 | :80-81 | not over the map; renders in this component | DescribeSummary.tsx:84-98 | yes |
| A8 | :81-83 | the same facts render in the status bar as `WatcherStatusItem`/`watcherStatusText`, placed by App | App.tsx:2378-2379; regionParts.tsx:217-218; statusItems.ts:27-35; contributions.ts:50-55 | yes (N2) |
| A10 | recorder.ts:6-8 | `skp/client.ts` is the only importer of `consoleRecorder` outside `console/` and the tests | soleCaptureSite.test.ts:36, :76-81, :131-142; grep: only skp/client.ts:6 | yes |
| A10 | :8-10 | `recordNamed` is imported by the `RECORD_NAMED_ALLOWLIST` modules; two scans, one per name | soleCaptureSite.test.ts:49-61, :130-172; grep: all 11 import it | yes |
| A10 | :353-358 | the five binding modules and six class-C modules import `recordNamed` and never `consoleRecorder` | grep of recorder imports (11 files, none naming `consoleRecorder`) | yes |
| A10 | :358-360 | ConsolePanel imports both, reads the log, calls `recordNamed` for two toggles; allowed as a self-reference | ConsolePanel.tsx:18, :49-55, :79, :123; soleCaptureSite.test.ts:76-81 | yes |
| A11 | pick.ts:54-56 | `onHover` emits `null` in its `emitHoverReadout(null)` branches | WorkingCanvas.tsx:2148-2170 (:2159, :2168) | yes |
| A11 | tileGrid.ts:302-305 | `onCameraChange` now goes through `tileCoverForBbox`; the capacity truncation is in that method | tileViewportStreamManager.ts:511, :527, :618-640 | yes ("either side of the fix" is history carried from the old text; I cannot check it without git) |
| A11 | :316-317 | the policy is `onCameraChange`'s capacity truncation, nearest kept | tileViewportStreamManager.ts:628-640 | yes |
| A11 | :394-395 | `tileIngest.ts:43-51` and `WorkingCanvas.tsx`'s `parseTileKey` throw | tileIngest.ts:43; WorkingCanvas.tsx:503 | yes |
| A11 | renderTrace.ts:148-150 | `traceViewportQuery`'s call site carries the quoted words | tileViewportStreamManager.ts:939-942 | yes |
| A11 | e2e-test-surface.ts:199 | read through `WorkingCanvasHandle.getResidentCounts()` | WorkingCanvas.tsx:113, :177, :1623 | yes |
| A5 | :202-204 | three e2e callers; no product module reads it; App only registers it | grep (above); App.tsx:1281, :1342 | yes |
| A5 | :205-212 | each driver's reads | check 4 | yes |
| A5 | :213 | the reason is P3b's, written for source-changed.mjs | :215-220 | yes (D2 adds to it) |
| A2 | :315-316 | the default is `"candidate"` | residencyArm.ts:50 | yes |
| A2 | :319-321 | the harness sets `cellArgs.arm` in `main()` before the first `openFixture` and reads it back; `"baseline"` unless `--arm candidate` | residency-harness.mjs:396-403, :2291, :2695-2708 | yes |
| A2 | :321 | refusal-contract-baseline sets `"baseline"` and reads it back | refusal-contract-baseline.mjs:606-614 | yes |
| A2 | :322-324 | those two are the drivers that run on `"baseline"`; regression, filter-panel and console set nothing and assert `"candidate"` | grep of e2e (only those two call the setter); regression.mjs:1774-1776, :2633-2636; filter-panel.mjs:475-478; console.mjs:73, :1029-1030 | yes |
| A2 | :326-327 | the getter reads `"candidate"` unless `"baseline"` was set | residencyArm.ts:58-70, :96-106 | instrumented-build case only (D1) |

## For the human
- The A5 / export-view question in check 4: whether reading an exempt accessor only as a precondition is admissible under round 5, item 4. It is a candidate node and does not hold this piece.

## Siblings outside Scope (for the custodian, not this piece)
- `App.tsx:1277-1278` still says "Its only caller". App.tsx is excluded (PR B's file).
- `residencyArm.ts:65-67` has D1's wording pattern. It is an unnamed file that must not change here.
- `source-watch-idle.mjs:5` and `:24` cite the old `engine/SOURCE-WATCHER-PREREGISTRATION.md` path. That is an e2e driver, outside Scope.
- The "dev-gated" words at `residencyTileSizeLevel.ts:42`, `:48`, `:76`, `:82` are lines this piece did not change, and they belong to the Note 2 posture family.

## The packet's gaps (Part 2, section C)
- No base text of the changed hunks inline, only a locator to a git diff. A gate without a shell cannot read the diff. I used section 4's byte-copied old blocks and main's copy of `e2e-test-surface.ts`, which the packet says is unchanged since the base.
- The worktree HEAD equal to 5a45e113 is stated, and a gate without a shell cannot check it.
- Nothing else was missing.
