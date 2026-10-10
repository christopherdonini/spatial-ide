# Impact read — stream-flush-cancel-exit-marks-producer-cancelled (lead-data, second pilot, resumed)
Read at: main 6e9b74cf

Pointers only, under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 1. No draft text, design, recommendation or answer. Everything not in quotation marks is a paraphrase. The custodian's check (`state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md`) was read at a7935e18; every `engine/src/stream.rs` line it cites resolves to the same content at 6e9b74cf (re-read here).

The piece: `PLAN.yaml:4495` (id), `PLAN.yaml:4496` (title), `PLAN.yaml:4502` (depends on `wire-bytes-invariant-trace-flag-race`), `PLAN.yaml:4510` (summary). Placement: `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36` and `:38`; grading and the form's obligations: `state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:7`.

## 1. The interfaces the piece touches

**The event.**
- `spatial_engine::trace::PRODUCER_CANCELLED`, declared at `engine/src/trace.rs:440-441`. It is the producer side's `cancel_observed` in the instants table at `engine/src/trace.rs:380-384`. `engine/src/trace.rs:445-448` says docs/08 budgets the interval that ends there.
- The interval's start: `CancelToken::cancel` (`engine/src/cancel.rs:96-98`) stamps `CANCELLATION_REQUESTED` once, on the false-to-true swap (`engine/src/cancel.rs:120-124`). The swap publishes the flag before the stamp. `CancelToken::cancel_for_drop` (`engine/src/cancel.rs:113-115`) sets the flag without stamping. Its one caller is `BatchStream`'s `Drop` (`engine/src/stream.rs:885-895`, call at `:893`).
- Readers: `Trace::first` (`engine/src/trace.rs:200`), `Trace::segment_ms` (`engine/src/trace.rs:209`), `Trace::events` (`engine/src/trace.rs:189`), `Trace::dropped` (`engine/src/trace.rs:170`).
- No span in `SPANS` pairs the cancellation instants (`engine/src/trace.rs:538-552`).
- The trace is one process-global slot, with one traced stream per traced run as a declared limit (`engine/src/trace.rs:90-98`). The buffer ceiling is `TRACE_BUFFER_RECORDS` (`engine/src/trace.rs:80`).
- Pinned by: no test in `engine/src/trace.rs` names the event. The tests that read it are listed in §2.
- **Missing pointer:** neither owner's index names `spatial_engine::trace` or this event (`engine/README.md:500-514`, `kernel/README.md:351-366`). The wire-bytes piece's form declares an engine index entry for `spatial_engine::trace` (`kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:245-248`). That entry is not on main.

**The exits.** All of them are in `produce` (`engine/src/stream.rs:1756`) and `flush` (`engine/src/stream.rs:2456`). Every stream entry point reaches them through `stream_inner` (`engine/src/stream.rs:1140`; callers at `:911`, `:950`, `:1012`, `:1043`, `:1072`, `:1101`, `:1126`). The producer thread calls `produce` at `engine/src/stream.rs:1254`.
- The exits that mark:
  - the execute guard's `Cancelled` arm (`engine/src/stream.rs:1829-1832`);
  - an execute `Err` under a cancel (`engine/src/stream.rs:1838-1841`);
  - the loop-top check (`engine/src/stream.rs:1885-1888`);
  - a fetch panic under a cancel (`engine/src/stream.rs:1918-1921`);
  - the per-row check (`engine/src/stream.rs:1975-1988`).
- **The piece's exit:** `flush`'s check at `engine/src/stream.rs:2540-2545`. It increments `StreamStats::batches_after_cancel` (field at `engine/src/stream.rs:666`) and returns `Cancelled` without a mark. It runs after `batches_generated` and `rows_generated` are counted (`engine/src/stream.rs:2536-2539`) and before `FIRST_BATCH_FULL`/`BATCH_FULL` (`engine/src/stream.rs:2550-2557`). Its comment cites H2 (`engine/src/stream.rs:2541-2542`).
- `flush` is called from four sites: the pre-append size cut (`engine/src/stream.rs:2016`), the post-append cut (`:2065`), the chunk-boundary time budget (`:2101`) and the stream end (`:2121`).
- The other unmarked returns, per the custodian check (`state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37`):
  - the pre-prepare check (`engine/src/stream.rs:1780-1782`);
  - a prepare error through `classify` (`engine/src/stream.rs:1784-1786`);
  - a send to a gone receiver (`engine/src/stream.rs:2561-2570`);
  - the double read of the token in the two marking `classify` exits (`engine/src/stream.rs:1838-1841`, `:1918-1921`, `classify` at `:2573-2579`).
