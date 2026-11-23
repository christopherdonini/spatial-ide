# engine: a LargeUtf8 or Utf8View column is not admitted for projection or filtering, so the engine offers only the text type the shell reads. Full preregistration.

*Committed by the custodian on 2026-11-23 from lead-data's draft (`state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-lead-data-draft.md`; the hand-back 24809 bytes, sha256 d470fd3e8ea660a8d06077e4489dc88aae719e90e332fcf398c205a07e7b36b6): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The lines before the title and the note after the end mark stay in the consult. Read the last amendment first.*

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

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The human's message of 2026-11-23 is filed at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, and the advisor's ruling ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`. The draft is filed at `state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-lead-data-draft.md`.
2. **The node's gate.** In the same commit the PLAN node `large-utf8-and-utf8-view-attribute-columns` names this form as its gate. Its class is full, with both gates, by ADV-2026-11-16-06 item 2 (a), as its header says. The path is the one the draft proposes.
3. **Span hashes.** Every `path:line` cite above is read at 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence or list names.

- `governance/PLAN.yaml:7434-7450` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:cafb6ba8cc48e3495e86e24dd5d8d311f01b1d39ff85d08a4b0148c406d3ff06 — Header
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:19` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:308e6d216b7c77f7d3399641684dc033b45e3c32859731e643c5624136446441 — Header
- `protocol/skp/src/v0/commands.rs:230-235` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0efa03bc6a8087a60ed933f151b2c9ab4a58c6d65bf00209eeb56f36b2e4e5db — Header
- `engine/src/attributes.rs:78-94` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0338795fdaf61e5712838fd6ef27c964df21f73bdd6868f6258dbced13efd13e — §0
- `engine/src/attributes.rs:82-83` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a8384360b7a12d052fc82574d46ec49b547b9c8572a319fc2c6a25c9fe382493 — §0, §2; as written `:82-83`
- `engine/src/attributes.rs:121-140` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:568e953332b7337e9fa112de4ec6813fa5326494dac55530bf24559abe27051b — §0; as written `:121-140`
- `engine/src/attributes.rs:126-127` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:cd43e64345a169505d9af67041e567351f5e837e17f230679511cada2716a6cb — §0, §2; as written `:126-127`
- `engine/src/attributes.rs:101` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9b6ca1dd0d05aaf3e932ad6321363f716eb44ffcf0aadb3eeeb5fbeec2d24296 — §0, Under the; as written `:101` (r)
- `engine/src/attributes.rs:480-496` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:070deb73f0883a8675fcf6d536ccdca91df363b518aa25d160fa1f33c8706324 — §0; as written `:480-496`
- `engine/src/attributes.rs:536-601` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5cc3976512be9381ccb743df68701a438ee0fd0b23428b0f41a64360faefb86a — §0; as written `:536-601`
- `engine/src/attributes.rs:509-516` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:691327325c50901ea00f8ef8aeccedd373c6ad73298021467681ed51d5e55cfb — §0; as written `:509-516`
- `kernel/src/skp.rs:2064-2069` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:cf72ab6be22a5964807fa49603b2e8a7a88d70beb37465b04613e3dfab87661c — §0, §2, §9; as written `skp.rs:2064-2069`
- `engine/src/predicate.rs:1226-1255` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6e7da3ad3c972173070c5e941e5cba4cabe2ffd4592701080ae584aba7fe3250 — §0
- `engine/src/predicate.rs:1249` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a986c26169e4ef81f2719adb4fdbb9d84a77c905e43918feb6ddbfa275f31f52 — §0; as written `:1249`
- `engine/src/predicate.rs:1283` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f3059953b20e2c4b41f0eab4abb43015caa26d9297cae9f348638267b48bb2ce — §0, §2; as written `predicate.rs:1283`
- `frontends/shell/src/attributes/values.ts:34-36` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e857ae1ae55912fdebf62ed8669ca761e92bf5db27059fb13fdc61281eb28c4c — §0, Under the; as written `values.ts:34-36`
- `frontends/shell/src/canvas/decodeBatch.ts:127-131` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:50672bf66ce34f8a96272d233a8e029498e0ced2003d8554898a3f28090e2365 — §0
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md:66` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d3ac26dc3507a5b097b14ed881d14d59b35a1a008355ac0e37d85c07e3efe165 — §0; as written `:66` (r)
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md:36-42` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2d9030588bc44cec7c0512be29968bfd9a957861bd83997403d488f195716d40 — §0; as written `:36-42` (r)
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md:49-53` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:945a595e08ac2134fbe4002444e3b46dbb8c2ea176adc9172e542a2729011087 — §0; as written `:49-53` (r)
- `engine/src/dataset.rs:1115-1122` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3a07b77ea831deca1054dd181b9ddbad81a9753cc3ac56fb29d8dea4eea7bca4 — §0
- `engine/src/pool.rs:185-187` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:85ddecd14bba31865609e78ad6d68623024fe29092adc44e590c9801a1b3127a — §0, §4
- `engine/src/pool.rs:201-203` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:05b8b67b10a8d01409691e14c9275d79663bbd1886773a4c83beba0d9789ac3c — §0; as written `:201-203`
- `engine/src/fixture.rs:58-64` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5dded6ddc33f7e1c9dcec94aa8c985499e303e02baafa25b39ff8736c44fa5d1 — §0
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md:38` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:32a1eca2184b5ab8ad576033f580e99fc6220055c8d52b38e8d69a672aec0700 — §0; as written `:38` (r)
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md:42` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:00164a9bd523e937348f6e3dbfd9077df2cd505f6a50d9cabf0bd750ed9490ec — §0; as written `:42` (r)
- `engine/src/attributes.rs:109-115` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e317ad736c3e41c3b70b36269ba579d921fc9902a2bd40223e90b37ddc408b9c — §2; as written `:109-115`
- `engine/src/attributes.rs:95-100` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a94182e543aac9aee0263afd3460d4057cf10f2a54c13aabc6db8a9754be966c — §2; as written `:95-100`
- `engine/src/predicate.rs:1277-1279` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ddc32d2d261b5bb946248188426f41fe2532570dbd12f07d86c1b73668f3a901 — §2; as written `:1277-1279`
- `engine/src/predicate.rs:1146-1151` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8be84a24f75cd28964c8a5f3a4d510a895a296b547a6762bacc976cce2b9362b — §2; as written `:1146-1151`
- `engine/src/stream.rs:2371-2373` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0729787df938d0d9b34a6e703140639dccc9c36aecf4a863a7b72e1dd490e84b — §2; as written `:2371-2373` (r)
- `engine/src/stream.rs:2343-2346` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:090798cbf47a4adc08e0acc5774c399f47685a859232b397badf1685bba69cf7 — §2; as written `:2343-2346`
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:141-144` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3a372f2f19e3ad5dfe8e96ef281e97991008558fb83760077932d6697a6b2a4e — §2
- `engine/README.md:394-396` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a8df99ecad48f35f232e7cdfb425a08de7d4dd12a76a2de45cadaee18abfb6d5 — §2; as written `:394-396` (r)
- `engine/README.md:557` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:78160eed9b5b427099da7bd13569a6254abcac441379e2b198573690d45d9669 — §2; as written `:557` (r)
- `engine/README.md:537` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0302fc54e601b5e1d4475986f3bdbe142f6da33f18416663f2bc4ebf5f1dbf19 — §2; as written `:537` (r)
- `protocol/skp/src/v0/commands.rs:226-236` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:eff0b260ad5e17feff99dfa97151707976fcd6af7dab71de419f0ff65b2b0fae — §2
- `frontends/shell/src/attributes/projection.ts:15-17` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:006205bd20c283b6fc0e3e6b8212687f37bd8dca23f3c7a9ee3e061f8dcf9599 — §2, §4, §9; as written `projection.ts:15-17`
- `frontends/shell/src/attributes/projection.ts:42` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:58e2cca7751869456a953e83baecc25964050dfdf121a120fe2212bd92565840 — §2; as written `:42`
- `kernel/src/skp.rs:1899` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7088e56395c018d890708be2f819c457fd5287f0d2219e90a11c4a6058260efb — §2
- `protocol/skp/SKP-V0.md:1242` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3356c75a700bbdeb3dd07f7fc1d5e409280a866e87253cb5ca1e124af541a3f9 — §2
- `kernel/src/publish/mod.rs:530` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8e775cffb978c5e52993a868d0a207ed323a313da83bd3e34009922a5d6ae4e8 — §2
- `kernel/src/publish/mod.rs:537-539` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:bed65e84142b2ee05c365e2f1bfba2de33c1a2f3dcecdb2c27339191a16e84f3 — §2; as written `:537-539`
- `kernel/src/publish/mod.rs:547-548` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7cefb7147c1b14ec39f90316cbf44b264321985b09fb9ad5d2462a31c1dc6c24 — §2; as written `:547-548`
- `renderer/src/compiled.rs:231-239` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:574559bdf6a593abce5a4d22a5140c6d252cbbcba2631e66f7c8342828460d9e — §2
- `renderer/style-ts/src/style.ts:46` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:af9103fa69879919873b5814d0574dde97a33fbc5e1e4d7d745fcc47d87edd18 — §2
- `engine/src/attributes.rs:614-641` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8184b9375ab44629f7d813d857a3712740faaa3580b9370fc37c13f3f5604923 — §2, §4; as written `:614-641` (r)
- `engine/src/predicate.rs:2685-2728` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e92bf6e7118190a6cf956de0eff3e806d4cdda735c02da2337fdb3cac40532f6 — §2; as written `:2685-2728` (r)
- `engine/src/predicate.rs:1220-1225` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a95211369e05138465b2d40b54b2d16857fb11756854c316b39251621edb8deb — §3
- `engine/src/stream.rs:2310-2313` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:73955c2da582c0c1a4c034126454c250bedb7b01bcb3ff7180da24cc451befe6 — §3
- `engine/src/attributes.rs:618` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e1d8b09f489cb434be615f0e0ddd7e34e471fcc4514fc0f4292d687ef00593d6 — §4; as written `:618`
- `engine/src/predicate.rs:2694-2728` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5c1288bbadfb96eb7d990b56f3a6086b5a2915532e94b95c06b76135538f689f — §4
- `engine/src/predicate.rs:2698-2699` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a7e97795c7e2e5c333d74daf6ebf00506791bdd99c907a7ebf180045d2d608d3 — §4; as written `:2698-2699`
- `engine/src/predicate.rs:2691-2693` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1fb3aac4802d50930f32e9ff5b88127f0899b87906e9267947a0c73cec0dd74c — §4; as written `:2691-2693`
- `kernel/tests/skp_projection.rs:1119-1120` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5c6a208a79f54cd1e00a5c6085dd92b3ea399492cf407cb3c7c9171e60a7fd5e — §4
- `engine/src/attributes.rs:487-491` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a0a3b9e1260081f6aeb401a4b8335a6834dd14d2bb8cc11dd27c82dabc350e09 — §4a
- `engine/src/attributes.rs:111-114` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c6ea35df23ef4691b2d8d4e06920b43d4ea62bbcf76c608f9cb26a33584305e4 — §4a
- `engine/src/attributes.rs:102-108` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b4757abc615a020d95a127e6616a1cf65d5135039928a3503a0797bb82ca6869 — §4a; as written `:102-108`
- `engine/src/predicate.rs:1249-1254` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:470ba3335e31d7c2c915f20f01246f3f97f04f536584f3e346e168c5806ee875 — §4a; as written `predicate.rs:1249-1254`
- `engine/src/attributes.rs:373-376` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e30bf836c27b3e5e28ed39bd26d87e6cb8376b8a549851cca84ab0622858fc8a — §4a; as written `attributes.rs:373-376`
- `engine/src/attributes.rs:28-33` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3418a9b0cc13ac4b86efe23b9c0344c88cb4affca23cee94fc0997b428af00c5 — §5, Under the
- `engine/README.md:395-396` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e6c785afa24e3af5404c6dcc89916888455c492a902e027016a04ebe42dcff14 — §5, Under the
- `frontends/shell/src/attributes/values.ts:42` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:77bb6c576c15d75f45b69c74fe6ce6fe35482601f475b3a08d953973433bdb3e — Under the; as written `:42`
- `frontends/shell/src/attributes/values.ts:99` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0baabe81590ad35c7485b0c547f7305dda66d6acef391d80cb55a8d5e4f23c67 — Under the; as written `:99`
- `frontends/shell/src/canvas/decodeBatch.ts:132` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3a64b9fe26bb6ea8974b8ba4d3e04c03d3eb1eee6a591b88e9c085815c1872d9 — Under the; as written `decodeBatch.ts:132`
- `engine/src/stream.rs:2314-2321` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:417b862ea15d2e22797ac845e993178f22398673487178cbe17d5220e53a89d1 — Under the
- `engine/src/stream.rs:2316` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:510e60ee79942f461da57b1869629d4c49e60886a0784a7ed729f94e34e780b3 — Under the; as written `:2316`
- `engine/src/attributes.rs:40-43` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5440fd447bccb27291ed7d61a82355716e8572ef4d2fd990a12a1f34e0b99f28 — Under the; as written `attributes.rs:40-43`
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:47` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f678f7714fd164c9a2842add0601902343d50c6c9f7b41c3483b890038599b37 — OPEN items
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:43` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f1e469ad6b6043c083d31a897f0164b7ffecec4b03590d5b3b11edc328c22a99 — OPEN items; as written `:43`
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:fef6a76bfcfe66caee1dedc8c67b7ee5d2f3df134d3f3623b2082cc64398dfd5 — OPEN items; as written `:3`
- `engine/README.md:560` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2e9fa94c9fc5308014e1453a9925cd3e0343dcb807b3bbd2d9bb6862cf517699 — OPEN items
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:14-15` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b20eb127ca5223e90b6eab0c77b7b54710f6e09c2a10cc7f3f5345d0a8d6a1ce — OPEN items; as written `:14-15` (r)
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)

4. **OPEN items.** OPEN-1 to OPEN-4, and the note's items 1 to 3, go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL), and ADV-2026-11-23-21: the ruling recorded by item; scope addition (class 9): ADR-023's note; the gate's words for C1, C2, E1, E2 and D1 to D6; ADR-021; the counts; OPEN-5 to OPEN-9

*Drafted by lead-data on the custodian's brief, before any code, read only at main 5bc4011bf7c592e77fc393d84fe7403f651a48ed. Every `path:line` this amendment adds is read at that commit and listed in item 6. The gate report is `state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect.md`. The ruling is `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`. The gate's words are carried as the gate gave them, except C1 and D1, which are adapted. Every other new string is lead-data's draft for the advisor.*

1. **ADV-2026-11-23-21, by item.** Items 1 and 3 to 7: no form text changes. Item 2: the text it makes untrue is replaced in items 2 and 3 below. That text is in §1, §2's Scope, the line after the Scope list and the counting command, §5, §8 item 7, §9's Reviewer and Merge lines, and OPEN-2.

2. **Scope addition (class 9; ADV-2026-11-23-21 item 2), declared before any code.**
   - **§2 shape.** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md` joins the Scope. Its one region is the note in the fence below, appended after the file's last line (line 183 at 5bc4011b). No line above it is edited. The fence's first line is the blank line that separates the note from line 183. Expected by §2's command: 10 insertions, 0 deletions. Before writing, the worker checks that the file ends with a newline. If it does not, the worker stops: the append would change line 183's bytes.
   - **§4.** No test and no mutation: the note carries no behaviour. The reviewer's check in §9 reads it.
   - **§5.** Declared unchanged: every line of ADR-023 above the note, its Status line included. Invalidator I5 is added below.
   - **§8 and §9.** Below.
   - **The note (a draft; the advisor rules its words after this gate):**

