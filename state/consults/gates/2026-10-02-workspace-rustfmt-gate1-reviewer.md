*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #157, for PLAN node `workspace-rustfmt`, full gating. Reviewed: cut/workspace-rustfmt @ c6d1414dc063364ffb8e46428d739922d7bafbc7 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at c6d1414.*

*Verdict: FAIL on S1-1. Invalidator I4 fires: product-ci-shell is red because C1 re-laid out a constant that a TypeScript test reads by regex. F4 reproduced exactly. The resolution, a class 9 amendment or a redo, is put to the gate-1 architect before any code. The custodian checked afterwards that Product CI — Rust (run 37006671324) completed green.*

*Profile paths redacted at filing: none. The report's mention of synthetic fixture strings carries no real profile.*

---

VERDICT: FAIL. Reviewed `cut/workspace-rustfmt @ c6d1414dc063364ffb8e46428d739922d7bafbc7` (C1 6371d925a7f66b56dd66bb57d6e27a44dcdc0b11, base a0f0da77df77bef0c737cd835def556aaa882ce3). PR #157, gate 1, reviewer.

The formatter work itself checks out. F4 reproduces exactly, and C2 is clean against §2 items 4 and 5 and §8. The PR still fails because C1 turns a shell suite red. Under §5 I4 that is a stop.

## Blocking (S1)

**S1-1. I4 fires: product-ci-shell is red at the gated head, and C1 is the cause.**
- Run 37006671393 (Product CI — shell, pull_request, headSha c6d1414) has conclusion `failure`.
- The failed job is "typecheck · build · vitest · cargo test", at the step "Type-check, build, and test the frontend": 1 test failed and 1,093 passed, 1 of 72 files failed.
- The failing test is `FILTER_SCOPE_SENTENCE -- pinned against publish.rs's own copy > matches frontends/shell/src-tauri/src/publish.rs::FILTER_SCOPE_SENTENCE exactly, Rust line-continuation collapsed`, which fails with `AssertionError: expected null not to be null`.
- **Cause:**
  - `frontends/shell/src/publish/PublishPanel.test.ts:222` reads publish.rs as text and matches it with `/FILTER_SCOPE_SENTENCE: &str = "([\s\S]*?)";/`.
  - C1 moved the string literal onto its own line after `=`. The declaration is now `frontends/shell/src-tauri/src/publish.rs:70`, ending `&str =` with the literal on line 71. So the regex no longer matches.
  - This is formatter output: F4 reproduces it byte for byte. That makes it exactly the case §0 warned about, a test that reads Rust source as text.
- **Later steps were skipped and are unproven.** "Build and test the Tauri backend" (the src-tauri `cargo test`, including `sole_caller_scan.rs`) and both release-profile checks were skipped. F6 and §9's suites-green precondition both fail.
- **I cannot rule a fix inside the form:**
  - editing the test is a path outside §7's two files (§8 item 3), so it is a scope addition needing a class 9 amendment before any code (round 25, item 2);
  - a `#[rustfmt::skip]` or any `.rs` edit after C1 is blocked by §8 item 2.
  - The custodian and architect have to choose: a class 9 amendment, or a redo.

## Should fix (S2)

**S2-1. §0's list of tests that read Rust source as text is incomplete.** It names three Rust tests and `checkOriginEventName.mjs`, but not `frontends/shell/src/publish/PublishPanel.test.ts:221` or `:464`. Both read `src-tauri/src/publish.rs`. The second one (`PREPARE_CANCEL_KEY_PREFIX`) still passes. A grep for JS/TS readers of `.rs` files turned up no others. This is the architect's to weigh.

**S2-2. The header comment overstates H1.** `.github/workflows/rust-fmt.yml:19-20` says "One formatter gives the same output on every platform for this tree (hypothesis H1 of that form, tested by the first run of this workflow)."
- H1 (§0) covers only ubuntu-latest against the Windows reference profile.
- R3 (§2 item 7) says macOS gets no run and no claim, so "every platform" is a macOS claim.
- "One formatter" is also not what the first run tested (see S2-3).
- Suggested wording: rustfmt's output on ubuntu-latest is taken to equal the Windows reference profile's for this tree (H1 of that form). This is a §7 file, so a C3 may touch it.

