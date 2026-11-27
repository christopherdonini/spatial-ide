*Filed by the custodian: lead-data's draft preregistration for large-utf8-and-utf8-view-attribute-columns, attribute columns of the LargeUtf8 and Utf8View types (the human's message of 2026-11-23 item 3 (d); ADV-2026-11-23-15 items 2 and 7 (d), the fourth gap piece), node:large-utf8-and-utf8-view-attribute-columns@lead-data-draft-1, dispatched at 2026-11-23T14:20:31Z. It read the repository at 0bcf5434 in a detached read worktree and ran nothing. Its run: Read 37, Grep 17, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T14:20:31Z to 2026-11-23T14:28:42Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 24809 bytes, sha256 d470fd3e8ea660a8d06077e4489dc88aae719e90e332fcf398c205a07e7b36b6, byte for byte, with one final newline added. Its form is filed beside it in the same commit, from its title; the 7 lines before the title stay here only.*

---

Result: full-form draft (class (a) under ADV-2026-11-16-06 item 2). It recommends OPEN-1 (A): the engine stops offering LargeUtf8 and Utf8View. The work is engine-only, about 170 lines over 5 files, and engine/README.md is shared with PR 350.
Blocking question (custodian): under (A), the engine's list stops matching ADR-023 §2's text list (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:47). The human accepted that decision text on 2026-09-14 (:14-15). Is narrowing it the human's call? This is OPEN-2.
Report path: state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-lead-data-draft.md (nothing written there; the report is this message)
sha256: none. No file was written, and I have no tool to hash this text. The custodian hashes the saved bytes.

---

# engine: a LargeUtf8 or Utf8View column is not admitted for projection or filtering, so the engine offers only the text type the shell reads. Full preregistration.

## Header

- **Title.** `admit_attribute_type` and `is_admitted_scalar` drop `LargeUtf8` and `Utf8View`. For a column of either type, or a dictionary over one:
  - describe reports `projectable: false`;
  - a `viewport_query` naming it is refused with `skp.projection_type_not_admitted`;
  - a filter naming it is refused as not filterable;
  - a publish naming it is refused at projection admission.
  - Nothing is cast. No existing refusal text changes. No kernel, protocol, shell or renderer file changes.
  - This title assumes OPEN-1 (A). See "Under the other answers".
- **Authority:**
  - PLAN node `large-utf8-and-utf8-view-attribute-columns` (governance/PLAN.yaml:7434-7450). Placed S3 by ADV-2026-11-16-06 item 1 (d) (state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:19).
  - The human's message of 2026-11-23, item 3 (d), and ADV-2026-11-23-15 item 7 (d). Both were filed by the custodian after 0bcf5434, and neither is on main at that commit. I read them only as the brief carries them.
  - The node's evidence:
    - lead-data's read (state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-lead-data.md);
    - the architect's read (`…-read-architect.md`);
    - the probes U1 and U2 (`…-probes-u1-u2-tester-report.md`);
    - ADV-2026-11-16-01 item 5, ADV-2026-11-16-03, ADV-2026-11-16-04 and ADV-2026-11-16-11 item 2, each under state/directives/.
  - **The reuse index:** no prior art; the miss is noted here. Byte for byte from the brief (tools/reuse.mjs, the read-only reuse clone at 89bbac37, run 2026-11-23):

```
No prior art recorded for "large utf8 view arrow string column". Research it before planning an implementation.
```

- **Class: (a), the full form and both gates**, by ADV-2026-11-16-06 item 2 (state/directives/…-adv-2026-11-16-06-….md:25-26). Why:
  - It is on the wire. It changes the value of describe's `projectable` field (protocol/skp/src/v0/commands.rs:230-235) for two types. It also changes which of those columns `viewport_query` and the filter admit (SKP-V0 §9, §7). That is item 2 (a)'s "anything on the wire".
  - ADV-2026-11-16-04 item 4 (a) read a sibling node the same way: a change to what describe says of a column is a field on the wire and asks for the full form (state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-04-….md:27).
  - It decides the seam between the engine's projectable rule and the shell's decode. Item 2 (a) names a piece that crosses a seam between modules, and item 2 (b) says "In doubt, the piece is full".
  - At about 170 lines it is under the 260-line bound, so size does not decide the class.
