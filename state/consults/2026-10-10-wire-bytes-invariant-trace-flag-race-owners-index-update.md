# Owner's-index update — wire-bytes-invariant-trace-flag-race (lead-data, second pilot, resumed)
Read at: cut/wire-bytes-invariant-trace-flag-race b47d96d2

Pointers only, under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 2 and the form's §9 bullet "Owner's-index update before the final gate" (`kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`, §9, with Amendment 1). Nothing below is a design, a recommendation or an answer to an open item. Everything not inside a fenced block of byte-copied old lines is my paraphrase. Path:line pointers into the branch's files are read at b47d96d2 (the worktree, clean at that head); pointers into the main checkout say so.

## 0. What the diff changes, from the branch's code

- The diff from d151c2e0 touches only `kernel/tests/wire_bytes_invariant.rs` (the brief; the worker report's §7 counts agree). At b47d96d2 the file adds `TRACE_SERIAL` and `serial()` (`kernel/tests/wire_bytes_invariant.rs:168-187`, read at b47d96d2) and takes the lock as the first statement of each test body (:191 and :398, read at b47d96d2).
- The two test names, confirmed from the code, not from the report:
  - `tracing_changes_no_byte_on_the_wire` (`kernel/tests/wire_bytes_invariant.rs:190`, read at b47d96d2);
  - `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` (`kernel/tests/wire_bytes_invariant.rs:397`, read at b47d96d2).
- The two engine unit tests the form's §9 names, confirmed in `engine/src/trace.rs` (unchanged by the diff), both inside `mod tests` (`engine/src/trace.rs:555`, read at b47d96d2):
  - `a_disabled_mark_records_nothing_and_a_started_trace_records_in_order` (`engine/src/trace.rs:735`, read at b47d96d2);
  - `a_second_trace_is_refused_rather_than_replacing_the_first` (`engine/src/trace.rs:765`, read at b47d96d2).
- The trace items the new lines name, confirmed in `engine/src/trace.rs` at b47d96d2: `TraceKey` (:120), `mark` (:302), `is_enabled` (:320), `start` (:329), `TraceGuard` (:343), `CURRENT` (:98, its doc at :90-97); the module is public at `engine/src/lib.rs:115`.
- The governing texts the new lines name, confirmed at b47d96d2: ADR-004's Amendment 4 heading (`docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:31`); `kernel/CANCELLATION-AND-TRACING.md` §5 (:144) and §7 (:178); the form itself is present on the branch with its Amendment 1 (`kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:255`).

## 1. kernel/README.md, Owner's index (section at `kernel/README.md:346-384`, read at b47d96d2)

Five edits. Each Old block is the whole line, byte-copied from the path:line given; each New block replaces it exactly. For an insertion, Old is the line it goes after and New is that line followed by the new line.

### 1.1 Last verified at (`kernel/README.md:350`, read at b47d96d2)

Old:
```text
- **Last verified at:** be7eecb3 (every pointer checked at that commit)
```
New:
```text
- **Last verified at:** b47d96d2 (every pointer checked at that commit)
```

### 1.2 Interfaces this module owns: the instrument-surface line, after the persisted-artifact line (`kernel/README.md:366`, read at b47d96d2)

Old:
```text
  - No generation or session reference in a persisted artifact → pinned by `kernel/tests/no_generation_in_persisted_artifacts.rs::the_published_bundle_carries_no_session_reference_key_or_value`, `kernel/tests/no_generation_in_persisted_artifacts.rs::a_dataset_reference_carries_no_generation_session_reference_handle_path_or_assertion_attribution`
```
New:
```text
  - No generation or session reference in a persisted artifact → pinned by `kernel/tests/no_generation_in_persisted_artifacts.rs::the_published_bundle_carries_no_session_reference_key_or_value`, `kernel/tests/no_generation_in_persisted_artifacts.rs::a_dataset_reference_carries_no_generation_session_reference_handle_path_or_assertion_attribution`
  - Instrument surface never on the wire → ADR-004 Amendment 4; `kernel/CANCELLATION-AND-TRACING.md` §5 · pinned by `kernel/tests/wire_bytes_invariant.rs::tracing_changes_no_byte_on_the_wire`, `kernel/tests/wire_bytes_invariant.rs::wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`
```

### 1.3 Consumed from other modules: `spatial_engine`'s list gains `trace` (`kernel/README.md:368`, read at b47d96d2)

Old:
```text
  - `spatial_engine` (`Dataset`, `BatchStream`, `CancelToken`, `EngineError`, and the admission, projection, filter, watch and source descriptor types, `SourceObservation` among them) ← engine
```
New:
```text
  - `spatial_engine` (`Dataset`, `BatchStream`, `CancelToken`, `EngineError`, `trace` (`start`, `TraceGuard`, `TraceKey`, `is_enabled`, `mark`), and the admission, projection, filter, watch and source descriptor types, `SourceObservation` among them) ← engine
```

Where the kernel consumes them, at b47d96d2: `mark` from `kernel/src/publish/mod.rs` (:718, :727, :782, :997, :1536, :1541, :1571, :1576, :1638); `start`, `TraceKey`, `is_enabled` and the guard from the kernel's tests (for this piece, `kernel/tests/wire_bytes_invariant.rs:42`, :196, :201, :208, :402, :407, :414).

### 1.4 Governed by: this form added to the preregistrations in this module (`kernel/README.md:375`, read at b47d96d2)

Old:
```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`
```
New:
```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`
```

### 1.5 Governed by: the design note, as its own sub-bullet after the last one (`kernel/README.md:377`, read at b47d96d2)

The sub-bullet shape: `design notes:` followed by the path, as the other Governed-by sub-bullets are a label then paths.

Old:
```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```
New:
```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
  - design notes: `kernel/CANCELLATION-AND-TRACING.md`
```

## 2. engine/README.md, Owner's index (section at `engine/README.md:495-528`, read at b47d96d2)

Two edits. Governed by: no change, per the form's §9 bullet.

### 2.1 Last verified at (`engine/README.md:499`, read at b47d96d2)

Old:
```text
- **Last verified at:** be7eecb3 (every pointer checked at that commit)
```
New:
```text
- **Last verified at:** b47d96d2 (every pointer checked at that commit)
```

### 2.2 Interfaces this module owns: the `spatial_engine::trace` entry, after the LOD tier builder line (`engine/README.md:512`, read at b47d96d2)

Old:
```text
  - LOD tier builder → `spatial_engine::lod::build_tiers` · pinned by `engine/tests/lod_tier_preflight.rs::the_preflight_refuses_before_the_first_tier_is_written`, `engine/tests/lod_tier_cancellation.rs::cancel_observed_within_the_declared_ceiling`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_point_feature_by_name_and_writes_no_tier`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_linestring_feature_by_name_and_writes_no_tier`
```
New:
```text
  - LOD tier builder → `spatial_engine::lod::build_tiers` · pinned by `engine/tests/lod_tier_preflight.rs::the_preflight_refuses_before_the_first_tier_is_written`, `engine/tests/lod_tier_cancellation.rs::cancel_observed_within_the_declared_ceiling`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_point_feature_by_name_and_writes_no_tier`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_linestring_feature_by_name_and_writes_no_tier`
  - Producer trace, instrument surface never on the wire → ADR-004 Amendment 4; `spatial_engine::trace` (`start`, `TraceGuard`, `TraceKey`, `mark`, `is_enabled`); its one-traced-stream limit at `CURRENT` (`engine/src/trace.rs`) and `kernel/CANCELLATION-AND-TRACING.md` §7 · pinned by `engine/src/trace.rs::tests::a_disabled_mark_records_nothing_and_a_started_trace_records_in_order`, `engine/src/trace.rs::tests::a_second_trace_is_refused_rather_than_replacing_the_first`
```

## 3. Last verified at: how every pointer was checked at b47d96d2

I set both lines to b47d96d2 because I checked every pointer in both sections, including the new ones, in the worktree at b47d96d2 (clean at that head, per the brief). The check is that each pointer resolves, by search and read, not by running any test:

- every pinned test name in both sections (46 in kernel, 38 in engine), by a function-name search, with the inline-module paths (`skp.rs::tests`, `skp.rs::ticket_drop_under_lock_regression`, `lib.rs::cancel_notice_tests`, `params.rs::tests`, `stream.rs::tests`, `pin.rs::tests`, `cancel.rs::tests`, `trace.rs::tests`) checked against each module's opening line;
- every owned and consumed symbol, by a definition or re-export search in `kernel/src`, `engine/src`, `protocol/skp/src`, `protocol/data-plane/src` and `renderer/src` (`EngineCancel` and `CancelNotice` are crate-private, as the index says; `WATCH_BUFFER_BYTES` is `pub(crate)` in `engine/src/watch.rs`, as the index's file pointer allows);
- every file path (preregistrations, design notes, binaries, examples, `ceilings.json`, `crs-catalog.json`), by glob;
- the section pointers SKP-V0 §1, §3, §5, §7, §7.5, §8 (`skp/0.5` entry), §9, §9.5; SOURCE-WATCHER §2a, §2b; SKP-DRAINED §2 and Part B; CANCELLATION-AND-TRACING §5, §7; ADR-004 Amendment 4; `kernel/README.md`'s *Declared composed ceilings (ADR-010 rule 6)* heading (`kernel/README.md:52`);
- every accepted and proposed ADR number, against its Status line in `docs/adr/`;
- every KNOWN-LIMITATIONS item number, against its numbered entry in `KNOWN-LIMITATIONS.md`;
- every ceiling constant, against its declaring file;
- `engine/Cargo.toml`'s only path dependency is itself (`engine/Cargo.toml:82`), so the engine's "Consumed from other modules: none" line holds.

Pointers that do not resolve: none.

## 4. Other lines the diff makes stale

None. Before this update, no line in either section points at `kernel/tests/wire_bytes_invariant.rs`, and the diff changes no other file.

Not covered by this update, as a fact only: the impact read's second gap also named `kernel/tests/trace_spans.rs` (`state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md:80`, main checkout); the form's §9 bullet names only the two tests of its §0.4 for the kernel's new line, so this update pins only those.

## 5. The 60-line cap, counted after the update

Counted from the section heading to its last line, blank lines included:
- `kernel/README.md`, Owner's index: 39 lines now (346-384, read at b47d96d2), 41 after the update (two lines added: 1.2 and 1.5). Under 60.
- `engine/README.md`, Owner's index: 34 lines now (495-528, read at b47d96d2), 35 after the update (one line added: 2.2). Under 60.

## Files read

At b47d96d2 (worktree):
- `kernel/README.md`: 340-384; heading search (52)
- `engine/README.md`: 490-528
- `kernel/tests/wire_bytes_invariant.rs`: 1-460
- `engine/src/trace.rs`: 1-130, 295-364, 725-779; item search (80-779)
- `engine/src/lib.rs`: `pub mod` / `pub use` search (87-157)
- `kernel/src/`: definition and re-export search (`params.rs`, `skp.rs`, `lib.rs`, `dataset_ref.rs`, `bundle/mod.rs`, `publish/mod.rs`, `publish/ceilings.rs`, `publish/viewer_assets.rs`, `permission/*`); inline-module search in `skp.rs`, `lib.rs`, `params.rs`
- `kernel/`: search for `trace::` across `.rs` files; test-function-name search
- `engine/src/`: definition and ceiling search; `WATCH_BUFFER_BYTES` search; inline-module search in `stream.rs`, `pin.rs`, `cancel.rs`, `trace.rs`
- `engine/`: test-function-name search
- `protocol/skp/src/`, `protocol/data-plane/src/`, `renderer/src/`: definition and re-export search; `protocol/data-plane/src/lib.rs`, `transport.rs` and `renderer/src/lib.rs` `pub use` / `pub mod` search with 2 lines of context
- `protocol/skp/SKP-V0.md`: heading and `skp/0.5` search
- `engine/SOURCE-WATCHER-PREREGISTRATION.md`: heading and §2a/§2b search
- `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`: heading and Part B search
- `kernel/CANCELLATION-AND-TRACING.md`: heading search
- `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`: heading search
- `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md`: heading and Status search
- `docs/adr/`: Status-line search over every ADR
- `KNOWN-LIMITATIONS.md`: numbered-item search (1-370)
- `engine/Cargo.toml`, `kernel/src/publish/ceilings.rs`: path and `ceilings.json` search
- globs: `kernel/*.md`, `engine/*.md`, and the named binaries, examples, JSON files and preregistrations under `kernel/`, `engine/`, `renderer/`, `protocol/` and `frontends/shell/`

In the main checkout (HEAD not checked by me; the session's start snapshot named 6e9b74cf):
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: 1-62
- `state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md`: 1-131
- `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`: 1-262
- `state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-worker-report-1.md`: 1-83
