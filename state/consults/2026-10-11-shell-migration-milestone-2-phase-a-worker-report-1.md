*Custodian's filing note (2026-10-11): the worker-high's report on milestone 2's phase A, branch cut/shell-migration-milestone-2-phase-a at c08cb809db97b2a4ab6e7cbbfad1fb822cd5a299, the run 2026-10-11T18:38:11Z to 2026-10-11T20:24:11Z by its transcript (Read 4, Bash 180, Write 9, Edit 1). It arrived as a message and is extracted here by script from the SubagentHandback call in its transcript. 0 rooted path:line cites are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is 40312849b9a847f0da7ea8fb20aca640c55a0f4489ca17bb0f4ae367338ea33b; this file's, from line 5 to the end, is 40312849b9a847f0da7ea8fb20aca640c55a0f4489ca17bb0f4ae367338ea33b.*

---

REPORT: shell-migration-milestone-2, phase A (worker-high; model observed: Sonnet 5.5, no override, no context handoff).

## Head and commits
Head c08cb809db97b2a4ab6e7cbbfad1fb822cd5a299 on cut/shell-migration-milestone-2-phase-a, pushed with a plain push (no PR). B = 86f60365ae473323e4f2357942a3441fc5cd6d5f was HEAD at the start and `git status --porcelain` was empty (checked after `git fetch origin`). origin/main has since moved to 236103b3 (#211); the merge base is still B. No merge, no rebase, no force.
- deab7dc9  feat: the workspace state keyed by view (seam 4): src/workspace/, App.tsx, UA1-UA6, RA1, RA2. This is X, the commit at which every mutation was observed.
- 7b1b787f  feat: the observed mutation of each test recorded (comments only).
- c08cb809  feat: e2e/selection.mjs with EXPORT-TODAY, and the e2e:selection script line.

## Pin recheck (step 1)
Script over all 105 `path:a-b @ rev sha256` strings in the form on main, recomputed at B. 29 are state/ records, all hash-identical at B. Of the 76 code and document pins: 65 identical, 8 moved, 3 changed.
- Moved, text hash-identical at the new lines: WorkingCanvas.tsx 106-130→107-131, 1186-1195→1210-1219, 1242-1269→1266-1293, 1907-1918→1935-1946, 1989-2021→2030-2062; App.tsx 1969-1978→1975-1984; PublishPanel.tsx 427-429→430-432 and 461→464.
- Changed: WorkingCanvas.tsx 499-539, WorkingCanvas.tsx 1302-1329, App.layout.test.tsx 110-150.
- These are exactly the re-sweep's 8 moved and 3 changed. Amendment 2's re-pinned spans (503-548, 1829-1849, 1326-1356, 130-171 and the rest) are all in the 65 identical. `git diff 6de584fa..B` touches no shell source, e2e, package, SKP-V0.md, engine or kernel file (only forms and records), so there is no changed fact outside Amendment 2: no invalidator. No pin was edited.

## A1 base suites at B, unedited (step 2): no I14
All 14 e2e runs were on a fresh app: exe built from this worktree with CARGO_TARGET_DIR=D:/wt-targets/mm2a, vite on 5400, CDP 9223, each in its own shared hold. Every row ran at B and again at c08cb809 (H3).
- `npm run verify`: rc 0 at B (79 files / 1195 tests; residency-trace 76 passed; citation-integrity 30 passed). Head: rc 0 (84 files / 1213 tests = +18; same 76 and 30).
- node --test (scripts/plan, hooks, evidence): rc 0, 457 pass, 0 fail, at both.
- verify-cites, verify-quotes, verify-test-claims, verify.mjs: rc 0 at both. verify-cites: 1767→1775 files, loose advisories 49→37. verify-quotes: 121 checked, 90 verified, 30 baselined at both. verify-test-claims: 545 claimed tests at both.
- e2e, base rc → head rc. Statuses are mechanically identical, step by step, for every suite below except residency-harness (see below).
  - regression 0 → 0 (18 steps: 17 PASS, NET' INFO)
  - refusal-contract-baseline 0 → 0 (3 PASS)
  - admission 0 → 0 (11 PASS)
  - filter 0 → 0 (3 PASS)
  - filter-panel 0 → 0 (5 PASS)
  - style 0 → 0 (6 PASS)
  - publish 0 → 0 (4 PASS, EXPIRED' SKIP)
  - console 0 → 0 (11 PASS, REGRESS' included)
  - layout 0 → 0 (12 PASS)
  - residency-harness 0 → 0 (see the variance note below)
  - source-changed, default route 0 → 0 (8 PASS)
  - source-changed, post route 0 → 0 (9: 8 PASS, S3 INFO)
  - source-watch-idle 0 → 0 (9 PASS)
  - pan-anchor 0 → 0 (16/16 PASS)
- Residency-harness variance. The first head run differed from the base run in two of its 12 measured steps (the harness claims no verdicts, rc 0 every time): pan-north features 0 → 20 and pan-northeast 710 → 794. I then ran it twice more at head and twice more at B: base 3 of 3 gave 0 and 710, head runs 2 and 3 gave 0 and 710. So the head's first run is one outlier among 6 runs; I cannot attribute it to the code. The custodian may want a solo re-run. Not recorded as a failure (machine rule).
- Governance note: publish.mjs at B wrote its audit records to the real per-user audit log (its default). The head's publish run and all EXPORT-TODAY runs used a scratch SPATIAL_IDE_AUDIT_LOG.
- Exit codes 96-99: none returned. No script of THE MACHINE was used other than hold shared and release.

## e2e waits
None. Before each launch run-suite.sh ran a read-only busy check (ports 9223, 5400, 5180, 1420; vite, `tauri dev` and shell-exe processes). It said FREE every time, and I ran await-free.sh separately at 19:07:47Z and at 19:51:31Z (both FREE). No wait started and none ended; out/waits.log was never created. Slot 2's e2e was never seen on those ports.

## Changes by file (frontends/shell)
- src/workspace/workspaceState.ts (new, 155 lines): ViewId, ResourceKey, ViewState {id, resource, filter, style}, ResourceEntry {admitted, generationEnded, consumers, closed}, WorkspaceState {views, resources, drawOrder, nextViewNumber}. One reducer with resource.admitted, resource.generationEnded, consumer.released, resource.closed and view.transition. Selectors selectDrawnViews, selectAdmitted, selectClosable.
- src/workspace/viewTransitions.ts (new, 76): filter.apply and style.set (outlineWidth carried as {value, unit:"px"}), pure applyViewTransition, and styleTransitions (one transition per changed property).
- src/App.tsx (+169 / -112): useReducer(workspaceReducer). admitted, style and activeFilter are selectors over the view; the same Admitted object is stored, so the [admitted] effect's dependency identity is unchanged. commitActiveFilter writes activeFilterRef and dispatches filter.apply (view id from a ref). handleAdmitted keeps admitAndResetStaleUiState's signature and order, and dispatches resource.admitted through its setAdmitted setter. StylePanel's onChange goes through handleStyleChange, one style.set per changed property. endSession dispatches resource.generationEnded. The two cleanup closeDataset calls became consumer.released. One close effect, declared before the [admitted] effect, closes each closable resource once and dispatches resource.closed. The map slot renders drawOrder, each canvas keyed on its resource handle as before.
- src/App.workspace.test.tsx (new, 249): RA1, RA2 on the harness of App.layout.test.tsx (same mocked boundaries; open/close logged in order; the manager mock resolves as issued).
- src/workspace/workspaceState.test.ts (UA1, UA2, UA3), viewTransitions.test.ts (UA4), openDatasetBoundary.test.ts (UA5), workspaceBoundary.test.ts (UA6) (new).
- e2e/selection.mjs (new, 77): EXPORT-TODAY only. package.json: the `e2e:selection` line.
- Nothing else, and none of the CRS piece's files.

## Tests and mutations
Each mutation was applied to the tree of X = deab7dc96d06bf3e329527d3ae95415dcd65152b, the named test run, the failure read, and the mutation reverted (`git status --porcelain` empty after each). No verify-mutation run was used. The failure text is recorded in each test's comment.
- UA1: in `admit`, always take the mint branch. Failed "one view across three admissions...": "the view count after the reopen: expected [ 'view-1', 'view-2' ] to deeply equal [ 'view-1' ]". (It also failed UA2's first test as a side effect.)
- UA2: drop `!entry.closed` in selectClosable. Failed "a live resource is never closable...": "closes after two drains: expected [ 'ds_a', 'ds_a' ] to deeply equal [ 'ds_a' ]".
- UA3: selectAdmitted reads drawOrder[0]. Failed "each view resolves to its own resource...": "expected { dataset: 'ds_b', …(2) } to be { dataset: 'ds_a', …(2) }".
- UA4: collapse styleTransitions to the first transition. Failed "emits one style.set per changed property...": "expected [ 'fillColor' ] to deeply equal [ 'fillColor', 'fillOpacity', …(2) ]", and the round-trip test.
- UA5: add an openDataset import to App.tsx. Failed "openDataset has one importer": "expected [ 'App.tsx', …(1) ] to deeply equal [ 'admission/admitDataset.ts' ]".
- UA6: add `import { unionBbox } from "../canvas/extent"` to workspaceState.ts. Failed "no workspace source file has a forbidden import": received [ "workspace/workspaceState.ts imports ../canvas/extent" ].
- RA1: drop the consumers.length === 0 check in selectClosable. Failed: "after the first admission: expected [ …(2) ] to deeply equal [ Array(1) ]" (the live handle was closed at once).
- RA2: keep the filter on rebind (`filter: view.filter`). Failed "RA2: a reopen resets the filter and keeps the style": "the filter is reset: expected <p class="filter-active"></p> to be null".
- EXPORT-TODAY has no mutation (an observation).

## EXPORT-TODAY (A7): H4 holds
Recorded and not asserted. Run at B (dev worktree on B, 19:54Z) and at the head (twice, 19:52Z and 19:53Z); the three records are the same. A whole-file export of 100k-happy-path.parquet was started through the real dialog (dev destination seam, phrase typed, Submit clicked), then filter-zoned.parquet was opened at once.
- During the export, the panel read "Publishing… Cancel publish", with Cancel shown.
- The open was called at 19:53:02.132Z and returned at 19:53:02.232Z (head run 2). Right after it, one panel remained, reading "▸ Export" (the new dataset's, collapsed). The executing line and Cancel were gone. No page line mentioned the export, and nothing changed 15 s later.
- The host export ran on. Audit records for that attempt: intent 19:53:02Z and outcome success 19:53:06Z. The bundle directory exists.
- So: the host's export runs on, the old panel with its progress, Cancel and outcome leaves the screen, and nothing says so. That is H4's predicted outcome, so B3 is built in phase B (subject to the human's word on A10). The class 1 amendment is the custodian's/architect's: I did not edit the form, PLAN or state/. The logs are in the scratchpad's mm2a/out/ (export-today-base.log, export-today-head-1.log, export-today-head-2.log).

## §7 count for phase A (the form's own numstat command against B, three-dot)
- A-P: workspaceState.ts 155 (ceiling 260), viewTransitions.ts 76 (120), App.tsx 281 (220). The group is 512 against 600.
- A-T: UA files 139+57+68+67 = 331 (450); App.workspace.test.tsx 249 (350). The group is 580 against 800.
- G-E phase A: selection.mjs 77 (≤ 100). package.json: 1 line (listed under B-X, ≤ 2).
- Total 1,058 insertions + 112 deletions = 1,170 (git diff -w gives App.tsx 101/44).

## Not done as written
1. App.tsx exceeds its per-file ceiling: 281 against 220 (class 8, §7 not edited). Cause: wrapping the WorkingCanvas JSX in `drawnViews.map` re-indented about 136 lines; ignoring whitespace it is 145. The A-P group total, 512, is within 600.
2. UA4 asserts the union is exactly the two phase-A names (filter.apply, style.set), not all of §2.4's names. The others (tool.set, mode.set, selection.*, inspect.*) have no view state or product caller in phase A (§8 item 19), so they land in phase B.
3. UA3: the form's mutation names `resolveScope`, which is phase B's. In phase A the test covers selectAdmitted and by-id transitions; the mutation is on selectAdmitted. The resolveScope clause is for phase B.
4. The state carries one field beyond the listed three, `nextViewNumber`, so that minting `view-<n>` stays pure under StrictMode.
5. The selection-ending reader of `generationEnded` is phase B's. It is written by App (App.tsx:1185) with no phase A reader, under the form's naming of that consumer (the second exemption). No test drives that dispatch through App (UA2 covers the reducer action).
6. Unmount behaviour: the cleanup now only dispatches consumer.released, and the close effect does not run after unmount, so unmounting App no longer calls closeDataset. In the product App never unmounts before process exit, and no test depended on it. The sequence on a reopen is unchanged: stop the old session, then close the old handle, then start the new one (RA1 asserts open-B before close-A).
7. `package.json`'s script line landed in phase A (the form lists it under B-X). e2e/README.md and the walkthrough were not touched.
8. `viewIdRef.current` is assigned during render (the repo's ref-mirrors-state pattern).
9. The dev copy of the shell used for development was a temporary detached worktree at B (D:/wt/mm2a-dev). It also ran the base EXPORT-TODAY and the base harness repeats, and has been removed.

## Pre-gate self-check (the four classes)
- Cross-module interfaces: closeDataset(dataset: string) read at skp/client.ts:130 and Admitted at admission/admitDataset.ts:11-17; the dev seam publishPrepareWithDestination/publishExecute at PublishPanel.tsx:485-491. All code is under frontends/shell, no wire/kernel/engine/protocol change.
- Caller grep (non-test files): selectDrawnViews, selectAdmitted, selectClosable, workspaceReducer, initialWorkspaceState and styleTransitions are called from App.tsx; applyViewTransition is called from workspaceReducer. A real-App test (RA1/RA2) covers the path.
- Completion claims point to evidence that exists. No user-facing string was added. Every required test reaches its assertion: each mutation fails the named test at its intended assertion, not at setup.

## State left
`git status --porcelain` in C:/dev/wt/mm2a is empty. HEAD c08cb809 equals origin/cut/shell-migration-milestone-2-phase-a. No app, vite or hold of mine is running; the last busy check said FREE and app-down reported ports 9223 and 5400 free. D:/wt-targets/mm2a (about the size of a debug build) and the exe D:/wt-targets/mm2a/exes/spatial-ide-shell-mm2a.exe remain for the custodian to sweep. My run logs and scripts are in the scratchpad's mm2a/ folder.
