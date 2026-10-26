*Custodian's filing note (2026-10-24): the worker-high's build of `publish-sort-window-cancel-not-exercised-on-ci` on `cut/publish-sort-window-cancel-not-exercised-on-ci`, from the form's commit dc040c26, final head 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d. The run 08:07:01Z to 09:04:33Z by its transcript (Read 5, Bash 45, Write 6, Edit 5; writes only to `kernel/tests/publish_cancellation.rs` in its worktree and to its own scratch files; no rebase, reset, merge, amend, force push or PR action). It handed back twice: first at 08:11:59Z, stopped at L0 (sha256 f29522b825c637e9f48c49fe73eb67d976a90ba54f8c7a616830431d2fd17c74), on the defect the form's Amendment 1 records; then, resumed with that amendment, the report below. Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 2ffcba2025cfeb212c2149c6b81031b9382281c789b39b2583c059167c144459.*

---

Built: publish-sort-window-cancel-not-exercised-on-ci at 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d

Origin's branch equals HEAD (14cdbcc0), and the worktree porcelain is empty. No process I started is still running (ps for cargo, rustc and the test binary showed none). No PR action was taken.

**First stop (earlier hand-back).** L0 on the first version failed. `BatchStream`'s Drop sets the token cancelled on every drop (`engine/src/stream.rs:897-907`), so the token conditions could never hold. You confirmed it, and Amendment 1 is at 4e9dd53d (read via `git show origin/main:...`; main was not merged into the branch). I made the correction as a second commit.

**Commits** (all signed off, with both trailer lines), oldest first:
- 7f7af5a5 `test(kernel): publish-sort-window-cancel-not-exercised-on-ci, the sort-window cancel test reports INCONCLUSIVE by name when QueryRunning never fires`
- e58f98e3 `test(kernel): publish-sort-window-cancel-not-exercised-on-ci, the token conditions struck (the form's Amendment 1)`
- 23c58cdc `test(kernel): publish-sort-window-cancel-not-exercised-on-ci, M1 recorded on the sort-window cancel test`
- e520e30d `test(kernel): C0 probe, the QueryRunning arm dropped (reverted by the next commit)`
- 14cdbcc0 `test(kernel): revert the C0 probe`

**The change, `kernel/tests/publish_cancellation.rs` only.**
- New import: `use std::io::Write;`.
- The comment at the old lines 242-247 is rewritten to name section A's two points.
- The assert on QueryRunning is replaced by `phases` and `saw_running`, then `if !saw_running { ... }`.
- Inside it, an `Ok` outcome with `rows == FEATURES as u64`, `partitions > 0` and no acknowledgement does a `let _ = writeln!(std::io::stderr().lock(), ...)` and `return`.
- Section A's line is written as one string with the file and test name as literals.
- Any other shape panics with the outcome, the acknowledged flag and the phases.
- There is no assertion on the token's flag.
- When QueryRunning fired, every existing assertion after the guard is untouched.
- No test was added, removed or renamed, and no product file changed. The only file in `git diff --name-only dc040c26...HEAD` is the test file.
- The step 2 and clippy runs below were on the code of 23c58cdc. After the C0 revert, `git diff 23c58cdc HEAD` is empty (0 bytes).

**Step 2.**
- Corrected file, 6 passed, 0 failed (cargo rc=0): `a_cancel_inside_the_sort_is_observed_rather_than_waited_out`, `a_cancel_mid_partition_write_ends_the_operation`, `a_cancelled_publish_releases_the_lease_and_detaches_the_interrupt`, `an_uncancelled_publish_is_unaffected_by_the_new_polling`, `every_partition_reports_its_final_byte_before_the_sync`, `writing_partitions_is_not_announced_before_a_partition_exists`.
- The sort-window test reached the window on this machine; there was no INCONCLUSIVE line in any full-file run (the run before the correction commit and the two after it).
- The same 6 passed again at the head for the check run: `finished in 13.59s`, rc=0.
- I ran step 2 before committing, on the same bytes (the build is cheap warm), because a compile error would have forced an extra commit.

**L0**, rerun on the corrected file, scratch only and reverted. The observer's `phase` body was emptied, so it neither records nor cancels. Default capture, shared hold, one test by name. The line as printed:
`INCONCLUSIVE (not a failure; the sort-window cancel was not exercised on this run): kernel/tests/publish_cancellation.rs a_cancel_inside_the_sort_is_observed_rather_than_waited_out: QueryRunning never fired, so the sort ended inside one poll interval and the publish completed uncancelled (60000 rows, 31 partitions). Phases seen: []`
- The next lines were `test a_cancel_inside_the_sort_is_observed_rather_than_waited_out ... ok` and `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 5 filtered out; finished in 9.06s`.
- `rustc -V`: `rustc 1.97.1 (8bab26f4f 2026-07-14)`.
- Porcelain after the revert was empty.

