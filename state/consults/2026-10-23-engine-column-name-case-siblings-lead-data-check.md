*Custodian's filing note (2026-10-23): the read-only check of every engine path that matches a column name case-insensitively, by lead-data at main ed2c89e0, for the human's grade of `engine-column-name-case-siblings` (item 7 of the rulings filed today). It runs nothing; its wrong-column findings for the geometry column and the LOD tier builder are by code reading over a pinned rename test, not reproduced; its question for the human, whether the wrong column is judged by the file's own names or by the app's, decides identity, projection and predicates. The run 10:05:16Z to 10:14:19Z by its transcript (Grep 35, Read 40, Glob 2; no Write, Edit or Bash). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 8d33100c8eb809636576a97671d5eb663770d243422ee5fbd69f17ae2cce1ced.*

---

Checked: engine-column-name-case-siblings, at main ed2c89e0

I read the main checkout, which the session's git status showed at ed2c89e0. I have no shell, so this report carries no sha256, and every `@ ed2c89e0` cite is from that read. I ran nothing. Quoted code is byte-copied; everything else is my reading.

## Two facts every path below depends on

**A. Quoting does not make DuckDB match exactly.** The brief says identifiers bind ASCII case-insensitively "unless quoted". This repo's own measurement says quoted identifiers bind case-insensitively too:
- The covering P0 row d declared `BBOX` against a written `bbox`. Its oracle was `oracle sql: SELECT "BBOX"."xmin", "BBOX"."ymin", "BBOX"."xmax", "BBOX"."ymax" FROM read_parquet(?) LIMIT 0`, and it printed `oracle: BINDS` (state/drafts/covering-names-missing-column-p0/p0-output.txt:32-37 @ ed2c89e0).
- Row e (`"bbox"."XMIN"`) also binds (same file, :38-43).
- Row g (non-ASCII) fails to bind, so the folding covers ASCII only (:50-58; engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:299 @ ed2c89e0).
- Every engine identifier reaches SQL double-quoted: engine/src/stream.rs:1765-1766, engine/src/geoparquet.rs:329-335, engine/src/dataset.rs:1791-1796, engine/src/predicate.rs:1333, all @ ed2c89e0.

**B. DuckDB renames names that differ only by case before the engine sees them.**
- `probe_schema` names each resident field by DESCRIBE's bound name (engine/src/dataset.rs:1108-1164 @ ed2c89e0; `if bound_name == f.name() {` at :1147).
- An existing test pins what DuckDB does to such names. Its doc comment begins `/// Case-folding collisions never reach the SELECT list as ambiguous names: DuckDB's reader renames` (engine/tests/b1_projection_hostile_names.rs:228 @ ed2c89e0).
- It writes the file columns id, geometry, zone, Zone, Zone_1, ID, GEOMETRY. It asserts the resident names `&["zone", "Zone_1", "Zone_1_1", "ID_1", "GEOMETRY_1"]` (:262).
- It asserts that each resident name reads the values of the file column at the same position (:264-267, with `expected` at :174-176).
- So the first name in file order keeps its spelling. Each later name that matches it ignoring case gets `_1`. A real column whose name matches a generated name ignoring case is renamed again (`Zone_1` becomes `Zone_1_1`).
- Resident name `Zone_1` therefore reads the file's `Zone`, not the file's `Zone_1`. The same test file's N-15 case c14 pins the same names, with no exported-name metadata, so the Arrow export carries the renamed names as well (engine/tests/b1_projection_hostile_names.rs:900-918 and :966-982 @ ed2c89e0).
- Function: `hostile_names_colliding_after_case_folding_bind_one_column_each` (:233). Case c14 is in `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` (:817).

**What follows from A and B (my inference, not a test):**
- Resident names are unique when case is ignored. A name that byte-equals a resident name therefore binds exactly that resident column in DuckDB, so a path that checks byte-equality against the resident schema and then quotes the same string agrees with DuckDB.
- The wrong column becomes reachable where the name comes from the file's own footer, which is not renamed, and is then looked up among DuckDB's renamed names. The same happens where one path reads the footer and another reads through DuckDB.
- The only case-insensitive column-name match written in engine code is the covering walk: `field_path_exists`, engine/src/dataset.rs:1446-1472 @ ed2c89e0. That belongs to the covering piece and is not repeated here. The other `eq_ignore_ascii_case` sites in engine/src compare encodings, geometry type names and CRS types, not column names. Every other column match in engine code is byte equality, and DuckDB's binder adds the case-insensitivity.

