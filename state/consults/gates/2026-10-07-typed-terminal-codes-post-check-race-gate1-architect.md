# PR #187 gate 1 — architect
Reviewed: cut/typed-terminal-codes-post-check-race @ 0c94dcb033b8b5f3b961329a7525ab1484ffd297

**Verdict: pass with notes.** I found nothing under Correctness or Evidence. Two Documentation findings must be fixed in this PR before the merge. There are also two notes that need no action in this PR.

## Correctness: §2's ordering argument, checked against the code at the head (the engine and kernel sites are unchanged from the pins)

- **The queue.** It holds `MAX_QUEUED_BATCHES` = 2 items. The constant is at engine/src/stream.rs:82, the channel at engine/src/stream.rs:1234, and the re-export is at engine/src/lib.rs:149. The tests import the real constant, so the seam is written against the interface the engine actually has.
- **Batches and receives match one to one.** The producer has one data-carrying send, at engine/src/stream.rs:2543-2552, and it blocks. The consumer's only receive is the `recv` in `next_into` (engine/src/stream.rs:783). `absorb` turns one item into one `Ok`, and `EngineSource::next_into` (kernel/src/lib.rs:663-689) maps each `Ok` one to one. So the tests' `Ok` count equals the number of producer sends.
- **Nothing else reads the stream first.** `viewport_query` (kernel/src/skp.rs:1465-1488) and redeem (kernel/src/skp.rs:293-309) both only move the source, so nothing drains it before the test's first `next_into`.
- **The post-check comes after every send.** It runs after `produce` returns (engine/src/stream.rs:1251-1265 and 1327-1337), so it follows the last send. With 3 or more batches, the third send cannot complete before the first `recv`, and the touch comes before that call.
- **The arithmetic holds.**
  - `columns: None` gives no projection (kernel/src/skp.rs:1796-1797), so the path takes `stream_with_cancel` with `BatchSizePolicy::default()`, which is SizeOnly.
  - The envelope's attributes are empty on this path (engine/src/envelope.rs:271-272), so no attribute bytes are added.
  - `target_for(0) + target_for(1)` = 65,536 + 262,144 = 327,680. The first three targets add up to 1,376,256.
  - The estimate is 20·v + 12 per row (engine/src/stream.rs:2270-2273), and every row has at least 4 vertices (engine/src/fixture.rs:1251-1254, 1358-1369), so a row is at least 92 bytes. The estimate is linear, so batch estimates add up to the row total.
  - Cutting before the append keeps batch k at or below `target_for(k)`.
  - The upper bounds are right: 492 for Part A (at most 18 outer + 6 hole vertices, `hole_every` default 7) and 312 for E2's mutation (at most 15 vertices, `hole_every` 0).
- **Part A.** The batch-count assertion is at line 175 of kernel/tests/typed_terminal_codes.rs at 0c94dcb0. It comes before the terminal `expect` at line 180.
- **E2.** The assertion is at line 199 of kernel/tests/session_end_event.rs at 0c94dcb0, before the `expect` at line 203.
- **E3.** 20,000 × 92 > 1,376,256, so there are at least 4 batches.
  - Either the producer observes the cancel, which was issued after the touch, or it blocks on its third send until the first receive.
  - After that send, every path to an `Ok` return passes a cancel check: the row check (engine/src/stream.rs:1972-1985), the loop top (1882-1885) or the check in `flush` (2522-2527).
  - So the terminal is `Cancelled`, and the post-check still runs after the touch.
  - `EngineCancel::cancel` sets the token synchronously (kernel/src/lib.rs:726-727).

