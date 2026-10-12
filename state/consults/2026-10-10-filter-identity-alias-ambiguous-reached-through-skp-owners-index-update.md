# Owner's-index update — filter-identity-alias-ambiguous-reached-through-skp (lead-data, second pilot, resumed)
Read at: cut/filter-identity-alias-ambiguous-reached-through-skp d5863945

Pointers only, under the second pilot's §1 item 2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12) and the form's §9 bullet on the owner's-index update (kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md:272-281, read in the main checkout). There is no design, recommendation, answer or approval below. Every path:line into a branch file is marked as read at d5863945.

**Where this was read.** In the worktree checked out on the branch. The branch ref resolves to d586394581825b4c7d8653612b469ebec9c80e22 (the ref file and its reflog: 34d14658, then caf131fd, then 2f42e0ab, then d5863945). The worktree's HEAD names that branch. I have no shell, so its clean state is as the brief states it; I did not run `git status`.

**T-1's name, from the branch's code:** `a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`, at `kernel/tests/skp_admission_remediation.rs` (`:274` at d5863945), an `async fn` under `#[tokio::test(flavor = "multi_thread")]` at :273. It matches the worker report's name. Both corrected texts cite it: engine/src/predicate.rs:1114 and protocol/skp/SKP-V0.md:490 (both read at d5863945).

## 1. kernel/README.md, Owner's index

Three lines change by exact replacement. No line is added or removed.

**1a. Last verified at** (kernel/README.md:350, read at d5863945). Every pointer was checked (section 3), so it moves to d5863945.

Old line, byte-copied from kernel/README.md:350 (read at d5863945):
```text
- **Last verified at:** b47d96d2 (every pointer checked at that commit)
```
New line:
```text
- **Last verified at:** d5863945 (every pointer checked at that commit)
```

**1b. Interfaces this module owns, wire error codes** (kernel/README.md:359, read at d5863945). T-1 joins its pins.

Old line, byte-copied from kernel/README.md:359 (read at d5863945):
```text
  - Wire error codes → SKP-V0 §5, §7.5, §9.5; `spatial_kernel::skp::error_of`, `spatial_kernel::skp::filter_error_of`, `spatial_kernel::skp::terminal_detail_of` · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`, `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint`, `kernel/tests/skp_admission.rs::a_filtered_viewport_query_comparing_text_with_a_number_refuses_synchronously_typed_and_mints_no_ticket`
```
New line:
```text
  - Wire error codes → SKP-V0 §5, §7.5, §9.5; `spatial_kernel::skp::error_of`, `spatial_kernel::skp::filter_error_of`, `spatial_kernel::skp::terminal_detail_of` · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`, `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint`, `kernel/tests/skp_admission.rs::a_filtered_viewport_query_comparing_text_with_a_number_refuses_synchronously_typed_and_mints_no_ticket`, `kernel/tests/skp_admission_remediation.rs::a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`
```

**1c. Governed by, preregistrations in this module** (kernel/README.md:376, read at d5863945). This piece's form joins the list at its end. It exists at kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md (glob at d5863945). It was the only `kernel/*-PREREGISTRATION.md` file found in neither this line nor the measurement-passes line (kernel/README.md:377).

Old line, byte-copied from kernel/README.md:376 (read at d5863945):
```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`
```
New line:
```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`, `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`
```

## 2. engine/README.md, Owner's index

Three lines change by exact replacement. No line is added or removed.

**2a. Last verified at** (engine/README.md:499, read at d5863945). Every pointer was checked (section 3), so it moves to d5863945.

Old line, byte-copied from engine/README.md:499 (read at d5863945):
```text
- **Last verified at:** 0a3d6de4 (every pointer checked at that commit)
```
New line:
```text
- **Last verified at:** d5863945 (every pointer checked at that commit)
```

**2b. Interfaces this module owns, filter admission** (engine/README.md:504, read at d5863945). T-1 joins its pins.

