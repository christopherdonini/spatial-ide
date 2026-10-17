*Custodian's filing note (2026-10-17): the worker-high's report for `publish-approval-unknown-attempt-under-load`'s first step, in C:/dev/wt/ua1 from main be6aa620; the head 80890488b58032ddcd66fd9288c9bd219de51ca4, pushed. The custodian checked by script: the diff from the base touches the six files of the form's Scope less the README, 148 changed lines; nothing under frontends/shell/src, frontends/shell/src-tauri, protocol, engine or kernel. The run 2026-10-17T18:26:22Z to 2026-10-17T18:37:47Z by its transcript (Read 8, Bash 35, Write 7, Edit 17); every Write or Edit call in the worktree or the worker's own scratch files; its one SubagentHandback call, at 18:37:47Z. Extracted by script; 20 path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; one final newline added; nothing else changed. The message's sha256 as handed back is 24f60d68642fdcd54fd785d3c88bfc25ba3d833d8e6491675e36b9661a5a5824; this file's, from line 5 to the end, is 89c29dc2b4c7742bead76f456827227faca7a65d44927842ffc3e6a0348cd86c.*

---

Step 1 is built and pushed. Head 80890488b58032ddcd66fd9288c9bd219de51ca4 on cut/unknown-attempt-step-1, which is ahead of be6aa6203a, published as an ordinary update (rc 0). Final porcelain is empty.

I started from the base be6aa6203a with a clean porcelain after `git fetch origin`. Nothing was touched under frontends/shell/src/ or frontends/shell/src-tauri/, and PENDING_ATTEMPT_TTL is unchanged. I did not touch e2e/README.md and did not launch the app.

**Commits**
- dcaed6edf21fe96776ee5dab1b938cf675972df2 is the code commit: the helper, the test, the call sites, package.json and the CI comment.
- 80890488b58032ddcd66fd9288c9bd219de51ca4 adds one comment line to exportElapsed.test.mjs: the RECORDED MUTATION record, with dcaed6ed as the commit id.

**Files and size (git diff --numstat base..head, the form not in the diff)**

| File | Insertions | Deletions |
|---|---|---|
| .github/workflows/product-ci-shell.yml | 2 | 2 |
| frontends/shell/e2e/exportElapsed.mjs (new) | 54 | 0 |
| frontends/shell/e2e/exportElapsed.test.mjs (new) | 35 | 0 |
| frontends/shell/e2e/publish.mjs | 17 | 13 |
| frontends/shell/e2e/selection.mjs | 13 | 9 |
| frontends/shell/package.json | 2 | 1 |

§7 total is 148, against the 150 budget. My first draft was 156, so I trimmed comments in the helper and the test.

**Design**
- Helper API: `initTtl`, `readTtlMs`, `verdict`, `beginStep`, `elapsedTail`, `pairEvaluate(page, role, fn, arg)` with roles prepare, send and execute, `pairRead` and `ExportInconclusive`.
- The call sites change one line each. `page.evaluate(` becomes `pairEvaluate(page, "<role>", ` at the 6 sites in publish.mjs, at `prepareExport` and `executeExport` in selection.mjs, and at the in-page execute start in `startExportThenOpen` (role send).
- The TTL is read from the checkout's publish.rs by `initTtl()`, which each suite calls and prints. If the line cannot be read, the suite stops as a harness failure.
- The suites print INCONCLUSIVE as a third status and exit 3 when no step FAILs. The selection summary line gains `, N INCONCLUSIVE` only when N is above 0.
- The `verdict` function is pure, and `pairRead` calls it with L and U from the stamps.
- In `startExportThenOpen`, when the export had already ended, the outcome is read and checked first. The class-2 INCONCLUSIVE throw follows and keeps its FAIL line.

**Tests (`npm run test:export-elapsed`, rc 0, 5 pass, 0 fail)**
- T1: the TTL read from the real publish.rs is 120000 ms. Pass.
- T2: two cases, "T2 the E-EXPORT run line (U its printed duration) reads FAIL" and "T2 the E-ASK-TWO run line (U its printed duration) reads FAIL". Both pass.
  - The two lines are byte-copied by my script from e54e4af2, each sha256 checked against the form's pin before use (both matched).
  - Each line is cited with its pin in the test.
  - `verify-quotes --show-cites` shows [hash: PASS] for both.
- T3: U = T + 1 reads INCONCLUSIVE and U = T reads FAIL. Pass.
- T4: a success outcome and a refused outcome, each with U = 10 T, give no verdict. Pass.
- The helper's pair-clock logic (L and U from the stamps) is not covered by T1 to T4. I exercised it in scratch with a stubbed clock and a fake page, and all five cases behaved as expected. No such test is committed. The custodian's R1 to R3 e2e runs are what cover it.