**M1.**
- Applied at e58f98e3: line 754 of `kernel/src/publish/mod.rs` `watch.check()?;` became `return Err(PublishError::Cancelled);`. The test was run alone, in a shared hold.
- The test failed, cargo rc=101, at `kernel\tests\publish_cancellation.rs:271:18`.
- The panic message as printed: `QueryRunning never fired and the publish did not complete with every row and no acknowledgement. Outcome: Err(Cancelled). Acknowledged: true. Phases seen: [VerifyingSource, Querying]`.
- Reverted, porcelain empty.
- 23c58cdc adds the `RECORDED MUTATION (observed at e58f98e3: ...)` doc lines above the test. They name the correction commit, as you directed, not the first commit.
- No `verify-mutation` tool was used.

**Predicted survivor (not a recorded mutation).** `next_into` replaced `next_into_timeout` at `kernel/src/publish/mod.rs:756-757`. It needed a small adapter from `Option<Result>` to `BatchPoll`: `Some(r)` became `Ready(r)` and `None` became `Ended`. The test passed (rc=0) and printed the INCONCLUSIVE line: `... the publish completed uncancelled (60000 rows, 31 partitions). Phases seen: [VerifyingSource, Querying, WritingPartitions, WritingStyle, WritingViewer, WritingManifest, Finalizing]`, then `... ok`. Section C's prediction holds. Reverted, porcelain empty.

**C0.**
- Run id 40079051071, workflow `product-ci-rust.yml`, on e520e30d. It ran to completion: `completed success`.
- Job 120828765042, `cargo test --workspace (windows-latest)`: success. Its "Run the ordinary suite" log has the INCONCLUSIVE line, byte-identical to L0's, ending `(60000 rows, 31 partitions). Phases seen: []`. Next to it is `test a_cancel_inside_the_sort_is_observed_rather_than_waited_out ... ok`.
- Job 120828765385, `L1 portable correctness · cargo test --workspace (ubuntu-24.04)`: success. The same INCONCLUSIVE line (60000 rows, 31 partitions, `Phases seen: []`) and the same `... ok` line.
- Both job logs print `rustc 1.99.1 (58cf8f9c3 2026-10-13)`, against local 1.97.1. The line reached the job logs on both runners, so the stderr-handle write is visible past libtest's capture on both. Section A's capture claim is now observed at both toolchains.
- I did not wait for the last run, as you said.

**Checks at the head.**
- §7 count: `git diff --numstat dc040c26...HEAD -- kernel/tests/publish_cancellation.rs` gives `42 14` = 56 lines of the 80. The RECORDED MUTATION lines are included, and the C0 pair nets to zero.
- `cargo fmt --all -- --check`: rc=0.
- `cargo clippy -p spatial-kernel --tests --locked`: rc=0. It printed 39 `^warning` lines (about 31 files), none in `publish_cancellation.rs` (grep count 0). The last lines were `warning: ... generated 1 warning (1 duplicate)` and `Finished dev profile`. The warnings come from other test targets. I added no `-D warnings`.
- Step 2 at the head: rc=0 (above).
- `verify-cites.mjs`: rc=0, last line `verify:cites PASS — every rooted (in-tree) path:line reference across 2310 file(s) resolves. (96 loose reference(s) advised above.)`
- `verify-quotes.mjs`: rc=0, `verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, ...`
- `verify-test-claims.mjs`: rc=0, `verify:test-claims PASS — all 640 claimed test(s) across 196 file(s) exist or are planned, superseded or withdrawn (...)`
- `verify.mjs`: rc=0, `verify:plan PASS — C:\dev\wt\sw\PLAN.yaml agrees with the repository.`

**Invalidators and disclosures.**
- The first-version defect above was the only stop. It was not one of the four named invalidators but a falsified premise in the form, handled by Amendment 1.
- Of the four named invalidators, none was met.
- The form's "guarantee" disclosure holds in practice. The survivor shows a regression that removes the window reads INCONCLUSIVE, not red.
- CI's toolchain is newer than the local one, as noted under C0.
- I wrote the line text exactly as section A gives it. "completed uncancelled" stays in it. After the correction it means no cancel was raised, not that the token flag is false.
- My hold calls used `&& { clippy ; }` and, for the verify scripts, ran outside a hold (node only). All cargo commands ran inside holds.

**Hold lines (my own project only).**
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` followed by `MACHINE_RELEASED project=SpatialIDE ... (cores 0-7)`.
- That pair appeared for each of the eight holds: step 2, step 2 again, L0, L0 again, M1, survivor, and clippy with the head's step 2 in one hold.
- No exit code in 96 to 99 occurred.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it.
