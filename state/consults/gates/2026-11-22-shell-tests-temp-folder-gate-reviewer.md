Reviewed: cut/shell-tests-temp-folder at 88ce3c6575a81f248bcc0a203355c3a49a86ca30 (the custodian's filing note, 2026-11-22: PR 356's single gate under the five-line form governance/forms/frontends/SHELL-TESTS-TEMP-FOLDER-OF-THE-RUNS-OWN-PREREGISTRATION.md; Read 1, Bash 27, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-opus-5-5, from 2026-11-22T15:06:35Z to 2026-11-22T15:37:21Z by its transcript; no call named the main checkout; no compaction; its cargo test, mutation, fmt, clippy and CI calls are in its transcript; the report below from its hand-back, 10129 bytes, sha256 d5b2d8286579c18bf99825274e9a45831e8cecbd194c194fd8dc58bfd65ffc7f, byte for byte but for the masks: the scratch folder as <S>, the system TMP as <TMP>, the account name as <u>, the hold's project value as <m>; one final newline added.)

---

Verdict: PASS WITH NOTES, PR #356 @ 88ce3c6575a81f248bcc0a203355c3a49a86ca30
Reviewed: cut/shell-tests-temp-folder @ 88ce3c6575a81f248bcc0a203355c3a49a86ca30 (base main @ 08783d073376686eba767d5a65bb89675bd40b38), checkout C:/dev/wt/stmp-rev

I found no blocking findings. The four notes and the documentation check below need no change before the merge.

## Correctness
None.

## Evidence
None.

## Documentation
None. The PR changes no doc or comment sentence, and it shows no operator text. I wrote no replacement words under §31.

## Notes
- N1. **The first commit.** The branch has two commits, and both are signed off (CI "every commit is signed off": pass).
  - 6342c895a118 alone was 48 insertions, over the form's 40. 88ce3c6575a8 replaces both tests.
  - The form's budget is "<= 40 changed lines in the merged diff". The merged diff is 23 lines (11+12, 0 deletions), so the first commit changes nothing the form requires.
  - This is a five-line form, so the class-8 rule for a full-form §7 overrun does not apply. The merged diff is inside the budget in any case.
  - Squashing at merge is the custodian's choice. It is not needed.
- N2. **Unmasked profile paths in the first report.** `<S>/stmp-report-1.md`, the first run's report, quotes profile paths unmasked: `C:\\Users\\<u>\\...` and `C:\\Users\\<u>\\...`. `<S>/stmp-report-2.md` masks them as `<u>`/`<TMP>`. If report 1 is filed anywhere, mask those paths first.
- N3. **Holds.** The form's Tests+mutation line says "The runs, in one shared hold". The worker used 8 holds and I used 4 (one per heavy command). Each was shared and released, so this is a difference in wording, not in substance.
- N4. **What the publish test proves.** It checks `starts_with(canonicalize(temp_dir()))` plus `ends_with("spatial-ide-shell-publish-tests/<pid>/own")`.
  - Together these prove all three things the form names: under the temp folder, the fixed folder, and a component equal to the pid.
  - They do not prove that the fixed folder sits directly under the temp folder. The helper's own join order guarantees that.
  - The session-log test's single `assert_eq!` compares the whole path exactly, so it covers all three without that gap.

## Checks
1. **The diff.** `git diff 08783d073376...88ce3c6575a8`, `--numstat` and `-U0`, plus `git log --format='%H %s%n%b' 08783d073376..88ce3c6575a8`: rc 0 for all.
   - **numstat:** `11 0 commands.rs`, `12 0 publish.rs`. The total of 23 is at most 40.
   - **Hunk headers:** `@@ -724,0 +725 @@`, `@@ -731,0 +733,10 @@` (commands.rs); `@@ -1758,0 +1759 @@`, `@@ -1764,0 +1766,11 @@` (publish.rs).
   - **Test modules at head:**
     - commands.rs: `#[cfg(test)]` at 710, `mod tests {` at 711, closing at 874 (end of file). Changed lines are 725 and 733-742.
     - publish.rs: `#[cfg(test)]` at 1700, `mod tests {` at 1701, closing at 3769 (end of file). Changed lines are 1759 and 1766-1776.
     - publish.rs's other test module, `resolver_tests` at 1567, is untouched.
     - Every changed line is inside the module that holds its helper.
   - **Helpers:** each gains exactly `.join(std::process::id().to_string())`, between the fixed-folder join and `.join(name)`. `let _ = std::fs::remove_dir_all(...)` still runs before use. Nothing else in either helper changes.
   - **Session-log test:** `assert_eq!(log.path.parent(), Some(want.as_path()), ...)`, where `want = temp_dir()/spatial-ide-shell-session-log-tests/<pid>/own`. It covers all three.
     - `SessionLog.path` is the real `pub` field, `dir.join("session-{stamp}.log")`, read at head in `src/state.rs` (`SessionLog::open`). So `parent()` is the helper's folder.
     - Neither side is canonicalized, which is consistent.
   - **Publish test:** covers all three (see N4).
     - Its `canonicalize(temp_dir()).unwrap()` cannot panic before an assertion on any ordinary machine. `workspace("own")` has just run `create_dir_all` and `canonicalize` under that same folder with unwraps, so the temp folder exists and resolves.
     - Any failure would happen in the helper first. That is the same pattern every test in the module already uses.
     - Both sides are in `\\?\` long form, so the 8.3 TMP (`<u>`) is resolved on both.
   - **The name "own":** no other test in either module uses it (grep).
   - **Nothing else changes:** no other test, helper, fixture, Cargo.toml, lockfile or workflow; no retry, sleep, timeout or skip.
   - **lib.rs:** not in the diff, so its log folder is untouched.
2. **Re-observed, all in checkout C:/dev/wt/stmp-rev.**
   - **Baseline:** `cargo test -p spatial-ide-shell --locked --lib` > `<S>/stmp-rev-lib.log`, rc 0. It showed `Finished ... in 14m 43s` (fresh target) and `test result: ok. 82 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 9.34s`. Both new tests were `... ok`.
   - **Mutation method:** each mutation was one anchored command, `perl <S>/stmp-rev-mut.pl <file> <fixed-folder> cut|put`.
     - The anchor is the helper's three-line block, matched by `index`. The command refuses unless the count is exactly 1.
     - A dry check confirmed the refusal: `put` on the unmutated publish.rs gave `REFUSED: anchor must occur exactly once`, count 0, rc 255.
   - **R:** both helpers cut (count 1 each, rc 0; diff showed exactly the two pid lines removed). `cargo test ... --lib -- a_session_log_folder_is_the_test_runs_own a_publish_workspace_is_the_test_runs_own` > `<S>/stmp-rev-red.log`, rc 101. Lines quoted byte for byte:
     - `thread 'publish::tests::a_publish_workspace_is_the_test_runs_own' (71548) panicked at src\publish.rs:1773:9:`
     - `"<TMP>\\spatial-ide-shell-publish-tests\\own" does not end with "spatial-ide-shell-publish-tests\\58252\\own"`
     - `thread 'commands::tests::a_session_log_folder_is_the_test_runs_own' (8164) panicked at src\commands.rs:739:9:`
     - `assertion `left == right` failed: not the run's own`
     - `  left: Some("<TMP>\\spatial-ide-shell-session-log-tests\\own")`
     - ` right: Some("<TMP>\\spatial-ide-shell-session-log-tests\\58252\\own")`
     - `test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 80 filtered out; finished in 0.00s`
     - Each failure falls at the test's own assertion, not at an unwrap. With one helper line removed, head lines 1774 and 740 shift up by one, to 1773 and 739: the `ends_with` assert and the `assert_eq!`.
     - **Restore:** both `put` commands ran (count 1, rc 0). `cmp` of each file against `git show 88ce3c6575a8:<path>` gave 0 and 0.
   - **M1 (commands.rs helper only):** cut (count 1). `cargo test ... --lib -- a_session_log_folder_is_the_test_runs_own` > `<S>/stmp-rev-m1.log`, rc 101. Lines quoted byte for byte:
     - `thread 'commands::tests::a_session_log_folder_is_the_test_runs_own' (41772) panicked at src\commands.rs:739:9:`
     - `assertion `left == right` failed: not the run's own`
     - `  left: Some("<TMP>\\spatial-ide-shell-session-log-tests\\own")`
     - ` right: Some("<TMP>\\spatial-ide-shell-session-log-tests\\56232\\own")`
     - `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 81 filtered out; finished in 0.00s`
     - **Restore:** `put` ran, then `cmp` gave 0 for commands.rs and 0 for publish.rs.
   - **Final state:** `git -C C:/dev/wt/stmp-rev status --porcelain` printed nothing (rc 0), checked after R, after M1 and after clippy.
3. **fmt and clippy.**
   - `cargo fmt --all -- --check` > `<S>/stmp-rev-fmt.log`: rc 0, 0 bytes of output.
   - `cargo clippy -p spatial-ide-shell --locked --tests` (no -D), in a hold, > `<S>/stmp-rev-clippy.log`: rc 0, `Finished ... in 11m 53s`.
     - It gave one warning, `warning: large size difference between variants` at `src\publish.rs:359:1` (`pub enum PrepareOutcome`). That is existing product code.
     - No warning falls on a changed line.
4. **The worker's claims against its logs** (`<S>/stmp-report-2.md`):
   - **red2:** shown. `<S>/stmp-red2.log` has publish.rs:1773:9 with the `does not end with` line, commands.rs:739:9 with the `assert_eq` left/right, and `0 passed; 2 failed; ... 80 filtered out`. The rc is not in the log; `error: test failed` is consistent with 101.
   - **green2:** shown. `<S>/stmp-green2.log`: `ok. 2 passed; 0 failed; ... 80 filtered out`.
   - **lib2:** shown. `<S>/stmp-lib2.log`: `ok. 82 passed; 0 failed; ... finished in 8.08s`, with 82 `... ok` lines.
   - **m1:** shown. `<S>/stmp-m1.log` (publish helper): publish.rs:1773:9 and `0 passed; 1 failed; ... 81 filtered out`.
   - **fmt:** consistent. `<S>/stmp-fmt.log` is 0 bytes; the rc is not in the log.
   - **clippy:** shown. `<S>/stmp-clippy.log` has one warning at publish.rs:359, `Finished ... 11m 10s` and no error lines.
   - **numstat 23:** shown, and matched by my own numstat.
   - The report's quoted failure lines match its logs, with the profile and TMP paths masked.
5. **CI.** `gh pr checks 356`: rc 0, 14 of 14 pass, nothing pending. `gh pr view 356 --json headRefOid,isDraft`: rc 0, `{"headRefOid":"88ce3c6575a81f248bcc0a203355c3a49a86ca30","isDraft":true}`. Read times: 2026-11-22 15:08:51 UTC and re-read at 15:36:25 UTC, the same both times.

## Holds
There were four, all granted and released, with no MACHINE_WAITING or MACHINE_ERROR lines and no rc 96-99. fmt ran without a hold, as a light command.
- Baseline test: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)` / `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- R: the same two lines.
- M1: the same two lines.
- Clippy: the same two lines.

Files:
- The mutation script: <S>/stmp-rev-mut.pl
- Logs: <S>/stmp-rev-lib.log, stmp-rev-red.log, stmp-rev-m1.log, stmp-rev-fmt.log, stmp-rev-clippy.log (same folder)
- Head copies used for cmp: stmp-rev-head-commands.rs, stmp-rev-head-publish.rs (same folder)

Model: Opus 5.5 (claude-opus-5-5).
