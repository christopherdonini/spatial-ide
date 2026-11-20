*Filed by the custodian: the stop 7 fix's worker-high hand-back (claude-opus-5-5), 8269 bytes, sha256 15cdb76b14ddf9857af0b372b75ce67f47a064cdc9e8a4fd3d1e47ccbd10114b, below the rule, byte for byte but for 1 of the scratch-folder path as <S>, with one final newline added. Calls Bash 61, Read 15, Edit 12, Write 2, SubagentHandback 1, 3 errored, from 2026-11-20T09:41:18Z to 2026-11-20T09:54:36Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-3 fix, worker-high, port-5400 harness

The fix is in and pushed. E-REOPEN R6 now passes, with the saved view back bit for bit. R8 fails, and per the brief I only report it (below). One item goes to the advisor: a clause of O-17's new sentence is untrue for the baseline arm (see Stops).

Model: Opus 5.5 (claude-opus-5-5), as the harness gives it. No override and no context handoff.

**Step 0 (reading only)**
- **Candidate branch (the default arm):** the first look is `reportViewportOutcome(session.reissueUnrestricted(null, activeFilterRef.current), ...)`. `reissueUnrestricted` calls `canvas?.resetFitForNewGeneration()` before its first await, which is `await viewportQuery` inside `issueUntiledQuery`.
- **Baseline branch (the one that builds no candidate session):** the first look is `reportViewportOutcome(issueViewportQuery(null, null, ...))`, which goes to `ViewportStreamManager.requestViewport`. That call resets no fit. In `src/` the only callers of `resetFitForNewGeneration` are this session's `reissueUnrestricted` and `applyFilter` after an issued outcome. So the old write-first order was harmless in this arm.
- **Can `App.reopen.test.tsx` see the order? Yes.** Its `beforeEach` sets the arm to `"baseline"`, but the candidate session module is not mocked. A case that calls `setResidencyArm("candidate")` runs the real `startCandidateArmSession` and its reset against the canvas stand-in. No stop.

**Commits** (pushed head 20895dfbd7deccfb7f9e1099a04c31311f783a79; the push output read `da94ae0b..20895dfb`; no fetch)
- 398600bdfd8cacabbf425a2030e26141c4eccda9 — `test: the reopen's saved view is written after the first look's reset of the fit, a unit case failing at this commit (B2 piece 1c, Amendment 60 item 4)`
  - The stand-in now records reset and applyView calls in one list, `mocks.fitCalls`.
  - `viewportQuery` is held unanswered only when `mocks.holdUntiled` is set. Otherwise it throws an unhandled non-Skp error.
  - New case: "a reopen's saved view is written once, after the first look's call resets the fit, and no reset follows it (Amendment 60 item 4)". It asserts one write, no reset after it, the first look's reset before it, and the view bit for bit. T-17 is untouched.
- 20895dfbd7deccfb7f9e1099a04c31311f783a79 — `fix: the reopen's saved view is written after the first look's call, so the first look's reset no longer undoes it (B2 piece 1c, Amendment 60 item 2)`
  - `App.tsx` only. The view is taken at the effect's start and written right after the first look's call, in both branches, in the same turn, with comments saying why.
- The suite's commit 5e72c116 went in the same push.

**Runs** (each in its own shared hold; logs in the scratchpad)
- At 398600bd, `npx vitest run src/App.reopen.test.tsx`: rc 1, 1 failed and 12 passed, failing by the new case's name with "no reset after the write: expected [ { call: 'reset' } ] to deeply equal []". Log: `1cp4a3f-vt-testcommit.log`.
- At 20895dfb, `npm run typecheck`: rc 0. Log: `1cp4a3f-typecheck.log`. Porcelain stayed empty.
- At 20895dfb, `npx vitest run src`: rc 0, 123 test files and 1570 tests passed. Log: `1cp4a3f-vt-head.log`.

**Mutation** (diff in `1cp4a3f-mutation.diff`)
- Change: in `App.tsx`, `savedView = reopenView.view;` became `canvas?.applyView?.(reopenView.view);`. That puts the write back before both first looks, as at da94ae0b.
- Result: rc 1, red by the new case's name with the same message. Log: `1cp4a3f-vt-mutation.log`.
- Reverted: `git diff --quiet` rc 0, porcelain empty.

