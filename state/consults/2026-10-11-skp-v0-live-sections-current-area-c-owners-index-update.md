# Owner's-index update for skp-v0-live-sections-current-area-c (lead-data, second pilot)
Read at: cut/skp-v0-live-sections-current-area-c a8b45622084e0aa0f4ffd761a19921b706b38f76

Task: the owner's-index update (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md §1 item 2) for the docs lane's piece e. Its form is protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md, §2.6, with Amendment 2 for the base lines.

How the head was established: the worktree's .git file (C:/dev/wt/skpe/.git) points to the main checkout's worktree record skpe. That record's HEAD names refs/heads/cut/skp-v0-live-sections-current-area-c, and the loose ref holds a8b45622084e0aa0f4ffd761a19921b706b38f76. I have no git or shell tool, so the clean state of the worktree comes from the brief. Every branch file below was read from C:/dev/wt/skpe. Line numbers are written in words (line N @ a8b45622) so that no path:line cite names a line that exists only on the branch.

Disclosure: the form at the head ends at Amendment 1. Amendment 2 exists only in the main checkout's copy of the form, which I read there. Its four base lines (kernel/README.md at 1457fbd0: 356, 357, 363 and 382) sit at the same line numbers at the head. That fits the brief and worker report 1, which both say kernel/README.md is untouched. I could not hash the lines, so byte identity with Amendment 2's pins is not shown here.

Apply each change by replacing the whole line, without its line terminator. If an old line does not match byte for byte, do not make the replacement. No line is inserted and none is deleted.

## 1. kernel/README.md, Owner's index: one line changes

### 1.1 Governed by, kernel halves of pieces filed elsewhere: this form

The form is filed in protocol/skp/. It has a kernel half: rows S8 and SX2 edit doc comments in kernel/src/skp.rs, and §2.6 edits this index.

**Where the entry goes.** The list is not alphabetical: ADMISSION comes after SOURCE-WATCHER, and protocol/skp comes before protocol/data-plane. It is grouped by the directory each form is filed in: ten engine/ entries, then frontends/shell, then protocol/skp, then protocol/data-plane. Within a group, entries are added at the group's end, not at the end of the line. For example, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md` closes the engine/ group. Its SKP-V0 §8 note is dated 2026-10-09, yet it sits ahead of `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`, which the pilot directive of 2026-10-05 (§3) names as the pilot's first piece.

The new entry therefore goes last in the protocol/skp group, directly after `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md` and before `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`. It carries no section qualifier, because the kernel half is two rows (S8, SX2) plus §2.6, not one section.

Old line, kernel/README.md line 382 @ a8b45622:

```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```

New line:

```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```

### 1.2 The three pointer checks against the head: all match, no change

**SKP v0 host** is kernel/README.md line 356 @ a8b45622. It matches.
- SKP-V0.md §1 is headed "The five commands" (line 13 @ a8b45622). Its five subsections are `open_dataset`, `describe`, `viewport_query`, `cancel` and `close_dataset`.
- `SkpHost` is declared `pub` at kernel/src/skp.rs line 1034, and `pub mod skp` is at kernel/src/lib.rs line 75.
- Each of the six pinned tests resolves at the head:
  - kernel/tests/skp_admission.rs line 405;
  - kernel/tests/source_watch_ordering.rs line 624;
  - kernel/src/skp.rs lines 3045, 3187 and 3266, inside `mod tests` (opened at line 2377);
  - kernel/tests/skp_projection.rs line 915.
- The piece's §1 rewrites (S1, S4, S5c) change what §1 says, not what the pointer names.

**Stream tickets** is kernel/README.md line 357 @ a8b45622. It matches.
- SKP-V0.md §1 has `viewport_query` (line 103) and `cancel` (line 117). §3 is "Handles and scalar codecs" (line 168), and its handle table names `StreamHandle` (line 176).
- `StreamRegistry` is `pub` at kernel/src/skp.rs line 151. `EngineSourceFactory` is `pub` at kernel/src/lib.rs line 320, and `ticket_only` is `pub fn` at line 365, inside `impl EngineSourceFactory` (line 330).
- Each of the five pinned tests resolves:
  - `a_ticket_redeems_exactly_once`, kernel/src/skp.rs line 2461, in `mod tests`;
  - `a_raw_stream_params_start_is_refused_in_ticket_only_mode`, kernel/tests/skp_admission.rs line 214;
  - the three `ticket_drop_under_lock_regression` tests, kernel/src/skp.rs lines 3975, 4015 and 3593, inside that module (opened at line 3402).
