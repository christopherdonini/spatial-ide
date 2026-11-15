# Port-2's worker report: the kernel test reason, E1 and E2 by run id, and a stop at step 5

*Filed by the custodian by script from the worker's transcript: its hand-back, 6793 bytes, sha256 7aa5ead69439407d301900fb165fa732ca49e047a94240e8be66382958463dcc, received at 2026-11-15T07:14:08Z by the custodian's transcript; the run 2026-11-15T06:28:53Z to 2026-11-15T07:14:08Z, 50 tool calls (39 Bash, 5 Read, 3 Edit, 1 Write, 1 Grep, the hand-back), one tool error (an Edit before its Read, which the report states), model claude-sonnet-5-5. It was dispatched at 2026-11-15T06:28:52Z by the custodian's transcript, in the background, on its brief in the custodian's scratch folder (13192 bytes, sha256 0d201572a110dfc643eb23b59a2550e34a9591dce132b1e069c4b338ace4b588), which the prompt names. One change: in the assertion that step 5 copies, the user-profile part of the path is masked as `<user-local-appdata>`, by the repository's rule on profile paths. Nothing else is changed but a final newline added. The text below the rule is the report.*

---

Stopped: port-2-macos-l1-and-app-dirs, step 5's stop rule fired. Under M6 a test outside `case_policy_volume` fails, so I did not run the E3 probe (step 6). C is pushed, and E1 and E2 are recorded.

**Start state**
- HEAD was 72cc7f0f92cf90445d783b35c9b68bb19f9a09c7, branch `cut/port-2-macos-l1-and-app-dirs`, porcelain empty, and origin's branch equal to HEAD.
- `df -h`: C: 51G free, D: 376G free.
- S0: `gh pr list --state open` printed `[]`, so there were no branch diffs to check.
- Step 1's `Edit` first failed because I had not yet read the file. The two greps I ran in that same call therefore ran before the edit; I re-ran them after it.

**Step 1**
- `git diff --stat`: 1 file, 1 insertion, 1 deletion, exit 0.
- Grep for the old reason string: exit 1, no match.
- Grep for the new reason string, exit 0: `lod_tier_builder.rs` 14, `lod_tier_cancellation.rs` 1, `lod_tier_preflight.rs` 1 and `no_generation_in_persisted_artifacts.rs` 1, which makes 17.

**Step 2 (all exit 0)**
- `cargo fmt --all -- --check`: exit 0.
- `cargo test -p spatial-kernel --locked --test no_generation_in_persisted_artifacts`: 9 passed, 0 failed. The first build was a full one.
- `cfg-boundary.mjs` printed `cfg-boundary: 19 sites in 7 files, 0 outside every boundary`.
- `verify-cites`, `verify-test-claims`, `verify.mjs --offline` and `forms-layout`: exit 0.
- `verify-quotes`, in a hold: exit 0, last line `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 934 ruling cites resolved, 0 ruling-cite errors.`
- `node --test` over the three script suites, in a hold: 604 pass, 0 fail, so no `guardian parity` or hooks fixture failed.
- **§7's count, `origin/main...HEAD` before C:** 939 changed lines (870 added, 69 deleted) over 14 files, against 850 over 16. That is an overrun, already recorded as class 8 in Amendment 5. The per-file counts (added/deleted):
  - workflow 23/10
  - KNOWN-LIMITATIONS 3/3
  - `app_dirs.rs` 277/0
  - `lib.rs` 1/0
  - `lod.rs` 19/18
  - `lod_tier_builder.rs` 14/14
  - `lod_tier_cancellation.rs` 1/1
  - `lod_tier_preflight.rs` 1/1
  - `lod_tier_root.rs` 168/0
  - PERMISSION-BOUNDARY 1/1
  - `log.rs` 12/16
  - `app_data_dir_resolution.rs` 236/0
  - `case_policy_volume.rs` 105/0
  - `cfg-boundary.mjs` 3/2
  - `cfg-boundary.test.mjs` 6/3
- C adds 2 lines, so the count with C is 941 over 15 files. The no-generation file is not in the 14 because C was not yet committed when I counted.