````text

## Note 2026-11-23 (Proposed; its words ruled by the advisor under the delegation of 2026-11-13) — of §2's three text types, the engine admits plain `Utf8` alone

*Appended while this ADR is Proposed. Authority: the advisor's ruling ADV-2026-11-23-21, item 2, under the human's delegation of 2026-11-13, not the human's words (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`). No line above is edited: the Decision text and the Amendment 2026-09-29 are unchanged, the Status line included. Evidence: the probes U1 and U2 (`state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md`). Implementation: `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.*

1. **What changes.** §2's text line lists `Utf8`, `LargeUtf8` and `Utf8View`. Since the piece `large-utf8-and-utf8-view-attribute-columns`, the one admission function (`engine::attributes::admit_attribute_type`) admits plain `Utf8` alone of the three. A `LargeUtf8` or `Utf8View` column, or a dictionary over either, is refused by that function's existing final arm, with its existing text. §2's line is read with this note.
2. **Why, in the engine's own facts.** The engine takes an attribute's type only from DuckDB's Arrow export, on connections it configures itself. On such a connection, at DuckDB v1.5.5, `arrow_large_buffer_size` and `produce_arrow_string_view` are `false`, and one Parquet file of each of the three text types was described and streamed with its text column as plain `Utf8` (U1, U2). No source the engine opens is known to yield either of the other two types, so the engine refuses them rather than offer them unproven. The test `the_product_configured_connection_exports_text_as_plain_utf8` pins that export.
3. **What follows through the one function.** §2's rule of one admission function is unchanged. So `describe`'s `projectable` is false for such a column, a `viewport_query` naming it is refused `skp.projection_type_not_admitted`, and publish refuses it at projection admission.
4. **Unchanged.** Nothing is cast, widened or stringified. Every other type §2 admits stays admitted, a dictionary over `Utf8` among them. No refusal code, field or text changes, and no wire field is added. ADR-017 §4 and the bundle-format check are untouched.
5. **Not decided here:** the filter namespace, which ADR-021's Note 2026-09-24 item 1 takes from §2's list (ADR-021's own record); and whether a later piece admits either type again, which would be a new note.
````

   - **The form text this addition makes untrue.** Each Old text below occurs exactly once in the form above this amendment, checked at 5bc4011b.

Old:
```text
**Scope (exact) and budget.** Five files, 220 lines (insertions plus deletions):
```
New:
```text
**Scope (exact) and budget.** Six files, 220 lines (insertions plus deletions); the sixth, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`, joined by Amendment 2 (class 9), its one region the appended note:
```
Old:
```text
No other held piece or filed form names any of these paths.
```
New:
```text
No other held piece or filed form names any of the five paths above. For ADR-023's file, joined by Amendment 2, the custodian compares it with every held PR's files before any code (ADV-2026-11-23-15 item 4).
```
Old:
```text
git diff --numstat <base>...HEAD -- engine/src/attributes.rs engine/src/predicate.rs engine/src/stream.rs engine/README.md engine/tests/large_utf8_and_utf8_view_admission.rs
```
New:
```text
git diff --numstat <base>...HEAD -- engine/src/attributes.rs engine/src/predicate.rs engine/src/stream.rs engine/README.md engine/tests/large_utf8_and_utf8_view_admission.rs docs/adr/ADR-023-attribute-projection-on-viewport-query.md
```
Old:
```text
  - every file outside Scope, including all of kernel/, protocol/, frontends/, renderer/, docs/ and KNOWN-LIMITATIONS.md;
```
New:
```text
  - every file outside Scope, including all of kernel/, protocol/, frontends/, renderer/ and KNOWN-LIMITATIONS.md, and all of docs/ but the note appended to ADR-023; every line of ADR-023 above that note, its Status line included;
```
Old:
```text
  - **I4.** Any file outside Scope is needed.
```
New:
```text
  - **I4.** Any file outside Scope is needed.
  - **I5.** ADR-023's file changes on main, or in a held branch this piece takes in, before the note lands; or the note's ruled words state something the code under this form does not do.
```
Old:
```text
7. An ADR text edited.
```
New:
```text
7. An ADR line edited, or anything appended to an ADR but ADR-023's note (ADV-2026-11-23-21 item 2).
```
Old:
```text
- **Reviewer:** the full diff, E1 and E2, and the four mutations.
```
New:
```text
- **Reviewer:** the full diff, E1 and E2, and the four mutations; and that ADR-023's diff is the note alone, appended after its last line in the words the advisor rules, with 0 deletions by §2's command.
```

   The §8 item 7 New text follows the ruling's reading, "an ADR line edited, or anything appended to an ADR but that note" (state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md:16).

3. **The gate's words.** Each Old text below occurs exactly once in the form above this amendment, checked at 5bc4011b. Each New text replaces it. C1 is adapted to ADV-2026-11-23-21 item 2: the narrowing of ADR-023 is the advisor's, and the merge request waits on the note's words. D1 is adapted to ADV-2026-11-23-15 item 4. The rest are the gate's words, byte for byte.

**C1 (adapted).**

Old:
```text
- No ADR text is edited. ADR-023 §2 is OPEN-2.
```
New:
```text
- No line of an ADR is edited. Under (A) the engine's list departs from ADR-023 §2's text list; ADR-023 gains one appended dated note that records it, the advisor's by ADV-2026-11-23-21 item 2 and drafted in Amendment 2. The filter namespace, which ADR-021's Note 2026-09-24 item 1 defines by that list, departs with it; whether ADR-021 owes a note of its own is put to the advisor in Amendment 2. The code does not wait for the notes' words; the merge request does.
```
Old:
```text
Cost: it departs from ADR-023 §2's list (OPEN-2).
```
New:
```text
Cost: it departs from ADR-023 §2's list and from ADR-021's Note 2026-09-24 item 1, which defines the filter namespace by that list (OPEN-2).
```
Old:
```text
  - Recommendation: the custodian asks whether narrowing departs from the human's accepted text. This form edits no ADR. Under (B) or (C) the question does not arise.
```
New:
```text
  - ADR-021 (accepted), its Note 2026-09-24 item 1, defines the filter namespace's type set as ADR-023 §2's admitted-type list less dictionary-encoded columns (docs/adr/ADR-021-row-filter-on-viewport-query.md:233). Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249), so it departs from that note too.
  - ADV-2026-11-23-21 item 2 rules OPEN-2 for ADR-023: a dated note appended to it, drafted in Amendment 2. Whether ADR-021 owes a note of its own is put to the advisor in Amendment 2. This form edits no line of an ADR. Under (B) or (C) the question does not arise.
