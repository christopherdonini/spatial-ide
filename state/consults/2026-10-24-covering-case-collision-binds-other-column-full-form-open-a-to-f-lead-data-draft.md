*Custodian's filing note (2026-10-24): lead-data's revision of the full form for `covering-case-collision-binds-other-column` for the human's rulings on OPEN-A to OPEN-F (2026-10-24, item 3), read only at main 4de4b9a9. The run 07:54:41Z to 08:11:36Z by its transcript (Grep 23, Read 23, Glob 1; no Write, Edit or Bash). It handed back twice: first at 08:06:24Z (sha256 e33a5a62e2e6fba13f3c6ff1a775e0cb9f90a96de7b1aca78ac69a47e89fb3a5), before the custodian's message with the architect's OPEN-E findings F-1 to F-4 reached it; then, resumed with that message, the report below, which supersedes the first. Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is bf5319afce434c44392ed146017ac2eb611b2f686c371b0d3087b39f584288a0. Its D9, an absence claim from search, is confirmed by the custodian's script at the commit that files it (the form's header note).*

---

Revised: covering-case-collision-binds-other-column, the full form for OPEN-A to OPEN-F, at main 4de4b9a9

I read the main checkout at 4de4b9a9 and ran nothing. I have no shell, so this report carries no sha256. Every cite I added is `@ 4de4b9a9`, read at main. Cites carried over keep `@ 5c6b7e37` or `@ 8bb450c9`, as the brief says. Unless a line says otherwise, the wording is my drafting.

Text that is not mine:
- The §1 item 4 sentence beginning "A `geo.primary_column` that matches none" is the architect's C-1 sentence. It is still verbatim.
- The item 9 block in §11 is the architect's 2026-10-23 redraft, section 3, carried byte for byte.
- The OPEN items section quotes the directive's line 12 byte for byte, marked as quotes.

The custodian's mid-task message passed on the architect's OPEN-E findings (`state/consults/2026-10-24-covering-case-collision-binds-other-column-item-53-open-e-architect.md`, section 5). I folded F-1 to F-4 and the test-pointer request in with the ruling. Each change below names what it answers.

## Changes against my revised form (2026-10-23), by section

- **Header line.** Records this revision at 4de4b9a9, for the ruling of 2026-10-24 (item 3) and the architect's F-1 to F-4. Bookkeeping.
- **Authority.**
  - Added a bullet for the human's ruling of 2026-10-24, item 3 (`:12 @ 4de4b9a9`), and one for the architect's OPEN-E findings.
  - The reuse index now carries the custodian's two new queries byte for byte beside the three already there: "Five misses" (brief, reuse index).
- **§0.**
  - Inputs: added the ruling, the OPEN-E findings, `check_geometry_column` at main, the shared writers in `engine/src/fixture.rs`, and the compat corpus manifest.
  - Added D8: a primary column with a case-only twin opens at main. The case is `hostile_names_colliding_after_case_folding_bind_one_column_each`, which B1's form calls a control that comes along unchanged (OPEN-E, F-1).
  - Added D9: no other test or fixture reaches the widened check, by my search. It is an absence claim, for the custodian to confirm by script (OPEN-E, §5 of the brief).
  - Added H-D for byte-equal duplicates. It is not predicted (F-2).
- **§1.**
  - Item 1 now says byte-equal names count (OPEN-E; CC-8).
  - Item 4 gains two sentences of mine before the C-1 sentence: the more-than-one refusal (OPEN-E), and that the later sentences apply only to a name matching at most one file name ignoring case. That keeps C-1's verbatim sentence true (F-3; G-7's `Geometry` case).
  - The OPEN-D bullet names the proposed node `engine-open-neighbour-reads-unbound-to-cancel` (engine lane, S3; `PLAN.yaml:4298 @ 4de4b9a9`), with no KNOWN-LIMITATIONS line (OPEN-D).
  - The limit "Duplicate byte-equal names for the primary column are not judged" is removed. A new limit in its place: case twins that the geo metadata does not name are not judged (OPEN-E, F-1).
- **§2.3, rewritten (OPEN-E, F-3).**
  - Step 1 is the new more-than-one check, run first. The text states where it runs against the absent arm (G-7), the renamed arm (G-1), and the U+0000 and type checks (no test; §8 item 15).
  - The existing steps move to 2 to 4. Step 2's miss arm now names G-3's single case-only match. Step 3 states that after step 1 it is reachable only by a generated-name collision (G-2).
- **§2.6 (OPEN-A, OPEN-E, F-4).**
  - New draft text (a-p) for the primary column's more-than-one refusal. It is a new text, not text (a) reused, because (a) begins "the covering names" and names a path. The reason is stated in the form.
  - The P6-marker line now records OPEN-A as ruled.
- **§3 (OPEN-E, F-2, F-3).** Added four rows, each with its consequence declared in advance:
  - s4: byte-equal struct names.
  - g6: byte-equal geometry names.
  - g7: `Geometry` beside `geometry`, `GEOMETRY`.
  - g8: N-8's U+0000 file, whose parquet_schema name the rewritten §2.3 now depends on. g8 is not forced by OPEN-E; see What I could not settle.
  - W1 to W3 and W-tree settle whether the byte-equal tests are written.
