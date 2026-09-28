# W2-D brief — draft for Fable's sighting (not launched)

*Custodian, 2026-09-28. Per `state/cloud/wave2-prompts.md` §4, W2-D: "The custodian writes its brief under the usual preregistration discipline and brings it to me; if I sight it, it launches with the same forbidden paths and stop conditions, one PR, and Windows CI on the PR is the verifier." Nothing here is committed on a branch, and nothing launches before the sighting. The five sighting points are at the end.*

**Sources.** Wave 1's D report (`state/cloud/wave1/D.md`: the findings are D-1 to D-4, and its custodian fields hold the triage) and the proposed PLAN node `suites-and-toolchain-beyond-windows`. At origin/main ebc7f5c, D-1, D-2 and D-4's code paths are as the report states. Since bb98f71, of the named files only `kernel/tests/no_generation_in_persisted_artifacts.rs` has changed (43ec01d, the watcher), and it still holds the tier-root test.

## 1. The five-line form

Before launch, the custodian commits it as the only commit on `cloud/wave2-D`, branched from main at that time. Its path is `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`.

```
Authority: PLAN node suites-and-toolchain-beyond-windows (wave-1 D-1 to D-4, state/cloud/wave1/D.md); state/cloud/wave2-prompts.md §3 item W2-D, sighted by Fable on <date>; the human's wave-2 authorisation, step 5
Scope: engine/tests/lod_tier_builder.rs, engine/tests/lod_tier_cancellation.rs, engine/tests/lod_tier_preflight.rs, kernel/tests/no_generation_in_persisted_artifacts.rs, engine/tests/common/mod.rs, kernel/src/permission/boundary.rs (its #[cfg(test)] module only), CONTRIBUTING.md -- 7 files; <= 60 non-generated lines
Change: on non-Windows hosts the 14 tests that need the Windows-only LOD tier root are ignored with a stated reason, boundary.rs's Windows-path assertion runs on Windows only, POLYGONS_100K resolves under the workspace target directory instead of a Windows literal, and CONTRIBUTING.md states the npm the shell's lockfile needs; on Windows nothing that runs changes
Tests+mutation: no test is added, so no mutation is owed; 14 tests gain only a cfg_attr(not(windows), ignore = ...) line with names and bodies unchanged; the verifier is Windows CI green, plus the custodian's local `cargo test --workspace -- --list` and `-- --list --ignored` on Windows giving identical output before and after
Out-of-scope: ADR none; security none (boundary.rs's non-test lines unchanged); wire none; guarantee none (on Windows, the only platform product CI runs, the tests that run and those ignored are identical before and after)
```

## 2. The prompt

W2-A1's shared rules, with the parts an implementation cut must differ in replaced. Each replacement is marked [W2-D], and every other line is W2-A1's verbatim. At launch, `<WAVE2_D_BASE>` is filled with the form commit's SHA, and `[paste the schema]` is filled exactly as for W2-A1.

```
You are a disposable cloud worker on the Spatial IDE repository, on one bounded implementation cut. [W2-D]
BASE: work exactly on branch cloud/wave2-D, whose head is <WAVE2_D_BASE> (main at launch plus this
cut's five-line preregistration). Run `git fetch origin cloud/wave2-D`, then `git worktree add
/tmp/wave2-D cloud/wave2-D`, and confirm that `git -C /tmp/wave2-D rev-parse HEAD` equals
<WAVE2_D_BASE> before anything else. All reading, building, testing and commits happen inside
/tmp/wave2-D; the session's own checkout stays on main. [W2-D]
ROLE: you implement exactly the cut below and report. You do not design, decide, or merge. [W2-D]

TASK — make the default Rust suites run clean on Linux without changing what runs on Windows (wave
1's D-1, D-2 and D-4 in state/cloud/wave1/D.md; D-3 as one documentation line). The cut's
preregistration is engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md on your branch: read it first,
because it binds (its Scope files and line budget are hard bounds).
- D-1: to each of the 14 default tests that reach the Windows-only LOD tier root
  (engine/LOD-PREREGISTRATION.md declares tier building Windows-only, refusing typed elsewhere),
  add exactly one line, `#[cfg_attr(not(windows), ignore = "<reason naming the Windows-only tier
  root>")]`. No early return, no runtime skip, and no test body edited: a test that passes
  vacuously is worse than one ignored with its reason.
