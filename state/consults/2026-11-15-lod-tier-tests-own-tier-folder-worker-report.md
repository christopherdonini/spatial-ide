*Custodian's filing note (2026-11-15): the final report of the lod-tier-tests-own-tier-folder worker, from its second hand-back (9299 bytes, sha256 fcddd83088f40c11da0a6517c38461278f0fc67e71e06c6d6d28a951432c4c48), below the rule, byte for byte but in its cites: each of its 2 cites of a file, a line and a column is given in words here (the file, then the line and the column), so that the cite check does not read one against main. The worker resumed on the custodian's message of 2026-11-15T19:18:08Z (by file 2767 bytes, sha256 a9d6b46734e30d221837f8772819172255919f9e452ea7ec0e273602b86d41db), which its transcript shows at 2026-11-15T19:18:14Z. The resumed run 2026-11-15T19:18:14Z to 2026-11-15T20:35:02Z by its transcript, 84 calls (Bash 73, Edit 4, Read 3, Write 3, SubagentHandback 1), 2 errored calls (two writes refused because the file had not been read first), model claude-sonnet-5-5. Its opening line is the one its brief gave. Its report at its stop is `state/consults/2026-11-15-lod-tier-tests-own-tier-folder-stop-worker-report.md`. The form's Amendment 2 records its holds after the resume.*

---

Built: lod-tier-tests-own-tier-folder at f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb

Branch cut/lod-tier-tests-own-tier-folder is pushed. origin equals HEAD (both f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb) and the porcelain is empty. Model: claude-sonnet-5-5. I made no PR, no CI re-run, no stash, no amend, no force push, no rebase and no merge.

Commits on top of d2008810:
- fb51f0ac: the change.
- 36c12ff2: T-A, T-B and the second-process half.
- f8f931e2: the two RECORDED MUTATION comments, plus the README owner's-index entry under OPEN-4 (A). The preregistration list gets the form's path after the LOD-RELEASE-GUARD entry, and the Last-verified bullet gets "the preregistration list's path for the per-run tier folder form, at 36c12ff2".

**P-0 (b).** It passes under the fenced text of Amendment 1 item 1 of the form. `engine/tests/lod_tier_root.rs` is unchanged and the measurements doc line stays. The evidence is in `<S>/lodt-p0b-head.txt`.

**No stop rule fired.**
- `git diff --name-only d2008810bf095a6983a3aa7915d277d83a30b21c...HEAD -- engine/src kernel/src` prints 0 lines.
- No existing expected value was edited.
- T-A and T-B have no sleep, timer or timing window.
- No manifest or lockfile changed, no dependency was added, and there is no `unsafe`, no user-visible string and no path:line cite in my new comments.
- Only seven files changed, all in Scope.

**Size: over the note.** `git diff --numstat d2008810bf095a6983a3aa7915d277d83a30b21c...HEAD` at the final head:
```
2	2	engine/README.md
115	7	engine/tests/common/mod.rs
171	31	engine/tests/lod_tier_builder.rs
7	9	engine/tests/lod_tier_cancellation.rs
18	13	engine/tests/lod_tier_measurements.rs
9	4	engine/tests/lod_tier_preflight.rs
35	0	kernel/tests/no_generation_in_persisted_artifacts.rs
```
The total is 357 added plus 66 deleted, which is 423 against the 260 note. Per term (a) I trimmed nothing and report it.

**Mutations, observed by applying them and reverting.** Both were observed at 36c12ff285280f0549b792f0f98420a5bdae9aa6.
- **M1** (the `set_var("LOCALAPPDATA", &root)` line deleted):
  - `a_test_runs_tiers_are_built_in_its_own_folder_and_never_under_the_machine_wide_tier_root` failed at its assertion (1).
  - `a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place` failed at its assertion (2).
  - Result line: `test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 20 filtered out; finished in 0.63s`, then `cargo-rc=101`.
