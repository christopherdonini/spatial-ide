Reviewed: PR #336 at 9a4c58332661b6fd69fb477b1184f0147f38df2b (the custodian's filing note, 2026-11-19: the reviewer, PR 336's one gate under its five-line form (ADV-2026-11-16-06 item 2 (b)), attempt 1; Bash 30, Read 3, none errored, model claude-opus-5-5, from 2026-11-19T07:56:50Z to 08:06:55Z by its transcript; ruled by ADV-2026-11-19-13; the report below byte for byte from its hand-back of 23513 bytes, sha256 dace18d23028f2975e99784daf3b04dc2239d75c9f5eee1ecc4ff19797b8eb13, nothing masked, with this note in its first line and one final newline), gate, reviewer
Gate: PR #336, selection-export-unknown-attempt, reviewer, at 9a4c58332661b6fd69fb477b1184f0147f38df2b
Reviewed: cut/selection-export-unknown-attempt @ 9a4c58332661b6fd69fb477b1184f0147f38df2b
Verdict: FAIL
The verdict fails on Evidence only. The form's mutation rests on "no file on the export's path changed between 619a7cc9 and the merge base", and `frontends/shell/src/App.tsx` did change, so the suite has to be run once at B. The code is otherwise correct: a person cannot reach the window. Three documentation and wording items are must-fix before the merge.

Brief: `<S>/brief-g336r.md`, sha256 `e174b1bde6b16dc06a88ddd78a943a80b98bee349389d824afac8c980d6e41d0`.

## Check 1: Start
```
fetch rc=0
9a4c58332661b6fd69fb477b1184f0147f38df2b
porc rc=0
0 <S>/g336r-porc1.txt
9a4c58332661b6fd69fb477b1184f0147f38df2b	refs/heads/cut/selection-export-unknown-attempt
f5584f280a2ccc81467c19cab9658fd1189e353b
18ce1d7dd3dbc94197fb3962d816874b3ed0f335
9a4c5833 test: the selection suite's export steps wait for the dialog before the execute (selection-export-unknown-attempt step 2)
```
- HEAD is H and the porcelain is 0 bytes.
- The remote ref is H.
- The merge base with origin/main (18ce1d7d) is B.
- There is one commit since B.

Read first, at origin/main:
- The form `governance/forms/frontends/SELECTION-EXPORT-UNKNOWN-ATTEMPT-PREREGISTRATION.md`, whole: `12b1d8008649652441cfeaa84628e8152bd19e6b7f9de6d39a7993dc0963a0c9 *-`.
- ADV-2026-11-18-05 and ADV-2026-11-19-03, each whole.
- The four evidence reports, each whole.

## Check 2: The diff
```
1	1	frontends/shell/e2e/README.md
14	1	frontends/shell/e2e/selection.mjs
frontends/shell/e2e/README.md
frontends/shell/e2e/selection.mjs
```
- I read the diff whole.
- Scope holds: 2 files, 15 added and 2 removed, against a budget of ≤40 and ≤10.
- Out-of-scope holds: nothing under `src` or `src-tauri`, no other e2e script, and in the README only the selection entry's "Asserted" line (README.md:756 at 9a4c5833).

Main's drift on the two files:
```
rc=0
0 <S>/g336r-maindiff.txt
```
Empty: main did not change either file since B.

## Check 3: Step 1's answers against the code at H

**(a) Which place answered.**
- The page's answer is `frontends/shell/src/publish/PublishPanel.tsx:546-550 at 9a4c5833`. `runExecute` returns `{ status: "unknown-attempt" }` when `attemptIdRef.current === null`.
- The ref is written only by the passive effect at PublishPanel.tsx:534-536 at 9a4c5833.
- The prepare calls `setState` (PublishPanel.tsx:479 at 9a4c5833) and then resolves (480) before that effect runs.
- A grep of `src` and `src-tauri/src` finds only two other places that answer it, both host-side:
  - `src-tauri/src/commands.rs:506 at 9a4c5833`, the `run_exclusive` `None` arm. It is reached only when the id is already running (`publish.rs:1242 at 9a4c5833`).
  - `src-tauri/src/publish.rs:787-788 at 9a4c5833`, a `take` miss: absent, taken, or past the TTL (235-242).
