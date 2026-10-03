# Worker reports — port-1-linux-l1 (2026-10-03)

*Custodian's filing note: the worker's two hand-backs on the brief for PLAN node `port-1-linux-l1` (form `PORT-1-LINUX-L1-PREREGISTRATION.md`, committed 6a11144), each recorded verbatim with the harness's report indentation removed. Five rooted `path:line` cites, into probe-only or hypothetical lines that main does not hold (the M-text rewording note, E3a and E3b), are de-rooted at filing to their basenames, the directory prefix dropped; nothing else in the text is changed.*

*The custodian's reading, between the two:*
- *The first hand-back stopped at §2 item 0 on whether two `cfg!` calls on one line are one site or two.*
- *The custodian ruled from the form's own text: §7 declares stdout per site, and §0 counts `origin.rs` as 2. So the line prints twice, and S1 is 18 lines for 18 sites over 6 files.*
- *No amendment was made. The gates judge this reading.*

*The custodian's checks:*
- *branch `cut/port-1-linux-l1` at 6c3cd63, read from origin: commits a886894, 824d561, 23ee142 and 6c3cd63;*
- *`probe/cfg-boundary-red` is absent on origin.*

*Profile paths redacted at filing: none.*

---

## Hand-back 1 (the P1 stop)

STOPPED at §2 item 0 (P1), before any code. Reason: the cfg-site inventory differs from §0, which the brief says to stop and report as a class 2 matter for the custodian. Nothing is committed or pushed, and the worktree C:/dev/wt/port-1 is clean on cut/port-1-linux-l1 at b43c0eb.

**P1 results at b43c0eb**
- `git diff --quiet d310206 HEAD -- '*.rs'` exits 1, as expected. The 7 changed `.rs` files all come from #160. They are `kernel/src/skp.rs`, `kernel/tests/skp_admission.rs`, `kernel/tests/skp_filter_cancellation.rs`, `kernel/tests/source_watch_ordering.rs`, `protocol/skp/src/v0/commands.rs`, `protocol/skp/tests/conformance/main.rs` and `protocol/skp/tests/fixtures.rs`. None of them touches a cfg site, an ignore, or any file in §7.
- The LOD ignores match §0: 14 in total, split 11, 1, 1, 1 over `engine/tests/lod_tier_builder.rs`, `engine/tests/lod_tier_cancellation.rs`, `engine/tests/lod_tier_preflight.rs` and `kernel/tests/no_generation_in_persisted_artifacts.rs`.
- The three bare `#[ignore]` match §0: `kernel/tests/publish.rs:669`, `kernel/tests/publish.rs:739` and `kernel/tests/permission_boundary.rs:1057`.
- The compiled-out test in `kernel/src/permission/audit/normalize.rs` matches §0: `#[cfg(windows)]` at line 295 on `case_differences_collapse_on_windows`.
- The cfg sites do NOT match §0. A grep on cfg, cfg! and cfg_attr predicates naming `windows`, `unix`, `target_os` or `target_family`, over tracked `.rs` outside tests, benches, examples, spikes and the transport bake-off, finds:
  - `engine/src/watch.rs` 3 (86, 90, 103), `engine/src/lod.rs` 2 (927, 956) and `kernel/src/publish/error.rs` 6 (443, 445, 448, 450, 453, 455), all as §0 says.
  - `kernel/src/permission/audit/log.rs` 3 (371, 375, 398).
  - `kernel/src/permission/audit/normalize.rs` 2 outside its test module (186, 190), plus the line-295 test attribute inside `mod tests`.
  - `frontends/shell/src-tauri/src/origin.rs` 2, both `cfg!` calls on line 172. Line 156 is a doc comment.
  - `frontends/shell/src-tauri/src/main.rs:3`, which is `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]`. Its predicate holds only `debug_assertions`, so it is not a site under the §2 item 3(d) token rule. The form's own S5 fixture lists the same text as a non-match.
  - `kernel/src/permission/boundary.rs:537`, inside a `#[cfg(test)]` mod, as §0 describes.
- So on a literal reading main.rs is no site, and the form's 18 holds: 3+2+6+3+2+2. The inventory then matches §0 in every count.

