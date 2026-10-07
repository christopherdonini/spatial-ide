# Owner's-index update — kernel-close-races-followups (lead-data, second pilot, piece 3)
Read at: cut/kernel-close-races-followups 2d75b57b

*Pointers only. Owed under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2, and the 2026-10-03 lead-data clarification, C1. The edits are the three the form names in its §2 subsection on the owner's index (`kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`). Every fenced line below is byte-copied from `kernel/README.md` at 2d75b57b, or is replacement text. The README is unchanged on the branch, so the same lines hold at its base, 99f4c437. Nothing else here is a quotation.*

## 1. Edits to `kernel/README.md`, three lines edited in place

### E1. Last verified at: line 350 (the form's §2, first index bullet)

Current, line 350 at 2d75b57b:

```
- **Last verified at:** 3c29bc67 (every pointer checked at that commit)
```

Replace with:

```
- **Last verified at:** 2d75b57b (every pointer checked at that commit)
```

Section 3 is the basis: every pointer in the section was checked at 2d75b57b.

### E2. Governed by, preregistrations in this module: line 374 (the form's §2, second index bullet)

Current, line 374 at 2d75b57b:

```
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`
```

Replace with (one entry added, directly after the close-races form it follows from):

```
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`
```

With E2, lines 374 and 375 together name each of the 20 `kernel/*-PREREGISTRATION.md` files in the tree at 2d75b57b once.

### E3. Governed by, kernel halves of pieces filed elsewhere: line 376 (the form's §2, third index bullet)

Current, line 376 at 2d75b57b:

```
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```

Replace with (one entry added, directly after the B1 form it follows from):

```
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```

Basis: the B1 form's Amendment 1, item 7, second bullet (line 283 of `engine/B1-FOLLOWUPS-PREREGISTRATION.md`) routes this line to this piece. That form's own body (its line 129) had declared no `kernel/README.md` change.

## 2. Count and cap

- Three lines are modified in place, and none is added or removed. By the form's §7 counting rule (numstat, insertions plus deletions) that is 3 + 3 = **6**, at the ceiling of 6 for `kernel/README.md`.
- No other `kernel/README.md` line changes, which is what §8 item 16 of the form requires.
- The Owner's index section runs from line 346 to line 383, which is 38 lines before and after the update. The cap is 60.

## 3. Pointer check at 2d75b57b (the basis for E1)

The checks were made by reading files in the checkout whose HEAD resolves to `cut/kernel-close-races-followups` = 2d75b57bbe8109278e140c28afbe48e829c9d714.

- **Interfaces, lines 352 to 365.**
  - Every named test was found by its `fn` name in the named file, inside the named module where one is given: 37 pins. Five are in `kernel/src/skp.rs`'s `tests` module and in its `ticket_drop_under_lock_regression` module. One is in `kernel/src/lib.rs`'s `cancel_notice_tests`. One is in `kernel/src/params.rs`'s `tests`. The rest are in `kernel/tests/*.rs`.
  - Every named item was found as declared, in the named crate or file: `SkpHost` and its `open_dataset` and `close_dataset`; `StreamRegistry`; `GenerationRegistry`; `SessionInvalidator::end_generation`; `SessionEndReason`; `session_end_channel`; `error_of`; `filter_error_of`; `terminal_detail_of`; `Catalog`; `EngineSourceFactory` and its `ticket_only`; `StreamParams`; `OPERATION`; the crate-private `EngineCancel` (which implements `SourceCancel`) and `CancelNotice`; `publish::preflight`; `publish::publish_unguarded`; the `bundle` module; `permission::boundary::execute`; the `permission::audit` module; `ViewerAssets`; `reader_ceilings`; `SourceCancel`'s `cancel` and `on_cancel`; the three binaries and the example; and the three preregistration and doc files named.
  - The SKP-V0 sections named are all present as headings: §1, §3, §5, §7.5, §8's `skp/0.5` entry and §9.5. `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b is present.
- **Interfaces against the diff.** The diff's file list and counts come from the worker report's §7 count and the custodian's filing note. I ran no git command (section 6).
  - The diff names no test, `pub` item, module or SKP-V0 section heading.
  - C1's named test is already the first pin on line 358.
  - SKP-V0 §1's `close_dataset` paragraph changed in place, under the §1 heading that line 352 points to. No index row names that sentence.
  - **No Interfaces row moves**, as the form's §2 states.
