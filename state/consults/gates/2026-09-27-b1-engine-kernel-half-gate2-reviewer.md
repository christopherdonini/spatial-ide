*Custodian's filing note (2026-09-27): gate 2 (attempt 2), reviewer, full gating, for PLAN node `b1-engine-kernel-half`. Reviewed: cut/b1-engine-projection @ 273a79d002c47215d988b9203b1a975349046a94. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed. Custodian's facts on two of its points: the cargo build it saw start at 17:57 local was the exposure-profile-paths fix worker's `cargo test -p spatial-kernel`, from this session; and B1's gate-1 reports were filed at 62d3f57, an ancestor of #129's merge 16df0d7, so they stay under `state/consults/` (§25(b), reports filed before that merge).*

---

**Gate 2, reviewer (attempt 2): FAIL. Reviewed `cut/b1-engine-projection @ 273a79d`** (`origin/main` = `00cf306`, merge base `46ff585`, range `origin/main...HEAD` after `git fetch`). All cites below are into `273a79d`.

When I handed back, the tree was clean and HEAD was unchanged. Every mutation and probe was reverted, the probe file and its fixtures were deleted, and `C:/dev/b1-gate2-scratch` is removed. None of my processes is still running.

One thing for the custodian: at 17:57 a cargo build started compiling into this worktree's `target/`, launched from a bash shell that is not mine. I left it running.

### Verdicts (`AUTONOMY.md` §22)
- **Correctness: PASS.** Severity: no blocking defect. Scope: `engine/src/{attributes,predicate,stream}.rs`, `kernel/src/skp.rs`, `kernel/src/publish/mod.rs`.
  - Gate 1's C1–C4 are fixed; each was confirmed by a mutation and, for C2, by a probe.
  - Publish's plan declares `compact_attribute_retention: false` (`stream.rs:899`).
  - Disposition: none.
- **Evidence: FAIL.** Severity: blocking. Scope: X2, X6, X7, the X3 STOP, and the discharge claims and suite counts in Amendments 6 and 7.
  - Disposition: back to the worker for three tests (B1–B3) plus appended record rows.
  - This is record-correction round 2 of 2 for this piece, so after it the architect reduces the record (record cap).
- **Documentation: FAIL.** Severity: medium. Scope: `SKP-V0.md` §4 item 13, `protocol/skp/src/v0/mod.rs`, `flush`'s comment, Amendments 6 and 7, and one comment in `kernel/src/skp.rs`.
  - Disposition: one bounded correction, made in the same worker round.

### Blocking findings
**B1. X7: the recorded mutation survives, so Amendment 6's X7 row and Amendment 7's "every mutation … observed failing by name" do not resolve (round 7).**
- The mutation: remove `64usize.saturating_mul(buffer_count(&data))` from `retain_or_compact_single_run`'s allowance.
- Result: `cargo test -p spatial-engine --features fixture --lib` passes 164 of 164.
- Why the test cannot catch it: E-14's small-run half (`stream.rs:2592-2630`) asserts on the array *after* the decision, against its own allowance, which still includes the 64-byte term. A compacted 1-row `Int64` also rounds to 64 bytes, which is within 80, so it passes whichever way the decision goes.
- The `RECORDED MUTATION … Observed:` comment on that test describes a failure that does not occur.
- Fix: assert the decision itself. A 1-row `Int64` or 100-row `Boolean` run must come back pointer-equal to the input (`Arc::ptr_eq`, or the same buffer pointer), meaning it was not compacted.

**B2. X6: the property route (a) rests on has no test that fails when it breaks.**
- Row X6's first mutation: set `compact_attribute_retention: true` in `stream_for_publish`'s plan (`stream.rs:899`).
- It survives:
  - the engine lib (164);
  - `publish_stream`, `live_projection` and `row_group_seam`;
  - the whole `spatial-kernel` suite (293 passed, 28 ignored).