## Path by path

### 1. Geometry column

**1. Where the name is matched and bound.**
- `geo.primary_column` comes from the file's own geo metadata, which uses footer names.
- It is checked against the resident schema by byte equality: `.find(|f| f.name() == geometry_column)` (engine/src/dataset.rs:1903 @ ed2c89e0; whole function :1899-1926; called at :429).
- It is then bound by DuckDB as a quoted identifier: `let geom = quote_ident(self.geometry_column());` (engine/src/stream.rs:1432 @ ed2c89e0).
- The result column is read back by byte name (engine/src/stream.rs:1957-1960 @ ed2c89e0).

**2. Can it read the other column? Yes, by code reading over fact B. Not reproduced.**
- Example file: `geom` (WKB A), `GEOM` (WKB B), `GEOM_1` (WKB C), with geo metadata declaring `GEOM_1`.
- By B, the resident names are `geom`, `GEOM_1` (the file's `GEOM`), `GEOM_1_1` (the file's `GEOM_1`).
- The byte check at :1903 finds resident `GEOM_1`, which is the file's `GEOM`. That column is binary, so the type check at :1916-1924 passes.
- The stream then reads B silently, while the metadata's encoding, types and bbox describe C. Nothing refuses.
- The two-name case is a refusal, not a wrong read. With `geometry` then `GEOMETRY`, and `GEOMETRY` declared, the resident names are `geometry` and `GEOMETRY_1`. The open is refused as `EngineError::Source`, and the text says the file "does not contain" the column, which is untrue: it is there under a renamed name (:1904-1909).

**3. Tests.** None for a geometry name in a case collision. The casefold test above only carries a non-declared `GEOMETRY`.

**4. P0 to settle it.**
- Write an untracked scratch test in engine/tests/, using the `write` pattern in engine/tests/b1_projection_hostile_names.rs:51-112 @ ed2c89e0.
- File columns `id`, `geom`, `GEOM`, `GEOM_1`, each holding polygons at a distinct extent. Geo metadata declares `GEOM_1` (LV95).
- Run `Dataset::open`, record `file_schema()` names, then stream `ViewportQuery::all()` and decode the coordinates.
- Observation: extent B means the wrong column, silently. A refusal or error means not S1.

### 2. Identity column

**1. Where the name is matched and bound.**
- At open: `let Some(field) = schema.fields().iter().find(|f| f.name() == &column) else {`, a byte match against the resident schema (engine/src/dataset.rs:1730 @ ed2c89e0).
- The native name is the constant `id` (engine/src/dataset.rs:1727 @ ed2c89e0). A declared name comes from the caller (engine/src/dataset.rs:1714-1726 @ ed2c89e0).
- The uniqueness scan quotes the same string (engine/src/dataset.rs:1791-1796 @ ed2c89e0).
- The stream uses `let mut projection = format!("{source_column} AS {id}, {geom}");` (engine/src/stream.rs:1440 @ ed2c89e0), and `ORDER BY` uses the source column (:1486-1489).
- Ids are read back through the `"id"` alias by byte name (engine/src/stream.rs:1956 and :2599-2602 @ ed2c89e0).

**2. Can it read the other column?**
- **Native `id`: no.** A generated name always ends in `_N`, so a resident `id` is always the file's own `id`. If a file has `ID` before `id`, the resident names are `ID` and `id_1`. The byte match misses and the dataset opens on the session tier (:1744-1756). That is a silent downgrade of the identity class, recorded on the envelope; no column is misread.
- **Declared identity, using the resident (describe) names: no.** The open scan, the stream and `ORDER BY` all bind the same resident column.
- **Declared identity, using the file's own names: yes.** With file columns `key`, `Key`, `Key_1` and declared `Key_1`, the scan verifies and the stream reads the file's `Key`, by the same mapping the casefold test pins for projection. The envelope says `mapped:Key_1`. Nothing refuses.
- **A declared name whose spelling was renamed is refused, with an untrue text.** For example, `parcel_key` declared when `PARCEL_KEY` comes first: `IdentityUnusable` with "the file has no such column" (:1744-1749).

