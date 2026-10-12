# PR #189 gate 1 — architect
Reviewed: cut/data-plane-crowded-start-detail-spaces @ 9867fa9faa2feb9e61cb8b5d25f120be154f18f0

**Verdict: pass with notes.** There are no Correctness or Evidence findings. There are four Documentation findings (D1–D4); each is a must-fix before the merge, and none needs a correction round or a re-gate.

I had no shell. I read the branch in `C:/dev/wt/dpcs` at the head and main in `C:/dev/spatial-ide`. The reviewer's `origin/main...HEAD` diff is the authority on which paths changed. My line counts are consistent with the worker's numstat: server.rs went from 781 to 784 lines, and candidate_a.rs from 992 to 1032.

## §8, item by item
1. **Product change other than the three joins:** none. On main, line 462 of `protocol/data-plane/src/server.rs` matches a pattern requiring exactly 22 spaces after `ceiling`, after `so this` and after `rather than`. At 9867fa9f, lines 462–465 of the same path are `\` continuations, each continued line ending in a space before its `\`. Rust strips the line break and the next line's leading whitespace, so each join becomes one space. The words, placeholders, `:?` specifiers, `TERM_TRANSPORT_FAILED`, the branch and the in-pool `no operation started` (line 459 at 9867fa9f) are unchanged. This meets §1 and §2 C1.
2. **Paths outside the list:** none, per the worker report and the line counts. `PLAN.yaml` is not touched (see D1).
3. **New `pub` items:** none. T1's `use` of `CROWDED_START_TIMEOUT`, `MAX_IDLE_CONNECTIONS` and `START_TIMEOUT` sits inside the function body, over constants that are already `pub` (lines 73, 82 and 89 of server.rs at 9867fa9f). No option, callback, code path or dependency is added.
4. **Constants and `wire.rs`:** the three constants read 120s, 4 and 5s, unchanged. `wire.rs` has no diff, per the report and the reviewer's diff.
5. **Existing tests:** unchanged. T1 is inserted between `an_idle_connection_holds_no_stream_slot_and_the_idle_ceiling_is_its_own` and the test carrying the M2 comment, and the M2 comment is intact. The base has 16 tests and the head 17, so P1 holds.
6. **T1:** no sleep, no elapsed-time assertion, no wait on `START_TIMEOUT`. The determinism argument holds against `handle`: `idle` is acquired only by the `try_acquire_owned` at line 430, and a permit is released only at line 481 or when the handler returns. With five connects and four permits, exactly one connection runs on `CROWDED_START_TIMEOUT` (5s), in any handler order. The other four wait on 120s, which is longer than `RECV_DEADLINE` (30s, candidate_a.rs line 251). T1 closes every connection before `dp.shutdown()` (lines 875–878 at 9867fa9f).
7. **M1:** observed by hand as §4 states. The worker restored the base bytes of server.rs, ran T1 by name, saw it fail at (b) with its message, named observation commit 9867fa9f, reverted, and found porcelain empty. No `verify-mutation` run was made, and none is called an observation. The `RECORDED MUTATION (M1)` comment carries no line number and follows the suite's M2 style.
8. **Quotes and pins:** the report's `"not clippy"` is a byte-identical substring of line 14 of `.github/workflows/rust-fmt.yml` at 9867fa9f. The report's quotation of T1's `assert_eq!` is byte-identical to line 869 of candidate_a.rs at 9867fa9f, and the report names that commit. There is no record hash at a branch commit. D4 covers the one bare line cite.
9. **Zero-copy, numbers, timing:** none in the code or in T1's comments.
10. **`cfg`, ignores, path literals:** none added.

## Seam (round 4; the caller rule)
- **Consumer, read at the head.** Lines 169–177 of `frontends/shell/src/streaming/wire.ts` at 9867fa9f read the code from `payload[0]` and decode `payload.subarray(1)` with `TextDecoder` as opaque text. Nothing parses the detail.
- **T1 uses the real shape.** It runs a real `serve`, a real WebSocket `connect`, and the suite's `drain` (candidate_a.rs lines 263–306), which reads `payload[0]` and then `from_utf8_lossy(&payload[1..])`. That is the decoder's shape, so the seam is proven end to end from the real frame.
- **The worker did not re-read wire.ts.** The worker report states this. My read discharges the form's §9 seam item, so it is not a finding.
- **Caller rule:** no new `pub` item, option or callback. C1 changes producer bytes on an existing product path.
- **P4 at 9867fa9f:** no reader of the text exists in `protocol`, `kernel`, `engine` or `frontends`.

## Round-25 checks
- **Class 8:** the worker reports 5 lines against a ceiling of 8, 40 against 60, and 45 in total against 68. That fits §7, and §7 is unedited. The reviewer recomputes the count.
- **Class 9:** none. The third run was in the form before any code (§0), so it is not an addition.
- **Mutation wording:** clean.
- **Test-text spans:** named at 9867fa9f, with no hash pins.

## Verbatim quotes and discharge claims
The form quotes none of the human's words and has no amendments. The diff adds no amendment, so there is no "discharged" or "done" clause to resolve. I did not see CI at 9867fa9f; the custodian and the reviewer read it.

## Documentation findings (must-fix before the merge)
- **D1 (low; form §0, the node-summary sentence, and §8 item 2).** The form says the node's summary is corrected in this pull request, but the correction lands on main instead. Fix: the closing record names the main commit that carries the correction. Alternatively, a one-line amendment in the form's §10 can record the move. Either way, §0 is not edited in place.
- **D2 (low; form §5, P4).** P4 as worded is not met at the base: the grep also finds the form's own lines 55, 104 and 105. This is not Evidence, because the invalidator names a reader of the text and a preregistration is not a reader. Fix: the closing record reports P4 as not met as worded, gives the cause, and does not report it as confirmed.
- **D3 (low; form §9, the suite line).** The requirement for "`clippy` as CI runs it" resolves to nothing, because no workflow runs clippy (rust-fmt.yml line 14 at 9867fa9f). Fix: the closing record states that clippy was not run, and does not list it as green.
- **D4 (low; worker report, P4 bullet).** The report cites `protocol/data-plane/src/server.rs:462` bare, without a commit. The custodian's filing note says the report's lines are at the branch head, but this cite is at the base, e888787e. Fix: the filing note scopes that cite to e888787e, so it is not read at the head or as current.

## Files
- `C:/dev/wt/dpcs/protocol/data-plane/src/server.rs`
- `C:/dev/wt/dpcs/protocol/data-plane/tests/candidate_a.rs`
- `C:/dev/wt/dpcs/frontends/shell/src/streaming/wire.ts`
- `C:/dev/wt/dpcs/protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-10-07-data-plane-crowded-start-detail-spaces-worker-report-1.md`
