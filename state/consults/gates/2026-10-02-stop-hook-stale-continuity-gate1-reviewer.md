*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #161, for PLAN node `stop-hook-stale-continuity`, full gating. Reviewed: cut/stop-hook-stale-continuity @ 25422334a1d69fbcc0f247a9dfe67ad8b3ed9da8 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 2542233. Verdict PASS.*\n\n*The findings and their routes:*\n- *S2-1 (the buffer comment), N1 (four timed calls) and N2 (the README intro) go to correction round 1, with the architect's S2-1 (T18 and T19). S2-4 is the same coverage finding.*\n- *S2-2: the architect's gate-1 N2 rules the generation bump right. The bump was committed on main at a13a2af after this review read the branch. Correction round 1's class 4 amendment takes it to 3.*\n- *S2-3: main has gained no `AUTONOMY.md` section since fe1e6b7. The closing record restates the number.*\n- *On the report's note about the worker report's working-tree copy: the rename's title-date edit was left out of a11518e, and the next main commit carries it.*\n\n*Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/stop-hook-stale-continuity @ 25422334a1d69fbcc0f247a9dfe67ad8b3ed9da8 — PR #161, gate 1, reviewer (merge base and origin/main fe1e6b7; three-dot ranges throughout)

## S1 (blocking)
None.

## S2

