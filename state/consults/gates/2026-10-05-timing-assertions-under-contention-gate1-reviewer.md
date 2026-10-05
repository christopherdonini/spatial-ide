# PR #175 gate 1 — reviewer
Reviewed: cut/timing-assertions-under-contention @ ede20044ba29918fe1f2433fdfcee98e3abba4af

Tag: node:timing-assertions-under-contention@g1. Form: `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md` at main 4398a779 (Amendments 1 to 3). Diff range: `origin/main...origin/cut/timing-assertions-under-contention` (merge base acb3d035).

## Verdict

PASS. No S1. Three S2 and four N, below.

## S1

None.

## S2

- **S2-1. M-A1b, as worded, does not compile.** The form's wording is at `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:182 @ 4398a779`, and the same text is in the RECORDED MUTATION docs at `kernel/tests/end_to_end.rs:381 @ ede20044` and `kernel/tests/end_to_end.rs:441 @ ede20044`. It writes `Duration::from_secs(1)` unqualified. But `protocol/data-plane/src/adapter_ws.rs:40 @ ede20044` imports only `use std::time::Instant;`. So applying it literally fails to build, with rustc E0433 (`cannot find type Duration in this scope`, rc=101, command 3 below). I observed M-A1b with the path qualified as `std::time::Duration::from_secs(1)`, which means the same thing (commands 4 and 5). Worker report 1 records the M-A1b failures but does not say how it got the mutation to compile. Fix: qualify the path in the two doc comments, or have the closing amendment name the qualification (one sentence). The observation itself stands.
- **S2-2. The ruling rows came earlier than the form's Order line puts them.** Form line 7 orders the work: Phase R, then its consult, then the routing record, then the ruling rows. Amendment 1 (ruling rows for OPEN-2 to OPEN-4) is 09827e41, committed 2026-10-04T22:52:34Z. That is before the consult and Amendment 2, which are both acb3d035, committed 23:24:04Z. No §8 item is breached: the first code is 5bb2b104 at 23:42:00Z, after acb3d035. The rows were also ruled without sight of the outcome. But no amendment names the departure from line 7. The class is the architect's call.
- **S2-3. Amendment 3's first line does not say an outcome had been seen.** Form line 8 requires an amendment made after any outcome has been seen to say so in its first line. Amendment 3 (4398a779) was written after the Phase R consult was filed (acb3d035). Round 53's RULED block records that the question carried the consult's R-5 to R-7 counts. Yet its first line names only round 53's answer. Amendment 2 does carry the statement. The closing amendment can note this by reference.

## N

- **N-1.** The M-A1a code span is split across a `///` continuation (`kernel/tests/end_to_end.rs:439-440 @ ede20044`), so rustdoc renders `sleep( std::time::...` with a space inserted. Cosmetic.
- **N-2.** h2's existing 5 s message, `kernel/tests/end_to_end.rs:433 @ ede20044` ("the stream ended in ..."), names no instant pair. h2_a's new liveness message at `kernel/tests/end_to_end.rs:467 @ ede20044` does. §2 Part A2 and §5 declare that bound unchanged, so this is not a §8 item 5 finding. Align it in a later piece if wanted.
- **N-3.** When I ran the suites from the main checkout, it had uncommitted custodian edits: `DECISIONS-PENDING.md`, `PLAN.yaml`, `CUSTODIAN-QUEUE.json`/`.md`, `site/data/plan.json`, `site/index.html`, `state/drafts/weekly-window-2026-10-09.md`. I re-ran the four verify tools at the clean head worktree for a result independent of those edits. The verdicts are the same (commands 12 to 14).
- **N-4.** The owner's-index pointer count differs: the worker counted 70, and my script counts 69 (37 file paths and 32 `path::test` pointers). The difference is counting method: `skp/0.5` is a version string, not a path. Every pointer resolves.

## Review against the form

**Diff.** `kernel/tests/end_to_end.rs` (5bb2b104) +35/-13 and `kernel/README.md` (ede20044) +2/-2. There is nothing under kernel/src, engine/src, protocol or frontends. docs/07, docs/08, `kernel/tests/slice_budgets.rs` and `engine/tests/slice.rs` are untouched: `git diff --stat acb3d035 ede20044` over those paths printed 0 bytes.

