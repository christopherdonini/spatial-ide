*Custodian's filing note (2026-10-01): the reviewer's gate 2 on PR #151, scoped to correction round 1, for PLAN node `catalog-open-replace-drop-latency-note` at g1 (note only). Reviewed: cut/catalog-replace-note @ 4941e47c64a7d23ef0aac7af3b3f4468bfcbf32f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 06:25:15Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 4941e47. Its N1 is the architect's gate-2 N6, closed by the superseded index. The pending checks it lists are read before the merge. Profile paths redacted at filing: none.*

---

Reviewed: cut/catalog-replace-note @ 4941e47c64a7d23ef0aac7af3b3f4468bfcbf32f

**Verdict: PASS.** B1 and B2 are fixed and nothing blocks. CI is still pending at 4941e47 (check 4).

**Checks**

1. **Diff `53e1cf4..4941e47`.**
   - One hunk in `kernel/src/lib.rs`: 9 lines added, 6 removed, 15 changed in all.
   - Non-`///` lines among the changes: 0.
   - Longest added line: 98 columns. None is over 100.
   - Numbers: the only digits in the new text are the existing `ADR-018 item 4` reference. There is no duration word. "later" says when something happens relative to the guard, not how long anything takes.
   - **B1 is fixed.** `kernel/src/lib.rs:162` @ 4941e47 now limits the claim to an `open` that returns `Ok`. The `?` at `:180` and `:204` returns before `lock_write()` at `:181` and `:205`. The note says nothing about the Err path.
   - **B2 is fixed, and the new text is true of the code.**
     - `Dataset` holds `pool: Arc<ConnectionPool>` (`engine/src/dataset.rs:164`).
     - `Lease` holds its own `pool: Arc<ConnectionPool>` (`engine/src/pool.rs:499-501`). Its Drop (`:572`) and `release_healthy` (`:543`) run wherever the lease is dropped, which is the producer thread.
     - So: if the catalog's `Arc` is the last reference and a lease is in flight, the `Dataset` drops under the guard and the pool lives on in the lease. If a `get` holder has the last reference, the dataset (and the pool, when no lease is in flight) drops on that holder's thread.
     - The two `Otherwise` cases cover every situation except the guarded-close case the note already states.

2. **Tests and rustfmt.** I ran cargo with `CARGO_TARGET_DIR=D:/wt-targets/catalog-replace-note`.
   - `cargo test -p spatial-kernel --test catalog_replace`: rc 0, 2 passed.
   - `cargo test -p spatial-kernel`: rc 0. All 39 `test result` lines are ok (lib 135 passed); none failed.
   - rustfmt over stdin finds 16 `Diff in` hunks in `lib.rs` at both 53e1cf4 and 4941e47. They are the same hunks, moved down 3 lines after `:173`, and none falls in `:162-173`. The pattern self-tests positive (1).

3. **§7 budget.** The merge base with origin/main is d8544a0. The form's command at 4941e47 gives `21 3 kernel/src/lib.rs` and `109 0 kernel/tests/catalog_replace.rs`, so 133 changed lines over 2 files. This matches the form's §10 Amendment 2 on main @ 9644933. §7's ≤ 120 line is unedited: `git diff d8544a0 9644933` on the form has no `-` lines.

4. **`gh pr checks 151`.** The PR head is 4941e47.

   | Check | Event | Status | Run id |
   |---|---|---|---|
   | every commit is signed off | pull_request | pass, 7s | 36824194738 |
   | cargo test --workspace (windows-latest) | push | pending | 36824191152 |
   | cargo test --workspace (windows-latest) | pull_request | pending | 36824194834 |
   | typecheck · build · vitest · cargo test | push | pending | 36824191557 |
   | typecheck · build · vitest · cargo test | pull_request | pending | 36824195050 |
   | tauri build (NSIS) | push | pending | 36824191557 |
   | tauri build (NSIS) | pull_request | pending | 36824195050 |

**Blocking**

None.

**Non-blocking**

- **N1.** The form's §10 heading says each correction round ends with a superseded index. Amendment 2 sets a new final figure (133) that replaces the final figure in Amendment 1 (130), but correction round 1 has no index yet. It is owed when the round closes, after this gate. If Amendment 2 is read as the round's close, the index is missing by name (round 12, item e).
- **N2.** Amendment 2's parenthetical "(130 at 53e1cf4)" repeats Amendment 1's figure when a reference to Amendment 1 alone would do (round 12, item d, and the record cap).
- **N3.** The worker's report 2 says the B1/B2 engine facts were not re-read. Check 1 above covers that gap.

The worktree is clean (porcelain 0). Main is untouched at 9644933.

Files:
- C:/dev/wt/catalog-replace-note/kernel/src/lib.rs
- C:/dev/wt/catalog-replace-note/engine/src/pool.rs
- C:/dev/spatial-ide/kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md
