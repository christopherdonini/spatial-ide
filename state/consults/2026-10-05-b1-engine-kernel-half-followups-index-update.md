# Owner's-index update — b1-engine-kernel-half-followups (lead-data, second pilot, piece 2)
Read at: cut/b1-engine-kernel-half-followups 9c8e7930

Replacement text only, pointers only, for the worker to apply in this piece's PR (the 2026-10-03 lead-data clarification, C1; `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2). The update owed is named in `engine/B1-FOLLOWUPS-PREREGISTRATION.md` §2, "Owner's index". Line numbers are `engine/README.md` and `kernel/README.md` as read in the branch's worktree. The branch ref `refs/heads/cut/b1-engine-kernel-half-followups` reads `9c8e79304d0d91914e62e577989baf43acb5591c`, and the worktree's HEAD names that branch. I have no shell, so I could not check that the worktree is clean. Worker report 1 says it is.

sha256: not computed (C3).

## 1. `engine/README.md`: three lines replaced in place

### 1.1 Last verified at

Current, `engine/README.md:499`:

```
- **Last verified at:** 8efcde9 (every pointer checked at that commit)
```

Replacement:

```
- **Last verified at:** 9c8e7930 (every pointer checked at that commit)
```

Basis: I checked every pointer in the section, `engine/README.md:495-527`, at 9c8e7930 (section 4 below).

### 1.2 Interfaces: Publish stream and content pin (gains T1 as a pin)

Current, `engine/README.md:505`:

```
  - Publish stream and content pin → `spatial_engine::Dataset::stream_for_publish`, `spatial_engine::Dataset::pin_content`, `spatial_engine::ContentPin` · pinned by `engine/tests/publish_stream.rs::a_publish_partition_is_one_batch_and_its_boundaries_are_reproducible`, `engine/src/pin.rs::tests::a_pin_verifies_against_unchanged_bytes_and_refuses_changed_ones`
```

Replacement:

```
  - Publish stream and content pin → `spatial_engine::Dataset::stream_for_publish`, `spatial_engine::Dataset::pin_content`, `spatial_engine::ContentPin` · pinned by `engine/tests/publish_stream.rs::a_publish_partition_is_one_batch_and_its_boundaries_are_reproducible`, `engine/src/stream.rs::tests::a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush`, `engine/src/pin.rs::tests::a_pin_verifies_against_unchanged_bytes_and_refuses_changed_ones`
```

Basis: T1 is `fn a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush` at `engine/src/stream.rs:3121`, under `#[cfg(feature = "fixture")]` at `:3119`. It sits inside `mod tests`, which opens at `:2560` and closes at `:3445`. It calls `stream_for_publish` at `:3152`.

### 1.3 Governed by: preregistrations in this module (gains this form)

Current, `engine/README.md:518`:

```
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

Replacement:

```
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

Basis: the list is alphabetical, so the form goes after `ADMISSION` and before `B1-PROJECTION`. A glob of `engine/*PREREGISTRATION*.md` at 9c8e7930 finds 14 files: the 13 already listed plus `engine/B1-FOLLOWUPS-PREREGISTRATION.md`.

### 1.4 Line count

- Insertions plus deletions in `engine/README.md`: 6 (3 insertions, 3 deletions). The ceiling in §7 of the form is 10.
- Section length: unchanged at 33 lines (`:495-527`), against the 60-line cap.
- No line is added or removed.

## 2. Pointers made wrong by the branch's comment and doc edits

None in either section:
- `engine/README.md`'s index names items in `engine/src/stream.rs` by symbol and file, never by line. Every named symbol and constant is still present at 9c8e7930 (section 4). One example: `MAX_ATTRIBUTE_RETENTION_FACTOR` is now at `engine/src/stream.rs:104`, and the index names only its file.
- `kernel/README.md`'s index names no item in `engine/src/stream.rs`.
- Its one pointer into `kernel/tests/skp_projection.rs` still resolves: `every_projection_refusal_is_synchronous_typed_and_pre_mint` is at `kernel/tests/skp_projection.rs:387`.
- The SKP-V0 sections both indexes cite all still head the spec at 9c8e7930: §1 at `protocol/skp/SKP-V0.md:13`, §5 at `:317`, §7 at `:347`, §7.5 at `:463`, §8 at `:539`, §9 at `:987` and §9.5 at `:1051`.

## 3. `kernel/README.md`

`kernel/README.md:346-383` needs no change. I checked that it has no pointer into `engine/src/stream.rs`, that its `kernel/tests/skp_projection.rs` pin and its cited SKP-V0 sections resolve at 9c8e7930 (section 2), and that the branch's kernel edits are comment lines only (worker report 1, commit `35f762d8`). This agrees with the form's §2, "Owner's index".