**S2-3. CI ran a different rustfmt, and no record says so.**
- Every CI run reports `rustfmt 1.10.0-stable (b940084d7e 2026-09-28)`: E1 (37006671318, PR; 37005614999, push) and E2 (37005634673). Locally it is 1.9.0 (8bab26f4f6 2026-07-14).
- E1 is green, so I6 does not fire: 1.10.0 on Linux agrees with 1.9.0 on Windows for this tree. But that is not the same-version comparison H1 describes.
- §6 item 5 requires the CI version step to be recorded, and the worker report doesn't record it. The custodian's record should carry it.

## Nits (N)

- **N-1.** `.github/workflows/rust-fmt.yml:13` puts "May not claim" in double quotes. It is a section label, and it matches §1's label text, but §2 item 5 says the header "quotes nothing". Drop the quotes if a C3 touches the file.
- **N-2.** The worker report's verify-mutation checklist lists only the 9 MISS entries. The tool lists 13 as new (4 `ok`). I checked all 13 (table below).
- **N-3.** The PR body says "994 of the 1,241 … now point at moved text. 32 of them are hash-pinned". The 32 pinned tokens (B) are not part of the 994 (C counts only unpinned tokens), so "32 of them" misreads. It should be "32 others" or "of the 1,241".

## What I ran (exit codes and versions)

**Versions (local):** rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14); rustc 1.97.1 (8bab26f4f 2026-07-14); git 2.49.0.windows.1; node v24.18.1. Tool last-change commits at the head: verify-cites 522e448, verify-quotes f9444a4, verify-test-claims 57c626f, verify-mutation 7d24ed1, verify 2607202.

**F4, the reproduction (scratch detached worktree of a0f0da7 at C:/dev/wt/fmt-repro, since removed):**
- F1 at base:
  - `cargo fmt --all -- --check --color never`: exit 1, 2,029 `Diff in` lines over 126 files;
  - src-tauri `--check`: exit 1, 105 lines over 7 files. Both match §0.
- The two pass commands: exit 0 and exit 0. Porcelain then showed 133 entries, all ` M *.rs`, and 0 others.
- `git add -A; git write-tree` gave `ba3aa323bdba80527f74fb6ea8d57c4234d7d954`, and `git rev-parse 6371d92^{tree}` gives `ba3aa323bdba80527f74fb6ea8d57c4234d7d954`. **They are equal.**
- F3 at C1 (that worktree checked out at C1, porcelain 0): both `--check` commands exit 0.
- §6 item 1:
  - `git rev-list --parents -n 1 6371d92` gives one parent, a0f0da7;
  - `git diff --name-only a0f0da7 6371d92` gives 133 paths, 0 of them not ending `.rs`;
  - shortstat is 133 files, +11,828 / −3,428.
- C1's message names the two commands, the rustfmt version and the form, plus the trailers.
- `git worktree remove --force` exited 0, and no fmt-repro is left.

**C2's diff (c6d1414, two new files, 81 lines):**
- Workflow name `Rust fmt`; job name `cargo fmt --check (workspace and src-tauri)`.
- `push` and `pull_request` each carry the 7 declared paths, no `branches` filter, plus `workflow_dispatch`.
- Concurrency is `rust-fmt-${{ github.ref }}` with cancel-in-progress `${{ github.ref != 'refs/heads/main' }}`, the same shape as `.github/workflows/product-ci-rust.yml:176-178`.
- Permissions are `contents: read` only, with no `secrets.` reference.
- `ubuntu-latest`, `timeout-minutes: 10`.
- `actions/checkout@v4` has `persist-credentials: false`; `dtolnay/rust-toolchain@stable` has `components: rustfmt`.
- The version step, then the two §7 check commands, with `if: ${{ !cancelled() }}` on the second.
- No cache, no `continue-on-error`, no `|| true`, no `${{ }}` inside `run:`.
- `.git-blame-ignore-revs` has one comment line and `6371d925a7f66b56dd66bb57d6e27a44dcdc0b11`.
- No `.rs`, manifest, lockfile, config or other workflow changes after C1.
- No user-profile path in the diff or in either message. The `C:\Users\someone` hits are synthetic fixture strings in existing tests, only re-laid-out.

