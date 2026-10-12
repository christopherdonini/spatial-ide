*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 7 of 8 (B3), branch cut/shell-migration-milestone-2-phase-b at 5d45e2d9aa9815422832e521eb9ac0fb01dcb837, the run 2026-10-12T08:28:31Z to 2026-10-12T08:52:19Z by its transcript (Read 18, Bash 71, Write 11, Edit 2); its one SubagentHandback call, at 08:52:18Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is c4962ff0de2aee1c3e9c313e6824b819ef815daaf9840bbcce71a0663ca3fd1b; this file's, from line 5 to the end, is c4962ff0de2aee1c3e9c313e6824b819ef815daaf9840bbcce71a0663ca3fd1b.*

---

STAGE 7 of 8, phase B (B3: the ask while an export runs, the export run report, the late-cancel statement) is built, verified and pushed. I ran no e2e suite. Model: Sonnet 5.5 as the harness states, no override, no context handoff.

## Head and commits
Branch cut/shell-migration-milestone-2-phase-b in C:/dev/wt/mm2b. Head 5d45e2d9aa9815422832e521eb9ac0fb01dcb837, equal to origin after a plain push (9773d5c0..5d45e2d9). I ran `git fetch origin` first and found head 9773d5c01abc5ee27b2b707b69b6df5f0b1e1d06 and an empty porcelain. No merge, rebase, amend or force-push. Every commit is signed off and carries the Co-Authored-By trailer.
- 37bb2837: code and tests (report, consumer, ask, statement, UB13, RB12a to RB12e).
- 38c7ad96: selection.mjs, E-ASK and E-ASK-STATEMENT (written, not run).
- aa25137f: RB12a asserts the open count before the hook result. Every mutation was observed at this commit.
- 5d45e2d9: the observed mutations recorded (comments only; every diff line is a comment).

The 5d45e2d9 body states the counts: 6 mutations applied, run and reverted at aa25137f, one for each of the 6 tests (UB13, RB12a, RB12b, RB12c, RB12d, RB12e). Failures read: 9 (UB13 1; RB12a 1; RB12b 2, RB12b and RB12d; RB12c 2, RB12c and RB12a; RB12d 2, RB12d and RE12e... see list below; RB12e 1). Corrected line: RB12d's mutation failed RB12d and RB12e, so 2. UB14 gains no test and no observation. No verify-mutation run was used.