## 4. Checks behind "Last verified at" (`engine/README.md:495-527`, at 9c8e7930)

- **Interfaces.**
  - Every re-export the section names is in `engine/src/lib.rs:110-146`.
  - The modules `crs`, `crs_catalog`, `identity`, `rowgroup`, `lod`, `watch`, `fixture` and `layout` are declared at `engine/src/lib.rs:77-107`.
  - The `Dataset` methods are at `engine/src/dataset.rs:295`, `:624`, `:669`, `:717` and `engine/src/stream.rs:901`, `:932`, `:970`, `:993`, `:1031`.
  - `AdmittedPredicate::admit` is at `engine/src/predicate.rs:113` and `lod::build_tiers` at `engine/src/lod.rs:1006`.
  - `spatial_kernel::skp::error_of` is at `kernel/src/skp.rs:2029`.
- **Pins.** All 27 test functions the section names resolve, by a single name grep over `engine/**` and `kernel/**`. `pin.rs`'s and `cancel.rs`'s pins sit inside `mod tests` (`engine/src/pin.rs:137`, `engine/src/cancel.rs:281`).
- **Files.**
  - `engine/src/crs-catalog.json` and `engine/examples/make-fixture.rs` exist.
  - The three measurement-pass forms exist: `kernel/PROBE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` and `kernel/SCALE-PASS-PREREGISTRATION.md`.
- **Consumed.** `engine/Cargo.toml:82` has one path dependency, `spatial-engine = { path = ".", features = ["fixture"] }`, which is the crate itself.
- **ADRs.**
  - The 15 listed as accepted each have an Accepted Status line (ADR-032 at its line 5, the rest at line 3).
  - ADR-023's line 3 reads Proposed.
- **Declared limits.** Items 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26 and 27 exist in `KNOWN-LIMITATIONS.md`. I checked only that they exist; whether each still governs this module was not re-judged.
- **Ceilings.** All 33 constants are present in the files the section names, by a declaration grep over `engine/src`.

## 5. Found, not changed

- `engine/README.md:505` (Publish stream) does not name `spatial_engine::Dataset::resolve_projection` (`engine/src/stream.rs:959`, `pub`). That is the projection call on publish's path (`kernel/src/publish/mod.rs:493`), and T1 calls it at `engine/src/stream.rs:3149`.
- `kernel/README.md:376`, "kernel halves of pieces filed elsewhere", does not name `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, although that form governs the comment edits in `kernel/tests/skp_projection.rs`. The form's §2 owes no change to `kernel/README.md`, and its §8 item 4 bars any path outside its four §7 files.

## Files read

- In the worktree at 9c8e7930:
  - `engine/README.md`: 490-528
  - `kernel/README.md`: 340-384; grep for `engine/src/stream.rs|skp_projection|SKP-V0`
  - `engine/src/lib.rs`: 1-147
  - `engine/src/stream.rs`: 3095-3204; greps (`mod tests`, `cfg(feature = "fixture")`, top-level braces, `resolve_projection`, constants, `pub fn`)
  - `engine/src/{dataset,predicate,lod,attributes,pin,cancel,pool,crs,descriptor,geoparquet,index,rowgroup,watch,trace}.rs`: greps only
  - `engine/tests/*.rs`, `kernel/tests/*.rs`: test-name grep
  - `kernel/src/skp.rs`: `error_of` grep
  - `kernel/src/**`: `resolve_projection|stream_for_publish` grep
  - `kernel/tests/skp_projection.rs`: name grep
  - `engine/Cargo.toml`: `path =` grep
  - `docs/adr/ADR-0{04,05,06,07,10,13,15,16,17,18,21,23,26,32,33,35}-*.md`: Status grep
  - `protocol/skp/SKP-V0.md`: heading greps
  - `KNOWN-LIMITATIONS.md`: item grep
  - globs: `engine/*PREREGISTRATION*.md`, and the files named in section 4
- The worktree's `.git` file and its git-dir `HEAD`; the main repository's `refs/heads/cut/b1-engine-kernel-half-followups`
- On main:
  - `engine/B1-FOLLOWUPS-PREREGISTRATION.md`: 1-270
  - `state/consults/2026-10-05-b1-engine-kernel-half-followups-worker-report-1.md`: 1-110
  - `state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md`: 1-160
  - `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: 1-61
  - `state/directives/2026-10-03-lead-data-pilot-clarification.md`: 1-48