- The id is inserted before the prompt returns (`publish.rs:705` to `724 at 9a4c5833`).
- `client.ts` and `settleExecuteOutcome` (`PublishDialog.tsx:115-121 at 9a4c5833`) answer nothing of that kind. A rejection becomes `refused`.
- The code leaves no other place. Step 1's elimination holds, on the evidence it names (U ≤ 14160 ms against a TTL of 600000 ms, no intent row, and one process per run).

**(b) Can a person reach the execute in that window? No.**
- The dialog mounts from `state`, not from the ref (PublishPanel.tsx:739-748 at 9a4c5833). Its `attemptId={state.attemptId}` is set in every `"dialog"` state (PublishPanel.tsx:265 at 9a4c5833).
- Submit goes `handleSubmit` → `submitPublishAttempt(attemptId, …)` → `deps.execute(attemptId, typedPhrase)` (PublishDialog.tsx:209 and 94-100 at 9a4c5833). `attemptId` is the prop (PublishDialog.tsx:182 at 9a4c5833).
- `execute` is `executeInStagedScope` (PublishPanel.tsx:612 and 513-523 at 9a4c5833). It takes the id as an argument and never reads the ref.
- The ref is read only at PublishPanel.tsx:547. A grep of `attemptIdRef` shows only 533, 535 and 547, plus comments.
- `runExecute` is reached only through the hook at 578, which is registered under `if (!import.meta.env.DEV) return;` (571).
- Submit is disabled on an empty phrase (PublishDialog.tsx:307 at 9a4c5833), and `handleSubmit` guards the same condition.
- The dialog cannot be on screen without an attempt id, and a person's confirm never reads the ref. This is the form's first outcome. It is not a product defect, and nothing goes to the advisor under item 2 (d).

**(e) The runtime version.** I checked it myself and did not take it from the report. Pattern self-test, then the scan over the 12 files step 1 names:
```
positive test:
1
scan:
0 m4b-e2e-hc-selection-at-6f7e744c.app.err.log
0 m4b-e2e-hc-selection-at-6f7e744c.app.out.log
0 m4b-e2e-hc-selection-at-6f7e744c.log
0 m4b-e2e-hc-selection-at-6f7e744c.vite.err.log
0 m4b-e2e-hs-selection.app.err.log
0 m4b-e2e-hs-selection.app.out.log
0 m4b-e2e-hs-selection.log
0 m4b-e2e-hs-selection.vite.err.log
0 s327d-harvest-hc-selection-at-6f7e744c.txt
0 s327d-hc-selection-at-6f7e744c.session.log
0 s327t-harvest-hs-selection.txt
0 s327t-hs-selection.session.log
```
- Pattern: `grep -icE 'webview2|msedge|Edg/|Chrome/|user-agent|useragent|[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+'`.
- No log of either run names a version.

## Check 4: The change

**The doc comment (`frontends/shell/e2e/selection.mjs:565-569 at 9a4c5833`), sentence by sentence:**
- "Waits for the dialog the prepare opens, and for the publishExecute hook, before an execute is sent": true (571-572; called at 575 and 633).
  - "as publish.mjs does" is **untrue**. `publish.mjs:371 at 9a4c5833` waits for the hook alone (`waitForHook`, 165-175).
  - The hook is registered dataset-scoped (PublishPanel.tsx:570-585), so it exists before the prepare.
  - Waiting for the dialog's DOM and then the hook is what `colour.mjs:256` and `261 at 9a4c5833` do. See finding 2.
- "The hook answers unknown-attempt while PublishPanel's attemptIdRef is not yet set, which happens only after the render that mounts the dialog": true (546-550, 534-536).
- "a person's confirm passes PublishDialog's own attemptId prop and never reads that ref, so the wait hides nothing a person can meet": true (check 3 (b)).
- Line 564's old `/** Executes the prepared attempt … */` is now detached from `executeExport` (574). See finding 4.

**The README line (README.md:756 at 9a4c5833, the two sentences appended):**
- "The export steps wait for the dialog (and the `publishExecute` hook) before each execute": true. Both sends, selection.mjs:576 and 636, are behind the wait, and there is no other `publishExecute` call in the file.
  - "as `publish.mjs` does" is untrue, as above.
- "a person's confirm passes `PublishDialog`'s own attempt id prop, and only the dev hook reads the panel's `attemptIdRef`": true.
- "which is set a render after the dialog mounts" is **inaccurate**. The ref is set by the passive effect of the same commit that mounts the dialog (534-536 with 739-748). No later render is involved. See finding 3.

