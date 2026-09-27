*Custodian's filing note (2026-09-27): gate 3 (attempt 3), reviewer, full gating, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ 4155fcf21c784e64ad8daea06fbb819c1e79b426. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for two things: the harness's two-space indent is removed, and the harness's pattern notice above the report (settings-json; the report's only such text is its note that `.claude/settings.json` is untouched) is not transcribed.*

---

**Gate 3 (reviewer, attempt 3), `exposure-profile-paths`: FAIL, on Documentation only.** Reviewed `governance/exposure-profile-paths @ 4155fcf21c784e64ad8daea06fbb819c1e79b426`, three-dot against `origin/main` (`254fbfa`; the merge base is `254fbfa`, and M′ `f7a19e9` is the last merge).

## Verdicts (AUTONOMY.md §22)

| Verdict | Result | Severity | Scope | Disposition |
|---|---|---|---|---|
| **Correctness** | **PASS** | — | scanner, both hooks | C1 is closed live and by test. Every earlier live case still holds (95 rows plus 3 merge re-runs). |
| **Evidence** | **PASS** (one note) | low | cargo record | Everything re-ran and matches: mutations, 2a′, prefixes, re-derivation, prediction 4, suites, CI. The note is that the worker's `280/1` cargo result did not reproduce (see Suites). |
| **Documentation** | **FAIL** | moderate | Amendments 8 and 9 | Fix G3-D1 to G3-D6. This fails on Documentation alone, so it opens **record round 1** (7.13's count; A2's record-round note). |

## Blocking: Documentation

- **G3-D1. Amendment 8's first line still lacks class 8's words.**
  - The words required are `budget overrun, §7 not edited` (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions, class 8).
  - The first line reads "the budget (class 8; round 25, item 2; 7.10)… The header Budget line is not edited."
  - This is the third time: R2-D4 and A2-D5 both raised it, and 7.10's first sub-bullet committed to fix it.
  - Round 25 item 2's by-name failure itself does **not** fire. The overrun is recorded as class 8, and the header Budget lines are byte-unchanged since `7037d7a` (the form at head starts with the `7037d7a` bytes).
- **G3-D2. Amendment 8 breaks 7.10's other two sub-bullets.**
  - Its "Reason for the overrun" is a prose argument ("each needed the same shape of fixture… not scope volunteered beyond them"). 7.10 says the reason is given "by reference to 4.1, 4.3, 7.1 and 7.3 only".
  - 7.10 says to record "every header figure", but the 300-minute figure is declined ("not this amendment's to state").
- **G3-D3. The re-derivation's command and output are not recorded as 7.13 step 6 orders.** This repeats A2-E3 and R2-D1.
  - The command is described ("a one-off `git ls-tree` / `git show` import of… `scanText`"), not recorded verbatim.
  - At `254fbfa` the output is only "1118 files, 30 with findings", with no paths.
  - At M′ only 2 of the 22 files carry a class, and none carries a count. Step 6 requires path, form class and count for each.
- **G3-D4. The prediction-4 command ends at a moving HEAD.** This repeats R2-D1 and is the very defect 7.8(b) corrects.
  - The recorded command is `git rev-list --first-parent --reverse ccdccfd~1..HEAD`, and the record says 15 commits.
  - 7.13 step 6 requires "ccdccfd to M′, both named by id".
  - Run at the reviewed head, the recorded command gives **16** commits, not 15. Write `f7a19e9`.
- **G3-D5. Amendment 9 re-carries restatement.** This is §8 item 10, the record cap, and 7.12.
  - The verify-quotes bullet repeats "unrelated to and unmoved by this piece" word for word. That is the clause A2-D1 named at gate 2 as a repeat of gate 1's R-D1, and 7.12 says Amendment 9 "does not re-carry its restating clauses".
  - The Mutations bullet again narrates the procedure.
  - The cargo "Disclosure" argues in prose ("Not this piece's regression: …").
- **G3-D6. A discharge claim that does not resolve (round 7, minor).**
  - Amendment 9 discharges "7.3 and 7.4, by reference to 7.9's discharge map", but 7.9 has no 7.3 or 7.4 row.
  - It also says 7.9's "rows for 7.1(a)-(d) name the tests", but row 7.1(d) names the `AI_DEVELOPMENT.md` bullet, not a test.
  - Both do resolve in substance, through 7.3's own table and the `RECORDED MUTATION` comments. Cite those instead.

## Gate-2 findings against the head