## §8, item by item
1. The form (125c66e8) and Amendment 1 (92884cc4) are both at or before the branch base. Pass.
2. The two changed files are not under `protocol/`, are not lockfiles or wire fixtures, and are not in the lines cut's §7 list (engine/GEOMETRY-LINES-PREREGISTRATION.md:500-509 on main). `kernel/README.md` is untouched, and the stop condition did not fire. Pass.
3. Two files changed, both §7 files. **I have no shell:** this rests on the custodian's re-check in the filing note and on the reviewer's diff.
4. The change adds no sleep, no timeout and no timing assertion. E2 and E3 keep their earlier `recv_timeout` event waits unchanged. These do not synchronise anything: `end_session_if_source_changed` sends the event on the consumer thread before `next_into` returns the terminal (kernel/src/lib.rs:683-686). Pass in substance; see D-1.
5. No changed comment cites a path:line into `engine/src` or `kernel/src`. Pass.
6. Both batch-count assertions come before the terminal `expect`. Pass.
7. Both `fixture()` functions delegate with their old spec (200/12/NativeUnique; 300/10/hole 0), so their output is unchanged. No other test changed. Pass.
8. Nothing claims the flake is "fixed", and nothing claims the CI cause was observed. Pass.
9. Part B came after Amendment 1. Pass.
10. Round-25 items:
    - **§7 count:** Part A has 52 changed lines against a ceiling of 80, Part B 40 against 70, and 2 files against 4. No overrun, and §7 is unedited.
    - **Scope:** no scope addition.
    - **verify-mutation:** no run of it is called a mutation's observation; the report says none was used.
    - **Test-text pins:** no test-text span is pinned by hash at a branch commit. The report names both commit ids.

## §1 and the mutation comments
- **M-2.** It is labelled "Not a test of record". Its comment says it is consistent with the CI failure and does not show that this was its cause (lines 109-112 of kernel/tests/typed_terminal_codes.rs at 0c94dcb0). Pass.
- **The "Why the post-check cannot beat the touch" paragraph** (lines 90-94 at 0c94dcb0). Its guarantee depends on the batch count, and the assertion states that condition, as §1 allows. Pass.
- **The recorded mutations M-0, M-1, M-B2 and M-B3** each name their base `92884cc4`, which is on main, and match the house form. The assertion messages they quote match the assertion strings exactly. Pass.
- **Re-running the mutations is for the reviewer** under §9.

## Verbatim quotes and discharge claims
- The diff contains no quote of the human's words.
- Amendment 1 declares that nothing in it is a quotation.
- The diff adds no amendment, so there is no discharge clause to resolve.
- The report's "done" claims are backed by the named runs: P-1 and P-3 at 20 of 20, plus the checks table. The reviewer confirms those runs.

## Documentation findings (must fix before the merge; neither blocks)
- **D-1 (Documentation, low).** state/consults/2026-10-07-typed-terminal-codes-post-check-race-worker-report-1.md:29 says: "There is no sleep, no timeout and no timing assertion in any changed test."
  - As written this is inaccurate. E2 and E3 are changed tests, and they still hold their earlier `recv_timeout` waits of 5 s and 200 ms.
  - Fix: the PR body or closing record says "none introduced; E2/E3's pre-existing event waits are unchanged", and does not repeat the report's sentence.
- **D-2 (Documentation, low).** Amendment 1 pins the round-65 ruling's hash "at the commit that adds it". That is not an explicit `@ <rev>` at a commit on main, as round 15 (e) requires.
  - Fix: the closing amendment carries `state/directives/2026-10-07-round-65-rulings.md:6 @ <the main commit that added it> sha256:<hex>`.
  - The reviewer recomputes the hash, because I have no shell.

## Notes (no action in this PR; route them)
- **N-1.** E3's doc (lines 218-221 of kernel/tests/session_end_event.rs at 0c94dcb0) has been there since before this PR. It credits a quoted comment to `kernel/src/lib.rs`, but the text is at kernel/src/skp.rs:1484-1485.
  - It is outside the diff hunks and is a quote of code, not of the human.
  - Route it together with the worker's noticed-and-not-done item about the stale wording "restore `Some(Err(e.to_string()))`".
- **N-2.** The form's §0.4 carve-outs stand: the in-crate sibling in kernel/src/skp.rs and E4's sleep. Both go to the proposed nodes, as routed.

No ADR is missing.