- **Drafted by** lead-data, on the custodian's brief, read only at main 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Every `path:line` below is at that commit. The custodian may expand any of them to a hash pin by script.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line. Self-references are by section only.
- **Branch.** `cut/large-utf8-and-utf8-view-attribute-columns`:
  - built on `cut/cancel-stamp-order` (PR 350), because both edit engine/README.md (§2 Scope; my paraphrase of the brief's reading of ADV-2026-11-23-15 item 4, which I have not read);
  - on its own checkout and its own cargo target;
  - merged by merge commit, never squashed.
- **Form path.** `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.

## §0 Disclosure

1. **The rule at main.**
   - `admit_attribute_type` admits `Utf8`, `LargeUtf8` and `Utf8View` and returns each one unchanged (engine/src/attributes.rs:78-94, the two types at :82-83).
   - `is_admitted_scalar` lists the same three types (:121-140, at :126-127). A dictionary is admitted when its value type passes that list (:101).
   - Three surfaces share this gate:
     - live and publish projection, through `type_check` (:480-496) and `admit_projection` (:536-601);
     - describe's `projectable`, through `admit_projection_column` (:509-516, called at kernel/src/skp.rs:2064-2069);
     - the filter namespace, through `filterable_column_type` (engine/src/predicate.rs:1226-1255, the call at :1249).
   - The filter's type-name map gives all three text types `VARCHAR` (predicate.rs:1283).
2. **The decode at main** (another module's; read, not changed):
   - `isReadableAttributeType` accepts `DataType.isUtf8` and no other text type (frontends/shell/src/attributes/values.ts:34-36).
   - `decodeBatch` throws on any other type (frontends/shell/src/canvas/decodeBatch.ts:127-131).
   - By the architect's read, one such column refuses every batch and the map fails as a whole (`…-read-architect.md:28-30`, `:66`). That is the architect's reading, not an observation.
3. **No ordinary file reaches either type today** (the probes at ddaabe8e, `…-probes-u1-u2-tester-report.md`):
   - On the product-configured connection, `arrow_large_buffer_size` and `produce_arrow_string_view` are `false` (:36-42).
   - Files whose text column is typed Utf8, LargeUtf8 or Utf8View all describe and stream as `Utf8` (:49-53).
   - ADV-2026-11-16-11 adds the same for a dictionary column (item 2), and says the probes are not evidence about what the app shows (item 4). This form claims nothing about what the app shows.
4. **The only source of an attribute's type** is DuckDB's Arrow export. The schema probe exports through `query_arrow` (engine/src/dataset.rs:1115-1122).
   - Every product connection runs `CONFIGURE_SQL` (engine/src/pool.rs:185-187, :201-203), which sets neither export setting.
   - The test-support `fixture::configured_connection` runs the same function (engine/src/fixture.rs:58-64).
5. **Hypothesis H-SET** (labelled; its discriminator is T1's precondition assertion). On a configured connection, `SET arrow_large_buffer_size=true` makes `query_arrow` export a `VARCHAR` as `LargeUtf8`, and `SET produce_arrow_string_view=true` makes it export `Utf8View`. I have not observed either. The setting descriptions in the probe report (:38, :42) suggest it.

## §1 What this preregistration may and may not claim

- It claims these, and nothing else:
  - the engine's admission refuses the two types and a dictionary over either;
  - describe's `projectable` follows, by the existing K-5 agreement test;
  - the product connection exports text as plain `Utf8` (T3).
- No performance number, no docs/08 row, no ADR-018 vocabulary.
- No wire shape changes. Only the values for two types change, and no ordinary file produces them.
- No ADR text is edited. ADR-023 §2 is OPEN-2.
- No string the app shows is new or changed (§4a).

## §2 The change

**Engine (the only module changed):**
1. `admit_attribute_type`: remove `D::LargeUtf8` and `D::Utf8View` from the admitted arm (engine/src/attributes.rs:82-83).
   - They then fall to the existing final arm (:109-115), which keeps its text byte for byte.
   - A short doc line above the function says why: the shell reads only plain `Utf8`, and the product connection never exports the other two.
2. `is_admitted_scalar`: remove the same two types (:126-127). A dictionary over either is then refused through the final arm, as every refused dictionary already is (:95-100).
3. `duckdb_type_name`: the `VARCHAR` arm becomes `D::Utf8` alone (engine/src/predicate.rs:1283).
   - Its doc says `None` for a type the namespace never admits (:1277-1279), and after change 1 the namespace never admits the two types.
   - The filter namespace follows the one gate, as its doc already states (:1146-1151).
4. stream.rs comment: the comment saying the gate "admits exactly the types above" (engine/src/stream.rs:2371-2373) becomes "admits only types above".
   - The `LargeStringArray` and `StringViewArray` arms (:2343-2346) stay, because ADR-017 §4's estimate rule names both (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:141-144).
   - No code line in stream.rs changes.
5. engine/README.md:
   - the "Attributes." paragraph's type sentence (:394-396) names plain `Utf8` as the admitted text type, and says the two are refused and why (my draft for the reviewer; it is not an app string);
   - in the owner's index, the preregistration list (:557) gains this form and the "Last verified at" line (:537) gains its clause.

**Kernel, protocol, shell, renderer: no change.** The seams, each read at its real interface:
- **Describe.** `projectable` = `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069). It is the wire field `FieldInfo.projectable` (protocol/skp/src/v0/commands.rs:226-236).
- **The shell.** `projectionFor` keeps only `projectable` columns (frontends/shell/src/attributes/projection.ts:15-17). `projectionSummary` lists the others as `notProjected` (:42). So the shell never requests such a column, and the existing summary names it.
- **viewport_query.** `Dataset::admit_projection` (kernel/src/skp.rs:1899) gives `TypeNotAdmitted`, which is `skp.projection_type_not_admitted` (protocol/skp/SKP-V0.md:1242).
- **Publish.** `resolve_projection` (kernel/src/publish/mod.rs:530) refuses such a column before `admit_bundle_format` (:537-539) and before the style compile (:547-548).
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. That is harmless: they judge projected or described columns, and admission refuses first.

