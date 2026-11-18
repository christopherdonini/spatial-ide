Built: shell-tiled-arm-stream-refusal-shown-to-the-user S1, the correction for C-1, worker-high (the custodian's filing note, 2026-11-18: the worker-high, model claude-opus-5-5, PLAN node shell-tiled-arm-stream-refusal-shown-to-the-user, the correction of C-1 by the advisor's ruling ADV-2026-11-18-09 item 6 under the form's Amendment 2; dispatched at 2026-11-18T12:38:27.693Z by the custodian's transcript, its prompt naming the brief in the custodian's scratch folder (11602 bytes, sha256 83c223315208159b3653dfcf4151a4aa94d0df9f9a058f8c5c5b5933c201b9a4); the run 2026-11-18T12:38:32.519Z to 2026-11-18T12:50:21.386Z by its transcript, Read 20, Bash 32, Edit 4, Write 3, SubagentHandback 1, none errored; its hand-back below, byte for byte, with the custodian's scratch folder written as <S> in 1 places, with this note added in its first line and one final newline)

**STOPPED at step 2, before the product commit.** The ruled fix makes an existing test that §4's note names fail. That test is in `candidateArmSession.test.ts`, which is not in §7. Changing it would add a file outside §7 (§11 item 3, class 9, an amendment needed before its code), and the fix itself contradicts that test's assertion. I committed and pushed nothing past step 1.

**Commits** (worktree C:/dev/wt/srf, branch `cut/shell-tiled-arm-stream-refusal-s1`)
- b53d14ff3dfdba10bfdc982d5847cf8ac2f4be52: test: S1 C-1, three tests for a tile ending while an Apply's first look runs (refused, failed, success)
- Pushed head: b53d14ff, by ls-remote.
- At the start: HEAD was F, porcelain 0 bytes, ls-remote gave F.
- At the end: HEAD b53d14ff, porcelain 0 bytes.

**P-base** (at b53d14ff, `npx vitest run src/residency/candidateArmSession.refusal.test.ts`, rc=1, "Tests 3 failed | 12 passed (15)")
- SR-A-apply-refused: predicted FAIL, observed FAIL at refusal.test.ts:483. "expected undefined to deeply equal { …(3) }"
- SR-A-apply-failed: predicted FAIL, observed FAIL at :499, the same message.
- SR-A-apply-success (Amendment 2 item 4): predicted FAIL, observed FAIL at :514, the same message.
- All 12 existing tests passed. Each new test fails at its first status assertion, and its scan assertions come after it.

**The stop, at step 2** (fix and words applied, uncommitted)
- Pre-commit run of the refusal file plus the §4 note's suites (TVSM.test, candidateArmSession.test, residencyStatus.test, App.lateResult, App.streamFailure): rc=1, "Tests 1 failed | 230 passed (231)". The three new tests pass.
- I ran the whole suite once in a hold, after the stop, to list everything that breaks: rc=1, "Test Files 1 failed | 113 passed (114)", "Tests 1 failed | 1480 passed (1481)". It is the same single test, so it is the only existing test the fix breaks.
- The test: `candidateArmSession.test.ts` › "M1: over-budget + no-headroom skip reaches trackedTileCount 0 while the untiled stream still delivers -- …", at :2249 `expect(onResidencyStatusChange).toHaveBeenCalledTimes(1);`. The failure: "expected "vi.fn()" to be called 1 times, but got 2 times".
- Its comment at :2244-2247 pins the old gap: the untiled terminal "alone does not itself emit". Its next step, :2254-2262, expects `{candidate-over-budget, 7, null, settled:"partial"}` at the next plan.
- By reading, not observed, the fix emits that same settled event earlier, at the untiled Completed terminal after the plan.
- I did not change the fix's shape to keep this test green, because that would route around the ruled shape.

