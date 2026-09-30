*Custodian's filing note (2026-09-30): the reviewer's gate 1 on PR #150, for PLAN node `kernel-close-dataset-unknown-keeps-openrecord` at g1, full gating. Reviewed: cut/close-dataset-unknown @ e1c37b0b4ffede2378982e233e6d65ec28361006 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 2026-09-30T22:12:43Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at e1c37b0. Its P0 run at 4f045da is the reproduction of record, its mutation table at e1c37b0 is the observation of record for §4's two mutations, and its check 2 at e1c37b0 is the H1 grep of record (its N2). Profile paths redacted at filing: none.*

---

Reviewed: cut/close-dataset-unknown @ e1c37b0b4ffede2378982e233e6d65ec28361006

**Verdict: PASS.** I found no blocking issues. P0 and both mutations reproduced as the form predicts, the suites are green, and §7 is within budget. One PR-triggered CI job was still pending when I looked (N1).

**Checks**

1. **Diff (`git diff 1e68aba...e1c37b0`).** It touches only `kernel/src/skp.rs`, 122 lines added and 4 removed.
   - Product hunk at `kernel/src/skp.rs:1444-1454` @ e1c37b0: the record removal (`:1450`) and its drop (`:1451`) now come before the `catalog.get` check (`:1452-1454`).
   - The `watches` guard is a temporary inside the `let` initializer. `.remove(name)` returns an owned `Option<OpenRecord>`, so the guard is not lifetime-extended and is released at the end of the statement. `drop(removed_watch)` therefore runs with no host lock held.
   - The sink (`:1056-1094`) takes only the latch and then `invalidator.end_generation`, and never touches `watches`. The only `watches` users are `:1170`, `:1182`, `:1201` and `:1450`. The Drop's thread join cannot deadlock.
   - The success path's order is unchanged: `begin_close` (`:1463`), `cancel_all_for_dataset` (`:1465`), `forget_dataset` (`:1470`), `catalog.remove` (`:1472`). It still linearizes at `begin_close`, and the watch still drops before `begin_close`, as at base.
   - `viewport_query` never reads `watches`, so it sees nothing new.
   - `describe`: a racing call can see the catalog entry present with no record. Base had that same window, between the removal and `catalog.remove`. The window's start moves earlier by one catalog read, and there is no new state.
   - A racing open cannot collide: the handle is minted by the host and returned only after the record insert (the intake's out-of-scope row).
   - A name never opened, and a second close, both give `remove` → `None`, then `catalog.get` → `None`, then `skp.unknown_dataset`. T1 asserts the second close.
   - Shell seam: `frontends/shell/src-tauri/src/commands.rs:111-124` forwards the result unchanged.
2. **H1.** I re-ran the grep at e1c37b0. The only `Catalog` removers are `kernel/src/skp.rs:1136` (a refused open, before any record insert), `:1472` (after the record removal) and `kernel/src/lib.rs:203` (the body of `Catalog::remove`). The shell's calls at `commands.rs:268`, `:501` and `pool_poll.rs:179` are all `.get`. `:3888` is test-only. I1 did not fire.
3. **P0 at B (4f045da)**, run in a scratch worktree, rc=101. T1 failed at `kernel\src\skp.rs:3893:9` with the message `the close removed the record`, which is the record-absent assertion. T2 passed. I removed the scratch worktree and ran `git worktree prune`; the list is clean.
4. **Mutations**: see the table below. Porcelain was empty after each revert.
5. **Suites at e1c37b0**, exit codes read directly:
   - `cargo test -p spatial-kernel`: rc=0, 312 passed (lib 135).
   - Every §5 declared-unchanged test passed by name:
     - CR1 `the_close_race_mints_no_generation_so_no_unheld_reference_exists`
     - CR2 `a_viewport_query_inside_close_is_refused_before_it_builds_or_mints`
     - CR3 `a_ticket_minted_before_close_and_attributed_after_it_refuses_as_unknown_dataset`
     - CR4 `an_end_reaching_invalidate_after_close_leaves_no_mark_and_emits_nothing`
     - R2 `a_closing_dataset_refuses_new_attributions_but_still_records_an_end` and `a_close_between_liveness_and_redeem_keeps_redeems_wording`
     - E7, E8 and K15 (`a_coverage_loss_racing_admission_refuses_with_its_own_code_and_leaves_no_mark`)
     - `close_dataset_cancels_every_ticket_for_that_dataset_only`
     - K5 `a_signal_free_rearm_does_not_restore_an_ended_generation`
     - K13 `describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`
     - `session_end_event.rs` 7/7, E9 `a_repeat_a_nested_and_a_post_close_end_emit_nothing` included
     - `source_watch_windows.rs` 3/3
   - `SkpError::unknown_dataset`: no diff under `protocol/`.
   - `cargo clippy -p spatial-kernel --tests`: rc=0. The only `skp.rs` warning is at `:244`, outside the diff.
   - `rustfmt --edition 2021 --check`: 99 hunks at 1e68aba and 99 at e1c37b0 (no `rustfmt.toml`). The one hunk near the diff is the removal line's method chain, which already exists at base (`:1451`).
   - From `C:/dev/spatial-ide` @ 9cf31c8 (`scripts/plan` last changed at d047dda):
     - `node --test`: rc=0, 353 passed.
     - verify-cites: rc=0.
     - verify-quotes: rc=0.
     - verify-test-claims: rc=0.
     - verify.mjs: rc=0.
   - The same five, re-run in the worktree @ e1c37b0: all rc=0.
   - `verify-mutation --base 1e68aba --head e1c37b0` (tool @ 7d24ed1): rc=0. This is a heuristic, not an observation.
6. **§7.** The form's command gives `122 4 kernel/src/skp.rs`: 126 changed lines against a ceiling of 150, 1 file against a ceiling of 1. No overrun. **§8 items:**
   - Item 5: every new item (`FlagWatch`, `FlagArm`, `watching_host`, `close_req`, `holds_a_record`) is inside `#[cfg(test)] mod ticket_drop_under_lock_regression` (`:2681`). There is no product item, no hook and no `cfg(test)` branch in product code.
   - Item 6: in T1/T2 (`:3877-3935`), a scan for sleep, `recv_timeout`, thread, timeout, Duration, spawn, ignore and cfg matches nothing. The pattern was self-tested: it matches the word "sleep" in the added comment.
   - Item 7: no `cfg(` or ignore anywhere in the added lines.
   - Item 14: `close-unknown-keeps-record` (`:3880`) and `close-drops-its-watch` (`:3918`) each appear exactly once across all `*.rs`.
   - Seams: no new seam. The watch is dropped through the existing `ArmedWatch`.
7. **`gh pr checks 150`** (rc=8, one job pending):
   - PR run 36782575304: tauri build pass, typecheck/vitest/cargo pass.
   - PR run 36782574938: sign-off pass.
   - PR run 36782574936: `cargo test --workspace (windows-latest)` **pending**.
   - Push run 36780037904 on the same head e1c37b0: `cargo test --workspace` pass (21m58s).

**Mutation table** (my observations at e1c37b0, rc=101 each, reverted, porcelain empty)

| # | Mutation | Test | Result | Failing assertion |
|---|---|---|---|---|
| P0 | none; B = 4f045da | T1 | FAILED | `kernel\src\skp.rs:3893:9`, `the close removed the record` |
| P0 | none; B = 4f045da | T2 | passed | — |
| M1 | catalog check moved back above the `watches` removal | T1 | FAILED | `:3897:9` (e1c37b0 numbering), `the close removed the record` |
| M1 | same | T2 | passed | — |
| M2 | `:1450-1451` deleted | T2 | FAILED | `:3924:9` (e1c37b0 numbering minus 2), `the close removed the record` |
| M2 | same | T1 | also FAILED | `:3895:9`, same message; not required by §4 |

Both mutations match what the test docs recorded at f4fb9ed (`kernel/src/skp.rs:3873-3877` and `:3911-3915` @ e1c37b0). Each doc names its commit and calls nothing a `verify-mutation` observation.

**Blocking:** none.

**Non-blocking**

- **N1.** PR-triggered `cargo test --workspace` (run 36782574936) was pending when I reviewed. The push run on the identical SHA passed. Read that PR run's result before merge.
- **N2.** The worker report's H1 list (`state/consults/2026-09-30-close-dataset-unknown-worker-report-1.md`) gives `kernel/src/skp.rs:1451` and `:1470`. Those are the line numbers at 1e68aba and 4f045da; at e1c37b0 they are `:1450` and `:1472`. The report does not say which commit the grep ran at, and the filing note's claim that its pointers are at the branch commits it names does not cover this list. It is evidence, not Authority. Check 2 above, re-run at e1c37b0, is the H1 of record.
- **N3.** No test covers a close on a name never opened. That behaviour is unchanged by construction (check 1), and the form does not claim it.

**Nits:** none.

Worktree `C:/dev/wt/close-dataset-unknown` is clean at e1c37b0. Main `C:/dev/spatial-ide` is unchanged at 9cf31c8. The scratch worktree `D:/wt-targets/close-dataset-unknown/scratch-b` has been removed and pruned.