**Part A1 (h2_a) against §2.** Every item matches:
- The 100 ms assertion is removed.
- Zero batches, TERM_CANCELLED and observed_at present are kept.
- The ordering assertion is at `kernel/tests/end_to_end.rs:473-476 @ ede20044`.
- The liveness check takes client pre-send to terminal, after drain, under 5 s, as a literal at its site. It is at `kernel/tests/end_to_end.rs:465-468 @ ede20044`, and its message says it is a liveness bound, not the docs/08 budget.
- The report line names its pair and says "not cancel_observed". The comment above it names ADR-018's pair and docs/08:8's clock.
- The comment is reworded, and its first sentence is kept.

RECV_DEADLINE (60 s) is above the 6 s mutation, so M-A1a reaches the liveness assertion rather than drain's panic.

**Part A2 (h2) against §2.** Every item matches:
- The 100 ms assertion is removed.
- The same ordering assertion is added at `kernel/tests/end_to_end.rs:417-420 @ ede20044`, with the same report line.
- The 5 s to_terminal bound and batches_after_cancel are kept.
- The name is unchanged, and a one-line comment at `kernel/tests/end_to_end.rs:385 @ ede20044` cites round 52, item 3.

**Ruling rows against the parts.**
- Round 52, item 2 (No) selects A1. Round 52, item 3 (typed) selects A2. Round 53 (typed) selects B-keep, and slice.rs is unchanged.
- The typed-ruling spans recompute: `state/directives/2026-10-04-round-52-open-3-ruling.md` lines 6-8 give sha256 cfd41252685ead46402f79e7078d3bdcc9cfb87c00dc96098be093f9cab7e08d, and `state/directives/2026-10-04-round-53-open-1-ruling.md` lines 6-7 give ebf502fb79d55138fb81ab3de5077abd527b4714ac67a452ba76eb0ff3df9bf7. Both match the RULED blocks.
- PLAN.yaml at 4398a779 carries `slice-budgets-cancel-cells-on-trace-pair` as proposed, depending on this node (round 52, item 4).

**Owner's index.** At 5bb2b104:
- All 37 backticked file paths exist, and all 32 `path::test` pointers resolve to a `fn` in the named file.
- The `spatial_*::` symbols and Ceilings constants resolve to definitions or re-exports. `StreamHandle` resolves to `protocol/skp/src/v0` and SKP-V0 §3.
- The cited ADRs exist, and the README's section "Declared composed ceilings (ADR-010 rule 6)" exists.
- ede20044 differs from 5bb2b104 only in those two README lines.

**Mutations, observed by name, in C:/dev/wt/tauc, each applied to `protocol/data-plane/src/adapter_ws.rs`'s `Some(Control::Cancel)` arm, run alone, then reverted.** These are real applications; no verify-mutation run is involved. The assertion lines below are at ede20044, whose test file is byte-identical to 5bb2b104's. Each run's working tree was ede20044 plus the one-line scratch mutation. The panic locations are written here with forward slashes; the run printed them with Windows separators.
- M-A1a, on `h2_a_cancel_before_the_first_batch_still_stops_the_query`: `tokio::time::sleep(std::time::Duration::from_secs(6)).await;` inserted before `state.observe_cancel(Instant::now());`. It failed (rc=101), panicking at `kernel/tests/end_to_end.rs:465:5`, the liveness assertion. The run output reads `client pre-send -> terminal took 6.0074836s: a liveness bound, not the docs/08 budget`, and the result line is `test result: FAILED. 0 passed; 1 failed`.
- M-A1b, literal: rc=101, a build failure (E0433). See S2-1.
- M-A1b, qualified, on `h2_a_cancel_before_the_first_batch_still_stops_the_query`: it failed (rc=101), panicking at `kernel/tests/end_to_end.rs:473:5`, the ordering assertion. The run output reads `observed_at precedes the cancel this test sent: the observation cannot come first`.
- M-A1b, qualified, on `h2_cancellation_is_observed_by_the_producer_inside_the_budget`, observed separately: it failed (rc=101), panicking at `kernel/tests/end_to_end.rs:417:5`, the ordering assertion, with the same text.
- After the reverts, `git status --porcelain` printed 0 lines, HEAD is ede20044, and the whole binary passed again (command 6).

