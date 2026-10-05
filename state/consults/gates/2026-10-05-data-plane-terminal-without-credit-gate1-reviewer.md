# PR #176 gate 1 — reviewer
Reviewed: cut/data-plane-terminal-without-credit @ 3f7b19492cf9df9fa076d84207031c337ac0464a

**Verdict: FAIL** (two S1). Form: `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` on main (231a1aab; Amendments 1 to 3, the last at 8f4874c1). Diff range: `git diff origin/main...origin/cut/data-plane-terminal-without-credit`, merge base e4b49efa. Line numbers below are at 3f7b1949 unless a commit is named.

## S1 (blocking)

**S1-1. A stated invariant that is false: §8 item 15 (a claim beyond §1 and beyond Amendment 2 row D's scope).** The README and the instrument accessor's doc state, for every stream, that sent plus discarded equals generated:
- `protocol/data-plane/README.md:174` (byte-copied): "generation, so once a stream has ended, batches sent plus batches discarded equal batches generated."
- `protocol/data-plane/src/transport.rs:253-254` (the accessor doc of `batches_discarded()`) states the same for "once a stream has ended".

Row D scopes the identity to "the 2d paths" (the discard drain). It does not hold on any halt-ended stream (data-plane CANCEL, peer close, receive error), and it does not hold on §2d's own deferral arm (`adapter_ws.rs:241-250`). That arm drops the held batch and the queued ones without `note_discarded`.
- Observed, a probe (not a mutation). T4 (`a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first`) was given an `eprintln!` and an `assert_eq!(sent + batches_discarded, batches_generated)`, run alone at 3f7b1949, then reverted. Result: rc 101 at candidate_a.rs:961:5, "PROBE: README invariant", left 0, right 5. The printed state was `generated=5 discarded=0 sent=0 resident=20540`.
- Remedy, either one:
  - narrow both sentences to the discard drain (the owner's cancel with no prior data-plane cancel, or a source failure), which is row D's own scope;
  - or count the halt-path drops, which would be a scope addition (class 9) before code.
- The closing record must also name its reading of I-7 ("on a 2d path"). The deferral arm sits in §2d's text, and on it generated ≠ sent + discarded. My reading is that I-7 means the discard drain: P-9 names T1, T1b, T3b and T5, not T4. So I-7 has not fired. If the custodian reads the deferral as a 2d path, I-7 has fired and the piece stops and goes back to the human. Worker report 1's "I-1 to I-7: none triggered" did not check T4's path.

**S1-2. A code path with no product caller (the caller rule, rule 8 of the reviewer checklist, by name).** `protocol/data-plane/src/adapter_ws.rs:385`, byte-copied: `None if discarded == 0 => return Terminal::Completed,`. This arm cannot be reached at the head.
- `discard_queued` has two call sites (`adapter_ws.rs:239` and `:251`). Both are in the credit wait, and both pass the batch the writer holds.
- The function counts that batch first (`:371`) and starts `discarded` at 1 (`:372`). `discarded` only increments (`:382`), so the guard is never true.
- No test reaches the arm either.
- Worker report 1's deviation 5 is therefore true.
- It matters for two reasons. The rule blocks a code path without a caller. And §2d's "Completed when nothing was discarded" is already met structurally: a stream with nothing to discard never enters the drain, and its None goes through the receive wait at `:203-205` to `Completed`.
- Remedy: delete the arm and the `discarded` counter (`:372`, `:382`, `:385`). Update the fn doc at `:362-364` to match. M5 and T5 are unaffected, because they target the remaining `None` arm.

## S2

**S2-1. lead-data's finding is correct. The form's Part 4 and D-4 name an owner's-index update in `protocol/data-plane/README.md`, and that file has no Owner's index section.**
- Its headings at 3f7b1949 are lines 1, 6, 35, 46, 56, 66, 92, 112, 136, 160, 184 and 191, and none is an index.
- Owner's indexes exist only in `engine/README.md` and `kernel/README.md`, lead-data's modules (`.claude/agents/lead-data.md:9`).
- The kernel half landed byte-identical to the consult: all three replacement lines diffed against the consult's fenced blocks, IDENTICAL. Every new pointer resolves at the head: `kernel/src/lib.rs` lines 705, 711, 755 and 763; `kernel/tests/skp_cancel_terminal_without_credit.rs` lines 263 and 270; `protocol/data-plane/src/lib.rs:47` `pub mod transport`.
- The closing amendment must record the data-plane half as void (no index exists), so that D-4 and §8 item 18 resolve. Creating a new index section would be a scope addition (class 9).

**S2-2. One form pin does not resolve at its named rev.**
- Form line 6 (on main) pins the impact read `@ c823bce5 sha256:dcb21e03…`. The command `git show c823bce5:state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md` gives "exists on disk, but not in 'c823bce5'". The file was added at 92a71c30. Its whole-file sha256 there, and at main, is dcb21e03e8bdc5bad32435a06aed164eb275bce56c62755a54cee030451a1941.
- c823bce5 is the impact read's own "Read at" commit, not a rev that holds the file.
- verify-quotes (f9444a4d) does not check whole-file pins with no line span, so its PASS does not cover this one.
- It is a record defect on main, not in the diff. It is a class-3 correction for the closing record.

**S2-3. T4's discrimination depends on the runtime having at least 2 workers.**
- `candidate_a.rs:944` is `#[tokio::test(flavor = "multi_thread")]` with no `worker_threads`, so the worker count is the machine's core count.
- With one worker, the reader blocks the only worker inside `Flag::cancel` for 2 s. The writer cannot run its owner arm before the halt signal, so T4 would pass under M4.
- T4 is the only proof of §8 item 9. Pin `worker_threads = 2`. This is a test-site value and adds no product constant.

## N

- N-1. §2d says "In every wait" the writer races both notices. The pump-item receive wait (`adapter_ws.rs:200-207`) and the drain do not race them. There is no consequence:
  - the receive wait needs no credit;
  - the next credit wait reads each notice's current value through `raised` (`wait_for` checks the value first);
  - the drain ends on a Failed item or on close.
  §8 item 8 holds. The record could say so.
- N-2. A batch held at the credit wait is dropped uncounted on the halt arm (`:237`), the deferral arm (`:248-249`) and the semaphore-closed arm (`:256`). In each case `resident_bytes` keeps it: the probe read 20540 after TERM_CANCELLED. Queued items at halt were already uncounted on main. The held batch is the new fifth, and stays inside the declared MAX_INFLIGHT_BATCHES + 1 bound (I-1).
- N-3. The new kernel index bullet sits under "Interfaces this module owns", yet it names `spatial_data_plane::transport::SourceCancel`, which the data plane owns. The kernel owns `EngineCancel`, the implementation. This is wording only.
- N-4. P-1's batch-count halves ("after 12 batches", "with 0 batches") were not observed at M0 (deviation 6). The closing record should state that P-1 was observed at the deadline only.
- N-5. Deviation 8's "never pass it" is imprecise. A premature plateau read of 4, when the true plateau is 5, passes the range assertion. This is harmless: the terminal assertions still need the owner path.

## TAG_BATCH sends against credit acquires

There is one TAG_BATCH send: `adapter_ws.rs:275`, `sink.send(Message::Binary(payload))`. The only path to it runs through `let permit = tokio::select!` at `:235-261`, whose only value-yielding arm is `credit.acquire()` Ok (`:253-254`). It is forgotten at `:262`. Every other arm `break`s. Pass (§8 item 4; the I-2 test `a_grant_of_n_moves_exactly_n_batches` passes).

## Discards against `note_discarded`

- The held batch on drain entry: `:371`. Counted.
- Each queued batch in the drain: `:380-382`. Counted.
- The deferral arm, the halt arm and the semaphore-closed arm: not counted (S1-1, N-2).
- §8 item 22 holds for the discard drain. The doc carries the round 5, item 4 declaration, names T1, T1b, T3b and T5 by full name, and says why: `transport.rs:247-254`.

## EngineCancel, read whole (`kernel/src/lib.rs:699-751`), §8 items 7 and 20

- One `std::sync::Mutex<CancelNotice>` holds `cancelled` and `notify` together.
- `cancel()` cancels the token. Then, under the guard, it sets the mark and takes the slot (`:728-732`), and it runs notify after the guard's block ends (`:733-735`).
- `on_cancel` reads the mark under the same mutex (`:740-746`) and runs notify only after the guard's block (`:748-750`).
- The token's flag is not read.
- Poisoning is handled with `unwrap_or_else(|e| e.into_inner())`; there is no `unwrap`.
- The notify registered by `drive` (`adapter_ws.rs:91-94`) is a `watch::Sender::send_replace(true)` plus the sender's drop. Neither blocks or re-enters the kernel.
- The default `on_cancel` drops notify unrun (`transport.rs:142-144`).
- Pass.

## Mutations observed at 3f7b1949 (each applied alone, its test run alone with `-- --exact`, the failure recorded, reverted; porcelain empty after each)

| # | Mutation as applied | Test | rc | Failure (site, message) |
|---|---|---|---|---|
| M1 | deleted the owner-cancel arm, `adapter_ws.rs:241-252` | an_skp_cancel_reaches_the_client_as_a_terminal_with_no_credit_granted | 101 | skp_cancel_terminal_without_credit.rs:88:23, "timed out after 60s waiting for the terminal after the owner's act" |
| M1 | same | a_close_dataset_reaches_the_client_as_a_terminal_with_no_credit_granted | 101 | the same site and message |
| M2 | a credit acquire+forget inserted above the pump receive (before `:200`), with one permit re-added so the later acquire consumes it at once (one credit per batch, credit first) | credit_equal_to_the_batch_count_delivers_every_batch_then_the_terminal | 101 | candidate_a.rs:258:19, "timed out after 30s waiting for a frame, or the connection to end" |
| M2 | same | a_producer_failure_with_no_batch_ahead_is_a_terminal_with_no_credit_granted | 101 | the same site and message |
| M3 | deleted the pump-failure arm, `:238-240` | a_producer_failure_behind_queued_batches_is_a_terminal_with_no_credit_granted | 101 | candidate_a.rs:258:19, the same 30 s message |
| M4 | deleted the `is_cancelled` deferral block, `:242-250` | a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first | 101 | candidate_a.rs:959:5, "assertion `left == right` failed: detail was: [P6 placeholder] the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered", left 2, right 1 |
| M5 | the placeholder `None` arm (`:386-388`) replaced by `None => return Terminal::Completed,` | an_owner_cancel_on_a_source_that_then_ends_without_failure_is_a_producer_failed_terminal_with_no_credit_granted | 101 | candidate_a.rs:982:5, "assertion `left == right` failed: detail was: ", left 0, right 2 |
| M6 | `on_cancel` always stores, `kernel/src/lib.rs:741-746` | cancel_notice_tests::engine_cancel_runs_the_registered_notice_once_in_either_order | 101 | kernel\src\lib.rs:780:9, "assertion `left == right` failed: run at registration", left 0, right 1 |
| M7 | deleted the `batches_discarded` increment, `transport.rs:232` | a_producer_failure_behind_queued_batches_is_a_terminal_with_no_credit_granted | 101 | candidate_a.rs:913:5, "assertion `left == right` failed: the three queued batches were discarded", left 0, right 3 |
| M8 | `[P6 placeholder] ` removed from the literal at `:387` | an_owner_cancel_on_a_source_that_then_ends_without_failure_is_a_producer_failed_terminal_with_no_credit_granted | 101 | candidate_a.rs:983:5, "the detail carries the placeholder mark and no brace: the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered" |

Each failed as §4 and Amendment 2 predict. I-3 and I-6 were not triggered. No verify-mutation run is counted here as an observation.

## M0 (§8 item 13)

- Worker report 1 (`state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md`, its M0 section) records M0 at ced0450b: 5 tests, 3 runs alone each, 15 of 15 failures at the liveness deadline.
- ced0450b's parent is e4b49efa, and 237af6fe's parent is ced0450b.
- ced0450b touches only the two test files, 369+ and 1-. It has no `batches_discarded` occurrence (`git show ced0450b | grep -c batches_discarded` printed 0).
- Amendment 3 hashes the report "as written", 38e650364d73…. I recomputed it: on main, from line 5 to the end, with `kernel/tests/` restored at the two de-rooted panic sites, the sha256 is 38e650364d73d2228912b94daf74b1d4205da1484d5df1432af8e4b4ae56afca. It matches.
- M0 itself was not re-run.

## §7 at the head (`origin/main...HEAD`)

- Product: 93 + 114 + 13 + 3 + 31 = **254**, against 310.
- Tests: 273 + 205 = **478**, against 490.
- Documentation: 5 + 26 = **31**, against 45.
- Files: 9 in the diff. With the form and PLAN.yaml that makes 11, against 11.
- Must-print-nothing: printed nothing.
- No new product constant.
- There is no overrun, and no class 8 is due.

## §5 declared-unchanged ranges

- All 12 ranges were hashed at the merge base e4b49efa: §5's 7 line ranges and Amendment 2's 5. Each equals its pin (prefixes 9692d911, be826dd0, 7aff1bd7, 4bf4b68e, c9aa475a, 19844f7c ×2, ef2deab3, ca07d3cf, 967389f2, c0008023, 92238c67).
- `git diff -U0` hunks:
  - `transport.rs` inserts after old lines 134, 163, 178, 214 and 226;
  - `server.rs` at 550 and after 586;
  - `kernel/README.md` at 350, after 353 and at 375.
- None falls inside a declared range. `wire.rs`, `skp.rs`, `engine/` and `frontends/` show no diff.

## §8, item by item

| Item | Result |
|---|---|
| 1 | Pass. 231a1aab, ac0bb0e7, 23aa18fc (Amendment 2) and a83e95f5 (#175 merge) are ancestors of e4b49efa. The first code is ced0450b. |
| 2 | Pass |
| 3 | Pass |
| 4 | Pass |
| 5 | Pass: T1, T1b, T2, T3a, T3b and T5 are green, with zero credit where stated. |
| 6 | Pass. The owner arm never calls `observe_cancel`, and the pump keeps pulling. |
| 7 | Pass |
| 8 | Pass (N-1) |
| 9 | Pass |
| 10 | Pass |
| 11 | Pass |
| 12 | Pass: all 8 observed above. |
| 13 | Pass |
| 14 | Pass |
| 15 | **FAIL (S1-1)** |
| 16 | Pass |
| 17 | Pass. No record is in the diff. Code comments cite the form by section. |
| 18 | Kernel half pass. Data-plane half void (S2-1). |
| 19 | Pass. `drive` calls `on_cancel` on the `Arc<dyn SourceCancel>` the factory returns. The kernel's `wrap_for_data_plane` builds `EngineCancel::new` (`lib.rs:286`). T1 and T1b prove it from SkpHost, a ticket, `ticket_only` and `serve`, and M1 fails them. |
| 20 | Pass |
| 21 | Pass: one site, no brace. |
| 22 | Pass for the drain. The doc declaration is present. |

Additionally, the caller grep:
- `on_cancel`: called by `drive`, implemented by `EngineCancel`.
- `note_discarded`: called by `discard_queued`.
- The pump-failed receiver: passed by `server.rs:550` and `:587`.
- `raised`: product.
- `batches_discarded()`: exempt (round 5, item 4).
- The arm in S1-2 has no caller.

## Pins

- I recomputed **all 100** `path:line @ rev sha256` pins in the form on main: 81 at 92a71c30 and 19 at ac0bb0e7. **0 mismatches.**
- Two whole-file pins:
  - `state/consults/2026-10-04-timing-tests-reproduction.md @ 3831d4a9`: matches (df0253b1…);
  - the impact read `@ c823bce5`: unresolvable (S2-2).

## Worker report 1's deviations

| # | Assessment |
|---|---|
| 1 | Sound. Amendment 3 records it as class 2. See S2-3 for its residual dependence on the worker count. |
| 2 | Sound. d60a0bed adds `///` lines only: a diff of 8f5e622e to d60a0bed shows no non-doc line. |
| 3 | Sound. `Flag` implements `SourceCancel`. |
| 4 | Sound for the test. The product runs notify inline. |
| 5 | True at the head, and it matters (S1-2). |
| 6 | Sound, to record (N-4). |
| 7 | Sound. |
| 8 | Sound, with N-5. |
| 9 | Sound, within 2b. |
| 10 | Sound. CI runs no clippy job. My local clippy run (below) shows no warning in any changed file. |

## Commands and exit codes (all in the worktree at 3f7b1949, `CARGO_TARGET_DIR=D:/wt-targets/dptwc`, each under `timeout`)

- `git diff --numstat|--stat|--name-only|-U0 origin/main...HEAD -- …` (§7, §5): rc 0 each.
- `git show <rev>:<path> | sed -n 'a,bp' | sha256sum` over 100 + 2 + 12 ranges: rc 0. The one exception was the c823bce5 `git show`, which failed (S2-2).
- `cargo test -p spatial-data-plane`: **rc 0**. Results: unit 24, candidate_a 16, no_transport_leakage 4, origin_header_encoding 5, stream_registry_bound 3; all passed.
- `cargo test -p spatial-kernel --test skp_cancel_terminal_without_credit --test skp_admission --test skp_filter_cancellation --test end_to_end`: **rc 0** (end_to_end 10, skp_admission 10, skp_cancel_terminal_without_credit 2, skp_filter_cancellation 1).
- `cargo test -p spatial-kernel --lib`: **rc 0** (142 passed, T6 included).
- `cargo fmt --all --check`: rc 0.
- `cargo clippy -p spatial-data-plane -p spatial-kernel --all-targets`: rc 0. There is no warning in any changed file.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: **rc 0** (440 of 440).
- The verify tools were run from the worktree at 3f7b1949. Each tool's blob is identical to origin/main dca1eddd; the commit that last touched each is given in brackets.
  - `node scripts/plan/verify-cites.mjs` (522e448d): rc 0, PASS;
  - `node scripts/plan/verify-quotes.mjs` (f9444a4d): rc 0, PASS, with 0 hash-reference errors;
  - `node scripts/plan/verify-test-claims.mjs` (e9735d47): rc 0, PASS;
  - `node scripts/plan/verify.mjs` (verify:plan, 26072022): rc 0, PASS;
  - `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` (7d24ed15): rc 0, 8 of 8 new tests name a mutation. That is a floor, not an observation.
- The eight mutation runs: rc 101 each, as in the table. The T4 probe: rc 101 (S1-1).
- `gh pr checks 176`: rc 0, 13 of 13 pass. `gh pr view 176` reports the head as 3f7b19492cf9df9fa076d84207031c337ac0464a.
- The final state of the worktree: `git status --porcelain` is empty, and `git rev-parse HEAD` is 3f7b19492cf9df9fa076d84207031c337ac0464a.
