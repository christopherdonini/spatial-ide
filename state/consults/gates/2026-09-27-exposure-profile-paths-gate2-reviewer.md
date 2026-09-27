*Custodian's filing note (2026-09-27): gate 2 (attempt 2), reviewer, full gating, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ da80db006bb2e601b517a816498373f200f0b880. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for two things: the harness's two-space indent is removed, and the harness's pattern notice above the report (settings-json; the report's only such text is its note that `.claude/settings.json` is untouched) is not transcribed. Custodian's fact on C1: this machine's account name is ASCII-only (checked by boolean), so the octal-escape path could not print it here.*

---

**Gate 2 (reviewer, attempt 2), `exposure-profile-paths`: FAIL.** Reviewed `governance/exposure-profile-paths @ da80db006bb2e601b517a816498373f200f0b880`, three-dot against `origin/main` (`cec34b8`, merge base `00cf306`).

## Verdicts (AUTONOMY.md §22)

| Verdict | Result | Severity | Scope | Disposition |
|---|---|---|---|---|
| **Correctness** | **FAIL** | major | narrow: the printed path of a content finding | Fix C1, then re-observe the affected tests. |
| **Evidence** | **FAIL** | minor | two 4.3 tests are narrower than their rows | Widen E1 and E2 in the same fix round. Every other piece of evidence held when I re-ran it. |
| **Documentation** | **FAIL** | minor to moderate | Amendments 5 and 6, one appended line | Fix D1 to D5 in the closing record of the fix round. |

## Blocking: Correctness

**C1. A refused segment is still printed, octal-escaped (§8 item 4; 4.1(e); the gate-1 finding F4 is not fully closed).**
- **What I ran.** HOME and USERPROFILE ended in an invented non-ASCII name, `zoëQ`. I staged `docs/Users-zoëQ/n.txt` holding one invented full-form path and made an armed `git commit`.
- **Result.** The commit exits 1. Its stderr is:
  - `"b/docs/Users-zo\303\253Q/n.txt":1 unlisted-segment`
  - `docs/Users-<redacted:profile>/n.txt:0 local-profile`
- **Why.**
  - `parseAddedLines` takes the file name from the `+++ ` header. Under the default `core.quotePath`, git C-quotes a non-ASCII name there.
  - The `^b\/` strip then misses, and `redactSegments` cannot match the escaped bytes, so it prints them.
  - The staged-name scan is correct, because it reads the name from the `-z` list.
- **Impact.** Every content finding in a file whose path carries a non-ASCII local account name prints the segment as octal escapes.
- **Why no test caught it.** `no_printed_path_carries_a_refused_segment` uses an ASCII name, and its staged file has no content finding.
- **Fix.** Take content-finding file names from the `-z` names, or run the diff with `-c core.quotePath=false` and unquote. Add a test with a non-ASCII invented local name; the listed `josé` works, because rule (iii) overrides the list.

## Blocking: Evidence

- **E1.** 4.3's row for `the_local_profile_flattened_form_is_refused` says HOME and USERPROFILE end in a *listed* invented name. The test uses `flattenedQ`, which is not listed.
  - So the test never proves that (iii) overrides the list for the flattened form.
  - The behaviour itself is correct: `scanText('Users-someone', {localName:'someone'})` gives 1 finding.
- **E2.** `the_hooks_name_the_scanners_status` ("the hooks") tests only `pre-commit`. `commit-msg`'s messages for exits 2 and 3 are untested.
  - My live run shows they are correct: stub exit 2 names an aborted scan and the hook exits 2; stub exit 3 names the canary and the hook exits 3.

## Blocking: Documentation

**D1. The closing record omits two commands its rules require.**
- Amendment 6 describes the re-derivation and the prediction-4 check but gives neither command, though 4.7(ii), 4.9 and 4.13 step 6 require them.
- 4.9 declared the messages scanned under `--message`; the record says `scanText`.
- The record gives the range as `ccdccfd~1..HEAD (8 commits)`. HEAD is a moving default: at head, first-parent, it is 9 commits. Name M.

**D2. Unresolvable discharge claims (round 7, by name).**
- 4.1(h), (j) and (k) are "discharged" against the scanner and the two hooks. They actually live in `PUBLIC-AUDIENCE-AUDIT.md` and `PRE-PUBLIC-CHECKLIST.md` (h), the test file (j), and `AI_DEVELOPMENT.md` (k).
- 4.1(a) to (g) name files, not the 4.3 tests that prove them.
- 4.9 is discharged as "declarative", but it requires a run and its command.
- 4.7 is discharged, but its last-merge-before-ready leg is open.