```
Old:
```text
- **Merge:** after the tag, and after PR 350 (its base); by merge commit.
```
New:
```text
- **Merge:** after the tag, after PR 350 (its base), and on a merge request that holds ADR-023's note in the words the advisor rules (ADV-2026-11-23-21 item 2) and, if the advisor rules that ADR-021 owes one, ADR-021's note in its ruled words (Amendment 2); by merge commit.
```

**C2.**

Old:
```text
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. That is harmless: they judge projected or described columns, and admission refuses first.
```
New:
```text
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. Publish runs admission before its style compile (kernel/src/publish/mod.rs:530, :547-548). A recorded `style_set` match step compiles against the file schema with no admission first (kernel/src/session_history.rs:749-758), so a client other than the shell could record a match on such a column that `viewport_query` then refuses. No file brings either type, and the shell offers only projected columns (frontends/shell/src/App.tsx:855-858). Narrowing the two rules is a renderer piece, not this one.
```

**E1.**

Old:
```text
  - describe's `projectable` follows, by the existing K-5 agreement test;
```
New:
```text
  - describe's `projectable` follows by construction: it is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), which T1 calls on a DuckDB-exported field; K-5 keeps the agreement for every column a file brings, and no file brings either type;
```
Old:
```text
The seam's real shape is covered without the app: describe's value comes from `admit_projection_column` (K-5), and the shell reads only `projectable` (projection.ts:15-17).
```
New:
```text
The seam's real shape is covered without the app: describe's value is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), which T1 calls on a DuckDB-exported field, and the shell reads only `projectable` (projection.ts:15-17).
```

**E2.**

Old:
```text
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if a DuckDB bump or a configuration change makes ordinary files reach either type.
```
New:
```text
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if VARCHAR's Arrow export on a connection configured by `configure_connection` stops being `Utf8`: a DuckDB bump that changes either setting's default, or either `SET` added to `CONFIGURE_SQL`. It reads no file, so a reader change that types a file's text column as other than VARCHAR is outside it.
```
Old:
```text
- So no file can bring such a column to describe. The only way to make one is a DuckDB setting the product never sets.
```
New:
```text
- So no file the probes tried brings such a column to describe, and the one way this form knows to make one is a DuckDB setting the product does not set (U1; T3 from now on).
```
Old:
```text
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It is the only guard against the one way the type could arrive.
```
New:
```text
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It guards the export settings, the way the probes found the type could reach the product connection.
```

**D1 (adapted to ADV-2026-11-23-15 item 4).**

Old:
```text
  - built on `cut/cancel-stamp-order` (PR 350), because both edit engine/README.md (§2 Scope; my paraphrase of the brief's reading of ADV-2026-11-23-15 item 4, which I have not read);
```
New:
```text
  - started at main's tip, taking in PR 350's head (`cut/cancel-stamp-order`) by a merge commit, because both edit engine/README.md's lines :537 and :557 (§2 Scope; ADV-2026-11-23-15 item 4). That merge commit is the piece's base, and it is recorded; the PR is opened as a draft against main, its body names the base, and it stays a draft until PR 350 is on main;
```
Old:
```text
Sum the first two columns. `<base>` is `cut/cancel-stamp-order`'s head while PR 350 is unmerged, and `origin/main` after.
```
New:
```text
Sum the first two columns. `<base>` is the recorded base of ADV-2026-11-23-15 item 4: the merge commit that takes PR 350's head into main's tip, or the later merge commit that takes in a moved head; once PR 350 is on main, `origin/main`.
```

**D2.**

Old:
```text
  - **I1.** H-SET is false: neither setting yields its type from `query_arrow` on the bundled DuckDB. The worker may also try `SET arrow_output_version='1.4'` for Utf8View, recorded. If no setting works, T1's real-source half is replaced only by an amendment the advisor rules.
```
New:
```text
  - **I1.** H-SET is false for either setting: that setting, alone or, for Utf8View, with `SET arrow_output_version='1.4'` (tried and recorded), does not make `query_arrow` export its type on the bundled DuckDB. The worker stops at the first such failure. That half of T1's real source, and T3's mutation if the failing setting is `arrow_large_buffer_size`, are then replaced only by an amendment the advisor rules.
```

**D3.**

Old:
```text
Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test.
```
New:
```text
Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test. Predicted red set: T1's mutation, T1 and T4 (the filter reaches the same arm through `filterable_column_type`); T2's, T2; T3's, T3, run in its own test binary, since the setting also exports binary columns with large buffers; T4's, T4. A temporary mutation of `engine/src/pool.rs` is not a change under §8 items 1 and 4.
```

**D4.**

Old:
```text
No string is added or changed. Two existing texts become reachable for these two types, only from a source no ordinary file is. Both are marked for the advisor (OPEN-3):
```
New:
```text
No string is added or changed. Three existing texts become reachable for these two types, only from a source no ordinary file is. S1 and S2 are marked for the advisor (OPEN-3):
```
Old:
```text
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason (predicate.rs:1249-1254) and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).
```
New:
```text
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason, inside `EngineError::AttributeUnpublishable`'s own text (predicate.rs:1249-1254; engine/src/error.rs:403-407), and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).
- **S3**: the Feature tab's line naming the columns the open does not project (frontends/shell/src/feature/FeatureTab.tsx:63, :66). It would name such a column, which is true: describe marks it not projectable.
```

**D5.**

Old:
```text
   - A short doc line above the function says why: the shell reads only plain `Utf8`, and the product connection never exports the other two.
