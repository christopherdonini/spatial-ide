*Custodian's filing note (2026-09-27): gate 1 (attempt 1), reviewer, full gating, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ 980b10c08cb9de2c5c133ecc46e65770bfcec293. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b): first filed at 252cdd1 under `state/consults/`, a misfiling corrected here. The text below the rule is the hand-back, byte-identical except for two things: the harness's two-space indent is removed, and the harness's pattern notice above the report (settings-json; the report's only such text is its note that `.claude/settings.json` is unchanged) is not transcribed.*

---

**FAIL (Correctness, Evidence and Documentation)**: `governance/exposure-profile-paths @ 980b10c08cb9de2c5c133ecc46e65770bfcec293`. Range `16df0d7...980b10c`. Nothing was edited, committed or pushed, and the worktree is clean at `980b10c`. The scratch directory `C:/dev/exp-gate-scratch` (a clone, a junction and the scan scripts) has been deleted, and no process I spawned is still running.

Output discipline: every scan ran from a node script that ran a canary on invented strings first and checked exit status. I read every file that could hold a profile path only after a redacting filter. No environment value appears here.

## Verdicts (AUTONOMY.md §22)

| Verdict | Result | Severity | Scope | Disposition |
|---|---|---|---|---|
| Correctness | **FAIL** | High | `scripts/hooks/profile-path-scan.mjs` (2c) | Blocks. The code needs fixing, and each fix needs a §4 test with a mutation. |
| Evidence | **FAIL** | Medium | Amendment 3 and the mutation records | Blocks. See E1–E4 below. |
| Documentation | **FAIL** | Medium | Amendment 3 (§8 item 10), the §4 deviations, round 15 (c) | One bounded record round after the code fix. |

## Blocking: Correctness

These cites are code at `980b10c`, which exists only on the branch.

**C1. Any added line starting with `++` bypasses the scan.**
- Where: `scripts/hooks/profile-path-scan.mjs`, lines 274 and 284 at `980b10c`.
- Cause: `parseAddedLines` treats a diff line `+++…` as a file header or skips it. An added line whose text starts with `++` becomes `+++…` in the diff, so it is never scanned.
- Live proof: an armed commit of `++ ` followed by an invented full Windows form exited **0**. The same path behind `+ ` or `-- ` was refused (exit 1).
- This falsifies the form under §5 "Falsification" ("an armed commit carrying one is accepted").
- Fix: parse the diff statefully, so header lines count only between `diff --git` and the first `@@`. Add a test whose mutation is the current header check.

**C2. The scanner fails open when its path contains a space or goes through a junction.**
- Where: `scripts/hooks/profile-path-scan.mjs`, lines 466–474 at `980b10c`.
- Cause: `isMain` compares `path.resolve(argv[1])` with a hand-decoded `URL.pathname`. That value is percent-encoded and is the real path, not the junction path. When the two differ, `main()` never runs, the canary never runs, and node exits 0.
- Live proof:
  - `--message` on an invented profile path exited **1** at a plain path, **0** under a directory with a space, **0** through a junction, and **1** with a lower-case drive letter.
  - Armed `git commit` of a profile path exited **0** with the hooks under a space path, and **0** with them through a junction.
- A profile directory with a space in it is exactly the population this piece protects.
- Fix: use `fileURLToPath` and compare realpaths, or give the CLI an entry point that always runs. The hooks should fail closed: require positive output from the scanner. Add a test that runs the hooks from a path containing a space.

**C3. 2c (iii) misses the local profile's flattened form.**
- Live proof: with an invented local name (via HOME and USERPROFILE), `C--Users-<local>-proj` was **accepted**. `Users<local>` and a relative `Users/<local>/` were refused.
- Cause: `-` counts as a segment character, so the extracted segment never equals `localName`.
- Why it matters: §1 excludes only flattened forms "other than the local profile's", so the form claims this one.
- Disposition: fix it, or narrow the claim in a class-2 record. The architect reads 2c (iii).