**Step 3**
- C is cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5, committer time 2026-11-15T08:00:05+01:00.
- Subject: `test: the no-generation scan's LOD-tier ignore reason names the application-directories boundary`. It changes the one file `kernel/tests/no_generation_in_persisted_artifacts.rs`.
- The push went in a call of its own (72cc7f0f..cf5e7c4c). After it, `origin/cut/port-2-macos-l1-and-app-dirs` equals C and the porcelain is empty.

**Step 4: E1 and E2**
- **E1:** `Product CI — Rust workspace`, run 43687946638, in_progress when last read after M6; it appeared at the first poll (15 s).
- **E2:** `Governance CI — plan, queue, site`, run 43687946684. In progress at first appearance, success at the last read.
- Other runs at C, last read:
  - Ported notices 43687946680: success
  - Product CI — shell 43687946744: success
  - Rust fmt 43687946681: success

**Step 5: M6 on Windows**
- I applied M6 by renaming `let parent =` to `let _canonical =` in `resolve_destination`, in `kernel/src/permission/grant.rs`. The diff is saved at `<S>/p2e-m6.diff`.
- `cargo test -p spatial-kernel --locked --no-fail-fast` (shared hold) exited 101 with two failing targets:
  1. `case_policy_volume`: `on_a_case_insensitive_volume_a_destination_typed_in_another_case_is_recorded_in_its_on_disk_case_under_its_profile_token`. This is K1, as predicted. Its first failing assertion, byte-copied: ``assertion `left == right` failed: the destination must be recorded in its on-disk case under the profile token; resolved: \\?\<user-local-appdata>\Temp\cASE-pOLICY-pROBE-21272-0\iNNER\bundle``, with `left: "<user-home>/iNNER/bundle"` and `right: "<user-home>/Inner/bundle"`. This matches the build report's M6 observation.
  2. **Outside K1's binary, which fires the stop:** `publish_cli`: `a_directory_scoped_grant_covers_a_publish_into_that_directory`, panicked at `kernel\tests\publish_cli.rs:197:5`, "a publish into a directory-scoped grant's directory failed with exit code: 1". The refusal text says the grant scopes a direct child of `<user-local-appdata>/Temp/spatial-kernel-publish-cli-tests/grant-destination/published`, while the publish resolves to `<temp>/spatial-kernel-publish-cli-tests/grant-destination/published/bundle`.
- That second failure is my reading, not proven: M6 breaks the "both sides through one function" property of `resolve_destination` (the doc comment above it describes this), so the typed path and the canonical path no longer match.
- It means CI's `cargo test --workspace --locked` could stop at `publish_cli` and never reach K1's binary on a probe branch. `case_policy_volume` sorts before `publish_cli`, so K1 may still run first, but I did not test that. The custodian decides.
- I reverted with `git checkout -- kernel/src/permission/grant.rs`, and `git diff` and the porcelain are both empty. HEAD is C.

**Step 6: not run**
- No probe branch, no P, no E3 run.

**Left running:** nothing. My background shells all finished, and no process of mine remains.

**Status readings** (reading line only; no `project=SpatialIDE` line in any status):

| Status | Before | quiet | average | peaks-over-25 |
|---|---|---|---|---|
| 1 | cargo test (no_generation) | False | 35.7% | 60 |
| 2 | verify-quotes | False | 30.0% | 60 |
| 3 | `node --test` | False | 26.4% | 39 |
| 4 | M6 cargo | False | 33.2% | 60 |

The four holds were granted. A fifth shell was the hold for `verify-quotes`; its hold line named my shell and one other bash, both mine.

**Departures from the brief**
- The first Step 1 `Edit` failed because the file had not been read, as noted above.
- My wait loops for the first cargo run had no hard timeout; they ended when the run finished. The later loops were bounded.
- `fetch` in the main checkout updated refs only.
- The message trailer's `noreply@anthropic.com` is the brief's own mandated line.
- I did not read `kernel/tests/case_policy_volume.rs` whole, only the K1 block. The form's §2 item 6, §4, §5, §7 and §8 and Amendments 1 to 6 I read whole.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

Files: C:/dev/wt/p2/kernel/tests/no_generation_in_persisted_artifacts.rs (committed); the M6 diff is at `<S>/p2e-m6.diff`; the logs are at `<S>/p2e-*.txt`.