```
New:
```text
   - A short doc line above the function says why, in the engine's own facts: the product connection exports text only as plain `Utf8` (pinned by T3), so the two types are refused rather than offered unproven. It names no other module's reader.
```

**D6.**

Old:
```text
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)
```
New:
```text
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — Header
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-04-two-nodes-from-the-architects-read-the-stream-refusal-node-after-a-read-the-dictionary-node-s3-after-b1-shell-half.md:27` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — Header
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md:28-30` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — §0
- The Header's `governance/PLAN.yaml:7434-7450` pin is historical: it holds the node as it stood at 0bcf5434; for the node's gate and summary the tree is authoritative.
```

4. **ADR-021 (C1).** No sentence of ADR-021 becomes untrue. Its Note 2026-09-24 item 1 takes the namespace's type set from ADR-023 §2's list, "which is decided by the one admission function" (docs/adr/ADR-021-row-filter-on-viewport-query.md:233). So the set narrows by reference along with ADR-023's note. But ADR-021's own record states each change to that set. Item 1 is headed "The widening, stated rather than implicit" and names the one type it adds (:233). The Note 2026-09-29 paired ADR-023's Amendment 2026-09-29 for the namespace (:237-242). By that practice I find that ADR-021 owes a note of its own. The draft below is a draft only. Whether it is needed is the advisor's (OPEN-6). ADR-021 is accepted: the note is appended at its end, and no line of ADR-021 is edited.

````text

## Note 2026-11-23 — the filter namespace narrows by reference to ADR-023: `LargeUtf8` and `Utf8View` leave it

*Appended under the advisor's ruling <id>, under the human's delegation of 2026-11-13, not the human's words. The text above is unchanged, the Status line and the earlier Notes included. Implementation: `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.*

