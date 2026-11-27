*The worker's report for the node shell-tests-temp-folder-of-the-runs-own (the five-line form `governance/forms/frontends/SHELL-TESTS-TEMP-FOLDER-OF-THE-RUNS-OWN-PREREGISTRATION.md`), its second hand-back, after the custodian's correction 1 (the tests made smaller), pushed at 88ce3c65; PR 356. Filed by the custodian below the rule from that hand-back in its transcript, 5282 bytes, sha256 9096ce1a58c5abadffdefe5b4da36ea39e6273520f303c436fdc5afe2a2d9a70, byte for byte but for masks: the system temporary folder's path is written as <TMP> (2 places) and the hold lines' project value as <m>. Its run: Read 1, Bash 19, Write 1, SubagentHandback 1, by unique call ids, 1 call errored; model claude-sonnet-5-5, from 2026-11-22T14:48:55Z to 2026-11-22T15:03:29Z by its transcript; 0 calls named the main checkout; no compaction.*

---

Built: the shell tests' folder of the run's own at 88ce3c65 (branch cut/shell-tests-temp-folder, pushed)
Result: the two folder tests are smaller and the merged diff is 23 lines against the 40 budget. Every test, cmp, fmt and clippy check passed, and the branch is pushed.

- **Start state:** HEAD was 6342c895, unpushed, status empty. The first run's npm steps exited 0, 0, 0.
- **Commits:** 6342c895 is the first commit (48 lines, the stop). 88ce3c65 is the second, with subject `test: shell: the two folder tests, smaller, within the form's budget`. It replaces the two tests and keeps the helper joins. Status is clean after it.
- **Red for the smaller tests**, exit 101, `<S>/stmp-red2.log`. The join was removed from both helpers, and each one-anchor perl command matched exactly once. Both tests failed at their own assertions:
  - `thread 'publish::tests::a_publish_workspace_is_the_test_runs_own' (65412) panicked at src\publish.rs:1773:9:`
  - `"<TMP>\\spatial-ide-shell-publish-tests\\own" does not end with "spatial-ide-shell-publish-tests\\63200\\own"`
  - `thread 'commands::tests::a_session_log_folder_is_the_test_runs_own' (76748) panicked at src\commands.rs:739:9:`
  - `assertion `left == right` failed: not the run's own`
  - `  left: Some("<TMP>\\spatial-ide-shell-session-log-tests\\own")`
  - ` right: Some("<TMP>\\spatial-ide-shell-session-log-tests\\63200\\own")`
  - `test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 80 filtered out; finished in 0.00s`
- **Restore:** the joins were put back by the reverse commands and I committed. `cmp` of each file against `git show HEAD:<path>` returned 0 for both (`<S>/stmp-red2-head-1.rs` and `-2.rs`).
- **Green**, `<S>/stmp-green2.log` and `<S>/stmp-lib2.log`:
  - Both new tests: exit 0, 2 passed, 80 filtered out.
  - Whole lib suite: exit 0, 82 passed, 0 failed, finished in 8.08s.
- **M1** (the join removed in publish.rs's helper only), exit 101, `<S>/stmp-m1.log`:
  - `thread 'publish::tests::a_publish_workspace_is_the_test_runs_own' (67072) panicked at src\publish.rs:1773:9:`
  - `"<TMP>\\spatial-ide-shell-publish-tests\\own" does not end with "spatial-ide-shell-publish-tests\\30988\\own"`
  - `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 81 filtered out; finished in 0.00s`
  - After the reverse command, `cmp` against `git show HEAD:` returned 0 (`<S>/stmp-m1-head.rs`), and status was empty.
- **fmt:** exit 0. A pre-commit fmt check also exited 0.
- **clippy** (no -D): exit 0, one warning, `large size difference between variants` at src\publish.rs:359 on `pub enum PrepareOutcome`. That is existing product code outside my diff, and I did not touch it.
- **Size:** numstat after the second commit, `git diff --numstat 08783d07...HEAD`, gives commands.rs 11/0 and publish.rs 12/0, total 23.
- **Hunk headers**, `git diff -U0`:
  - commands.rs: `@@ -724,0 +725 @@`, `@@ -731,0 +733,10 @@`
  - publish.rs: `@@ -1758,0 +1759 @@`, `@@ -1764,0 +1766,11 @@`
  - All four lie inside the `mod tests` modules, which start at commands.rs:711 and publish.rs:1701.
- **Changed lines** (`git diff 08783d07...HEAD`, net of both commits):
  - In both helpers, one added line: `.join(std::process::id().to_string())` between the fixed folder and `.join(name)`.
  - The commands.rs test:
    ```
    #[test]
    fn a_session_log_folder_is_the_test_runs_own() {
        let (_session, log) = session_log("own");
        let want = std::env::temp_dir()
            .join("spatial-ide-shell-session-log-tests")
            .join(std::process::id().to_string())
            .join("own");
        assert_eq!(log.path.parent(), Some(want.as_path()), "not the run's own");
    }
    ```
  - The publish.rs test:
    ```
    #[test]
    fn a_publish_workspace_is_the_test_runs_own() {
        let dir = workspace("own");
        let temp = std::fs::canonicalize(std::env::temp_dir()).unwrap();
        assert!(dir.starts_with(&temp), "{dir:?} is not under {temp:?}");
        let own = Path::new("spatial-ide-shell-publish-tests")
            .join(std::process::id().to_string())
            .join("own");
        assert!(dir.ends_with(&own), "{dir:?} does not end with {own:?}");
    }
    ```
- **Push:** `* [new branch] cut/shell-tests-temp-folder -> cut/shell-tests-temp-folder`, tracking set. No PR was created.
- **Holds:** 8 granted and released over both runs, all in the shape `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>` followed by `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. There were no MACHINE_WAITING or MACHINE_ERROR lines and no 96-99 codes. No background process of mine is still running.
- **Noticed, not acted on:** the 3-line first commit's tests are fully superseded by the second commit, so the squash is the custodian's call at merge. The hold-wrapped clippy took 11 minutes on the fresh target.
- **Pre-gate classes:** cross-module use matches the real `SessionLog.path` field (state.rs:37). Completion claims point to the logs named above. There is no user-facing message. Both tests reach their intended assertions, shown by the red2 and M1 runs.
- **Model:** Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