**Why I stopped anyway**
I could not settle one point: whether a single line carrying two `cfg!` calls, as at `origin.rs:172`, is one site or two. §0 counts it as two ("origin.rs 2"). §3's S1 predicts "18 site lines". Counted as two sites, the 18 holds as sites but the output would hold 17 lines. Counted as one site per line, the output has 17 lines and not 18, because the six files give 3+2+6+3+2+1 = 17 lines. This is a form ambiguity between sites and lines in S1 and in the §7 count line (`<n> sites`). I am not guessing it.

**What I need from the custodian**
Either of these two:
1. A §10 amendment declaring that the check emits one output line per site, so `origin.rs:172` prints twice, and S1 is 18 lines, 18 sites, 6 files.
2. Confirmation that dedupe-per-line is intended, with S1 corrected to 17.

I recommend option 1. It matches §0's counts and needs no change to the declared output format. Say so, and I will proceed with §2 items 1 to 8 and the rest of the steps.

**Other notes**
- I did not run P4 or any cargo command.
- Model: claude-sonnet-5-5, no override. No context handoff received or produced.
- Off-scope, not done: §0's wording "excluded crates" excludes src-tauri from the Grep, yet counts `origin.rs`. This is minor and the allowlist prefix covers it.

---

## Hand-back 2 (the build)