**Scope (exact) and budget.** Five files, 220 lines (insertions plus deletions):
- `engine/src/attributes.rs`
  - regions: `admit_attribute_type`'s arm and doc; `is_admitted_scalar`; the test at :614-641; new test T2.
- `engine/src/predicate.rs`
  - regions: `duckdb_type_name`; the test at :2685-2728; new test T4.
- `engine/src/stream.rs`
  - region: the comment at :2371-2373.
- `engine/README.md`
  - regions: :394-396, :537, :557.
  - **shared with PR 350** (`cut/cancel-stamp-order`), whose owner's-index update may touch :537 and :557. One physical line is one region (ADV-2026-11-16-06 item 4), so the piece is built on PR 350's branch.
- `engine/tests/large_utf8_and_utf8_view_admission.rs` (new).

No other held piece or filed form names any of these paths.

Counting command:

```
git diff --numstat <base>...HEAD -- engine/src/attributes.rs engine/src/predicate.rs engine/src/stream.rs engine/README.md engine/tests/large_utf8_and_utf8_view_admission.rs
```

Sum the first two columns. `<base>` is `cut/cancel-stamp-order`'s head while PR 350 is unmerged, and `origin/main` after.

**Portability.** No OS-dependent feature. The tests use only in-memory DuckDB.

## §3 Sources: no fixture file

- No file is written or read.
- T1 and T3 make their type with the bundled DuckDB's own Arrow export, `SELECT 'a'::VARCHAR AS zone` through `query_arrow`. Nothing is installed and no dependency is added:
  - T1 on a configured connection with one `SET` added (H-SET);
  - T3 on a configured connection as the product configures it.
- T2 and T4 use constructed `DataType`/`Field` values. This is the accepted pattern for types `read_parquet` cannot yield (engine/src/predicate.rs:1220-1225; engine/src/stream.rs:2310-2313).

