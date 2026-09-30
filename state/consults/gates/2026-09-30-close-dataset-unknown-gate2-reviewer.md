*Custodian's filing note (2026-09-30): the reviewer's gate 2 on PR #150, scoped to correction round 1, for PLAN node `kernel-close-dataset-unknown-keeps-openrecord` at g1. Reviewed: cut/close-dataset-unknown @ 094a21daa81e87b10a16ac5081018277b4ac03f8 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 22:28:57Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 094a21d. Its N1 (the rewording landed as +2/−1, not one line) is recorded in the form's Amendment 3; its N2 (the PR's workspace test run at 094a21d) is read before the merge. Profile paths redacted at filing: none.*

---

Reviewed: cut/close-dataset-unknown @ 094a21daa81e87b10a16ac5081018277b4ac03f8

**Verdict: PASS.** There are no blockers. The CI runs at 094a21d were still in progress when I looked (N2).

**Checks**

1. **The round's diff (`git diff e1c37b0..094a21d`).** It touches only `kernel/src/skp.rs`, with 2 lines added and 1 removed.
   - All three lines are in close_dataset's comment above the `watches` removal. The old wording, every outcome with the refusal included, is replaced at `kernel/src/skp.rs:1448-1449` @ 094a21d by every outcome after the SKP version check, with the `unknown_dataset` refusal included.
   - There is no code change and no test-text change.
   - Comment widths across `:1444-1450`: 99, 97, 98, 95, 95, 45, 84. All are at or under 100.
   - The new wording is true of the code. `check_version(&req.skp)?` is at `:1442`, and the removal and its drop are at `:1451-1452`, both before `catalog.get` at `:1453`. This matches the architect's gate-1 B1.
   - The commit is signed off.
2. **Tests at 094a21d** (`CARGO_TARGET_DIR=D:/wt-targets/close-dataset-unknown`):
   - T1 `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch`: ok, rc=0.
   - T2 `a_close_drops_its_watch_before_it_returns`: ok, rc=0.
   - `cargo test -p spatial-kernel`: rc=0. 38 test-result lines, all ok, 312 passed, none failed.
   - `rustfmt --edition 2021 --check kernel/src/skp.rs`: 99 hunks at 094a21d. I also counted e1c37b0's file, taken with `git show`: 99. No new hunk.
3. **§7.** The merge-base is 1e68aba. The form's command at 094a21d gives `123 4 kernel/src/skp.rs`: 127 changed lines against a ceiling of 150, 1 file against a ceiling of 1. No overrun.
4. **Amendment 2 item 2.** `cargo fmt --check -p spatial-kernel` at 094a21d: rc=1 with 1046 `Diff in` hunks. That is the same count the amendment records for 1e68aba and e1c37b0.
   - The only hunk in the diff region (`skp.rs:1448`) reflows the removal line's method chain at `:1451`. That line was already there at base (gate-1 check 5), so the hunk is not new.
5. **`gh pr checks 150` at 094a21d** (text, rc=8, read at 2026-09-30T22:28Z). There are 7 rows:
   - Pass: sign-off, and one tauri NSIS build.
   - Pending: `cargo test --workspace (windows-latest)` for both the PR run 36785316370 and the push run 36785311928, both started about 22:23Z and in progress. Also pending: both typecheck·build·vitest·cargo runs and one tauri build.
   - Gate 1's N1 is now settled: PR run 36782574936 at e1c37b0 completed with success. The push run 36780037904 on that SHA also succeeded.

**Blocking:** none.

**Non-blocking**

- **N1.** The form's Amendment 1 item 2 (on main) says the change is one comment line. What landed is one line reworded and wrapped into two (+2/−1), which §7 counts. This does not block, because the declaration still names the right span, Scope and count. The record cap excludes a correction round for it; if the record is touched again, name the actual +2/−1.
- **N2.** Before merge, read the result of the PR-triggered `cargo test --workspace` at 094a21d (run 36785316370), and the push run 36785311928 with it. At review time, neither had a result on this SHA.

**Nits:** none.

The worktree `C:/dev/wt/close-dataset-unknown` is clean at 094a21d. Main `C:/dev/spatial-ide` is untouched at c5a36cc. My scratch files are only in the session scratchpad.