Not touched: state/, PLAN.yaml, the form, src-tauri, the kernel, WorkingCanvas.wiring.test.tsx, StudioLayout.test.tsx, `Slots`, the double-click, e2e-test-surface.ts, and what Current view sends or when it is available (OPEN-11's fourth term).

## Changes by file (all under frontends/shell)
- src/publish/PublishPanel.tsx (38+, 4-):
  - Exports `ExportRunEnd` and `ExportRunReport = {cancel, ended}`.
  - New required prop `onExportRunning`.
  - `reportPrepareRun` is called from `runPrepare` and `runPrepareWithDestination`. Its cancel is `publishCancel(prepareCancelKey(handle))`, and `ended` is built on `settlePrepareOutcome`.
  - `executeInStagedScope` (stage 6's single execute path) reports an execute run after the scope check passes and the host is called. Its cancel is `publishCancel(attemptId)`, and `ended` is built on `settleExecuteOutcome` (imported from PublishDialog, unchanged).
  - The dialog still receives the host's own promise.
  - A scope refusal makes no host call and so is not a run.
- src/App.tsx (82+, 1-):
  - `exportRunsRef` is a Map of `export-<n>` runs, each `{cancel, cancelChosen, end}`.
  - `handleExportRunning` is a stable callback. It mints the id, acquires the consumer, and clears the statement. When `ended` resolves, in the same handler, it records the end, decides the statement and releases the consumer. There is no other release and none on unmount.
  - `confirmOpen` is a stable callback. It clears the statement. It resolves true at once with no run standing; otherwise it returns the ask's answer. A second call answers the first ask as Keep.
  - `answerOpenAsk` records one `dataset.openDuringExport` row per choice. For Cancel it marks each asked-about run before calling its `cancel()` once. If that run's `ended` has already resolved, it decides the statement at the choice. `cancel()`'s answer is never read.
  - `region.layers` is now AdmissionPanel, the ask and the statement in a fragment (OPEN-12 (A), Amendment 8 item 2).
  - `onExportRunning` is passed to the PublishPanel.
- src/feature/OpenDuringExportAsk.tsx (new, 65 lines):
  - `OpenDuringExportAsk`, `LateCancelStatement` and the pure `lateCancelOutcome(cancelChosen, end)`.
  - It exports `LATE_CANCEL_FINISHED` and `LATE_CANCEL_FINISHED_UNAUDITED`, byte for byte the human's approved strings, and the type `FinishedOutcome`.
  - The ask's explanatory line is a [P6 placeholder]. The two labels are the form's.
  - The path renders whole on its own line, and the detail line renders only for succeeded-unaudited.
  - The two named-not-blocking items are in the constants' source comment, in words with no line cite.
- src/admission/AdmissionPanel.tsx (14+, 4-):
  - `AdmitPathDeps.confirmOpen?` is optional, so the existing tests that build deps stay unedited and synchronous.
  - `runAdmitPath` awaits it before the first `setState`. It returns `Promise<AdmissionOutcome | null>`, and null means dropped.
  - The `confirmOpen` prop is required, and App is the only renderer.
  - The `openPath` dev hook maps null to `{kind:"refused", code:"open.dropped", message}`; see "Not done as written".
- src/console/surfaceRegistry.ts (+7): the class-C row `dataset.openDuringExport`, a [P6 placeholder] statement.
- src/styles.css (+18): the ask and the statement, whole path wrapping.
- src/admission/AdmissionPanel.test.ts (+26): UB13.
- src/App.selection.test.tsx (+195, -5):
  - The `publish/client` mock gains `publishCancel` (records the key; answer set by the test) and held outcomes (`pendingPrepare`, `pendingExecute`).
  - New: RB12a, RB12b, RB12c, RB12d and RB12e (RB12e is a row beyond the table). The header and the `MILESTONE_ROWS` set were edited.
- e2e/selection.mjs (+82, -1): see below.

## The caller rule
- `onExportRunning`: PublishPanel.tsx:341 (prop), :366, with calls at :391 (via `reportPrepareRun`, used at :417 and :462) and :504. Product caller: App.tsx:2282 passes `handleExportRunning`.
- `ExportRunReport` and `ExportRunEnd`: imported by App.tsx:44.
- `confirmOpen`: AdmissionPanel.tsx:184, :203, :270, :282, :295. App.tsx:1902 passes it, and `confirmOpen` is defined at App.tsx:1133.
- `OpenDuringExportAsk`, `LateCancelStatement`, `lateCancelOutcome` and `FinishedOutcome`: App.tsx:23-24 and :1903-1904, with `lateCancelOutcome` called at :1125 and :1158.
- The `dataset.openDuringExport` row is recorded at App.tsx:1153.
- `ExportConsumerId`, `consumer.acquired` and `consumer.released` have App.tsx:1107-1129 as their new product callers.
- `settleExecuteOutcome` is imported at PublishPanel.tsx:16 and used at :506.
- `LATE_CANCEL_FINISHED` and `LATE_CANCEL_FINISHED_UNAUDITED` are exported because Amendment 7 item 2(d) says so. Their product use is inside OpenDuringExportAsk.tsx:60, and the only importer outside the file is App.selection.test.tsx. Stage 6 made a sentence constant local for lacking an importer, but there the form did not require the export. If the custodian reads the caller rule strictly, they can be made local (a two-word change).
- Nothing here relies on the second exemption.

## Tests, each with its mutation and observed failure (all at aa25137f91bf4b35f71de5f1e42e9b646c86989a)
- UB13 (AdmissionPanel.test.ts): `false` gives no admit, no setState and null; `true` gives today's flow.
  - Mutation: in `runAdmitPath`, move the confirmOpen check below the `deps.admit` call.
  - Failure: `no admit: expected "vi.fn()" to be called +0 times, but got 1 times`.
- RB12a: Keep exporting opens nothing, leaves the handle, closes nothing, cancels nothing, queues nothing, records one row, and the export reaches its outcome in its own panel with no statement.
  - Mutation: `ask.answer(true)` for both choices.
  - Failure: `no openDataset: expected 2 to be 1`.
- RB12b: Cancel and go on gives one cancel with the attempt id, one more open, the old handle not closed while the run stands, and `closeDataset(old)` once after the outcome.
  - Mutation (the form's "release the consumer on unmount", in this design where the panel has no unmount hook): `handleAdmitted` releases every standing export consumer.
  - Failure: `the old handle stays open while the export runs: expected 1 to be +0`. RB12d also failed, at (i)'s not-closed assertion.
- RB12c: with no run no ask; an ended run is not standing.
  - Mutation: the ask is always rendered (`{asking &&` becomes `{true &&`).
  - Failure: `no run, no ask: expected <div ...> to be null`. RB12a also failed, at `the ask is gone`.
- RB12d, (i) to (v) in one test, using real panel, dialog and App:
  - (i) the answer is true and the outcome is success: statement with path P, `closeDataset(old)` once and only after the outcome.
  - (ii) the answer is false and the outcome is success: the same.
  - (iii) the answer is true and the outcome is refused: none.
  - (iv) a prepare run ends as a prompt after the choice: none.
  - (v) succeeded-unaudited: the unaudited words, P and the detail.
  - The next export report clears the statement.
  - Mutation: the statement only when `cancel()` answers false (`run.cancelChosen = false; void run.cancel().then((answer) => { run.cancelChosen = !answer; })`).
  - Failure: `(i) the answer is true and the outcome is success: expected { Object (text, path, ...) } to deeply equal { ...(3) }`. RB12e also failed.
- RB12e (beyond the table): a run that ended while the ask stood is decided at the choice, and the choice still calls cancel once.
  - Mutation: remove the decision at the choice in `answerOpenAsk`.
  - Failure: `decided at the choice: expected null to be 'C:/out/early'`.
- UB14: the stage 1 test already covers all three of Amendment 7 item 6's assertions.
  - The first is acquired twice then released, closable exactly once.
  - The second is an export consumer keeping a resource out of `selectClosable` until released.
  - The third is a re-acquired view keeping a live resource out of `selectClosable`.
  - Nothing was added.
- Two mutations were tried before the recorded ones, and are stated in the 5d45e2d9 body:
  - RB12a first failed at the dropped-open assertion. I moved the open-count assertion first (aa25137f) so the failure reads on the count, as the form says.
  - RB12c as a `confirmOpen` that always asks failed at least 20 tests by leaving every open waiting (the listing was cut at 20). The recorded mutation is the always-rendered ask.
- I could not test "no timer" without a timer test. It holds by construction (no timer in the code), and §8 item 37 is for the reviewer to read.

## e2e steps written (selection.mjs, run none)
Both are separate functions inserted after `stepScope`, with their `runStep` lines after E-SCOPE's. No other step's code is touched. A shared driver `startExportThenOpen` starts the 100k whole-file execute through the dev hooks, starts an open of filter-zoned (neither awaited), and reads the ask. Both steps fail with the word INCONCLUSIVE (class 2, never a pass) when the export had ended by then.
- E-ASK:
  - The ask shows.
  - Keep exporting gives `{refused, open.dropped}`, the layer stays the 100k fixture, the export ends `success`, and no statement shows.
  - Repeated with Cancel the export and go on: the new dataset is admitted and the layer is filter-zoned.
  - The newest console `open_dataset` or `close_dataset` row is read first and then whether the run is done. A close seen with the run not done fails, since `done` never reverts.
  - After the outcome a `close_dataset` row follows (polled up to 20 s).
  - The statement shows exactly when the outcome wrote a bundle.
  - Mutations for the custodian:
    - (1) src/App.tsx `confirmOpen`, `return Promise.resolve(true);` as its first statement. Expected: the absent ask.
    - (2) src/App.tsx `handleAdmitted`, also release every standing export consumer. Expected: the old handle closed before the outcome.
- E-ASK-STATEMENT (Amendment 7 item 6's third step):
  - The ask shows. The step waits for the hook's outcome, which must be `success`.
  - It then chooses Cancel the export and go on and waits for the admission.
  - The statement's path equals the outcome's `bundle_path` and its text starts with the approved words. That folder holds `manifest.json`, and the layer is filter-zoned.
  - Mutation for the custodian: src/App.tsx `answerOpenAsk`, the statement only when `cancel()` answers true (`run.cancelChosen = false; void run.cancel().then((answer) => { run.cancelChosen = answer; });`). The run has ended, so the host answers false. Expected: the absent statement.
- Both mutations are listed in the file header. The header sentence that said E-ASK follows in its own stage is corrected.
- The console is expanded by E-ASK's reads and clicked closed again at its end.

## H3
`npm run verify` exited 0 at aa25137f, run under a granted shared hold (MACHINE_HOLD then MACHINE_RELEASED; no exit 96 to 99). Results: 93 test files, 1330 tests passed (stage 6's 1324 plus 6); residency-trace 76 passed; citation-integrity 30 passed; typecheck, build and the dist checks passed. The head 5d45e2d9 differs from aa25137f only in comments.
- No base suite was edited. This stage's test edits are App.selection.test.tsx (a phase B file) and AdmissionPanel.test.ts (UB13 appended, within Amendment 1's allowance).
- PublishPanel.test.ts, PublishDialog.test.ts and all the others are unedited and pass.

## Governance, at 5d45e2d9
- verify-cites: rc 0, 1816 files, 38 loose advisories.
- verify-quotes: rc 0, 121 checked, 90 verified, 30 baselined. I wrote no verbatim quotes. A `--show-cites` run on my five changed files listed six cites, all in App.tsx comments from before this stage (lines 668 to 1412, none mine).
- verify-test-claims: rc 0, 545 claimed tests.
- verify.mjs: verify:plan PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.

## §7, by §7's own command from B (c96e5329, three-dot, at 5d45e2d9)
- Cumulative: 5,479 insertions plus 110 deletions = 5,589. At 9773d5c0 it was 4,959 plus 102 = 5,061, so the stage adds 528 net. The ceiling is 8,352. No overrun at that level.
- Stage 7's lines per file against the combined Amendment 7 and Amendment 1 B3 ceilings (AM7-P and AM1-X product, AM7-T and AM1-X tests):

| File | Stage 7 | Ceiling |
|---|---|---|
| PublishPanel.tsx | 42 | 60 (30+30) |
| App.tsx | 83 | 105 (45+60) |
| OpenDuringExportAsk.tsx | 65 | 135 (35+100) |
| AdmissionPanel.tsx | 18 | 20 |
| styles.css | 18 | 20 (5+15) |
| surfaceRegistry.ts | 7 | 5 (**overrun 2**) |
| AdmissionPanel.test.ts | 26 | 60 |
| App.selection.test.tsx | 200 | 370 (220+150) |
| workspaceState.ts / workspaceState.test.ts | 0 | the +20 and +45 were spent in stage 1 |
| selection.mjs | 83 (E-ASK, E-ASK-STATEMENT, header) | cumulative 651 against the allowance of about 660 (AM1-X +90, AM7-E +70) |

- The one overrun, 2 lines in surfaceRegistry.ts, is class 8 and §7 is not edited. I kept the registry's seven-line object form.
- AM7-P as a group: PublishPanel 42, App 83, OpenDuringExportAsk 65, styles 18 sum to 208, against AM7-P's 135 plus AM1-X's product lines (Ask 100, PublishPanel 30, App 60, styles 15, AdmissionPanel 20, surfaceRegistry 5 = 230), 365 in all (the 20 for workspaceState.ts is stage 1's and is left in). The allowed total stands.
- App.selection.test.tsx cumulative is 959, which is not a form figure.

## The exact e2e list for the custodian at 5d45e2d9
- Required: `npm run e2e:selection`. Observe each new step's mutation above, one at a time. Read an INCONCLUSIVE failure as class 2, not a pass.
- Required: `npm run e2e:publish`. The execute path now reports a run, and the dev hooks go through it.
- Required: `npm run e2e:admission`. `runAdmitPath` now awaits `confirmOpen` before its first `setState`, and the `openPath` hook has a new branch (null). With no run standing the answer is immediate.
- Recommended: `npm run e2e:console`, for the new class-C row (the unit completeness and language tests pass).
- Not needed: regression, layout, style, filter, filter-panel, refusal-contract-baseline, residency-harness. No canvas, layout or style-panel code changed. Every suite opens through `openPath`, and the only change for an open with no run is one microtask. Stage 5's and stage 6's lists stand separately.

## Notes
- **An execute run is reported only when the host is called,** after the staged-scope check passes. A scope refusal is not a run. Both prepare paths (the picker and the dev destination) report, and the destination path's cancel answers false because no token is registered.
- **The ask stands after its run ends,** until a choice. After that, Cancel still calls `cancel()` once (the host answers false for an ended run, and the answer is never read), and the statement is decided at the choice (RB12e).
- **The statement clears** at the next `confirmOpen` call or the next export report, as Amendment 7 item 2(d) says. A refused open after Cancel leaves the statement standing.
- **A second `confirmOpen` while an ask stands answers the first as Keep,** so no promise dangles and nothing is queued. The form does not say this, and it is not tested separately.
- **A choice records one row for both choices,** `dataset.openDuringExport`. The cancel it sends and the open that follows keep their own existing rows.
- **The ask copy is a [P6 placeholder].** I wrote it to say the export "is asked to stop", since a cancel is a request.
- **MANUAL-WALKTHROUGH.md, KNOWN-LIMITATIONS.md and the W8a third step are stage 8's.** I did not touch them.

## Not done as written
- **`OpenPathOutcome` has no dropped kind.** `e2e-test-surface.ts` is outside §2.7's list (§8 item 1), so I did not edit it. A dropped open (Keep exporting) therefore reads through the `openPath` dev hook as `{kind:"refused", code:"open.dropped", message}`, inside AdmissionPanel.tsx. This is an honest-enough label for a dev hook but not a typed kind. If the human wants a typed third kind, it needs a form amendment adding e2e-test-surface.ts. E-ASK relies on that code.
- **RB12b's mutation is realized in App's `handleAdmitted`** because the form's "release the consumer on unmount" has no matching code in this design (the release is only at `ended`). It still fails the same property: the old handle closed before the outcome.
- **RB12 is split into RB12a to RB12e,** with RB12d holding the form's (i) to (v) and RB12e a row beyond the table, with its own observed mutation.
- Nothing else in the stage list was skipped.

## Final porcelain
`git status --porcelain` in C:/dev/wt/mm2b prints nothing. Local head 5d45e2d9 equals origin/cut/shell-migration-milestone-2-phase-b. Run artefacts (verify log, scripts) are in my scratchpad, outside the repo.
