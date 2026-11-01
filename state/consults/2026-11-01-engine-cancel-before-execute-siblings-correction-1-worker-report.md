*Custodian's filing note (2026-11-01): #273's correction round 1 (`engine-cancel-before-execute-siblings`), one commit by a worker on `cut/engine-cancel-before-execute-siblings` from 5317510c, head 9e32be4c: gate 1's three Documentation fixes (the architect's D1 sentence, the owner index row of the reviewer's D1 and the architect's D2 with its Last verified note, the reviewer's D2 comment). The custodian's check by git: origin's branch is at 9e32be4c, one commit past 5317510c, engine/README.md +4/-3 and engine/src/dataset.rs +6/-5; against main the Scope's diff is now 228 lines (209 insertions, 19 deletions), the form's Amendment 4. By its transcript: one commit, one push to the branch, no reset, rebase, merge, amend, force, PR action or claude call; one shared hold, matching its two hold lines; its wait loops sleep 2 s with a bound; Bash 21, Read 2, Write 2; run 02:11:59Z to 02:32:54Z. One small file (its compare script, no backslash) was written by a quoted heredoc. Extracted by script from its SubagentHandback call, with one final newline added; the session's scratch folder, named 0 time(s) by its full path, is written `<scratch>/`; nothing else is changed. Its sha256 as handed back, from line 5 to the end, is 7a3f846984b5081a5400b69df783e2e12e3637eab8fc5e3417f3b75843da5293; as filed, 7a3f846984b5081a5400b69df783e2e12e3637eab8fc5e3417f3b75843da5293.*

---

Built: engine-cancel-before-execute-siblings correction round 1 at 9e32be4c6c0df025e9dfde81179e7e3e2580b112
Commit: `docs: engine-cancel-before-execute-siblings: correction round 1 (gate 1's README sentence, owner's-index row and a comment)`, one commit signed off by `-s`. The message file had `@` only in the first trailer line. Pushed to origin; `git ls-remote` and HEAD are both 9e32be4c, and `git status --porcelain` is empty. No PR action.

Fixes. Every replacement text was extracted by script (scratch `ecbs-c1-apply.mjs`) from the two filed reports.
1. engine/README.md, the sentence after the item 3 blockquote (old lines 61-63, each of the three lines matched exactly once).
   - Extracted text: the architect D1 quote with `> ` stripped, 4 lines, sha256 7a05fd4a5a31141def7a66c50e2fc780484e80bdf4563fb9a7a87b53cabdc4cb.
   - Before: the last two lines were `run their statement through the same guard; at the last three that routing is not observed by any test.`
   - After: `run their statement through the same guard; no test observes that routing at the row-group metadata` and `read or at either `layout.rs` statement.`
   - The blockquote (lines 52-56) has sha256 29b5010fa7d4921211080a7cf2f8d9fc087ccc923da81fd9171472320f6371a4 before and after.
2. engine/README.md, the owner's-index Cancellation row (old line 543, now 544).
   - Extracted text: the reviewer D1 code span with its outer backticks removed, sha256 5958fed422a3ce8cbbd3db27be414623d5bbc0a135372ae6840eb579aea398b8. It starts with two spaces and `- Cancellation`.
   - A script comparison showed it equals the architect D2 row, with the two-space indent the architect states: `equal: true`.
   - Before: 2 pointers (the idle-connection test and the producer's execute-window test).
   - After: 5 pointers, adding the three execute-window tests.
   - Line 536 now ends with `; the Cancellation row's three execute-window tests, at 2ccac3d1`.
   - `git grep -c "fn <name>" 2ccac3d1 -- engine` gave 1 for each of the three names: `a_cancellable_open_read_runs_inside_the_execute_window` and `a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled` in dataset.rs, and `a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled` in index.rs.
3. engine/src/dataset.rs, the comment paragraph at lines 2001-2007.
   - `before this line, so` became `before the guarded scan below, so`.
   - The comment was re-wrapped greedily to 100 columns, with no other word changed. It went from 7 lines to 8.
   - Before and after text are in the transcript (the script's output).

Checks:
- `cargo fmt --all -- --check`: rc 0.
- `cargo test -p spatial-engine --locked`, in a shared hold, `CARGO_BUILD_JOBS=8`, `RUST_TEST_THREADS=8`: rc 0. Over 51 result lines, 474 passed, 0 failed, 19 ignored. The unit-test result was `208 passed; 0 failed`.
  - T-A `dataset::tests::a_cancellable_open_read_runs_inside_the_execute_window`, ok.
  - T-B `dataset::tests::a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`, ok.
  - T-C `index::tests::a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled`, ok.
  - T5 `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled` in `cancel_execute_window.rs`, ok. `cancel::tests::an_interrupt_on_an_idle_connection_is_not_latched` also ok.
  - Slow tests I did not time-judge: `lod_tier_builder` took 637 s and `filter_type_admission` took 135 s. Both passed.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS (76 loose references advised, none mine).
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 701 claimed tests.

Numstat:
- My commit: engine/README.md 4/3 and engine/src/dataset.rs 6/5, so +10 −8, 18 lines.
- `origin/main...HEAD -- engine/src engine/README.md`: README 6/2, cancel.rs 50/4, dataset.rs 75/7, index.rs 61/1, layout.rs 14/4, rowgroup.rs 3/1. That is 209 + 19 = 228 changed lines.
- This used the local `origin/main` ref, with no fetch. Re-run it against current main if that ref is stale.

Hold lines (my project only):
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:73884`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:73884 affinity=FF (cores 0-7)`

Background shells: all four I started (one test run, three wait loops) had completed with exit 0 at the end. None is running and I killed none.
Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff.
Nothing off-scope was touched. No stop rule fired.
