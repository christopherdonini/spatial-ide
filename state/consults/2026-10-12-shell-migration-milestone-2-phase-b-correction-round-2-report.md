*Custodian's filing note (2026-10-12): the worker-high's report on PR #217's correction round 2 of 2 (the gate 2 reviewer's C1-R), branch cut/shell-migration-milestone-2-phase-b at f64418bcc7eee2d0f418bd59f8c00c9554f2c04b, the run 2026-10-12T12:54:51Z to 2026-10-12T13:05:11Z by its transcript (Read 6, Bash 26, Edit 5, Write 3); its one SubagentHandback call, at 13:05:10Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is 17f9abc83a7e6d4b4954da423675dd4561a2caca8ee6099f9497461da38127a4; this file's, from line 5 to the end, is 17f9abc83a7e6d4b4954da423675dd4561a2caca8ee6099f9497461da38127a4. Its second npm run verify run shows no exit code, as the report says; gate 3's reviewer runs it again. The round's diff from 31e7a4ad is two files, 32 insertions and 1 deletion.*

---

Round 2 of 2 for PR #217 is done and pushed with a plain push. The only open case (C1-R) is fixed. The local checks all pass. I could not run e2e.

**Head and commits**
- The head is f64418bcc7eee2d0f418bd59f8c00c9554f2c04b, pushed to origin/cut/shell-migration-milestone-2-phase-b.
- I started at 31e7a4ad after git fetch, with an empty porcelain.
- Two commits on top, both `git commit -s` and ending with the Co-Authored-By trailer:
  - d245975c is the fix, with RB12g pass 3. The commit body is not a mutation record.
  - f64418bc records the mutation, comments only.

**The fix**
- At the head, the ask lives only in `askRef`, a ref of `{ answer, runs }`. `confirmOpen` snapshots `exportRunsRef` into `runs`. The only React state is the boolean `asking`, so nothing else needed to stay consistent.
- In `handleExportRunning` (`frontends/shell/src/App.tsx`), right after the run is set in `exportRunsRef`, I added the reviewer's line: `if (askRef.current !== null) askRef.current = { ...askRef.current, runs: [...askRef.current.runs, run] };`
- I also updated the `askRef` doc comment to say runs reported while the ask stands are included.
- A run reported during the ask is now in `ask.runs`, so `answerOpenAsk` marks it, and decides its statement from `lateCancelOutcome(true, run.end)` when it has already ended. It calls the run's `cancel()` once and never reads the answer. The union with the standing runs is kept.

**The test**
- RB12g gained pass 3 in `App.selection.test.tsx`. Passes 1 and 2 are untouched.
  - It uses `handleOf(3)` and opens d.parquet.
  - The prepare is deferred and the ask shows over it. The prepare then ends into the prompt.
  - `pendingExecute` is `Promise.resolve(success("C:/out/g3"))`, so the execute finishes at once on Submit while the ask stands.
  - It asserts the execute started with `at_g3`, the ask still stands, the panel shows `Exported.`, and there is no statement before the choice.
  - After the choice it asserts the open is admitted and the statement path is `C:/out/g3`.
  - It then asserts the cancels since the choice are `[prepareCancelKey(handle), "at_g3"]`, once each, and that `closes(handle)` is 1.
  - The statement assertion comes before the cancels assertion on purpose. Without the line, the cancels would also lack `at_g3`, and the failure has to land on the statement.
- **Mutation:** I removed the added line and ran the file.
  - The file ran 28 tests: 1 failed, 27 passed.
  - The failing test was RB12g, at pass 3's statement assertion: `AssertionError: pass 3: decided at the choice, the statement names the bundle the finished execute gave: expected null to be 'C:/out/g3'`.
  - I restored the line with `git checkout`, and the file then ran 28 of 28. The record is in the test's comment, OBSERVED AT d245975c.
  - The f64418bc body states one mutation observed, 28 tests, 1 failed, 27 passed.

**Two finished runs**
- `setLateCancel` replaces its value. Each run is decided by its own outcome only. A stopped or refused run (`lateCancelOutcome` returns null) never calls it, so it never clears an earlier statement.
- At the choice, runs are walked in order: the ask's runs in report order, then the standing runs not already in the ask. Each run that has ended is decided in that order.
- A run that ends after the choice is decided in its `ended` handler.
- So with two bundles, the last decided shows alone. Statements are not shown in turn, and the existing rule is unchanged.

**Commands and exit codes**
- `npm run verify` in `frontends/shell`, under the shared hold:
  - First run: exit 0. I then overwrote its log by mistake, with a name collision against a later `node scripts/plan/verify.mjs` log.
  - Second run, to recover the log: the tool did not echo its exit code. The log shows every stage reaching the last, `test:citation-integrity` ("30 passed, 0 failed"), with no failure line.
  - Its numbers: typecheck, dev-origin, origin-event, `adrIndex` (34 ADRs), build, `check:dist-clean` and `check:dist-notice` all PASS. Vitest was 93 files and 1332 tests passed. `residencyTrace` was 76 passed, 0 failed. `citationIntegrity` was 30 passed, 0 failed.
  - The holds were granted and released both times.
- `npx tsc --noEmit`: exit 0.
- `verify-cites.mjs`: exit 0, PASS across 1849 files, with 60 advisories.
- `verify-quotes.mjs`: exit 0, PASS: 121 checked, 90 verified, 30 baselined.
- `verify-test-claims.mjs`: exit 0, PASS: 560 tests across 164 files.
- `scripts/plan/verify.mjs`: exit 0, `verify:plan` PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: exit 0, 457 pass, 0 fail.

**§7**
- From f87a7b66 with its three excludes, the count is 5663 insertions plus 110 deletions, 5773 in total, over 39 files.
- This round's part, from 31e7a4ad, is 32 insertions and 1 deletion: `App.selection.test.tsx` +29 and `App.tsx` +3/-1.

**What the custodian should run in e2e**
- The suite that exercises open-during-export, to confirm the statement after a late execute: a whole-file export, open another file, the prepare ends into the prompt, Submit with the phrase, `Exported.` shows, then Cancel the export and go on. Expect the statement naming the bundle path, and the old handle closed once.
- Re-run the earlier cases of the same ask, where Cancel the export and go on follows a stopped or a still-running execute. The code path for them did not change.
- The other e2e suites are unaffected by this change, but the custodian's rule of running all fourteen at the head applies.

**Final state**
- `git status --porcelain` is empty, and the branch matches origin at f64418bc.
- No background process is left running.
- I did not edit `state/`, `PLAN.yaml`, the form, or OPEN-13's two files.
