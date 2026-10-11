# Owner's-index update — crs-undeclared-message-wording (lead-data, second pilot, resumed)
Read at: cut/crs-undeclared-message-wording fb95bec0

Task: the owner's-index update (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md §1 item 2), for the piece whose form is engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md (§9, the bullet on the owner's-index update; Amendment 1 item 1, OPEN-2 (A)).

How the branch head was established: the worktree's .git file points to the main checkout's worktree record crs, whose HEAD names refs/heads/cut/crs-undeclared-message-wording, and that ref holds fb95bec09e194016c44340414ad23109ae372bb0. I have no git or shell tool, so the worktree's clean state is taken from the brief and from worker report 1's final-state section; every branch file below was read from that worktree. Every path:line into a branch file is read at fb95bec0.

## 1. engine/README.md, Owner's index: three lines change, none is added

The section's lines sit where the form pinned them at 142af722: Last verified at is engine/README.md:499, Typed refusals is engine/README.md:510, preregistrations in this module is engine/README.md:519, all read at fb95bec0. Each old line below is byte-copied from that line as read; each new line is the old line with only the change named. Apply each by exact replacement of the whole line, without its line terminator. If an old line does not match byte for byte, the replacement is not made.

### 1.1 Typed refusals: T-1 joins its pins

The test, confirmed from the branch's code: `engine/src/error.rs` (`:447-448` at fb95bec0) opens a `#[cfg(test)]` `mod tests`, and `engine/src/error.rs` (`:453` at fb95bec0) declares `fn the_crs_undeclared_message_is_the_human_wording_byte_for_byte()`, read at fb95bec0. The pointer follows the section's existing form for an in-crate test (as at engine/README.md:505 and :513, read at fb95bec0).

Old line, engine/README.md:510 @ fb95bec0:

```text
  - Typed refusals → `spatial_engine::EngineError`, given wire codes by `spatial_kernel::skp::error_of` (SKP-V0 §5) · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`
```

New line:

```text
  - Typed refusals → `spatial_engine::EngineError`, given wire codes by `spatial_kernel::skp::error_of` (SKP-V0 §5) · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`, `engine/src/error.rs::tests::the_crs_undeclared_message_is_the_human_wording_byte_for_byte`
```

### 1.2 Governed by, preregistrations in this module: this form

The form exists on the branch at engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md @ fb95bec0. The list is in alphabetical order, so the new entry goes after the COVERING-NAMES-MISSING-COLUMN entry and before the EXTENSION-AUTOLOAD entry.

Old line, engine/README.md:519 @ fb95bec0:

```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`, `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

New line:

```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`, `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

### 1.3 Last verified at: set to fb95bec0

Every pointer in the engine section was checked at fb95bec0 (section 3 below), including the two new pointers of 1.1 and 1.2. All resolve.

Old line, engine/README.md:499 @ fb95bec0:

```text
- **Last verified at:** d5863945 (every pointer checked at that commit)
```

New line:

```text
- **Last verified at:** fb95bec0 (every pointer checked at that commit)
```

fb95bec0 is a branch commit. It becomes reachable from main through the merge commit the form's §9 requires (a merge commit, never a squash).

## 2. kernel/README.md, Owner's index: no line changes (confirmed)

- Basis: the piece's six files, as named in the brief and in worker report 1's §7 table, include no path under kernel/. The form's §5 declares kernel/** unchanged.
- The kernel pointers on this piece's seam resolve at fb95bec0:
  - `spatial_kernel::skp::error_of`, at kernel/src/skp.rs:2041;
  - the typed_terminal_codes test, at kernel/tests/typed_terminal_codes.rs:380;
  - the skp_admission_remediation test, at kernel/tests/skp_admission_remediation.rs:274;
  - the end_to_end test, at kernel/tests/end_to_end.rs:684.
- The piece has no kernel half, so nothing joins the section's list of kernel halves of pieces filed elsewhere (kernel/README.md:378 @ fb95bec0).
- Last verified at (kernel/README.md:350 @ fb95bec0) stays as it is: I did not check every pointer in the kernel section at fb95bec0.
- Pointer: the form's §7 names engine/README.md as the only file that carries the owner's-index update.

## 3. Pointer check of the engine section at fb95bec0

Each pointer in engine/README.md:499-529 @ fb95bec0 was checked against the branch's tree. None fails to resolve.

- **Test pins (lines 501-514), 43 names.** Each name was found as a `fn` in the file the pointer names. In-crate pins sit inside the named `mod tests`:
  - engine/src/cancel.rs:281 and :500;
  - engine/src/pin.rs:137 and :147;
  - engine/src/trace.rs:563, :736 and :766;
  - engine/src/stream.rs:2641, :2954, :3021 and :3319;
  - `engine/src/error.rs` (`:448` and `:453` at fb95bec0).
  
  The three kernel test pins are at kernel/tests/skp_admission_remediation.rs:274, kernel/tests/typed_terminal_codes.rs:380 and kernel/tests/end_to_end.rs:684.
