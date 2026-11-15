Reviewed: guardian-parity-git-timeout-under-load's PR at 7235aa0ce559893cf402d6ad304df6ed24a0f198, gate 1, reviewer
Verdict: PASS WITH NOTES. Branch and commit: cut/guardian-parity-git-timeout-under-load @ 7235aa0ce559893cf402d6ad304df6ed24a0f198. Nothing blocks. E1 is an Evidence gap that I closed in this gate by re-running the mutations. D1 to D4 must be fixed before the merge, using the words given below. None of them needs a re-gate.

## Correctness
No finding. I read the code whole at the head against §2 items 1 to 3:
- **Item 1 (mod runner):** `modOutcome` times each call and records `{side:'mod',args,ms,exitCode,timedOut}`, with `timedOut` taken from `r.error?.code === 'ETIMEDOUT'`. It still throws on `r.error`. `readGit` in `continuity.mjs` catches that throw and returns null, so the runner contract (resolve on result, reject on error) is unchanged. The new program and prefix parameters default to `'git'` and `[]`, and only T37 uses them.
- **Item 2 (Stop-side observer):** `realExecFileSync` is captured before any hook runs. `before()` installs the observer and calls `syncBuiltinESMExports()`; `after()` restores the original and syncs again. The observer records only while `observed` is an array, and `observed` is set only inside `stopOutcome`, with a `finally` that resets it. It returns and rethrows exactly what the original does. `substitute` is set only in T38 and reset in a `finally`, and it swaps only the `log` call's program while keeping the product's options.
- **Item 3 (the consumer):**
  - `timeoutFinding` reads only `log` and `show` calls, and its message matches §2.3's form.
  - T35's subtest asserts the finding is null before it compares outcomes, and asserts that the Stop side recorded a `log` (non-vacuity).
  - T36 filters to reads with `finding == null`.
  - Each fixture gets one `<id> git ms:` diagnostic line, and a non-zero exit is flagged.
- **Seam:** `decide(input, { projectRoot })` matches `stop-queue.mjs`'s signature. `stop-queue.mjs:44` imports `execFileSync` by name, and mutation M3 proves `syncBuiltinESMExports` rebinds it.
- **Caller grep:** the diff adds no `export` (the grep found nothing, rc 1) and no product-side item.
- **§8:** items 1 to 5 are clear. `STOP_RUN_OPTS.timeout` is still 2000; the branch touches only the test file; and there is no re-read.
- **Minor, not a finding:** a fixture whose build throws stores `{error}` with `finding` undefined. T36 then counts its `stop` value (undefined), but T35 fails that fixture anyway.

