Reviewed: PR #222 at 3e63a839d195f96f3d20796ef78133633984d55a (round base d2501969, base 31e25f15). Branch and commit: cut/b2-piece-1b-recording @ 3e63a839d195f96f3d20796ef78133633984d55a
Verdict: PASS WITH NOTES

There are no findings under Correctness, Evidence or Documentation. My E-1, C-1 and D-1 are met at the head:
- I observed the new test pass, and saw its mutation fail at the empty-root assertion.
- The windows-latest workspace job lists the test as ok at the head.
- The two rewritten expected failures (ND-2, ND-3) match what I observed.
- Every suite is green, PR CI is 18 of 18, and the lock and ADR diffs are empty.

The three notes below block nothing, and none is a Documentation finding. No reduction is needed.

Worktree: C:/dev/wt/1b. After `git fetch origin`, HEAD = origin/cut/b2-piece-1b-recording = 3e63a839. The porcelain was empty at the start, after every mutation and at the end. The round is `git diff d2501969...3e63a839`: two signed-off commits (fa620916, 3e63a839) over 6 files. Amendment 10 was committed on main at 73f14b9c (14:22:00+02:00), before fa620916 (14:26:00+02:00).

## My gate 2 findings, at the head

**E-1: met.**
- **The test:** `on_windows_a_record_whose_locations_write_is_denied_is_removed_and_the_root_is_empty`, at kernel/tests/session_history.rs:650. The `icacls` helper is at :592 and `DenyGuard` at :609.
- **Its form follows the architect's addendum, item by item:**
  - an ordinary `#[test]`, with no `cfg` and no `cfg!`;
  - the run-time check `std::env::consts::OS != "windows"` is the first line of the body (:651);
  - a fresh `scratch("record-creation-denied")`, with the store root inside it;
  - the ACE is on the root only: `whoami`'s user, `(OI)(CI)(WD)`, with the exit status asserted (:597-603);
  - the guard is made immediately after the ACE. Its Drop runs `/remove:d`, then `/reset /T /C /Q`, then removes the scratch folder;
  - the assertions, in order: the code (:678), `locations.json` in the detail (:681), an empty root (:684-685);
  - it drives only `StepRecorder::new` and `record_step`.
- **The comment at kernel/src/session_history.rs:210-218** names the test and its seam. I checked it clause by clause:
  - The caller supplies the root, and the product caller is frontends/shell/src-tauri/src/lib.rs:451.
  - `create_dir` succeeds and the `locations.json` write fails: the detail assertion proves this, and the mutation run below shows the folder was made.
  - The test returns at once on any other OS (:651).
- **Mutation:** I re-observed it at 3e63a839 (table below).
- **CI at 3e63a839:** the test is listed as `ok` in both windows-latest jobs:
  - pull_request run 38903931527, job 116982682314, log line 1718;
  - push run 38903937022, job 116982700770, log line 1734.
- **Why the test did not return early in CI:**
  - The job's Operating System group reads Microsoft Windows Server 2025, and the toolchain is stable-x86_64-pc-windows-msvc.
  - `std::env::consts::OS` is fixed by `target_os`, so it equals `windows` there and the early return is not taken.
  - The job's totals are 106 results, 963 passed and 0 failed. That is the same count as my local run, one more than gate 2's 962.
- **Stale claims:** I searched the branch at the head and the PR body for the old no-test sentence, with the pattern self-tested positive against d2501969:kernel/src/session_history.rs:210/:212. There are no hits.

**C-1: met.** protocol/skp/SKP-V0.md:1266 carries the architect's NC-1 words. They differ from my C-1 words only by the word `declared`. The clause check at 3e63a839:
- A CRS identifier over 4,096 bytes is past a reader bound:
  - in the step, `TEXT` = `S::Text(MAX_TEXT)`, with `MAX_TEXT` = 4,096 (session_history.rs:501, :530, :592);
  - in the header, `MAX_REF_STRING_BYTES` = 4,096 (dataset_ref.rs:45, :602).
- More than 1,024 geometry types is past a bound: `S::List(&TEXT, MAX_ITEMS)`, with `MAX_ITEMS` = 1,024 (:502, :602).
- The line is refused unwritable and not written: `reader_accepts` (:284) runs at :187 before `append` (:188), and for the header at :221 before the folder is made.
- The reader stops at the first line it refuses: `recover_bytes` (:802).

