# A2-1 — the N-4 correction worker's report (2026-09-29)

*Custodian's filing note: the worker's hand-back for the one bounded correction on `cut/b1-close-nul-names-2`, which adds N-4 as its own named test. It is copied from the hand-back message with the harness's two-space indent removed. It has one location outside the commit itself: a panic location in command output, `kernel\tests\skp_projection.rs:583:5`, which is a branch-only line and is kept as the output printed it. The mutation was observed with the new test uncommitted, on base 19f37da, and the test is committed as 303dca0.*

---

Built: N-4 as its own standalone test, `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint`, added to `kernel/tests/skp_projection.rs` (after `every_projection_refusal_matches_its_committed_error_fixture_shape`, before the X1 section). It opens a fresh hostile-named fixture under its own handle (F12's harness: `Catalog::open` + `SkpHost::new`), following K-2's pattern, and layers X9's fixture-equality check on top.

Commit: 303dca0 on `cut/b1-close-nul-names-2`, pushed (`19f37da..303dca0`). Subject matches exactly as specified. Signed off (`git commit -s`).

Assertions in the new test, one line each:
- `err.code == "skp.projection_column_name_not_addressable"`.
- the refusal's field key set is exactly `{"column", "detail"}`.
- `err.fields["column"] == "nu\u{0}l"` (the bound name).
- `cancel_all_for_dataset` returns 0 both before and after the call (no ticket minted).
- `leases_issued()` is unchanged across the call.
- the live `err.code` and the live field key set match the committed fixture `v0-error-projection_column_name_not_addressable.json`'s own `code` and `fields` keys (X9's pattern).

Mutation observed: in `kernel/src/skp.rs::projection_error_of`, changed the `ProjectionError::ColumnNameNotAddressable` arm's code literal from `"projection_column_name_not_addressable"` to `"projection_column_unknown"`. Ran only the new test at that mutated state (pre-commit, uncommitted working tree, base commit 19f37da): failure recorded by name —
```
thread 'a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint' panicked at kernel\tests\skp_projection.rs:583:5:
assertion `left == right` failed: wrong code
  left: "skp.projection_column_unknown"
 right: "skp.projection_column_name_not_addressable"
```
Reverted with `git checkout -- kernel/src/skp.rs`; `git diff --stat` then showed only `kernel/tests/skp_projection.rs` changed. Re-ran the full file (11 tests) green before committing.

Check exit codes (all in the worktree, HEAD 303dca0):
- `cargo test -p spatial-kernel --test skp_projection`: 11 passed, 0 failed.
- `node scripts/plan/verify-test-claims.mjs`: rc=0, PASS (388 claims, N-4's claim now resolves to the new test by name).
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS (32 pre-existing loose-reference advisories, all unrelated to this change).
- `node scripts/plan/verify-quotes.mjs`: rc=0, PASS (112 checked; pre-existing baselined/advisory entries, none touching this file).
- `node scripts/plan/verify.mjs`: rc=0, PASS.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353 passed, 0 failed.

Files touched: `kernel/tests/skp_projection.rs` (new test added, +69 lines); `kernel/src/skp.rs` was mutated then reverted in the working tree, not part of the commit.

Off-scope noticed, not touched: `verify-cites.mjs` and `verify-quotes.mjs` report several pre-existing advisory/baselined findings in unrelated files (state/drafts/post-tag/*, engine/LOD-PREREGISTRATION.md, frontends/shell/*-PREREGISTRATION.md) — none are new, none relate to this branch's diff.

Exact state left: worktree clean, all changes committed and pushed. `git status --porcelain` in `C:\dev\wt\b1-close-nul-names`: empty (clean).