**3. Tests.** `hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id` (engine/tests/b1_projection_hostile_names.rs:274 @ ed2c89e0) covers `ID` beside a mapped identity, with no collision. The casefold test covers native `id` beside `ID`, indirectly: a misbound `id` would hit a Utf8 column. No test declares an identity whose name collides.

**4. P0 to settle it.**
- Same scratch pattern: u64 columns `key` (0..9), `Key` (100..109), `Key_1` (200..209).
- Run `open_with_declared_identity(.., "Key_1", ..)` and stream the ids.
- Observation: 100..109 means the file's `Key` was read for a name the file gives to `Key_1`.

### 3. Attribute projection

**1. Where the name is matched and bound.**
- Pass 1 resolves names by byte: `.find(|f| f.name() == name)` (engine/src/attributes.rs:565 @ ed2c89e0; :557-569).
- The geometry and identity exclusions are byte comparisons (engine/src/attributes.rs:463 and :468 @ ed2c89e0).
- Names are bound quoted at engine/src/stream.rs:1441-1444 and read back by byte name at :1969 @ ed2c89e0.
- `MAX_PROJECTED_ATTRIBUTES` only counts names (engine/src/attributes.rs:542 @ ed2c89e0).
- The kernel's `projectable` fact goes through `admit_projection_column`, which uses the same byte rules (engine/src/attributes.rs:509-516 @ ed2c89e0).

**2. Can it read the other column?**
- **Using resident names: no.** This is pinned.
- **Using the file's own names: yes, as pinned.** Requesting `Zone_1` returns the file's `Zone` values, emitted under the name `Zone_1`. The file's real `Zone_1` is emitted as `Zone_1_1`. The test records this as intended. A request for the file's `Zone` is refused as `ColumnUnknown`, listing the renamed names.
- `ID` beside `id` is admitted as an ordinary attribute, and both names are emitted (`assert_eq!(emitted, ["id", "geometry", "ID"]);`, engine/tests/b1_projection_hostile_names.rs:298 @ ed2c89e0).

**3. Tests.** `hostile_names_colliding_after_case_folding_bind_one_column_each`, `hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id`, and `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` (c14).

**4. P0 to settle it.** None needed: the tests above already establish the behaviour. Whether "the file's own names" is the yardstick is the human's grading question.

### 4. Predicates (filter)

**1. Where the name is matched and bound.**
- Column names are collected from DuckDB's parse as written, unquoted or quoted (engine/src/predicate.rs:950-971 @ ed2c89e0).
- The namespace check is byte: `.find(|f| f.name() == name)` (engine/src/predicate.rs:1209 @ ed2c89e0; :1205-1215).
- The identity-alias rule is byte: `.any(|f| f.name() == ID_COLUMN);` (engine/src/predicate.rs:1146 @ ed2c89e0).
- The type walk looks names up by byte (:1852-1858).
- The bind stage builds a surrogate from the resident names (:1341-1343).
- The stream passes the caller's text verbatim: `q.filter.as_ref().map(|f| format!("({})", f.sql_text()));` (engine/src/stream.rs:1452 @ ed2c89e0). DuckDB binds it case-insensitively.

**2. Can it read the other column?**
- **Using resident names: no, by reasoning from B.** A name must byte-equal one resident name, and resident names are unique ignoring case, so DuckDB binds the same column. For the same reason the surrogate relation cannot hold two names that differ only by case.
- **Using the file's own names:** the same mapping as projection.
- **One sub-case is not established.** Take a mapped (or session) identity, so the SELECT carries `... AS "id"`, and a file column `ID`. `identity_alias_ambiguity` does not flag it (byte, :1141-1147), and `ID > 3` is admitted.
  - The existing measurement shows WHERE binding the base column before the select alias, for an exact `id` only (engine/tests/publish_stream.rs:348-354 @ ed2c89e0).
  - It is not measured with base `ID` against alias `id`. If the alias won, the filter would test the identity's source column, silently.