**E-REOPEN f-r1**
- Harness check: `sha256sum -c` printed ten `OK`, rc 0. No harness file changed and no rebuild.
- Busy check: `FREE`, rc 0. CPU load before the run: 6,20,13.
- The suite ran at head 20895dfb and exited rc 1. Logs: `p4a-e2e-h/out/p4a-e2e-f-r1.log` and `1cp4a3f-e2e-f-r1.log`. Session log copied to `1cp4a3f-f-r1.session.log`.
- Results:
  - R1 to R5 PASS.
  - **R6 PASS**: "view equal the file's, the view bit for bit". Console: 256 actions with 559 dropped; the `open_project` row had 3 entries after it.
  - R7 PASS.
  - **R8 FAIL** after 60 s waiting for an `open_project` row with answer `same` at ok. The session log shows `reopen-refused skp.project_open_elsewhere: spatial://project/16d59f46704382b8de94422fd69c7315 is already open` at 1795168286339, inside R8's window. Q is a hand copy of P, and P is still open in this window from R6. Not fixed: the suite is the other worker's.
  - R9 and E-CHANGED did not run.
- **R6's view before and after the first look:** the suite prints neither value on a pass. It reads the view right after the call (`early`) but prints it only on failure. The bit-for-bit match after the first look is the suite's own check against the file. The folders were removed at cleanup, so I could not read the file's hex.
  - For reference, R2's camera bit patterns are 4143d7e22aaaaaab, 4132530449249249 and bfeb6db6db6db6dc (2600900.3333333335, 1200900.2857142857 and zoom -0.8571428571428572).
  - The R6 dataset's frame was set up on the first data (session log 1795168281989). The first planned look box, `{xmin:2600295.31, ymin:1200255.41, xmax:2601505.36, ymax:1201545.16}`, is centred on the saved centre, so nothing moved the camera after the write.

**Counts** (§2.11's command over 7f7eb6d6...20895dfb; excludes set to the form's present path)
- **Shell product: 18 files, +809 −37 = 846 against 820. Class 8, nothing cut.** Within it the strings file `reopenNotices.ts` is 122 against 90 (class 8, as before).
  - App.tsx 94/5, AdmissionPanel.tsx 163/14, RefusalBlock.tsx 11/2, admitDataset.ts 13/4, formatRefusal.ts 6/0, WorkingCanvas.tsx 18/2, ConsolePanel.tsx 1/1, surfaceRegistry.ts 7/6, e2e-test-surface.ts 16/0, StudioLayout.tsx 6/0, actionRegistry.ts 6/2, openProject.ts 145/0, reopenNotices.ts 122/0, saveProject.ts 9/1, shownText.ts 46/0, client.ts 17/0, types.ts 76/0, document.ts 53/0.
- **Shell tests: 10 files, +842 −5 = 847 against 690. Class 8.**
  - App.reopen.test.tsx 468/0, RefusalBlock.test.tsx 38/0, WorkingCanvas.wiring.test.tsx 29/0, surfaceCompleteness.test.ts 4/4, actionRegistry.test.ts 1/0, openProject.test.ts 149/0, reopenNotices.test.ts 59/0, saveProject.test.ts 12/1, client.test.ts 32/0, document.test.ts 50/0.
- E2e: 2 files, 461/0 against 485 (e2e/reopen.mjs 460/0, package.json 1/0).
- Every other group is 0. At da94ae0b the product group was 838 and the tests 825.

**Holds** (five: the test commit's run, typecheck, vitest, the mutation, E-REOPEN). Each printed exactly two lines, and there were no MACHINE_WAITING or MACHINE_ERROR lines:
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`
- The pids were 61760, 17568, 17828, 56500 and 51504. No exit code 96 to 99, and run-suite never exited 90, 94 or 97.

**Stops and departures**
- **For the advisor, unreworded (Amendment 60 item 6):** in O-17's new sentence, the clause "after the first look's call has reset the fit for its generation" is untrue of the baseline arm as built. That arm's first-look call resets no fit; its one-shot fit is unset because the canvas is remounted per dataset. The rest of the sentence holds in both arms. Baseline is reachable only through the dev-only switch.
- **Departure (test file only):** I added the `holdUntiled` switch to the mocked client's `viewportQuery`.
- **Self-check:** the order case reaches its assertions, shown by the failure message above. No export was added, so no caller grep applies. No user-facing text changed.
- **State left:** porcelain empty, and the busy check after the run printed `FREE`. Nothing I started is still running.

Files are in <S>/:
- 1cp4a3f-vt-testcommit.log
- 1cp4a3f-typecheck.log
- 1cp4a3f-vt-head.log
- 1cp4a3f-vt-mutation.log
- 1cp4a3f-mutation.diff
- 1cp4a3f-e2e-f-r1.log
- 1cp4a3f-f-r1.session.log
- 1cp4a3f-numstat.txt
- p4a-e2e-h/out/p4a-e2e-f-r1.log

The two changed files are C:/dev/wt/1c-p4a/frontends/shell/src/App.tsx and C:/dev/wt/1c-p4a/frontends/shell/src/App.reopen.test.tsx.