**D3. The Disclosure bullet contradicts the preregistration.** It says "this piece is local-only and files no PR". That contradicts 4.8(c) (the PR body asks for a merge, never a squash) and 2g/4.7 (a merge immediately before ready). Main is at `cec34b8`, so the final merge and its class-1 row are still owed.

**D4. Amendment 5's first line lacks class 8's required words.** The class-8 text in `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions requires `budget overrun, §7 not edited` in the first line. This form declares its budget in the header, not §7, under 4.6's reading, but "budget overrun" is missing too. Otherwise the overrun is recorded as class 8 and the Budget line is not edited.

**D5. The cargo result has no counts.** "Every binary green, 0 failed" is all the record says. The counts are in the suites table below.

## Live cases (armed hooks at the head; invented names only; stdout and stderr checked by script for the segment and the real name)

Every row showed no segment in output, except the L7 non-ASCII row (C1).

| Case | Result |
|---|---|
| Added line beginning `++` (and `-- `) | refused, 1 |
| Hooks from a path with a space (byte copies) | staged and message refused; clean commit accepted |
| Through a junction; space plus junction | refused; clean commit accepted |
| Lower-case drive `c:/` as hooksPath, and as the CLI's argv | refused, 1; clean commit accepted |
| Local flattened form: `Users-<n>`, `home<n>`, `users--<N>` in a message | refused; control with a different local name accepted |
| Scissors under `-F`, `-F --cleanup=scissors`, `-m`, `-m --cleanup=scissors` | all refused |
| Driveless 8.3: backslash, forward, path name, message | all refused |
| Refused staged path name, ASCII local name (also with non-ASCII elsewhere in the path) | refused; printed as `Users/<redacted:profile>/…`, no segment |
| Refused staged path name, **non-ASCII** local name | refused; **segment printed octal-escaped (C1)** |
| Stub scanner exits 0 and prints nothing | pre-commit exits 2, commit-msg exits 2; "reported no result" |
| Stub prints the clean line plus an extra line | refused, 2 |
| Stub prints only the clean line (control) | accepted |
| Stub exits 2 / 3, both hooks | hook exits 2 / 3; aborted / canary named |
| Cherry-pick; rebase; `git merge`'s own commit, content | accepted; all narrowed in 4.2 |
| `git merge -m` carrying a path | refused, 1 |

## Mutations re-observed

- **How.** 12 mutations at C `8f7698e`, run in a `git archive` export with TMP pointed at the scratch dir. For each: apply, run the named test, revert, run again.
- **Result.** Each unmutated run passed 1/1. Each mutated run failed 1/1 on an `ERR_ASSERTION` naming the test. Each reverted run passed 1/1.
- **All 9 new tests of 4.3:**
  - `an_added_line_beginning_with_plus_plus_is_scanned`
  - `the_cli_scans_from_a_path_with_a_space_or_through_a_link`
  - `pre_commit_fails_closed_without_a_clean_line`
  - `commit_msg_fails_closed_without_a_clean_line`
  - `the_hooks_name_the_scanners_status`
  - `a_message_line_below_a_scissors_line_is_scanned`
  - `the_local_profile_flattened_form_is_refused`
  - `refuses_an_8_3_segment_under_users_without_a_drive`
  - `no_printed_path_carries_a_refused_segment`
- **Plus the 3 changed tests:**
  - `commit_msg_refuses_a_profile_path_in_full_and_8_3_form`
  - `the_local_profile_is_refused_even_when_listed`
  - `the_local_profile_override_spares_machine_accounts`
- C to head is empty for the scanner, the test file and both hooks.

## Recomputed from the tree

- **Re-derivation.** Every tracked file, this piece's own `scanText` with the real local name:

  | Revision | Files scanned | Files with findings |
  |---|---|---|
  | `00cf306` (merge base) | 1109 | 30 |
  | M `251fd80` | 1113 | 22 |
  | head `da80db0` | 1113 | 22 (identical to M) |

  - The 22 are §2a's 20 untouched rows (with Amendment 2's draft) plus two files absent at `16df0d7`:
    - `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, unlisted-segment;
    - `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md`, 8.3.
  - No finding sits in a file name.