- **§4 (OPEN-E, F-1 to F-4).**
  - G-1 retargeted to text (a-p) and renamed. MG1 is redefined as an order mutation (renamed check before the more-than-one check), because the old MG1 no longer fails G-1.
  - G-3's declared name changed from `geom` to `GEOMETRY` (one case-only match, none byte for byte), with a second mutation, MG10.
  - Added G-5 (case-only, MG6), G-6 (byte-equal, MG7), G-7 (order against the miss arm, MG9), CC-8 (byte-equal covering, MC8) and CC-9 (case twins not named by the geo metadata open, MC9; F-1's clause 12 evidence).
  - Declared the edit of `hostile_names_colliding_after_case_folding_bind_one_column_each` (F-1) and removed that test from the unchanged list.
  - The MG4/MG1 note is rewritten, and a shared-helper note is added for MG7 and MC8.
- **§5 (OPEN-E, F-1).**
  - States the declared change: a file whose primary column has a case-only twin opens at main and is refused after.
  - Names each existing case it reaches, by test and fixture, with its outcome at main and after.
  - The changed-outcome list is extended to the new tests. Predictions, invalidators and falsification are extended.
- **§6.** Unchanged, byte for byte (OPEN-F).
- **§7, re-derived (OPEN-B, OPEN-E, F-1).**
  - `engine/src/dataset.rs` goes from 300 to 330.
  - The new test file goes from 510 to 660.
  - `engine/tests/b1_projection_hostile_names.rs` is added at 15.
  - `KNOWN-LIMITATIONS.md` is 6, with no 4-line alternative (OPEN-B ruled yes).
  - Totals go from 820 lines over 4 files to 1,015 over 5. The budget goes from 330 to 395 minutes.
- **§8 (OPEN-E, F-1, F-3).** Item 2 extended to primary-column ambiguity. Item 10 extended to the b1 test file. New item 15: the primary checks' order and comparison.
- **§9 (OPEN-A).** The sight list gains (a-p) and records OPEN-A as ruled.
- **§10.**
  - Added a row for `engine/tests/b1_projection_hostile_names.rs`.
  - Re-read #241's list and port-2's list, with its Amendments 4 and 5, at 4de4b9a9.
  - Records OPEN-B and OPEN-C as ruled.
- **§11 (brief item 7, OPEN-B).**
  - Item 53's block now holds exactly the slot line. The placement line and both notes are kept.
  - A third note of mine names the OPEN-E test ids for the pointer slot.
  - Item 9's line records the sentence as added under OPEN-B. Item 9's sentence is carried unchanged, because OPEN-E does not change it (see What I could not settle).
  - The intro line now says which block is a slot and which is carried.
- **The five-line form's closing amendment (brief item 9).** References gain the 2026-10-24 directive's item 3. Item 3 names what carries over by that ruling (OPEN-B: F-2; OPEN-C: the five-line form's OPEN-4 (A)). Everything else is as drafted.
- **OPEN items (brief item 8).** OPEN-A to OPEN-F are recorded as ruled, quoting `:12 @ 4de4b9a9`. No new OPEN item is added. The widening forces the b1 test edit, but F-1 asks the form to declare that edit, and the gates check it. No decision goes outside the gates.
- **Not changed.** §2.1, §2.2, §2.4, §2.5, §2.7, §2.8, §6, Gating, the Amendments heading.

## The revised form

````markdown
# A name the file supplies is judged against the file's own names: a covering path or a primary column matching more than one of them, or one whose bound column is not the column the file names, refuses the open, and so does a renamed primary column (full form; PLAN node `covering-case-collision-binds-other-column`)

*Proposed path: `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md`. There is a precedent for the `-FULL-` name: `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md`, `engine/README.md:550 @ 5c6b7e37`.*

*Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line, and states what it touches or invalidates.*

*Drafted by lead-data on the custodian's brief, read at main 5c6b7e37, from the inputs §0 lists. Revised by lead-data at main 8bb450c9 on the architect's findings C-1, E-1 and E-2 and its item 53 redraft. Revised again by lead-data at main 4de4b9a9 for the human's rulings on OPEN-A to OPEN-F and the architect's OPEN-E findings F-1 to F-4 (Authority). Every cite keeps the commit it was read at.*

*This form supersedes the five-line form `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md`. That form closes with the custodian's class-1 amendment; the section "What the five-line form's closing amendment records" says what it must hold.*

*The P0 (§3) runs before any code. Its result is recorded in one class-1 amendment, and only then does code start. The custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file.*

## Authority

- **PLAN node** `covering-case-collision-binds-other-column`: `PLAN.yaml:4262 @ 5c6b7e37`. Its RULED summary: `PLAN.yaml:4277 @ 5c6b7e37`.
- **The human's rulings on the architect's route read**, the covering-case paragraph of `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:12 @ 5c6b7e37`:
  - OPEN-1: route 1.
  - OPEN-2: clauses (a) and (b).
  - OPEN-3: absence is judged against the file's names.
  - OPEN-4: a split yardstick.
  - OPEN-5: this new full form, its P0 first.
  - OPEN-6: the primary_column check joins this piece. Its new refusal is `engine.geo_metadata`. The existing "does not contain" text and code stay byte for byte.
  - OPEN-7: the LOD identity is its own node, `lod-tier-identity-binds-file-name`, at `PLAN.yaml:5853 @ 5c6b7e37`.
  - OPEN-8: the architect redrafts item 53.
  - OPEN-9: the new statement is bound to the cancel token. The neighbours' unbound reads are recorded as a gap.
- **The human's rulings on this form's OPEN-A to OPEN-F**, item 3 of `state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md:12 @ 4de4b9a9`, recorded under OPEN items. In short (my words): no P6 marker, the texts sighted before the merge; item 9's sentence added and the primary-column refusal in item 53; code proceeds, with the owner's-index commit after #241; the unbound-read gap a proposed PLAN node; the widening of clause (a) to the primary column and to byte-equal names; no measurement claim.
- **The route read:** `state/consults/2026-10-23-covering-case-collision-binds-other-column-route-architect-read.md`, sections (1) Route 1, (2) and (3).
- **The item 53 redraft and its findings:** `state/consults/2026-10-23-covering-case-collision-binds-other-column-item-53-route-1-architect.md`. It has section 2 (item 53's words, now replaced by the OPEN-E redraft), section 3 (item 9's appended sentence), section 4 (the clause checks) and section 5 (C-1, E-1 and E-2, answered in §1, §2.3, §2.4, §3, §4 and §5).
- **The OPEN-E redraft and its findings:** `state/consults/2026-10-24-covering-case-collision-binds-other-column-item-53-open-e-architect.md`. Its item 53 words are spliced into §11 by the custodian. Its section 5 (F-1 to F-4, and the test pointers) is answered in §1, §2.3, §2.6, §3, §4, §5, §7 and §11.
- **The evidence it rests on:**
  - The earlier P0: `state/consults/2026-10-23-covering-case-collision-binds-other-column-p0-worker-report.md` and `state/drafts/covering-case-collision-p0/p0-output.txt:184-215 @ 5c6b7e37`.
  - The siblings check: `state/consults/2026-10-23-engine-column-name-case-siblings-lead-data-check.md`, facts A and B, path 1.
- **The machine rules for every heavy run:** `state/directives/2026-10-06-machine-script-adopted.md`.
- **Reuse index:** the custodian supplied the output of `node tools/reuse.mjs` from the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, carried here byte for byte. Five misses, noted, not blocking:

```text
$ node tools/reuse.mjs parquet footer column names
No prior art recorded for "parquet footer column names". Research it before planning an implementation.
$ node tools/reuse.mjs case insensitive column collision
No prior art recorded for "case insensitive column collision". Research it before planning an implementation.
$ node tools/reuse.mjs geoparquet primary column
No prior art recorded for "geoparquet primary column". Research it before planning an implementation.
$ node tools/reuse.mjs duplicate column names
No prior art recorded for "duplicate column names". Research it before planning an implementation.
$ node tools/reuse.mjs geometry column ambiguous
No prior art recorded for "geometry column ambiguous". Research it before planning an implementation.
```

## Gating

This piece takes full gating, the reviewer and the architect, from dispatch (`AUTONOMY.md:315-332 @ 5c6b7e37`). It crosses §21c on two bounds: new user-visible behaviour, and well over 150 changed lines (`AUTONOMY.md:349-353 @ 5c6b7e37`). The human's OPEN-5 sends it to this form. No five-line form is committed for it.

## §0. Disclosure

**Inputs.**
- The route read (whole); the item 53 redraft, sections 2 to 5; the OPEN-E findings, section 5.
- The five-line form with its Amendments 1 and 2; the P0 report and both outputs; the siblings check.
- The human's ruling of 2026-10-24, item 3.
- In `engine/src/dataset.rs`: the open path, `judge_covering`, `field_path_exists`, `check_geometry_column`, `read_kv_metadata`, `probe_schema`, `cancellable` and the sanity reads.
- `engine/tests/b1_projection_hostile_names.rs`, and the shared writers in `engine/src/fixture.rs` (`write_hostile_names`, `write_hostile_geometry_name`, `write_hostile_covering`).
- `engine/compat-corpus/of-record/MANIFEST.json`'s column lists.
- `engine/B1-PROJECTION-PREREGISTRATION.md`'s E1 to E5, its block-on-sight item 29 and its §12.2 control-test list.
- `AUTONOMY.md` §21; the template; the forms of the in-flight pieces (§10).

**What the code does today (at 5c6b7e37, and unchanged at 4de4b9a9):**

- **D1. The open's order.**
  1. `read_kv_metadata`, not bound to the cancel token (`engine/src/dataset.rs:354 @ 5c6b7e37`; the function is at `:1075-1099`).
  2. `probe_schema`, not bound (`:428`; the function is at `:1101-1164`).
  3. `check_geometry_column` (`:429`).
  4. `judge_covering` (`:436`).
  5. `sanity_check`, whose reads are bound through `cancellable` (`:524-532`; `cancellable` is at `:1474-1492`).
  6. The identity scan (`:558`).
  7. The descriptor (`:565`).

  Everything runs on one Maintenance lease (`:348-350`).
- **D2. The resident schema** carries DESCRIBE's bound names (`:1101-1164`).
  - DuckDB renames the later of two names that differ only by ASCII case, at the top level and among struct children (`state/drafts/covering-case-collision-p0/p0-output.txt:185-215 @ 5c6b7e37`).
  - A real name that collides with a generated one is renamed again. Resident `Zone_1` reads the file's `Zone` (`engine/tests/b1_projection_hostile_names.rs:228-267 @ 5c6b7e37`; the asserted names are at `:262`).
- **D3. The covering walk** (`engine/src/dataset.rs:1439-1472 @ 5c6b7e37`) compares each segment ASCII case-insensitively against the resident names and takes the first match. `judge_covering` (`:1415-1437`) checks U+0000 first, then absence in xmin, ymin, xmax, ymax order.
- **D4. The geometry check** (`engine/src/dataset.rs:1891-1926 @ 5c6b7e37`) looks the name up by byte equality among the resident names. A miss refuses as `EngineError::Source`. Byte-copied from `:1906`: `` "`geo.primary_column` names `{}`, which the file does not contain", ``.
- **D5. Observed on main** (the earlier P0's r2): a file that writes `BBOX` before `bbox`, with its covering declaring `bbox`, opens with the covering kept. A bbox stream over the declared struct's true extent then returns 0 rows (`state/drafts/covering-case-collision-p0/p0-output.txt:192-199 @ 5c6b7e37`).
- **D6. `parquet_schema` returns the file's own names at the top level.** Case c14 gave `"zone", "Zone", "Zone_1"`, after a root row (`state/drafts/a2-1-p0/p0-output.txt:185-188 @ 5c6b7e37`; `engine/B1-PROJECTION-PREREGISTRATION.md:812-817 @ 5c6b7e37`). The same source shows `parquet_schema` disagreeing with the binder for an empty name, which the binder calls `C2` (c07). Struct children were never measured.
- **D7. B1's block-on-sight item 29** forbids `parquet_schema` as the discriminator (`engine/B1-PROJECTION-PREREGISTRATION.md:981 @ 5c6b7e37`). N-15's mutation swaps DESCRIBE for `parquet_schema` (`engine/tests/b1_projection_hostile_names.rs:801-809 @ 5c6b7e37`). This piece does not touch the resident names (§2.1, §8 item 5).
- **D8. A primary column with a case-only twin opens on main.**
  - `hostile_names_colliding_after_case_folding_bind_one_column_each` (`engine/tests/b1_projection_hostile_names.rs:233-268 @ 4de4b9a9`) writes primary `geometry` (`:101`) beside a `Utf8` column `GEOMETRY` (`:252`). It opens, and asserts the twin's resident name `GEOMETRY_1` (`:262`).
  - D4's lookup takes the first resident name that is byte-equal to the declared one (`engine/src/dataset.rs:1900-1903 @ 4de4b9a9`), so the twin is never judged.
  - B1's form lists that test among the control tests that "come along unchanged" (`engine/B1-PROJECTION-PREREGISTRATION.md:885-887 @ 4de4b9a9`).
- **D9. No other existing test or fixture reaches the widened check**, by my search: Grep, read only. This is an absence claim; the custodian confirms it by script at the gate.
  - **The search.** Case variants of the primary-column names used in tests (`geometry`, `geom`), searched across `engine/`, `kernel/`, `protocol/` and `frontends/`. The only case variant is D8's.
  - **The shared writers.** `write_hostile_names` (`engine/src/fixture.rs:1582-1600 @ 4de4b9a9`), `write_hostile_geometry_name` (`:1604-1622`) and `write_hostile_covering` (`:1688-1767`) write `id`, one geometry column and the caller's columns. No caller passes a twin of the geometry column.
  - **The compat corpus.** Its manifest lists one geometry-named column per file. Its `.parquet` files are not in the tree, so only the manifest was read.
  - **Byte-equal duplicates.** No test writes byte-equal duplicate column names.

**Hypotheses, each with the discriminator that settles it in the P0 (§3):**

- **H-S.** `parquet_schema` at DuckDB v1.5.5 gives struct children their own, unrenamed names. Its rows rebuild the tree in pre-order by `num_children`.
- **H-K.** For one file under a `k=v` folder, DESCRIBE's column count equals the root's `num_children`. Not predicted: no record in `engine/` names hive partitioning.
- **H-G.** A covering declaring a generated-colliding name (`BBOX_1` beside `bbox`, `BBOX`) is kept today and reads the other struct, at the top level and among children. A primary column declared `GEOM_1` beside `geom` and `GEOM` streams the file's `GEOM`. This is code reading by the route read, section "What the P0 settles", and by the siblings check, path 1. Not reproduced. The same holds, by the item 53 redraft's C-1 (code reading, not reproduced), for a primary column declared `GEOMETRY_1` beside `geometry` and `GEOMETRY`, a name the file does not hold: it opens today and streams the file's `GEOMETRY` (row g5).
- **H-D.** Not predicted. Whether the crate's `arrow` and `parquet` writer writes two byte-equal column names. Whether `parquet_schema` lists both. What DESCRIBE names them. Whether `Dataset::open` at main reaches the geometry check for such a file. No record in `engine/` measures any of these (rows s4, g6).

No 5 GB fixture is read, so the fixture-drive confound does not apply.

## §1. What this preregistration may and may not claim

**It may claim, once its tests are green** (Windows 10 Pro 22H2, MSVC, bundled DuckDB v1.5.5, the module's stated scope at `engine/README.md:521-524 @ 5c6b7e37`):

1. **(a)** An open is refused by name, with `engine.geo_metadata`, when a declared covering segment matches, ignoring ASCII case, more than one of the file's own names at its level. This holds even when one of those names is spelled exactly as declared. Two byte-equal names count as two (OPEN-E; CC-8).
2. **(b)** An open is refused by name, with `engine.geo_metadata`, when the resident column at the position of the single file name a segment matches does not itself match that segment ignoring ASCII case. In that case the declared name cannot read the column the file names.
3. **Absence** is judged against the file's names. A covering whose segment matches none of them is dropped as absent, with the existing Absent detail byte for byte. This includes a name DuckDB generated.
4. **The primary column.** A `geo.primary_column` that matches more than one of the file's top-level names, byte-equal or ignoring ASCII case, refuses the open by name as `engine.geo_metadata`, naming the declared name with the file's names it matches. This is clause (a), as for each part of a covering path (OPEN-E). The sentences after this one apply only to a name that matches at most one of the file's names ignoring ASCII case. A `geo.primary_column` that the file contains, at a position where DuckDB renamed the column, refuses the open as `engine.geo_metadata`. A `geo.primary_column` that matches none of the file's names byte for byte is refused as `engine.source` with today's text byte for byte; that includes a name spelled like a generated name, such as `GEOMETRY_1` beside `geometry` and `GEOMETRY`, which today opens reading the file's `GEOMETRY`.
5. **Order.** Every one of these refusals comes before `sanity_check`, the identity scan and the descriptor.
6. **Cancellation.** The one new statement is bound to the open's cancel token.

**It may not claim, and these are its limits:**

- **No performance number, and no `docs/08` row.** The open gains one footer-bounded statement. The cold-open budget (`docs/08_Testing.md:7 @ 5c6b7e37`) is not re-measured. No cancellation latency is claimed (`docs/08_Testing.md:8 @ 5c6b7e37`).
- **No wire change.** No SKP message, literal, field or code is added. The refusals travel through existing arms: `EngineError::GeoMetadata` to `geo_metadata` (`kernel/src/skp.rs:2118 @ 5c6b7e37`), `Source` (`:2060`) and `InternalInconsistency` (`:2115-2117`).
- **No ADR is cited as changed.** ADR-023's 2026-09-29 amendment (Proposed) is not touched.
- **ASCII case only.** A difference in the case of a letter outside A to Z counts as a different name, as today.
- **The split yardstick (OPEN-4).** Only names the file supplies are judged against the file's names: the covering's paths and `geo.primary_column`. Names the operator supplies stay judged by the app's names, unchanged: projection, filter, a declared identity. So do the `file_row_number` session ordinal and the filter's `ID`/`"id"` alias case.
- **Case twins the geo metadata does not name are not judged.** A file holding `zone` and `Zone`, or `ID` beside its `id`, opens as today, with DuckDB's renamed names (CC-9, and the edited `hostile_names_colliding_after_case_folding_bind_one_column_each`). Only a name matched by a covering segment or by `geo.primary_column` is judged.
- **Byte-equal duplicates below the top level** are judged by the same walk as CC-2's children and are not tested apart. CC-8 is a top-level test.
- **The LOD identity divergence stays open** (OPEN-7, its own node). Its geometry half is closed by item 4: once a renamed primary column is refused, the file's name and the bound name are the same.
- **The neighbours' unbound reads stay a recorded gap (OPEN-9), not this piece's fix.** These are `read_kv_metadata` and `probe_schema`'s two statements. The gap is recorded as the proposed PLAN node `engine-open-neighbour-reads-unbound-to-cancel` (engine lane, graded S3; `PLAN.yaml:4298 @ 4de4b9a9`), with no KNOWN-LIMITATIONS line (OPEN-D).
- **No macOS or Linux claim.** The tests are portable correctness tests and run in each CI job (§2.7).

**Declared unchanged** is in §5. **Seams** are in §2.8.

## §2. The change, stated before it is applied

All code is in `engine/src/dataset.rs`. One existing test is edited (§4).

### 2.1 The read (OPEN-9)

- **What it is.** One new private function, `read_file_names(conn: &Connection, path: &str, cancel: &CancelToken) -> Result<NameNode>`. It runs exactly one statement, `SELECT name, num_children FROM parquet_schema(?)`, drained in full inside `cancellable` (`engine/src/dataset.rs:1474-1492 @ 5c6b7e37`).
- **Where it runs.** On the open's existing connection, between `probe_schema` (`:428`) and `check_geometry_column` (`:429`).
- **Its errors** map as the neighbours' do (`:1076-1093`), to `EngineError::Source`, with three draft texts: `prepare parquet schema: {e}`, `read parquet schema: {e}`, `parquet schema row: {e}`.
- **Reading the rows:**
  - `name` is read as `String`. A NULL name is a row error.
  - `num_children` is read as `Option<i64>`. NULL is read as 0.
- **Rebuilding the tree.**
  - A private `struct NameNode { name: String, children: Vec<NameNode> }` is rebuilt in pre-order by `num_children`.
  - The first row is the root. Its name is the writer's root name, not a column, and is never compared.
  - If the rows do not form exactly one tree, the open refuses as `EngineError::InternalInconsistency`, with draft detail (i-tree) in §2.6. That happens when a node claims more children than rows remain, a count is negative, or rows remain after the root's subtree.
- **What it does not touch.** `probe_schema` and every resident name are unchanged, so B1's item 29 and N-15 stand. The file's names are a second input to the decisions below. They never rename or replace a resident field. One reader stays in the open path, through DuckDB (`engine/src/dataset.rs:6-8 @ 5c6b7e37`; `docs/05_Data_Engine.md:9 @ 5c6b7e37`).
- **Comments.** The comment at `engine/src/dataset.rs:339-347 @ 5c6b7e37` gains the read in its list of what the connection serves. The comment at `:431-435` changes from "the declared paths and the resident schema" to name the file's name tree as well.

### 2.2 Alignment (positions)

- **The rule.** The root's children line up with the resident top-level fields by position. A resident `Struct` field's children line up with the children of the file node at the same position.
- **The root.** A new pure function, `check_names_align(&NameNode, &SchemaRef) -> Result<()>`, runs at the call site after the read and before both checks. Its rule is chosen by the P0's H-K outcome (§3):
  - **K1:** the counts must be equal.
  - **K2:** the file's columns come first, and any trailing resident fields are names the file does not hold.
  - **Mismatch:** `EngineError::InternalInconsistency`, draft detail (i-root).
- **A struct.** When the covering walk descends into a resident `Struct` field at position j, file node j's child count must equal the struct's child count. Otherwise the open is refused as `EngineError::InternalInconsistency`, draft detail (i-struct). The check runs only along the levels a covering path descends.

### 2.3 The primary column (OPEN-6, OPEN-E)

`check_geometry_column(schema, file_names, geometry_column)`, still pure. Its steps run in this order.

1. **More than one (clause (a), OPEN-E).**
   - Let M be the root children whose name equals `geometry_column` ignoring ASCII case. A byte-equal name is one of them.
   - If M holds more than one name, the open is refused as `EngineError::GeoMetadata`, draft detail (a-p) in §2.6, listing M's names in the file's schema order. Two byte-equal names are listed once each.
   - This step runs first:
     - **Before the absent arm (step 2).** A name that matches no file name byte for byte, but matches two or more ignoring case, is refused by (a-p), not by D4's text. The case is `Geometry` beside `geometry` and `GEOMETRY` (P0 row g7, test G-7). At main that file is refused as `engine.source` with D4's text.
     - **Before the renamed arm (step 3).** A name spelled exactly like the later of two case twins, the one DuckDB renamed, is refused by (a-p), not by (g). The case is `GEOMETRY` beside `geometry` (row g3, test G-1).
     - **Before the U+0000 and type checks (step 4).** Those checks look at one resident field, the one at j, so a file whose primary column has a twin is refused by (a-p) whatever that field's bytes or type. No test separates this order; §8 item 15 holds it.
   - Steps 2 to 4 run only when M holds at most one name.
2. **Absent.** Let j be the root child whose name is byte-equal to `geometry_column`. If there is none, the existing arm runs unchanged: `EngineError::Source`, with the text byte-copied in D4. It is now true by the file's names.
   - This includes a name that M holds once, but only ignoring case: `GEOMETRY` over a file holding only `geometry` (test G-3). That file is refused the same way at main.
   - It also includes a name spelled like a generated one, such as `GEOMETRY_1` beside `geometry` and `GEOMETRY` (P0 row g5, test G-4). At main that file opens reading the file's `GEOMETRY`, and after this change it is refused. Its outcome changes; its text and code do not.
3. **Renamed.** If the resident field at j is not byte-equal to `geometry_column`, the open is refused as `EngineError::GeoMetadata`, draft detail (g) in §2.6. That is the case where DuckDB renamed the file's column. After step 1, it is reachable only where the rename comes from a collision with a generated name: `GEOM_1` beside `geom` and `GEOM` (row g2, test G-2).
4. **U+0000 and type.** Otherwise the existing U+0000 check (`:1910-1915`) and type check (`:1916-1924`) run on the resident field at j, unchanged.

### 2.4 The covering (OPEN-1, OPEN-2, OPEN-3)

**The signature.** `judge_covering(covering, schema, file_names) -> Result<Option<CoveringFinding>>`. It is pure: no `Connection`, no statement. The call site becomes `judge_covering(geo.covering.as_ref(), &file_schema, &file_names)?`.

**The order:**

1. No declared covering gives `Ok(None)`.
2. A U+0000 path gives `Ok(Some(NotAddressable))`, unchanged and first, whatever the other paths match.
3. Each of xmin, ymin, xmax and ymax, in that order, is walked by `field_path_exists`. The function keeps its name and its ASCII case-insensitive segment comparison, so C-3's recorded mutation still applies (`engine/tests/covering_names_missing_column.rs:195-199 @ 5c6b7e37`). It takes the file's name tree and returns one of:
   - Resolves;
   - Absent;
   - Ambiguous (the file paths it matched);
   - Misbound (the file path and the resident path);
   - Inconsistent (§2.2's struct check).
4. The first Ambiguous, Misbound or Inconsistent walk, in path order, refuses the open:
   - `Err(GeoMetadata)`, with draft text (a) or (b);
   - or `Err(InternalInconsistency)`, with (i-struct).
5. Otherwise the first Absent path gives `Ok(Some(Absent { path }))`, with the existing Absent detail byte for byte (`engine/src/dataset.rs:1407-1410 @ 5c6b7e37`).
6. Otherwise `Ok(None)`.

So a covering with one ambiguous path and one absent path is refused, never opened with the covering dropped, whichever path comes first (CC-2, CC-7).

**The walk, at each level** (F is the file nodes, R the aligned resident fields):

- **(a)** The segment matches more than one name in F ignoring ASCII case: Ambiguous.
- **Absent** (OPEN-3): it matches none.
- **(b)** It matches exactly one, at j, and `R[j]`'s name does not match the segment ignoring ASCII case: Misbound.
- **Descending.** Another segment follows, but `R[j]` is not a `Struct`: Absent, as today. Otherwise §2.2's struct check runs and the walk descends.

Clause (b) compares `R[j]` alone. It never asks whether some other resident field also matches. That keeps a struct with a child named `xmin\0x` beside `xmin` admitted as today: the export truncates that child's resident name, while DuckDB's own child names stay unique.

### 2.5 What is unchanged at the call site

`covering_finding` keeps its type `Option<CoveringFinding>` into `sanity_check` and into the store-or-drop step (`engine/src/dataset.rs:582-587 @ 5c6b7e37`).

### 2.6 The refusals and their detail texts (drafts for the human's sight, not the human's words)

Every path is rendered through `render_visible_escape`. A file path or resident path runs down to the failing level, its segments joined by `.`.

```text
(a) GeoMetadata: the covering names `<declared path>`, which matches more than one name in the file's schema when ASCII letter case is ignored: `<match>`, `<match>`[, ...]
(a-p) GeoMetadata: `geo.primary_column` names `<name>`, which matches more than one name in the file's schema when ASCII letter case is ignored: `<match>`, `<match>`[, ...]
(b) GeoMetadata: the covering names `<declared path>`, which the file's schema holds as `<file path>`, but that column is read under the name `<resident path>`, so the declared name does not read it
(g) GeoMetadata: `geo.primary_column` names `<name>`, which the file contains, but that column is read under the name `<resident name>`, so the declared name does not read it
(i-root) InternalInconsistency: the file's footer lists <n> top-level column(s) but the schema probe reported <m>; which column each name reads could not be decided
(i-struct) InternalInconsistency: the file's footer lists <n> field(s) inside `<file path>` but the schema probe reported <m>; which field each name reads could not be decided
(i-tree) InternalInconsistency: the rows of parquet_schema do not form one schema tree; which column each name reads could not be decided
```

- **Text (a)** is the five-line form's section 3 text, carried word for word. That was lead-data's draft, put on the human's sight list by that form's OPEN-5.
- **Text (a-p)** is a new draft, not text (a) reused. Text (a) begins "the covering names" and names a path, and a primary column is neither. Text (a-p) opens as D4's text and (g) do, with "`geo.primary_column` names `<name>`". From "which matches" on, it keeps (a)'s words, so the covering's and the primary column's clause (a) refusals read alike (OPEN-E: "the same clause (a)").
- **The matches in (a) and (a-p)** are listed in the file's schema order. A byte-equal pair is listed twice, for example `geometry`, `geometry`. Such names also match ignoring case, so "when ASCII letter case is ignored" stays true for them.
- **Displays.** These add the existing prefixes: `geo metadata: ` (`engine/src/error.rs:340 @ 5c6b7e37`), `internal inconsistency: ` (`:392-394`) and `source: ` (`:282`).
- **What the texts state.** Only facts about the file and the engine. None states a consequence for another module.
- **No `[P6 placeholder] ` marker** (OPEN-A, ruled), because the engine's existing refusal details carry none. Texts (a), (a-p), (b), (g) and the three i-texts go on the human's sight list before the merge (§9).

### 2.7 Portability

- **R1:** the decisions are pure functions of the declared names, the resident schema and the file's name tree, the same on every platform.
- **R2:** no OS mechanism.
- **R3:** not owed.
- **R4:** no `cfg`, and no OS-keyed or filesystem-keyed rule.
- **R5:** no level is claimed.
- **R6:** no platform ignore.

### 2.8 Seams

- **The kernel consumes this through what already exists:** `Dataset::open_cancellable` and `error_of`'s existing arms. No kernel code changes, so the diff crosses no module seam. `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case` and K-1 (`kernel/tests/skp_projection.rs`) are read green, unchanged.
- **SKP-V0's covering note** (`protocol/skp/SKP-V0.md:1105-1106 @ 5c6b7e37`) stays true when "the file's schema" is read as the file's names. It is not edited. That is my reading, for the architect.
- **The parent form.** The covering-names-missing-column form's R1 describes the decision as "a pure function of the declared paths and the resident schema" (`engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:90 @ 5c6b7e37`). This piece widens that input by the file's name tree, keeping its no-`Connection` property (`:217`). That form is append-only and is not edited. This form records the widening.

## §3. The P0, before any code, with each outcome's consequence declared in advance

**How it runs.**
- On unmodified main at this form's commit, as an untracked scratch test in `engine/tests/`, inside one shared hold per the machine rules.
- Through `spatial_engine::fixture::configured_connection()` and `Dataset::open`, with the earlier P0's writer pattern (`state/drafts/covering-case-collision-p0/p0-scratch.rs.txt:21-86 @ 5c6b7e37`). Row g8 uses `spatial_engine::fixture::write_hostile_geometry_name`.
- Outputs are filed as text under a new folder, `state/drafts/covering-case-collision-full-form-p0/`. The scratch file is deleted after, and the porcelain is shown empty.
- The result is recorded as one class-1 amendment before code. No row and no prediction below is edited.

**What every row records:**
- `SELECT name, type, repetition_type, num_children FROM parquet_schema(?)`, all rows, in order;
- DESCRIBE's names and types, and the Arrow export's names;
- `Dataset::open`: Ok, or the error's Display;
- the resident names;
- `covering().is_some()`;
- for covering rows, the bbox stream's row count over the true extent (10 means the declared values were read, 0 means the offset values were read); for geometry rows, the first streamed feature's decoded x range (A, B or C);
- for s4 and g6, also whether the writer wrote the file, or the writer's error.

| row | written | declared | prediction |
|---|---|---|---|
| s1 | `BBOX` (offset +1,000,000 m east), then `bbox` | `bbox` | parquet_schema: root, `id`, `geometry`, `BBOX`, `bbox`, with each struct's four children; root `num_children` 4 = DESCRIBE's count; kept; 0 rows (as the earlier r2) |
| s2 | `bbox` {xmin, XMIN (offset), ymin, xmax, ymax} | `bbox.xmin` | parquet_schema's children `xmin`, `XMIN`, unrenamed; `bbox`'s `num_children` 5 = the resident struct's 5 |
| s3 | `bbox` {xmin (offset), XMIN (offset), XMIN_1 (true), ymin, xmax, ymax} | xmin as `bbox.XMIN_1`, others `bbox.*` | resident children `xmin`, `XMIN_1`, `XMIN_1_1`; kept; 0 rows |
| s4 | `bbox` (true), then `bbox` (offset), byte-equal names | `bbox` | not predicted (H-D) |
| g1 | `bbox` (true), `BBOX` (offset), `BBOX_1` (true) | `BBOX_1` | resident `bbox`, `BBOX_1`, `BBOX_1_1`; kept; 0 rows |
| g4 | `bbox` (true), `BBOX` (offset) | `BBOX_1` | resident `bbox`, `BBOX_1`; kept; 0 rows |
| g2 | geometry columns `geom` (A), `GEOM` (B), `GEOM_1` (C) | primary `GEOM_1` | opens; resident `geom`, `GEOM_1`, `GEOM_1_1`; streams B |
| g3 | `geometry`, `GEOMETRY` | primary `GEOMETRY` | `source: `geo.primary_column` names `GEOMETRY`, which the file does not contain` |
| g5 | geometry columns `geometry` (A), `GEOMETRY` (B) | primary `GEOMETRY_1` | opens; resident `geometry`, `GEOMETRY_1`; streams B |
| g6 | geometry columns `geometry` (A), `geometry` (B), byte-equal names | primary `geometry` | not predicted (H-D) |
| g7 | geometry columns `geometry` (A), `GEOMETRY` (B) | primary `Geometry` | `source: ` followed by D4's text for `Geometry`; resident `geometry`, `GEOMETRY_1` |
| g8 | N-8's file: `write_hostile_geometry_name` with geometry `geo\0m` and column `a` | primary `geo\0m` | parquet_schema's name at the geometry position is `geo\0m`, byte-equal to the declared name; the open is refused `GeoMetadata` as N-8 asserts |
| k1 | one standard `bbox` file at `<temp>/<dir>/year=2024/f.parquet` | `bbox` | not predicted: whether DESCRIBE adds `year`, and where |
| k0 | the same bytes outside a `k=v` folder (control) | `bbox` | DESCRIBE's count = root `num_children` |

**Consequences, declared now:**

- **S-yes** (s1 to s3, g1 and k0 give unrenamed file names at both levels, and the pre-order rebuild matches DESCRIBE's counts): §2 stands.
- **S-no** (parquet_schema renames struct children, or gives no child names): STOP. Return to the custodian and the architect. Route 1 cannot judge the child level, and any other route is the human's.
- **S-tree** (the rows do not rebuild one tree by `num_children`, or a plain file's counts differ): STOP.
- **K1** (k1 adds no column; counts equal): §2.2's root rule is exact equality. CC-6 is not written. The amendment records k1.
- **K2** (k1 adds hive columns after the file's own, which keep their positions): §2.2's root rule is the leading-N rule, and CC-6 is written (§4).
- **K3** (anything else, such as a hive column before or between the file's columns): STOP. The fix would change every `read_parquet` statement, which is the human's call.
- **G-yes** (g1 and s3 read the other column with the predicted names): clause (b) stands. CC-3's and CC-4's whole Displays are written into the amendment from the recorded names.
- **G-names** (DuckDB's generated names differ, but the declared name still reads another column): (b) stands unchanged, because it is not keyed to the `_N` pattern. The texts follow from the recorded names.
- **G-no at one level** (the declared generated name reads the file's own column there): (b) still applies at every level, through one code path. That level's test (CC-3 or CC-4) is not written, and the amendment says so.
- **G-no at both levels:** STOP. Clause (b) has no reachable file, and the human ruled on code reading.
- **g4 kept with 0 rows:** CC-5 stands. **g4 dropped or 10 rows:** it contradicts fact B, so STOP.
- **g2 streams B and g3 as predicted:** G-1 and G-2 stand. **g2 streams C, or g3 shows no rename:** STOP. Fact B fails for geometry.
- **g5 opens and streams B:** G-4 stands, and §1 item 4's changed outcome is the one recorded. **g5 refused, or streams anything but B:** STOP. Fact B fails for geometry, and §1 item 4 would claim a changed outcome with no file behind it.
- **g7 as predicted:** G-7 stands, and its at-main refusal is the one §5 records. **g7 opens:** STOP. D4's byte lookup would be wrong.
- **g8 as predicted:** N-8 stands unchanged under §2.3's lookup on the file's names. **g8's parquet_schema name not byte-equal to `geo\0m`:** STOP. §2.3 step 2 would move N-8, which §5 declares unchanged, from `GeoMetadata` to `Source`.
- **Byte-equal rows s4 and g6.** Each row is judged on its own: CC-8 by s4, G-6 by g6.
  - **W1** (the writer writes the file, parquet_schema lists both names byte-equal, and `Dataset::open` at main reaches the geometry check): the row's test stands. The amendment records main's outcome (opened or not, kept or not, which column was read) as the at-main half of §5's changed-outcome list.
  - **W2** (the writer writes the file, but the open at main is refused before the geometry check, for example by the schema probe): the row's test is not written. The amendment records the refusal's whole Display. §1's byte-equal clause for that row narrows to "never opens: refused before this check", and item 53's words go back to the architect through the amendment.
  - **W3** (the crate's `arrow` or `parquet` writer refuses two byte-equal names): the row's test is not written. Byte-equal duplicates are then not constructible here. The piece pauses at the amendment for the custodian's word on whether §1 keeps the byte-equal clause on code reading alone, and item 53's words go back to the architect.
  - **W-tree** (parquet_schema lists one name where DESCRIBE lists two, or the rows do not rebuild one tree): STOP, as S-tree.

## §4. Tests, one mutation each

**The new file.** `engine/tests/covering_case_collision.rs` carries one in-test writer: id u64, named Binary WKB geometry columns at distinct extents, named f64 structs with per-child offsets, and named `Utf8` attribute columns (for CC-9 and G-5). It is built on the crate's own `arrow` and `parquet` (`engine/Cargo.toml:23` and `:44 @ 5c6b7e37`), `spatial_engine::fixture::LV95_PROJJSON` and `spatial_engine::wkb::encode_polygon`. `engine/src/fixture.rs` is not edited.

**Every test** hash-verifies its fixture before and after, and asserts a refusal's whole Display with `assert_eq` against the text §2.6 gives (finalised in the P0 amendment).

**How a mutation is observed.** Applied alone at the final code commit, its test is run, its failure is recorded by name with that commit id, and it is reverted (`docs/PREREGISTRATION-TEMPLATE.md:172 @ 5c6b7e37`).

| id | test | file and expected outcome | mutation that fails it by name |
|---|---|---|---|
| CC-1 | `a_covering_whose_name_matches_two_of_the_files_names_by_case_refuses_the_open_by_name` | s1's shape. `Err(GeoMetadata)`, text (a) with matches `BBOX`, `bbox` | M1: the more-than-one arm skipped at the top level, the first file match taken |
| CC-2 | `a_covering_whose_child_name_matches_two_of_the_files_children_by_case_refuses_the_open_by_name` | s2's struct. Declared `bbox.xmin`, `bbox.ymin`, `bbox.xmax`, and the absent `bbox.zmax` for ymax. `Err(GeoMetadata)`, text (a) with `bbox.xmin`, `bbox.XMIN` | M2: the more-than-one arm skipped below the top level. M3: absence returned over the four paths before any refusal. Both give `Ok` with the covering dropped |
| CC-3 | `a_covering_whose_one_matching_name_duckdb_renamed_refuses_the_open_by_name` | g1. `Err(GeoMetadata)`, text (b): `BBOX_1.xmin`, `BBOX_1`, `BBOX_1_1` | M4: clause (b) skipped at the top level (gives `Ok`, kept) |
| CC-4 | `a_covering_whose_one_matching_child_duckdb_renamed_refuses_the_open_by_name` | s3. `Err(GeoMetadata)`, text (b): `bbox.XMIN_1`, `bbox.XMIN_1`, `bbox.XMIN_1_1` | M5: clause (b) skipped below the top level |
| CC-5 | `a_covering_naming_a_generated_name_the_file_lacks_is_dropped_as_absent` | g4. Open `Ok`; `covering()` is `None`; a bbox query refuses `NoCoveringBbox` before any lease, its detail equal to the existing Absent text for `BBOX_1.xmin` | M6: a segment with no file match resolved against the resident schema instead (gives kept) |
| CC-6 (K2 only) | `a_file_under_a_key_value_folder_opens_with_its_covering_kept` | k1. Open `Ok`; covering kept; a bbox stream drains | MKV: exact root-count equality (gives `InternalInconsistency`) |
| CC-7 | `a_covering_whose_absent_path_comes_before_a_path_matching_two_of_the_files_names_refuses_the_open_by_name` | s1's shape. Declared xmin `extent.xmin`, which matches no name in the file, and ymin, xmax and ymax `bbox.*`. `Err(GeoMetadata)`, text (a) for `bbox.ymin` with matches `BBOX`, `bbox` | MO: the first walk that does not resolve, in path order, returned (gives `Ok` with the covering dropped as absent for `extent.xmin`) |
| CC-8 (W1 at s4 only) | `a_covering_whose_name_two_columns_hold_byte_for_byte_refuses_the_open_by_name` | s4. `Err(GeoMetadata)`, text (a) with matches `bbox`, `bbox` | MC8: the walk's matches collected as distinct names before they are counted (gives `Ok`, kept) |
| CC-9 | `case_twins_the_geo_metadata_does_not_name_open_with_the_covering_kept` | `id`, `geometry`, `bbox` (true) and `Utf8` columns `zone`, `Zone` and `ID`; covering `bbox.*`, primary `geometry`. Open `Ok`; covering kept; the resident attribute names `zone`, `Zone_1`, `ID_1`, as D2's evidence shows at main; a bbox stream over the true extent returns 10 rows | MC9: the more-than-one check run over every top-level name of the file, not only the declared ones (gives `Err(GeoMetadata)`) |
| G-1 | `a_primary_column_spelled_like_the_later_of_two_case_twins_refuses_the_open_by_name` | g3's file. `Err(GeoMetadata)`, text (a-p) for `GEOMETRY` with matches `geometry`, `GEOMETRY` | MG1 (redefined): §2.3 steps 2 and 3 run before step 1 (gives `Err(GeoMetadata)` with text (g): `GEOMETRY`, `GEOMETRY_1`) |
| G-2 | `a_primary_column_whose_name_collides_with_a_generated_name_refuses_the_open` | g2. `Err(GeoMetadata)`, text (g): `GEOM_1`, `GEOM_1_1` | MG2: step 3 of §2.3 removed (gives `Ok`) |
| G-3 | `a_primary_column_the_file_does_not_contain_keeps_its_source_refusal_byte_for_byte` | `geometry` only, primary `GEOMETRY`: one match ignoring case, none byte for byte. `Err(Source)`; Display `source: ` followed by D4's text for `GEOMETRY` | MG3: that arm raises `GeoMetadata` with the same text. MG10: a single match ignoring case taken as the column, as the covering walk does (gives `Err(GeoMetadata)`, text (g)) |
| G-4 | `a_primary_column_spelled_like_a_generated_name_the_file_does_not_contain_refuses_the_open_as_source` | g5. `Err(Source)`; Display `source: ` followed by D4's text for `GEOMETRY_1` | MG4: a miss among the file's names falls back to today's byte lookup on the resident schema (gives `Ok`, streaming the file's `GEOMETRY`) |
| G-5 | `a_primary_column_whose_name_matches_two_of_the_files_names_by_case_refuses_the_open_by_name` | `geometry` (Binary) and a `Utf8` column `GEOMETRY`, primary `geometry`: the shape dropped from the edited b1 test. `Err(GeoMetadata)`, text (a-p) for `geometry` with matches `geometry`, `GEOMETRY` | MG6: the count in §2.3 step 1 compares bytes, not ASCII case (gives `Ok`) |
| G-6 (W1 at g6 only) | `a_primary_column_whose_name_two_columns_hold_byte_for_byte_refuses_the_open_by_name` | g6. `Err(GeoMetadata)`, text (a-p) for `geometry` with matches `geometry`, `geometry` | MG7: step 1's matches collected as distinct names before they are counted (gives `Ok`, streaming A) |
| G-7 | `a_primary_column_matching_no_name_exactly_but_two_by_case_refuses_the_open_by_name` | g7. `Err(GeoMetadata)`, text (a-p) for `Geometry` with matches `geometry`, `GEOMETRY` | MG9: §2.3 step 2's miss arm run before step 1 (gives `Err(Source)`, D4's text for `Geometry`) |
| CK-1 | `the_file_names_read_observes_a_cancel_already_requested` | s1's shape. `Dataset::open_cancellable(.., &token, PoolConfig::default())` with `token.cancel()` called first. `Err(Cancelled)`. Unmodified, nothing before the read observes the token (D1) | MK: the read run outside `cancellable` (gives `Err(GeoMetadata)`) |

**MO and M3 differ.** M3 checks for absence across all four paths before any refusal. MO returns whichever walk first fails to resolve. CC-2 lists the colliding path before the absent one, so it fails M3 but not MO. CC-7 lists the absent path first, so it fails MO.

**The G mutations.**
- **MG1 is redefined** from the earlier draft, where it replaced the file-name lookup with the resident lookup. With step 1 first, that edit no longer changes G-1's outcome. The redefined MG1 is an order mutation. It also changes G-7's outcome (giving D4's text) and G-5's (giving `Ok`).
- **MG4 fails G-4 alone among the G tests.** G-7 is refused by step 1 before the miss arm. G-3's fallback lookup misses on the resident `geometry` too, so G-3 still gives `Source`.
- **MG6 fails G-5, and G-1 and G-7 as well.** Their names match only once, or not at all, byte for byte. G-6 still has two byte-equal matches and passes, which is why G-6 carries its own MG7.
- **MG7 and MC8.** If §2.3 step 1 and the walk's clause (a) share one match-counting helper, MG7 and MC8 are one edit. It is then observed once, and must fail both G-6 and CC-8 by name.

**Edited, one existing test (F-1; declared change in §5).** The test is `hostile_names_colliding_after_case_folding_bind_one_column_each` (`engine/tests/b1_projection_hostile_names.rs:233-268 @ 4de4b9a9`).
- Removed: its `GEOMETRY` column (`:251-254`), and `"GEOMETRY_1"` from its asserted names (`:262`).
- Its comment's clause on the geometry column (`:231`) is changed to say that a column differing from the geometry column only in case now refuses the open, with G-5 named.
- Its name, its other columns and its assertions are unchanged.
- After the edit it opens and binds `zone`, `Zone_1`, `Zone_1_1` and `ID_1` as at main. With CC-9, it is the evidence that case twins the geo metadata does not name refuse nothing. MC9 fails it too.
- Nothing else in `engine/tests/b1_projection_hostile_names.rs` changes. B1's form is append-only and is not edited; this form records the edit.

**Unchanged and green without edit:**
- C-1 to C-5 in `engine/tests/covering_names_missing_column.rs`. C-3's rows d and e still keep their coverings (`:209-223 @ 5c6b7e37`).
- N-8, N-15 and every other test in `engine/tests/b1_projection_hostile_names.rs` except the one edited above.
- N-13 and N-14 in `engine/tests/b1_projection_hostile_covering.rs`.
- K-1 in `kernel/tests/skp_projection.rs`.
- `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`.
- The whole workspace suite.

## §5. Predictions, declared unchanged, declared changes, invalidators, falsification

**Predictions.**
- The P0 rows as §3 tabulates.
- Each new test green at the final commit, and each mutation failing its test by name.
- The edited test green.
- None of the tests named unchanged moves.

**Declared change (OPEN-E): a file whose primary column has a case-only twin opens at main and is refused after.**
- **Opened at main, refused after.** Among this form's test files, the open changes from an open at main to a refusal for:
  - CC-1 to CC-4, CC-7, G-2, G-4 and G-5;
  - CC-8 and G-6 if their files open at main (W1, recorded in the P0 amendment).
  - G-4's is §1 item 4's case: a `geo.primary_column` spelled like a generated name, which at main opens reading the file's `GEOMETRY`. G-5's is OPEN-E's: a primary `geometry` beside a `GEOMETRY` column, which at main opens reading `geometry`.
- **Refused at main and after, the code moving** from `engine.source` (D4's text) to `engine.geo_metadata`: G-1's file (now text (a-p); OPEN-6, OPEN-E) and G-7's file (text (a-p)).
- **Unchanged outcome:** G-3's file is refused `engine.source` with D4's text, at main and after.
- **The existing case it reaches** (D8): `hostile_names_colliding_after_case_folding_bind_one_column_each` in `engine/tests/b1_projection_hostile_names.rs`.
  - Its fixture is written in-test by the file's local `write` (`:51-112 @ 4de4b9a9`) under `path_for("casefold")`. No committed fixture holds it.
  - At main, its file opens and the test asserts the resident names `zone`, `Zone_1`, `Zone_1_1`, `ID_1`, `GEOMETRY_1`.
  - After the change, that file as written at main is refused `engine.geo_metadata`, text (a-p) for `geometry` with matches `geometry`, `GEOMETRY`.
  - The test is edited as §4 states, and opens after the edit as at main for its remaining columns.
- **No other existing test or fixture is reached**, by D9's search. Any found is an invalidator.

**Declared unchanged:**
- `probe_schema` and every resident name.
- `read_kv_metadata`.
- Every U+0000 reason and detail.
- The Absent detail and the no-covering detail.
- `check_geometry_column`'s three existing texts and codes.
- `sanity_check`, `covering_statistics`, `covering_sample` and `first_row_group_rows`.
- `EngineError`'s variants and Displays, and `error_of`.
- `describe` for every file that opens, with one declared exception: `covering_bbox` reads `false` for a covering that names a generated name the file lacks (CC-5). The opens that become refusals are listed above.
- `engine/src/lod.rs`, `engine/src/fixture.rs`, `engine/src/layout.rs` and `engine/src/stream.rs`.
- `engine/ADMISSION-PREREGISTRATION.md`, and the generated `engine/ADMISSION-RESULTS.md` (no regeneration is owed).
- `protocol/`, `kernel/` and `frontends/`, all with empty diffs.
- The operator-supplied paths of the split yardstick.

**Invalidators** (each stops the piece and returns it to the custodian):
- any STOP outcome in §3;
- any test named unchanged, or any corpus row, moving;
- an existing test or fixture other than the one named above reaching the more-than-one check;
- an `InternalInconsistency` from alignment on any existing fixture;
- a need for a `cfg` or an OS-keyed rule;
- the read impossible to bind through `cancellable`.

**Falsification** (the form is wrong if, after the change):
- a file opens with its covering kept while a declared segment reads a column other than the one the file names;
- the geometry stream reads a column other than the file's `primary_column` without a refusal;
- a file whose `geo.primary_column` matches more than one of the file's names, byte-equal or ignoring ASCII case, opens (G-1, G-5, G-6, G-7);
- a `geo.primary_column` that matches none of the file's names byte for byte opens (G-3, G-4);
- a covering with an absent path and a path refused by clause (a) or (b) opens with the covering dropped, in either order (CC-2, CC-7);
- a refusal fires on a file whose declared names read the columns the file names, for example the truncated-child case of §2.4, or a file whose only case twins are names the geo metadata does not declare (CC-9).

## §6. Instruments

Every quantity is an assertion, not a measurement:
- typed outcomes and whole Display texts;
- `covering().is_some()`;
- lease counts for the pre-lease refusal;
- the P0's row counts and decoded extents.

No p50 or p95 is recorded, and no `docs/08` row (OPEN-F).

## §7. Declared values and ceilings

**No new constant.** The read is bounded by the file's schema, the same set of names DESCRIBE already reads. This is for the architect under ADR-010 rule 6.

**Ceilings by file** (insertions plus deletions):

| file | ceiling |
|---|---|
| `engine/src/dataset.rs` | 330 (code and comments) |
| `engine/tests/covering_case_collision.rs` (new) | 660 |
| `engine/tests/b1_projection_hostile_names.rs` (§4's edit only) | 15 |
| `KNOWN-LIMITATIONS.md` | 6 (4 for item 53, 2 for item 9's sentence; OPEN-B) |
| `engine/README.md` (owner's index only: Last verified at, the Open and admission pins, the preregistrations list, Declared limits) | 4 |

**How these were derived.** These are estimates, not counts.
- **`engine/src/dataset.rs`, +30.** §2.3 step 1's count and its (a-p) refusal, and the doc comment of `check_geometry_column` naming the new order. G-4, G-3 and CC-7 add no code path. Mutations are applied and reverted, and count nowhere.
- **The new test file, +150.** About 30 lines each for CC-8, CC-9, G-5, G-6 and G-7, with the existing writers reused. The writer also gains `Utf8` attribute columns. G-1's and G-3's changes are within their existing lines.
- **The b1 test file.** About 9 deleted and 3 inserted: the `GEOMETRY` column block, the asserted-name lines that rustfmt may join, and the comment clause.
- **`KNOWN-LIMITATIONS.md`.** 6 assumes the architect's OPEN-E item 53 stays at 4 lines.

**Totals:** at most 1,015 lines over 5 files, besides this form.

**Counting command**, at a named commit, three-dot range: `git diff --numstat origin/main...HEAD -- . ':(exclude)engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md'`, columns 1 and 2 summed, and per file with the file's path.

**Overruns:** an overrun is class 8, and this section is never edited.

**Budget** (my draft; PLAN is the custodian's): 395 minutes. That includes rows g5, s4, g6, g7 and g8 in the same P0 run, the added tests with their mutations, and the b1 test edit. Past twice that, the node stops.

## §8. Block-on-sight

1. A statement or `Connection` in `judge_covering`, `field_path_exists`, `check_geometry_column` or `check_names_align`.
2. A second site that decides covering or primary-column ambiguity or misbinding. A second new statement in the open.
3. The new read outside `cancellable`, or any edit to the neighbours' reads.
4. A refusal after `sanity_check`, the identity scan or the descriptor.
5. Any change to `probe_schema` or to a resident name (B1 item 29; N-15).
6. A byte change to any text declared unchanged in §5.
7. A new `EngineError` variant, wire code, field, literal, `pub` item, constant, dependency, `cfg` or OS-keyed rule.
8. An engine message that states another module's consequence.
9. A second parquet reader in the open path.
10. An edit to `engine/src/lod.rs`, `engine/src/fixture.rs`, `protocol/`, `kernel/`, `frontends/` or `SKP-V0.md`, or to `engine/tests/b1_projection_hostile_names.rs` beyond §4's named edit.
11. An operator-supplied name judged against the file's names (OPEN-4), or the more-than-one check run over names the geo metadata does not declare.
12. A refusal detail or KNOWN-LIMITATIONS text other than the sighted words.
13. Any code before the P0's class-1 amendment.
14. An overrun not recorded as class 8.
15. The primary column's more-than-one check run after the absent arm, the renamed arm, or the U+0000 or type check, or comparing other than ASCII case-insensitively (byte-equal included).

## §9. Gates

- **Architect and reviewer, from dispatch.** Each checks §8 item by item. The reviewer recomputes the pins.
- **Suites:**
  - `cargo test --locked --workspace --features spatial-engine/fixture`, `cargo fmt --check`, and clippy as CI runs it, with no new warning in the added code;
  - CI's `node --test` scripts suite;
  - verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit (round 15 (c)).
  - Heavy runs happen inside the shared hold.
- **Operator:** no walkthrough row. Texts (a), (a-p), (b), (g), the i-texts and the KNOWN-LIMITATIONS words go on the human's sight list before the merge (OPEN-A, ruled).

## §10. Rule (00) at main 5c6b7e37, re-read at 4de4b9a9 for the added file, from the in-flight pieces' forms (my reading; the finding at dispatch is the custodian's)

Rule (00): `AUTONOMY.md:609 @ 5c6b7e37`.

| this piece's path | #241 (redaction scan) | port-2 | 1c step 1 | reading |
|---|---|---|---|---|
| `engine/src/dataset.rs` | not among its 24 (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748 @ 5c6b7e37`) | not among its 16 (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ 5c6b7e37`) | `engine/` unchanged (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:677 @ 5c6b7e37`) | disjoint |
| `engine/tests/covering_case_collision.rs` (new) | no | no (its `lod_tier_*` tests differ) | no | disjoint |
| `engine/tests/b1_projection_hostile_names.rs` (§4's edit) | not among its 24 (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:723-748 @ 4de4b9a9`) | not among its 16 (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ 4de4b9a9`); its Amendments 4 and 5 add no file (`:444-465 @ 4de4b9a9`) | `engine/` unchanged | disjoint |
| `KNOWN-LIMITATIONS.md`, item 53 and item 9 (OPEN-B, ruled) | item 47 (`:746`) | items 1 and 43 (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:310-311 @ 5c6b7e37`) | its own items 48 to 50 | disjoint by item; items 51 and 52 are on main (`KNOWN-LIMITATIONS.md:411` and `:415 @ 5c6b7e37`), so 53 is free |
| `engine/README.md` (owner's index) | **shared**, ceiling 4 (`:748`) | not edited (`:310`) | not edited (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:552 @ 5c6b7e37`) | sequenced after #241's merge, by merging main into the branch (OPEN-C, ruled) |
| read only: `engine/src/fixture.rs` (`LV95_PROJJSON`; `write_hostile_geometry_name` for P0 row g8) | edits it (`:734`) | no | calls only (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:550 @ 5c6b7e37`) | not an edit; a changed constant or writer at the base is a stop |
| read only: `kernel/tests/typed_terminal_codes.rs` | edits it (`:732`) | no | no | read green at the base |
| `protocol/`, wire fixtures, Cargo.lock, package-lock.json | no | no | step 1 holds `protocol/` | this piece touches none |

**Others:**
- **#241's merge order:** after #244, following R2 on Monday (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:8 @ 5c6b7e37`).
- **The sort-window fix** is `kernel/tests/publish_cancellation.rs`, by its title (`PLAN.yaml:4281 @ 5c6b7e37`).
- **Milestone 4's form** excludes `engine/**` (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:402 @ 5c6b7e37`).
- **1c step 1's class-9 widening** (the directive, `:18`) is, on my reading, the `protocol/` and `kernel/src/session_history.rs` widening (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1008 @ 5c6b7e37`).
- **#244** is `frontends/shell/MANUAL-WALKTHROUGH.md`.
- All of these are disjoint.

## §11. KNOWN-LIMITATIONS: item 53 (the architect's OPEN-E redraft, spliced by the custodian) and item 9's appended sentence (the architect's 2026-10-23 redraft), drafts for the human's sight, not the human's words

*Item 53's block below is a slot. The custodian splices the architect's OPEN-E redraft into it at commit (`state/consults/2026-10-24-covering-case-collision-binds-other-column-item-53-open-e-architect.md`). Item 9's block is the architect's words, carried byte for byte from `state/consults/2026-10-23-covering-case-collision-binds-other-column-item-53-route-1-architect.md`, section 3. Both are drafts for the human's sight (OPEN-8, OPEN-A), not the human's words, and neither is lead-data's. The placement lines and the notes after the blocks are lead-data's.*

- **Item 53.** Placed as the redraft's section 2 gives it: at the end of the file, after item 52 (`KNOWN-LIMITATIONS.md:415-417 @ 8bb450c9`), in the section at `KNOWN-LIMITATIONS.md:200 @ 8bb450c9`. It adds 4 lines.

~~~
[ITEM 53: the architect's OPEN-E redraft, filed separately, spliced by the custodian]
~~~

- **Item 9's appended sentence.** Added (OPEN-B, ruled yes). The sentence at `KNOWN-LIMITATIONS.md:114 @ 8bb450c9` stays byte for byte. Placed as the redraft's section 3 gives it: after `KNOWN-LIMITATIONS.md:116 @ 8bb450c9`, before the blank line at `:117`, with 3 spaces of indent. It adds 2 lines. The redraft's section 3 also gives a variant with a visible mark, opening "On main, if another path…"; that choice is the human's.

~~~
   If another path of that covering matches more than one of the file's column names, or names a column the app reads under another name, the file is refused when it is opened instead (item 53).
   <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, OPEN-B); the sentence above the earlier comments stays the human's wording. Where the code does this, at <commit> on the piece's branch: judge_covering in engine/src/dataset.rs, which refuses such a path before it records an absent one; CC-2 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. -->
~~~

- **Notes (lead-data's).**
  - The words assume the P0 comes out S-yes, G-yes, and K1 or K2. Row s3 decides the re-rename inside a column, and row g5 is what makes the `GEOMETRY_1` sentence true (the redraft's sections 4 and 6). Any other outcome returns the words to the architect through the P0 amendment.
  - Two test pointers in the comments predate this form's E-1 and E-2 tests. Item 53's comment named "CC-1 to CC-5 and G-1 to G-3", and item 9's names "CC-2". This form adds CC-7 (the other order, for clause 8 and item 9's sentence) and G-4 (the `GEOMETRY_1` case). The words are carried as written. Whether those pointers change before the human's sight is for the architect or the custodian, not lead-data.
  - **OPEN-E's tests, for the pointer slot the architect proposes** (`CC-1 to CC-5, CC-7, G-1 to G-4 and <the OPEN-E test ids>`): CC-8, CC-9, G-5, G-6 and G-7. CC-8 and G-6 are written only under W1 (§3). CC-9, with the edited `hostile_names_colliding_after_case_folding_bind_one_column_each` in `engine/tests/b1_projection_hostile_names.rs`, is the evidence for item 53's sentence that case twins the geo metadata does not name refuse nothing. G-1 and G-3 stay in "G-1 to G-4" with their changed expectations (§4).

## Amendments (opens empty; append-only)

---

## What the five-line form's closing amendment records (the custodian's, class 1)

- **First line:** written after the route read and the human's rulings were seen.
- **References only:**
  - the route read's path;
  - the ruling directive's path, by its covering-case paragraph;
  - the 2026-10-24 ruling directive's path, by its item 3;
  - this full form's path.
- **What it records:**
  1. No code landed under the five-line form (its Amendment 2, item 2).
  2. That form is superseded by this one.
  3. Its section 3 text, section 4 words, OPEN rulings and budget bind nothing further, except where this form names them: §2.6's text (a); and, by the 2026-10-24 ruling, F-2 (OPEN-B) and that form's OPEN-4 (A) (OPEN-C).
  4. The branch `cut/covering-case-collision-binds-other-column`: its state, as a fact, and whether this form reuses it.
  5. The PLAN node's `gate` moves to this form, by the custodian's commit on main.
  6. "Nothing above is edited."

---

## OPEN items (A to F ruled 2026-10-24, `state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md:12 @ 4de4b9a9`; the human's words are quoted byte for byte)

- **OPEN-A, ruled:** "OPEN-A no P6 marker, as the engine's existing refusal details; the texts come to me for sight before the merge." Applied in §2.6 and §9, text (a-p) included.
- **OPEN-B, ruled:** "OPEN-B yes, F-2's ruling carries over, the appended item 9 sentence redrafted beside item 53, and the primary-column refusal belongs in item 53." Applied in §7 and §11.
- **OPEN-C, ruled:** "OPEN-C yes." Code proceeds; the owner's-index commit follows #241's merge, by merging main into the branch (§10).
- **OPEN-D, ruled:** "OPEN-D a proposed PLAN node, engine lane, S3, yours; no KNOWN-LIMITATIONS line." Recorded as `engine-open-neighbour-reads-unbound-to-cancel` (`PLAN.yaml:4298 @ 4de4b9a9`); §1 says so.
- **OPEN-E, ruled:** "OPEN-E widen: a declared name that matches more than one of the file's names, byte-equal or case-insensitively, refuses by name; the same clause (a) for the covering and the primary column." Applied in §1, §2.3, §2.6, §3, §4, §5, §7, §8 and §11.
- **OPEN-F, ruled:** "OPEN-F yours; if run, recorded with no claim." The custodian runs no measurement; §6 stands as written.
- **No new OPEN item.** The widening forces one change outside the earlier Scope: the edit of `hostile_names_colliding_after_case_folding_bind_one_column_each`. The architect's F-1 asks this form to declare it, and it is declared in §4, §5, §7, §8 and §10. The gates check it there. It needs no decision outside them.
````

## What I could not settle

- **Sentences of the current item 53 words that OPEN-E makes untrue.** These are the 2026-10-23 redraft's words, quoted byte for byte from my earlier form's §11.
  - "`geo.primary_column` must match one of the file's column names exactly, and where the app reads that column under a changed name, the open is refused the same way." It reads as if an exact match that DuckDB has not renamed is enough. After OPEN-E, `geometry` beside `GEOMETRY` matches one name exactly, is not renamed, and is still refused (G-5).
  - "A `geo.primary_column` that matches none of them exactly is refused as `engine.source`, with the same text as before, saying the file does not contain it; that now includes a name spelled like a changed name, such as `GEOMETRY_1` in a file that holds only `geometry` and `GEOMETRY`." This is untrue for `Geometry` beside `geometry` and `GEOMETRY`: no exact match, but refused as `engine.geo_metadata` (G-7). The `GEOMETRY_1` example itself stays true (G-4).
  - "A file that holds two columns under exactly the `geo.primary_column` name is not judged by this check, and which of them the app reads is not established." This is untrue: such a file is refused by name (G-6, subject to W1 to W3).
  - **Incomplete, not untrue.** The title ("A file is refused when it is opened if a name in its `covering.bbox` matches more than one of its column names, or if its `covering.bbox` or `geo.primary_column` names a column the app reads under another name.") omits the primary column's more-than-one refusal. And "a file whose other columns have names that differ only in letter case is not refused" is true only if "other columns" excludes a column whose name matches `geo.primary_column` ignoring case. That is the CC-9 reading; the D8 file's `GEOMETRY` column is now refused.
  - **The comment.** "check_geometry_column (geo.primary_column)" and "CC-1 to CC-5 and G-1 to G-3" are stale as pointers. Its evidence pointer to `hostile_names_colliding_after_case_folding_bind_one_column_each` still shows changed names after the edit, but no longer a geometry twin.
- **Item 9's sentence is carried unchanged.** OPEN-E changes no covering behaviour: "matches more than one of the file's column names" already includes byte-equal names. Its comment points at CC-2 only; CC-7 and CC-8 would also serve. I left the architect's words as they are.
- **G-3's declared name** moves from `geom` to `GEOMETRY`, so that the test sits on the boundary between step 1 and the absent arm. That is my drafting, not forced by the ruling. G-4 still covers a plain miss.
- **Row g8 is not forced by OPEN-E.** §2.3 now looks up the primary column, the U+0000 case included, among parquet_schema's names. No row measured that name for N-8's file, so I added one. The gates may drop it.
- **Byte-equal duplicates are unmeasured** (F-2). Whether CC-8 and G-6 are written depends on W1 to W3. Under W3 the piece pauses for the custodian's word: a byte-equal claim on code reading alone is a question, not my decision.
- **D9 is an absence claim from Grep**, not from a script. The compat corpus's `.parquet` files are not in the tree, so I read only its manifest. The custodian confirms D9 by script.
- **The order of the more-than-one check against the U+0000 and type checks** is held by §8 item 15, not by a test. A test is possible (a `Utf8` primary column beside a Binary twin). I left it out to hold the budget.
- **Text (a-p) for byte-equal names** renders as `geometry`, `geometry` after "when ASCII letter case is ignored". That is true but may read oddly; it is for the human's sight.
- **Ceilings are estimates.** The KNOWN-LIMITATIONS 6 assumes the architect's OPEN-E item 53 stays at 4 lines.
- **Line cites after item 51.** The directive's item 4 (one column-0 line before item 51) will shift `KNOWN-LIMITATIONS.md` lines from 411 on by one once committed. The `:415-417 @ 8bb450c9` cites stay pinned to their commit, and the placement is by item.
- **Item 53 is assumed free.** I did not read milestone 4 PR C's dispatch amendment. Its commit subject (06ebd6cb) names KL items 54 to 56, so 53 should be free; that is unverified.
- **The earlier "§10 was not re-read" item is settled** for port-2. Its list at `:260-276 @ 4de4b9a9` and its Amendments 4 and 5 add no file.

Result: the full form is revised for OPEN-A to OPEN-F, with clause (a) widened to the primary column and to byte-equal names. It folds in the architect's F-1 to F-4 and ends at 1,015 lines over 5 files.
Blocking questions: none.
Report path: C:/dev/spatial-ide/state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-open-a-to-f-lead-data-draft.md (I did not write it: the brief says to write no file, so this message is the report).
sha256: not computed, because I have no shell. The custodian hashes the bytes as filed.
