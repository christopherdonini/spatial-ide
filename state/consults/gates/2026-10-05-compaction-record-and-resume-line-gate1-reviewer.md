# PR #181 gate 1 — reviewer
Reviewed: cut/compaction-record-and-resume-line @ 59394e498577b7d359d150970cba908421833fcc

**Verdict: PASS.** No Correctness or Evidence finding. Three Documentation and record findings (D1 to D3) are to be fixed in this pull request before the merge, under the proportional-gates rule. They cause no correction round and no re-gate. The base is the merge base on main, 30f127a499193f370fdfe0f30ff9a7d99c05d59d. Everything ran on Windows 10 Pro 19045 with node v24.18.1 and git 2.49.0.windows.1, in the worktree `C:/dev/wt/crr`, on 2026-10-05 (UTC).

## Correctness: none

## Evidence: none

## Documentation and record (fix in this PR before the merge; none of these fails the gate)
- **D1. A quotation that no longer matches its source.** `scripts/hooks/precompact-flush.mjs:34` @ 59394e49 is an unchanged line. It keeps a double-quoted fragment attributed to AUTONOMY §7: "a second PreCompact within 15 minutes is allowed". This diff edits that §7 bullet: `AUTONOMY.md:182` @ 59394e49 now reads "a second manual PreCompact … **allowed**". The fragment therefore no longer matches its source. It was not an exact match at the base either, because of the bold. The quotation is not of the human's words. Fix: drop the quotation marks, or label the fragment a paraphrase.
- **D2. Literal line breaks inside template literals.** `scripts/hooks/precompact-flush.mjs:213-214` and `:222-223` @ 59394e49 write the record newline and the `withNote` separator as literal line breaks inside template literals. The rest of the file uses `\n`. The behaviour is correct: template literals normalise CRLF to LF, so a CRLF checkout still writes LF, and T1 asserts the trailing newline. It reads like an escape that collapsed. Fix: use `\n`.
- **D3. `trigger` is recorded as `null` when it is not a string.** `scripts/hooks/precompact-flush.mjs:206` @ 59394e49 does this. Form §7 and the README say "as received, else null", so a numeric or object `trigger` would be received but recorded as `null`. The decision does not change, because every value other than the string `manual` is non-manual anyway. Fix: either word it "a string as received, else null" in the README and the closing record, or record the value as received.

## Suggestions (no action required)
- **Negative age.** In `session-resume.mjs`, `resumeLine` can print a negative age when the clock is behind `flushed_at`. Form §1 disclaims ages under clock skew, so this is not a defect. Clamping the value, or printing `unknown` for a negative age, would make the behaviour explicit.
- **Why deviation 1 was needed.** The form's own P4 and P5 fixtures cannot kill M4. Under `trigger !== 'auto'`:
  - P4 (fresh, auto) still allows and records `allowed-fresh`.
  - The absent and `other` calls still take the non-manual branch.

  Deviation 1's extra stale `auto` case is what kills M4. The closing record should give this as the reason for the deviation.

## §8, item by item
1. **No non-manual path can block or touch `lastBlockedAt`. Clean.**
   - `decidePrecompact` handles a non-manual call at `precompact-flush.mjs:230-241` @ 59394e49 and returns before `statePath`, `readJson` or `writeJson` is reached.
   - Both of those returns are `allow`, and `appendRecord` touches only the `.jsonl`.
   - T4's `mix` case proves that the `.json` is not read. The automatic call after a manual block records `recorded-only`, not `allowed-second-chance`, and the `.json` stays byte-identical.
2. **The manual path is unchanged. Clean.** The order is the same: second chance, then freshness, then the `lastBlockedAt` write and the block. The returns and stderr are the same, except that a `withNote` suffix is added when the append fails.
3. **The record append. Clean.**
   - The append runs in its own try/catch (`:203-218`).
   - `custom_instructions` is not among the fields, and T1 asserts that it is absent.
   - The cloud guard exits before `main()` (`:309-312`).
4. **The resume line's git calls. Clean.**
   - `execFileSync('git', args, …)` is called with `cwd`, `timeout: RESUME_GIT_TIMEOUT_MS` (2000) and stderr ignored. There is no shell.
   - `tip` reaches git only after `TIP_GUARD` (`/^[0-9a-f]{7,40}$/`) matches.
   - The resume line is appended to `parts` after the block or note, and T6 asserts that order.
5. **`AUTONOMY.md`. Clean.**
   - `git diff -U0` shows only the hunks `-182,2 +182,2` and `-187 +187`, which are §7's design, SessionStart and dry-run bullets.
   - The file has 528 lines at the base and 528 at the head.
   - I extracted the quoted `reason: "PRE-COMPACTION…"` span by grep, which found one match at each revision. Its sha256 is 7427abae2dded7bbf1436594152c5f3f0b3aeb5515eff8eb1f72e896a564c620 at both 30f127a4 and 59394e49.
