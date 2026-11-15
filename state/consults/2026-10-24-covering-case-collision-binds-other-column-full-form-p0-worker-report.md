*Custodian's filing note (2026-10-24): the P0 of `covering-case-collision-binds-other-column`'s full form (its §3), run by a worker on unmodified main at 4f6a9b0f402c90130a9b80b0d8a028f7173f6616 before any code. The run 09:25:53Z to 09:29:23Z by its transcript (Bash 13, Read 3, Write 1, Monitor 1; writes only to its untracked scratch test, deleted after, and its own scratch files; no commit, push or PR action; the worktree clean after). Its two outputs are filed byte for byte as `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt` (sha256 3e7d4cf4721cce80a926d83909f593ceca6efd4a361f22cf4f8cb61cc3f08c4c) and `state/drafts/covering-case-collision-full-form-p0/p0-output.txt` (sha256 1a0e6b3a70cb08daa216470c56a962f6033ef64992e9f01449b08a94b1836cc3). Extracted by script from its SubagentHandback call, with one final newline added; the session scratch folder's path written as <the session scratch folder> (1 place); nothing else is changed. Its sha256, from line 5 to the end, as handed back, is 584ffc0ebf5f6ca1a00fe677c057200d5c5915edab643a26660fa1284b2dff8a.*

---

P0: covering-case-collision-binds-other-column, the full form's section 3, at 4f6a9b0f402c90130a9b80b0d8a028f7173f6616