**3. Tests.** No filter test runs over renamed names. The campaign's collision templates (engine/tests/admission_property_campaign.rs:465-492 @ ed2c89e0) run on a single-case fixture and assert properties, not which column is read.

**4. P0 to settle it.**
- Extend the pattern of `duckdb_resolves_order_by_and_where_in_opposite_directions` (engine/tests/publish_stream.rs:319 @ ed2c89e0) in an untracked scratch test.
- Run `CREATE TABLE t("ID" BIGINT, parcel_key BIGINT)` with distinct values, then `SELECT "parcel_key" AS "id" FROM t WHERE "ID" >= k`.
- Observation: rows chosen by `ID` means not S1; rows chosen by `parcel_key` means the wrong column.
- Then run the same through `Dataset::open_with_declared_identity` and `AdmittedPredicate::admit("ID >= k")`.

### 5. LOD tier builder

**1. Where the name is matched and bound.**
- `let id_column = source.identity().source().source_column().to_string();` (engine/src/lod.rs:1018 @ ed2c89e0).
- It reads the file's footer directly with arrow-rs, not through DuckDB: `let builder = ParquetRecordBatchReaderBuilder::try_new(file)` (engine/src/lod.rs:1362 @ ed2c89e0).
- Names are matched by byte: `.position(|f| f.name() == name)` (engine/src/lod.rs:1816 @ ed2c89e0; :1365-1366, :1384), and `index_of` at :1820-1824 and :1856-1860.

