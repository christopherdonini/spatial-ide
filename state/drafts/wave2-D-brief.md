# W2-D brief — as sighted by Fable (not launched)

*Custodian, 2026-09-28. Per `state/cloud/wave2-prompts.md` §4, W2-D: "The custodian writes its brief under the usual preregistration discipline and brings it to me; if I sight it, it launches with the same forbidden paths and stop conditions, one PR, and Windows CI on the PR is the verifier."*

*Sighted by Fable (all five points) and placed by the human in `state/directives/2026-09-28-wave2-D-sighting.md` (the 2026-09-28 W2-D sighting). This revision applies the sighting:*
- *D-2 and D-3 are the custodian's own commit on `cloud/wave2-D`, after the preregistration commit.*
- *The worker's NEVER WRITE line is W2-A1's, verbatim.*
- *The form's Scope is split by who changes which file.*
- *The launch comes after batch 2's balance reading.*

*The first draft is in git history, at 5cbea24.*

**Sources.** Wave 1's D report (`state/cloud/wave1/D.md`): findings D-1 to D-4, with its custodian fields holding the triage. The PLAN node is `suites-and-toolchain-beyond-windows`.

## 1. The five-line form

The custodian commits it as the first commit on `cloud/wave2-D`, branched from main. The custodian's D-2 and D-3 commit follows it. Its path is `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, and main carries it byte-identical from the commit that sets the node in progress.

```
Authority: PLAN node suites-and-toolchain-beyond-windows, placed by the human on 2026-09-28 (state/directives/2026-09-28-wave2-D-sighting.md, which also carries Fable's sighting of this cut's brief, points 1-5); wave-1 D-1 to D-4 (state/cloud/wave1/D.md); state/cloud/wave2-prompts.md §3 item W2-D
Scope: 8 files; <= 60 non-generated lines. The custodian's commit: kernel/src/permission/boundary.rs (its #[cfg(test)] module only), CONTRIBUTING.md, CLAUDE.md. The cloud worker's commits: engine/tests/lod_tier_builder.rs, engine/tests/lod_tier_cancellation.rs, engine/tests/lod_tier_preflight.rs, kernel/tests/no_generation_in_persisted_artifacts.rs, engine/tests/common/mod.rs
Change: on non-Windows hosts the 14 tests that need the Windows-only LOD tier root are ignored with a stated reason, boundary.rs's Windows-path assertion runs on Windows only, and POLYGONS_100K resolves under the workspace target directory instead of a Windows literal; CONTRIBUTING.md and CLAUDE.md state the npm floor (npm 11+, CI's Node 24); on Windows nothing that runs changes
Tests+mutation: no test is added, so no mutation is owed; 14 tests each gain one cfg_attr(not(windows), ignore) line and one assertion statement gains cfg(windows), names and bodies otherwise unchanged; the verifiers are Windows CI green on the PR, the worker's Linux workspace run with 0 failed and no file named with a backslash, and the custodian's Windows test lists (default and ignored) identical on main and on the PR head
Out-of-scope: ADR none; security none (boundary.rs's non-test lines unchanged); wire none; guarantee none (on Windows, the only platform product CI runs, the tests that run and those ignored are identical before and after)
```

## 2. The prompt

The prompt is W2-A1's shared rules, with the parts an implementation cut must differ in replaced. Each replaced part is marked [W2-D] here, and those markers are removed at assembly. Every other line is W2-A1's, verbatim. At launch, `<WAVE2_D_BASE>` is filled with the branch head's SHA, and `[paste the schema]` is filled exactly as it was for W2-A1.

```
You are a disposable cloud worker on the Spatial IDE repository, on one bounded implementation cut. [W2-D]
BASE: work exactly on branch cloud/wave2-D, whose head is <WAVE2_D_BASE>: main at the branch point,
then this cut's five-line preregistration, then the custodian's D-2 and D-3 commit. Run
`git fetch origin cloud/wave2-D`, then `git worktree add /tmp/wave2-D cloud/wave2-D`, and confirm that
`git -C /tmp/wave2-D rev-parse HEAD` equals <WAVE2_D_BASE> before anything else. All reading,
building, testing and commits happen inside /tmp/wave2-D; the session's own checkout is left as it is.
[W2-D]
ROLE: you implement exactly the cut below and report. You do not design, decide, or merge. [W2-D]

TASK — make the default Rust suites run clean on Linux without changing what runs on Windows (wave
1's D-1 and D-4 in state/cloud/wave1/D.md). D-2 and D-3 are already on your branch, in the
custodian's commit; do not touch them. The cut's preregistration is
engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md on your branch. Read it first: it binds, and its Scope
(which files are yours) and its line budget are hard bounds.
- D-1: to each of the 14 default tests that reach the Windows-only LOD tier root
  (engine/LOD-PREREGISTRATION.md declares tier building Windows-only, refusing typed elsewhere),
  add exactly one line, `#[cfg_attr(not(windows), ignore = "<reason naming the Windows-only tier
  root>")]`. No early return, no runtime skip, and no test body edited: a test that passes
  vacuously is worse than one ignored with its reason.
- D-4: in engine/tests/common/mod.rs, POLYGONS_100K keeps its Windows value byte for byte under
  `#[cfg(windows)]`. A `#[cfg(not(windows))]` arm resolves it under the workspace's target
  directory from `CARGO_MANIFEST_DIR`, so that no test ever writes a file named with a Windows
  path. The four other absolute Windows constants, used only by `#[ignore]`d measurement tests,
  are out of scope.
Verify on Linux, on the finished branch (so the check covers D-2 and D-3's commit too):
`cargo test --workspace --no-fail-fast` ends with 0 failed, and afterwards no file whose name
contains a backslash exists in the worktree. Report the passed, failed and ignored counts at
<WAVE2_D_BASE> and at your last commit. Windows CI on the PR is the verifier: a change that is green
on Linux and red on Windows is rejected whole. [W2-D]

OBSERVATIONS: anything else seen on Linux goes under "Unproven observations", at most five, one
line each, and is not fixed. [W2-D]

COMMITS: only the TASK's changes, committed only to branch cloud/wave2-D and pushed. The branch's
existing commits stay exactly as they are: no rebase, amend or force-push. Open exactly one pull
request against main, titled "Wave 2 D: the default Rust suites and the shell's install beyond
Windows (D-1 to D-4)". Do not merge it. [W2-D]

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope. Also stop if a default test fails on Linux for a reason other than
D-1's or D-4's, or if the change would exceed the preregistration's Scope files or line budget. [W2-D: the last sentence is added]

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
2. The custodian runs the `--list` identity check locally on Windows, on main and on the PR head. It covers the default list and the ignored list, and requires byte-identical output.
3. The size is counted by §21c's rule over the whole PR, excluding the form.
4. A single reviewer gate (§21b) covers the whole PR, including the custodian's commit. Its report is filed under `state/consults/gates/`.
5. The merge is the human's click, with a merge commit.
6. The node is marked done with `{pr: N}` in one commit.
