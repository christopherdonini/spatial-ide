*Custodian's filing note (2026-11-09): the clippy 12c worker's report, from its hand-back byte for byte (7381 bytes, sha256 1439b44095849319170518821bc6accb4604947aad5f8e6c2d195b8c43887f1b), saved with one final newline. The worker ran from 14:11:40Z to 15:07:47Z by its transcript (claude-sonnet-5-5; unique calls: Bash 37, Read 4, Write 2, 43 in all, the hand-back apart; no errored result, no Guardian or harness refusal; the guard runs' and the mutations' exit codes are in its output files). Checked by the custodian at origin: the branch at 1889a28a, one commit on f703b720; 17 lines changed in the seven Scope files, against the declared 40; draft PR #303 opened by the custodian at 15:08:35Z. Fourteen of the report's byte-copied lines (the six panic lines, the three assertion messages, two numstat rows, the -D stop line, the clippy version and the head hash) each occur in a tool result of that transcript. The eight rows outside the seven files at the base are 12d's slice exactly (rows 27 to 32 in kernel/src and rows 44 and 45 in renderer/src, the architect's draft's table row 12d), so OPEN-D's red line is not reached. Two of them are in renderer/src, which the form's N3 did not expect: its reading that clippy lints only the package `-p` names does not hold here, and the -D run stops at the spatial-renderer lib, not the kernel's. CI at the PR head, read at 2026-11-09T15:48:54Z: all 18 checks passed. The ubuntu-24.04 job's log, read by the custodian for both runs at the head (jobs 129243243090 (push) and 129243973831 (pull_request)), holds no line naming `peak_working_set` and no `warning:` line, as N3 predicts for L35 and L42.*

---

Built: clippy-deny-warnings-workspace 12c at 1889a28a69698be2f87e519668d634c2e52cdd19

**Worktree.** After fetch, origin/main was f703b720f9470dd8c6d114f5de488050ca63b4d9 and the form's sha256 at it was 81d32ec69e9773f9e705b36605cc45e875ab5487008ea134945ca7f461b8313e. Worktree is C:/dev/wt/c12c on branch cut/clippy-deny-warnings-workspace-12c, based at B = f703b720. Cargo target was D:/wt-targets/c12c throughout.

**Base.** HEAD was f703b720. clippy 0.1.97 (8bab26f4f6 2026-07-14), rustc 1.97.1 (8bab26f4f 2026-07-14). The JSON run exited 0. My script counted 33 raw and 19 distinct.
- Scope rows: exactly N1's eleven, so no stop. The script printed them at:
  - manual_contains import_layout_factorial.rs:1858:27
  - assertions_on_constants indexed_budgets.rs:569:5
  - format_in_format_args indexed_budgets.rs:1166:15
  - bool_assert_comparison publish.rs:279:5, :280:5 and :957:5
  - manual_is_multiple_of scale_pass.rs:191:12
  - assertions_on_constants slice_budgets.rs:467:5
  - assertions_on_constants support/mod.rs:342:5
  - await_holding_lock wire_bytes_invariant.rs:191:9 and :398:9
- Outside the seven files there were 8 rows, recorded and not fixed:
  - kernel/src/bin/publish-bundle.rs:149 manual_is_multiple_of
  - kernel/src/lib.rs:414 and :489 type_complexity
  - kernel/src/permission/boundary.rs:536 ptr_arg
  - kernel/src/publish/mod.rs:839 needless_borrow
  - kernel/src/skp.rs:277 type_complexity
  - renderer/src/canonical.rs:240 manual_range_contains
  - renderer/src/style.rs:10 doc_lazy_continuation
- The form expected six kernel/src rows (27 to 32). The base has these 6 kernel rows plus 2 renderer rows, which are outside kernel and also not fixed.

**Fixes.** Each is exactly the Change line's form, and the diff showed only those lines.
- Row 33: statement-level allow before `let gate_overall`.
- Row 35: statement-level allow before `let art`.
- Rows 36 to 38: `assert!(!<expr>)` with the same expressions.
- Row 39: `n.is_multiple_of(50)`.
- Rows 34, 40 and 41: allow above each `fn refuse_debug`.
- Rows 42 and 43: allow between `#[tokio::test]` and `async fn`.
- L35 and L42: deleted the `pub peak_working_set: usize,` line in the two non-Windows stubs.
- `cargo fmt --all` exited 0. `git diff --name-only` named only the seven files.

**Pre-commit JSON run.** It exited 0 with 8 distinct rows, 0 of them in the seven files. No fallback was needed, so none was taken.

**Commit 1.** Signed off, with `-s` as the only Signed-off-by line. The message file had no `@` outside the Co-Authored-By line.
- Subject: `fix: clippy-deny-warnings-workspace 12c, the eleven Windows clippy rows and two Linux-only warnings in seven kernel test files removed, no behaviour, guard or assertion strength changed`

