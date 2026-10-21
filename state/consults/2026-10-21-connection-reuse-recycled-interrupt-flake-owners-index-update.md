# Owner's-index update — connection-reuse-recycled-interrupt-flake (lead-data)
Read at: cut/connection-reuse-recycled-interrupt-flake 32c3e807

Tag: node:connection-reuse-recycled-interrupt-flake@g3. Task: the owner's-index update (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md §1, item 2), as the form's §9 bullet on the owner's-index update names it: two lines of engine/README.md's Owner's index section, the last-verified line and the list of preregistrations in this module.

How the branch was read: through its worktree. The worktree's HEAD names the branch, and the branch ref reads 32c3e807f3f6e36184cb8071c7d4399127ff7f1c. That the tree was clean rests on the brief and on the worker report's final porcelain; I have no tool that shows porcelain, and the custodian's before-and-after porcelain (pilot §7, C3) is the check.

## 1. The two replacements in engine/README.md (Owner's index section)

Both lines are LF-terminated in the file (no CR in engine/README.md at 32c3e807). Each block below is the line's content without its terminator; replace the whole old line by the whole new line.

### 1.1 The last-verified line — engine/README.md:530, read at 32c3e807

Old (byte-copied from engine/README.md:530, read at 32c3e807):

```text
- **Last verified at:** fb95bec0 (every pointer checked at that commit); the `referenced_columns` pointer at 3dfc1a0e; the `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md` pointer at e555177c
```

New:

```text
- **Last verified at:** 32c3e807 (every pointer checked at that commit)
```

The two later-commit clauses of the old line are dropped because every pointer, those two included, was checked at 32c3e807 (section 2). The new pointer that 1.2 adds was checked there too: the file is present on the branch at 32c3e807.

### 1.2 The preregistrations list — engine/README.md:550, read at 32c3e807

Old (byte-copied from engine/README.md:550, read at 32c3e807; the line carries one non-ASCII character, the section sign in `(§2a)`):

```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`, `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

New:

```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md`, `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`, `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

The only difference is one entry, `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md` followed by a comma and a space, placed in the list's alphabetical order between the CLAUSE-COMPOSITION and CORPUS-REPRODUCIBILITY entries.