**D-1: met.** kernel/README.md:360 carries my words, with fa620916 in place of d2501969 (Amendment 10 item 3 orders the round's code commit). I resolved each pointer at fa620916:
- the SKP host row's six test names and the session-history row's three each occur once as `fn`;
- the three G2-row tests exist;
- `StepRecorder`, `default_root` and `recover` are `pub`;
- the three ceilings are at :43-45;
- KNOWN-LIMITATIONS.md:390 is item 43;
- the form exists at fa620916.

Between fa620916 and 3e63a839, the only change in kernel/ outside `///` lines is this README line.

**N1 (rode along): met.** session_history.rs:249 is `canonical(&locations)? + "\n"`. At d2501969 the literal was `"`, then LF, then `"` (od at d2501969). The bytes written are the same.

## The architect's gate 2 items the round carries (as I read them at the head)

- ND-1: met at SKP-V0.md:1261.
- ND-2: met at kernel/tests/session_history.rs:238-240, and observed (below).
- ND-3: met at :271-274, and observed (below).
- ND-4: met at frontends/shell/e2e/console.mjs:597-599.
  - The sentence is true: `style.resetToDefault` was one of the five style rows at B, with owner `ADR-022 / ADR-023`. At the head it is at surfaceRegistry.ts:189-193, owner docs/03.
  - The re-wrapped next sentence has the same words.
- ND-5 (the PR body): met.
  - The §7 line (body line 34) reads 4,922 over 66, and round 2 adds 108. My recount matches.
  - The round-2 words list is at lines 55-59.
  - Line 56's claim that the reviewer's C-1 is the same sentence with one word more is true.
  - The no-test sentence is gone.

## The worker's own sentences, checked against the code

- **The create comment:** above.
- **The test doc (:631-648):** each clause holds by the test body and the observations below.
  - The deny excludes delete: the rights are WD only.
  - Observed at fa620916: the code is identical at 3e63a839, so my re-observation stands for the head.
- **The `icacls` helper doc:** holds. `.expect("icacls runs")` and the status assert mean a missing or failing icacls fails the test.
- **The `DenyGuard` doc:** holds.
  - Drop runs on unwind.
  - The WD-only deny never blocks delete, so the scratch folder is removable even if both icacls calls fail.
- **The GROUP' row (MANUAL-WALKTHROUGH.md:685):** holds against console.mjs's `stepGroup`.
  - `GROUP_CALLS` = 3 (:277).
  - The poll condition is `w.res.length === baseRes + GROUP_CALLS`, over `a:record_step` rows whose intent action is `style.set`.
  - The toggle checks require exactly one new entry, class C, owner containing docs/03, statement containing `no API equivalent`. The registry row for `console.toggleGroupExpanded` is surfaceRegistry.ts:240-244.

## New findings

**Correctness:** none.
**Evidence:** none.
**Documentation:** none.

## Notes (non-blocking, not Documentation findings)

- **N-1.** The assertion message at kernel/tests/session_history.rs:682 says the failure came before the folder was made. That is untrue when the detail names `history.jsonl` or `the history lock`, both of which fail after the folder exists. No operator ever sees this text. Optional words: `the refusal did not name locations.json: {detail}`.
- **N-2 (out of scope, for the custodian).** console.mjs:277's comment on `GROUP_CALLS` still says identical calls and a residential-row count. It is stale since 7b547f90, the same class as gate 2's N4. The round's code does not touch it.
- **N-3.** The PR body's round-2 list of the worker's own words (line 59) leaves out the `icacls` and `DenyGuard` doc comments and the test's three failure messages. The worker report lists them (its item 3). None of them is a gate's replacement words, so §31(d) does not require them.

## Mutations I observed at 3e63a839

Method:
- Each mutation was applied alone by an anchored edit; a node script checked that the anchor occurred exactly once.
- Each was run by its exact test name with `cargo test -p spatial-kernel --locked --test session_history -- --exact <name>`, and the failure was read.
- Each was reverted with `git checkout -- kernel/src/session_history.rs`, and the porcelain was shown empty.
- All ran in one shared hold.
- No `verify-mutation` run was used.

| Id | Mutation | Test | Failure seen | Matches the doc |
|---|---|---|---|---|
| E-1 | `.inspect_err(\|_\| drop(std::fs::remove_dir_all(&dir)))` removed (:229) | `on_windows_a_record_whose_locations_write_is_denied_is_removed_and_the_root_is_empty` | rc 101; panicked at kernel\tests\session_history.rs:685:5, `a folder was left: ["...\record-creation-denied\store\unsaved-87da0c380889c351b1fd6e7f961c2f87"]` | yes: one `unsaved-` folder, at the empty-root assertion |
| ND-2 (S1) | the `style::parse(...)` line (:404) replaced by `let _ = &document;` | `a_style_value_the_style_model_refuses_is_refused_by_name_and_records_nothing` | rc 101; :263:9, left `skp.session_history_unwritable`, right `skp.style_value_not_admitted` | yes: at the code assertion. The record is made because `create` (:173) runs before the step check (:187) |
| ND-3 (S2) | the lowercase `if` block (:405-407) removed | `a_colour_not_in_lowercase_is_refused_by_name_and_records_nothing` | rc 101; :284:5, left `skp.session_history_unwritable`, right `skp.style_value_not_admitted` | yes |

- **Unmutated baselines:** each of the three tests rc 0, 1 passed.
- **Deny entries:** after the unmutated E-1 run, the mutated run and the workspace run, `%TEMP%\spatial-ide-session-history-tests\record-creation-denied` was absent, so no folder with a deny entry remains.
- **E2E mutations:** not re-run. Run 4 at 10173747 stands. Since then, d2501969 changed stepRecorder.ts:85 and its unit test, and the round changed only comments, a test, words and the same-bytes newline.

## Commands and exit codes

All of these ran in C:/dev/wt/1b at 3e63a839, with `CARGO_TARGET_DIR=D:/wt-targets/1b`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`. The tools named are the copies at that commit.

- **Holds:** two shared holds, both granted and released, with no code from 96 to 99. One was for the kernel runs and mutations, the other for the suites.
- **Rust:**
  - `cargo test --workspace --locked --features spatial-engine/fixture`: 0. 106 results, 963 passed, 0 failed, 57 ignored, with the new test `ok`.
  - `cargo fmt --all --check`: 0. The src-tauri `cargo fmt --check`: 0.
  - `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`: 0. 48 located diagnostics, 0 on the round's 117 added .rs lines.
    - The matcher reads the three-dot `-U0` diff.
    - It is self-tested: a planted diagnostic at kernel/tests/session_history.rs:660 was reported as a hit, and one at :5 was not.
  - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: 0 (67 + 2 passed).
- **The shell:** `npm run verify` in frontends/shell: 0. vitest 95 files, 1,353 tests; citation integrity 30 passed, 0 failed.
- **Scripts:**
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 0 (457 pass, 0 fail).
  - `node scripts/plan/verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`: all 0, each PASS.
- **PR #222:**
  - `gh pr checks 222`: 0. 18 of 18 pass, and both event runs' headSha is 3e63a839.
  - The PR is mergeable, CLEAN.
- **Record hashes:** I recomputed the gate 2 report hashes Amendment 10 cites (d740c0a3, 1f9671e9, ba4cbc57) and the worker report's line-5-on hash (a00de505). All match.

## Locks, ADRs, §7

- **Lock diffs against B: 0 bytes each:** `Cargo.lock`, `frontends/shell/src-tauri/Cargo.lock`, `frontends/shell/package-lock.json`.
- **ADR-036, ADR-022 and `docs/07_Roadmap.md`:** `git diff d2501969...3e63a839` over them is 0 bytes.
- **§7, by its own command, B...3e63a839:** 4,922 lines over 66 files. The round adds 108 to the count (146 by the round's own numstat, of which edits inside files new since B count once). Class 8 by the human's direction; not a finding, and §7 is unedited.

## §8 for the round's lines

1. Clean: no write path changed. The newline has the same bytes.
2. Clean: the user name appears only on the `icacls` command line in the test, and the product writes no new member.
3. Clean.
4. Clean: no wire change.
5. Clean.
6. Clean: the ADR and docs/07 diffs are empty.
7. Clean: no new message.
8. Clean: no `cfg`, `cfg!`, resolver or `LOCALAPPDATA` on an added line. The scan is self-tested positive against the file at the head. The run-time OS check follows the addendum.
9. Clean: no `pub` added. `icacls` and `DenyGuard` are private to the test file.
10. Clean.
11. Clean.
12. Clean: no timing assertion.
13. Clean:
    - the overrun is class 8, and §7 is unedited;
    - the amendment precedes the code;
    - no `verify-mutation` run is called an observation;
    - the test text names its commit (fa620916), and nothing is pinned by hash.
14. Clean: the round adds no quotation. The worker report's own-words blocks match the head byte for byte.
15. Clean: kernel/README.md:360 is updated (D-1).
16. The custodian's.

Relevant files:
- C:/dev/wt/1b/kernel/tests/session_history.rs
- C:/dev/wt/1b/kernel/src/session_history.rs
- C:/dev/wt/1b/protocol/skp/SKP-V0.md
- C:/dev/wt/1b/kernel/README.md
- C:/dev/wt/1b/frontends/shell/e2e/console.mjs
- C:/dev/wt/1b/frontends/shell/MANUAL-WALKTHROUGH.md

Final `git status --porcelain` in C:/dev/wt/1b: empty. HEAD 3e63a839d195f96f3d20796ef78133633984d55a.