**Phase R consult.** File `state/consults/2026-10-04-timing-assertions-under-contention-reproduction.md`, whole-file sha256 9a29dda13266c301b5e3f783d92418159be027f4140c1d67e76e6b50ab65ef71 (recomputed; it matches Amendment 2 and the brief).
- Tree check: `git diff --stat 61f7e64b 201f833e -- kernel/src kernel/tests engine protocol` printed 0 bytes.
- The consult's variant diff hashes recompute from its §3.1 and §3.2 blocks: e0e6f3f058a422ecab56fc4d4b09c651d5d1714cd1922fec1099f4b2873011fb and 2ed55e8ad1545827a014e61d92dd3fa8bc85413f970337edb1dc0d04bb505ad9. Both apply cleanly (`git apply --check`) to the 61f7e64b files, whose blobs are 45349e39 and 26357370, as the diff headers name.
- R-3/R-4 diff against §2 edits (i) to (v): (i) the registry read just before sent_at; (ii) the trace started before START; (iii) one VARIANT-OBS line with every listed field; (iv) the remaining asserts kept; (v) the guard dropped before close. All match.
- R-5/R-6 diff: requested to observed (named), the reported term computed as in the existing println, and batches_after_cancel. It matches.
- Row by row against §5: R-1 held. R-2 missed its count (0 of 20 failed). R-3 held. R-4 (L2): the structural clause held, and the H-W clause was untested (no run at or over 100 ms; the largest was 43.529 ms, with registry_empty true). R-5 held. R-6 held (budgeted pair largest 87.9 us; the reported term was at or over 100 ms in 11 of 20, which I recounted from the table). R-7: 5 of 5 passed.
- Tallies I recounted from the tables: R-3 PRODUCER_CANCELLED absent in runs 9 and 13 (18 of 20); R-4 registry_empty true in runs 4, 11-16 and 20 (8 of 20).
- Loader windows: R-2, R-6 and R-7 fall inside L1; R-4 inside L2. The first R-4 attempt is void as a row, and L2 was restarted in a new directory as §2 requires. R-1, R-3 and R-5 ran outside both loaders.
- Routing per §5: no STOP, W or C. Amendment 2's routing record matches the consult's §7, the R-2 and R-4 class-2 rows match its §6, and its R-5 to R-7 sentences match S5 to S7.

**§7.**
- `git diff --numstat origin/main...HEAD -- '*.rs' '*.ts' '*.tsx' '*.js' '*.mjs' '*.toml'` (rc=0) gives `35 13 kernel/tests/end_to_end.rs`, 48 lines.
- By hunk: A1 (h2_a) = 28 against a ceiling of 40, and A2 (h2) = 20 against 30. A2 hunks: +4, +1, -4/+1, -2/+8. A1 hunks: +5, -1/+2, +1, +4, -4/+1, -2/+8.
- Non-generated files of the piece: the form, PLAN.yaml, the consult (on main), kernel/README.md and end_to_end.rs. That is 5 of at most 5.
- No new constant: the added lines contain no `const`.
- The class-8 condition does not arise.

**§8, item by item.**
1. Clear: the form is 201f833e (22:03:27Z), and Phase R's first build started 22:04:47Z.
2. Clear: the first code (5bb2b104, 23:42:00Z) comes after the consult and routing record (acb3d035, 23:24:04Z). There was no STOP.
3. Clear: code follows the ruling rows (09827e41), and both parts are within their ceilings.
4. Clear: no diff under the protected paths.
5. Clear: both REPORT lines and the liveness message name their pair, and nothing is called cancel_observed.
6. Clear: only the 5 s liveness bounds are asserted, which §2 permits.
7. Not applicable: no W.
8. Clear: every row carries its diff and commit, and the loaded rows carry the loader's times. There are no failing runs, and the void row's logs are quoted in full.
9. Clear: the consult's §10 resolves S1 to S10 against the run logs.
10. Clear: the worker report says its observations are real applications and not verify-mutation runs. No scratch variant is recorded as a test of record.
11. Clear: no hash pin at 5bb2b104 or ede20044 in any record. Worker report 1 names its test-text lines under "the commit observed at was 5bb2b104".
12. Clear: no scope addition. The mutation doc comments are inside end_to_end.rs and within §7.