**M1**
- I applied it alone at dcaed6ed: `if (u > t)` became `if (true)`. The run exited rc 1.
- It failed, by name: "T2 the E-EXPORT run line (U its printed duration) reads FAIL". It also failed the E-ASK-TWO T2 case and T3. T1 and T4 passed.
- I reverted it with `git checkout` of the file and the porcelain was empty. The `RECORDED MUTATION:` comment with dcaed6ed is in 80890488.

**The eleven pairs (F6)**
In each pair, p0 and p1 are stamped around the prepare's `page.evaluate` inside `pairEvaluate` (exportElapsed.mjs). e0 is stamped before the execute's `page.evaluate` (or the send), and e1 is stamped in `pairRead` when the outcome is in hand. Line numbers are at head 80890488.

1. APPROVED': prepare at line 283 of publish.mjs (on the branch), execute at line 355 of publish.mjs (on the branch).
2. REFUSED': prepare at line 410 of publish.mjs (on the branch), execute at line 421 of publish.mjs (on the branch).
3. FILTERED': prepare at line 475 of publish.mjs (on the branch), execute at line 493 of publish.mjs (on the branch).
4. E-EXPORT, Selected 1: `prepareExport` call at line 581 of selection.mjs (on the branch) (stamps at line 561 of selection.mjs (on the branch)), `executeExport` call at line 583 of selection.mjs (on the branch) (stamps at line 565 of selection.mjs (on the branch)).
5. E-EXPORT, Selected 0: the same calls at line 581 of selection.mjs (on the branch) and line 583 of selection.mjs (on the branch), second loop iteration.
6. E-SCOPE: prepare call at line 598 of selection.mjs (on the branch), execute call at line 603 of selection.mjs (on the branch).
7. E-ASK keep, 8. E-ASK cancel, 9. E-ASK-STATEMENT, 10. E-ASK-TWO first. All four go through `startExportThenOpen`.
   - The prepare call is at line 619 of selection.mjs (on the branch), with stamps at line 561 of selection.mjs (on the branch).
   - e0 is stamped at the send, line 621 of selection.mjs (on the branch).
   - e1 is stamped only on the already-ended path, `pairRead` at line 628 of selection.mjs (on the branch).
   - The late reads in the ask steps are unchecked, per §1.6.
11. E-ASK-TWO second: prepare call at line 724 of selection.mjs (on the branch), execute call at line 726 of selection.mjs (on the branch).

**Commands and exit codes**
- `git fetch origin`: rc 0.
- `npm ci` in frontends/shell, in a shared hold: the call returned no error and node_modules is present, but I did not print its rc. This is a gap in "print every exit code".
- `npm run test:export-elapsed` before commit 1: rc 0.
- `npm run test:export-elapsed` for M1: rc 1, as intended.
- `npm run test:export-elapsed` at head: rc 0.
- `node --check` on publish.mjs, selection.mjs and exportElapsed.mjs: rc 0 each.
- `git commit -s -F` for both commits: rc 0.
- `npm run verify` in a shared hold, first try: rc 1. The cause was a missing prerequisite: renderer/bundle-viewer/node_modules was absent, and `buildViewerFirst` stopped.
- `npm ci` in renderer/bundle-viewer, in a shared hold: rc 0.
- `npm run verify` in a shared hold, second try: rc 0, with vitest 95 files and 1353 tests passed and the export-elapsed test passing.
- `verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs`: rc 0, PASS.
- `verify-test-claims.mjs`: rc 0, PASS.
- `git push origin cut/unknown-attempt-step-1`: rc 0.
- `verify-quotes --show-cites` on the four changed source files: rc 1. The only FAILs are two template-literal strings in publish.mjs (lines 522 and 529 at head) in the FILTERED' step. I did not change either string, and the plain `verify-quotes` run passes.
- The machine script never returned 96 to 99.

**Differences from the form or brief**
- §1.5 versus the Change line: I followed §1.5. The figure ends the line `runStep` prints, as `; prepare-to-execute 1234ms`, with several figures separated by spaces. It is not on its own line.
- The brief named only `npm ci` in frontends/shell. `npm run verify` also needed `npm ci` in renderer/bundle-viewer, which I ran under a shared hold. That creates only gitignored node_modules.
- The publish.mjs summary is a table, so "counts it" is met by a row per step. I only widened `statusWidth` to fit INCONCLUSIVE.
- Wording choice: the statuses in the line `runStep` prints use the helper's message wording, for example "the TTL did not end the attempt".

**Pre-gate self-check**
- The seam is the page's real `window.__SPATIAL_E2E__` hooks, unchanged.
- No claim rests on evidence that does not exist: the e2e runs R1 to R3 are not done, and are the custodian's.
- No operator-visible app text changed.
- T2 reaches its assertion on the real run lines.

**Model:** Sonnet 5.5, claude-sonnet-5-5, as the harness reports it. No override, no context handoff.