1. **The narrowing, stated rather than implicit.** The Note 2026-09-24, item 1, takes the namespace's type set from ADR-023 §2's admitted-type list, as the one admission function decides it. ADR-023's Note 2026-11-23 records that the function now admits plain `Utf8` alone of §2's three text types. So `LargeUtf8` and `Utf8View` columns leave the namespace; against the namespace as it stood before this note, they are the two types removed.
2. A predicate that names such a column is refused with the existing `skp.filter_column_not_filterable` (fields `column`, `reason`), with the `reason` text the namespace already gives a type the function refuses. No code is added, and decision 8's eleven codes stand.
3. The Note 2026-09-24, item 2, is unchanged: dictionary-encoded columns stay excluded by name, whatever their value type.
````

   If the advisor rules OPEN-6 yes, `docs/adr/ADR-021-row-filter-on-viewport-query.md` joins the Scope on the terms item 2 declares for ADR-023: one region, the appended note, 8 insertions and 0 deletions. In that case the lines item 2 replaces (the counting command, §5, I5, §8 item 7 and §9's Reviewer line) also cover ADR-021's note, and the amendment that records the ruling says so before any change to that file.

5. **Counts.** The Scope after this amendment is six files: the five of §2 and ADR-023's file. It is seven if OPEN-6 is ruled yes. For lines, the form's estimate for the five files is about 170 (Header, Class). ADR-023's note adds 10 insertions and 0 deletions, and ADR-021's would add 8. That is about 180, or 188 with ADR-021's note, against §7's 220, so the line ceiling holds by estimate. §7's figure of 5 files no longer holds: the Scope is now six files, or seven. §7 is not edited (OPEN-8).

6. **Cites this amendment adds**, read at 5bc4011b. The cites in the New texts that Amendment 1 already pins at 0bcf5434 are not repeated here.

- `docs/adr/ADR-021-row-filter-on-viewport-query.md:233` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — items 3 and 4
- `docs/adr/ADR-021-row-filter-on-viewport-query.md:237-242` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 4
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:183` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 2
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md:16` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 2
- `kernel/src/session_history.rs:749-758` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, C2
- `frontends/shell/src/App.tsx:855-858` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, C2
- `engine/src/error.rs:403-407` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, D4
- `frontends/shell/src/feature/FeatureTab.tsx:63` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, D4
- `frontends/shell/src/feature/FeatureTab.tsx:66` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, D4; as written `:66`

7. **OPEN items.** OPEN-5 to OPEN-9 go to the advisor in one message (ADV-2026-11-23-15 item 8):
   - OPEN-5: the words of ADR-023's note;
   - OPEN-6: whether ADR-021 owes a note;
   - OPEN-7: D2 and ADV-2026-11-23-21 item 5;
   - OPEN-8: §7's file figure;
   - OPEN-9: SKP-V0 §7.3.

   The gate does not wait for them.

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — 2026-11-23 — the custodian's, at the commit that files Amendment 2: references and hashes only

*Written by the custodian at the commit that files Amendment 2, before any code. References and hashes only.*

1. Amendment 2 is lead-data's draft, appended byte for byte from its consult, `state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-amendment-2-lead-data-draft.md` (the reissued hand-back's sha256 25942ac13f2196194a2e317b4d8b06728087ffe93f6b8cfd06dfbb091cdbdfb9): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 1, FAIL (`state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect.md`, gate-log row 873), and the advisor's ruling ADV-2026-11-23-21 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`).
3. Of its 50 text blocks in three-backtick fences, 25 occur exactly once in the form above it (its Old texts; no two overlap) and 25 do not occur (its New texts). Its two blocks in four-backtick fences, the notes drafted for ADR-023 and ADR-021, occur nowhere above it. Counted by script at filing.
4. **The hashes it leaves to the custodian.** Each entry Amendment 2 marks `sha256:<by script>` is listed here with the sha256 of its lines at the commit it names (each line with its LF, computed by script at filing):

- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:afffe763f82036468ccd49d723a8878e7394c06e27587a2b245b02a987835484 — Amendment 2's entry for Header
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-04-two-nodes-from-the-architects-read-the-stream-refusal-node-after-a-read-the-dictionary-node-s3-after-b1-shell-half.md:27` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:de9a6cc0f9d569c1d1f4b8c4a12d90ca7752e606fc3b8e0103d52d173419202c — Amendment 2's entry for Header
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md:28-30` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c67bfb24e3ee0f7d5ccb5d35c4ec79fdd232b59c34de3afa3371a49da0a1e7b8 — Amendment 2's entry for §0
- `docs/adr/ADR-021-row-filter-on-viewport-query.md:233` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:dc7de2f6fb6da4d5b4972ed9855da17e8219fe33b4acec2cc2d2981492ffc4b3 — Amendment 2's entry for items 3 and 4
- `docs/adr/ADR-021-row-filter-on-viewport-query.md:237-242` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:2ef0e6ec8537b3557d3e8ef559171ce706d0ec7854febbd9cdab0604e02c4bc3 — Amendment 2's entry for item 4
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:183` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:c0d07f243abcadf2a6ea30b93c0ff2c3a7358d13ad7878417b61264da78f53e0 — Amendment 2's entry for item 2
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md:16` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:81889851b15913f4c7fe165bdf3bc8d450f5489cc43cec2cebac1cc9e8d8b432 — Amendment 2's entry for item 2
- `kernel/src/session_history.rs:749-758` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:e87bf3df836d35c70d9de851f1f6acdaa338b66a2e91ab597990e3cb7b116f8f — Amendment 2's entry for item 3, C2
- `frontends/shell/src/App.tsx:855-858` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:886ed6a35ef5843e330e89571ce1d790d62b83f89662bedb11be492532cc1325 — Amendment 2's entry for item 3, C2
- `engine/src/error.rs:403-407` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:737123126d7f4e9bd0d64ee691d93eb2a2a1ddce4f7aada7ae14d354f09a1deb — Amendment 2's entry for item 3, D4
- `frontends/shell/src/feature/FeatureTab.tsx:63` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:5fc3d7f2e024c7d723cdc8c29e1cd8546f89ee0d8cb27e75aa8d48d48e971eb6 — Amendment 2's entry for item 3, D4
- `frontends/shell/src/feature/FeatureTab.tsx:66` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:7250963a4281b75df0f346c25593a764bb9f4829dbc428cc72ba2519d0a5473e — Amendment 2's entry for item 3, D4; as written `:66`