Old line, byte-copied from engine/README.md:504 (read at d5863945):
```text
  - Filter admission → `spatial_engine::AdmittedPredicate::admit`, `spatial_engine::FilterError`, `spatial_engine::PredicateAdmitError`, `spatial_engine::TypeRefusalReason`; on the wire through SKP-V0 §7 · pinned by `engine/tests/predicate_admission.rs::the_adversarial_corpus_each_row_refused_with_its_specific_code`, `engine/tests/filter_type_admission.rs::each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`
```
New line:
```text
  - Filter admission → `spatial_engine::AdmittedPredicate::admit`, `spatial_engine::FilterError`, `spatial_engine::PredicateAdmitError`, `spatial_engine::TypeRefusalReason`; on the wire through SKP-V0 §7 · pinned by `engine/tests/predicate_admission.rs::the_adversarial_corpus_each_row_refused_with_its_specific_code`, `engine/tests/filter_type_admission.rs::each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`, `kernel/tests/skp_admission_remediation.rs::a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`
```

**2c. Governed by, engine halves of pieces filed elsewhere** (engine/README.md:521, read at d5863945). This piece's form joins the list. It names the form only, with no section qualifier, as the form's §9 bullet does (kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md:279, main checkout).

Old line, byte-copied from engine/README.md:521 (read at d5863945):
```text
  - engine halves of pieces filed elsewhere: `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` (§2, Part B)
```
New line:
```text
  - engine halves of pieces filed elsewhere: `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` (§2, Part B), `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`
```

## 3. The Last-verified check at d5863945

Every pointer in both sections was checked in the branch's tree, read at d5863945, with the updated lines' new pointers included. **Every pointer resolves, and none is unresolved.**

What I checked, by kind:
- **Test pins** (48 in the kernel section with T-1, 45 in the engine section with T-1): each `fn` exists in its named file. For each `src` unit test, it also sits inside its named module:
  - kernel/src/skp.rs: `mod tests` at :2374 and `mod ticket_drop_under_lock_regression` at :3399;
  - kernel/src/lib.rs: `mod cancel_notice_tests` at :756;
  - kernel/src/params.rs: `mod tests` at :128;
  - engine/src/stream.rs: `mod tests` at :2641, all three pinned fns ahead of `mod filter_composition` at :3481;
  - engine/src/trace.rs: `mod tests` at :563;
  - engine/src/pin.rs: `mod tests` at :137;
  - engine/src/cancel.rs: `mod tests` at :281.
  All of these lines are read at d5863945.
- **Symbols:** each named type, fn, module or constant exists at its named path, directly or by re-export. The `crate::` re-exports are in kernel/src/lib.rs:69, kernel/src/publish/mod.rs:82, engine/src/lib.rs:120-157, protocol/data-plane/src/lib.rs:50-58, protocol/skp/src/v0/mod.rs:12-16 and renderer/src/lib.rs:50-51, all read at d5863945. The method pointers sit on the named impl blocks: `impl SkpHost` at kernel/src/skp.rs:1053, `impl SessionInvalidator` at :867, `impl Dataset` at engine/src/stream.rs:897 (all read at d5863945). The crate-private `EngineCancel` and `CancelNotice` are in kernel/src/lib.rs:706 and :712 (read at d5863945).
- **Ceilings:** each constant is in its named file. Note one fact, not a defect: `WATCH_BUFFER_BYTES` is `pub(crate)` at engine/src/watch.rs:73 (read at d5863945), and the index names its file only.
- **Files:** every named preregistration, design note, binary, example, JSON and Cargo file exists (glob at d5863945). Both preregistration lists are complete against `kernel/*-PREREGISTRATION.md` and `engine/*-PREREGISTRATION.md`, once 1c is applied.
- **Sections:** these headings exist:
  - SKP-V0 §1 (`viewport_query`, `cancel`), §3, §5, §7, §7.5, §9 and §9.5, plus §8's skp/0.5 entry;
  - kernel/CANCELLATION-AND-TRACING.md §5 and §7;
  - engine/SOURCE-WATCHER-PREREGISTRATION.md §2a and §2b;
  - ADR-004 Amendment 4;
  - kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md §2 and its Part B;
  - kernel/README.md's own *Declared composed ceilings (ADR-010 rule 6)* section, at :52.