- **Items (lines 501-515).**
  - Re-exports at engine/src/lib.rs:120-157: every crate-root type the section names.
  - Modules at engine/src/lib.rs:89-117: crs, crs_catalog, identity, fixture, layout, lod, rowgroup, trace and watch.
  - `Dataset` methods:
    - open_cancellable, check_source_unchanged, pin_content, build_index, geometry_encoding, declared_geometry_types and covering, in engine/src/dataset.rs;
    - stream_with_cancel, stream_for_publish, admit_projection, stream_projected_with_cancel and stream_indexed_experimental, in the `impl Dataset` at engine/src/stream.rs:897.
  - `AdmittedPredicate::admit`, at engine/src/predicate.rs:113.
  - `descriptor::SourceObservation`, at engine/src/descriptor.rs:353.
  - `lod::build_tiers`, at engine/src/lod.rs:1006.
  - trace's start, TraceGuard, TraceKey, mark, is_enabled, `CURRENT` and `PRODUCER_CANCELLED`, at engine/src/trace.rs:98-441.
  - These files exist: engine/src/crs-catalog.json and engine/examples/make-fixture.rs.
  - engine/Cargo.toml's only `path =` dependency is the crate itself (engine/Cargo.toml:82).
- **Sections.**
  - SKP-V0 §1, §5, §7 and §9: protocol/skp/SKP-V0.md:13, :319, :349 and :1088.
  - kernel/CANCELLATION-AND-TRACING.md §7, at line 178.
  - ADR-004 Amendment 4, at docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:31.
  - engine/SOURCE-WATCHER-PREREGISTRATION.md §2a, at line 66.
  - kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md §2, at line 69, and its Part B, at line 113.
- **ADRs (lines 518 and 522).** Each ADR on line 518 has an Accepted status line. ADR-023 and ADR-036 have Proposed status lines.
- **Preregistrations (lines 519-521).** All 19 engine forms exist, and so does the 20th that 1.2 adds. The five kernel forms named also exist.
- **KNOWN-LIMITATIONS (line 523).** Items 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27, 31 and 33 each exist as numbered items in KNOWN-LIMITATIONS.md @ fb95bec0.
- **Ceilings (lines 525-529).** All 33 constants are declared in the file each pointer names. `WATCH_BUFFER_BYTES` is `pub(crate)`, at engine/src/watch.rs:73.

## 4. Other lines the diff makes stale

None, in either section.

- engine/README.md:523 @ fb95bec0 points to KNOWN-LIMITATIONS item 2, and that pointer still resolves.
- The item's own text still carries the old second sentence (KNOWN-LIMITATIONS.md:47 @ fb95bec0). That is the item's content, outside the Owner's index.
- The form's §2.1 marks the item out of scope, and its §2.6 records PLAN.yaml:4456.

## 5. The 60-line cap, after the update

Both sections end within the cap. Each count runs from the section heading to the section's last line, both included.

- engine/README.md: 35 lines. The section runs from line 495 to line 529, which is the file's last line. The update replaces three lines and adds none.
- kernel/README.md: 41 lines, from line 346 to line 386. The update does not change it.

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md (main checkout): whole file, 1-62
- engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md (main checkout): whole file, 1-344
- state/consults/2026-10-10-crs-undeclared-message-wording-worker-report-1.md (main checkout): whole file, 1-109
- engine/README.md (main checkout): a grep for lines 495, 499, 510 and 519 only
- engine/README.md @ fb95bec0: 490-529; heading grep
- kernel/README.md @ fb95bec0: 340-387; heading grep
- engine/src/error.rs @ fb95bec0: 15-44, 280-294, 440-463; a grep for test markers
- engine/src/lib.rs @ fb95bec0: 80-158
- engine/src/dataset.rs, stream.rs, predicate.rs, descriptor.rs, lod.rs, trace.rs, pin.rs, cancel.rs, attributes.rs, pool.rs, index.rs, rowgroup.rs, crs.rs, geoparquet.rs, watch.rs @ fb95bec0: greps for the named fns, items, modules and constants only
- engine/tests/*.rs @ fb95bec0: a grep for the pinned test names only
- kernel/src/skp.rs, kernel/tests/typed_terminal_codes.rs, kernel/tests/skp_admission_remediation.rs, kernel/tests/end_to_end.rs @ fb95bec0: a grep for the named fns only
- engine/Cargo.toml @ fb95bec0: a grep for path dependencies
- protocol/skp/SKP-V0.md, kernel/CANCELLATION-AND-TRACING.md @ fb95bec0: heading greps
- engine/SOURCE-WATCHER-PREREGISTRATION.md, kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md @ fb95bec0: greps for headings and Part B
- docs/adr/ADR-004, 005, 006, 007, 010, 013, 015, 016, 017, 018, 021, 023, 026, 032, 033, 034, 035 and 036 @ fb95bec0: status-line greps; ADR-004, a grep for Amendment 4
- KNOWN-LIMITATIONS.md @ fb95bec0: an item-heading grep; a grep for the old sentence
- engine/*PREREGISTRATION.md and the five named kernel forms @ fb95bec0: existence, by glob
- the worktree's .git file, the worktree record's HEAD, and the branch ref (git metadata): one line each

*Custodian's filing note (2026-10-11): written by lead-data to this path (run 00:10:26Z to 00:13:49Z by its transcript; write audit PASS, one Write, to this path only: Grep 25, Read 12, Glob 5, Write 1, SubagentHandback 1). As written, its sha256 was e2710a5cba3c8e64efd8619e4938dcd2b919f074ab594694ec62ca5fd22e8e4f. Two changes by the custodian, nothing else. First, on lines 14 and 83, the three rooted cites of `engine/src/error.rs` lines that exist only on the branch (447-448, 448 and 453, at fb95bec0) are rewritten as a path with the lines in code, so that main's cite check does not read them as lines on main. Second, this note is appended. An erratum from lead-data's hand-back, recorded and not corrected (the brief allowed one write): section 3 says the engine section has 43 test pins. A recount gives 45, 42 engine and 3 kernel, and 46 with T-1, all found where their pointers say. One line inside that bullet is two spaces only.*
