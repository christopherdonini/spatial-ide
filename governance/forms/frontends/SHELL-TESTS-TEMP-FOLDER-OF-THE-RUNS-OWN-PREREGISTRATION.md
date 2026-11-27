# frontends/shell/src-tauri: the session-log and publish tests' temporary folders, a folder of the test run's own — five-line short form (`AUTONOMY.md` §21d)

Committed before any code, per the short-form discipline; append-only once committed.
- **The node:** the PLAN node shell-tests-temp-folder-of-the-runs-own, placed by the advisor's ruling ADV-2026-11-21-15 item 3 (iii), under the human's delegation of 2026-11-13 (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md`): "(i) is a five-line piece: a folder of the test run's own." It comes from the architect's N4 on PR 343 (`state/consults/gates/2026-11-20-session-log-token-redaction-rests-on-page-code-gate-architect.md`, its Notes): every session-log test cleans a fixed folder under the system temporary folder, and two `cargo test` runs on one TMP could collide; `publish.rs`'s tests follow the same pattern.
- **Why now:** ADV-2026-11-22-11 starts a free place on the next piece in its order (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-11-no-place-under-the-cap-stands-idle-before-the-sitting-a-free-place-starts-the-next-piece-without-asking.md`). Item 3 (i), the launcher read, waits for a quiet machine; item 3 (ii) is in hand.
- **Its class:** the five-line form and the reviewer alone, with the standard worker (ADV-2026-11-16-06: no wire, ADR, CRS, product concurrency, security, persistence or seam, and under 260 lines).
- **No retry, sleep, longer timeout or skip** is added, and none is used to make a test green (ADV-2026-11-22-01 item 2).
- **Merge:** every changed line is inside the two files' `#[cfg(test)]` modules, so the app as built is unchanged. The custodian reads it as a piece that changes tests alone, which merges as it closes (ADV-2026-11-21-15 item 1), and names that reading in the merge check, for the advisor to rule against the human's item 0 of 2026-11-22 (no shipped-code or lockfile change merges before the tag).
- **The records:** the custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file.

```
Authority: PLAN node shell-tests-temp-folder-of-the-runs-own; the advisor's ruling ADV-2026-11-21-15 item 3 (iii), under the human's delegation of 2026-11-13: a five-line piece, a folder of the test run's own; the architect's N4 on PR 343; reuse index: no prior art recorded for temp folder path (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1, run by the custodian on 2026-11-22), a miss noted here.
Scope: 2 files: frontends/shell/src-tauri/src/commands.rs and frontends/shell/src-tauri/src/publish.rs, only inside each file's #[cfg(test)] module that holds the helper named below; declared line budget <= 40 changed lines in the merged diff by §21c's counting (insertions plus deletions, comments counted), this form excluded. Block on sight: any line outside those two test modules; any other test, helper or fixture; any Cargo.toml, lockfile, dependency or workflow; lib.rs's log folder; any retry, sleep, longer timeout or skip.
Change: the two helpers that make a test's folder under std::env::temp_dir(), session_log in commands.rs's test module and workspace in publish.rs's test module, each join one more path component between the fixed folder and the test's own name: the test process's id, std::process::id(), so that two test runs at once never share a folder, while the tests of one run keep their distinct names under it as now. Each helper still removes its own folder before use, and nothing else in either helper or either module changes. Folders left by earlier runs stay where they are, as today.
Tests+mutation: one new test in each of the two modules, each named for the rule (for example, a_session_log_folder_is_the_test_runs_own and a_publish_workspace_is_the_test_runs_own): each calls its helper and checks that the folder it gives lies under std::env::temp_dir(), the fixed folder and a component equal to std::process::id(). Red then green: each new test is run with the helper unchanged and fails by name, recorded byte for byte from the run's output; with the change it passes. M1: the process-id component removed from one helper, its new test fails by name, recorded, then restored and compared with the head by cmp. The runs, in one shared hold: cargo test -p spatial-ide-shell --locked --lib (its dev-dependency enables spatial-engine's fixture feature), with cargo fmt --all -- --check and cargo clippy -p spatial-ide-shell --tests, each exit 0.
Out-of-scope: ADR none; security none -- test code under #[cfg(test)] only, the standard library, no dependency, no workflow; wire none; guarantee none touched -- no product line changes, and commands.rs's own scan test reads only the lines above its test module.
```

## Closing amendment — 2026-11-27 — references and hashes only

1. **The commits:**
   - 6342c895a118289e524d4e732d0841dd573eeff2: the helpers' change and the two folder tests.
   - 88ce3c6575a81f248bcc0a203355c3a49a86ca30: the two tests made smaller, within the form's budget.
   - Then main 4b9fd558d0437b3249e1bba58334a6d55074c199 was merged in at 44fe6e789347d7a1cc583620706b78ae52642cf8 (ADV-2026-11-26-15 item 4).
2. **The gate:** the reviewer alone, PASS WITH NOTES at 88ce3c6575a81f248bcc0a203355c3a49a86ca30 (`state/consults/gates/2026-11-22-shell-tests-temp-folder-gate-reviewer.md`, gate-log row 832). It has no Correctness, Evidence or Documentation finding.
3. **ADV-2026-11-22-18** ruled on the Merge line above (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-18-pr-356-not-merged-now-it-waits-for-the-tag-a-tests-piece-in-a-shipped-crates-file-merges-after-the-tag.md`). PR 356 was not merged then and waited for the tag, as a tests piece in a shipped crate's file.
4. **The reading under the human's message of 2026-11-26.** That message approved ADV-2026-11-26-01. Read with ADV-2026-11-27-02 item 1, no merge into main waits for the tag, so ADV-2026-11-22-18's wait for the tag ends. Nothing else of it changes.
5. **The merge-in.**
   - The custodian's session (Opus 5.5) made the merge commit 44fe6e78 in the worktree C:/dev/wt/stmp. The branch was checked out there, so the merge-in worker skipped it.
   - Its trailer names that model and that session, which the narrow read observed.
   - The narrow read passed: equal patch-ids, and no overlap with the two files (`state/consults/gates/2026-11-27-held-prs-preparation-merge-in-narrow-read-reviewer.md`, row 922).
6. **The verdict.** The advisor's MERGE verdict for 44fe6e78, written ahead of the merge, is filed at `state/consults/merge-checks/PR-356-44fe6e789347.md`.
7. **The merge.**
   - It waits for the advisor's merge check, the sitting's checkout with its filed start, and the human's app to be closed (ADV-2026-11-27-02 item 1).
   - It also waits for the pieces before it in the merge order (ADV-2026-11-27-04 item 6).
   - It does not go into `release/v0.2`. B is built on this head, so this piece merges before B.