- D-2: in kernel/src/permission/boundary.rs, inside its `#[cfg(test)] mod tests` only, the
  `D:\maps\out` assertion runs on Windows only. No non-test line of that file changes.
- D-4: in engine/tests/common/mod.rs, POLYGONS_100K keeps its Windows value byte for byte under
  `#[cfg(windows)]`. A `#[cfg(not(windows))]` arm resolves it under the workspace's target
  directory from `CARGO_MANIFEST_DIR`, so that no test ever writes a file named with a Windows
  path. The four other absolute Windows constants, used only by `#[ignore]`d measurement tests,
  are out of scope.
- D-3: one line in CONTRIBUTING.md's setup section, stating the npm version the shell's lockfile
  needs (npm 11 or later; CI runs Node 24). No lockfile or package.json change.
Verify on Linux: `cargo test --workspace --no-fail-fast` ends with 0 failed, and afterwards no
file whose name contains a backslash exists in the worktree. Report the passed, failed and ignored
counts before and after. Windows CI on the PR is the verifier: a change that is green on Linux and
red on Windows is rejected whole. [W2-D]

OBSERVATIONS: anything else seen on Linux goes under "Unproven observations", at most five, one
line each, and is not fixed. [W2-D]

COMMITS: only the TASK's changes, committed only to branch cloud/wave2-D and pushed. Open exactly
one pull request against main, titled "Wave 2 D: the default Rust suites on Linux (D-1, D-2, D-4)
and the npm floor (D-3)". Do not merge it. [W2-D]

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file except the `#[cfg(test)] mod tests` block of
kernel/src/permission/boundary.rs. [W2-D: the one exception, sighting point 1]

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope. Also stop if a default test fails on Linux for a reason other than
D-1, D-2 or D-4's, or if the change would exceed the preregistration's Scope files or line budget. [W2-D: the last sentence is added]

DCO: before any commit, inside /tmp/wave2-D run `git config core.hooksPath .githooks` and prove
the hook rejects an unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing. [W2-D: the worktree path only]
PRIVACY: never write a path that names a user profile (C:\Users\<name>, /Users/<name>, /home/<name>)
into any file or commit message; generic machine accounts (runner, user, root) are fine.
NETWORK: package registries only (crates.io, npm), and only to build.
PLATFORM: your results are Linux evidence only. Windows CI and the local custodian verify the product.

OUTPUT: your final message is the WAVE2 REPORT, in exactly the wave-1 schema with "WAVE1" read as
"WAVE2":
[paste the schema]
```

## 3. After the PR opens

1. Windows CI must be green on the PR.
2. The custodian runs the `--list` identity check locally on Windows, on main and on the PR head. It covers the default list and the ignored list, and requires byte-identical output on both. The line count and file count are taken by §21c's rule.
3. A single reviewer gate follows (§21b), with its report filed under `state/consults/gates/`.
4. The merge is the human's click, with a merge commit.
5. The node is marked done with `{pr: N}` in one commit.

## 4. Sighting points (Fable's)

1. **D-2's exception.** The standing forbidden list excludes every product source file, and D-2's test lives in `kernel/src/permission/boundary.rs`'s own test module. The brief grants that one block. The alternative is to leave D-2 out of W2-D; the custodian then does it locally as a separate short-form piece.
2. **D-3's content.** Stating a floor of npm 11 is a toolchain declaration. It matches CI's Node 24, but `CLAUDE.md` says "Node LTS", and Node 22, whose npm is 10, is still an LTS line. The alternatives are to drop D-3 from W2-D, or for the custodian to record it in `KNOWN-LIMITATIONS.md` instead (a path the worker may not write).
3. **Placement.** `suites-and-toolchain-beyond-windows` is `proposed`, with `order` null. Launching W2-D places it, and only the human sets `order` (AUTONOMY §1).
4. **Scope.** The four absolute Windows constants used by `#[ignore]`d measurement tests (`lod_tier_builder.rs:60`, `lod_tier_cancellation.rs:31`, `lod_tier_measurements.rs:42`, `admission_p4_corpus.rs:68`) stay as they are. Those tests run only on the measurement machine.
5. **Cost.** One more cloud session. Wave 1's D, a build-and-run item of about 41 minutes, sat in a two-session batch whose delta was $4. W2-D launches only if the credit allows, after batch 2's reading.