- Why:
  - The test hardcodes `single_run_retention(&run, false)` (`stream.rs:2722`, `:2752`). It does not read the publish plan or drive `flush`, and it compares against a one-column `StreamWriter` batch, not `TaggedBatch::assemble` as the row states.
  - Its 8/3 case carries no NULL: the source's NULLs sit at indices 5, 22 and 41. So 8/3 is not R-E1's shape, and it compacts byte-identically.
  - The recorded observation ("IPC bytes differ at offset 8 len 3", `stream.rs:2687-2691`) did not happen. With `single_run_retention` forced to compact, the test fails first at **0/10** (`stream.rs:2723`).
- Amendment 6 swapped in a different mutation without a class-4 row.
- Row X6's other mutation (the compacted copy drops its null buffer) is caught (`stream.rs:2791`).
- Fix: a test that reads the publish plan's declared retention, or runs `stream_for_publish` over a nullable fixture and asserts the single runs stay uncompacted. My probe shows that is observable: 10 of 12 publish-stream attribute columns retain above the bound.

**B3. X2: the row's kernel test does not exist, and its mutation survives.**
- The missing test is `publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction` (`[f32, nope]` → unknown). Amendment 6's X2 row drops it and does not say so.
- The mutation: move `resolve_projection` after the `admit_bundle_format` loop in `preflight_pinless_parts`.
- It survives the kernel lib (123), `skp_projection` (9), `publish` (28), `publish_cli` (9) and `verify_bundle` (3).
- `verify-test-claims` did not flag the missing name. The tool is a floor, not the proof.

**B4. Observation records (round 25, item 2 (c); round 7).**
- Neither amendment names the commit a mutation was observed at.
- Amendment 7 calls the `RECORDED MUTATION` comments "reasoned", yet each says "Observed:"; B1 and B2 show that two of them were not observed.
- Amendment 6's suite line says "every crate and test binary was instead run individually". That is false:
  - The decomposition runs 5 of the engine's 27 integration binaries.
  - It totals 597 against the workspace's 764.
  - The hand-back's kernel "~410" is wrong; kernel is exactly 293 passed, 28 ignored.

**B5. The Boolean probe (rows 5.1 and X6: "outcome recorded, not predicted") is not recorded.**
- The X6 test's `Boolean` case never compacts, so it cannot probe anything.
- My probe: compacting a **non-null** `Boolean` changes the IPC bytes at 8/3, 0/10 and 40/20 (they are equal at 3/5).
- So H3's second clause is false for non-null `Boolean` as well as for nullable columns. The "false for nullable columns" wording in `stream.rs`'s `MAX_ATTRIBUTE_RETENTION_FACTOR` doc and `compact_attribute_slice`'s doc is incomplete.
- The live stream's narrowing to decoded equality still covers it. The result needs a class-2 row.

**D1. `SKP-V0.md:297` misquotes a commit message (round 10, by name).**
- It quotes `2963021`'s message as "stays `skp/0.5` here". The source reads `SKP_VERSION stays skp/0.5 here`, with no backticks.
- Its "land in the next commit" also spans the message's line wrap (`next\ncommit`).