- **The custodian's fact, confirmed by class.** The engine file's one finding is a POSIX `/Users/` root whose segment is exactly one character, `|` (regex alternation), in a list introduced by a line naming grep. It is a false positive on a pattern.
- **The gate-1 report's hit** is an 8-character 8.3 segment. It is neither the real name nor its short-name prefix.
- **Ledger.** At M and at head the only finding is in entry 110. At `00cf306` and `origin/main` there are findings in entries 49 and 110.
- **2a′** (at `origin/main...HEAD`, and again at `00cf306...251fd80`):
  - numstat 1/1, one hunk;
  - the removed line is entry 49's single located line, in the status prose after the bracket;
  - `redactRoots` of the removed line equals the added line (count 1);
  - the added line scans clean.
- **Prediction 4 (reduced).** First-parent `ccdccfd`..M, 8 commits:
  - every message is clean under the shipped CLI's `--message` (exit 0 plus the clean line);
  - every non-merge `+` line under `git show -U0 --format=` has 0 findings, with and without the local name;
  - `da80db0` is also clean.
- **§8 item 1.** `origin/main...HEAD`: 2123 added lines and 19 names, 0 findings.

## Suites at the head

| Suite | Result |
|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 345 pass, 0 fail (the scanner file alone: 30/30) |
| `cargo test -p spatial-kernel`, unfiltered, `CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target` | 36 result lines (35 test binaries plus doc-tests): **281 passed, 0 failed, 28 ignored, 0 filtered**; lib 121, including the 3 normaliser tests |
| verify-cites | PASS (825 files, 32 loose advised) |
| verify-quotes | PASS (110 / 79 / 30 / 1 / 0) |
| verify-test-claims | PASS (284 claims, 88 files; 11 / 3 / 15 advisory) |

## Commits and figures

- **Commits.** All commits in the lineage are signed off; M carries two Signed-off-by trailers, which is harmless. 19 files; `PLAN.yaml`, `.github/**`, `.claude/settings.json` and `CONTRIBUTING.md` are untouched. `.githooks/pre-commit` is 100755 with LF endings.
- **Untouched and append-only files.** The five append targets are byte-prefix appends over `origin/main`. All 18 untouched files I checked are unchanged.
- **Amendment 5 figures resolve.**
  - At C, three-dot from `16df0d7` (C's merge base): 548 + 105 (98 + 7) + 877 + 2 = 1532.
  - 1532 − 1056 = 476, and 1056 is my gate-1 E3 total.
  - The append targets total 39 (12 + 10 + 11 + 2 + 4).
  - 19 files at C and at M.
- **Amendment 6 references resolve.**
  - N = 6: `00cf306` and `cec34b8` carry headings 1 to 5.
  - `0ffe80c` added the E4 answer.
  - `16df0d7` and `00cf306` are on main.
  - Neither record uses a hash pin or calls a verify-mutation run an observation.

## Suggestions

- **A load failure is reported as a finding.** When node itself exits 1 (scanner file missing, load error), the hook says "carries a profile path". I verified this live with the scanner removed. The hook still fails closed, but the message states a false scanner fact.
- **Type changes are not scanned.** `--diff-filter=ACMR` skips T, so a symlink replaced by a file with a profile path passes. This is declared in 2c.
- **The flattened-form separator run excludes `_`, `.` and space.** These are declared values, but 4.1(f)'s "§1's exclusion … describes a met claim" reads broader than the declared run.

## Nits

- `AI_DEVELOPMENT.md`'s appended rule ends "(4.1(k))", which resolves to nothing in that file. Name the preregistration's Amendment 4, or drop it.
- Some `RECORDED MUTATION` "Observed:" claims say "all four / six / three sub-cases / both assertions failed". A node assert stops at the first failure: my re-run of `commit_msg_refuses…` stopped at the first `notEqual`. Record the first failure, or state per-sub-case runs.

## Hygiene

- Values of `$USERNAME` and `$COMPUTERNAME` were never printed.
- The canary was checked first in every scan script.
- Every spawn had a timeout.
- The scratch dir `C:/dev/exp-gate2-scratch` was created fresh. Its two junctions were removed as links only, then the dir was deleted.
- The worktree `C:/dev/wt/exposure-profile-paths` is clean at `da80db0`. I edited, committed and pushed nothing.

Files at issue:
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.test.mjs`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` (Amendments 5 and 6)
- `C:/dev/wt/exposure-profile-paths/AI_DEVELOPMENT.md`