**C4. Cherry-pick and rebase get past the armed hooks.**
- Live proof: in an armed repo, `git cherry-pick` of a profile-path commit made unarmed exited **0**. `git rebase` carrying that commit onto a new base exited **0**.
- §1's "may claim" ("a commit is refused if…") and its "may not claim" list do not name this path.
- Disposition: record the narrowing (the architect's call). A code fix is not really available at hook level.

## Blocking: Evidence

**E1. A discharge claim with no resolvable proof.** Amendment 3's 2d/2e bullet says §5 prediction 4 is "discharged: every commit from `ccdccfd` onward went through both armed hooks … none was refused". It names no test and no line, and git cannot show that hooks ran.
- What git does support: I re-scanned every branch commit's message and added lines with the head scanner. All are clean except `41d0341`, which predates 2e.

**E2. A claim pinned to a commit where it does not hold.** Amendment 3 says "All 21 tests of §4 pass … commit `3a85540`".
- At `3a85540` the suite runs **20 pass / 1 fail**. `commit_msg_refuses_a_profile_path_in_full_and_8_3_form` fails because the commit-msg scanner call lands only in `ccdccfd`.
- For the same reason, that test's recorded mutation ("removed the scanner invocation block from `.githooks/commit-msg`") cannot have been observed at `3a85540`, the only commit the record names.
- No `RECORDED MUTATION` comment names the commit it was observed at. Round 25, item 2 (c) requires the failure to be recorded "with the commit it was observed at".

**E3. An unrecorded budget overrun.**
- Declared in the header budget, counted by §21c's rule (numstat, `16df0d7...980b10c`):

  | Item | Declared | Actual |
  |---|---|---|
  | Scanner | ≤ 240 | **478** |
  | Tests | ≤ 430 | **530** |
  | Hooks | ≤ 50 | 46 |
  | Normaliser | one line | 2 (1+1) |
  | **Total** | **≤ 720** | **1056** |

- No amendment records the overrun.
- The class-8 text reads "a line budget or a file count its §7 declares". This form declares its budget in the header, not §7. Either way it is an unrecorded overrun. It should be recorded as class 8 (`budget overrun, §7 not edited`), with the budget line never edited. The architect confirms the class.

**E4. The "staged before the STOP" disclosure.** Git cannot show what was in the index.
- `.githooks/pre-commit` first appears in `3a85540`; it is absent from `41d0341` and `fb7b96a`.
- `41d0341`'s own added lines are refused by `41d0341`'s own scanner (exit 1): a scanner comment carries an unlisted segment, fixed in `3a85540`.
- So if the pre-commit hook was on disk while `.githooks` was armed (Amendment 3 says it was armed "throughout"), `41d0341` could only have been committed with `--no-verify`. The worker should say which happened.

## Blocking: Documentation

**D1. §8 item 10 (record cap): Amendment 3 restates claims in prose** instead of giving references. Examples:
- "swept one at a time in-session back to a clean 21/21 pass after every revert";
- "the pre-existing baselined/advisory entries are unrelated to and unmoved by this piece's … edits";
- "Matches §3 exactly".

**D2. Round 15 (c): the "Suites (§9)" bullet names no commit** for the verify-cites, verify-quotes and verify-test-claims results.

**D3. Two §4 rows are contradicted by their tests, and neither deviation is in an amendment** (class 2):
- `commit_msg_dco_refusal_is_unchanged`: the row says "a merge skips DCO", but the test asserts an unsigned merge is **refused**. This is disclosed only in `3a85540`'s commit message.
- `a_scan_whose_git_read_fails_aborts_loudly`: the row says the hook "exits 2", but the test asserts the hook exits **1**. The scanner's exit 2 is asserted nowhere.

**D4. The base re-derivation's command and output are not recorded.** §0 item 1 says the closing amendment carries them. Amendment 3 records only a summary of the head run.

## Block-on-sight §8, items 1–13

1. **PASS.** The head scanner finds nothing in the net diff's added lines (exit 0), and 0 of 1082 tracked file names match.
   - Note: `41d0341` (unpushed) adds an unlisted-segment path form in a scanner comment. It is not the local account, and `3a85540` removes it. A merge that is not a squash puts that blob in main's history. The custodian decides.
2. **PASS.** Every untouched row is unchanged (`git diff --quiet` exits 0), including the Amendment 2 draft, `.github/`, `.claude/settings.json` and `CONTRIBUTING.md`. All five append targets are byte prefixes: added bytes are 432, 292, 204, 198 and 1969.
3. **PASS (recomputed).**
   - `--redact` over each file's `16df0d7` blob reproduces the `980b10c` bytes for all 7 whole-file substitutions. Counts are 1, 2, 19, 1, 1, 1 and 1 (26 in total, on 26 lines). Both JSON files parse.
   - 2a′: numstat 1/1, one hunk, and `--redact` on the removed line equals the added line.
   - The changed line lies in entry 49 after the bracket, and it is the only line in entry 49 with a finding at base.
   - At head, the ledger's only finding is in entry 110.
4. **PASS.** The scanner prints only `file:line class`, or counts.
5. **PASS.** The lists match 2c, and the local account is on neither list.
6. **PASS.** I ran the base and head `commit-msg` hooks live on 4 cases: unsigned regular 1/1, signed 0/0, unsigned merge 1/1, signed merge 0/0.
7. **PASS.**
8. **PASS** for presence: 21 of 21 tests carry a record. See E2 for the missing commits.
9. **PASS.** There are no line cites into the ledger and no bare self-lines.
10. **FAIL** (D1).
11. **PASS.**
12. **N/A.** The piece files none of the human's words.
13. **PASS.** N=6 was fixed at `c48a8dc` from `16df0d7`.

Round 25 checks: no record calls a `verify-mutation` run an observation. There are no hash pins at a branch commit. There is no class-9 addition. The five-line rule does not apply (this is the full form).

## The worker's disclosures, settled from git

- **Sign-offs.** Every commit is signed off: `3a85540`, `ccdccfd`, `209a9c3`, `1190057` and `980b10c` carry two `Signed-off-by` lines each, both the committer's; the merge `c48a8dc` carries one.
- **One argument to `commit-msg` at git 2.49.0: confirmed live.** In a scratch clone with debug hooks, `commit-msg` received exactly one argument in all 7 invocations, including the merges where `prepare-commit-msg` received `merge`. The pre-existing merge skip never held. The piece changes no DCO behaviour (item 6).
- **Equivalence** (whole-file and 2a′): recomputed and equal, as item 3 above.
- **Re-derivation at head:** 20 files, all in §2a's untouched rows as Amendment 2 revised them.
  - At current main `0c0b680`, the head scanner finds 28 files. These are those 20 plus the 8 files this piece rewords. Main's drift brings no new file.
  - `git merge-tree` of `0c0b680` with `980b10c` is clean.
- **Mutations: I re-observed 7**, each applied in the clone at `980b10c`, run, seen failing its named test (1 test, 0 pass, 1 fail), and reverted. After the reverts the full suite passed 21/21.
  - `the_canary_must_be_found_before_a_result_counts`
  - `a_scan_whose_git_read_fails_aborts_loudly`
  - `pre_commit_in_a_merge_refuses_only_lines_new_to_every_parent`
  - `commit_msg_dco_refusal_is_unchanged`
  - `the_local_profile_override_spares_machine_accounts`
  - `pre_commit_scans_staged_path_names`
  - `refuses_an_8_3_short_form_profile_path`
- **N on current main:** at `0c0b680`, `AI_DEVELOPMENT.md`'s last heading is "Amendment 5 to the Custodian role — the round-25 process rules", so N=6 still stands. 2g's rule still requires the merge immediately before the PR is marked ready.

## Suites (all at `980b10c`)

| Suite | Result |
|---|---|
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` | 336 pass, 0 fail |
| `profile-path-scan.test.mjs` alone | 21/21 |
| `cargo test -p spatial-kernel` (`CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target`) | exit 0: 281 passed, 0 failed, 28 ignored (36 result lines); all 8 `permission::audit::normalize` tests ok |
| verify-cites | PASS: 810 files, 41 loose references (advisory) |
| verify-quotes | PASS: 110 checked, 79 verified, 30 baselined, 1 advisory |
| verify-test-claims | PASS: 265 claims in 86 files |

## Live hook runs (head `.githooks`, on this machine, invented names)

| Refused (exit 1) | Accepted (exit 0) |
|---|---|
| Full form in content | Clean content |
| 8.3 form in content | `Public` and placeholder segments |
| `/home/` form in content | `++`-prefixed line (**C1**) |
| Full form in the message | Flattened local form (**C3**) |
| The real local profile, backslash and forward-slash forms | Space-path hooks and junction hooks (**C2**) |
| Unsigned commit | Cherry-pick and rebase (**C4**) |
| Unsigned merge | Signed merge (accepted, as it should be) |

## Suggestions

- **8.3 form without a drive letter** (by reading the code, not run): an 8.3 segment after `Users` with backslashes and no drive, such as `\Users\ABCDEF~1\`, matches none of the three roots. The architect reads 2c (ii)'s "with or without separators".
- **Merge commits:** `git merge` auto-commits run `pre-merge-commit`, not `pre-commit`. Under the merge reading this refuses nothing more, but §2c could say so.

## Nits

- `3a85540` also changes `'\u2026'` to `'…'`. It behaves the same but the commit message does not mention it.
- `marker` at line 374 of the scanner is unused.
- The test comments at lines 85–87 and 326–328 contain the worker's thinking out loud ("-- wait, …").
- `41d0341`, typed `docs(hooks)`, carries 475 lines of code.

## Files

- C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md
- C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs
- C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.test.mjs
- C:/dev/wt/exposure-profile-paths/.githooks/pre-commit
- C:/dev/wt/exposure-profile-paths/.githooks/commit-msg
- C:/dev/wt/exposure-profile-paths/AI_DEVELOPMENT.md
