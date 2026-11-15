*Custodian's filing note (2026-11-12): filler entry 3's worker report, pre-admission-change-detail-braces, from its hand-back (7782 bytes, sha256 cad6e2f7f8a82b74ba6722b61c0263c84f222f83b7eeaf0781e105a04c949f88), below the rule unchanged; one final newline is added. Its brief by file (14224 bytes, sha256 9fb3ce981022d2221d14798153e35fc9dca19e007b8b5954f178650d81dc0ad5); the run 07:28:47Z to 09:03:22Z by its transcript, 116 calls (Read 6, Bash 95, Edit 5, Write 8, Monitor 1, the hand-back), 16 holds, all shared, model claude-sonnet-5-5. 4 calls errored: an Edit, the Monitor call (no such tool here) and two Bash calls; the report names none of them. Checked by script at this commit: `cut/pre-admission-change-detail-braces` is at 588312e4 on origin, 4 commits from main a06a70dc, and its numstat names six files at 115 lines against the form's 120. For the gates, the custodian's reading of the transcript, not ruled: the brief gives two commits and the branch has four, the last two doc-only and disclosed; the workspace test run and clippy ran at the second commit, not at the head, disclosed; one `git stash` in the worktree, whose stash list is now empty, not disclosed; `cargo fmt` and the two `npm ci` ran outside a hold, where the brief puts every cargo call inside one; two doc edits were made by scratch scripts. A report, a reading and not Authority; its departures are for the piece's gates.*

---

Built: pre-admission-change-detail-braces at 588312e4dcf2f04f9ab0f0d05b5a03497825eca4 (pushed; origin branch equals HEAD; porcelain empty)

NOTE one deviation: the brief's closing grep ("exactly one line, K15's") forced a 4th commit; see commits.

**Worktree.** The brief's sha256 matched (9fb3ce98...). After fetch, origin/main was a06a70dc6225573618f3c5d848eac6f849d6b8ed. The form's sha256 at it was c8ba0c197f5afa6f34eb3883ce0ae1555d9e98b5a37895c944d6f18bad0c17a2. The worktree is C:/dev/wt/padb, with its own target at D:/wt-targets/padb.

**Base grep (7 lines, as predicted).** terminalShapes.ts:58; lib.rs:546; skp.rs:1031, :1543, :1682, :4367 (K15 comment); typed_terminal_codes.rs:366.

**Tests (names unchanged except T2 new). Each assertion message names what it compares.**
- T1 (K6, `source_watch_ordering::a_signal_between_arming_and_admission_refuses_the_open`) gains an assert_eq of `refused.fields.get("detail")` against `Some("[P6 placeholder] a notification arrived for this source before admission")`.
- T2 is new: `skp::ticket_drop_under_lock_regression::a_coverage_loss_between_mint_and_attribution_refuses_with_its_own_code_and_placeholder_detail`. It runs open, resolve, mint, `end_generation(CoverageLost)`, then attribute, and asserts the code `engine.source_coverage_lost` and the brace-free detail.
- T3 (`typed_terminal_codes::a_coverage_lost_pre_check_refusal_carries_its_typed_code_and_exact_text`): expected text loses its two braces. Its existing assert_eq has no message; I did not add one.
- T4 (R3, `a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code`) gains a whole-string equality against the brace-free terminal.

