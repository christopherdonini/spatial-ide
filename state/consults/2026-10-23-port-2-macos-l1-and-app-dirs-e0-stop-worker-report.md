*Custodian's filing note (2026-10-23): port-2's build by a worker-high on `cut/port-2-macos-l1-and-app-dirs` from the form's commit 1f7d06b5, stopped at I1 at E0. The run 12:35:23Z to 13:00:05Z by its transcript (Read 13, Bash 54, Edit 13, Write 7, Grep 2); its claims were read against that transcript's calls before filing: one commit (E0, the workflow file only) and one push, origin's branch equal to E0, no force push, rebase, amend, PR write or branch deletion; its Edit and Write calls only in the piece's worktree and its `p2-` scratch files. The worktree holds its prepared change for steps 3 and 4, uncommitted and never compiled, left in place as it says; nothing of it is filed here. Its background build was stopped by its own process tree before any result. Its finding on §2 item 6's count goes into the form's Amendment 2 (class 3). Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d5eef9b4373ab768428d7670d955e2d9a22137d6f205d04096b33d19c3597eed.*

---

Stopped: port-2-macos-l1-and-app-dirs at fb16262770c89395356f58bccf731583500d7859, I1 (a macOS test failed at E0).

**What I1 means here**
- I1 fires at E0, which carries no product change.
- I did not re-run, push anything else, or add any ignore, skip or exclusion. I did not start step 6 (local checks) or the mutation steps (step 5). No commit exists past E0.
- I did not run E1, E2 or E3.
- `a_cancel_inside_the_sort_is_observed_rather_than_waited_out` is not named by `timing-assertions-under-contention` or `timing-tests-assert-property-not-budget`. I found it by `git grep` of `*.md` and `*.yaml`, not in the PLAN bodies of either node or in their gate-file text. It is named by the proposed node `publish-sort-window-cancel-not-exercised-on-ci` (PLAN.yaml, opened 2026-10-09, a Windows-runner sighting). So I1's one-time re-run clause for those two nodes does not apply on my reading. The custodian decides.

**Step 1, at B (1f7d06b5)**
- P1: `git diff --quiet 2ffbf957 HEAD -- '*.rs' .github/workflows/product-ci-rust.yml` exited 0.
- I9: `node scripts/plan/cfg-boundary.mjs` exited 0, last line `cfg-boundary: 18 sites in 6 files, 0 outside every boundary`.
- I10, by `git grep -n data_dir -- '*.rs'`:
  - `pub(crate) fn data_dir() -> Option<PathBuf>` is at `kernel/src/permission/audit/log.rs:370`, as §0 has it.
  - The callers are `log.rs:355` (`resolve_log_path`) and `kernel/src/session_history.rs:133`, with the import at `:38`.
  - `engine/tests/geoarrow_batch_fixtures.rs` has an unrelated private `fn data_dir`.
  - `default_root` and `resolve_log_path` are unchanged; the shell calls `default_root` at `frontends/shell/src-tauri/src/lib.rs:451`.
  - No new caller.

**E0**
- Commit `fb16262770c89395356f58bccf731583500d7859`, subject `ci: port-2-macos-l1-and-app-dirs, E0: the macos-latest matrix entry and the macOS runner profile step (form section 2 item 1, OPEN-1 (a))`. It is signed off, with both trailer lines.
- Diff: `.github/workflows/product-ci-rust.yml` +6 lines, only the matrix entry and the `Runner profile (macOS)` step.
- First push: `git push -u origin cut/port-2-macos-l1-and-app-dirs`, rc 0. It carried B and E0.
- Run id **39954586687**, workflow `product-ci-rust.yml`, event push, headSha fb162627, conclusion failure. Jobs:

| Job | Id | Start | End | Result |
|---|---|---|---|---|
| windows-latest (name `cargo test --workspace (windows-latest)`) | 120417125056 | 12:36:26Z | 12:55:13Z | success |
| ubuntu-24.04 | 120417124985 | 12:36:26Z | 12:40:13Z | success |
| macos-latest | 120417124610 | 12:36:27Z | 12:56:08Z | failure |

- The macOS failure is in step 8, `Run the ordinary suite`, exit code 101. Steps 1 to 7 succeeded, including `Build the workspace and every test target`. The list step also succeeded.
- Profile step output, byte for byte: `26.6.2` then `arm64`. This meets P6 (version 14 or later, arm64), so H3 holds and I4 does not fire. The label gave macOS 26.6.2 on Apple Silicon.
- The failing test is the only one in the log:
  - `a_cancel_inside_the_sort_is_observed_rather_than_waited_out`, binary `tests/publish_cancellation.rs` of `spatial-kernel`.
  - Panic at `kernel/tests/publish_cancellation.rs:248:5`.
  - Message begins: `QueryRunning never fired: the sort finished inside one poll interval, so the sort-window cancel was not exercised and this test asserted nothing. Phases seen: [VerifyingSource, Querying, WritingPartitions, WritingStyle, WritingViewer, WritingManifest, Finalizing].` I only read this line up to "too small fo"; the log line is cut there.
  - The binary result was `5 passed; 1 failed`. Cargo then stopped at the first failing binary: `error: test failed, to rerun pass -p spatial-kernel --test publish_cancellation`.