A fact for the record, not a change: the five-line form `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md` is also present on the branch at 32c3e807. It is not added, because the form's §9 bullet names one addition (this form, the full one), and the full form's Authority block says nothing is built under the five-line form. Every other engine/*PREREGISTRATION*.md file on the branch is already in the list.

## 2. Last verified at: every pointer checked at 32c3e807

I checked every pointer in the section (engine/README.md:526-560, read at 32c3e807) against the branch's files at 32c3e807. **Every pointer resolves; none is missing or unresolved.** What was checked, by class:

- **Test pointers, 47:** each named function found in the named file. 43 under engine/ (in engine/tests/ or, for the `src/...::tests::` pointers, inside the file's `mod tests`: engine/src/cancel.rs, engine/src/error.rs, engine/src/pin.rs, engine/src/stream.rs, engine/src/trace.rs) and 4 under kernel/tests/ (skp_admission_remediation.rs, typed_terminal_codes.rs, end_to_end.rs).
- **Rust paths:** every `spatial_engine::` item named. The crate-root items are re-exported in engine/src/lib.rs:134-171, read at 32c3e807, or are public modules at engine/src/lib.rs:101-132 (`crs`, `crs_catalog`, `identity`, `rowgroup`, `trace`, `watch`, `lod`, `descriptor`, `fixture`, `layout`). The `Dataset` methods are in `impl Dataset` in engine/src/dataset.rs or engine/src/stream.rs (stream.rs's `impl Dataset` opens at engine/src/stream.rs:910, read at 32c3e807). `AdmittedPredicate::admit` and `referenced_columns` are in `impl AdmittedPredicate` (engine/src/predicate.rs:95, read at 32c3e807). `descriptor::SourceObservation`, `lod::build_tiers`, the `trace` items (`start`, `TraceGuard`, `TraceKey`, `mark`, `is_enabled`, `PRODUCER_CANCELLED`) and the static `CURRENT` in engine/src/trace.rs were all found. `spatial_kernel::skp::error_of` is in kernel/src/skp.rs, and `skp` is a public module of kernel/src/lib.rs.
- **Ceilings, 33 constants:** each defined in the file the section names for it.
- **Files and sections:** engine/src/crs-catalog.json and engine/examples/make-fixture.rs exist. protocol/skp/SKP-V0.md has §1 (with `open_dataset` and `describe`), §5, §7 and §9. ADR-004 has Amendment 4. kernel/CANCELLATION-AND-TRACING.md has §7. ADR-018 names `cancel_observed`. engine/SOURCE-WATCHER-PREREGISTRATION.md has §2a, and kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md has §2 and Part B. Every preregistration and measurement-pass file named in the Governed-by lines exists, the new entry of 1.2 included.
- **ADRs:** each of the 16 ADRs listed as accepted has an Accepted status line; ADR-023 and ADR-036 have Proposed status lines.
- **KNOWN-LIMITATIONS:** items 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27, 31 and 33 each exist as a numbered item in KNOWN-LIMITATIONS.md.
- **Consumed from other modules (none):** engine/Cargo.toml's only path dependency is the crate itself (engine/Cargo.toml:82, read at 32c3e807), not another module.

Scope of the check: whether each pointer resolves. It does not check that each pinned test still proves what the index line pairs it with, beyond the test names this diff touches (section 3).

## 3. Other lines of the section made stale by the diff

**None.** Against the three changed files:
- engine/src/stream.rs: the new member `interrupt_bound_at_lease` of `ConnectionFacts` (engine/src/stream.rs:639-651, its write at engine/src/stream.rs:1239, both read at 32c3e807). The section has no pointer to `ConnectionFacts` or to `BatchStream::connection_facts`, so no line points at what changed. Adding one is outside the two lines the form's §9 names. That is not a gap I fill, and not a recommendation.
- engine/src/dataset.rs: `lease_for_stream`'s doc only (engine/src/dataset.rs:1928-1942, read at 32c3e807). `lease_for_stream` is `pub(crate)` and the section does not name it.
- engine/tests/connection_reuse.rs: the changed test `cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing` (engine/tests/connection_reuse.rs:149-226, read at 32c3e807) keeps its name and is not a pointer in the section. The one pointer into this file, `capacity_exhaustion_is_a_typed_refusal_rather_than_a_queue` (engine/tests/connection_reuse.rs:421, read at 32c3e807), is untouched. The Cancellation line's `an_interrupt_on_an_idle_connection_is_not_latched` is in engine/src/cancel.rs, which the diff does not touch.
- KNOWN-LIMITATIONS: the form's §9 says no item is owed. The Declared-limits line is unchanged.

**kernel/README.md (outside this piece, nothing changed):** no line of its Owner's index section (kernel/README.md:356-398, read at 32c3e807) is made stale. The section names no `ConnectionFacts`, `connection_facts`, `connection_reuse` or `lease_for_stream`. The kernel's readers of `ConnectionFacts` (kernel/src/lib.rs:662; kernel/tests/query_window_attribution.rs:218, both read at 32c3e807) read existing members and not the new one.

## 4. Cap and ceiling

- **60-line cap:** the section runs from engine/README.md:526 (its heading) to engine/README.md:560 (the file's last line), 35 lines, read at 32c3e807. The update replaces two lines and adds none, so the count stays 35 after it, within 60.
- **The form's §7 ceiling for engine/README.md (at most 6):** two lines replaced, so `git diff --numstat` gives 2 added and 2 deleted, 4 changed lines, within 6. With Amendment 1's figure of 77 for the other three files, the piece's total becomes 81, within 100. The reviewer recounts at the head that carries the update (§9).

## 5. Not in this report

No design, recommendation, answer to an open item or approval. No change outside the Owner's index section. No open question blocks the update.

## Files read

Main checkout:
- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md: 1-271 (with Amendment 1)
- state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-worker-report.md: 1-63
- .git/worktrees/crf/HEAD: 1; .git/refs/heads/cut/connection-reuse-recycled-interrupt-flake: 1
- engine/*PREREGISTRATION*.md: listed by glob only

Branch at 32c3e807, through its worktree:
- the worktree's .git file: 1
- engine/README.md: 520-560; the whole file searched for its section headings, for CR bytes (none) and for non-ASCII characters
- kernel/README.md: 356-398; the whole file searched for ConnectionFacts, connection_facts, connection_reuse, lease_for_stream, interrupt and is_bound
- engine/src/stream.rs: 618-667, 1225-1244; searched for impl blocks, the ceiling constants, the pointed-to pub fns and `mod tests`
- engine/src/dataset.rs: 1924-1951; searched for the pointed-to pub fns
- engine/tests/connection_reuse.rs: 80-229
- engine/src/lib.rs: 100-172
- searched by pattern only, no ranges read: engine/src/predicate.rs, engine/src/trace.rs, engine/src/descriptor.rs, engine/src/lod.rs, engine/src/cancel.rs, engine/src/error.rs, engine/src/pin.rs, engine/src/pool.rs, engine/src/crs.rs, engine/src/attributes.rs, engine/src/geoparquet.rs, engine/src/index.rs, engine/src/rowgroup.rs, engine/src/watch.rs, engine/tests/*.rs (test names), kernel/src/lib.rs, kernel/src/skp.rs, kernel/tests/*.rs (test names), kernel/ (ConnectionFacts readers), engine/Cargo.toml, protocol/skp/SKP-V0.md, docs/adr/ADR-004, ADR-005, ADR-006, ADR-007, ADR-010, ADR-013, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-023, ADR-026, ADR-032, ADR-033, ADR-034, ADR-035 and ADR-036 (status lines; ADR-004 amendment headings; ADR-018 `cancel_observed`), kernel/CANCELLATION-AND-TRACING.md (headings), engine/SOURCE-WATCHER-PREREGISTRATION.md (headings), kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md (§2, Part B), KNOWN-LIMITATIONS.md (headings, numbered items)
- presence checked by glob: engine/*PREREGISTRATION*.md, engine/src/crs-catalog.json, engine/examples/make-fixture.rs, the kernel preregistration and design-note files named in the section, docs/adr/ADR-0*.md
