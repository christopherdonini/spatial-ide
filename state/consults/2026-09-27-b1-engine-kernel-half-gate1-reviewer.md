*Custodian's filing note (2026-09-27): gate 1, reviewer (full gating), for PLAN node `b1-engine-kernel-half` at `a9ccd57` (local, unpushed), transcribed from the hand-back message with the harness's two-space indent removed. Its path-and-line cites are into the branch at `a9ccd57`, not main; they are written as a path and a line number, so that main's verify-cites neither fails on them nor resolves them against main's different files. Everything below the rule is the reviewer's text.*

---

## Gate 1, reviewer: `b1-engine-kernel-half` at `a9ccd57` (`cut/b1-engine-projection`, worktree `C:/dev/wt/b1-projection`)

The merge-base is `d6d9862` (= `origin/main`). The range is `origin/main...HEAD` (three-dot): 55 files, +2792/−274. The tree is clean after review: every mutation and probe was reverted, and the probe files were deleted.

### Verdicts (`AUTONOMY.md` §22)
- **Correctness: FAIL.** Severity: blocking. Scope: `engine/src/attributes.rs`, `engine/src/predicate.rs`, `kernel/src/skp.rs::describe_dataset`. Disposition: back to the worker; C1–C3 are code fixes plus discriminating tests.
- **Evidence: FAIL.** Severity: blocking. Scope: `engine/src/stream.rs`'s retention rule and H3, plus §4's E-6, E-14, E-15 and K-2, and O1's missing test. Disposition: E1 fires §5's invalidator "H3 false", so the piece goes back to the architect. E2–E5 are worker fixes.
- **Documentation: FAIL.** Severity: medium. Scope: `protocol/skp/SKP-V0.md` §4 item 13, and Amendments 2–4. Disposition: SKP-V0 is a worker fix. The records get appended rows: a class-2 row for H3, and a corrected discharge for Amendment 3. Nothing in them may be edited in place.

### Blocking findings

**C1. The filter refusal text changed for every type that is still refused, and the placeholder reaches the wire.**
- Where: `engine/src/attributes.rs` line 109 and `engine/src/predicate.rs` line 1059-1060.
- What happened: the gate's final-arm detail was rewritten to "[B1 close placeholder] … for an attribute (… float32, float64, or a dictionary over one of those)". `filterable_column_type` renders that error's Display as the `reason` of `skp.filter_column_not_filterable`. A predicate naming `d32` (Date32) now returns that reason instead of main's "…for a published attribute (utf8, boolean, the 8/16/32/64-bit integers, float64)".
- Observed: a probe compared the reason against main's text and failed. The actual value starts "refused: `d32` cannot be published as an attribute — [B1 close placeholder] type is Date32…".
- What it breaks:
  - F7 and §5's declared-unchanged list;
  - §8 item 15;
  - O2's ruled recommendation (round 22 item 2: "Publish and filter keep today's texts byte for byte");
  - §8 item 17, because it is an operator-visible string.
- Why it was missed: no test pins this text.

**C2. `describe.projectable` disagrees with `viewport_query` admission for a file that has its own `id` column under a declared identity mapping.**
- Where: `kernel/src/skp.rs` line 1686 against `engine/src/attributes.rs` line 331. The reserved-`id` check lives only in `admit_projection`'s loop, not in `admit_projection_column`.
- Observed: a probe opened a MultiType file through `Catalog::open_cancellable` with the identity mapped to `i64`. `describe` returned `id.projectable=true`, and `viewport_query(["id"])` returned `Err("skp.projection_column_is_identity")`.
- Why it matters: this configuration is reachable from the product through `open_dataset.identity`. It breaks the one-function rule (round 17 item 4, stop item 4) and the premise of entry 79 item (3), that the panel holds no type logic. K-5 never meets the case, because its mapped and session fixtures have no `id` column.
- Fix: move the reserved-name check into `admit_projection_column`, and add a K-5 case for it.

**C3. The shipped admission order interleaves name resolution with the per-column rules. E-6's own mutation is the shipped code.**
- Where: `engine/src/attributes.rs` line 390-410.
- Background: §2.2 items 3 and 4, SKP-V0 §9.4 and E-6 ("Mutation: interleave") all declare two passes. Main's `resolve_projection` also resolved every name first.
- Observed: a probe ran `admit_projection(["geometry","nope"])` and got `ColumnIsGeometry`, where the declared order gives `ColumnUnknown{nope}`. E-6 (`attributes.rs` line 538) tests `["nope","geometry"]`, which cannot tell the two orders apart.
- Why it matters: on publish this is an observable change for multi-failure lists (main refused `nope` as unknown), beyond what O1 ruled. That falls under §8 item 15.
- Also missing: O1's recommendation, bound by Amendment 1, calls for "a new test pins the multi-failure order". No such test exists.