- **Limit on "each failing test named":** the workflow has no `--no-fail-fast`, so macOS never ran the remaining test binaries. Other macOS failures cannot be ruled out from this run.
- Counts from the logs, parsed by script (the lists are in my scratch folder as `p2-e0-<entry>-ran.txt` and `-ignored.txt`, sorted):

| Entry | Tests run | Failed | `--list --ignored` entries |
|---|---|---|---|
| windows | 1020 | 0 | 57 |
| ubuntu | 1001 | 0 | 75 |
| macOS | 787 (717 passed, 69 ignored, 1 failed) | 1 | 75 |

  - macOS reached 66 test binaries; ubuntu had 93, so 27 were never run.
  - Sorted `--list --ignored`:
    - macOS and ubuntu are byte-identical, sha256 `d679a019108026cd40b1e4cd317906676c7a7f59aa3770827fbca2cd75c5486c`, so P2's ignored half holds.
    - Windows has sha256 `82ed4459527c5d6d4243567572ab64d739d2021e4397995e87a67962add514aa`.
  - P2's `--list` (tests run) half cannot be judged for macOS, because it stopped early.
  - These "ran" sets are tests executed in the ordinary-suite step (the CI has no `--list` step except the ignored one), keyed by binary path and test name.

**State left**
- HEAD is fb16262770c89395356f58bccf731583500d7859. Origin's `cut/port-2-macos-l1-and-app-dirs` is the same commit (checked after `git fetch`).
- The worktree is not clean. It holds my prepared, **uncommitted and never compiled** change, in these files:
  - modified: the workflow header comments, `KNOWN-LIMITATIONS.md`, `engine/src/lib.rs`, `engine/src/lod.rs`, the three `engine/tests/lod_tier_*.rs` files, `kernel/PERMISSION-BOUNDARY.md`, `kernel/src/permission/audit/log.rs`, `scripts/plan/cfg-boundary.mjs`, `scripts/plan/cfg-boundary.test.mjs`;
  - untracked: `engine/src/app_dirs.rs` (with A1 to A3), `engine/tests/lod_tier_root.rs`, `kernel/tests/app_data_dir_resolution.rs`, `kernel/tests/case_policy_volume.rs`.
- I prepared these while E0 ran, before the failure was known. `cargo fmt --all -- --check` passed, rc 0. I left them in place so the work is not lost. The custodian can discard them or resume from them.
- W1 to W5 were applied by script from §10, but I did not run the byte-for-byte check against the form. W1 and W2 are in `KNOWN-LIMITATIONS.md`, W3 in item 43, W4 in `kernel/PERMISSION-BOUNDARY.md`, W5 in `log.rs`'s module doc. I made no source-comment addition to item 43.
- The branch has no PR, and I took no PR action. The probe branch was not created.

**Count discrepancy in the form (§2 item 6)**
- It says 14 LOD-tier ignore reasons, with `lod_tier_builder.rs` 11, `lod_tier_cancellation.rs` 1, `lod_tier_preflight.rs` 1.
- At B, `lod_tier_builder.rs` has 14 occurrences of the old reason string, and the other two files have 1 each. That is 16 in the three files, plus the 1 in `kernel/tests/no_generation_in_persisted_artifacts.rs` held back by OPEN-C.
- I replaced all 16 in the working tree, because the three extra builder lines carry the identical string.
- The custodian should note this against the form.

**Processes and hold**
- I started one cold `cargo build --workspace --tests --locked` with target `D:/wt-targets/p2`, in the background, because a cold DuckDB build can exceed the 10-minute foreground cap.
- It was still compiling `libduckdb-sys` when I stopped. I killed it by its own PID tree (root PID 22924). It never produced a result. The `p2-build1.rc` file reads `BUILD-RC=0`, which is not a build result.
- No process I started still runs. The `gh run watch` and the build both exited. `Get-CimInstance` found no `cargo`, `rustc`, `cl` or `build-script-build` process for that target.
- Hold lines, my project only:
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF`
  - `MACHINE_RELEASED project=SpatialIDE affinity=FF (cores 0-7)`

**Model:** the harness reports Sonnet 5.5, model id `claude-sonnet-5-5`.