**The worker's residual. Yes, a window remains. It is narrow, and the suite can meet it in principle.**
- The installed React is 18.3.1, scheduler 0.23.2 (`node_modules/react-dom/package.json`).
- The prepare's `setState` runs after an await, not in a discrete event, so it lands on a non-sync lane.
- On a non-sync lane, React schedules `flushPassiveEffects` as a NormalPriority scheduler callback (`react-dom.development.js:26807`, `27038`). It flushes synchronously only for `SyncLane` (26973).
- The scheduler runs that callback in the same macrotask only while under `frameInterval` = 5 ms (`scheduler.development.js:28`, `482`, `485-495`). Otherwise it yields to a later MessageChannel task (566-569).
- So when the render and commit of the dialog state take 5 ms or more, there is a task boundary with `.publish-dialog` in the DOM and the ref still null. The diagnosis names App's `consumer.released` re-render in that window.
- Within it:
  - `pollUntil`'s first read (selection.mjs:132-141 at 9a4c5833, no sleep before the first read) can return true.
  - The execute's evaluate (576 or 636) then reaches `runExecute` with the ref null, but only if the main thread services it before the already-queued effect task.
- When it happens, the step reads FAIL with unknown-attempt (`exportElapsed.mjs` verdict). It is never a false pass, and it is invisible to a person.
- The case needs timing inside one CDP request round trip. Under the wording-blocks rule it does not block. It is named here so that the source comment records it (finding 2's words do).

Smallest change: nothing in the suite alone closes it by construction, because the ref is observable only through the hook.
- Inside this form's scope, the narrowing step is one more page-side yield after the poll succeeds in `waitForExportDialog`, for example `await page.evaluate(() => new Promise((r) => setTimeout(r, 0)));`. The effect task was queued at the commit, before that yield.
- The change that closes it by construction is in the product file, outside this form: set the ref in `useLayoutEffect` at PublishPanel.tsx:534. Layout effects run inside the commit that mounts the dialog. Only the dev hook reads the ref, so a person would see no difference.
- I made neither change.

**`startExportThenOpen` now waits too (selection.mjs:633 at 9a4c5833).**
- The wait sits before the send (634-639). It changes nothing that E-ASK (658-681), E-ASK-STATEMENT (684-697) or E-ASK-TWO (733-753) assert. The ask, the outcome, the statement, the manifests and the INCONCLUSIVE branch at 641 are all as before.
- It adds one precondition that can fail by name: line 572's `expect` when no dialog shows within 20 s.
- The reported `prepare-to-execute` figures now include the wait: 3-5 ms in the series against 0 ms before. They are reported, not asserted.

**`node --check`:**
```
rc=0
0 <S>/g336r-nodecheck.txt
```

## Check 5: The mutation
I count these files as the export's path, and why:
- **The suite side the mutation runs:** `e2e/selection.mjs`, `e2e/lib.mjs`, `e2e/exportElapsed.mjs`.
- **The page path the hook drives:** `src/publish` (Panel, Dialog, client, types), `src/e2e-test-surface.ts`, `src/feature/OpenDuringExportAsk.tsx`.
- **App and boot:** `src/App.tsx`, because it mounts PublishPanel, carries `onExportRunning`, and re-renders on `consumer.released` inside the race window. Also `src/bootstrap.tsx`.
- **Host:** `src-tauri/src/publish.rs`, `commands.rs`, `lib.rs`.
- **The kernel's permission:** `kernel/src/permission`.
- **The bundle:** `renderer/bundle-viewer`.
- **What sets the React version and the dev server:** `package.json`, `package-lock.json`, `vite.config.ts`.

```
anc rc=0
rc=0
57 <S>/g336r-mutpath.txt
frontends/shell/package.json
frontends/shell/src/App.tsx
```
Two files changed:
- `package.json`: one added script line, `"e2e:colour": "node e2e/colour.mjs",`. No dependency changed, so it is not on the path in effect.
- `src/App.tsx`: +53 −22, from PR B's colour work (`572bb917`, `09bba48e`, `2f704773`, `8a048a6c` among the log).
  - Its hunks do not touch `handleExportRunning` (App.tsx:1193-1236 at 619a7cc9, 1211-1254 at f5584f28) or the `<PublishPanel>` mount (2516-2526 at 619a7cc9, 2547-2557 at f5584f28).
  - They add render work to App. One is a `useMemo` (`colourColumns`, App.tsx:855-859 at f5584f28). Another is a passive effect on `colourColumn` (App.tsx:2054-2065 at f5584f28).
  - The window is a timing race whose width the parent's render cost sets, so this change cannot be ruled out.
- The form's first branch fails, and its second branch applies: the worker runs the suite once at B and records the failure. See finding 1.

## Check 6: The runs (reused, none run)
```
f62fb9feae7279a678b72dd8e7ed88b6820cc982b600627ef83d05cc074608d7 *D:/wt-targets/sel/exes/spatial-ide-shell-sel.exe
91553792
```
I left out the exe's file time, which prints in local time. The size and sha256 match the tester's report.

The log: 83 lines. First line:
```
worktree C:/dev/wt/sel head 9a4c58332661b6fd69fb477b1184f0147f38df2b start 2026-11-19T07:24:04Z
```

Step lines, each cut at 260 characters:
```
8:[E-SCENE] PASS (16710ms): camera at zoom-in notch 1; features 836, 333
9:[E-CLICK] PASS (512ms): Navigate click inspected id 836, equal to the oracle; selection 0
10:[E-CLICK-FAST] PASS (896ms): a click at 333 (pressed at B with no move to B first) inspected 333; the hover readout stood on 836 through the click
11:[E-SELECT] PASS (691ms): Selected 1; alpha-255 pixels 129 -> 206
12:[E-NODRAG] PASS (1350ms): out-and-back drag kept Selected 1; 1 pan(s) moved the box (outside 1); Selected 1
13:[E-ZOOMSEL] PASS (2061ms): outside 1 -> 0; alpha-255 pixels 129 -> 3968 (floor 1002)
14:[E-SEL-PAN] PASS (1126ms): Selected 1 after the pan away and after the pan back
22:[E-SEL-FILTER] PASS (22091ms): Selected 6; hidden 4 under the filter and 0 after Clear
24:[E-REFUSED] PASS (9391ms): refused click at CSS (624, 374): the named state shown, Selected 6 -> 6
27:[E-GEN] PASS (14724ms): reopen: 6 dropped, a dataset was opened; source change: 1 dropped, the source file changed
62:[E-KINDS] PASS (60377ms): multipolygon: 3 id(s) over 7 pixels; two pixels of id 0 gave Selected 1; point: 3 clicks, 3 ids; line: 3 clicks, 3 ids
65:[E-EXPORT] PASS (14742ms): row scope "row scope: the whole file — every row the dataset contains" and 2000 rows with a selection and without; prepare-to-execute 5ms 5ms
66:[E-SCOPE] PASS (2639ms): execute refused after the filter changed; no bundle directory, no staging debris; prepare-to-execute 262ms
67:[E-ASK] PASS (112906ms): the ask showed; Keep exporting left the 100k layer and the export ended success; Cancel and go on admitted filter-zoned, the old close_dataset row followed the outcome (refused); prepare-to-execute 3ms 4ms
68:[E-ASK-STATEMENT] PASS (109355ms): the statement named C:\dev\wt\sel\target\e2e-selection-out\ask-1795073317070\bundle, whose manifest.json exists; filter-zoned was admitted; prepare-to-execute 5ms
69:[E-ASK-TWO] PASS (245553ms): two statements, C:\dev\wt\sel\target\e2e-selection-out\ask-1795073426580\bundle then C:\dev\wt\sel\target\e2e-selection-out\ask-two-1795073571033\bundle, both manifests on disk; filter-zoned was admitted; prepare-to-execute 4ms 
76:[E-STATUS-HEIGHT] PASS (41129ms): the canvas stayed 388 x 712 (A, B, C) and the bar 48 px; recorded, not asserted: A's canvas height 712; in B the bar's scrollHeight 47 against its clientHeight 47; the residency item present in B: false; inner size after th
80:[E-DBLCLICK] PASS (16575ms): a double-click zoomed (-0.8155298414577508 -> 1.1844701585422492), inspected nothing in Navigate and selected nothing in Select; a single click inspected id 836
82:[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.
```

Last two lines:
```
[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.
rc=0 end 2026-11-19T07:35:26Z
```

Other reads of the log:
- Line 81 begins `[selection] 18 PASS, 0 FAIL: E-SCENE=PASS …` (cut).
- `grep -c "PASS ("` gives 18.
- `grep -c "unknown-attempt"` gives 0.
- Line 4 is `[selection] PENDING_ATTEMPT_TTL 600000ms, read from src-tauri/src/publish.rs`.

The build log's tail matches the report: `shell build rc=0`, `exe build rc=0`, the four Compiling lines, ``Finished `dev` profile [unoptimized + debuginfo] target(s) in 18m 05s``, `copied exe`.

Everything matches the tester's report: the head line, the 18 step results and milliseconds, the prepare-to-execute figures, the tally, the SKIP, rc and end time, and the exe's size and hash. I doubt no run. The run is one pass and does not prove the residual window closed (check 4). Finding 2 only records that; no rerun is asked.

## Check 7: CI
Read at `Thu Nov 19 08:03:58 UTC 2026`.
```
rc=0
every commit is signed off	pass	11s	https://github.com/<owner>/spatial-ide/actions/runs/44482098412/job/135416537243	
no profile path in the range	pass	29s	https://github.com/<owner>/spatial-ide/actions/runs/44482098410/job/135416535845	
ported-notices	pass	8s	https://github.com/<owner>/spatial-ide/actions/runs/44431693515/job/135250361880	
ported-notices	pass	8s	https://github.com/<owner>/spatial-ide/actions/runs/44482098405/job/135416537797	
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m25s	https://github.com/<owner>/spatial-ide/actions/runs/44431693498/job/135250362426	
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m38s	https://github.com/<owner>/spatial-ide/actions/runs/44482098557/job/135416537468	
typecheck · build · vitest · cargo test	pass	4m32s	https://github.com/<owner>/spatial-ide/actions/runs/44431693498/job/135250362055	
typecheck · build · vitest · cargo test	pass	3m54s	https://github.com/<owner>/spatial-ide/actions/runs/44482098557/job/135416536909	
9a4c58332661b6fd69fb477b1184f0147f38df2b draft=true OPEN main
```
I wrote the repository owner as `<owner>`. Every run on the branch (`gh run list --branch`):
```
rc=0
44482098412 9a4c58332661 pull_request completed success DCO sign-off 2026-11-19T07:45:42Z
44482098405 9a4c58332661 pull_request completed success Ported notices 2026-11-19T07:45:42Z
44482098410 9a4c58332661 pull_request completed success Exposure scan 2026-11-19T07:45:42Z
44482098557 9a4c58332661 pull_request completed success Product CI — shell 2026-11-19T07:45:42Z
44431693498 9a4c58332661 push completed success Product CI — shell 2026-11-19T00:46:24Z
44431693515 9a4c58332661 push completed success Ported notices 2026-11-19T00:46:24Z
```
There are no red or cancelled runs on any commit.

## Check 8: End
```
9a4c58332661b6fd69fb477b1184f0147f38df2b
rc=0
0 <S>/g336r-porc2.txt
```
HEAD is H and the porcelain is empty.

## Findings

### Correctness
None. A person cannot reach the window (check 3 (b)), and the change does what it says, apart from the words in findings 2 and 3.

### Evidence
**1. Blocking (Evidence): the mutation is not yet proven at B.**
- The form's Tests+mutation line takes the run at 619a7cc9 as the failure at B only if no file on the export's path changed. `frontends/shell/src/App.tsx` changed (+53 −22), as check 5 shows with its lines.
- The window is a scheduling race whose width depends on the parent's render cost. H1 passed on 2026-11-16 and failed on 2026-11-18 on one exe.
- Remedy, the form's own other branch: the worker runs the selection suite once at B (without the wait) and records the result.
- If that one run passes, the record says so, and the mutation stands on the run at 619a7cc9 only. The custodian takes that reading to the advisor; the gate does not decide it.

### Documentation (must-fix before the merge; not the human's wording; the worker applies the words with no re-gate, and the PR body lists them)
**2. Wording: "as publish.mjs does" in the doc comment and the README line is untrue, and the residual window is not recorded.**
- `publish.mjs:371 at 9a4c5833` waits for the hook alone.
- Waiting for the dialog's DOM and then the hook is `colour.mjs:256, 261 at 9a4c5833`.

Replacement for `selection.mjs:565-569 at 9a4c5833`:
```
/**
 * Waits for the dialog the prepare opens, and for the publishExecute hook, before an execute is sent, as colour.mjs does; publish.mjs waits for the hook alone (SELECTION-EXPORT-UNKNOWN-ATTEMPT-PREREGISTRATION.md, step 2).
 * The hook answers unknown-attempt while PublishPanel's attemptIdRef is not yet set. A passive effect sets it after the commit that mounts the dialog, so the dialog can be in the DOM a moment before the ref is set: this wait narrows that window and does not close it (a case inside one CDP round trip, the gate's check 4).
 * A person's confirm passes PublishDialog's own attemptId prop and never reads that ref, so the wait hides nothing a person can meet.
 */
```
Clause checks:
- "for the dialog … and for the publishExecute hook": selection.mjs:571.
- "as colour.mjs does": colour.mjs:256 (dialog DOM), 261 (hook).
- "publish.mjs waits for the hook alone": publish.mjs:371, 165-175.
- "answers unknown-attempt while … not yet set": PublishPanel.tsx:546-550.
- "A passive effect sets it after the commit that mounts the dialog": PublishPanel.tsx:534-536, 739-748, and react-dom.development.js:26807/27038 with 26973.
- "narrows … does not close": check 4.
- "passes PublishDialog's own attemptId prop": PublishDialog.tsx:182, 209, 94-100.
- "never reads that ref": the grep in check 3 (b).

**3. Wording: the README line says the ref "is set a render after the dialog mounts".**
- No second render is involved: the effect of the mounting commit sets the ref.
- The line also carries finding 2's "as `publish.mjs` does".

Replacement for the two sentences appended to README.md:756 at 9a4c5833:
"The export steps wait for the dialog and the `publishExecute` hook before each execute, as `colour.mjs` does (`publish.mjs` waits for the hook alone). The wait hides nothing a person can meet: a person's confirm passes `PublishDialog`'s own attempt id prop, and only the dev hook reads the panel's `attemptIdRef`. An effect sets that ref after the commit that mounts the dialog, so the wait narrows the moment in which the hook can still answer `unknown-attempt`; it does not close it."

Clause checks:
- "before each execute": selection.mjs:575, 633 guard the only sends, 576 and 636.
- The other clauses are checked as in finding 2.

Both replacements keep the diff inside the form's budget (two files, about 3 lines added).

**4. Documentation: an orphaned doc comment.**
- `selection.mjs:564 at 9a4c5833` (`/** Executes the prepared attempt … */`) now sits above `waitForExportDialog`'s comment, not above `executeExport` (574).
- Move it to directly above line 574.

**5. Documentation (the record, not this diff): a wrong line cite in step 1's filed report.**
- Its line 39 cites `client.ts:23` for `const entry = recordNamed("binding-command", "binding_publish_execute");`.
- At 9a4c5833 that line is `frontends/shell/src/publish/client.ts:62`. Line 23 is a doc-comment line.
- The report is append-only. The closing amendment, if it carries step 1's answers, cites `client.ts:62 at 9a4c5833` and does not reuse 23.

**6. Note, no action on this PR.**
- ADV-2026-11-18-05 item 2 (c) and the form's Change line say "as the publish suite does". The publish suite's wait is the hook alone.
- The selection wait is stricter, which step 1 (b) called for.
- This is recorded for the custodian only. It is the advisor's wording, and this gate does not reword it.

## Runs reused
- One run: the tester's series `sel-head` at 9a4c58332661b6fd69fb477b1184f0147f38df2b, 2026-11-19 from 07:24:04Z to 07:35:26Z.
- Environment: worktree `C:/dev/wt/sel`; debug exe `D:/wt-targets/sel/exes/spatial-ide-shell-sel.exe` (sha256 f62fb9fe…08d7, 91553792 bytes); port-5400 harness with vite and CDP 9223 on WebView2; Windows 10 Pro 22H2.
- Result: rc 0, 18 PASS, 0 FAIL, 1 SKIP.
- Also read, as filed evidence and not reproduced: the diagnosis runs at 619a7cc9 (A) and d1d3a29f (N) from the 2026-11-18 tester-high report, and the two runs at 6f7e744c (for (e) only).
- Reproduced: none. I ran no app, no suite and no build.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.