## §4 Tests, and the mutation per new test

New tests. Each is red at the base for the stated reason and green after, except T3:

- **T1** `a_large_utf8_or_utf8_view_column_duckdb_exports_is_not_projectable` (engine/tests/large_utf8_and_utf8_view_admission.rs).
  - For each `SET` of H-SET: first a precondition assertion that the exported `zone` field is `LargeUtf8`, then `Utf8View`. Then `admit_projection_column(field, "geometry", "id")` is `Err(ProjectionError::TypeNotAdmitted { .. })`, and `admit_projection(&["zone"], …)` is the same.
  - Red at base: both are admitted.
  - Mutation: restore `| D::LargeUtf8 | D::Utf8View` in `admit_attribute_type`'s arm.
- **T2** `a_dictionary_over_large_utf8_or_utf8_view_is_not_admitted` (engine/src/attributes.rs tests).
  - `Dictionary(Int32, LargeUtf8)` and `Dictionary(Int32, Utf8View)` are refused by `admit_attribute_type`.
  - Red at base.
  - Mutation: restore the two in `is_admitted_scalar`.
- **T3** `the_product_configured_connection_exports_text_as_plain_utf8` (the new file).
  - `fixture::configured_connection()`, no `SET`; the `zone` field is `Utf8`.
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if a DuckDB bump or a configuration change makes ordinary files reach either type.
  - Mutation: append `; SET arrow_large_buffer_size=true` to `CONFIGURE_SQL` (engine/src/pool.rs:185-187).
- **T4** `a_large_utf8_or_utf8_view_column_is_not_filterable` (engine/src/predicate.rs tests).
  - `filterable_column_type` refuses a constructed `LargeUtf8` field and a constructed `Utf8View` field with `FilterError::ColumnNotFilterable`.
  - Red at base.
  - Mutation: in `filterable_column_type`, return `Ok(field.data_type().clone())` for `LargeUtf8 | Utf8View` before the gate.

Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test.

Existing tests whose assertions change (declared):
- **E1** `the_live_admissible_set_admits_float32_and_a_dictionary_over_an_admitted_value_type` (engine/src/attributes.rs:614-641): `DataType::LargeUtf8` (:618) leaves the admitted list.
- **E2** `every_type_the_filter_namespace_admits_carries_a_surrogate` (engine/src/predicate.rs:2694-2728):
  - the `large` and `view` cases (:2698-2699) leave;
  - the recorded-mutation comment at :2691-2693 goes, because it records this very change as a mutation.

Kept green, unchanged:
- `describe_projectable_agrees_with_viewport_query_admission_for_every_column` (kernel/tests/skp_projection.rs:1119-1120) carries the describe seam;
- every other engine and kernel test.

**End to end.** No end-to-end or e2e test is owed, because ordinary use does not reach the case:
- No product connection exports either type (U1, U2; pinned from now on by T3).
- A file typed LargeUtf8 or Utf8View arrives as `Utf8` (U2).
- So no file can bring such a column to describe. The only way to make one is a DuckDB setting the product never sets.

The seam's real shape is covered without the app: describe's value comes from `admit_projection_column` (K-5), and the shell reads only `projectable` (projection.ts:15-17).

### §4a Strings

No string is added or changed. Two existing texts become reachable for these two types, only from a source no ordinary file is. Both are marked for the advisor (OPEN-3):
- **S1**: `type_check`'s `[B1 close placeholder]` detail (engine/src/attributes.rs:487-491). It names "(utf8, boolean, …)" while refusing `LargeUtf8`. It would go into `skp.projection_type_not_admitted`'s `detail`.
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason (predicate.rs:1249-1254) and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).

The README sentence of §2 item 5 is a module-doc sentence for the reviewer, not an app string.

## §5 Predictions · declared unchanged · invalidators · falsification

- **Predicted:**
  - T1, T2 and T4 are red at base and green after;
  - T3 is green at both;
  - E1 and E2 are green after their edits and red if the fix lands without them;
  - every other engine and kernel test stays green.