**§7 recount:** `git diff --numstat 6371d92… c6d1414… -- . ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'` gives `.git-blame-ignore-revs` 2/0 and `.github/workflows/rust-fmt.yml` 79/0. That is 81 lines over 2 files, within 120/2, so there is no overrun.

**§6 item 4:** my own script (an independent pinned-token test, strict line counts, D also split by gated or archived) and the worker's script as filed both give, at a0f0da7 and at 6371d92, A=1241, B=32, C=994, D=0 (gated D=0). Both exited 0.

**E2, run 37005634673:**
- Rust fmt, push, `probe/rust-fmt-red`, headSha 2d49ee4 (parent c6d1414); failure.
- The version step printed rustfmt 1.10.0.
- The root step failed, naming only `engine/src/lib.rs:74`. The src-tauri step failed, naming only `frontends/shell/src-tauri/src/lib.rs:15`. Each step exited 1.
- The probe commit adds trailing whitespace on one line in each of those two files and nothing else.
- No branch, local or remote, contains it any more.

**E1 and the CI of record at c6d1414 (`gh pr checks 157` exit 1, because one check failed):**
- **Rust fmt** 37006671318 (pull_request): success. Both check steps succeeded; rustfmt 1.10.0. The push run 37005614999 also succeeded.
- **Exposure scan** 37006671222: success. Count line: `profile-path-scan: range read 2 commits, 11909 added lines, 2 path names` (11,909 = 11,828 + 81).
- **DCO** 37006671180: success.
- **Product CI — shell** 37006671393: **failure**. The tauri-build job succeeded; the test job failed (S1-1).
- **Product CI — Rust** 37006671324: still in_progress at 12:40 UTC. The build step succeeded and the ordinary suite was running.

**Local suites at the head:**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: exit 0, 366 pass, 0 fail.
- verify-cites: exit 0, 1,073 files.
- verify-quotes: exit 0, 113 checked, 0 hash-reference errors.
- verify-test-claims: exit 0, 463 claimed tests.
- `timeout 570 node scripts/plan/verify.mjs`: exit 0, PASS.
- At C1 (scratch tree): verify-cites, verify-quotes and verify-test-claims all exit 0.

**verify-mutation `--base origin/main --head HEAD`** (origin/main is now 513cb05; the tool diffs three-dot, from merge-base a0f0da7): exit 1, "9 of 13 new test(s) have no recorded mutation naming them."
- This is the §4 checklist, not an observation of any mutation.
- All 13 listed tests exist by the same name, exactly once, at a0f0da7 and at c6d1414, at moved lines. So each is a re-laid-out declaration, and F4 proves it formatter output:
  - `engine/src/predicate.rs` 2497 and 2730
  - `engine/src/stream.rs` 2578 and 3007
  - `engine/tests/predicate_admission.rs` 312 and 433
  - `kernel/src/permission/grant.rs` 682 and 788
  - `kernel/tests/no_generation_in_persisted_artifacts.rs` 341
  - `kernel/tests/publish.rs` 334
  - `kernel/tests/skp_admission.rs` 273, 460 and 564

**Not run:** local `cargo test`.

**State:** nothing committed or edited in either checkout. The `C:/dev/wt/workspace-rustfmt` porcelain is empty at c6d1414. The scratch worktree is removed and no background process is left. My scratch scripts (`cost2.mjs`, the worker's `cost.mjs`) and logs are in the session scratchpad only.