| Finding | Status | Proof |
|---|---|---|
| R2-C1 (octal-escaped segment) | **Closed** | `cUnquoteGitName` in `parseAddedLines`; test `a_content_finding_under_a_non_ascii_local_name_prints_no_segment`; its mutation re-observed; the live rows below |
| R2-E1 / G5 (flattened form, listed name) | Closed | the test uses `someuser`; mutation re-observed |
| R2-E2 / A2-E5 (`commit-msg` status messages) | Closed | `the_commit_msg_hook_names_the_scanners_status`; mutation re-observed; live stubs return 2 and 3 |
| R2-D1 | **Partly open** | `--message` is fixed, and the cargo counts are there. The commands and the HEAD range are G3-D3 and G3-D4. |
| R2-D2 / A2-D4 | Closed by 7.9, apart from G3-D6 | every test and section named in 7.9 exists |
| R2-D3 / A2-D2 / A2-D3 | Closed | 7.11 withdrawal; the PR body carries 4.8(c) |
| R2-D4 / A2-D5 | **Open** | G3-D1, G3-D2 |
| R2-D5 | Closed | Amendment 9 gives counts |
| A2-E1 (Windows-form HOME on POSIX) | Closed | governance-ci run `36336589025` on `ubuntu-latest` at `955e6c7`: 349/349, including `✔ the_local_profile_is_refused_even_when_listed` |
| A2-E2 | Closed by 7.8(a) | my re-derivation at `00cf306` gives 1109 files, 30 with findings |
| A2-E3 | **Partly open** | G3-D3, G3-D4 |
| A2-E4 | Closed | my prediction-4 run under the shipped `--message` is clean |
| A2-N1 (overlapping matches) | Closed | the containment filter; `a_redaction_counts_…_once`; the live CLI `--redact` and `--redact-segment` rows |
| A2-N2 | Recorded as a deviation (7.5) | the code comment matches |
| A2-N3 | Routed (7.6) | the `exposure-scan-followups` node on main at `254fbfa` names it |
| A2-D1 | **Fires again** | G3-D5 |
| A2-D6 / R2 nit | Closed | `ebf0843` names the form and Amendment 4 |
| Judge item 4 | Recorded as a limit (7.7) | routed |
| Load failure named a finding (R2 suggestion) | Closed | 7.1(c); stubs for throw-at-load, exit 1 with no line, and a missing scanner all return 2 with "reported no result" |

## Live cases (head's armed hooks, invented names only)

- **Setup.** HOME and USERPROFILE were set to invented names. `GIT_CONFIG_GLOBAL` pointed at an empty file, and TMP at the scratch dir. Every spawned process had a 60 s timeout.
- **Leak checks.** A script checked stdout and stderr for the segment (ignoring case), for its octal escape, and for the real local name (a boolean only). Every row was false on all three, and the output files scanned with 0 findings.
- **Result.** 95 of 95 as expected, after re-running the 2 merge rows signed. My first two merge rows were unsigned, so the DCO check refused them first. Signed, they pass as expected, and an unsigned `--no-edit` merge is refused by DCO.

