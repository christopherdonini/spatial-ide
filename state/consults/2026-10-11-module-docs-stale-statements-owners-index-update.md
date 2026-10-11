# Owner's-index update — module-docs-stale-statements (lead-data, second pilot)
Read at: cut/module-docs-stale-statements 117d8d5c2b102f6dea1c2fe5eb01832a44148604

Task: the owner's-index update (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md §1 item 2), for the docs lane's piece d, whose form is kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md (§2.4; Amendment 1 applies and changes nothing in §2.4).

How the branch head was established: the worktree's .git file (C:/dev/wt/mdocs/.git) points to the main checkout's worktree record mdocs, whose HEAD names refs/heads/cut/module-docs-stale-statements, and that loose ref holds 117d8d5c2b102f6dea1c2fe5eb01832a44148604. I have no git or shell tool, so the worktree's clean state is taken from the brief; every branch file below was read from C:/dev/wt/mdocs. Line numbers are given in words (line N @ 117d8d5c) because these lines sit at different numbers on main.

Apply each change by exact replacement of the whole line, without its line terminator. If an old line does not match byte for byte, the replacement is not made. No line is inserted and none is deleted.

## 1. kernel/README.md, Owner's index: one line changes

### 1.1 Governed by, preregistrations in this module: this form

The form exists on the branch at kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md @ 117d8d5c. The list is not in alphabetical order (GENERATION-CLOSE-RACES comes before CATALOG-OPEN-REPLACE-DROP-NOTE, and TICKET-DROP-FOLLOWUPS before B2-1A-STEP-RECORD-AND-DATASET-REFERENCE); entries are appended at its end. The new entry therefore goes last, after the FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP entry, which is the current last entry. It carries no section qualifier: the form is filed in this module.

Old line, kernel/README.md line 380 @ 117d8d5c:

```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`, `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`
```

New line:

```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`, `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`, `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md`
```

### 1.2 Stream tickets and Close ordering (row DK): already applied, and they match the code. No change.

Row DK (form §2.1, the Node 9 §3 item) moves the pin `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` from Close ordering to Stream tickets, because the test calls only `StreamRegistry::cancel`. At 117d8d5c:

- Stream tickets is kernel/README.md line 357 @ 117d8d5c. It names `spatial_kernel::skp::StreamRegistry` and `spatial_kernel::EngineSourceFactory::ticket_only`, and its last pin is `kernel/src/skp.rs::ticket_drop_under_lock_regression::cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`.
- Close ordering is kernel/README.md line 362 @ 117d8d5c. It names `spatial_kernel::skp::SkpHost::close_dataset` and pins only `the_close_race_mints_no_generation_so_no_unheld_reference_exists` and `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch`. The moved pin is gone from it. (On main the same line still carries it as a third pin, which is the stale state DK fixes.)

Checked against the code at 117d8d5c:

- The moved test is kernel/src/skp.rs line 3590 @ 117d8d5c, inside `mod ticket_drop_under_lock_regression` (lines 3399 to 5018). Its only call on the system under test is `tickets.cancel(&h)` (line 3597), where `tickets` is the `Arc<StreamRegistry>` returned by `seeded_pending_ticket` (line 3539). That is `StreamRegistry::cancel` (line 320). It does not call `close_dataset`. It belongs under Stream tickets.
- The other Stream tickets pins resolve: `a_ticket_redeems_exactly_once` at line 2458, inside `mod tests` (lines 2374 to 3346); the two unwind tests at lines 3972 and 4012, inside `mod ticket_drop_under_lock_regression`; `a_raw_stream_params_start_is_refused_in_ticket_only_mode` at kernel/tests/skp_admission.rs line 214. `StreamRegistry` is declared at kernel/src/skp.rs line 151; `ticket_only` is at kernel/src/lib.rs line 362, inside `impl EngineSourceFactory` (line 327).
- The two Close ordering pins resolve inside `mod ticket_drop_under_lock_regression`: line 4596 (it calls `close(&host, ...)` between resolve and mint) and line 4962 (it calls `host.close_dataset(...)` twice). `SkpHost::close_dataset` is at kernel/src/skp.rs line 1570.
- SKP-V0 §1 (with its `viewport_query` and `cancel` subsections) and §3 (Handles and scalar codecs) exist at protocol/skp/SKP-V0.md lines 13, 99, 113 and 162 @ 117d8d5c.