**C4. Publish text for a dictionary over a refused value type (for example `Dict(Int8, Date32)`) is not today's text.**
- Where: `attributes.rs` line 276. `From<ProjectionError>` renders the final-arm text for every `TypeNotAdmitted`.
- Background: O1(c)'s recommendation keeps "today's dictionary text" for this case.
- Observed: a probe compared the output against main's dictionary text and failed.
- It is unreachable through `read_parquet` today (H2). But the `From` impl's doc claims "byte for byte", and SKP-V0 §9.5 says the same; both claims are false.

**E1. H3 is false for nullable columns, so §5's invalidator "H3 false" fires.**
- Where: `stream.rs` line 2203 (`compact_attribute_slice`) and E-15 at `stream.rs` line 2470.
- Observed: a probe wrote a nullable `StringArray` slice and its compacted copy through IPC, and the bytes differ. The difference is in the validity bitmap's padding bits:
  - offset 8, length 3: byte 320 is 123 in the slice and 3 in the copy;
  - offset 0, length 10: byte 321 differs;
  - offset 40, length 20: byte 322 differs.

  The difference appears whenever the slice starts byte-aligned, carries a null, and its length is not a multiple of 8.
- Why P0 missed it: Amendment 2's probe and E-15 both used a non-null `Int64`.
- Consequence: compaction can change the bytes of a publish partition relative to main when a compacted single run carries a NULL. That breaks §5's "every publish output byte" unchanged. I proved the IPC-level difference; I did not observe it on an actual bundle.
- Next step: per §5, the piece stops and returns to the architect. The P0 result needs a class-2 row. Amendment 2's text stands and is not edited.

**E2. The retention rule's wiring into `flush` is untested, and the declared bound is false for small runs.**
- Wiring: with the mutation at `stream.rs` line 2261 (`1 => Ok(Arc::clone(&runs[0]))`), the full engine suite still passes (`cargo test -p spatial-engine --features fixture`: 343 passed, 0 failed). E-14 only calls the helper, on a constructed array.
- Small runs: the bound "at most 2 × its own slice memory" (`stream.rs` line 81, the `MAX_QUEUED_BATCHES` doc at `stream.rs` line 73, §7) does not hold after compaction. MutableBuffer rounds each allocation up to 64 bytes:
  - a 1-row `Int64` run retains 64 bytes against 8 of slice memory;
  - a 100-row `Boolean` run retains 64 against 13.
- Record consequence: Amendment 3's discharge of §2.3's retention rule by E-14 ("every emitted attribute column retains at most the declared factor") does not resolve. Under round 7's discharge-claim rule that is a gate failure by name.

**E3. K-2 does not check the exact field keys it claims to check.**
- With `known_columns` renamed to `known_columns_MUTATED` and `id_column` renamed to `id_column_MUTATED` in `projection_error_of`, all 7 tests in `kernel/tests/skp_projection.rs` still pass.
- The asserted fields at `skp_projection.rs` line 255 and `:257` omit `known_columns`, `id_column` and `detail`.
- No test compares the kernel's output against the seven committed `v0-error-projection_*.json` fixtures. So the fixture-side shape is unproven at the seam (round 4 seam rule).

**D1. SKP-V0 §4 item 13's new `skp/0.6` paragraph (`SKP-V0.md` line 288) misstates condition (iii).**
- Commit `2963021` added `columns` and `projectable` to the shared fixtures under the literal `skp/0.5`, which main had already frozen at merge. The TypeScript `fixtures.test.ts` followed only in `6cd1764`.
- The workspace also does not compile at `2963021`: its message says the kernel fix-ups "land in the next commit".
- That is the same pattern the paragraph itself says disqualified `skp/0.5`. §8 item 4 does not fire, because the literal bump in `6cd1764` carries both sides. The paragraph must state the facts, as the `skp/0.5` paragraph does.

### Suggestions
- **Amendment 4's closing claim.** "No test cited a mutation it could not be made to fail by" (`B1-PROJECTION-PREREGISTRATION.md` line 505) is contradicted by E-6 if the sentence covers all of §4 (see C3).
- **Mutations with no recorded observation.** These §4 tests have none in any record: P-1–P-3, E-1–E-7, E-11, E-12, E-14, E-15, E-17, E-18 (the namespace half), E-19, K-2, K-3, S-1 and S-2. I observed most of them myself (below), but §9's "every §4 mutation" is not discharged by any record.
- **Amendment 3's tsc note.** At `:484` it assigns the `tsc` failure to `b1-shell-half`'s scope, yet the failure was introduced by this piece's own `6cd1764`. Amendment 4 fixed it; the misattribution needs one appended row only if the record cap allows it.
- **K-1's oracle and coverage.** The doc comment (`skp_projection.rs` line 106) says "an independent DuckDB read", but the oracle is `area_for`. `zone` values are never checked.
- **Fixture hashing.** §3's "hash-verified before and after each run" is not implemented by any test.
- **§3 rows with no live test:**
  - `[f32]` emitted "bit-equal to the source";
  - `[text]` under the default policy.
