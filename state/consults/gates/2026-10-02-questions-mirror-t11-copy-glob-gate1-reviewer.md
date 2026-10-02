*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #159, for PLAN node `questions-mirror-t11-copy-glob`, the single combined gate (§21b). Reviewed: cut/questions-mirror-t11-copy-glob @ 0aac5169e1b15ae45ed652952b743c9939237417 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 0aac516. Verdict PASS, with nits only. Ready for the human's click, merge commit only. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/questions-mirror-t11-copy-glob @ 0aac5169e1b15ae45ed652952b743c9939237417. PR #159, gate 1, reviewer (the single combined gate, §21b). Base a660a93, one commit.

## S1 (blocking)
None.

## S2 (should-fix)
None.

## N (nits)
- N1. In T11's comment pair the new M14 line sits above M11, so the ids read out of order. This is cosmetic only.
- N2. The copy is now one inner loop on a single line of about 200 characters. It stays inside the 10-line budget but is harder to read than a two-line body would be. Optional.
- N3. The id M14 also appears in stop-hook-stale-continuity's form table (T14/M14). That one will land in a different test file. There is no mechanical clash, because verify-mutation keys on test names, not ids (its header comment). The only risk is a human reader of E's record confusing the two. In this file M1 to M13 are the only existing RECORDED MUTATION ids, so M14 is the next free id and does not clash.
- N4. `.endsWith('.mjs')` is case-sensitive, so a file named `.MJS` would be skipped. No such file exists, and copy order does not matter. Not a finding.

## Check results
1. **Out-of-scope and limits.** ADR, security, wire and guarantee are all "none", which is true: the diff is test-only and the hook scripts and settings are unchanged. One file changed, numstat 4/3, so 7 changed lines (10 allowed).
2. **The change.**
   - **What is copied.** T11 loops over `['hooks','plan']` and calls `readdirSync(...)` filtered by `endsWith('.mjs')`, which copies 37 files. The copy is not recursive. The only subdirectory in each folder is `fixtures/`, and its name does not end in `.mjs`, so it is skipped.
   - **No shell.** All paths are built with `path.join` and copied with `fs.copyFileSync`. The shell spawn and its win32 branch were already there and are unchanged.
   - **Unchanged parts.** T11's name, all its assertions and the M11 comment are unchanged. Temp-dir cleanup lives in `hookProject` (`t.after` → `rmSync`) and is untouched.
   - **Copying `*.test.mjs` is harmless.** The temp project only runs `node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook`. That script imports telegram, cloud and stop-queue; stop-queue imports `../plan/plan.mjs`, which imports yamlSubset. No import reaches a test file. The temp dir is under `os.tmpdir()`, outside any `node --test` glob, so nothing executes the copied tests.
3. **Mutation, reproduced.** I dropped `'plan'` from the loop and ran T11. It failed by name: `assertQuiet` at the test file's line 135, called from T11 at line 320, `status: 1` where 0 is expected. Reverted.
   - The new RECORDED MUTATION line names T11.
   - **Its base, "a660a93 with this change".** I judge this as meeting the form's "recorded with its commit". a660a93 is on main, and "this change" is 0aac516's diff. A comment cannot name the commit that creates it. My reproduction at 0aac516, the base plus this change, gives the same failure.
4. **Seam proof, reproduced.** Commit 8c96695 is reachable and its `stop-queue.mjs` imports `./precompact-flush.mjs`.
   - New T11 with 8c96695's `stop-queue.mjs`: rc 0, 17 pass, 0 fail.
   - After `git checkout --` restored it: rc 0, 17 pass, 0 fail.
   - a660a93's test file with 8c96695's `stop-queue.mjs`: rc 1, 16 pass, 1 fail. T11 fails with `status: 1`, which reproduces I1.
   - All restored. The worktree is clean at 0aac516.
5. **Portability R1–R6.**
   - The diff adds no platform conditional.
   - No separators are hand-built (all `path.join`).
   - The order `readdirSync` returns files in has no effect, because each copy is independent.
   - There is no Windows assumption in shared logic.
6. **CI.** `gh pr checks 159`: all four checks pass at 0aac516.
   - The push run of test · verify:plan · queue/site drift passed.
   - The pull_request run of the same check also passed. It started at 17:46:07Z, after #157's merge at 17:43:24Z, and main's drift since a660a93 touches nothing under `scripts/`.
   - "every commit is signed off" and "no profile path in the range" also pass.
   - One check was pending at first and settled during the bounded wait.

## Exit codes (run in the worktree at 0aac516)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 389 tests, 389 pass, 0 fail.
- verify-cites: rc 0. verify-quotes: rc 0. verify-test-claims: rc 0.
- `node scripts/plan/verify-mutation.mjs --base a660a93 --head 0aac516`: rc 0, "PASS — all 0 new test(s)…". It counts no new test and observes nothing. The M14 observation above is my reproduced run, not this tool's.

## Worker report
`C:/dev/spatial-ide/state/consults/2026-10-02-questions-mirror-t11-copy-glob-worker-report-1.md` (read only, not modified). Its mutation, seam-proof and exit-code figures match my reproduction. It says T11's assertion was at line 319 before the commit's one-line shift, which matches 320 after it. It explicitly says verify-mutation is not an observation of the mutation, so the round 25 item 2 rule is respected. I found no hash pins of test text at a branch commit.

Files:
- `C:/dev/wt/t11-copy-glob/scripts/hooks/questions-mirror.test.mjs` (branch-only change, in T11 `the_settings_command_mirrors_a_recorded_askuserquestion_payload`)
- `C:/dev/spatial-ide/scripts/hooks/QUESTIONS-MIRROR-T11-COPY-GLOB-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md`