No corrected lines are owed for row DK.

### 1.3 Last verified at: not touched

kernel/README.md line 354 @ 117d8d5c (d5863945) stays as it is. I did not re-check every pointer in the kernel section at 117d8d5c; I checked only the pointers named in 1.1 and 1.2 and in section 3.

## 2. engine/README.md, Owner's index: one line changes

### 2.1 Governed by, engine halves of pieces filed elsewhere: this form

The form is filed in kernel/, and its rows D1, D2, D4 to D8, DE5 and the engine sites of §2.5 (in scope by Amendment 1 item 3) edit engine files, so it has an engine half. The list is not in alphabetical order (SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE comes before FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP); entries are appended at its end. The new entry therefore goes last. It carries no section qualifier, as the FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP entry carries none; the form has no single section that holds its engine half.

Old line, engine/README.md line 549 @ 117d8d5c:

```text
  - engine halves of pieces filed elsewhere: `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` (§2, Part B), `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`
```

New line:

```text
  - engine halves of pieces filed elsewhere: `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` (§2, Part B), `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`, `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md`
```

### 2.2 Last verified at: not touched

engine/README.md line 527 @ 117d8d5c (fb95bec0) stays as it is. I did not re-check every pointer in the engine section at 117d8d5c.

## 3. Other index lines the diff could have made stale: none found

- The one renamed test (form §4) is not pinned in either index: the old name `an_absent_crs_key_is_not_silently_ogc_crs84` appears nowhere under engine/ or kernel/ at 117d8d5c except in the form; the new name is at engine/src/geoparquet.rs line 871 @ 117d8d5c.
- kernel/CANCELLATION-AND-TRACING.md gains an appended §9 (line 258 @ 117d8d5c). The two index pointers into it, §5 (kernel index) and §7 (engine index), still sit at lines 144 and 178 with their own headings.
- kernel/PERMISSION-BOUNDARY.md gains an appended note; the kernel index points to the file as a whole, which still resolves.

## 4. The 60-line cap, after the update

Both sections stay within the cap; the update replaces two lines and adds none. Counts run from the section heading to the section's last line, both included.

- kernel/README.md: 42 lines, line 350 to line 391 @ 117d8d5c (the file's last line).
- engine/README.md: 36 lines, line 523 to line 558 @ 117d8d5c (the file's last line).

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md (main checkout): whole file
- state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md (main checkout): whole file, for the format
- kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md @ 117d8d5c: whole file
- kernel/README.md @ 117d8d5c: whole file
- engine/README.md @ 117d8d5c: whole file
- kernel/README.md (main checkout): a grep for the Stream tickets and Close ordering lines only
- kernel/src/skp.rs @ 117d8d5c: 3580-3639, 4560-4639, 4930-5017; greps for the pinned fns, module boundaries, `StreamRegistry`, `cancel`, `close_dataset`, `seeded_pending_ticket`
- kernel/src/lib.rs @ 117d8d5c: greps for `ticket_only` and the `EngineSourceFactory` impls
- kernel/tests/skp_admission.rs @ 117d8d5c: a grep for the pinned fn
- protocol/skp/SKP-V0.md, kernel/CANCELLATION-AND-TRACING.md @ 117d8d5c: heading greps
- engine/ and kernel/ @ 117d8d5c: a grep for the renamed test's old and new names
- kernel/*PREREGISTRATION*.md @ 117d8d5c: existence, by glob
- the worktree's .git file, the worktree record's HEAD, and the branch ref (git metadata): one line each