Result: no STOP. One scratch test (one function, rows in the table's order) ran once in one shared hold and passed: "test result: ok. 1 passed; 0 failed". Every row's whole record, including all parquet_schema rows, is in the output file. Below is what decides each consequence. All quotes are byte-copied from the output.

Row results beside the predictions:

- **s1** (prediction: parquet_schema root, id, geometry, BBOX, bbox with four children each; root num_children 4 = DESCRIBE's count; kept; 0 rows). Matches.
  - The root row is named `arrow_schema`, `num_children=Some(4)`.
  - Top-level names are `id`, `geometry`, `BBOX`, `bbox`, each struct with four children (parquet_schema[0] to [12]).
  - `s1 DESCRIBE names: ["id", "geometry", "BBOX", "bbox_1"]`
  - `s1 open: Ok`
  - `s1 resident names: ["id", "geometry", "BBOX", "bbox_1"]`
  - `s1 covering().is_some(): true`
  - `s1 stream rows: 0`
- **s2** (prediction: children `xmin`, `XMIN` unrenamed; bbox num_children 5 = the resident struct's 5). Matches.
  - `s2 parquet_schema[3]: name="bbox" type=None repetition_type=Some("REQUIRED") num_children=Some(5)`, then children `xmin`, `XMIN`, `ymin`, `xmax`, `ymax`.
  - `s2 DESCRIBE types: ["UBIGINT", "BLOB", "STRUCT(xmin DOUBLE, XMIN_1 DOUBLE, ymin DOUBLE, xmax DOUBLE, ymax DOUBLE)"]`
  - `s2 covering().is_some(): true`
  - `s2 stream rows: 10`
- **s3** (prediction: resident children `xmin`, `XMIN_1`, `XMIN_1_1`; kept; 0 rows). Matches.
  - `s3 parquet_schema[3]: name="bbox" ... num_children=Some(6)`, children `xmin`, `XMIN`, `XMIN_1`, `ymin`, `xmax`, `ymax`.
  - `s3 Arrow export names: ["id:UInt64", "geometry:Binary", "bbox:struct[xmin,XMIN_1,XMIN_1_1,ymin,xmax,ymax]"]`
  - `s3 open: Ok`
  - `s3 covering().is_some(): true`
  - `s3 stream rows: 0`
- **s4** (not predicted).
  - `s4 writer: wrote the file`
  - parquet_schema lists `bbox` twice, each with `num_children=Some(4)` (rows [3] and [8]).
  - `s4 DESCRIBE names: ["id", "geometry", "bbox", "bbox_1"]`
  - `s4 open: Ok`
  - `s4 resident names: ["id", "geometry", "bbox", "bbox_1"]`
  - `s4 covering().is_some(): true`
  - `s4 stream rows: 10`
- **g1** (prediction: resident `bbox`, `BBOX_1`, `BBOX_1_1`; kept; 0 rows). Matches.
  - `g1 DESCRIBE names: ["id", "geometry", "bbox", "BBOX_1", "BBOX_1_1"]`
  - `g1 open: Ok`
  - `g1 covering().is_some(): true`
  - `g1 stream rows: 0`
- **g4** (prediction: resident `bbox`, `BBOX_1`; kept; 0 rows). Matches.
  - `g4 resident names: ["id", "geometry", "bbox", "BBOX_1"]`
  - `g4 covering().is_some(): true`
  - `g4 stream rows: 0`
- **g2** (prediction: opens; resident `geom`, `GEOM_1`, `GEOM_1_1`; streams B). Matches.
  - `g2 open: Ok`
  - `g2 resident names: ["id", "geom", "GEOM_1", "GEOM_1_1"]`
  - `g2 first-batch geometry x range (values >= 2e6): min=2610000 max=2610010 (A=2600000..2600010, B=+10000, C=+20000)`
- **g3** (prediction: source refusal naming `GEOMETRY`). Matches.
  - `g3 open: Err(source: `geo.primary_column` names `GEOMETRY`, which the file does not contain)`
  - `g3 DESCRIBE names: ["id", "geometry", "GEOMETRY_1"]`
- **g5** (prediction: opens; resident `geometry`, `GEOMETRY_1`; streams B). Matches.
  - `g5 open: Ok`
  - `g5 resident names: ["id", "geometry", "GEOMETRY_1"]`
  - `g5 first-batch geometry x range (values >= 2e6): min=2610000 max=2610010 (A=2600000..2600010, B=+10000, C=+20000)`
- **g6** (not predicted).
  - `g6 writer: wrote the file`
  - parquet_schema lists `geometry` twice (rows [2] and [3]).
  - `g6 DESCRIBE names: ["id", "geometry", "geometry_1"]`
  - `g6 open: Ok`
  - `g6 resident names: ["id", "geometry", "geometry_1"]`
  - `g6 first-batch geometry x range (values >= 2e6): min=2600000 max=2600010 (A=2600000..2600010, B=+10000, C=+20000)`
  - The open reaches the geometry check and reads the first column, A.
- **g7** (prediction: source refusal with D4's text for `Geometry`; resident `geometry`, `GEOMETRY_1`). Matches.
  - `g7 open: Err(source: `geo.primary_column` names `Geometry`, which the file does not contain)`
  - `g7 DESCRIBE names: ["id", "geometry", "GEOMETRY_1"]`
  - The open failed, so no resident-names line was printed. The resident names above are DESCRIBE's, not read from a resident schema.
- **g8** (prediction: the schema name at the geometry position is byte-equal to the declared name; refused GeoMetadata). Matches.
  - `g8 parquet_schema[2]: name="geo\0m" type=Some("BYTE_ARRAY") repetition_type=Some("REQUIRED") num_children=None`, printed with Debug escaping.
  - `=== g8 (declared primary="geo\0m") ===`, printed the same way.
  - `g8 open: Err(geo metadata: `geo.primary_column` names the geometry column, but the resident name `geo\u0000m` is not addressable: DuckDB's Arrow export reports this position as `geo`, a different name than the one DESCRIBE binds it by, so no SELECT list built from either name can be trusted to reach it)`
  - Byte-equality is shown by Debug-escaped prints of both strings, not by a byte comparison in code.
- **k1** (not predicted).
  - `k1 parquet_schema[0]: name="arrow_schema" type=None repetition_type=None num_children=Some(3)`
  - `k1 DESCRIBE names: ["id", "geometry", "bbox", "year"]`
  - `k1 DESCRIBE types: ["UBIGINT", "BLOB", "STRUCT(xmin DOUBLE, ymin DOUBLE, xmax DOUBLE, ymax DOUBLE)", "BIGINT"]`
  - `k1 open: Ok`
  - `k1 resident names: ["id", "geometry", "bbox", "year"]`
  - `k1 stream rows: 10`
- **k0** (prediction: DESCRIBE's count = root num_children). Matches.
  - root `num_children=Some(3)`
  - `k0 DESCRIBE names: ["id", "geometry", "bbox"]`
  - `k0 open: Ok`

Consequence families, each with the one the rows give:

- **S-yes.** s1, s2, s3, g1 and k0 give unrenamed file names at both levels (the quoted parquet_schema rows). The pre-order rebuild matches the counts in every one of them: root `num_children` 4, 3, 3, 5 and 3 against DESCRIBE's column counts 4, 3, 3, 5 and 3. Not S-no, not S-tree.
- **K2.** k1 adds `year` after the file's own columns, at the end, with the file's columns keeping their positions: `k1 DESCRIBE names: ["id", "geometry", "bbox", "year"]` against root `num_children=Some(3)`. The control k0 has equal counts. Only one `k=v` file was measured. K2 gives the leading-N rule and CC-6 written.
- **G-yes.** g1 and s3 read the other column with the predicted names: g1 gives resident `bbox`, `BBOX_1`, `BBOX_1_1` with `stream rows: 0`. s3 gives resident children `xmin`, `XMIN_1`, `XMIN_1_1` with `stream rows: 0`. Clause (b) stands. CC-3's and CC-4's Displays can be written from the recorded names.
- **g4.** Kept with 0 rows (`g4 covering().is_some(): true`, `g4 stream rows: 0`). CC-5 stands.
- **g2 and g3.** g2 streams B (min=2610000) and g3 shows the rename and the source text. G-1 and G-2 stand.
- **g5.** Opens and streams B. G-4 stands, and §1 item 4's changed outcome is the one recorded.
- **g7.** As predicted (source refusal). G-7 stands, and its at-main refusal is the one §5 records.
- **g8.** As predicted. N-8 stands unchanged under §2.3's lookup on the file's names.
- **s4 (CC-8): W1.** The writer wrote the file, parquet_schema lists both byte-equal names, and `Dataset::open` at main opened it with the covering kept. It read the first `bbox` (the true one): 10 rows. The row's test stands, and the at-main half is: opened, kept, first column read.
- **g6 (G-6): W1.** The writer wrote the file, parquet_schema lists both names, and `Dataset::open` opened it. It reached the geometry check and streamed the first column, A. The row's test stands, and the at-main half is: opened, first column read.
- **W2, W3, W-tree** do not apply to s4 or g6.

Scratch-run notes:
- The geometry x range is the min and max of every Float64 leaf value at or above 2,000,000 in the first streamed batch, not of the first feature alone. Feature x values span 10 m, so A, B and C are separable by the minimum.
- s4's byte-equal structs and g6's byte-equal geometry columns were written through the crate's `arrow` and `parquet` writer without error.
- parquet_schema's root is named `arrow_schema`.

Saved files, in the scratch folder `<the session scratch folder>/`:
- `ccc-p0f-scratch.rs.txt`, 14034 bytes
- `ccc-p0f-output.txt`, 19211 bytes. It includes cargo's Compiling lines.

State after:
- The scratch test file `engine/tests/p0_full_ccc.rs` is deleted.
- `git status --porcelain` printed nothing, with rc=0. HEAD is still 4f6a9b0f402c90130a9b80b0d8a028f7173f6616.
- I started no background process that is still running. A tasklist search for cargo and p0_full found nothing.
- No commit, push or PR action.

Hold lines (my project's only):
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:47900 also=bash.exe:9980 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:47900 affinity=FF (cores 0-7)`
- The command ran in Bash background mode, with exit code 0.
- One deviation from the call shape: an `export` of CARGO_TARGET_DIR, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 sat between the `cd` and the hold, in the same call. The output redirect and rc handling are as given.

Pre-gate self-check (the four failure classes):
- Cross-module code uses the real interface: the scratch used `configured_connection`, `write_hostile_geometry_name`, `Dataset::open`, `stream_with_cancel`, `next_into` and `file_schema()` as they exist. I read their code before use, and the scratch compiled and ran against them.
- Completion claims point to evidence: every claim above is quoted from the output file.
- User-facing messages: none written.
- Required tests reached their assertions: this is a measurement P0 and asserts nothing. Every row reached its recording, including s4, g6 and g8.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No model override and no context handoff received or produced.