6. **`.claude/settings.json` and `tools/mods/`. Clean.** `git diff --name-only 30f127a4..59394e49 -- .claude/settings.json tools/mods/` lists no paths, and nothing installs or loads a mod.
7. **No new export, option or file. Clean.**
   - Both modules' export lists are unchanged.
   - The new functions are module-local: `recordLogPath`, `readFlushedAt`, `appendRecord`, `withNote`, `resumeGit` and `resumeLine`.
   - `decidePrecompact`'s options and `buildOutput`'s signature are unchanged.
   - The diff touches exactly §7's five files.
   - Caller rule: every new function has a caller in product code.
8. **The new tests. Clean.** They spawn `process.execPath` with no shell and use no network. Temp directories are removed with `t.after`, through `makeLedgerRepo` or explicitly in T7. There is no platform ignore, and T1 to T7 each carry a `RECORDED MUTATION`.
9. **User-profile paths. Clean.** A grep of the full diff (`git diff 30f127a4 59394e49 | grep -iE 'Users[/\\]|C:[/\\]Users'`) finds nothing (rc 1). CI's profile-path check passes.
10. **Quotations. Clean for new text.** The new comments, the README text and the §7 edits contain no quotation. The README's backticked stderr and resume formats are the hook's own output strings. The pre-existing line 34 is covered by D1.
11. **Mutation records. Clean.**
    - Worker report 1 says no `verify-mutation` run was used as an observation, and it names 562b7d84 for each mutation.
    - 59394e49 is comment-only: every added line starts with `//`, so the tested code is identical at both commits.
12. **§7 size. Clean.** The count is 405 lines of a 450 ceiling, over 5 of 5 files. There is no overrun, the §7 line is unedited, and there is no scope addition.
13. **Record form. Clean.** Each `Observed at commit 562b7d84` in the test comments names its commit id. No test-text span is pinned by hash, and there is no line cite into the ledger.
14. **Merge form. Not yet applicable**, because the PR has not merged. The branch is linear on 30f127a4.

## M1 to M7, observed by me at 59394e49 in `C:/dev/wt/crr`
For each mutation, I applied it with `sed -i` and ran the named test alone with `node --test --test-name-pattern="^<name>$" scripts/hooks/hooks.test.mjs`. Each run reported `tests 1`. I then reverted with `git checkout -- <file>` (rc 0 each time), and `git status --porcelain` was empty after every revert.

- **M1** (`:213`, `appendFileSync` changed to `writeFileSync`), T1: rc 1. The first failing assertion is `the second call appends, it does not overwrite`, actual 1, expected 2.
- **M2** (`:230`, the condition replaced by `false`, so every call takes the manual path), T2: rc 1. `result.status` was actual 2, expected 0.
- **M3** (`:263`, `writeJson(recordPath, { lastBlockedAt … })` deleted), T3: rc 1. Actual 'block', expected 'allow'.
- **M4** (`:230`, the condition changed to `input.trigger !== 'auto'`), T4: rc 1. `p5-auto`: actual 'block', expected 'allow'.
- **M5** (the `try {` at `:203` and the catch at `:216-218` deleted), T5: rc 1. The test throws `EISDIR: illegal operation on a directory, write`. This was a literal removal, not the worker's rethrow.
- **M6** (`session-resume.mjs:91`, the filter `&& !l.startsWith('??')` dropped), T6: rc 1. Actual '2', expected '1'.
- **M7** (`session-resume.mjs:72`, `return null;` changed to `return '0';`), T7: rc 1. The regex expecting `commits_past_tip=unknown modified_tracked_files=unknown` failed against `Resume facts: block_age_min=3 commits_past_tip=0 modified_tracked_files=1`.

Each first failure matches the assertion the worker recorded. These are observations by hand. The `verify-mutation` run listed further down is not an observation of any mutation.

## §7 recount
I ran the form's own command, which exited 0:

`git diff --numstat 30f127a499193f370fdfe0f30ff9a7d99c05d59d..59394e498577b7d359d150970cba908421833fcc -- . ':!scripts/hooks/COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`

| File | Added | Deleted |
|---|---|---|
| `AUTONOMY.md` | 3 | 3 |
| `README.md` | 35 | 5 |
| `hooks.test.mjs` | 223 | 1 |
| `precompact-flush.mjs` | 71 | 15 |
| `session-resume.mjs` | 49 | 0 |

The total is 381 + 24 = **405** lines (ceiling 450) over **5** files (ceiling 5). This matches worker report 1's §7 figures.