- **M2** (the sweep's `let Ok(finished) = … else { continue; }` replaced by `let finished = …`):
  - Only T-B (`a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place`) was run.
  - It failed at assertion (2): "(2) the second run took this run's tiers away: [".
  - Result line: `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 21 filtered out; finished in 0.89s`, then `cargo-rc=101`.
- After M2 was reverted, the sha256 of `engine/tests/common/mod.rs` was 62c56d2f5beb6507bc3448e37a9dd4fa42ffd59c0d0265f69aece6c7ff1d71a0, equal to commit 2's. The sha was the same at the final head.

**Runs at commit 3 (f8f931e2).**
- **Run 4**, `cargo test -p spatial-engine --locked`:
  - `cargo-rc=0`, with 54 `test result: ok` lines and none FAILED.
  - lod_tier_builder: `test result: ok. 19 passed; 0 failed; 3 ignored; 0 measured; 0 filtered out; finished in 724.46s`.
  - T-A and T-B both `... ok`. The child half shows `... ignored, the second process of a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place; returns at once unless LOD_TIER_SECOND_RUN_SOURCE names a source`.
- **Run 5**, `cargo test -p spatial-kernel --locked --test no_generation_in_persisted_artifacts`:
  - `test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.32s`, then `cargo-rc=0`.
- **Machine-wide tier folder:** listed before run 4, after run 4 and after run 5. Count 1, sha256 0bb61523d9dd881eefd6176b3ae13f379ed6f7297f85e8243f391ace9b37f5ae each time, so no new or changed entry. The final list is the same.
- **Run 6, clippy, deviation.**
  - `cargo clippy -p spatial-engine -p spatial-kernel --all-targets --locked -- -D warnings` exited 101. The only 2 errors are in `spatial-renderer` (lib):
    - `renderer\src\canonical.rs, line 303, column 20`, `manual_range_contains`.
    - `renderer\src\style.rs, line 10, column 5`, `doc_lazy_continuation`.
  - Neither file is mine, and this is the failure the continuity block already records for main.
  - I re-ran the same command without `-D warnings` and got `cargo-rc=0` ("Finished `dev` profile … in 27.92s").
  - Its warnings sit only in `engine/src/app_dirs.rs`, `kernel/src/{lib,skp}.rs`, `kernel/src/permission/boundary.rs`, `kernel/src/publish/mod.rs` and `kernel/src/bin/publish-bundle.rs`, plus the two renderer ones. None is in a file I changed.
  - The `-D` result is therefore not green, and I treated it as outside Scope and did not stop.

**Light checks.**
- `cargo fmt --all -- --check`: rc=0.
- `node scripts/plan/verify.mjs --offline`: rc=0, "verify:plan PASS".
- `verify-cites.mjs`: rc=0, "verify:cites PASS — every rooted (in-tree) path:line reference across 3107 file(s) resolves."
- `verify-quotes.mjs`: the first run under my `timeout 300` exited 124 (a timeout, not a verdict). Re-run with `timeout 1500`: rc=0, "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, …".
- `verify-test-claims.mjs`: rc=0, "verify:test-claims PASS — all 812 claimed test(s) across 269 file(s) exist or are planned, superseded or withdrawn …".

**CI.** The push is on head f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb. All five runs completed with success:
- Product CI — Rust workspace (43757260597), with jobs `cargo test --workspace (windows-latest)` 132943961284, macos-latest 132943961464 and ubuntu-24.04 132943961582 all success.
- Rust fmt (43757260596).
- Ported notices (43757260619).
- Governance CI — plan, queue, site (43757260632).
- Product CI — shell (43757260644).

Byte-copied test-list lines from the Windows job's "Run the ordinary suite" step:
```
test a_test_runs_tiers_are_built_in_its_own_folder_and_never_under_the_machine_wide_tier_root ... ok
test a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place ... ok
test the_second_run_half_of_the_two_runs_test ... ignored, the second process of a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place; returns at once unless LOD_TIER_SECOND_RUN_SOURCE names a source
```
In the Windows job's "List the ignored tests (PORTABILITY R6)" step the child half appears as `the_second_run_half_of_the_two_runs_test: test`. On macOS and Linux, T-A and T-B are ignored by their `cfg_attr(not(windows), ignore = …)`, as the form intends.

**Holds.** Every hold line is shape `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (…)`. In every chain the in-chain status read showed exactly one `project=SpatialIDE` line, my own, so no check stopped a chain. Each chain ended with `release`. Only the last four rows of the table are re-checked against the files; the earlier holds' status files are `<S>/lodt-status-1.txt` to `-8b.txt`.

| Hold | Granted (UTC) | Status read before | Status read in-chain |
|---|---|---|---|
| M1, two tests | 2026-11-15T19:20:18Z | 0 project lines, average 15.0%, peaks 2 | 1 (mine), average 21.8%, peaks 5 |
| M2, T-B | 2026-11-15T19:26:03Z | 0, average 21.9%, peaks 8 | 1, average 20.8%, peaks 5 |
| Run 4, whole engine crate (60 min) | 2026-11-15T19:30:41Z | 0, average 18.6%, peaks 3 | 1, average 20.1%, peaks 5 |
| Run 5, kernel test | 2026-11-15T19:55:43Z | 0, average 23.5%, peaks 7 | 1, average 23.0%, peaks 3 |
| Run 6, clippy with `-D` | 2026-11-15T19:58:14Z | 0, average 22.7%, peaks 3 | 1, average 23.1%, peaks 4 |
| Run 6b, clippy without `-D` | 2026-11-15T20:01:40Z | 0, average 63.3%, peaks 38 | 1, average 38.4%, peaks 42 |

Notes on the holds:
- The first hold was already reported earlier and is the one Amendment 1 item 4 records as overlapping PR B's worker. The status step in the chain exists from the rule ADV-2026-11-15-17 item 4 onward.
- Run 6b's status read before the hold was 63.3% average, because the machine was busy. The hold was granted at 20:01:40Z.
- At 20:30Z-ish a PR B records hold (`what="PR B records: rec-pa-1, pan-anchor"`, started 2026-11-15T20:29:17.345Z) is the only SpatialIDE hold showing. It is not mine.
- Earlier disclosure, kept: my first P-0 (d) hold used a parenthesised group. Every hold since uses one command per hold.

**No process I started still runs.** After the work, no cargo, rustc, clippy, test-binary or verify-script process was running, and all my holds were released. The per-run folder `lod-tier-runs/<pid>` and its `<pid>.lock` under `D:/wt-targets/lodt/tmp` are tmp files the tests leave, which the next run's sweep removes. They are not machine-wide state.

Files: `C:/dev/wt/lodt/engine/tests/common/mod.rs`, `C:/dev/wt/lodt/engine/tests/lod_tier_builder.rs`, `C:/dev/wt/lodt/engine/README.md`, `C:/dev/wt/lodt/engine/tests/lod_tier_cancellation.rs`, `C:/dev/wt/lodt/engine/tests/lod_tier_measurements.rs`, `C:/dev/wt/lodt/engine/tests/lod_tier_preflight.rs`, `C:/dev/wt/lodt/kernel/tests/no_generation_in_persisted_artifacts.rs`.
