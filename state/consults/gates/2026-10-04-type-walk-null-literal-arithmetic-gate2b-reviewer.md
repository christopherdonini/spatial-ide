# PR #170 gate 2b — reviewer
Reviewed: cut/type-walk-null-literal-arithmetic @ 1484b5bac9e29d6a7b47331f1cbd157864d10eb5

**Verdict: PASS.** No S1, no S2, one N. Scope: the change since gate 2 (3074e9a0 to 1484b5ba). Gate 2's other results stand on the predecessor's report, `state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate2-reviewer.md`, because nothing else changed.

## Checks

1. **The diff is one comment line.** `git diff --stat 3074e9a0 1484b5ba` reports 1 file, 1 insertion, 1 deletion, in `engine/tests/filter_type_admission.rs`. The hunk replaces line 418 only, a `//` comment inside `corpus()`. `git log --oneline 3074e9a0..1484b5ba` shows one commit, 1484b5ba. No code, no other test text, no record changed. Pass.
2. **S1-1 is disposed.** Line 418 at 1484b5ba, byte-copied (`engine/tests/filter_type_admission.rs:418` @ 1484b5ba, a test-text span on an unmerged branch, named by commit id with no hash):
   `        // H-4's class-2 result, observed at DuckDB v1.5.5 at commit 8efcde98: the surrogate prepare refuses`
   - §8 item 13 (a DuckDB behaviour stated without its version): holds. The comment names v1.5.5. `git show 8efcde98:Cargo.lock` gives `duckdb` and `libduckdb-sys` at 1.10505.0, which is DuckDB v1.5.5 under the crate's version scheme, and `git diff --stat 8efcde98 HEAD -- Cargo.lock engine/Cargo.toml` is empty, so the head runs the same version. It agrees with Amendment 3's result bullet (v1.5.5, observed at 8efcde98).
   - §8 item 19 (a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id): holds. The comment names the observation commit, 8efcde98, and carries no hash. `git merge-base --is-ancestor 8efcde98 HEAD` exits 0; 8efcde98 is 8efcde986e5822048d77e29e8fd5b1ddbe20430f, the commit Amendment 3 names as the observation point.
3. **Suites at the head.** `cargo fmt --check -p spatial-engine` exits 0. `cargo test -p spatial-engine --test filter_type_admission` exits 0: 3 passed, 0 failed (139.84 s). Pass.
4. **Branch CI.** `gh pr checks 170` exits 0; all 16 rows pass, across both workflow runs (37200362486-family and 37200364767-family). `gh pr view 170 --json headRefOid` gives 1484b5bac9e29d6a7b47331f1cbd157864d10eb5, the reviewed head. Pass.
5. **S2-1 is disposed.** `gh pr view 170 --json body` (rc 0) describes the head: commits through 1484b5ba with its purpose; worker reports 1 to 3 (each confirmed on origin/main with `git ls-tree`); M1 to M7 observed, re-observed by the gate-2 reviewer at 3074e9a0; P-3 +11 admitted, +12 refused, B-T1b equal at 897; size 270 of 300 over 2 files; gate 1 FAIL, gate 2 architect PASS (gate-log 384) and reviewer FAIL (gate-log 385), gate 2b at 1484b5ba scoped to the diff since 3074e9a0. Pass.

## Findings

**N1.** Line 418 is 108 columns, past the 100-column width. rustfmt does not reflow comments and both the local and branch CI fmt checks pass, so nothing fails; rewrapping is optional and would need its own commit, which this scoped gate does not ask for.

## Commands (worktree C:/dev/wt/null-literal, CARGO_TARGET_DIR=D:/wt-targets/null-literal)

| Command | Exit |
|---|---|
| `git rev-parse HEAD` (1484b5bac9e29d6a7b47331f1cbd157864d10eb5) | 0 |
| `git status --porcelain` (empty, before and after) | 0 |
| `git diff --stat 3074e9a0 1484b5ba` | 0 |
| `git diff 3074e9a0 1484b5ba` | 0 |
| `git log --oneline 3074e9a0..1484b5ba` | 0 |
| `git merge-base --is-ancestor 8efcde98 HEAD` | 0 |
| `git show 8efcde98:Cargo.lock` (duckdb, libduckdb-sys 1.10505.0) | 0 |
| `git diff --stat 8efcde98 HEAD -- Cargo.lock engine/Cargo.toml` (empty) | 0 |
| `cargo fmt --check -p spatial-engine` | 0 |
| `cargo test -p spatial-engine --test filter_type_admission` | 0 |
| `gh pr checks 170` | 0 |
| `gh pr view 170 --json headRefOid,body` | 0 |
| `git fetch origin main` (main checkout) then `git ls-tree -r --name-only origin/main state/consults` | 0 |

No mutation applied. No commit, rebase or branch-CI publish. The worktree ends at 1484b5bac9e29d6a7b47331f1cbd157864d10eb5 with an empty porcelain.