- **ADRs:** each ADR listed as accepted has an Accepted status line, and each listed as proposed has a Proposed one, in both sections (the line-3 or line-5 Status of each file, read at d5863945). ADR-018 names `cancel_observed`.
- **KNOWN-LIMITATIONS:** each listed item number exists in KNOWN-LIMITATIONS.md. Kernel: 5, 6, 8, 12, 16, 21, 28, 30, 32. Engine: 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27, 31, 33.
- **Consumed from other modules:** engine/Cargo.toml's only path dependency is the crate itself (engine/Cargo.toml:82, read at d5863945). The kernel's consumed items resolve in protocol/data-plane, protocol/skp and renderer as listed above.

What resolution here does not cover: whether each limitation or ADR is rightly assigned to its module, and whether the consumed lists are complete. Those are a reading of content, not a pointer check.

## 4. Other lines the diff makes stale

None. The diff adds one kernel test, rewrites one engine doc comment and rewrites §7.5's paragraph. Every SKP-V0 pointer in either section is by section, not by line, and §7.5's heading is unchanged at protocol/skp/SKP-V0.md:465 (read at d5863945). No index line states the code's reachability or names the replaced texts. T-1 adds no consumed item, since its file already used the engine's fixture support and the SKP v0 command types. No ADR, KNOWN-LIMITATIONS item or ceiling changes.

## 5. The 60-line cap, after the update

Both updates replace lines in place, so neither count changes.
- kernel/README.md: the section runs from its heading at :346 to the file's last line at :386, which is 41 lines (37 from the Last verified line).
- engine/README.md: the section runs from its heading at :495 to the file's last line at :529, which is 35 lines (31 from the Last verified line).

Both are under 60.

On main, both sections' headings and Last verified lines sit at the same line numbers (kernel/README.md:346 and :350, engine/README.md:495 and :499, main checkout). I did not compare the rest of the sections against main.

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62 (main checkout)
- kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md: 1-308 (main checkout)
- state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-impact-read.md: 1-133 (main checkout)
- state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-worker-report-1.md: 1-88 (main checkout)
- kernel/README.md: 340-386, plus a heading grep (at d5863945), and a grep for the heading and Last verified lines (main checkout)
- engine/README.md: 490-529, plus a heading grep (at d5863945), and a grep for the heading and Last verified lines (main checkout)
- kernel/tests/skp_admission_remediation.rs: 255-347, plus a fn grep (at d5863945)
- the git ref, reflog and worktree HEAD files for the branch (local repository metadata)
- At d5863945, by grep only:
  - kernel/src/** (pub items, modules, impls, test fns, ceilings.json include) and kernel/tests/** (test fns);
  - engine/src/** (pub items, modules, impls, constants, test fns), engine/src/lib.rs re-exports (87-157), engine/tests/** (test fns) and engine/Cargo.toml (path dependencies);
  - protocol/data-plane/src/lib.rs and transport.rs, protocol/skp/src/v0/mod.rs, error.rs and events.rs, protocol/skp/src/lib.rs, and renderer/src/lib.rs and compiled.rs;
  - the crate names in kernel, engine, renderer, protocol/skp and protocol/data-plane Cargo.toml;
  - protocol/skp/SKP-V0.md (headings, T-1 name) and engine/src/predicate.rs (T-1 name);
  - kernel/CANCELLATION-AND-TRACING.md (headings);
  - engine/SOURCE-WATCHER-PREREGISTRATION.md, docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md and kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md (section headings, Part B);
  - docs/adr/*.md (Status lines), with ADR-018 grepped for `cancel_observed` and `producer`;
  - KNOWN-LIMITATIONS.md (item headings);
  - both READMEs (trailing whitespace and CR: none).
- At d5863945, by glob: the named files and the preregistration and ADR file lists

*Custodian's filing note (2026-10-10): written by lead-data to this path (run 19:49:45Z to 19:55:02Z by its transcript; write audit PASS, one Write, to this path only: Grep 42, Read 11, Glob 5, Write 1, SubagentHandback 1). As written, its sha256 was 92abcdb623f7a30e640d1487fad76c73117125de01b2ad5cb7f90bb5d01eb443. Two changes by the custodian, nothing else: on line 8, the one rooted cite of a line that exists only on the branch (the test file at line 274, at d5863945) is rewritten as a path with the line in code, so that main's cite check does not read it as a line on main; and this note is appended.*