**2. Can it read the other column? Yes, by code reading over B. Not reproduced.**
- The names it is given were checked against DuckDB's renamed schema, but it looks them up in the footer.
- Geometry (path 1's file): the stream reads the file's `GEOM`, while the LOD reads the file's real `GEOM_1`.
- Mapped identity declared from describe as `Key_1` (meaning the file's `Key`): the stream and the open scan use the file's `Key`, while the tiers carry ids from the file's real `Key_1`, which the open never verified.
- Native `id` cannot diverge, as in path 2.
- No SKP command builds a tier today (kernel/src/skp.rs:2204 @ ed2c89e0). The path is reached through `spatial_engine::lod::build_tiers` only.

**3. Tests.** None with a case collision.

**4. P0 to settle it.**
- Run `build_tiers` on path 1's file and on path 2's file (LV95 is projected, so the unit gate passes).
- Read each tier's geometry extents and ids back, and compare them with the stream's output.
- Observation: different values for the same name confirm the divergence.

### 6. Session-tier ordinal (another path found)

**1. Where the name is matched and bound.**
- `pub const FILE_ROW_NUMBER_COLUMN: &str = "file_row_number";` (engine/src/identity.rs:77 @ ed2c89e0), used as the source column (:92-98).
- It is streamed as `"file_row_number" AS "id"` through `read_parquet(?)` with no option (engine/src/stream.rs:1438-1445 @ ed2c89e0). That is DuckDB's virtual column.
- Nothing at admission checks whether the file carries its own column of that name in any case. The session arm returns without a statement (engine/src/dataset.rs:1754-1756 @ ed2c89e0).

**2. Can it read the other column? Not established.**
- A file with no `id` and its own `FILE_ROW_NUMBER` or `file_row_number` opens on the session tier.
- Which column DuckDB then binds, the file's real column or its virtual ordinal, is not recorded anywhere I found.
- If the real column wins, identity is read from it silently. The session tier runs no uniqueness scan, so duplicates would pass.
- The LOD's footer lookup of `file_row_number` (engine/src/lod.rs:1365 @ ed2c89e0) would likewise take a real column if the file has one, or refuse if it does not.

**3. Tests.** None. engine/tests/session_identity.rs:81 @ ed2c89e0 probes the virtual column on a file without such a column.

**4. P0 to settle it.**
- Untracked scratch test with two files: geometry plus `FILE_ROW_NUMBER`, and geometry plus `file_row_number`, each u64 holding a constant 7.
- Run `Dataset::open`, check `is_session_ordinal()`, record `file_schema()` names, and stream the ids.
- Observation: 0..n-1 means the virtual column (not S1). All 7s means the file's column, a wrong column with duplicate identity. An error means a refusal.

### 7. Other paths

- **Covering:** the covering piece's own scope (judge_covering, the sanity sample at engine/src/dataset.rs:1603 @ ed2c89e0). Not repeated here; see the first item under "What I could not settle".
- **Experimental index and row-group seams:** engine/src/index.rs:326 @ ed2c89e0 quotes the identity and covering names the same way. The product planner never reaches them (`engine/tests/planner_seam.rs::the_product_planner_never_reaches_the_index_seam`, `engine/tests/row_group_seam.rs::the_product_planner_never_reaches_the_row_group_seam`).
- **engine/src/layout.rs:** test support behind the `fixture` feature.
- **KNOWN-LIMITATIONS:** no item states DuckDB's renames or which column a name reads. Item 3 (KNOWN-LIMITATIONS.md:62-68 @ ed2c89e0) and item 9's covering sentence (KNOWN-LIMITATIONS.md:114 @ ed2c89e0) are the nearest.

## For the human, one line per path

- **Geometry column:** wrong column possible (S1-able): a file whose geo metadata names `GEOM_1` beside `geom` and `GEOM` streams the file's `GEOM`, silently. Code reading over the pinned rename; not reproduced.
- **LOD tier builder:** wrong column possible (S1-able): it reads footer names, while every other path reads DuckDB's renamed names, so one name can mean two columns (geometry, or a mapped identity). Not reproduced; no SKP command reaches it today.
- **Identity:** native `id` not possible. A declared identity using describe's names is not possible. A declared identity using the file's own names reads the other column (`Key_1` reads the file's `Key`), silently.
- **Projection:** not possible with describe's names (pinned). With the file's own names, `Zone_1` returns the file's `Zone`; a test pins this as intended.
- **Predicates:** not possible with describe's names (reasoning, no test). One sub-case is not established: a file column `ID` beside the `"id"` alias of a mapped or session identity.
- **Session-tier `file_row_number`:** not established. A file carrying its own column of that name, in any case, may be read as identity with no uniqueness check.

## What I could not settle

1. **Pointer for the covering piece, not repeated here.** Fact B already predicts its P0 at the top level. `bbox` and `BBOX` become resident `bbox` and `BBOX_1`, which is that draft's H3 ("Stop and return"), and a declared `BBOX` matches only the first-written `bbox`. Struct children (its r4) are not covered by any rename test I found. The custodian may want the architect to see this before that P0 is dispatched.
2. **Whether "the wrong column" is measured against the file's own names or against the app's (describe's) names.** That decides identity, projection and predicates. It is the human's grading call.
3. **Fact B rests on one test file's assertions.** I could not run them. I assume they pass on main.
4. **Whether DuckDB's renaming takes its virtual columns into account.** This bears on path 6. Not recorded.
5. **The LOD tier file's own schema** (engine/src/lod.rs:1683-1691 @ ed2c89e0). It writes the identity column, a fixed `bbox` and the geometry column. A mapped identity or geometry named `BBOX` or `Bbox` would put a case collision into the tier file itself. I did not follow how such a tier is read back.
6. **Kernel and frontends.** I did not examine their consumers beyond the engine functions they call.

Reuse index: two misses, as supplied in the brief ("identifier case sensitivity binding", "duplicate column names differing by case").

Result: check done. Two paths can read the wrong column (geometry, and the LOD builder, which reads footer names), not reproduced. Identity, projection and predicates are safe by the app's own names, but a name taken from the file reads the other column. The filter alias case and the session-tier `file_row_number` are not established.
Question (not blocking): is "the wrong column" judged by the file's own names or by the app's (describe's) names? The grade of identity, projection and predicates depends on it.
Report path: C:/dev/spatial-ide/state/consults/2026-10-23-engine-column-name-case-siblings-lead-data-check.md
sha256: not computed (no shell; the custodian hashes the filed bytes).