- S5c's new `cancel` sentence (line 123) says how the host reads a `sh_` handle. It does not move anything the pointer names.

**Wire error codes** is kernel/README.md line 363 @ a8b45622. It matches.
- SKP-V0.md has §5 "Error taxonomy" (line 333), §7.5 (line 483) and §9.5 (line 1183, now headed "Refusal taxonomy — eight codes").
- §5 still names `kernel/src/skp.rs::error_of` as the one exhaustive mapping. S5b's reserved line (lines 345 to 346) adds no produced code.
- `terminal_detail_of`, `error_of` and `filter_error_of` are `pub fn` at kernel/src/skp.rs lines 2037, 2044 and 2218.
- Each of the four pinned tests resolves:
  - kernel/tests/typed_terminal_codes.rs line 380;
  - kernel/tests/skp_projection.rs line 387;
  - kernel/tests/skp_admission.rs line 612;
  - kernel/tests/skp_admission_remediation.rs line 274.
- S8 edits only the doc comment of the private `projection_error_of` (line 1725). The pointer names only `pub` items, so this changes nothing in it.

No corrected line is owed for any of the three.

### 1.3 Last verified at: not touched

kernel/README.md line 354 @ a8b45622 (d5863945) stays as it is. I re-checked only the three pointers in 1.2 and the list in 1.1, not every pointer in the section.

### 1.4 Other kernel index lines: no change

- Accepted ADRs (line 379): the form cites ADR-004, 016, 017, 034 and 035 as accepted, and all five are already listed.
- Proposed ADRs (line 384): ADR-019 and ADR-023 are already listed there.
- Declared limits (line 385): no KNOWN-LIMITATIONS item is added or edited (form §9).
- The cap: the section runs from line 350 to line 391 @ a8b45622, 42 lines, and the update replaces one line and adds none.

## 2. engine/README.md: no change

The Owner's index (engine/README.md lines 526 to 561 @ a8b45622; Last verified at fb95bec0, line 530) is left as it is.

No engine file is in the diff, by these sources:
- Worker report 1 (state/consults/2026-10-11-skp-v0-live-sections-current-area-c-worker-report-1.md, main checkout) lists the diff B...HEAD as seven files: protocol/skp/SKP-V0.md, protocol/skp/src/v0/error.rs, protocol/skp/src/v0/handles.rs, protocol/skp/src/v0/codec.rs, protocol/skp/src/v0/commands.rs, kernel/src/skp.rs and frontends/shell/src/skp/types.ts.
- The form's §5 declares `engine/**` unchanged.

I had no git tool, so I did not run the diff myself. The reviewer's `git diff --name-only 1457fbd0...a8b45622 -- engine` is the check that confirms it.

## 3. protocol/: no owner's index

No file under protocol/ at a8b45622 has an Owner's index section. A search for that heading under protocol/ finds only two preregistrations that note its absence: protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md, Amendment 4 item 6, and protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md, its Owner's index paragraph. This piece's changes to protocol/skp therefore get no index entry. The custodian should note this absence. The form (§2.6) creates no index.

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md (main checkout): whole file
- state/consults/2026-10-11-module-docs-stale-statements-owners-index-update.md (main checkout): whole file, for the format
- state/consults/2026-10-11-skp-v0-live-sections-current-area-c-worker-report-1.md (main checkout): whole file
- protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md @ a8b45622: whole file; main checkout: §10 (Amendments 1 and 2)
- kernel/README.md and engine/README.md @ a8b45622: whole files
- protocol/skp/SKP-V0.md @ a8b45622: heading grep; lines 10-209, 333-354, 1100-1119
- kernel/src/skp.rs @ a8b45622: grep for the named fns, structs, modules and pinned tests
- kernel/src/lib.rs @ a8b45622: grep for `pub mod`, `EngineSourceFactory`, `ticket_only`
- kernel/tests @ a8b45622: grep for the pinned test fns
- protocol/ @ a8b45622: grep for "Owner's index"; protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md lines 505-532
- git metadata: the worktree's .git file, the worktree record's HEAD, and the branch ref, one line each