- **Declared unchanged:**
  - every file outside Scope, including all of kernel/, protocol/, frontends/, renderer/, docs/ and KNOWN-LIMITATIONS.md;
  - every refusal text, byte for byte;
  - `Utf8`, `Float32` and a dictionary over `Utf8` stay admitted;
  - the "nothing is cast" rule (engine/src/attributes.rs:28-33; engine/README.md:395-396);
  - every stream.rs code line;
  - `admit_bundle_format`;
  - `CONFIGURE_SQL`.
- **Invalidators** (each stops the piece and goes to the custodian):
  - **I1.** H-SET is false: neither setting yields its type from `query_arrow` on the bundled DuckDB. The worker may also try `SET arrow_output_version='1.4'` for Utf8View, recorded. If no setting works, T1's real-source half is replaced only by an amendment the advisor rules.
  - **I2.** T3 is red at base. That is either setting being on for the product, which ADV-2026-11-16-03 item 5 (a) grades S1: tell at once.
  - **I3.** A test outside E1 and E2 changes state.
  - **I4.** Any file outside Scope is needed.
- **Falsification:** the probes' finding that the product exports only plain `Utf8` is false.

## §6 Instruments

All are assertions: a typed outcome and a type equality. There is no measurement.

## §7 Declared values

No new constant. Budget: 220 lines and 5 files, by §2's command.

## §8 Block-on-sight

1. A file outside Scope changed.
2. Any refusal text changed.
3. Any cast, widening or layout conversion added.
4. `CONFIGURE_SQL` changed.
5. T1's precondition assertion removed or weakened.
6. A new test without its recorded mutation observation.
7. An ADR text edited.

## §9 Gates

- **Architect:** docs/01 and ADR-017 §4, ADR-021 and ADR-023 §2 (OPEN-2); the seam rule against projection.ts:15-17 and skp.rs:2064-2069; block-on-sight one by one.
- **Reviewer:** the full diff, E1 and E2, and the four mutations.
- **Suites:** `cargo test -p spatial-engine` and `cargo test -p spatial-kernel` under the machine rules. One series report at the final candidate (ADV-2026-11-16-06 item 2 (d)).
- **Operator:** no Part is owed, because ordinary use does not reach the case (§4).
- **Merge:** after the tag, and after PR 350 (its base); by merge commit.

## Under the other answers

- **OPEN-1 (B), the decode accepts both types.**
  - Nothing in engine/ changes except T3, which is worth keeping under any answer.
  - The change is in frontends/shell:
    - `isReadableAttributeType`, `readCell` and `readColumn` (values.ts:34-36, :42, :99);
    - `decodeBatch`'s re-encode by `tableToIPC` (decodeBatch.ts:132), which then has to write both types. I have not verified that apache-arrow's writer does.
  - Likely also renderer/bundle-viewer, which I have not read.
  - It is a shell form, not drafted by lead-data. Its tests build IPC with apache-arrow if it can make both types. Otherwise they use bytes written by an arrow-rs test, a crate the lockfile already holds, kept as a test file. Nothing is installed.
  - No ADR or guarantee changes.
- **OPEN-1 (C), the engine casts to Utf8 before the wire.**
  - `admit_attribute_type` emits `Utf8` for the two types, as it emits a dictionary's value type (:101).
  - The chunk loop's decode (engine/src/stream.rs:2314-2321) also casts the two to `Utf8` with `arrow::compute::cast`, already used at :2316, so there is no new dependency. A chunk over the `Utf8` offset range ends the stream with `EngineError::Arrow`.
  - Describe keeps `arrow_type: LargeUtf8` and `projectable: true`, while the batch carries `Utf8`. That is the split a dictionary already has.
  - It changes the module's stated rule (engine/src/attributes.rs:28-33; engine/README.md:395-396). It extends round 17 item 3's dictionary ruling by analogy (attributes.rs:40-43), and that is a guarantee question for the custodian.
  - Scope: attributes.rs, stream.rs, the README and the new test file, about 150 lines.
  - T1 becomes a stream.rs unit test over a DuckDB-exported `LargeUtf8` and `Utf8View` array, made by H-SET: the output is `Utf8` with equal values. Its mutation is to drop the new cast arm.