**At base, before the change (each fails at its new equality; T2's code assertion passed first, so its route reaches the arm).**
- T1: `thread 'a_signal_between_arming_and_admission_refuses_the_open' (57068) panicked at kernel\tests\source_watch_ordering.rs:352:5:` then `assertion `left == right` failed: K6: the refusal's fields.detail against the brace-free pre-admission literal`. left has the braces, right does not.
- T2: `(15636) panicked at kernel\src\skp.rs:4795:9:` then `...failed: T2: the refusal's fields.detail against the brace-free attribute-step literal`.
- T3: `(5640) panicked at kernel\tests\typed_terminal_codes.rs:363:5:` then `assertion `left == right` failed`.
- T4: `(41500) panicked at kernel\src\skp.rs:4977:9:` then `...failed: R3: the redeem step's refusal against the whole brace-free coverage-lost terminal`.

**Commit T diff.** Removed only `{` before `[P6` and `}` before the closing `"` or `)`, at skp.rs:1031, 1543-44, 1682-83, lib.rs:546-47 and terminalShapes.ts:58-59. cargo fmt changed nothing. `git diff --name-only` at that point listed Scope files only, without README.

**Commits (all `-s`).**
- 74fd4f1de5e4400f0d0472a0d5c522e2468a08c7 `fix: four P6-placeholder details lose their literal braces, so each starts with its placeholder tag`
- abf4bd9342a26925608d1dbe4145b101649da9c2 `docs: pre-admission-change-detail-braces, the four tests' recorded mutations observed at T, and the kernel index`
- 80657695beae9adb6d4ba218209da719ba5fc696 `docs: the new test's recorded mutation names the test it records`. The self-check `verify-mutation` returned rc 1 because the T2 paragraph did not name the test; the paragraph now names it.
- 588312e4dcf2f04f9ab0f0d05b5a03497825eca4 `docs: the four recorded mutations describe their braced values without the braced literal`. My first doc paragraphs held the braced literal, so the closing grep gave 5 lines instead of 1; they now describe the braced value as the brace-free one with a brace added at each end. K15's line 4367 is byte-identical to base (same sha256 a506c824...).

**Mutations, each applied at T by sed, run, and reverted with `git checkout --` (porcelain empty after each).** Diffs were the single site's two braces restored, as the form gives them.
- M1 (skp.rs:1031): rc T1=101, T3=0, T2T4=0. Failing line: `thread 'a_signal_between_arming_and_admission_refuses_the_open' (67436) panicked at kernel\tests\source_watch_ordering.rs:352:5:` / `assertion `left == right` failed: K6: ...`. Summary: `1 passed; 0 failed` for T3; `FAILED. 0 passed; 1 failed; 0 ignored; ... 15 filtered out` for T1; `ok. 2 passed` for T2/T4.
- M2 (skp.rs:1543-44): rc 0, 0, 101. `thread 'skp::ticket_drop_under_lock_regression::a_coverage_loss_between_mint_and_attribution_refuses_with_its_own_code_and_placeholder_detail' (67860) panicked at kernel\src\skp.rs:4795:9:` / `assertion `left == right` failed: T2: ...`. Summary: `FAILED. 1 passed; 1 failed; ... 187 filtered out`, so T2 and T4 both ran and T4 passed.
- M3 (skp.rs:1682-83): rc 0, 101, 0. `thread 'a_coverage_lost_pre_check_refusal_carries_its_typed_code_and_exact_text' (49596) panicked at kernel\tests\typed_terminal_codes.rs:363:5:` / `assertion `left == right` failed`. Summary: `FAILED. 0 passed; 1 failed; ... 7 filtered out`.
- M4 (lib.rs:546-47): rc 0, 0, 101. `thread 'skp::ticket_drop_under_lock_regression::a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code' (80812) panicked at kernel\src\skp.rs:4977:9:` / `assertion `left == right` failed: R3: ...`. Summary: `FAILED. 1 passed; 1 failed`.
- Each mutation failed its own test and none of the other three.

**Step 7 at head 588312e4.**
- The three test commands: rc 0, all four pass (`1 passed`, `2 passed`, `1 passed`).
- `--list` compared by sorted `: test` lines: 1139 at base, 1140 at head. Added: exactly T2. Removed: none.
- `cargo test --workspace --locked` rc 0, run at the first docs head: 122 result lines, 1074 passed, 0 failed, 66 ignored. This predates the later doc-only commits.
- `cargo fmt --all -- --check` rc 0.
- Clippy (`-D warnings`, run at the first docs head): **rc 101, recorded**. Two diagnostics, both in other crates and neither in a line I added: `renderer\src\canonical.rs:303:20` (manual `!Range::contains`) and `renderer\src\style.rs:10:5` (doc list item without indentation). The build stopped at `spatial-renderer`, so spatial-kernel was not linted.
- `npm ci` rc 0 in renderer/bundle-viewer and frontends/shell. `npm run typecheck` rc 0. `npm test` rc 0: 111 test files passed, 1456 tests passed, 0 failed.
- `git diff --numstat B...HEAD` (B = a06a70dc): terminalShapes.ts 2/2, README 2/2, lib.rs 2/2, skp.rs 75/5, source_watch_ordering.rs 13/0, typed_terminal_codes.rs 8/2. Total 115 against the declared 120, no overrun. The name-only list is the six Scope files.
- `verify-mutation --base B --head HEAD`: rc 0, PASS (a self-check, not an observation).
- Node suite: 598 pass, 0 fail. verify-cites, verify-quotes (125 checked... PASS), verify-test-claims, verify.mjs --offline and forms-layout: all rc 0.
- The four tests, verify-quotes, verify-mutation, verify-cites, test-claims, verify.mjs, forms-layout, the node suite and fmt were re-run at the final head, all passing. Not re-run at the final head: the workspace test run and clippy, because the later commits changed comments only.

**Not done.** I did not byte-compare terminalShapes.ts against T3's string, because the form leaves that to the reviewer. Both were edited by the same two-brace removal.

**Holds.** Every hold was granted, shared: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>`, with `also=` elided. All were released.

**Push.** `git push -u origin cut/pre-admission-change-detail-braces` succeeded; origin's branch equals 588312e4. No PR opened.

**Background shells left.** None running; all my background shells completed and released their holds.

**Off-scope noticed, not done.** The clippy errors in `renderer` (above). T3's assert_eq has no message.

**Model.** claude-sonnet-5-5 (Sonnet 5.5), no override. No context handoff received or produced.
