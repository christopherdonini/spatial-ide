# Impact read — wire-bytes-invariant-trace-flag-race (lead-data, second pilot, resumed)
Read at: main 8604c819

Pointers only, under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 1. Nothing below is draft text, a design or a recommendation. Everything not inside a byte-copied quotation is my paraphrase.

## 0. The piece and its record, by pointer

- PLAN node: `PLAN.yaml:4514-4530` (title at 4515, summary at 4529; placed by `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:21-24`, item 3c; pilot resumption at :31).
- The CI failure: `state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1422-1443`. The binary ran two tests (:1424); the projected-ticket test failed (:1425) and panicked at `kernel/tests/wire_bytes_invariant.rs:378:5` (:1432-1433); its sibling passed (:1426); result line at :1440. The step runs `cargo test --workspace --locked` with no thread setting (`.github/workflows/product-ci-rust.yml:233-234`).
- The cause as read from code, not observed: PR #189 gate-1 reviewer, `state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md:95-102` (the race reading at :100, the ledger-candidate note at :102). PR #189's form records the same at `protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md:229`.

## 1. Interfaces the piece touches

**The two tests (one integration-test binary, `kernel/tests/wire_bytes_invariant.rs`):**

| Test | Asserts tracing off | Starts a trace | Asserts tracing on | Batch guard | Guard dropped |
|---|---|---|---|---|---|
| `tracing_changes_no_byte_on_the_wire` (`kernel/tests/wire_bytes_invariant.rs:168-255`) | :173-176, before the untraced run | :179-185 (`.expect` on a refused start) | :186 | :188-193 counted, :203-206 asserted | :194 |
| `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` (`kernel/tests/wire_bytes_invariant.rs:374-436`) | :378-381, before the untraced run (the CI panic site) | :384-390 (`.expect` on a refused start) | :391 | :393-398 counted, :401-404 asserted | :399 |

- Both are `#[tokio::test(flavor = "multi_thread")]` (:168, :374). No lock, static or serialising helper exists in the file (search of the file for a static `Mutex` and for `serial` finds none).
- Each test's untraced and traced runs each start their own data plane (`collect_frames`, :119-166; `collect_frames_via_ticket`, :287-362).
- The file's header states what is compared and the `TAG_OPEN` exclusion (:4-32).
- The projected test carries a recorded mutation re-observed at 99f4c437 (:364-373). That recording is pinned in `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:122-132` (C7) and :185 (W-1), and its rewritten form at :362. The PR's gate re-made it as W-1 (`state/consults/gates/2026-10-07-kernel-close-races-followups-gate1-reviewer.md:56`).

**The trace flag and slot, the authoritative source `engine/src/trace.rs`:**
- `ENABLED`, one process-global `AtomicBool`, false at start: `engine/src/trace.rs:82-88`. `CURRENT`, the single trace slot, and its declared limit of one traced stream per traced run: :90-98.
- Set: `trace::start` refuses when the slot is occupied (:329-333), then stores the trace and sets the flag `SeqCst` (:334-338).
- Cleared: `TraceGuard`'s `Drop` clears the flag, then empties the slot (:341-358, the store at :355).
- Read: `mark` does a `Relaxed` load and returns when the flag is off (:301-307), and `mark_cold` takes the slot lock (:311-316). `is_enabled` does a `Relaxed` load (:318-322).
- Pinned by the engine's unit tests in `engine/src/trace.rs`:
  - `a_disabled_mark_records_nothing_and_a_started_trace_records_in_order` (:734-762) asserts off after a guard drops (:760).
  - `a_second_trace_is_refused_rather_than_replacing_the_first` (:764-775).
  - Both, and the other trace-starting unit tests, take a module-local `TEST_LOCK` (:727-732). That lock does not reach other test binaries.
- Who reads it on the product path: each `mark` site reads the flag, and no product site calls `start`.
  - `engine/src/stream.rs:1214, 1234, 1330, 1333, 1385, 1775, 1791, 1826, 1830, 1839, 1859, 1886, 1919, 1938, 1986, 2551-2552, 2557`.
  - `engine/src/cancel.rs:120-124`.
  - `kernel/src/publish/mod.rs:718, 727, 782, 997, 1536, 1541, 1571, 1576, 1638`.
  - That `trace::start` has no product caller is stated at `engine/src/stream.rs:708-710` and `kernel/src/lib.rs:615-617`.
- No file under `protocol/`, `renderer/` or `frontends/` names `trace::` (search over their `.rs` files).