5. **Two facts read by script at 2026-11-23T18:34Z.** No open PR among 350, 353, 356, 358, 359, 360, 361, 362 and 363 changes ADR-023's or ADR-021's file (`gh pr diff --name-only`). At 5bc4011b ADR-023 has 183 lines and ends with one LF.
6. Its OPEN-5 to OPEN-9 and its drafts go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here.
7. Next: the architect's form gate, attempt 2, on Amendment 2. No code is written before it ends PASS or PASS WITH NOTES. The merge request waits on the note's words (ADV-2026-11-23-21 item 2).

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 2 (PASS WITH NOTES): that gate's replacement words for D7 to D9, carried byte for byte, and the pin of the cite its New texts add

*Written by the custodian before any code. It carries the attempt-2 gate's own replacement words, each copied by script from the filed report in the report's order, and the pin the gate leaves to the custodian; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 2, PASS WITH NOTES (`state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect-attempt-2.md`, gate-log row 883; the hand-back's sha256 fb494d258176217167d6c0c64b75deed12acc4e76186c2f4064bfbde8848fd30). It has no Correctness and no Evidence finding. Its three Documentation findings, D7 to D9, are fixed before the merge, and none asks for another attempt (ADV-2026-11-21-20). Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it.

2. **D7:** Amendment 2 item 2, the line on the five paths.

Old:

````text
No other held piece or filed form names any of the five paths above. For ADR-023's file, joined by Amendment 2, the custodian compares it with every held PR's files before any code (ADV-2026-11-23-15 item 4).
````

New:

````text
Of the five paths above, engine/README.md is also in PR 350's Scope (`cut/cancel-stamp-order`), which the Branch bullet's base takes in. For the other four, and for ADR-023's file, joined by Amendment 2, the custodian compares them with every held PR's files before any code (ADV-2026-11-23-15 item 4).
````

3. **D8, first replacement:** OPEN-2's sentence under (A).

Old:

````text
Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249), so it departs from that note too.
````