| Case | Result |
|---|---|
| Content: full form (`\` and `/`), 8.3, `/home/`, POSIX `/Users/` | 1 |
| Added line beginning `++`, `++++`, `--`, `---`; a `diff --git` lookalike line | 1 each |
| Clean content; `Public`, placeholders, a listed name, `runner` | 0 |
| Local name `\` and `/`; listed `someone` as the local name | 1; `runner` as the local name is spared (0) |
| Flattened `C--Users-<L>-proj`, `Users<L>`, relative `Users/<L>/`, `home-<L>-x`; in messages `Users-<L>`, `home<L>`, `users--<L upper>`; listed `someuser` | 1 each; the control with another local name gives 0 |
| Driveless 8.3: `\`, `/`, a path name, a message | 1 each |
| Staged path name with an ASCII local name (also with non-ASCII elsewhere in the path); with a non-ASCII local name | 1; printed with `<redacted:profile>` |
| **C1:** local `zoëQ`, a content finding in `docs/Users-zoëQ/n.txt`; also `docs/Users/zoëQ/`, `docs/zoëQ/`, `core.quotePath=false`, local `josé`, a CJK local name | 1 each; **no segment and no octal escape** in stdout or stderr |
| Messages: full form, 8.3; scissors under `-F`, `-F --cleanup=scissors`, `-m`, `-m --cleanup=scissors` | 1 each |
| Unsigned commit / signed commit | 1 / 0 |
| Hooks from a space path, through a junction, space plus junction, a lower-case `c:` hooksPath (staged, message, clean) | 1 / 1 / 0 |
| CLI argv through a lower-case drive, a space path, a junction, space plus junction | 1 and the refused line; clean gives 0 and the clean line |
| Stubs, both hooks, run directly: exit 0 with nothing; clean line plus an extra line; clean line only; exit 2; exit 3; throw at load; exit 1 with no line; exit 1 with the refused line; refused line plus an extra line; exit 0 with the refused line; exit 5; scanner missing | 2; 2; 0; 2 "aborted"; 3 "canary"; 2; 2; 1 "profile path"; 2; 2; 5 "exited 5"; 2. No wrong "profile path" message anywhere. |
| Cherry-pick; rebase; the signed content of `git merge`'s own commit | 0 each (narrowed in 4.2) |
| Signed `git merge -m` carrying a path | 1 |
| Unsigned merge / signed merge | 1 / 0 |
| CLI `--redact-segment` and `--redact` on local name plus `.ext` (Users root and POSIX root) | count 2 for 2 segments; bytes exact |
| An argument path carrying the local name | printed redacted |

## Mutations re-observed at C′ `955e6c7`

- **How.** In a `git archive` export of `955e6c7`, with TMP in the scratch dir, each mutation was applied to the source, the named test run, the source restored, and the test run again.
- **Unmutated and restored.** Each run was 1/0, and the restored file was byte-identical.
- **Mutated.** Each run was 0/1, with `not ok` naming the test and an `ERR_ASSERTION`.
- **C′ is the head's code.** The scanner, the test file and both hooks are byte-identical between `955e6c7` and head.
- **The 12 mutations** (first failing line in brackets; each matches its "Observed:" clause):
  - `a_content_finding_under_a_non_ascii_local_name_prints_no_segment` (new): bare `b/` strip [:327, the octal assertion]
  - `a_redaction_counts_the_local_name_inside_a_longer_segment_once` (new): exact-span dedup only [:423, actual 2]
  - `the_commit_msg_hook_names_the_scanners_status` (new): `commit-msg`'s case statement collapsed [:668]
  - `a_scanner_load_failure_is_not_named_a_finding` (new): status 1 alone, in both hooks [:695, actual 1, expected 2]
  - `the_local_profile_is_refused_even_when_listed` (changed): the local-name branches removed [:228]
  - `the_local_profile_flattened_form_is_refused` (changed): `-` dropped from the run [:276]
  - `the_hooks_name_the_scanners_status` [:635]
  - `an_added_line_beginning_with_plus_plus_is_scanned` [:783]
  - `no_printed_path_carries_a_refused_segment` [:470]
  - `commit_msg_fails_closed_without_a_clean_line` [:608]
  - `pre_commit_fails_closed_without_a_clean_line` [:586]
  - `refuses_an_8_3_segment_under_users_without_a_drive` [:144]
- **7.4's ten spans.** All ten spans at `da80db0` hold "Observed:" and are all changed at C′. The `RECORDED MUTATION` count goes from 31 to 35 (the header comment plus 34 tests).

## Re-runs at M′ (7.13 step 6)

- **2a′** (`origin/main...HEAD`, which equals M′'s range):
  - numstat 1/1, one hunk;
  - the removed line is the ledger's line 1840 on base, inside entry 49 (lines 1809 to 1862) and after its bracket (which ends at 1822); it is the only line in entry 49 with a finding;
  - `redactRoots` gives count 1 and output equal to the added line; the added line scans clean;
  - entry 110 is untouched.
- **The five append prefixes.** `head.startsWith(main)` is true for all five, with 11 + 10 + 4 + 2 + 12 = 39 appended lines and 0 findings in them.
- **Re-derivation.** `ls-tree -r` plus `cat-file --batch`, this piece's own `scanText`, the real local name, canary first:

  | Revision | Files | With findings | Findings in file names |
  |---|---|---|---|
  | `00cf306` | 1109 | 30 | 0 |
  | `254fbfa` (base) | 1118 | 30 | 0 |
  | M′ `f7a19e9` | 1122 | 22 | 0 |
  | head | 1122 | 22 (identical to M′) | 0 |

  - The 22 are §2a's untouched rows (20, with Amendment 2's) plus `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` (unlisted-segment=1) and the gate-1 reviewer report (8.3=1).
  - The base's 8 extra files are exactly the files this piece rewords.
  - No file main added after `16df0d7` other than those two has a finding. Invalidator 1 does not fire.
- **Prediction 4.** First-parent `ccdccfd~1..f7a19e9` is 15 commits. Every message is clean under the shipped `--message` (exit 0 plus the clean line; a positive self-test was refused as it should be). Every non-merge `+` line has 0 findings. Through head it is 16 commits, all clean.
- **N = 6.** At `254fbfa`, `AI_DEVELOPMENT.md`'s last Custodian-role heading is Amendment 5.
- **§8 item 1** (three-dot): 2638 added lines, 0 findings with or without the local name; 19 names, 0 findings.

## Suites at head (`4155fcf`; the code is identical to C′ and M′)

| Suite | Result |
|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 349 pass, 0 fail (the scanner file alone: 34/34) |
| `cargo test -p spatial-kernel --no-fail-fast`, unfiltered, `CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target` | exit 0; 36 result lines; **281 passed, 0 failed, 28 ignored, 0 filtered**; lib 121 |
| `h2_a_cancel_before_the_first_batch_still_stops_the_query`, `--exact`, alone | passed 5 of 5 |
| verify-cites | PASS: 834 files, 50 loose references |
| verify-quotes | PASS: 110 / 79 / 30 / 1 / 0; 2 hash-baselined |
| verify-test-claims | PASS: 300 claims in 88 files (11 planned, 3 superseded, 15 withdrawn) |

- **The flake.** Another gate's workspace cargo (`spatial_engine` test processes) was running during my full run. The h2 test passed under that load, so I could not reproduce the worker's failure, and it passes alone.
- **Cite checks.** `kernel/tests/end_to_end.rs:399` is the `< 100ms` assertion, and `d400a47` (2026-08-09, on main) is the function's last change.
- **Loose references.** The branch's 50 loose references are a strict subset of main's 57 (main scans 831 files), so "pre-existing" holds.

## CI (`gh run list --branch governance/exposure-profile-paths`)

- **At `4155fcf`.** All success:
  - Governance CI, push run `36339618300` and PR run `36339620838` (349/349);
  - Product CI shell `36339621031`;
  - Product CI Rust workspace `36339620847`;
  - **DCO sign-off `36339620834`**.
- **At `955e6c7`.** All success:
  - Governance `36336589025` (`ubuntu-latest`, the POSIX proof) and `36337682682`;
  - shell `36336591478` and `36337682767`;
  - Rust `36336589042` and `36337682658`;
  - DCO `36337682659`.
- **PR #133** is a draft and open, with head `4155fcf`.

## Amendments 8 and 9: figures and cites

- **Amendment 8.** Three-dot `00cf306...955e6c7` gives:
  - 625 + 109 (52 + 6 + 51) + 1094 + 2 = **1830**; 1830 − 1532 = 298, and 1532 re-checked at `8f7698e`;
  - 39 append lines;
  - 19 files at C′ and at M′.
  - `git merge-base origin/main 955e6c7` is `00cf306`.
- **Amendment 9.** These resolve:
  - C′, M′ (parents `955e6c7` and `254fbfa`), and the 15-commit list;
  - the run ids and their success;
  - the 4.4 re-observation not owed (the diff is empty);
  - the 2a′ and prefix results;
  - 1118/30 and 1122/22;
  - the 349 node tests and the verify counts;
  - the follow-up node on main.
- **The custodian's pre-push figures.** 2599 lines, 19 names and 19 messages match three-dot from `00cf306`. The range is written `origin/main..HEAD` with no ids, and two-dot against `cec34b8` or `254fbfa` gives 2600 or 2607 lines. This is minor, the same class as G3-D4.
- **Amendment 7.** `f95da5a` touches only the form, and its appended text is byte-identical to the fenced text of `state/drafts/exposure-amendment-7.draft.md` on main (7.13 step 1).
- **File set.** 19 files. `PLAN.yaml` is untouched by the branch's own commits: 0 non-merge commits touch it, and it is absent from the three-dot set. `.github/**`, `.claude/settings.json` and `CONTRIBUTING.md` are untouched too. Every commit `f95da5a` to `4155fcf` carries one Signed-off-by.
- **Round 25 checks.**
  - Class 8 is recorded, and the Budget line is not edited (the first-line words are G3-D1).
  - No class-9 work.
  - No `verify-mutation` run is called an observation.
  - 7.4's test-text spans are named at `da80db0` with no hash pin.
  - The five-line form does not apply.
  - Amendments 7 to 9 carry no hash pin.

## Nits

- Amendment 9: "the 19 of §2a as revised by Amendment 2 (20)" should say 20.
- Amendment 9: "36 binaries" is 35 test binaries plus doc-tests.

## Hygiene

- The values of `$USERNAME` and `$COMPUTERNAME` were never printed. Every output file was scanned by the scanner (canary first) before anything was printed.
- Every exit status was checked. Every spawn had a timeout, and no process of mine is left.
- `C:/dev/exp-gate3-scratch` did not exist before. Its two junctions were removed as links only (the targets were verified intact), and then it was deleted.
- The worktree is clean at `4155fcf`. Main's checkout is unchanged (only the pre-existing untracked `.codex-remote-attachments/`).
- I edited, committed and pushed nothing.

Files at issue:
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` (Amendments 8 and 9)