- **Publish `.expect`.** `kernel/src/publish/mod.rs` line 500 holds an `.expect` on an invariant. Carry the source type through instead.
- **Duplicated dictionary exclusion.** The `namespace_admit` copy (`predicate.rs` line 1005) is untested; E-19 covers only the helper.

### Nits
- Amendment 4's heading is broken across two lines (`:486-487`).
- Amendment 3 splits test identifiers across lines inside backticks, so they cannot be grepped.
- Two added lines are 136 columns wide (`kernel/tests/session_end_event.rs` line 79, `session_reference.rs` line 57).
- One new clippy warning on an added line: `type_complexity` at `kernel/tests/skp_projection.rs` line 247. The others found were outside the diff's added lines.
- The new dictionary-arm detail in `admit_attribute_type` (`attributes.rs:~100`) is unreachable text.
- SKP-V0 §2.1 listed version notes for items 1, 3, 8 and 13. The diff edits items 2, 3, 8 and 13, and rewrites item 3's earlier sentence.

### Resolved and passing
- The gate widening is atomic with F1's `REAL` arm and the publish restriction, all in `6cd1764`.
- O3: projection is admitted before the filter.
- Pre-lease and pre-mint: observed through K-2's mutation (below).
- `projection_error_of` and `viewport_query_build_error_of` are exhaustive, with no wildcard.
- The dictionary decode runs before the declared-type check.
- `skp/0.6` follows main's `skp/0.5`, with both sides in `6cd1764`.
- `git diff --stat origin/main...HEAD -- protocol/data-plane/`: empty.
- No "zero-copy".
- No ADR edits.
- **ADR-023 condition (4) holds.** The 8 suffixes re-derived to main's 8 expected strings byte for byte, `BBOX_COND` is unchanged, and the verbatim test is unchanged. The E-17 mutation fails both the matrix and its twin.
- The prereg is append-only against main. It carries no `@ sha256` pin at all. The P0 commit `86d6b4b` is on main.
- Amendment 1's quote "All eight as rec. (Recommended)" matches `DECISIONS-PENDING.md`'s round 22 item 2 byte for byte.
- Amendment 2's arrow-data 58.4.0 line refs (481 and 507) are exact.

### Mutations re-observed (each applied, observed, reverted)
- **Engine**, observed failing by name:
  - E-1: emit Float64;
  - E-2: admit every Dictionary;
  - E-3: admit Date32;
  - E-4: duplicate → identity;
  - E-5: count after resolution;
  - E-7: skip the geometry and identity checks;
  - E-11: remove the Float32 arm;
  - E-12: skip the decode;
  - E-14: the helper never compacts;
  - E-17: projected columns before geometry (the matrix and the twin both fail);
  - E-18 namespace half: drop `REAL`;
  - E-19: drop the exclusion.

  Batches were grouped by independent functions.
- **Protocol**, observed failing: P-1, P-2 and P-3.
- **Kernel:**
  - K-2's named mutation (admit after `open_engine_stream`): fails on the lease count, 2 against 1.
  - K-3 (`Some([])` → `None`): fails.
- **Shell**, observed failing: S-1 and S-2.
- **Mutations no test fails:**
  - E-6's "interleave" (it is the shipped code; C3);
  - the flush wiring (E2);
  - the field-key renames (E3).
- **Probes that failed as predicted:** C1, C2, C3, C4, E1 and E2.

### Suite counts
- `cargo test --workspace --features spatial-engine/fixture`: 755 passed, 0 failed, 40 ignored (78 test targets), exit 0.
- Clippy on `spatial-engine`, `spatial-kernel` and `spatial-skp`: fails under `-D warnings` on pre-existing lints, and CI does not gate clippy. The one new warning on an added line is the `type_complexity` nit above.
- Rustfmt 1.9.0 on the touched files: every file reports diffs, and so does main's own baseline (for example, main's `skp_admission.rs` has 36). §9's `cargo fmt --check` cannot be discharged on this machine.
- Shell: `tsc --noEmit` exits 0. `vitest` passes 1090 of 1090 across 72 of 72 files, with `924dd3f` included.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 314 passed, 0 failed.
- verify-cites PASS, verify-quotes PASS, verify-test-claims PASS.
- Licence audit: the manifest and lockfile diff is empty.

### Head reviewed
`a9ccd57`, with `origin/main` at `d6d9862`.