- After `produce` returns, the thread decides the lease, runs the post-check and sends the terminal (`engine/src/stream.rs:1292-1362`). It stamps `PRODUCER_FINISHED` last (`engine/src/stream.rs:1385`), the producer's quiescent instant per the comment at `engine/src/stream.rs:1372-1381`. The engine queue is `MAX_QUEUED_BATCHES` = 2 (`engine/src/stream.rs:85`; channel at `:1237`).
- Pinned by: no test was found that forces the `flush` exit. Every reader of `batches_after_cancel` asserts it is at most 1:
  - `engine/tests/slice.rs:746-752`;
  - `engine/tests/slice.rs:835-841`;
  - `engine/tests/connection_reuse.rs:258`;
  - `kernel/tests/end_to_end.rs:428`;
  - `kernel/tests/concurrency_in_situ.rs:362`.
- The one in-crate test of `flush` pins its single-run retention arm only (`engine/src/stream.rs:3192-3199`).
- The index's cancellation entry (`engine/README.md:506`) pins `CancelToken` by two tests, neither of which reads the event.

**The budget it ends.** `docs/08_Testing.md:8` scores cancellation on `cancel_requested → cancel_observed` on the producer's clock, per ADR-018. Pinned by `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly` (`engine/tests/slice.rs:755-842`; the assertion is at `:815-818`).

## 2. Who consumes them

**Tests that read the event or the requested-to-observed interval.** The `git grep` result is in `state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:61-65`, and a Grep at 6e9b74cf finds the same files.
- `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly` (`engine/tests/slice.rs:755-842`).
  - Default, not ignored.
  - It starts a trace (`:776-782`), takes one batch, cancels (`:791`) and drains.
  - It requires both stamps (`:808-809`), then asserts the pair under 100 ms (`:815-818`) and `batches_after_cancel` at most 1 (`:835-841`).
  - Its binary also cancels in `cancelling_before_the_first_batch_stops_the_stream_without_producing_anything` (`:688-753`, `cancel()` at `:722`) and drops a stream mid-query in `dropping_the_stream_cancels_the_query` (`:844-845`).
  - The binary has no serialising lock (no Mutex in the file). `PLAN.yaml:4315-4316` (`slice-traced-test-cross-stamping`, proposed) tracks this. The human's note on that node: `state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:9`.
- `kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant` (`kernel/tests/trace_spans.rs:327-368`).
  - Default.
  - It asserts that the event is absent (`:355-358`) and that `CANCELLATION_REQUESTED` is absent (`:351-354`) on a run that completed and was then dropped (`:345`).
  - It takes `serial()` (`:329`; defined at `:147`).
  - Other tests in the binary start traces (`:198`, `:384`, `:502`, `:562`, `:620`). None calls `cancel()`.
- `kernel/tests/skp_admission.rs::cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` (`kernel/tests/skp_admission.rs:779-801`, body to `:950`).
  - Default.
  - Credit 2 (`:865-871`), then the SKP cancel after a batch (`:888-891`).
  - It requires both stamps (`:921-931`). Only the ordering race is retried, 5 attempts (`:766-778`, `:935-939`). A missing stamp panics at `:928-931` and is not retried.
  - Nine other tests share the binary (`:129` to `:696`). None starts a trace. Whether any of them streams while this trace is live was not read here.
- `kernel/tests/skp_filter_cancellation.rs::cancel_reaches_the_producer_during_a_late_matching_filtered_scan` (`kernel/tests/skp_filter_cancellation.rs:122-143`, body `:145-282`).
  - Default. The only test in its binary.
  - Credit `u32::MAX` (`:211-217`), then a cancel after `TAG_OPEN` (`:240-243`).
  - It requires both stamps (`:264-274`), and retries only the ordering race.
- `kernel/tests/first_batch_factorial.rs`:
  - `cancellation_holds_with_pruning_in_the_path` (`:1299-1301`, ignored as a measurement pass);
  - `cancellation_holds_with_pruning_in_the_path_on_h5` (`:1433-1435`, ignored);
  - Each reads `segment_ms(CANCELLATION_REQUESTED, PRODUCER_CANCELLED)` (`:1353-1356`, `:1487-1490`) after two batches, and tolerates an absent span per trial (`:1363`, `:1367`).
  - It asserts that at least one span exists and that the worst span is under 100 ms (`:1389-1399`). The H5 cell's assertions after `:1504` were not read.