**Fix diff** (byte-copied from my `git diff`; now reverted)
```
-        // The stream-refusal piece S1 (§2.2 (b)): this generation's own first look failed. Before any
-        // plan, nothing else would ever settle the bar, so it says what is left; after one, the
-        // existing settled path does.
-        if (wasCurrent && !wasSelfCancelled && terminal.kind !== "Completed" && !relinquishedReEmitted) {
+        // The stream-refusal piece S1 (§2.2 (b); Amendment 2 item 2, C-1): this generation's own first
+        // look ended. After a plan, whatever its kind, the existing settled path recomputes the status:
+        // a tile that ended while this look ran found the view not settled, so this is the settling
+        // moment. Before any plan, only a failure speaks: nothing else would ever settle the bar, so it
+        // says what is left.
+        if (wasCurrent && !wasSelfCancelled && !relinquishedReEmitted && (hasPlanned || terminal.kind !== "Completed")) {
```
- Branches 2 and 3 are unchanged, and are reached only when there is no plan, so only on a non-`Completed` terminal.
- Departure: I reworded the branch's own comment, because the old one ("first look failed") became untrue.

**The words** (script `<S>/s1c-words.mjs`, log `<S>/s1c-words.log`; applied, then reverted)
- The script reads both reports by `git show e45cf5e8:<path>`. It refuses unless each old text occurs exactly once, and it checks that each new text is once in the result. Dry run and real run both rc=0, 7 edits.
- D-1 doc: "…which settles its status and its scan." → "…which re-syncs its scan and, when no tile is still tracked, recomputes its status."
- D-1 test comment: "so the session can settle its status and its scan." → "so the session can re-sync its scan and recompute its status."
- D-3: "the held drain would never issue the retry" → "while over budget the drain is held, so a requeued retry would wait for the next camera change". The `!this.overBudgetFlag && ` condition is kept.
- D-4 doc (two lines): the old fragment occurs once in the old content. The new content equals the report's bytes, laid out at its sentence break.
- D-4 test comment: "a first look that failed before any row" → "…before any plan, with no frame or with no row of its own".
- D-5: the report's line (sha256 6b6d74a172750af329616edfe8d90b4ee5db569b592bae41961470fe959d5c01) is added as the last line of both constants' comments. The `*/` moves onto it, and the strings are untouched.
- W1/W2 check: `<S>/s1c-w12.mjs` is written but not run, since there is no head commit to check it against.

**Not reached:** P-head, typecheck, `npm run verify`, the mutations M-C1a/b/c (each named in its test's comment), the fix commit and its push.

**Counts** (numstat 2a8907b8...HEAD at b53d14ff)
- App.streamFailure 251/0; refusal 519/0 (of 540); candidateArmSession.ts 37/1; residencyStatus.test 18/0; residencyStatus.ts 26/2; TVSM.test 78/0; TVSM.ts 10/0.
- Product 76 of 120, unit 866 of 1,010, total 942 of 1,130. No overrun.
- The uncommitted fix and words came to +17/-14 more, which would also fit.

**Holds:** one hold, for the whole vitest run. `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:77572 also=<m>`, then `MACHINE_RELEASED project=<m> …`. No exit code 96 to 99, and no Guardian refusal.

**State left:** porcelain 0 bytes and `git diff --quiet` rc=0 after `git checkout --`. The uncommitted diff is saved at <S>/s1c-step2-uncommitted.diff (8348 bytes, sha256 b56e78929b95371106a0a10ab57ba11e11f355a4fb470cea21f0e6b917d18761). No background process of mine is running; the 8 node.exe processes present are not vitest or srf ones, and I killed none.

**Decision needed (advisor):** a class 9 amendment adding `candidateArmSession.test.ts`, with M1's :2249 assertion and its comment corrected to expect the settled emission at the untiled terminal. Otherwise another ruling.

**Self-check:**
- Cross-module: not reached.
- Claims: each rests on a log in `<S>/s1c-*`.
- Messages: no shown string changed.
- Tests: the new tests reach their status assertion.

Model: Opus 5.5 (claude-opus-5-5), no override, no context handoff.