PORT-1 is built and pushed to cut/port-1-linux-l1 at 6c3cd63, with no PR opened. Every suite passed except the `ubuntu-24.04` runs (E1 and E2 are the custodian's PR). I made one call outside the form and flagged one finding for the gates (both under deviations).

**P1 inventory at b43c0eb.** The 7 `.rs` files #160 changed touch no cfg site, ignore or §7 file. Counts match §0 under your ruling:
- 14 LOD ignores, split 11/1/1/1 over the four files.
- 3 bare ignores at `kernel/tests/publish.rs:669`, `kernel/tests/publish.rs:739` and `kernel/tests/permission_boundary.rs:1057`.
- The `normalize.rs:295` `#[cfg(windows)]` test.
- 18 OS-cfg sites over 6 files: watch 3, lod 2, error 6, log 3, normalize 2, origin.rs 2 (both on line 172).
- `main.rs:3` is not a site, and `boundary.rs:537` is test code.

**Commits** (`-s`, trailers as briefed):
- a886894: both workflows (matrix, profile step, list step, `**/*.rs` paths, `cfg-boundary` job, comments).
- 824d561: `cfg-boundary.mjs` and the T1 to T7 tests.
- 23ee142: the 14 LOD reasons, 3 release-only reasons, the normalize.rs `cfg_attr` ignore (rustfmt-wrapped), M1 to M7 recorded, KNOWN-LIMITATIONS item 1 paragraph, template line.
- 6c3cd63: rewording of the recorded-mutation text, because `verify-cites` read `shared.rs:1` and `x.rs:1` there as cites.

**M1 to M7.** All were observed at 824d561: each mutation applied, the named test run, failure seen, reverted. The first failing assertion is in each test's `// RECORDED MUTATION:` comment.

| Mutation | Test | First failing assertion |
|---|---|---|
| M1 (`lod.rs` off the allowlist) | T1 | status 0, got 1, "engine/src/lod.rs:927 outside every boundary" |
| M2 (only `cfg!` matched) | T2 | status 1, got 0 |
| M3 (test-module exclusion removed) | T3 | status 0 on `boundary.rs`, got 1, "boundary.rs:537 outside every boundary" |
| M4 (blanking skipped) | T4 | status 0, got 1 |
| M5 (`target_os` dropped) | T5 | stdout equality, the `cfg!` line missing and 3 sites in place of 4 |
| M6 (`tests/` exclusion removed) | T6 | status 0, got 1 |
| M7 (failed `git ls-files` read as empty) | T7 | status 2 outside a repository, got 0 |

**P4.** The Windows `-- --list` (1043 lines each) and `-- --list --ignored` (150 lines each), sorted, are byte-identical between b43c0eb and 23ee142. I ran both in the same worktree path, so the "Running" lines carry the same hashes. `diff base.list head.list` gives rc 0 with empty output, and the same for `.ign`. `cmp` printed BYTE-IDENTICAL.

**E3 probe** (plain pushes, never force-pushed).

| Push | Commit | Workflow | Run id | Result |
|---|---|---|---|---|
| E3a (creation) | e03da5f | Governance CI | 37103210808 | failure |
| E3a | e03da5f | Rust fmt | 37103210821 | success |
| E3a | e03da5f | Product CI — Rust workspace | 37103210864 | cancelled (concurrency, superseded by E3b) |
| E3a | e03da5f | Product CI — shell | 37103211000 | cancelled (concurrency, superseded by E3b) |
| E3b (fast-forward) | 840f93b | Governance CI | 37103232248 | failure |
| E3b | 840f93b | Rust fmt | 37103232275 | success |
| E3b | 840f93b | Product CI — Rust workspace | 37103232236 | cancelled by me |
| E3b | 840f93b | Product CI — shell | 37103232401 | cancelled by me |

- **E3a:** the `cfg boundary (PORTABILITY R2)` job ran and went red, with `cfg-boundary: predicate.rs:3221 outside every boundary` and `cfg-boundary: 19 sites in 7 files, 1 outside every boundary`.
- **E3b:** the `cfg boundary (PORTABILITY R2)` job (id 111146706467) went red, naming both plants:
  ```
  cfg-boundary: predicate.rs:3221 outside every boundary
  cfg-boundary: predicate.rs:3224 outside every boundary
  cfg-boundary: 20 sites in 7 files, 2 outside every boundary
  ```
  The widened filter fired on the Rust-only push, so H4 holds.
- **Plan job on the probe:** it also went red in `node --test`, with T1 and T2 failing. They read the tree and `HEAD:engine/src/predicate.rs`, which the probe had planted, so this is a probe artifact.
- **Probe deletion:** the probe was deleted on origin (`ls-remote` returns 0 heads), and locally (branch and extra worktree). It was cut from 6c3cd63, and none of its commits reached my branch.

**Suites, all exit 0:**
- `cargo test --workspace --locked`: 831 passed, 0 failed, 40 ignored. It ran at 23ee142; 6c3cd63 changes only JS comments.
- Both `cargo fmt --check` commands.
- `node --test` over `scripts/plan` and `scripts/hooks`: 415 tests, 415 pass.
- `node scripts/plan/cfg-boundary.mjs`: 18 sites in 6 files, 0 outside every boundary.
- `verify-cites`, `verify-quotes` (113 checked, 0 hash errors), `verify-test-claims` (474 claims).
- `verify-mutation --base origin/main --head HEAD`: all 7 new tests have a recorded mutation.
- `verify.mjs`, `queue.mjs --check`, `site.mjs --check`.
- `profile-path-scan` ran with no hits before each of the commits after the first.

**§7 count.** 600 lines over 13 files by §7's command at 6c3cd63, against the 750 budget, so there is no overrun.

**Deviations and findings:**
- **Template line:** I appended it with no blank line above it. That makes it exactly one added line, as §8 item 9 and §7's estimate of 1 require, but it renders as part of the preceding paragraph's block. Say if you want a blank separator instead.
- **Process error:** I committed a886894 before running `profile-path-scan`, so for that commit it scanned an empty staged set. The whole diff has no user-profile path.
- **Added a test-text span:** none.
- **Branch checkout:** I briefly checked out b43c0eb detached in the worktree for P4's base lists, then returned to the branch.
- **Not run:** E1 and E2 are the PR's runs, and the `ubuntu-24.04` job has not run yet, so P2, P3, P5 and P6 are unconfirmed.
- **Off-scope, not done:** the unused `WATCH_BUFFER_BYTES` warning off Windows, per the §0 intake.
- **Check-model:** claude-sonnet-5-5, with no override and no context handoff.

**Pre-gate self-check:**
1. Cross-module code uses real interfaces. The check shells out to `git ls-files -z` and reads real files, and T1 to T3 run it on the real tree and on `git show HEAD:` files.
2. Every completion claim points to evidence above.
3. The messages are the §7 strings and state facts only.
4. Every test reaches its intended assertion, as shown by the M1 to M7 failures at assertions past setup.

Caller grep: `cfg-boundary.mjs` has no exports. Its only product caller is the `cfg-boundary` job in `.github/workflows/governance-ci.yml`.