## Worker report 1's deviations
1. **T4 asserts more than P4 and P5. Sound.** The extra cases add assertions and weaken nothing. They are also necessary, because P4 and P5 alone pass under M4 (see Suggestions). The `mix` case also proves the "neither reads" half of may-claim 1.
2. **M5 applied as a rethrow. Sound.** I observed the literal removal, and it gives the same failure.
3. **The README's "Contract, quoted" paragraph left as is. Sound.** §2 item 7 forbids only new quotation. The one quoted clause that was removed, about the context-limit recovery, is the one §2 item 5 drops.
4. **G1 refused one heredoc. Process only.** It has no effect on the product.
5. **A fresh non-manual call reuses the existing fresh stderr line. Sound.** §7 declares lines only for `recorded-only` and for a record failure. The fresh line states the hook's own fact (round 7), and §2 item 1 requires only allow plus `allowed-fresh`.

## Seams
- **PreCompact stdin to `trigger`:** consumed as Amendment 1 records it (`manual` | `auto`). T2 spawns the shipped CLI with the hook's stdin shape: `session_id`, `hook_event_name`, `trigger`, `custom_instructions` and `cwd`.
- **session-resume to `parseSessionContinuity`:** the existing export, called with its real signature `(text)`. It returns its real shape, `{ flushedAt, tip, block }` or `null`.
- **The real ledger shape:** I ran the shipped session-resume CLI read-only against this worktree's own `state/CUT-STATE.md`, with `echo '{}' | CLAUDE_PROJECT_DIR=C:/dev/wt/crr timeout 30 node scripts/hooks/session-resume.mjs` (rc 0). Its last line was `Resume facts: block_age_min=55 commits_past_tip=3 modified_tracked_files=0`. Both numbers are correct:
  - There are three commits from 185bd85f to 59394e49.
  - The age matches `flushed_at: 2026-10-05T21:06:51Z` against `date -u` at 22:02:39Z.

## Suites and checks at 59394e49, on Windows
Each tool's commit is the last commit that touched it at the head.

- **The node suites:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exited rc 0, with 450 tests, 450 passing and 0 failing.
- **Writes under `.claude/state/`:** no test wrote under the main checkout's `.claude/state/`. A sorted `ls -la --time-style=full-iso` of it was identical before and after the suite (`diff` rc 0). The worktree has no `.claude/state/` after the run.
- **verify:plan:** `node scripts/plan/verify.mjs` @ 260720226f136d1ec7d72da64656f07d29400ed7, rc 0, `verify:plan PASS`.
- **verify:cites:** `node scripts/plan/verify-cites.mjs` @ 522e448d55e089b974e115e23f0c72bfc6e1120a, rc 0, PASS. It advised 34 loose references, none of them in this diff.
- **verify:quotes:** `node scripts/plan/verify-quotes.mjs` @ f9444a4d99a9087394c55d4b1d4c414a8b11f980, rc 0, PASS (121 checked, 90 verified, 30 baselined).
- **verify:test-claims:** `node scripts/plan/verify-test-claims.mjs` @ e9735d4749f094f03b69a8b570e8bf10f511c279, rc 0, PASS (502 claimed).
- **verify:mutation:** `node scripts/plan/verify-mutation.mjs --base 30f127a4… --head 59394e49…` @ 7d24ed155a120556d6e726eea68237409270d975, rc 0: "all 6 new test(s) have a recorded mutation naming them".
  - T3 is pre-existing, so the tool does not list it; its comment is present.
  - This is a tool check, not an observation of a mutation.
- **CI:** `gh pr checks 181`, rc 0. All six checks pass:
  - cfg boundary (PORTABILITY R2), twice;
  - every commit is signed off;
  - no profile path in the range;
  - test · verify:plan · queue/site drift, twice.
- **The PR:** `gh pr view 181` shows head 59394e498577b7d359d150970cba908421833fcc, base main, state OPEN.

## Other commands and their exit codes
- `git status --porcelain` and `git rev-parse HEAD` in the worktree, at the start and at the end: empty and 59394e49…, rc 0.
- `git merge-base origin/main HEAD`: 30f127a4…, rc 0.
- `git diff origin/main...HEAD`, the full diff, by file: rc 0.
- `git show <rev>:AUTONOMY.md | wc -l` at both revisions: 528 and 528, rc 0.
- `git show 59394e49 | grep '^[-+]' | grep -v '^+++\|^---' | grep -v '^+//'`: rc 1, meaning every added line is a comment.
- `node --version`, `git --version` and `date -u`: rc 0.

The worktree is left at HEAD 59394e498577b7d359d150970cba908421833fcc with `git status --porcelain` empty. Nothing was committed or published.