## OPEN items (to the advisor in one message; the gate does not wait)

- **OPEN-1. Which answer.**
  - (A) The engine stops offering the two types. It is the smallest change, engine-only, and keeps "nothing is cast". If a DuckDB bump ever flips a default, every text column becomes not projectable instead of the map failing, and T3 catches the flip first. Cost: it departs from ADR-023 §2's list (OPEN-2).
  - (B) The decode accepts them. It changes no ADR or guarantee, but it is two modules' code for a case no file reaches, and the writer support is unverified.
  - (C) The engine casts. It keeps both ADRs' lists, but it alters the module's stated guarantee and adds a named copy on the hot path.
  - **Recommendation: (A), with T3.**
- **OPEN-2. ADR-023 §2.**
  - It lists `Utf8`, `LargeUtf8` and `Utf8View` as admitted (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:47), and says one admission function is shared with publish (:43).
  - ADR-023 is Proposed and binds nothing (:3; engine/README.md:560). Its decision text was accepted as drafted by the human on 2026-09-14 (:14-15).
  - ADR-017 §4 (accepted) lists the format's admissible types (:122-125). (A) refuses earlier and does not contradict it.
  - Recommendation: the custodian asks whether narrowing departs from the human's accepted text. This form edits no ADR. Under (B) or (C) the question does not arise.
- **OPEN-3. S1 and S2.** Recommendation: unchanged. They become reachable only from a source no ordinary file is.
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It is the only guard against the one way the type could arrive.

## §10 Amendments

*Opens empty; append-only.*

---END OF FORM---

Note (what I could not settle, and what would need the human):

1. **H-SET is unverified.** I have not seen that `SET arrow_large_buffer_size=true` or `SET produce_arrow_string_view=true` changes what the duckdb crate's `query_arrow` exports on the bundled DuckDB (v1.5.5 by the probe). In particular, `produce_arrow_string_view` may need `arrow_output_version` 1.4. Invalidator I1 stops the piece before T1 is weakened.
2. **ADR-023.** I cannot tell whether narrowing the list counts as altering a guarantee the human accepted. The ADR's status line says it binds nothing, and its record line says the human accepted its decision text. That is the custodian's to put, and possibly the human's (OPEN-2). Answers (B) and (C) avoid it.
3. **Answer (B) is outside engine/ and kernel/.** I did not read renderer/bundle-viewer. I did not verify whether apache-arrow 21's writer (`tableToIPC`) or its builders make LargeUtf8 and Utf8View. If they cannot, (B)'s tests need IPC bytes written by an arrow-rs test, held as a test file. No install is needed.
4. **No dependency, lockfile or workflow change** under (A) or (C):
   - DuckDB settings are built in;
   - `arrow::compute::cast` is already used (engine/src/stream.rs:2316);
   - the new test file uses `duckdb` and `arrow`, both already engine dependencies (engine/Cargo.toml:23, :48), and the `fixture` feature the dev-dependency already enables (:91).
   Under (B), nothing should need installing either, but I could not confirm it.
5. **ADV-2026-11-23-15 item 4 and the human's message of 2026-11-23** are not on main at 0bcf5434. I used them only as the brief carries them. Building on PR 350's branch is the brief's reading, not mine.
6. **The class rule.** ADV-2026-11-16-06 was put in force for a week from 2026-11-16 (its item 0). I applied it because ADV-2026-11-23-15 item 7 (d), as the brief gives it, says each gap piece takes its class by that rule at its form.
7. **S2 reads oddly for these types.** It is kept byte for byte, and its "(utf8, …)" reads as if LargeUtf8 were not text. Whether to word it is the advisor's (OPEN-3).
8. **Under (A) the renderer's match-key rules stay wider than admission:** renderer/src/compiled.rs:233 and renderer/style-ts/src/style.ts:46. That is harmless as far as I read, but it is a second list. Narrowing it would be a renderer piece, and I propose none.
9. **No hash pins.** I had no tool to compute sha256. Every cite is a bare `path:line` at 0bcf5434, for the custodian's script to pin.