- **Consumed, lines 366 to 371.**
  - `kernel/Cargo.toml` declares path dependencies on engine, protocol/data-plane, protocol/skp and renderer.
  - Every named item was found in its crate.
  - `kernel/src/publish/ceilings.rs` compiles in `renderer/bundle-viewer/ceilings.json`.
- **Governed by.**
  - Line 373: every ADR it lists has an Accepted Status line.
  - Lines 374 to 376: every named file exists, and E2 and E3 above are the two missing entries.
  - Line 377: ADR-012, ADR-019, ADR-023 and ADR-024 are each Proposed.
- **Declared limits, line 378.** KNOWN-LIMITATIONS items 5, 6, 8, 12, 16, 21, 28, 30 and 32 exist.
- **Ceilings, lines 380 to 383.**
  - Each constant was found in the file named beside it.
  - The section *Declared composed ceilings (ADR-010 rule 6)* is this README's line 52.
- **Encoding.** `kernel/README.md` has no CR and no trailing whitespace.

## 4. `engine/README.md`

**No edit.**
- The branch changes no file under `engine/`.
- The engine index's pointers into kernel or SKP-V0 still resolve at 2d75b57b:
  - `spatial_kernel::skp::error_of` with SKP-V0 §5, and `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`, on line 510;
  - SKP-V0 §1 (`open_dataset`, `describe`), §9 and §7, on lines 501, 503 and 504.
- `engine/B1-FOLLOWUPS-PREREGISTRATION.md` is already on line 518.
- Line 499, the engine index's own Last verified at, is not touched. I did not check every engine pointer.

## 5. Found, not changed

- `engine/GEOMETRY-POINTS-PREREGISTRATION.md` is in the tree at the base, but neither index names it at 2d75b57b. That form names its own edits to `engine/README.md` and `kernel/README.md` for its own pull request (its lines 282 and 288).

**Noticed outside the index (not a pointer):**
- Line 1022 of `protocol/skp/SKP-V0.md` on the branch is in the new dated note, item (ii). It carries a lone 0xA7 byte, not preceded by 0xC2, where `§` is written elsewhere in the file. A byte-pattern search for a continuation byte after an ASCII byte matched that line alone across the six files the branch edits and both READMEs.

## 6. Limits of this read

- I had no shell and ran no git command.
- The commit identity comes from the branch ref and the worktree's HEAD file.
- The diff's file list, counts and clean worktree come from the worker report and the custodian's filing note. I did not see `git diff` itself.

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: 1-62
- `state/directives/2026-10-03-lead-data-pilot-clarification.md`: 1-49
- `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md` (main): 1-336
- `state/consults/2026-10-07-kernel-close-races-followups-worker-report-1.md` (main): 1-66
- `state/consults/2026-10-05-kernel-close-races-followups-impact-read.md` (main): 1-138
- In the worktree at 2d75b57b:
  - the worktree's `.git` file; the worktree HEAD and the branch ref under the main checkout's `.git`
  - `kernel/README.md`: 340-386; a heading grep; a CR and trailing-whitespace grep; a grep for line 52's heading
  - `engine/README.md`: 490-528; a heading grep
  - `protocol/skp/SKP-V0.md`: 126-139, 986-1027; a heading grep; byte-pattern greps
  - `kernel/src/skp.rs`, `kernel/src/lib.rs`, `kernel/src/params.rs`, `kernel/src/publish/*`, `kernel/src/permission/*`, `kernel/tests/*.rs`: grep hits for test names, `mod`, `pub` items, `impl` lines and constants
  - `kernel/Cargo.toml`: grep hits for path dependencies
  - `protocol/data-plane/src/transport.rs`, `protocol/data-plane/src/server.rs`, `protocol/data-plane/src/lib.rs`: grep hits
  - `engine/src/lib.rs`, `engine/src/*.rs`, `protocol/skp/src/**`, `renderer/src/lib.rs`: grep hits for the consumed items
  - `docs/adr/*.md`: Status lines (grep)
  - `KNOWN-LIMITATIONS.md`: item lines (grep)
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md`: grep hits for 2b
  - `engine/B1-FOLLOWUPS-PREREGISTRATION.md`: grep hits at 1, 129, 283
  - `engine/GEOMETRY-POINTS-PREREGISTRATION.md`: grep hits at 1, 278, 282, 288, 450, 454
  - a file glob over `kernel/*.md`, `engine/*-PREREGISTRATION.md` and the other named form and binary paths
