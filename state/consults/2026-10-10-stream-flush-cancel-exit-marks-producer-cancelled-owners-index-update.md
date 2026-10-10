# Owner's-index update — stream-flush-cancel-exit-marks-producer-cancelled (lead-data, second pilot, resumed)
Read at: cut/stream-flush-cancel-exit-marks-producer-cancelled 0a3d6de4

Pointers only, under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 2 and the index rules in the section's own header line (`engine/README.md:497`, read at 0a3d6de4). No design, recommendation, answer or approval. Everything not in a fenced old-line block or marked as byte-copied is my paraphrase.

How the branch was read: the branch ref resolves to 0a3d6de433828efab94d94b1ba65d7763ddc5186, and the worktree's HEAD names that branch. I have no shell, so the worktree's cleanliness is taken from the brief and from the worker report's final state (`state/consults/2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-worker-report-1.md:141-142`). The diff touches only `engine/src/stream.rs` and `engine/src/trace.rs`, so `engine/README.md` and `kernel/README.md` on the branch are as at the merge base 82ceae7f.

Test names were confirmed from the branch's code, not the report:
- T-1 `flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`, at `engine/src/stream.rs:2954` (read at 0a3d6de4), inside `mod tests`, which opens at `engine/src/stream.rs:2640-2641` (read at 0a3d6de4).
- T-2 `the_pre_prepare_cancel_exit_stamps_producer_cancelled`, at `engine/src/stream.rs:3021` (read at 0a3d6de4), in the same module.
- The marks they pin are C2 at `engine/src/stream.rs:1781` and C1 at `engine/src/stream.rs:2544` (read at 0a3d6de4).
- The event is `pub const PRODUCER_CANCELLED` at `engine/src/trace.rs:441`. It is the producer side's `cancel_observed` in the instants table at `engine/src/trace.rs:380-384` (both read at 0a3d6de4).
- `TEST_LOCK` is now `#[cfg(test)] pub(crate) static` at module level, `engine/src/trace.rs:559-560` (read at 0a3d6de4). It is not an interface, so the index does not name it.

## 1. Changes to `engine/README.md`'s Owner's index

Each change replaces one whole line with one whole line. No line is added or removed.

### 1.1 Last verified at (`engine/README.md:499`, read at 0a3d6de4)

Old line, byte-copied:

```text
- **Last verified at:** b47d96d2 (every pointer checked at that commit)
```

New line:

```text
- **Last verified at:** 0a3d6de4 (every pointer checked at that commit)
```

I checked every pointer in the section at 0a3d6de4. All of them resolve (see §2).

### 1.2 The `spatial_engine::trace` entry (`engine/README.md:513`, read at 0a3d6de4)

Old line, byte-copied:

```text
  - Producer trace, instrument surface never on the wire → ADR-004 Amendment 4; `spatial_engine::trace` (`start`, `TraceGuard`, `TraceKey`, `mark`, `is_enabled`); its one-traced-stream limit at `CURRENT` (`engine/src/trace.rs`) and `kernel/CANCELLATION-AND-TRACING.md` §7 · pinned by `engine/src/trace.rs::tests::a_disabled_mark_records_nothing_and_a_started_trace_records_in_order`, `engine/src/trace.rs::tests::a_second_trace_is_refused_rather_than_replacing_the_first`
```

New line:

```text
  - Producer trace, instrument surface never on the wire → ADR-004 Amendment 4; `spatial_engine::trace` (`start`, `TraceGuard`, `TraceKey`, `mark`, `is_enabled`); its one-traced-stream limit at `CURRENT` (`engine/src/trace.rs`) and `kernel/CANCELLATION-AND-TRACING.md` §7; `spatial_engine::trace::PRODUCER_CANCELLED`, ADR-018's producer-side `cancel_observed` · pinned by `engine/src/trace.rs::tests::a_disabled_mark_records_nothing_and_a_started_trace_records_in_order`, `engine/src/trace.rs::tests::a_second_trace_is_refused_rather_than_replacing_the_first`, `engine/src/stream.rs::tests::flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`, `engine/src/stream.rs::tests::the_pre_prepare_cancel_exit_stamps_producer_cancelled`
```

### 1.3 Governed by, preregistrations in this module (`engine/README.md:519`, read at 0a3d6de4)

The form goes in alphabetical order, between `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a) and `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`.

Old line, byte-copied:

```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

New line:

```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`, `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

At 0a3d6de4, a Glob of `engine/*-PREREGISTRATION.md` lists exactly these 19 files, and no others.

## 2. Pointer check at 0a3d6de4 (for 1.1)

Every pointer in `engine/README.md:495-529` (read at 0a3d6de4) was checked against the branch's tree, with the section as updated above. **Pointers that do not resolve: none.**

- **Test pins (44, including T-1 and T-2):** each `fn` was found by name in the file the index names. The pins at `src/` paths sit inside their file's `#[cfg(test)] mod tests`:
  - `engine/src/stream.rs`, module at 2640-2641;
  - `engine/src/trace.rs`, module at 562-563;
  - `engine/src/cancel.rs`, module at 280-281;
  - `engine/src/pin.rs`, module at 136-137.
  - The two kernel pins are in `kernel/tests/typed_terminal_codes.rs` and `kernel/tests/end_to_end.rs`.
- **Symbols:**
  - The root re-exports are at `engine/src/lib.rs:120-157`, and the public modules (including `crs`, `crs_catalog`, `identity`, `rowgroup`, `trace` and `watch`) are at `engine/src/lib.rs:86-118`. `fixture` and `layout` are behind the `fixture` feature (`engine/src/lib.rs:95-105`).
  - The `Dataset` methods: `open_cancellable`, `check_source_unchanged`, `pin_content`, `build_index`, `geometry_encoding`, `declared_geometry_types` and `covering` are in `engine/src/dataset.rs`. `stream_with_cancel`, `stream_for_publish`, `admit_projection`, `stream_projected_with_cancel` and `stream_indexed_experimental` are in `impl Dataset` in `engine/src/stream.rs` (block from 897).
  - `AdmittedPredicate::admit` is at `engine/src/predicate.rs:113`, in the `impl AdmittedPredicate` block from line 93.
  - `descriptor::SourceObservation` is at `engine/src/descriptor.rs:353`.
  - `lod::build_tiers` is at `engine/src/lod.rs:1006`.
  - `trace::{start, mark, is_enabled, TraceKey, TraceGuard}` are at `engine/src/trace.rs:329, 302, 320, 120, 343`. `CURRENT` is at `engine/src/trace.rs:98`.
  - `spatial_kernel::skp::error_of` is at `kernel/src/skp.rs:2041`, with `pub mod skp` at `kernel/src/lib.rs:67`.
- **Ceilings:** all 34 constants in the section were found as `const` in the files the section names. `WATCH_BUFFER_BYTES` is `pub(crate)` (`engine/src/watch.rs:73`).
- **Files and sections:**
  - The files exist: `engine/src/crs-catalog.json`, `engine/examples/make-fixture.rs` and `protocol/skp/SKP-V0.md`, whose §1 (with `open_dataset` and `describe`), §5, §7 and §9 headings are present.
  - `kernel/CANCELLATION-AND-TRACING.md` §7 is present.
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a is present.
  - In `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, §2 is present and Part B sits within it (line 113).
  - The three kernel measurement-pass forms are present, and so is ADR-004's Amendment 4 heading.
- **Consumed from other modules: none.** The only path dependency in `engine/Cargo.toml` is the crate itself (`engine/Cargo.toml:82`).
- **ADRs:** every ADR in the accepted list has an Accepted Status line. ADR-023 and ADR-036 have Proposed Status lines.
- **KNOWN-LIMITATIONS:** items 2, 3, 9, 11, 19, 20, 22 to 27, 31 and 33 all exist in `KNOWN-LIMITATIONS.md`. I checked only that each item exists, not what it says.

## 3. Other lines and `kernel/README.md`

- **Other lines in `engine/README.md`'s section that the diff makes stale: none.**
  - The diff adds no public item, constant, dependency, ADR or KNOWN-LIMITATIONS item.
  - It does not move or rename any other test the section pins.
  - The section cites no line numbers, so the inserted lines shift nothing it points to.
- **`kernel/README.md`'s section (`kernel/README.md:346-386`, read at 0a3d6de4): no change.**
  - The diff touches no kernel file.
  - `kernel/src` does not name `PRODUCER_CANCELLED` or `TEST_LOCK` (Grep at 0a3d6de4), so the section's consumed list for `spatial_engine::trace` (`kernel/README.md:369`) is unaffected.
  - Its Last verified at line is not part of this update.

## 4. The 60-line cap

The section runs from `engine/README.md:495` (heading) to `engine/README.md:529` (last line), which is 35 lines at 0a3d6de4. The update replaces three lines in place, so it is still 35 lines afterwards, under the cap of 60.

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` (whole)
- `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`, main checkout (whole, including Amendment 1)
- `state/consults/2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-impact-read.md` (whole)
- `state/consults/2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-worker-report-1.md` (whole)
- At 0a3d6de4 (the worktree, whose HEAD names the branch; the branch ref is 0a3d6de433828efab94d94b1ba65d7763ddc5186):
  - `engine/README.md` (490-530; heading grep)
  - `kernel/README.md` (346-387; heading grep)
  - `engine/src/stream.rs` (1774-1789, 2530-2554, 2935-3069; grep hits for `PRODUCER_CANCELLED`, `TEST_LOCK`, `mod tests`, `impl`, test-name and `pub fn` patterns, constants)
  - `engine/src/trace.rs` (374-445, 548-567; grep hits for `PRODUCER_CANCELLED`, `TEST_LOCK`, `pub fn`, `pub struct`, constants)
  - `engine/src/lib.rs` (84-158; grep of `pub` lines)
  - Grep hits only: `engine/src/cancel.rs`, `engine/src/pin.rs`, `engine/src/dataset.rs`, `engine/src/predicate.rs`, `engine/src/descriptor.rs`, `engine/src/lod.rs`, `engine/src/attributes.rs`, `engine/src/crs.rs`, `engine/src/geoparquet.rs`, `engine/src/index.rs`, `engine/src/rowgroup.rs`, `engine/src/pool.rs`, `engine/src/watch.rs`, `engine/src/envelope.rs`, `kernel/src/skp.rs`, `kernel/src/lib.rs`, every `engine/tests/*.rs` and `kernel/tests/*.rs` file named by the section's pins, `kernel/src` (for `PRODUCER_CANCELLED|TEST_LOCK`), `engine/Cargo.toml` (`path =`)
  - Headings or grep only: `protocol/skp/SKP-V0.md`, `kernel/CANCELLATION-AND-TRACING.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md` (Amendment 4 heading), the Status lines of ADR-004, -005, -006, -007, -010, -013, -015, -016, -017, -018, -021, -023, -026, -032, -033, -034, -035 and -036, and `KNOWN-LIMITATIONS.md` (item lines)
  - Globs: `engine/*-PREREGISTRATION.md`, `docs/adr/ADR-0*.md`, and the existence of `engine/src/crs-catalog.json`, `engine/examples/make-fixture.rs`, `engine/Cargo.toml`, `protocol/skp/SKP-V0.md`, `kernel/CANCELLATION-AND-TRACING.md`, `KNOWN-LIMITATIONS.md`, `kernel/PROBE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md` and `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`