**Commit ids named in the record.** 61f7e64b, 201f833e, 4155fcf2, c9ec02e3, acb3d035, 09827e41 and 1c71ebaf resolve, and each is on main. 5bb2b104 and ede20044 resolve as branch commits, with no hash pinned at either. §0.5's custodian step resolves: `kernel/tests/end_to_end.rs` line 399 at 4155fcf2 is h2_a's 100 ms `assert!`, and `engine/tests/slice.rs` line 683 at c9ec02e3 is cancelling_mid_stream's `assert!`.

**Pins.** I recomputed all 44 of 44 `path:line @ 61f7e64b sha256:` pins in the form with `git show 61f7e64b:<path> | sed -n '<a>,<b>p' | sha256sum`: 44 match, 0 mismatch.

**Append-only.** `git diff 201f833e 4398a779` on the form shows 34 insertions and 0 deletions.

## Commands and exit codes

Cargo runs used `CARGO_TARGET_DIR=D:/wt-targets/tauc`, under `timeout`, in C:/dev/wt/tauc at ede20044.

1. `cargo test -p spatial-kernel --test end_to_end`: rc=0, 10 passed.
2. M-A1a applied: `cargo test -p spatial-kernel --test end_to_end h2_a_cancel_before_the_first_batch_still_stops_the_query -- --exact --nocapture`: rc=101 (failed as above).
3. M-A1b, literal: the same command: rc=101 (E0433, did not compile).
4. M-A1b, qualified: the same command: rc=101 (failed as above).
5. M-A1b, qualified: `cargo test -p spatial-kernel --test end_to_end h2_cancellation_is_observed_by_the_producer_inside_the_budget -- --exact --nocapture`: rc=101 (failed as above).
6. After revert: `cargo test -p spatial-kernel --test end_to_end -- --nocapture`: rc=0, 10 passed. The REPORT lines printed the pair names (single samples, not measurements).

From the main checkout at 4398a779 (see N-3):

7. `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 440 tests, 440 pass, 0 fail.
8. `node scripts/plan/verify.mjs` (verify-plan, tool commit 260720226f136d1ec7d72da64656f07d29400ed7): rc=0, PASS.
9. `node scripts/plan/verify-cites.mjs` (tool commit 522e448d55e089b974e115e23f0c72bfc6e1120a): rc=0, PASS, 1297 files, 34 loose references advised.
10. `node scripts/plan/verify-quotes.mjs` (tool commit f9444a4d99a9087394c55d4b1d4c414a8b11f980): rc=0, PASS, 119 checked, 88 verified, 30 baselined.
11. `node scripts/plan/verify-test-claims.mjs` (tool commit e9735d4749f094f03b69a8b570e8bf10f511c279): rc=0, PASS, 492 claimed tests.

The same four tools at the head worktree (C:/dev/wt/tauc, ede20044; same tool commits):

12. verify.mjs: rc=0, PASS.
13. verify-cites.mjs: rc=0, PASS, 1294 files.
14. verify-quotes.mjs and verify-test-claims.mjs: rc=0 and rc=0, PASS.

Git and CI:

15. `git diff --numstat origin/main...HEAD -- <§7 globs>`: rc=0.
16. `gh pr checks 175`: rc=0, 13 of 13 pass. The PR is open and not a draft, its head is ede20044, and its base is main.

End state of C:/dev/wt/tauc: `git status --porcelain` printed 0 lines, and HEAD is ede20044ba29918fe1f2433fdfcee98e3abba4af. Nothing was committed or published.