## Evidence
**E1 (Evidence; closed by this gate's re-observation, so not blocking).** §1's Unchanged list says: "T35's and T36's names, and the three recorded mutations (`:310-318`, `:337-340`), which are re-observed under §4."
- At c8351520 those lines are the three mutations first observed at 54eba872: the failed `git log` read as fresh, the inverted comparison, and every fixture built as PS7. I checked the lines with `git show c8351520:…`.
- §5's P5 is about these three ("as recorded").
- Neither the instrument report nor the series report re-observes them. Their comments still name only 54eba872.
- Amendment 1 item 1's P5 sentence rests instead on the three mutations §4 adds (the two `timedOut: false` changes and the deleted sync call).

I re-observed all six at the head. Each mutation was applied alone in C:/dev/wt/gpt, the file was run, and the change was reverted with `git checkout`. The porcelain was empty after each.

| Mutation | Test run rc | Failed tests | Matches the record? |
|---|---|---|---|
| M1: runner `timedOut: false` | 1 | T37 only (16 of 17 pass) | yes |
| M2: observer catch `timedOut: false` | 1 | T38 only | yes |
| M3: `syncBuiltinESMExports();` deleted in `before()` | 1 | all 13 PS subtests, the T35 parent and T38 (2 of 17 pass) | yes |
| O1: `continuity.mjs` `if (c === null) return { judged: true, stale: false };` | 1 | PS4a and T35, **plus T37** | no: T37 is an extra failure |
| O2: `stop-queue.mjs` `!==` | 1 | PS1, PS2, PS3, PS5, PS6, PS8, PS9, PS10 and T35 | yes |
| O3: `fx.build(dir)` replaced by PS7's build | 1 | T36 only | yes |

O1 also fails T37 because T37 asserts `not judged`, and under O1 a failed read becomes judged fresh. So P5 holds for the tests each mutation records, and O1's recorded failure set is now incomplete. Under §5 that is a result, not a block. Recording it is D1 and D2.

**The rest of the evidence:**
- **Diff:** `git diff --numstat e5e6e03a...7235aa0c…` returns rc 0 and shows `103 10 scripts/hooks/guardian-continuity-parity.test.mjs`: one file, 113 changed lines against §7's 130.
- **6d76bcdb to 7235aa0c is comment-only:** no non-comment `+` or `-` lines.
- **File at the head:** `node --test scripts/hooks/guardian-continuity-parity.test.mjs` returns rc 0, 17 tests, 17 pass, 0 fail, on node v24.18.1 and git 2.49.0.windows.1. T37 took 2295.8 ms and T38 took 2384.0 ms; the largest call was 66 ms.
- **Scripts suite (governance-ci's command) in a shared hold:** the runner exit was 0; 555 tests, 555 pass, 0 fail, 0 cancelled, 0 skipped, and no "timed out:" line.
- **CI:** `gh pr checks 251` returns rc 0, all 8 checks pass. `gh run view` gives head sha 7235aa0ce559893cf402d6ad304df6ed24a0f198 for every run:

| Run | Event | Workflow |
|---|---|---|
| 40083681388 | push | Governance CI |
| 40087162109 | pull_request | Governance CI |
| 40087162089 | pull_request | DCO |
| 40087162104 | pull_request | Exposure scan |
| 40083681420 | push | Ported notices |
| 40087162087 | pull_request | Ported notices |

- **P4 in CI:** in run 40087162109 (Ubuntu) the T35 parent passes, so every PS subtest's non-vacuity assertion held. P4's governance-ci half therefore holds; Amendment 1 says only "locally".
- **Verify scripts:** `verify-cites` rc 0 PASS (2322 files); `verify-quotes` rc 0 PASS (131 checked); `verify-test-claims` rc 0 PASS (656); `verify.mjs` rc 0 ("verify:plan PASS"). The porcelain was empty after.
- **The series' artefacts, checked independently:**
  - All 30 TAP files are present. The sha256 of L0-01, L1-05 and L1-10 matches the series report.
  - My script found X = 612 ms (L1-05, PS6, mod:2) and a Stop-side maximum of 510 ms, so B = 2000.
  - No "timed out:" line, T37 and T38 pass in all 30 runs, and there are 0 failing-test lines.
  - My parser skipped the 180 exit-flagged entries because of the space in "(exit 128)". It printed their values, and the largest is 374 ms, so X is unchanged.
  - The exit-128 reads are mod:0 and stop:0 on PS4a, mod:1 and stop:1 on PS19, and mod:2 and stop:2 on PS7. The instrument report's "PS19 (parent show)" is wrong: it is PS19's `show`. That report is filed run output, so I propose no edit.
- **§5's falsification clause, the gate's reading: not met.** The clause's second sentence makes its subject a misread caused by a load-time git error. PS4a's `log` (a directory that is not a repository) and PS19's `show` (the ledger was removed at c1) are those fixtures' designed not-judged reads. They are equal on both sides and identical in the unloaded runs (3 in the instrument report, 20 in L0, mine at the head) and in CI. They are not misreads, and they are not caused by load.
- **§7 added test time:** T37 plus T38 came to 4679.8 ms at the head, against "B plus 2000 ms, plus spawn time". The remaining roughly 680 ms is the PS7 fixture build's git spawns and the rest of `decide`'s spawns. That is not an overrun as the ceiling is worded. Class 8 covers only line budgets and file counts (`docs/PREREGISTRATION-TEMPLATE.md` item 8), so it does not apply.
- **Timing, for the custodian; not recorded as a failure (THE MACHINE):** in my suite run, T37 took 5239.9 ms and T38 took 7598.6 ms. T38 is above I5's 3 × 2000 ms, and the largest parity call was 954 ms. My own verify-script run was going at the same time, so these are not L1's conditions and not the series. The rule still gives B = 2000 at 954 ms. If wanted, re-run it alone.

## Documentation (must-fix before the merge; none of it is the human's wording; apply with no re-gate and list it in the PR body)

**D1. The test's recorded-mutation comments.** Add new lines only and edit no existing line. This adds 6 lines, giving 119 of 130.
- After the line ending `…git --version 2.49.0.windows.1.` that closes the `continuity.mjs` mutation (the first RECORDED MUTATION, before `// RECORDED MUTATION: in the working tree only`), add:
```
// Re-observed at 7235aa0c (the git-timeout form, section 4) -> fails: `PS4a`, `guardian parity:
// the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`
// and `guardian parity: a mod-side git call that outruns the runner's timeout is recorded as a
// timeout, not read as an outcome`, with node --version v24.18.1 and git --version 2.49.0.windows.1.
```
- After the last line of the `stop-queue.mjs` inverted-comparison mutation, and after the last line of the PS7-build mutation, add on each:
```
// Re-observed at 7235aa0c (the git-timeout form, section 4) with the same failures.
```
- Clause check:
  - "at 7235aa0c": the worktree HEAD for O1 to O3.
  - "section 4": the form's "Recorded mutations" bullet.
  - The O1 failure list: my O1 run (three failing tests: PS4a, T35, T37).
  - The versions: the head run's `node --version` and `git --version`.
  - "the same failures": O2 failed exactly the eight PS ids and T35 that the comment records; O3 failed T36 only.

**D2 to D4. An Amendment 2 appended to the form on main.** It is a class 1 post-result record, and the custodian fills the two placeholders:
```
## Amendment 2 — gate 1's record (class 1); written after gate 1 was seen

*Written by the custodian. References only: gate 1's reviewer report (`state/consults/gates/<its file>`).*

1. §4's three recorded mutations, those §1 lists as unchanged, were re-observed at 7235aa0c in gate 1: the inverted comparison and the PS7 build fail as recorded, and the failed `git log` read as fresh fails its recorded tests and T37. The test's comments record it at <the comment commit>. Amendment 1 item 1's P5 sentence rests on the three mutations §4 adds, not on these.
2. P4's governance-ci half holds: run 40087162109 at 7235aa0c passes every T35 subtest.
3. Amendment 1 item 6: PS18 has no non-zero exit; the exit-128 reads are PS4a's `log`, PS19's `show` and PS7's parent show, and PS7 reads fresh.
4. L1's hold was declared with `-Minutes` 60, against §7's 30 (the series report's hold lines).
5. §5's falsification clause is not met, by gate 1's ruling.

Nothing above is edited.
```
- Clause check:
  - Item 1: my O1 to O3 runs (the table above) and the instrument report's mutation list, which names only the M1 to M3 changes and says "P5 holds". It is three sentences, within (d).
  - Item 2: run 40087162109's log; its head sha comes from `gh run view`.
  - Item 3: the head run's and CI's `git ms:` lines (PS18 has no exit flag; PS7 `mod:2`/`stop:2` show exit 128), and the series report's line 112.
  - Item 4: the series report's L1 hold paragraph.
  - Item 5: the falsification reading in this report.

## Hold lines (this project's only)
- From the file, byte-copied: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:44536 also=bash.exe:19992 (commands started from now on inherit it; release when done)`
- As printed by my filter, with the shell pid fields removed: `MACHINE_RELEASED project=SpatialIDE affinity=FF (cores 0-7)`
- `-What` "guardian-parity-git-timeout-under-load: scripts suite node --test", `-Minutes` 10, `-MaxWaitMinutes` 8. The hold was not refused (no code 96 to 99).

## Disclosure
In my first call I redirected one throwaway `git status` output to a file in Git Bash's /tmp, outside my scratch folder. I deleted it in the next call; it held nothing. Every other file I wrote is in the custodian's scratch folder and its name starts with `gpt-g1r-`. I made no commit, push or PR action, and I killed no process.