**Other consumers.**
- **No product reader.** `trace::start` has no product caller. Its only definition is `engine/src/trace.rs:329`, and `kernel/src/lib.rs:613-618` says so. No summarizer or report generator under `engine/src`, `kernel/src`, `protocol` or `frontends` names the event (a Grep of the source trees).
- **Prose that cites the event:** `frontends/shell/CANCELLATION-FACTS.md:25-32` relies on the `skp_admission` test above. Also `kernel/RESULTS.md:3253` and `:3569` (not read beyond the grep line).
- **A proposed future consumer:** `PLAN.yaml:4069-4074` (`slice-budgets-cancel-cells-on-trace-pair`) would score the harness's cancellation cells on this pair.
- **The cancel path these tests drive:**
  - `EngineCancel::cancel` (`kernel/src/lib.rs:726-737`) calls the engine token's `cancel`, and so stamps the request.
  - The data plane's owner-cancel drain relies on the pre-send check returning `Cancelled` (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:184-188`). That check is the exit this piece names.

## 3. What governs them

- **ADR-018** (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3-5`): Status **Accepted** 2026-08-08, architect-blockable.
  - Its parts: the instants (`:41-50`), the scored pair (`:56-59`), the p50/p95 verdict (`:67-76`), the path classification (`:78-88`) and the two-instant cost (`:131-134`).
  - `kernel/tests/first_batch_factorial.rs:1290-1291` still calls ADR-018 Proposed. That comment is stale against the Status line.
- **docs/08:** `docs/08_Testing.md:8`.
- **The design note:** `kernel/CANCELLATION-AND-TRACING.md`.
  - The frozen instants and the scoring reading: `:44-53`.
  - The taxonomy: `:83-97`.
  - The limits: one traced stream, and no segment from a trace with `dropped > 0` past the fill (`:178-193`).
  - Neither owner's index lists it under Governed by (`engine/README.md:516-520`, `kernel/README.md:373-377`). The wire-bytes form declares adding it to the kernel index (`kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:243`).
- **Preregistrations that introduced the exits, the event's use or the assertion:**
  - `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md:36`: the guard's marking exit and the kept execute-`Err` mark. Full gating, §21a cancellation guarantee (`:6`).
  - `engine/ADMISSION-PREREGISTRATION.md`, Amendment 4 (`:836`), items (iv) (`:908-917`, the event is the budgeted end, before the post-check) and (ix) (`:962-989`). Item (ix) quotes the round 5 item 3 ruling and the re-aim of the slice.rs assertion.
  - The two `classify` marking sites were added by `cut/sql-filter` P4 (comments at `engine/src/stream.rs:1834-1837`, `:1906-1917`; test doc at `kernel/tests/skp_filter_cancellation.rs:112-121`). That cut's preregistration is a **missing pointer**: not located in this read.
  - The per-row mark's rationale is in its comment (`engine/src/stream.rs:1976-1985`). No preregistration was located for it. **Missing pointer.**
  - `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md` §0.8 (`:76-81`) recorded at 61f7e64b that the producer can return `Cancelled` without stamping on a backpressured path, citing `flush`. Amendment 3 (`:288-296`) records B-keep for the slice.rs assertion.
  - The ruling: `state/directives/2026-10-04-round-53-open-1-ruling.md:6-7` (B-keep, and a re-run practice for that assertion's failures).
  - `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md:53-55` (the send blocks without watching the token) and `:146` (the stamp is recorded with no prediction).
  - `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:184-188`, as in §2.
- **H2, at most one batch after cancel:** `kernel/README.md:331`. Its bake-off source is ADR-012's H2 row (`docs/adr/ADR-012-data-plane-transport.md:130`), and ADR-012's Status is Proposed (`:3`).
- **The piece ahead in the slot:** `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md` declares `engine/src/trace.rs` and every product line unchanged (`:177-178`). It declares index entries this piece's index update would sit beside (`:239-248`).
- **KNOWN-LIMITATIONS:** no item names the event or the cancellation instants. Item 30 (`KNOWN-LIMITATIONS.md:319`) is publish cancellation, a different worker with its own `CANCEL_OBSERVED`.
- **Declared ceilings:**
  - `MAX_QUEUED_BATCHES` (`engine/src/stream.rs:85`);
  - `TRACE_BUFFER_RECORDS` (`engine/src/trace.rs:80`);
  - the H2 bound of one batch after cancel (`engine/src/stream.rs:2541`; `kernel/README.md:331`).
- **The evidence:**
  - the report: `state/consults/FLAKE-HUNT-RUN-1-2026-10-10.md:49-74`;
  - the experiment, described at `state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md:6-10`;
  - its diff: `state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/experiment-C-final-state.diff`;
  - the custodian's note on the four `events=11` runs (`state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:55-57`).

## 4. Questions the form must answer

1. Can each of the four kernel tests hit the gap? This is the human's item 1 (`state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:7`). Read each test's credit and cancel point: `kernel/tests/skp_admission.rs:865-891`, `kernel/tests/skp_filter_cancellation.rs:211-243`, `kernel/tests/first_batch_factorial.rs:1336-1343`, and for trace_spans the absence assertion at `kernel/tests/trace_spans.rs:355-358`. Read them against `flush`'s four call sites (`engine/src/stream.rs:2016`, `:2065`, `:2101`, `:2121`) and `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:184-188`.
2. For each other unmarked return and for the `classify` window, is it a `cancel_observed` in ADR-018's sense (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46`), and is it in scope (`state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37`; `PLAN.yaml:4510`)?
3. Which runs could record the new mark with no matching request, given that `Drop` sets the token without stamping (`engine/src/cancel.rs:113-115`, `engine/src/stream.rs:893`)? Does `kernel/tests/trace_spans.rs:355-358`'s absence assertion still hold?
4. How does ADR-018's path classification (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88`) classify the section between the per-row check and `flush`'s check, that is, batch assembly at `engine/src/stream.rs:2492-2533`? That section lies inside the budgeted interval for this exit.
5. Where can a test that forces this exit live and read the event? The trace is one global slot (`engine/src/trace.rs:90-98`). slice.rs's binary is unserialised with other cancelling tests (`PLAN.yaml:4316`). The round 53 re-run practice binds that binary's assertion (`state/directives/2026-10-04-round-53-open-1-ruling.md:6-7`).

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` (whole)
- `engine/README.md` (495-529)
- `kernel/README.md` (322-385)
- `PLAN.yaml` (grep hits; 4069-4074, 4315-4321, 4495-4511, 4802-4818)
- `state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md` (whole)
- `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md` (30-41)
- `state/directives/2026-10-04-round-53-open-1-ruling.md` (whole)
- `state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md` (whole)
- `state/consults/FLAKE-HUNT-RUN-1-2026-10-10.md` (whole)
- `state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md` (whole), `experiment-C-final-state.diff` (whole); other evidence files listed by Glob, not opened
- `engine/src/stream.rs` (640-699, 860-909, 1225-1399, 1750-1999, 2000-2139, 2440-2589, 3190-3249; grep hits)
- `engine/src/cancel.rs` (80-159)
- `engine/src/trace.rs` (80-109, 340-474, 530-569, 715-754; grep hits)
- `engine/tests/slice.rs` (715-849, 976-983; grep hits)
- `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` (1-45)
- `engine/ADMISSION-PREREGISTRATION.md` (900-994; headings)
- `kernel/tests/trace_spans.rs` (300-369; grep hits)
- `kernel/tests/skp_admission.rs` (750-939; grep hits)
- `kernel/tests/skp_filter_cancellation.rs` (95-283)
- `kernel/tests/first_batch_factorial.rs` (1290-1504; grep hits)
- `kernel/src/lib.rs` (605-624, 690-759)
- `kernel/CANCELLATION-AND-TRACING.md` (whole)
- `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md` (whole)
- `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md` (30-59, 105-116; grep hits)
- `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md` (170-181, 238-251; grep hits)
- `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` (178-192; grep hits)
- `frontends/shell/CANCELLATION-FACTS.md` (20-69)
- `docs/08_Testing.md` (1-12)
- `docs/adr/ADR-018-what-cancellation-acknowledged-means.md` (1-137)
- `docs/adr/ADR-012-data-plane-transport.md` (grep hits: 3, 130)
- `KNOWN-LIMITATIONS.md` (grep hits only)
- Grep only: `engine/tests/connection_reuse.rs:258`, `kernel/tests/end_to_end.rs:428`, `kernel/tests/concurrency_in_situ.rs:362`, `kernel/RESULTS.md:3253`, `kernel/RESULTS.md:3569`, `kernel/src/publish/mod.rs` (trace marks)
