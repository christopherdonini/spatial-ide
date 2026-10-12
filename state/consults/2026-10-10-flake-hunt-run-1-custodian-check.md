# The flake hunt's run 1 — the custodian's check at a7935e18

The custodian checked the human's flake-hunt report against main. The report and its evidence were copied byte-identical from the human's advisory folder:
- `state/consults/FLAKE-HUNT-RUN-1-2026-10-10.md`: sha256 1e846a836b778706e9a141ab6ac91b9006940890636b30a7424bfe542a20c205, the human's.
- `state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/`: the thirteen files its SHA256SUMS lists, each matching (`sha256sum -c` exits 0). The folder holds fourteen files: those thirteen and SHA256SUMS itself. The four `.log` files fall under the repository's `*.log` ignore rule and were added by force.

The report ran at 116deb53293bb62ebbaa49ee795e3b1f0093745d. Main's head when this was filed is a7935e18cd6faebe486debbbec9049cdbfade36c. `engine/`, `kernel/` and `docs/08_Testing.md` do not change between the two, so every cite below is read at main's head with `git show`, and the filing script asserts each cited line's content there.

**The code reading holds.** The human's instructions (`state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md`) are answered at the end.

## The flush exit — holds

- **The function:** engine/src/stream.rs:2456 is `fn flush(`.
- **The exit:** its cancel check (engine/src/stream.rs:2540) counts the batch in `batches_after_cancel` (engine/src/stream.rs:2543) and returns `Cancelled` (engine/src/stream.rs:2544).
- **No mark:** the script asserts `PRODUCER_CANCELLED` appears nowhere in `flush`, from its first line to its last.

## The five other exits — hold

After execute, `produce` returns `Cancelled` at five sites that mark the event first:
- engine/src/stream.rs:1830, the execute guard's `Cancelled` arm, returning at engine/src/stream.rs:1831;
- engine/src/stream.rs:1839, an execute error under a cancel, returning through `classify` at engine/src/stream.rs:1841;
- engine/src/stream.rs:1886, the chunk-loop check, returning at engine/src/stream.rs:1887;
- engine/src/stream.rs:1919, an interrupted fetch's panic under a cancel, returning through `classify` at engine/src/stream.rs:1921;
- engine/src/stream.rs:1986, the per-row check, returning at engine/src/stream.rs:1987.

The script enumerates every line of `produce` and `flush` that returns `Cancelled` or calls `classify`, and every `PRODUCER_CANCELLED` mark in them; the lists are exactly these, plus the three below.

## For the form: three more unmarked returns, and one window

The report counts the exits after the first batch. These also return `Cancelled` without the mark (read from code, not observed):
- **Before anything runs:** the pre-prepare check (engine/src/stream.rs:1781), and a prepare error under a cancel, through `classify` (engine/src/stream.rs:1786).
- **In `flush` itself:** a send to a receiver that is gone (engine/src/stream.rs:2570).
  - The receiver goes with the stream. The stream's drop cancels without stamping a request (engine/src/stream.rs:893; engine/src/cancel.rs:113).
  - So a caller that cancels and then drops the stream while the producer waits in that send would leave a trace with the request and no observation.
- **The window:** the two `classify` exits that mark (engine/src/stream.rs:1839 and engine/src/stream.rs:1919) read the token twice, once for the mark and once inside `classify` (engine/src/stream.rs:2573). A cancel landing between the two reads returns `Cancelled` unmarked.

The form says whether each is a cancellation observation in docs/08's sense, and whether it is in scope.

## The failing test and the budget — hold

- **The test:** engine/tests/slice.rs:756. It cancels at engine/tests/slice.rs:791 and panics at engine/tests/slice.rs:809 when the event is absent. That is before its budget assertion (engine/tests/slice.rs:816).
- **The budget:** docs/08_Testing.md:8 scores cancellation on `cancel_requested → cancel_observed` on the producer's clock (ADR-018).
- **The end instant:** engine/src/trace.rs:383 maps `cancel_observed` to `PRODUCER_CANCELLED` on the producer side (engine/src/trace.rs:441).
- **What this means:** a cancellation the producer observes at the flush exit leaves the budgeted interval with no end.

## The evidence — read

- **The two unpatched failures** both panic at the test's line 809, column 50: line 802 of `twocore-07.log` and line 30 of `slicebin-alone-2core-06.log`. Neither carried diagnostics. Their path is inferred from the message and line, as the report says.
- **The run tables:**
  - `runs.tsv`: 8 ordinary runs, none failed; 7 two-core runs, one failed (twocore 07).
  - `slicebin.tsv`: 8 all-core runs, none failed; 7 two-core runs, one failed (alone-2core 06).
- **The experiment** (`exp.tsv`, 20 runs per phase): A failed 0, B failed 15, C failed 0.
  - All fifteen B failures print `dropped=0 batches_generated=2 batches_after_cancel=1`.
  - B's panic is the patched file's line 822, the same `expect` moved down by the thirteen diagnostic lines the diff adds.
- **A limit the report does not state.** Eleven of the fifteen print `events=10`. Four print `events=11`: runs 03, 09, 10 and 13.
  - The table does not name the extra event. The one failing log kept, `exp-B-01.log`, is an `events=10` run, and its ten names are ten different names this stream's own path stamps, once each.
  - So the evidence shows that no failure lost an event to a full buffer, and that the event missing is `producer_cancelled`. It does not show whether another test's event entered the trace in those four.

## The four kernel tests — present, as the report says

These four are the only test files besides engine/tests/slice.rs that name the event (`git grep` at main's head):
- **trace_spans:** kernel/tests/trace_spans.rs:356 asserts the event is absent on a run that completed (kernel/tests/trace_spans.rs:328).
- **first_batch_factorial:** kernel/tests/first_batch_factorial.rs:1355 and kernel/tests/first_batch_factorial.rs:1489 read the requested-to-observed segment. They are in the two ignored measurement passes (kernel/tests/first_batch_factorial.rs:1300, kernel/tests/first_batch_factorial.rs:1434).
- **skp_admission:** kernel/tests/skp_admission.rs:923 expects the event (the test at kernel/tests/skp_admission.rs:780).
- **skp_filter_cancellation:** kernel/tests/skp_filter_cancellation.rs:266 expects the event (the test at kernel/tests/skp_filter_cancellation.rs:123).

Whether any can hit the gap is the form's to say, per item 1. The custodian did not decide it.

## The PLAN node the report names — as it says

`slice-traced-test-cross-stamping` is proposed. Its summary says the test was not observed failing, and its mechanism is cross-test stamping into a live trace.

## The human's instructions

1. **Appended:** `stream-flush-cancel-exit-marks-producer-cancelled`, engine lane, graded S2.
   - The piece: the flush exit marks the event, with a test that forces that exit.
   - Lead-data's impact read comes first, then its own full form, which answers the four kernel tests.
   - The node points to this record's list of the other unmarked returns.
   - Budget 240 minutes, the custodian's estimate for the impact read, a full form, the code and both gates.
2. **Placed:** in slot 2, blocked behind `known-limitations-item-8-filter-not-published`. `ported-code-notice-route` now depends on it as well.
3. **Noted:** `slice-traced-test-cross-stamping` stays proposed, with the human's note in the human's words and a pointer to this record.