## 2. Who consumes them: every other test in kernel/ and engine/ that starts a trace, asserts tracing off, or reads the flag

| Binary | Trace use | Shares the binary with a flag-changing test? | Serialisation on main |
|---|---|---|---|
| `kernel/tests/trace_spans.rs` | six tests start traces; asserts off at :491-494 and :518 | yes, each other | `TRACE_SERIAL` and `serial()` (:138-149), taken at :194, :329, :380, :479, :547, :616; `quiesce` against producer stragglers (:151-175) |
| `kernel/tests/skp_admission.rs` | one test: asserts off :820-823, starts :824-830 | no other trace user; the module doc states that choice (:6-9) and declines the on/off toggle (:11-18) | separate binary by design |
| `kernel/tests/skp_filter_cancellation.rs` | one test: asserts off :164-167, starts :168-174 | no other trace user; module doc :4-14 | separate binary by design |
| `kernel/tests/skp_cancel_terminal_without_credit.rs` | starts none, by design (:8-10) | — | — |
| `engine/tests/slice.rs` | `cancelling_mid_stream_stops_production_promptly` starts a trace (:755-782) and reads its stamps (:808-809); no flag assertion | yes: the binary's other streaming tests run unserialised against it (no lock in the file by search) | none found |
| `kernel/tests/query_window_attribution.rs` | starts in `run_one_trial` (:200-208), reached from `qwa_trial_child` (:173-178), which returns at once in the ordinary suite; process-per-trial reason at :10-19 | only in a child process | process per trial |
| `kernel/tests/first_batch_factorial.rs` | starts at :504-510 (child path, `night_trial_child` :444-449 returns at once in the ordinary suite) and :1321, :1455 (inside `#[ignore]`d tests :1299-1300, :1433-1434) | child process or ignored | process per trial / ignored |
| `kernel/tests/cancel_rescore.rs` | starts at :783 and :815, called from `measure_the_cancellation_rescore` (:552, calls at :643-644, :655), `#[ignore]`d at :550-551 | ignored in CI | ignored |
| `kernel/tests/post_check_cost_report.rs` | names the flag in its module doc only (:10-17) | — | — |

The same constraint, recorded in two earlier forms, decided where a test lives:
- `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:76-81` (0.8);
- `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:100-102` (0.10).

## 3. What governs them

- **ADR-004**, Status line `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3` (Accepted 2026-07-31).
  - Amendment 4 (accepted 2026-08-08) is at :31-59. Its proof obligation names `kernel/tests/wire_bytes_invariant.rs` as the current implementation of the byte comparison, scoped to one operation class (:51-56).
- **ADR-018**, Status line `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3` (Accepted 2026-08-08). Its item 7 was struck in Amendment 4's favour (:109-113). It governs the cancellation instants the trace stamps (`engine/src/trace.rs:370-390`).
- **ADR-010**, Status line `docs/adr/ADR-010-render-frames-origins-boundaries.md:3` (Accepted 2026-08-03). Rule 6, declared capacity ceilings, is at :70. `engine/src/trace.rs:51` and :92 cite it for `TRACE_BUFFER_RECORDS` and the one-traced-stream limit.
- **The design note that introduced the trace and the wire-bytes invariant:** `kernel/CANCELLATION-AND-TRACING.md`.
  - Its authority is at :7-8.
  - §5, the invariant as a regression test, is at :144-155.
  - §7, one traced stream per traced run, is at :180-182.
  - It is a design note, not a file named PREREGISTRATION; I found no separate preregistration that introduced `engine/src/trace.rs`.
- **The preregistration that added the projected-ticket test:** `engine/B1-PROJECTION-PREREGISTRATION.md`. K-6 is at :280, the test's addition at :469-470, and the test list at :42.
- **Later forms that touched the file:**
  - `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:362` and :376 (the `handle` line in `collect_frames_via_ticket`);
  - `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:39`, :122-132, :185, :235 (the per-file count) and :362.
- **KNOWN-LIMITATIONS:** no item names tracing, a process-global flag or a test-binary race (search of `KNOWN-LIMITATIONS.md` for trace, process-global, test binary and flaky finds nothing).
- **Declared ceilings and limits:** `TRACE_BUFFER_RECORDS` (`engine/src/trace.rs:51-80`, indexed at `engine/README.md:527`); the one-traced-stream limit (`engine/src/trace.rs:90-98`, `kernel/CANCELLATION-AND-TRACING.md:180-182`).