**S2-1. The comment on `CONTINUITY_GIT_MAX_BUFFER` in `stop-queue.mjs` (the module constants block) is false.** It says "execFileSync's default of 1 MiB is below the ledger's size". The ledger blob at fe1e6b7 is 279891 bytes, which is under 1 MiB. The buffer is a guard for future growth (§0's size bullet; I6), so the comment should say that and should not claim the default is already exceeded. Fix it in the correction round. The behaviour is correct.

**S2-2. Amendment 1, item 4 ("The node's generation bumps to 2") has not been carried out.** `PLAN.yaml` still reads `generation: 1` for `stop-hook-stale-continuity` at 2542233 and at fe1e6b7. The architect's I1 ruling ordered the bump. Two things conflict with it:
- the B-1 practice recorded at 291cae5: a class 8 row is "a record row that changes no scope or prediction", so the generation stays;
- `AUTONOMY.md` §15's rule that a result whose tag no longer matches the current generation is discarded. Read literally, a bump to g2 after the results would discard this branch's g1 result.

The architect should rule which reading holds. The custodian then lands the bump on main, or appends a correction, before gate 2.

**S2-3. Amendment 1, item 3 records §30 before the PR merges.** It is correct against main fe1e6b7 today. Under §2 item 10 and §8 item 8, though, the number holds only if main gains no `AUTONOMY.md` section before the click. The port-1 form is now on main, so watch whether it appends one. If any piece appends a section first, re-merge and renumber, and the closing record re-states the number. Freeze main for this PR's click.

**S2-4. Not-judged coverage.** Of the three §7 causes, only `git log failed` is tested (T9). `no flushed_at in the block at <%H>` is reachable with a plain fixture, but no test covers it. I recommend the class 4 route the I1 ruling already names: T18 plus M18, a null `F_c` read as stale.

Related: if the third git call (`<c>^1:` show) times out, the step reads fresh and writes no stderr line. That is silently not judged. It is inside §2 item 2(c), which does not separate "no parent copy" from "git failed", so it is not a defect against the form. Disclose it in the closing record. It fails open, so §8 item 4 is not violated.

## N (nits)
- **N1. The timeout comment and §7's arithmetic say "three calls".** On the stale path, `accountContinuation` adds a fourth timed call (`rev-parse HEAD` with the continuity options, as §8 item 1 requires). The worst case is 4 × 2 s + 5 s = 13 s, still under 20 s.
- **N2. README "Decision order" intro.** "the continuity step and the background-tasks allow trade places" is loose. Continuity is new, and the background allow moved from step 1 to step 4.
- **N3. Amendment 1, item 2 says "the merged head 78681ec".** That commit is the branch head after merging main, not a merged head. The gated head is 2542233. It changes only the form, and I confirmed that the count (703) and the suite (406/406) are identical there.
- **N4. The I1 pin `scripts/hooks/questions-mirror.test.mjs:307 @ 629d969` is historical.** It is authoritative for the failure. The tree on main (since ec74652) carries the glob copy at lines 307-310. Item 2 names the fix in its next bullet, so the pin is not read as current.
- **N5. The existing background-tasks test still leaves its `makeTempDir` directory behind.** This predates the piece, and §2 item 6 bars any edit beyond `writeHeldLease`.
- **N6. Edge in the shared accounting.** A stale block writes `lastPlanHash: null` in a fresh session. A later queue block at the same HEAD would then count as progress. That needs a stale verdict followed by a not-judged verdict with no new commit, so it only resets the count early, and Claude Code's 8-block cap still bounds it. This is not a queue-path behaviour change under §8 item 2.
- **N7. The Product CI "Rust workspace" push run at 78681ec was still in progress.** It is not a PR check at 2542233.

## Checks, item by item

**1. The diff against §2 items 1-11 and §8**

*Decision order in `decide`:* override, then HALT, then the lease (`leaseHeldBy`), then `judgeContinuity`, then `background_tasks`, then the plan, the human-blocked allow, `accountContinuation` and the block. The background text is unchanged, and the HALT probe now runs on background stops (item 5).

*The predicate (`judgeContinuity`):*
- **Git commands.** Exactly `log -1 --format=%H%x09%cI HEAD -- state/CUT-STATE.md`, `show <c>:state/CUT-STATE.md` and `show <c>^1:state/CUT-STATE.md`, all through `tryGit` with `{timeout: 2000, maxBuffer: 64 MiB}`. The stale-path `rev-parse HEAD` carries the same options.
- **Forbidden reads and paths.** No `--first-parent`, only `^1`, no working-tree read, no `path.join` in a git path, and `execFileSync` with no shell.
- **Fail open.** Every not-judged case passes. The empty log reads fresh with no stderr line.

*Accounting:* one shared routine. The stale path passes `planHash: null` and writes the stored hash back. The stale block takes no near-cap suffix and does not read the plan. The queue path is equivalent to fe1e6b7's.

*Texts:* the reason and the stderr line are byte-equal to §7's templates.

*Exports and `READING_ORDER`:* no new export (the export lists at fe1e6b7 and 2542233 are identical; the only addition is an import of the existing `parseSessionContinuity`). `READING_ORDER`'s header line is byte-unchanged. The new line 4 equals main's `AUTONOMY.md:488` minus the bullet and backticks.

*Seam:* the real `parseSessionContinuity` is called. The fixture block shape (heading, `flushed_at:`, `tip:`) matches the live `state/CUT-STATE.md` block. T16 runs the shipped CLI end to end.

*Text and scope:* no double-quote quotation in the added comments, README or §30. No profile path in the diff or the commit messages. Six files are in the diff: §7's five plus this form (append-only, +26/-0, prefix byte-identical).

*Merge:* a merge commit only (4b1f641), with no rebase or squash.

**2. Mutations — all 17 observed by me at 2542233.** For each, I applied it to the tree, ran the named test alone (1 test selected, 0 pass, 1 fail), then reverted with `git checkout`. Each first failing assertion matches its RECORDED MUTATION comment:

| # | Mutation | First failing assertion |
|---|---|---|
| M1 | `!==` | the reason equality; the queue reason is returned |
| M2 | `stale: true` | the `/^next: two-nodes-ready/` match |
| M3 | non-block text differs means stale | the regex |
| M4 | background allow moved first | `allow`, expected `block` |
| M5 | continuity before the override | `block`, expected `allow` |
| M6 | continuity before the lease | `block`, expected `allow` |
| M7 | stale branch ignores the cap | `block`, expected `allow` |
| M8 | no write on the stale path | "a stale block records its continuation" |
| M9 | null log read as stale | the regex on S4a |
| M10 | `^2` | the reason equality |
| M11 | `--first-parent` | the reason equality |
| M12 | missing parent copy read as stale | the regex |
| M13 | working-tree read | the reason equality |
| M14 | raw `\n` split in the judge | the reason equality |
| M15 | `maxBuffer` dropped | the reason equality |
| M16 | the step removed from `decide` | the CLI reason equality |
| M17 | directives line after PRECEDENTS | "directly after DECISIONS-PENDING.md", 5 vs 4 |

All 17 comments name their test and say "Observed at merge commit 4b1f641 with this change". No `stop-continuity-*` temp directories were left in `os.tmpdir()`. The worktree is clean at 2542233.

**3. `AUTONOMY.md` at 4b1f641.** The first 519 lines are byte-identical to main's. The only change is the append (+9/-0). §30's heading has an after-clause naming §29. The content matches §2 item 10's draft, in its own words: the drafted closing "governing form" bullet is folded into the intro, and the §26 proof gives T17's full name. There is no quotation. The §26 discharge claim resolves: T17 exists and asserts the adjacency and the exact line.

**4. §7 recount.** `git diff --numstat fe1e6b7..78681ec` with §7's exclusions gives 703 changed lines over 5 files: AUTONOMY 9, README 66, hooks.test 435, session-resume 5, stop-queue 188. The same command at 2542233 gives 703. The class 8 record is per the template's Round 25 additions, class 8:
- the heading and the first line carry "budget overrun, §7 not edited";
- declared 650/5 and final 703/5 at the named commit 78681ec, base fe1e6b7;
- the reason is given;
- §7 is unedited (the form prefix is byte-identical to main);
- nothing calls a `verify-mutation` run an observation.

**5. I1 record.**
- `git show 629d969:scripts/hooks/questions-mirror.test.mjs | sed -n 307p | sha256sum` gives 6ac977f4bdd0c3d43af18ebaa955e3391902e4b563f5d35654fb3dedfad33d13. That matches, with the final byte `\n`, and 629d969 is on main.
- PR #159 is MERGED as ec7465292b79305654932583a77aa0b8f5ea0ba2 (2026-10-02T19:56:51Z, on main).
- Question round 36, item 1 resolves to "Place it ahead of E (Recommended)" in the RULED block.
- `questions-mirror.test.mjs` is not in this diff (I5 does not fire).

**6. I6.** `fe1e6b7:state/CUT-STATE.md` is 279891 bytes, under 67108864.

**7. R1-R6 in the tests.**
- `core.autocrlf false`, `commit.gpgsign false` and `.git/info/attributes` `* -text` are set in `makeLedgerRepo`.
- T9 sets and restores `GIT_CEILING_DIRECTORIES`. I probed it on this machine, where `os.tmpdir()` is in 8.3 short form, and git honours the ceiling in both short and long form.
- Temp directories come from `os.tmpdir()` and are removed with `t.after`.
- `execFileSync` and `spawnSync(process.execPath)` run with no shell.
- `rev:path` and pathspecs are literal `/`.
- Branch names are read with `rev-parse --abbrev-ref`.
- No network: no origin remote, Telegram dry run. No timing assertion and no platform ignore.

**8. CI.** `gh pr checks 161`: 4 of 4 pass, all at head 25422334a1d6:
- DCO sign-off, run 37070560528;
- Exposure scan, run 37070560556;
- Governance CI pull_request, run 37070560509;
- Governance CI push, run 37070511321.

I did not need to wait.

## Exit codes (Windows, node v24.18.1, git 2.49.0.windows.1, worktree at 2542233; each tool named at its last-touching commit, all on main)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: **0**, 406 tests, 406 pass, 0 fail.
- verify-cites (@ 522e448): **0**.
- verify-quotes (@ f9444a4): **0**.
- verify-test-claims (@ e9735d4): **0**.
- `node scripts/plan/verify-mutation.mjs --base fe1e6b7 --head 2542233` (@ 7d24ed1): **0**, "all 17 new test(s) have a recorded mutation naming them". This checks that the comments exist; it is not an observation.
- `timeout 570 node scripts/plan/verify.mjs` (@ 2607202): **0**, verify:plan PASS.

## Read
- Worker report 2 at its renamed path, `C:/dev/spatial-ide/state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-2.md`. Its working-tree copy differs from the committed one (` M`); I did not modify it.
- `C:/dev/spatial-ide/state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-1.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md`
- The form, `C:/dev/wt/stop-hook-stale/scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`

No hook was run against the main checkout. Every hook and test execution ran in the worktree against temporary repositories, and the worktree is clean at 2542233.