### Other findings (medium)
- **X3 STOP.** The statement "No dataset exists on which to compare" is false.
  - My gate-1 C2 configuration was `Catalog::open_cancellable` with `IdentityDeclaration { skip_uniqueness_check: true }`, mapped to `i64`. The skip arm (`engine/src/dataset.rs:1464`) returns before the MIN scan.
  - The worker used `IdentityDeclaration::new`, which verifies. MultiType's `i64` holds negative values (for every prefix n = 1..64 the minimum is below zero), so the open is refused with `IdentityUnusable`.
  - The wire cannot set skip (`host_minted_identity_declaration`'s doc). Gate 1's "reachable through `open_dataset.identity`" was overstated for this fixture; that is my error.
  - With skip set, at `273a79d` all 10 columns agree. With X3's `ID_COLUMN` arm removed, `id` shows `projectable=true` while `viewport_query` returns `skp.projection_column_is_identity`, so C2 is re-established.
  - K-5 already opens through `open_cancellable`, so the case can be added there, disclosed as the engine-API route.
- **`flush`'s comment (`stream.rs:2341-2356`).** Row 5.2 keeps main's publish memory statement. Main's sentence ("…does not account for it") was replaced by "…so the ceiling arithmetic in `MAX_QUEUED_BATCHES` holds", which is false for publish, and only then narrowed to the live stream.
- **`v0/mod.rs:61` and `:66`.**
  - It says "six new `skp.projection_*` refusal codes"; there are seven.
  - "every fixture … updated in this commit" contradicts the `2963021`/`6cd1764` split that `SKP-V0` states.
- **Amendment 7** is a correction over round 12 (d)'s three-sentence ceiling, and its third paragraph adds a claim that B1 shows false. Amendment 6's "X3's STOP, stated once" paragraph restates the test comment in prose where a reference could carry it (record cap).
- **Amendment 6's cites.**
  - Line 649's "Amendment 5's own disclosed baseline drift" is Amendment 3's (line 478).
  - X19's row (line 624) points to "this amendment's own superseded index", but the content is in Amendment 5's index.
  - X10's "E-15 … recorded": no record or report holds E-15's mutation.
  - New tests are not named in the table: `a_compacted_single_run_decodes_equal_…` and `a_live_projected_text_stream_emits_…`.
  - X12's named mutation was dropped without a class-4 row.
- **`kernel/src/skp.rs:1452`** quotes "Engine messages state engine facts; owners state consequences" as §1's. The prereg's §1 (line 80) reads otherwise; the words are round 7's ruling, so cite it by round.

### Settled items from the brief
1. **Suites.**
   - `cargo test --workspace --features spatial-engine/fixture` with `CARGO_TARGET_DIR` set to the worktree's `target/`: **764 passed, 0 failed, 40 ignored**, 78 targets, exit 0, 13 min 38 s.

     | crate | passed | ignored |
     |---|---|---|
     | engine | 350 | 12 |
     | kernel | 293 | 28 |
     | skp | 47 | 0 |
     | data-plane | 42 | 0 |
     | renderer | 32 | 0 |

   - It did not hang. `lod_tier_builder` alone ran 579.6 s, printing nothing but "running for over 60 seconds".
   - The only lock wait I saw was the shell `vitest` run's own `cargo metadata`/`cargo tree` calls (`noticeDeterminism.test.ts`), which printed "Blocking waiting for file lock on package cache" while the workspace cargo was running. That matches the worker's "no compile or test-binary activity". My reading of their hang, not verified: a concurrent cargo holding that lock, plus `lod_tier_builder`'s silent window.
   - `tsc --noEmit`: exit 0. `vitest`: 72 of 72 files, 1090 of 1090 tests.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 314 of 314.
   - The six verify tools all PASS:
     - `verify.mjs` and `queue.mjs --check`;
     - `site.mjs --check`;
     - `verify-cites` (50 advisories);
     - `verify-quotes` (109 checked);
     - `verify-test-claims` (275 claims).
   - Clippy: exit 0, 38 warnings, none on a line this round adds.
2. **Mutations re-observed at `273a79d`** (each applied, run, reverted; none of this round's mutations uses `verify-mutation`).

   | row | mutation | result |
   |---|---|---|
   | X1 | placeholder final arm | fails, `skp_projection.rs:511` |
   | X2 | interleave | fails: E-6 (`attributes.rs:637`) and the multi-failure test (`:651`) |
   | X2 | restriction before shared admission | **survives** (B3) |
   | X3 | remove the reserved-`id` arm | fails, `attributes.rs:702` |
   | X4 | `From` renders the final arm for every type | fails, `attributes.rs:768` |
   | X5 | drop `REAL` | fails, `predicate.rs:1280` (also `a_float32_column_is_filterable`) |
   | X6 | publish plan declares the live retention | **survives** (B2) |
   | X6 | compacted copy drops its null buffer | fails, `stream.rs:2791` |
   | X6 | Amendment 6's always-compact | fails at 0/10, not 8/3 |
   | X7 | remove compaction | fails: E-14 (`stream.rs:2569`) and the live text test (`:2871`) |
   | X7 | `flush`'s single-run arm → `Arc::clone` | fails, live text test (`:2871`) |
   | X7 | Amendment 6's remove the 64 term | **survives** (B1) |
   | X8 | admission returns file order | fails, K-1 (`skp_projection.rs:223`) |
   | X9 | rename `known_columns`, `id_column` or `detail` (each separately) | each fails K-2 (`:379`) and the fixture-shape test (`:462`) |
   | X11 | attribute runs sliced one row late | fails, K-1 "area mismatch at id 0" (`:261`) |
   | X13 | emit `Float64` at the live entry | fails, E-8 "f32 must not widen" (`live_projection.rs:132`) |

3. **X3.** See the X3 STOP finding above.
4. **X6.**
   - Publish's single-run arm is not textually main's (`1 => Ok(Arc::clone(&runs[0]))`). With `false` it takes the same path, so it behaves identically, but no test pins the flag (B2).
   - Nullable `Utf8` through the publish arm at 8/3, 0/10 and 40/20 gives the uncompacted slice's IPC bytes. Compacted, 0/10 and 40/20 differ, while 8/3 carries no NULL and does not differ.
   - The live projected stream over `[zone, area, f32, i64, flag, text]`, 4,000 rows: 48 attribute columns checked, 0 over 5.3's bound, the worst at 0.865 of it.
5. **§8 items 15 and 17.**
   - Rendered texts compared with main `d6d9862` by Rust continuation rules are byte-identical:
     - the filter final arm, and the `AttributeUnpublishable` Display wrapper around it;
     - `From`'s dictionary, `Float32` and final arms;
     - `admit_bundle_format`'s dictionary and `Float32` texts.
   - X17's `projection_empty_list` message is new: main has no counterpart. It states a wire fact, says no "omit", and its fixture changed in the same commit (`5358ff6`). The shell does not consume it.
   - The shell diff this round is `fixtures.test.ts` only.
   - The dictionary filter reason differs from main, as §2.3 (prereg line 166) declares.
6. **Commits.** All 8 in the round are signed off:
   - fix and test commits: `cf1c3c5`, `5b0e1de`, `5358ff6`, `9348a40`, `9150cc0`, `7765b98`;
   - record commits: `4c63b12`, `273a79d`.

   Each stages exactly the files Amendment 6 or 7 declares. The prereg change is append-only: +81/−0 since `e3430d2`.
7. **Amendments 6 and 7.** Unresolved: B1, B2, B3, B4, B5, and the X3 STOP, Amendment 7 and Amendment 6 cite findings above. Resolved:
   - the commit and file lists;
   - X1, X4 (via Amendment 7), X5, X8, X9, X11 and X13;
   - X15 (1090 tests);
   - X20 (`9150cc0`, type alias).

### Suggestions and nits
- Publish's unreachable lookup refusal (`publish/mod.rs`, around line 507) uses developer text as an operator message ("resolve_projection above already proved…"). Give it an internal variant or state the engine fact.
- X5's test leaves out `LargeUtf8` and `Utf8View`, though `duckdb_type_name` covers both.
- Identifiers are split across comment lines (`skp_projection.rs:637-647`), which defeats grep.
- `SKP-V0.md` item 3 carries process chatter ("X20; Amendment 5 row 5.6 — restoring…").
- X13's recorded message names `to_bits`, but "f32 must not widen" fires first.
- Filing: the B1 gate-1 reports are under `state/consults/`, but they were filed after #129 merged, so §25 (b) puts them under `state/consults/gates/`.

### Head reviewed
`cut/b1-engine-projection @ 273a79d` (local, unpushed).
