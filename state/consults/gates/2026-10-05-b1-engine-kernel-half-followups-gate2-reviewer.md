# PR #178 gate 2 — reviewer (scoped)
Reviewed: cut/b1-engine-kernel-half-followups @ bff3e21def3d57a238a87d305eae3e3fff094856

**Verdict: PASS.** No S1, no S2. One N.

Scope: AUTONOMY.md §22 scoped re-gate of the fix commit bff3e21d only (correction round 1 of 2). It fixes gate-1 reviewer N3 and gate-1 architect S1-1. Nothing outside bff3e21d is re-gated. Gate 1's Correctness and Evidence carry forward, subject to the applicability check below. Line cites are `@ bff3e21d` unless another commit is named. b438c587 is b438c58728d044e67466c438b35091f813e57be2.

## Findings

**S1:** none.

**S2:** none.

**N1 — the doc line 358 holds history, not a stale claim.** Gate-1 N3 called the `codes.len() == 7` at `kernel/tests/skp_projection.rs:358 @ 7b05dfd6` "the same stale 7". It reads instead as 12.2's closing note: the assertion that was 7 "becomes 8" (`kernel/tests/skp_projection.rs:358-359 @ bff3e21d`). That is true as history. No action. It is outside bff3e21d and not re-gated.

## 1. The diff is exactly one comment line

- `git -C C:/dev/wt/b1f rev-parse HEAD` gives bff3e21def3d57a238a87d305eae3e3fff094856, rc 0.
- `git log --oneline 7b05dfd6..bff3e21d` shows one commit, bff3e21d, rc 0.
- `git show --stat bff3e21d`: `kernel/tests/skp_projection.rs | 2 +-`, 1 insertion and 1 deletion, rc 0.
- `git diff -U0 7b05dfd6 HEAD | grep '^@@'` gives one hunk, `@@ -373 +373 @@`, rc 0. It is a same-line substitution, so every other line in the file keeps its number and its bytes.
- The removed line at `kernel/tests/skp_projection.rs:373 @ 7b05dfd6`, from `git show bff3e21d`:
  `// (the same test whose closing `codes.len() == 7` assertion is K-4's own claim). Reverted.`
- The added line at `kernel/tests/skp_projection.rs:373 @ bff3e21d`, byte-copied by `sed -n 373p`:
  `// (the same test whose closing `codes.len() == 8` assertion is K-4's own claim). Reverted.`
- The only change is `7` to `8`. The line is a `//` comment inside the RECORDED MUTATION block (`kernel/tests/skp_projection.rs:368-373 @ bff3e21d`). No code, no doc comment, no other file.

## 2. The new text is true at the head and at b438c587

The comment names b438c587 as its observation commit (`kernel/tests/skp_projection.rs:368 @ bff3e21d`). The test is `every_projection_refusal_is_synchronous_typed_and_pre_mint`.

- At bff3e21d the `fn` line is 387. Its closing assertion, at `kernel/tests/skp_projection.rs:571-575 @ bff3e21d`, is `assert_eq!(codes.len(), 8, ...)`, and it is the last statement before the closing brace.
- At b438c587 the `fn` line is 384 and the closing brace is 573. Its closing assertion, at `kernel/tests/skp_projection.rs:568-572 @ b438c587`, is `assert_eq!(codes.len(), 8, ...)`.
- Commands: `git show <rev>:kernel/tests/skp_projection.rs | grep -n "codes.len()"` for both revisions, rc 0; `sed -n` over each range; `grep -n` for the `fn` line and the closing brace.
- `git merge-base --is-ancestor b438c587 origin/main`, rc 0. The pinned commit is on main (origin/main f9ae030dd83c3457bb58a23d5034bff3bbfdda6e).
- "8" is true at both commits. S1-1 and N3 are discharged by `kernel/tests/skp_projection.rs:373 @ bff3e21d`.

## 3. Semantic applicability of gate-1 observations

- No re-run is needed. bff3e21d changes one `//` comment line. A line comment produces no code and no rustdoc output, so no compiled test or product code differs from 7b05dfd6.
- M-E2 and M-E2′ were observed at 7b05dfd6 against `engine/src/stream.rs`. That file is byte-identical between 7b05dfd6 and bff3e21d: `git diff --stat 7b05dfd6 HEAD` names only `kernel/tests/skp_projection.rs`, rc 0. Both still apply.
- S-1, S-2 and K-1 to K-8 were observed at b438c587, a fixed commit that bff3e21d does not touch. They still apply.
- Gate 1 said each observed message agrees with its rewritten comment. For the K-3 row's comment, the mutation text and the Observed message (`kernel/tests/skp_projection.rs:368-372 @ bff3e21d`) are unchanged. Only the parenthetical about the closing assertion changed. That agreement still holds.
- Gate-1 cites pinned `@ 7b05dfd6` stay historical pins and resolve at that commit. Because the substitution kept the same line, a cite to any line other than 373 also reads the same bytes at bff3e21d.
- None of the round-25 checks changes. The new comment pins b438c587, a commit on main, by commit id. It adds no hash pin at a branch commit. It calls no `verify-mutation` run an observation.

## 4. §7 at the head

`git diff --numstat $(git merge-base origin/main HEAD) HEAD -- engine/src/stream.rs kernel/tests/skp_projection.rs protocol/skp/SKP-V0.md engine/README.md`, with merge-base f75dff0e17e2d58ea0fe0fde1e607742bd2ccea4, rc 0:

| File | + | − | Total | Ceiling |
|---|---|---|---|---|
| `engine/src/stream.rs` | 146 | 51 | 197 | 230 |
| `kernel/tests/skp_projection.rs` | 41 | 34 | 75 | 100 |
| `protocol/skp/SKP-V0.md` | 8 | 0 | 8 | 12 |
| `engine/README.md` | 3 | 3 | 6 | 10 |
| **Total** | | | **286** | **360** |

- The counts are unchanged from gate 1, because the fixed line was already a changed line in the diff.
- No overrun, so no class 8.
- `git diff --quiet origin/main HEAD -- engine/B1-FOLLOWUPS-PREREGISTRATION.md`, rc 0. The form, and so its §7 line, is unedited.
- `git diff --name-only <merge-base> HEAD` names only the four §7 files, rc 0.

## 5. CI

- `gh pr checks 178`, rc 0: 16 checks, all pass.
- `gh pr view 178 --json headRefOid` gives bff3e21def3d57a238a87d305eae3e3fff094856, rc 0.
- `gh run list --commit bff3e21def3d57a238a87d305eae3e3fff094856`, rc 0: 10 runs, all completed success. Four ran on the branch-update event: Rust fmt, Governance CI, Product CI shell, Product CI Rust workspace. Six ran on the pull_request event: those four plus DCO sign-off and Exposure scan.

## State left

- Worktree `C:/dev/wt/b1f`: read only, HEAD bff3e21d, `git status --porcelain` empty, rc 0.
- No cargo run, no commit, nothing sent to the remote.
- The only write is this file.