**Head runs.**
- Head JSON run: rc 0, 8 distinct, 0 in the seven files. The outside rows are identical to the base by (lint, file, span, message) (diff empty).
- `-D warnings`: rc 101, recorded not claimed. Output is in c12c-deny.txt. It stops at `could not compile spatial-renderer (lib) due to 2 previous errors`, so it never reached the kernel.
- `cargo fmt --all -- --check`: rc 0.
- `cargo test --workspace --locked`: rc 0. Summed over 118 test-result lines: 1027 passed, 0 failed, 66 ignored. No FAILED in the log.
- `cargo test --locked -p spatial-kernel --no-run`: rc 0.
- Guard runs, each rc 101, byte-copied from the output files:
  - g34: `thread 'measure_the_indexed_slice_against_docs_08' (76652) panicked at kernel\tests\indexed_budgets.rs:569:5:` then `this harness produces measurements, and a debug build invalidates every one of them. Run: cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture`
  - g40: `thread 'measure_the_slice_against_docs_08' (68672) panicked at kernel\tests\slice_budgets.rs:467:5:` then `this harness produces measurements, and a debug build invalidates every one of them. Run: cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture`
  - g41: `thread 'the_5gb_scored_cells' (21124) panicked at kernel\tests\support\mod.rs:343:5:` then `import_layout_factorial::5gb-scored produces measurements, and a debug build invalidates every one of them. A number taken on a debug build is not a smaller number, it is not a measurement. Run with --release.`
  - All three locations match N3's computed ones.
- Mutations, each rc 101 on the product-side form. The test-side fallback was not needed. Each was reverted with `git checkout -- kernel/src/bundle/mod.rs`, and porcelain was empty after each.
  - M37: the diff was line 889, `("hashed", Json::Bool(false)),` to `Json::Bool(true)`. `thread 'a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains' (51480) panicked at kernel\tests\publish.rs:279:5:` then `assertion failed: !manifest["sidecar"]["hashed"].as_bool().unwrap()`
  - M38: the diff was line 890, `("verified", Json::Bool(false)),` to `Json::Bool(true)`. `thread 'a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains' (51800) panicked at kernel\tests\publish.rs:280:5:` then `assertion failed: !manifest["sidecar"]["verified"].as_bool().unwrap()`
  - M36: the diff was line 874, `("available", Json::Bool(false)),` to `Json::Bool(true)`. `thread 'the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact' (20128) panicked at kernel\tests\publish.rs:957:5:` then `assertion failed: !m["query_surface"]["available"].as_bool().unwrap()`
- `git diff --numstat B...HEAD`:

```
1	0	kernel/tests/import_layout_factorial.rs
2	1	kernel/tests/indexed_budgets.rs
3	3	kernel/tests/publish.rs
1	1	kernel/tests/scale_pass.rs
1	1	kernel/tests/slice_budgets.rs
1	0	kernel/tests/support/mod.rs
2	0	kernel/tests/wire_bytes_invariant.rs
```

  The total is 17 against the declared 40. `--name-only` listed exactly the seven files.
- Governance checks, all rc 0:
  - node --test: 598 pass, 0 fail
  - verify-cites: PASS
  - verify-quotes: PASS (152 checked, 121 verified, 30 baselined, 1 advisory, 0 errors)
  - verify-test-claims: PASS
  - verify --offline: PASS
  - forms-layout: PASS

**Hold lines.** Every cargo call and verify-quotes ran under a shared hold, for example `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:21204 …` and the matching `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`. None was refused.

**Push.** `git push -u origin cut/clippy-deny-warnings-workspace-12c` exited 0. origin's branch and HEAD are both 1889a28a69698be2f87e519668d634c2e52cdd19, and the worktree porcelain is empty. No PR was opened and I did not wait for CI. The L35/L42 Linux build-step read is left to you.

**Notes.**
- The first (base) and a wait-loop shell went to background; both exited by themselves. No shell or process of mine is still running, and I killed none.
- The self-check on the four failure classes:
  - Interfaces: read from the real files. The seven files were checked against N1 by the base JSON run, and the mutation target against bundle/mod.rs.
  - Completion claims: each points to an output file in the scratch folder.
  - User-facing messages: none were added or changed.
  - Required tests: each reached its intended assertion. The panic lines above show the guards and the three rewritten asserts firing.
- Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No override and no context handoff.

---

*Custodian's correction (2026-11-09), appended after #303's gate 1 architect's D1 (`state/consults/gates/2026-11-09-clippy-deny-warnings-workspace-12c-gate1-architect.md`): the filing note at the top of this file is untrue in one clause, quoted from it: "the guard runs' and the mutations' exit codes are in its output files". The worker's six output files for those runs (`c12c-g34.txt`, `c12c-g40.txt`, `c12c-g41.txt`, `c12c-m36.txt`, `c12c-m37.txt`, `c12c-m38.txt`) print no exit code. In its place, quoted from the architect's D1: "the guard runs' and the mutations' output files hold each run's panic line, its message and cargo's `error: test failed` line; they print no exit code, which the report states." The exit codes are in the worker's transcript, whose tool results print `g34_rc=101`, `g40_rc=101`, `g41_rc=101`, `m36_rc=101`, `m37_rc=101` and `m38_rc=101`, read by the custodian's script. The rest of the note stands.*