New:

````text
Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249). That note takes the list as the one admission function decides it, so no sentence of it becomes untrue: the set it names narrows with ADR-023's note, and whether ADR-021 states that change in a note of its own is OPEN-6.
````

4. **D8, second replacement:** the Cost line.

Old:

````text
Cost: it departs from ADR-023 §2's list and from ADR-021's Note 2026-09-24 item 1, which defines the filter namespace by that list (OPEN-2).
````

New:

````text
Cost: it departs from ADR-023 §2's text list, and the filter namespace that ADR-021's Note 2026-09-24 item 1 defines by that list narrows with it (OPEN-2).
````

5. **D9:** §1's sentence on the filter namespace.

Old:

````text
The filter namespace, which ADR-021's Note 2026-09-24 item 1 defines by that list, departs with it;
````

New:

````text
The filter namespace, which ADR-021's Note 2026-09-24 item 1 defines by that list, narrows with it;
````

6. **Pin of the cite the New texts add.** Each entry gives the sha256 of those lines at fe99e848713768a6d8338b96ee2b8ac4c9c891cb (each line with its LF, computed by script), and the findings whose New text cites it. A bare `:n` is read as the file named before it in the same New text.

- `engine/src/predicate.rs:1249` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:a986c26169e4ef81f2719adb4fdbb9d84a77c905e43918feb6ddbfa275f31f52 — D8

7. **For the advisor**, in one message (ADV-2026-11-23-15 item 8): OPEN-5 to OPEN-9, with the gate's points on them in its sections 3 and 5.

8. Next: the form has passed. The build is made on PR 350's head, taken in by a merge commit (ADV-2026-11-23-15 item 4), after the custodian's comparison of item 2's New text. The merge waits on the ADR-023 note's ruled words (ADV-2026-11-23-21 item 2). Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.