**Owner's-index pointers found missing (not filled here):**
- `engine/README.md:500-514` lists no interface entry for `spatial_engine::trace` (`start`, `is_enabled`, `mark`, `TraceGuard`); only its ceiling appears (:527).
- `kernel/README.md:351-366` pins nothing to `kernel/tests/wire_bytes_invariant.rs` or `kernel/tests/trace_spans.rs`.
- `kernel/README.md:373-377` does not list `kernel/CANCELLATION-AND-TRACING.md`.

## 4. Questions the form must answer (at most five)

1. Which means keeps the file's two tests from overlapping on `ENABLED` and `CURRENT`? The pointers that raise it:
   - the race site: `kernel/tests/wire_bytes_invariant.rs:173-186` against :378-391;
   - the one-trace-test-per-binary rule another file states about this one: `kernel/tests/skp_admission.rs:6-9`;
   - the test that broke it: `engine/B1-PROJECTION-PREREGISTRATION.md:280`, :469-470;
   - the precedents on main: `kernel/tests/trace_spans.rs:138-149` and `engine/src/trace.rs:727-732`.
2. Whether the form must also close cross-run stamping: a producer of one run, or of the sibling test, stamping `batch_full` into a traced run's buffer and satisfying the batch guard. The pointers that raise it: `kernel/tests/wire_bytes_invariant.rs:188-206` and :393-404; the straggler mechanism at `kernel/tests/trace_spans.rs:151-160`.
3. What evidence the form takes as showing the race closed. The cause was read from code and not observed, and the push run at the same head passed (`PLAN.yaml:4529`; `state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md:100`).
4. Whether a change to either test must keep the projected test's recorded-mutation comment and its observation commit, and whether it requires a re-observation. The pointers that raise it: `kernel/tests/wire_bytes_invariant.rs:364-373`; `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:122-132` and :185.
5. Whether `engine/tests/slice.rs`'s traced test, unserialised against its binary's other streams, is inside or outside this piece's Scope. The pointers that raise it: `engine/tests/slice.rs:755-782`; `PLAN.yaml:4515` names only `kernel/tests/wire_bytes_invariant.rs`.

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: 1-62
- `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`: 1-45
- `engine/README.md`: 495-528
- `kernel/README.md`: 346-385
- `PLAN.yaml`: 4514-4539 (search), 4529
- `state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt`: search hits (302-307, 1422-1442), 1420-1444
- `state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md`: 1-12, 90-109
- `state/consults/gates/`: search for the test and the flag (hits only)
- `engine/src/trace.rs`: 1-800
- `kernel/tests/wire_bytes_invariant.rs`: 1-437
- `kernel/tests/trace_spans.rs`: 130-204, 475-524; search hits
- `kernel/tests/skp_admission.rs`: 1-20, 770-839; search hits
- `kernel/tests/skp_filter_cancellation.rs`: 1-180
- `kernel/tests/skp_cancel_terminal_without_credit.rs`: 1-20
- `kernel/tests/post_check_cost_report.rs`: 1-30
- `kernel/tests/query_window_attribution.rs`: 8-27, 170-214
- `kernel/tests/cancel_rescore.rs`: 770-824; function search
- `kernel/tests/first_batch_factorial.rs`: 440-451; search hits
- `engine/tests/slice.rs`: 750-789; function and lock search
- `engine/src/stream.rs`: 703-714; search hits for `trace::`
- `engine/src/cancel.rs`: 88-127
- `kernel/src/lib.rs`: 610-619
- `kernel/src/publish/mod.rs`: search hits for `trace::`
- `kernel/CANCELLATION-AND-TRACING.md`: 1-12, 140-214
- `engine/B1-PROJECTION-PREREGISTRATION.md`: search hits (42, 209, 280, 469-470, 505, 640)
- `engine/B1-FOLLOWUPS-PREREGISTRATION.md`: 226-239
- `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/CANCEL-RESCORE-PREREGISTRATION.md`, `protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md`: search hits only
- `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`: 60-89
- `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`: 95-106
- `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md`: 3 (search), 31-59
- `docs/adr/ADR-018-what-cancellation-acknowledged-means.md`: 3 (search), 100-117
- `docs/adr/ADR-010-render-frames-origins-boundaries.md`: 3, 70 (search hits)
- `KNOWN-LIMITATIONS.md`: searches only (no hits)
- `.github/workflows/product-ci-rust.yml`: 225-240
