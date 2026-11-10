*Custodian's filing note (2026-10-23): lead-data's revision of the new full form for `covering-case-collision-binds-other-column`, read only at main 8bb450c9, folding the architect's findings C-1, E-1 and E-2 and the item 53 and item 9 words (`state/consults/2026-10-23-covering-case-collision-binds-other-column-item-53-route-1-architect.md`) into its draft (`state/consults/2026-10-23-covering-case-collision-binds-other-column-full-form-lead-data-draft.md`). The run 18:00:30Z to 18:07:25Z by its transcript (Grep 6, Read 11; no Write, Edit or Bash). Nothing is committed from it yet: its OPEN-A to OPEN-E are the human's before the form is committed. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d9fea136dd67b87156b5db9d394036bb8ccaa6d7ff6c41c58ac11a1f267fa5b2.*

---

Revised: covering-case-collision-binds-other-column, the full form, at main 8bb450c9

I read the main checkout at 8bb450c9 and ran nothing. I have no shell, so this report carries no sha256. Every cite I added is `@ 8bb450c9`, read at main. Every cite carried over from the first draft keeps `@ 5c6b7e37`, the commit it was read at. Unless a line says otherwise, the wording is my drafting. Two kinds of text are not mine. The §1 item 4 sentence is the architect's C-1 replacement, taken verbatim. The two §11 blocks are the architect's redraft, sections 2 and 3, carried byte for byte. Both are drafts for the human's sight, not the human's words.

## Changes against my draft, by section

- **Header line ("Drafted by lead-data …").** It now records this revision at 8bb450c9, on C-1, E-1 and E-2, and that each cite keeps its own commit. This is bookkeeping for the revision.
- **Authority.**
  - Added a bullet for the item 53 redraft (sections 2 to 5), for §11 and for C-1, E-1 and E-2.
  - The reuse index now carries the custodian's three queries byte for byte, so it says "Three misses" where it said "Two misses". This comes from the brief, not from a finding.
- **§0.**
  - **Inputs** now name the item 53 redraft.
  - **H-G** gains one sentence for the `GEOMETRY_1` case, attributed to C-1's code reading and not reproduced. This answers E-1: it is the hypothesis row g5 tests.
  - D1 to D7 are unchanged. D4 describes main today, and it stays true.
- **§1 item 4 (C-1).** The second sentence is replaced by the architect's C-1 words, verbatim. The first sentence is unchanged.
- **§2.3 step 1 (C-1).**
  - Added: the miss arm includes a name spelled like a generated one (`GEOMETRY_1`). At main that file opens and reads the file's `GEOMETRY`. After the change it is refused. The outcome changes, but the text and code do not (P0 row g5, test G-4).
  - Steps 2 and 3 are unchanged.
- **§2.4 (E-2).** The closing sentence now says "whichever path comes first (CC-2, CC-7)". Steps 1 to 6 are unchanged: they already require a refusal before absence.
- **§2.6 (C-1).** No change. None of the texts (a), (b), (g) or the i-texts states the claim C-1 corrects.
- **§3 (E-1).**
  - Added row g5: geometry columns `geometry` (A) and `GEOMETRY` (B), primary `GEOMETRY_1`. Predicted: it opens, the resident names are `geometry`, `GEOMETRY_1`, and it streams B.
  - Added its consequence, declared in advance. If g5 opens and streams B, G-4 stands. If g5 is refused, or streams anything but B, the piece stops. This matches the existing rule for g2 and g3, where failing fact B for geometry is a STOP.
- **§4 (E-1, E-2).**
  - **Added G-4** on g5's file: `Err(Source)`, whole Display `source: ` plus D4's text for `GEOMETRY_1`. Its own mutation is **MG4**: a miss among the file's names falls back to today's byte lookup on the resident schema, which gives `Ok`.
    - **Why MG4 and not the architect's wording.** The architect worded the mutation as the whole file-name lookup replaced by the resident lookup. That is MG1's code, which G-1 already fails. I narrowed it to the miss arm so that only G-4 can catch it. A note under the table says so.
  - **Added CC-7 (E-2).**
    - It uses s1's file. xmin is declared as `extent.xmin`, which is absent: there is no top-level `extent`. ymin, xmax and ymax are declared as `bbox.*`.
    - Expected: `Err(GeoMetadata)`, text (a) for `bbox.ymin`, with matches `BBOX`, `bbox`.
    - Its mutation is **MO**: the first walk that does not resolve, in path order, is returned. That gives `Ok` with the covering dropped for `extent.xmin`.
  - **CC-2 is unchanged** (M2, M3).
    - **I chose a second test, not a reorder.** Keeping CC-2 keeps the other order proven (absent after the colliding path, failed by M3). With both orders tested, MO fails CC-7, and its mirror (the last walk that does not resolve) would fail CC-2. One order alone always lets one of those two through.
    - CC-7 reuses s1, a shape the P0 measures. Reordering CC-2 inside s2's struct would need either a ymin path naming `bbox.xmin` or a struct shape (`ymin`/`YMIN`) the P0 does not measure.
- **§5.**
  - **Declared unchanged, the `describe` line (C-1).** Its CC-5 exception is unchanged. It now lists the test files whose open changes from an open at main to a refusal: CC-1 to CC-4, CC-7, G-2 and G-4. G-4 is named as §1 item 4's case. G-1 stays a refusal, its code moving from `engine.source` to `engine.geo_metadata`. The architect asked that "any operator-facing count of changed outcomes" name this case.
  - **Falsification** gains two bullets: a primary column matching no file name byte for byte opens (C-1, E-1); and a covering with an absent path beside an (a) or (b) path opens, in either order (E-2).
  - Predictions and invalidators are unchanged. Predictions already read "the P0 rows as §3 tabulates" and "each mutation failing its test by name", so they cover g5, G-4, CC-7, MO and MG4.
- **§7 (brief point 5).**
  - `engine/src/dataset.rs` stays at 300. No code path is added: G-4 runs §2.3 step 1's existing arm, and CC-7 runs §2.4 steps 4 and 5. MO and MG4 are applied and reverted, so they count nowhere.
  - The test file goes from 450 to 510: +30 for CC-7 (s1's writer reused, one covering, one `assert_eq`) and +30 for G-4 (G-2's geometry writer reused with two columns, one `assert_eq`).
  - `KNOWN-LIMITATIONS.md` goes from "at most 14" to 6, taken from the redraft's section 3 count (4 + 2). It is 4 if OPEN-B adds no sentence. Updating the comments' test pointers would change words, not lines.
  - The totals go from 768 to 820 lines over 4 files.
  - The budget goes from 300 to 330 minutes: +10 for row g5 in the same P0 run, and +20 for two tests and two mutation observations.
  - The README ceiling, the counting command and the overrun rule are unchanged.
- **§11 (brief point 4).**
  - The placeholder slots are replaced by the architect's item 53 block and item 9's appended sentence, carried byte for byte. They are marked as the architect's drafts for the human's sight, not the human's words.
  - Placement, in my words, now cites `KNOWN-LIMITATIONS.md:200`, `:114`, `:116`, `:117` and `:415-417 @ 8bb450c9`. I read those lines at main and they are unchanged.
  - OPEN-B stays open on whether item 9's sentence is added.
  - Two notes of mine are added. First, the words assume the P0's S-yes, G-yes, and K1 or K2, plus rows s3 and g5. Second, the comments' test pointers predate CC-7 and G-4.
- **Not changed.**
  - §2.1, §2.2, §2.5, §2.7, §2.8, §6, §8, §9, §10, the Amendments heading and the five-line form's closing amendment are as drafted.
  - OPEN-A to OPEN-F are worded as before. No finding changes any of them: C-1 bears on step 1's miss arm, not on OPEN-E's duplicate byte-equal names.

## The revised form

````markdown
# A name the file supplies is judged against the file's own names: a covering path matching more than one of them, or one whose bound column is not the column the file names, refuses the open, and so does a renamed primary column (full form; PLAN node `covering-case-collision-binds-other-column`)

*Proposed path: `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md`. There is a precedent for the `-FULL-` name: `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md`, `engine/README.md:550 @ 5c6b7e37`.*

*Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line, and states what it touches or invalidates.*

*Drafted by lead-data on the custodian's brief, read at main 5c6b7e37, from the inputs §0 lists. Revised by lead-data at main 8bb450c9 on the architect's findings C-1, E-1 and E-2 and its item 53 redraft (Authority). Every cite keeps the commit it was read at.*

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
- **The route read:** `state/consults/2026-10-23-covering-case-collision-binds-other-column-route-architect-read.md`, sections (1) Route 1, (2) and (3).
- **The item 53 redraft and its findings:** `state/consults/2026-10-23-covering-case-collision-binds-other-column-item-53-route-1-architect.md`, section 2 (item 53's words), section 3 (item 9's appended sentence), section 4 (the clause checks) and section 5 (C-1, E-1 and E-2, answered in §1, §2.3, §2.4, §3, §4 and §5). Its words are carried in §11.
- **The evidence it rests on:**
  - The earlier P0: `state/consults/2026-10-23-covering-case-collision-binds-other-column-p0-worker-report.md` and `state/drafts/covering-case-collision-p0/p0-output.txt:184-215 @ 5c6b7e37`.
  - The siblings check: `state/consults/2026-10-23-engine-column-name-case-siblings-lead-data-check.md`, facts A and B, path 1.
- **The machine rules for every heavy run:** `state/directives/2026-10-06-machine-script-adopted.md`.
- **Reuse index:** the custodian supplied the output of `node tools/reuse.mjs` from the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, carried here byte for byte. Three misses, noted, not blocking:

```text
$ node tools/reuse.mjs parquet footer column names
No prior art recorded for "parquet footer column names". Research it before planning an implementation.
$ node tools/reuse.mjs case insensitive column collision
No prior art recorded for "case insensitive column collision". Research it before planning an implementation.
$ node tools/reuse.mjs geoparquet primary column
No prior art recorded for "geoparquet primary column". Research it before planning an implementation.
```

## Gating

This piece takes full gating, the reviewer and the architect, from dispatch (`AUTONOMY.md:315-332 @ 5c6b7e37`). It crosses §21c on two bounds: new user-visible behaviour, and well over 150 changed lines (`AUTONOMY.md:349-353 @ 5c6b7e37`). The human's OPEN-5 sends it to this form. No five-line form is committed for it.

## §0. Disclosure

**Inputs.** The route read (whole); the item 53 redraft, sections 2 to 5; the five-line form with its Amendments 1 and 2; the P0 report and both outputs; the siblings check. In `engine/src/dataset.rs`: the open path, `judge_covering`, `field_path_exists`, `check_geometry_column`, `read_kv_metadata`, `probe_schema`, `cancellable` and the sanity reads. `engine/tests/b1_projection_hostile_names.rs`. `engine/B1-PROJECTION-PREREGISTRATION.md`'s E1 to E5 and its block-on-sight item 29. `AUTONOMY.md` §21. The template. The forms of the in-flight pieces (§10).

**What the code does today (at 5c6b7e37):**

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

**Hypotheses, each with the discriminator that settles it in the P0 (§3):**

- **H-S.** `parquet_schema` at DuckDB v1.5.5 gives struct children their own, unrenamed names. Its rows rebuild the tree in pre-order by `num_children`.
- **H-K.** For one file under a `k=v` folder, DESCRIBE's column count equals the root's `num_children`. Not predicted: no record in `engine/` names hive partitioning.
- **H-G.** A covering declaring a generated-colliding name (`BBOX_1` beside `bbox`, `BBOX`) is kept today and reads the other struct, at the top level and among children. A primary column declared `GEOM_1` beside `geom` and `GEOM` streams the file's `GEOM`. This is code reading by the route read, section "What the P0 settles", and by the siblings check, path 1. Not reproduced. The same holds, by the item 53 redraft's C-1 (code reading, not reproduced), for a primary column declared `GEOMETRY_1` beside `geometry` and `GEOMETRY`, a name the file does not hold: it opens today and streams the file's `GEOMETRY` (row g5).

No 5 GB fixture is read, so the fixture-drive confound does not apply.

## §1. What this preregistration may and may not claim

**It may claim, once its tests are green** (Windows 10 Pro 22H2, MSVC, bundled DuckDB v1.5.5, the module's stated scope at `engine/README.md:521-524 @ 5c6b7e37`):

1. **(a)** An open is refused by name, with `engine.geo_metadata`, when a declared covering segment matches, ignoring ASCII case, more than one of the file's own names at its level. This holds even when one of those names is spelled exactly as declared.
2. **(b)** An open is refused by name, with `engine.geo_metadata`, when the resident column at the position of the single file name a segment matches does not itself match that segment ignoring ASCII case. In that case the declared name cannot read the column the file names.
3. **Absence** is judged against the file's names. A covering whose segment matches none of them is dropped as absent, with the existing Absent detail byte for byte. This includes a name DuckDB generated.
4. **The primary column.** A `geo.primary_column` that the file contains, at a position where DuckDB renamed the column, refuses the open as `engine.geo_metadata`. A `geo.primary_column` that matches none of the file's names byte for byte is refused as `engine.source` with today's text byte for byte; that includes a name spelled like a generated name, such as `GEOMETRY_1` beside `geometry` and `GEOMETRY`, which today opens reading the file's `GEOMETRY`.
5. **Order.** Every one of these refusals comes before `sanity_check`, the identity scan and the descriptor.
6. **Cancellation.** The one new statement is bound to the open's cancel token.

**It may not claim, and these are its limits:**

- **No performance number, and no `docs/08` row.** The open gains one footer-bounded statement. The cold-open budget (`docs/08_Testing.md:7 @ 5c6b7e37`) is not re-measured. No cancellation latency is claimed (`docs/08_Testing.md:8 @ 5c6b7e37`).
- **No wire change.** No SKP message, literal, field or code is added. The refusals travel through existing arms: `EngineError::GeoMetadata` to `geo_metadata` (`kernel/src/skp.rs:2118 @ 5c6b7e37`), `Source` (`:2060`) and `InternalInconsistency` (`:2115-2117`).
- **No ADR is cited as changed.** ADR-023's 2026-09-29 amendment (Proposed) is not touched.
- **ASCII case only.** A difference in the case of a letter outside A to Z counts as a different name, as today.
- **The split yardstick (OPEN-4).** Only names the file supplies are judged against the file's names: the covering's paths and `geo.primary_column`. Names the operator supplies stay judged by the app's names, unchanged: projection, filter, a declared identity. So do the `file_row_number` session ordinal and the filter's `ID`/`"id"` alias case.
- **The LOD identity divergence stays open** (OPEN-7, its own node). Its geometry half is closed by item 4: once a renamed primary column is refused, the file's name and the bound name are the same.
- **The neighbours' unbound reads stay a recorded gap (OPEN-9), not this piece's fix.** These are `read_kv_metadata` and `probe_schema`'s two statements. Where the gap is recorded is OPEN-D.
- **Duplicate byte-equal names for the primary column are not judged.** The first byte-equal file name is taken (OPEN-E). The covering's paths need no such rule: two byte-equal names also match ignoring case, so clause (a) refuses them.
- **No macOS or Linux claim.** The tests are portable correctness tests and run in each CI job (§2.7).

**Declared unchanged** is in §5. **Seams** are in §2.8.

## §2. The change, stated before it is applied

All code is in `engine/src/dataset.rs`.

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

### 2.3 The primary column (OPEN-6)

`check_geometry_column(schema, file_names, geometry_column)`, still pure:

1. Let j be the first root child whose name is byte-equal to `geometry_column`. If there is none, the existing arm runs unchanged: `EngineError::Source`, the text byte-copied in D4. It is now true by the file's names. This includes a name spelled like a generated one, such as `GEOMETRY_1` beside `geometry` and `GEOMETRY` (P0 row g5, test G-4): at main that file opens reading the file's `GEOMETRY`, and after this change it is refused. Its outcome changes; its text and code do not.
2. If the resident field at j is not byte-equal to `geometry_column`, the open is refused as `EngineError::GeoMetadata`, draft detail (g) in §2.6. That is the case where DuckDB renamed the file's column.
3. Otherwise the existing U+0000 check (`:1910-1915`) and the type check (`:1916-1924`) run on the resident field at j, unchanged.

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
(b) GeoMetadata: the covering names `<declared path>`, which the file's schema holds as `<file path>`, but that column is read under the name `<resident path>`, so the declared name does not read it
(g) GeoMetadata: `geo.primary_column` names `<name>`, which the file contains, but that column is read under the name `<resident name>`, so the declared name does not read it
(i-root) InternalInconsistency: the file's footer lists <n> top-level column(s) but the schema probe reported <m>; which column each name reads could not be decided
(i-struct) InternalInconsistency: the file's footer lists <n> field(s) inside `<file path>` but the schema probe reported <m>; which field each name reads could not be decided
(i-tree) InternalInconsistency: the rows of parquet_schema do not form one schema tree; which column each name reads could not be decided
```

- **Text (a)** is the five-line form's section 3 text, carried word for word. That was lead-data's draft, put on the human's sight list by that form's OPEN-5.
- **The matches in (a)** are listed in the file's schema order.
- **Displays.** These add the existing prefixes: `geo metadata: ` (`engine/src/error.rs:340 @ 5c6b7e37`), `internal inconsistency: ` (`:392-394`) and `source: ` (`:282`).
- **What the texts state.** Only facts about the file and the engine. None states a consequence for another module.
- **No `[P6 placeholder] ` marker**, following the five-line form's section 3. Whether that carries over is OPEN-A.

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
- Through `spatial_engine::fixture::configured_connection()` and `Dataset::open`, with the earlier P0's writer pattern (`state/drafts/covering-case-collision-p0/p0-scratch.rs.txt:21-86 @ 5c6b7e37`).
- Outputs are filed as text under a new folder, `state/drafts/covering-case-collision-full-form-p0/`. The scratch file is deleted after, and the porcelain is shown empty.
- The result is recorded as one class-1 amendment before code. No row and no prediction below is edited.

**What every row records:**
- `SELECT name, type, repetition_type, num_children FROM parquet_schema(?)`, all rows, in order;
- DESCRIBE's names and types, and the Arrow export's names;
- `Dataset::open`: Ok, or the error's Display;
- the resident names;
- `covering().is_some()`;
- for covering rows, the bbox stream's row count over the true extent (10 means the declared values were read, 0 means the offset values were read); for geometry rows, the first streamed feature's decoded x range (A, B or C).

| row | written | declared | prediction |
|---|---|---|---|
| s1 | `BBOX` (offset +1,000,000 m east), then `bbox` | `bbox` | parquet_schema: root, `id`, `geometry`, `BBOX`, `bbox`, with each struct's four children; root `num_children` 4 = DESCRIBE's count; kept; 0 rows (as the earlier r2) |
| s2 | `bbox` {xmin, XMIN (offset), ymin, xmax, ymax} | `bbox.xmin` | parquet_schema's children `xmin`, `XMIN`, unrenamed; `bbox`'s `num_children` 5 = the resident struct's 5 |
| s3 | `bbox` {xmin (offset), XMIN (offset), XMIN_1 (true), ymin, xmax, ymax} | xmin as `bbox.XMIN_1`, others `bbox.*` | resident children `xmin`, `XMIN_1`, `XMIN_1_1`; kept; 0 rows |
| g1 | `bbox` (true), `BBOX` (offset), `BBOX_1` (true) | `BBOX_1` | resident `bbox`, `BBOX_1`, `BBOX_1_1`; kept; 0 rows |
| g4 | `bbox` (true), `BBOX` (offset) | `BBOX_1` | resident `bbox`, `BBOX_1`; kept; 0 rows |
| g2 | geometry columns `geom` (A), `GEOM` (B), `GEOM_1` (C) | primary `GEOM_1` | opens; resident `geom`, `GEOM_1`, `GEOM_1_1`; streams B |
| g3 | `geometry`, `GEOMETRY` | primary `GEOMETRY` | `source: `geo.primary_column` names `GEOMETRY`, which the file does not contain` |
| g5 | geometry columns `geometry` (A), `GEOMETRY` (B) | primary `GEOMETRY_1` | opens; resident `geometry`, `GEOMETRY_1`; streams B |
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

## §4. Tests, one mutation each

**The new file.** `engine/tests/covering_case_collision.rs` carries one in-test writer: id u64, named Binary WKB geometry columns at distinct extents, and named f64 structs with per-child offsets. It is built on the crate's own `arrow` and `parquet` (`engine/Cargo.toml:23` and `:44 @ 5c6b7e37`), `spatial_engine::fixture::LV95_PROJJSON` and `spatial_engine::wkb::encode_polygon`. `engine/src/fixture.rs` is not edited.

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
| G-1 | `a_primary_column_duckdb_renamed_refuses_the_open_as_geo_metadata` | g3's file. `Err(GeoMetadata)`, text (g): `GEOMETRY`, `GEOMETRY_1` | MG1: the file-name lookup replaced by today's byte lookup on the resident schema (gives `Err(Source)`) |
| G-2 | `a_primary_column_whose_name_collides_with_a_generated_name_refuses_the_open` | g2. `Err(GeoMetadata)`, text (g): `GEOM_1`, `GEOM_1_1` | MG2: step 2 of §2.3 removed (gives `Ok`) |
| G-3 | `a_primary_column_the_file_does_not_contain_keeps_its_source_refusal_byte_for_byte` | `geometry` only, primary `geom`. `Err(Source)`; Display `source: ` followed by D4's text for `geom` | MG3: that arm raises `GeoMetadata` with the same text |
| G-4 | `a_primary_column_spelled_like_a_generated_name_the_file_does_not_contain_refuses_the_open_as_source` | g5. `Err(Source)`; Display `source: ` followed by D4's text for `GEOMETRY_1` | MG4: a miss among the file's names falls back to today's byte lookup on the resident schema (gives `Ok`, streaming the file's `GEOMETRY`) |
| CK-1 | `the_file_names_read_observes_a_cancel_already_requested` | s1's shape. `Dataset::open_cancellable(.., &token, PoolConfig::default())` with `token.cancel()` called first. `Err(Cancelled)`. Unmodified, nothing before the read observes the token (D1) | MK: the read run outside `cancellable` (gives `Err(GeoMetadata)`) |

**MO and M3 differ.** M3 checks for absence across all four paths before any refusal. MO returns whichever walk first fails to resolve. CC-2 lists the colliding path before the absent one, so it fails M3 but not MO. CC-7 lists the absent path first, so it fails MO.

**MG4 and MG1 differ.** MG1 replaces the whole file-name lookup with the resident-schema lookup. It fails G-1, and it would fail G-4 too, giving `Ok` there. MG4 limits that replacement to the miss arm, so only G-4 fails it.

**Unchanged and green without edit:**
- C-1 to C-5 in `engine/tests/covering_names_missing_column.rs`. C-3's rows d and e still keep their coverings (`:209-223 @ 5c6b7e37`).
- N-8, N-15 and `hostile_names_colliding_after_case_folding_bind_one_column_each` in `engine/tests/b1_projection_hostile_names.rs`.
- N-13 and N-14 in `engine/tests/b1_projection_hostile_covering.rs`.
- K-1 in `kernel/tests/skp_projection.rs`.
- `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`.
- The whole workspace suite.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions.**
- The P0 rows as §3 tabulates.
- Each new test green at the final commit, and each mutation failing its test by name.
- None of the tests named unchanged moves.

**Declared unchanged:**
- `probe_schema` and every resident name.
- `read_kv_metadata`.
- Every U+0000 reason and detail.
- The Absent detail and the no-covering detail.
- `check_geometry_column`'s three existing texts and codes.
- `sanity_check`, `covering_statistics`, `covering_sample` and `first_row_group_rows`.
- `EngineError`'s variants and Displays, and `error_of`.
- `describe` for every file that opens, with one declared exception: `covering_bbox` reads `false` for a covering that names a generated name the file lacks (CC-5). Among this form's test files, the open itself changes from an open at main to a refusal for CC-1 to CC-4, CC-7, G-2 and G-4. G-4's is the case of §1 item 4: a `geo.primary_column` spelled like a generated name, which at main opens reading the file's `GEOMETRY`. G-1's file is refused at main and after, its code moving from `engine.source` to `engine.geo_metadata` (OPEN-6).
- `engine/src/lod.rs`, `engine/src/fixture.rs`, `engine/src/layout.rs` and `engine/src/stream.rs`.
- `engine/ADMISSION-PREREGISTRATION.md`, and the generated `engine/ADMISSION-RESULTS.md` (no regeneration is owed).
- `protocol/`, `kernel/` and `frontends/`, all with empty diffs.
- The operator-supplied paths of the split yardstick.

**Invalidators** (each stops the piece and returns it to the custodian):
- any STOP outcome in §3;
- any test named unchanged, or any corpus row, moving;
- an `InternalInconsistency` from alignment on any existing fixture;
- a need for a `cfg` or an OS-keyed rule;
- the read impossible to bind through `cancellable`.

**Falsification** (the form is wrong if, after the change):
- a file opens with its covering kept while a declared segment reads a column other than the one the file names;
- the geometry stream reads a column other than the file's `primary_column` without a refusal;
- a `geo.primary_column` that matches none of the file's names byte for byte opens (G-4's case);
- a covering with an absent path and a path refused by clause (a) or (b) opens with the covering dropped, in either order (CC-2, CC-7);
- a refusal fires on a file whose declared names read the columns the file names, for example the truncated-child case of §2.4.

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
| `engine/src/dataset.rs` | 300 (code and comments) |
| `engine/tests/covering_case_collision.rs` (new) | 510 |
| `KNOWN-LIMITATIONS.md` | 6 (the architect's redraft: 4 for item 53, 2 for item 9's sentence); 4 if OPEN-B adds no sentence |
| `engine/README.md` (owner's index only: Last verified at, the Open and admission pins, the preregistrations list, Declared limits) | 4 |

- **How these were derived.** `engine/src/dataset.rs` gains no code path for G-4 or CC-7: G-4 runs §2.3 step 1's existing arm, and CC-7 runs §2.4 steps 4 and 5. MO and MG4 are applied and reverted, and count nowhere. The test file adds about 30 lines for CC-7 (s1's writer reused) and about 30 for G-4 (G-2's geometry writer reused). These are estimates, not counts.
- **Totals:** at most 820 lines over 4 files, besides this form.
- **Counting command**, at a named commit, three-dot range: `git diff --numstat origin/main...HEAD -- . ':(exclude)engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md'`, columns 1 and 2 summed, and per file with the file's path.
- **Overruns:** an overrun is class 8, and this section is never edited.
- **Budget** (my draft; PLAN is the custodian's): 330 minutes, including row g5 in the same P0 run and the two added tests with their mutations. Past twice that, the node stops.

## §8. Block-on-sight

1. A statement or `Connection` in `judge_covering`, `field_path_exists`, `check_geometry_column` or `check_names_align`.
2. A second site that decides covering ambiguity or misbinding. A second new statement in the open.
3. The new read outside `cancellable`, or any edit to the neighbours' reads.
4. A refusal after `sanity_check`, the identity scan or the descriptor.
5. Any change to `probe_schema` or to a resident name (B1 item 29; N-15).
6. A byte change to any text declared unchanged in §5.
7. A new `EngineError` variant, wire code, field, literal, `pub` item, constant, dependency, `cfg` or OS-keyed rule.
8. An engine message that states another module's consequence.
9. A second parquet reader in the open path.
10. An edit to `engine/src/lod.rs`, `engine/src/fixture.rs`, `protocol/`, `kernel/`, `frontends/` or `SKP-V0.md`.
11. An operator-supplied name judged against the file's names (OPEN-4).
12. A refusal detail or KNOWN-LIMITATIONS text other than the sighted words.
13. Any code before the P0's class-1 amendment.
14. An overrun not recorded as class 8.

## §9. Gates

- **Architect and reviewer, from dispatch.** Each checks §8 item by item. The reviewer recomputes the pins.
- **Suites:**
  - `cargo test --locked --workspace --features spatial-engine/fixture`, `cargo fmt --check`, and clippy as CI runs it, with no new warning in the added code;
  - CI's `node --test` scripts suite;
  - verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit (round 15 (c)).
  - Heavy runs happen inside the shared hold.
- **Operator:** no walkthrough row. Texts (a), (b), (g), the i-texts and the KNOWN-LIMITATIONS words go on the human's sight list before merge (OPEN-A).

## §10. Rule (00) at main 5c6b7e37, read from the in-flight pieces' forms (my reading; the finding at dispatch is the custodian's)

Rule (00): `AUTONOMY.md:609 @ 5c6b7e37`.

| this piece's path | #241 (redaction scan) | port-2 | 1c step 1 | reading |
|---|---|---|---|---|
| `engine/src/dataset.rs` | not among its 24 (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748 @ 5c6b7e37`) | not among its 16 (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ 5c6b7e37`) | `engine/` unchanged (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:677 @ 5c6b7e37`) | disjoint |
| `engine/tests/covering_case_collision.rs` (new) | no | no (its `lod_tier_*` tests differ) | no | disjoint |
| `KNOWN-LIMITATIONS.md`, item 53 (and item 9, if OPEN-B adds it) | item 47 (`:746`) | items 1 and 43 (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:310-311 @ 5c6b7e37`) | its own items 48 to 50 | disjoint by item; items 51 and 52 are on main (`KNOWN-LIMITATIONS.md:411` and `:415 @ 5c6b7e37`), so 53 is free |
| `engine/README.md` (owner's index) | **shared**, ceiling 4 (`:748`) | not edited (`:310`) | not edited (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:552 @ 5c6b7e37`) | sequenced after #241's merge (OPEN-C) |
| read only: `engine/src/fixture.rs` (`LV95_PROJJSON`) | edits it (`:734`) | no | calls only (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:550 @ 5c6b7e37`) | not an edit; a changed constant at the base is a stop |
| read only: `kernel/tests/typed_terminal_codes.rs` | edits it (`:732`) | no | no | read green at the base |
| `protocol/`, wire fixtures, Cargo.lock, package-lock.json | no | no | step 1 holds `protocol/` | this piece touches none |

**Others:**
- **#241's merge order:** after #244, following R2 on Monday (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:8 @ 5c6b7e37`).
- **The sort-window fix** is `kernel/tests/publish_cancellation.rs`, by its title (`PLAN.yaml:4281 @ 5c6b7e37`).
- **Milestone 4's form** excludes `engine/**` (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:402 @ 5c6b7e37`).
- **1c step 1's class-9 widening** (the directive, `:18`) is, on my reading, the `protocol/` and `kernel/src/session_history.rs` widening (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1008 @ 5c6b7e37`).
- **#244** is `frontends/shell/MANUAL-WALKTHROUGH.md`.
- All of these are disjoint.

## §11. KNOWN-LIMITATIONS: the architect's redraft (OPEN-8), carried as drafts for the human's sight, not the human's words

*The two blocks below are the architect's words, carried byte for byte from the item 53 redraft, sections 2 and 3. They are drafts for the human's sight (OPEN-8, OPEN-A), not the human's words, and none of them is lead-data's. The placement lines and the notes after the blocks are lead-data's.*

- **Item 53.** Placed as the redraft's section 2 gives it: at the end of the file, after item 52 (`KNOWN-LIMITATIONS.md:415-417 @ 8bb450c9`), in the section at `KNOWN-LIMITATIONS.md:200 @ 8bb450c9`. It adds 4 lines.

~~~
53. **A file is refused when it is opened if a name in its `covering.bbox` matches more than one of its column names, or if its `covering.bbox` or `geo.primary_column` names a column the app reads under another name.**
    When a file holds two column names that differ only in the case of the letters A to Z, or two such field names inside one column, the app reads the later one under a changed name, with a suffix added, such as `BBOX_1` for a second `BBOX`; a changed name that meets a name the file already holds is changed again, so the file's own `BBOX_1` is then read as `BBOX_1_1`. The names in a file's `geo` metadata, the paths of its `covering.bbox` and its `geo.primary_column`, are matched against the names the file itself holds, not the changed ones. Each part of a `covering.bbox` path is matched to the file's column names, and to the names of the fields inside a column, without regard to the case of the letters A to Z. Where one part matches two or more of them, such as `bbox` against columns named `bbox` and `BBOX`, the open is refused rather than one of them chosen, even when one is spelled exactly as the path is. Where it matches one, and the app reads that column under a changed name, as for a path naming `BBOX_1` in a file that holds `bbox`, `BBOX` and `BBOX_1`, the open is refused too: the path would not read the column the file names. `geo.primary_column` must match one of the file's column names exactly, and where the app reads that column under a changed name, the open is refused the same way. These refusals have the code `engine.geo_metadata` and name the declared name with the file's names it matches, or with the name the app reads that column under. A covering is refused this way even when another of its paths names a column the file does not contain. A covering path that matches none of the file's names names a column the file does not contain, as item 9 says, even when it is spelled like a changed name, such as `BBOX_1` in a file that holds only `bbox` and `BBOX`. A `geo.primary_column` that matches none of them exactly is refused as `engine.source`, with the same text as before, saying the file does not contain it; that now includes a name spelled like a changed name, such as `GEOMETRY_1` in a file that holds only `geometry` and `GEOMETRY`. In these checks a letter outside A to Z in a different case counts as a different letter. Only the names the file supplies are checked this way: names you supply, such as a column a filter names, are matched as before, against the names the app reads the columns under, and a file whose other columns have names that differ only in letter case is not refused. A file that holds two columns under exactly the `geo.primary_column` name is not judged by this check, and which of them the app reads is not established. A covering path containing U+0000 still opens with that covering unusable, as before, whatever its other paths match.
    <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, item 53, and §1); drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md, the covering-case paragraph (OPEN-2, OPEN-3, OPEN-4, OPEN-6, OPEN-8). Evidence for the changed names: state/drafts/covering-case-collision-p0/p0-output.txt, rows r1 to r4; hostile_names_colliding_after_case_folding_bind_one_column_each in engine/tests/b1_projection_hostile_names.rs; the full form's P0 outputs under state/drafts/covering-case-collision-full-form-p0/. Where the code does this, at <commit> on the piece's branch: read_file_names (the file's own names, read from the footer), check_names_align, judge_covering and field_path_exists (the covering's paths: more than one match, a match read under a changed name, then absence), and check_geometry_column (geo.primary_column), all in engine/src/dataset.rs; EngineError::GeoMetadata and EngineError::Source in engine/src/error.rs, through error_of's existing arms in kernel/src/skp.rs; CC-1 to CC-5 and G-1 to G-3 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. Not covered, by item 2c: an open cancelled while the file's names are read, which ends as cancelled before any of these checks (CK-1), a case inside one request round trip; the internal-inconsistency refusals for a footer whose names do not line up with the schema the app reads (check_names_align, and the walk's struct check), which the form's P0 is to show no ordinary file reaches; names that differ only in the case of a letter outside A to Z, where whether the app reads either under a changed name is not established; the LOD tiers' identity column, which is its own node (lod-tier-identity-binds-file-name), and build_tiers has no product caller (item 33). -->
~~~

- **Item 9's appended sentence.** Whether it is added stays open (OPEN-B). The sentence at `KNOWN-LIMITATIONS.md:114 @ 8bb450c9` stays byte for byte. Placed as the redraft's section 3 gives it: after `KNOWN-LIMITATIONS.md:116 @ 8bb450c9`, before the blank line at `:117`, with 3 spaces of indent. It adds 2 lines. The redraft's section 3 also gives a variant with a visible mark, opening "On main, if another path…"; that choice is the human's.

~~~
   If another path of that covering matches more than one of the file's column names, or names a column the app reads under another name, the file is refused when it is opened instead (item 53).
   <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, OPEN-B); the sentence above the earlier comments stays the human's wording. Where the code does this, at <commit> on the piece's branch: judge_covering in engine/src/dataset.rs, which refuses such a path before it records an absent one; CC-2 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. -->
~~~

- **Notes (lead-data's).**
  - The words assume the P0 comes out S-yes, G-yes, and K1 or K2. Row s3 decides the re-rename inside a column, and row g5 is what makes the `GEOMETRY_1` sentence true (the redraft's sections 4 and 6). Any other outcome returns the words to the architect through the P0 amendment.
  - Two test pointers in the comments predate this form's E-1 and E-2 tests. Item 53's comment names "CC-1 to CC-5 and G-1 to G-3", and item 9's names "CC-2". This form adds CC-7 (the other order, for clause 8 and item 9's sentence) and G-4 (the `GEOMETRY_1` case). The words are carried as written. Whether those pointers change before the human's sight is for the architect or the custodian, not lead-data.

## Amendments (opens empty; append-only)

---

## What the five-line form's closing amendment records (the custodian's, class 1)

- **First line:** written after the route read and the human's rulings were seen.
- **References only:**
  - the route read's path;
  - the ruling directive's path, by its covering-case paragraph;
  - this full form's path.
- **What it records:**
  1. No code landed under the five-line form (its Amendment 2, item 2).
  2. That form is superseded by this one.
  3. Its section 3 text, section 4 words, OPEN rulings and budget bind nothing further, except where this form names them (§2.6's text (a); OPEN-A to OPEN-C).
  4. The branch `cut/covering-case-collision-binds-other-column`: its state, as a fact, and whether this form reuses it.
  5. The PLAN node's `gate` moves to this form, by the custodian's commit on main.
  6. "Nothing above is edited."

---

## OPEN items (none blocks drafting; A to C need an answer before code)

- **OPEN-A:** texts (a), (b), (g) and the three i-texts join the human's sight list before merge. Do they again carry no P6 marker, as in the five-line form's section 3?
- **OPEN-B:** does F-2's ruling for item 9 (keep the sentence and append one) carry over to route 1, with the appended sentence redrafted by the architect alongside item 53? And does the primary-column refusal belong in item 53?
- **OPEN-C:** does the five-line form's OPEN-4 (A) carry over (code proceeds; the owner's-index commit follows #241's merge, by merging main into the branch)?
- **OPEN-D:** where is the neighbours' unbound-read gap recorded? A PLAN node or a KNOWN-LIMITATIONS line, the custodian's or the human's.
- **OPEN-E:** is it accepted that duplicate byte-equal primary_column names are not judged, or should the piece widen to cover them?
- **OPEN-F (not blocking):** whether the custodian wants a tester measurement of cold open after the added statement.
````

## What I could not settle

- **The test pointers in the architect's comments.** The §11 comments still name "CC-1 to CC-5 and G-1 to G-3" and "CC-2", without CC-7 and G-4. I carried the words byte for byte, as the brief asks, and left the pointer update to the architect or the custodian. This does not block the form's commit, but the comments go to the human's sight with those pointers unless someone updates them.
- **OPEN-B's wording against the redraft.**
  - The redraft's section 1 recommends putting the primary-column refusal inside item 53. Its section 3 says item 9's sentence is needed.
  - I kept OPEN-B's words as they were, as the brief asks. No finding changes it, though the redraft now gives the architect's answer to its second question.
- **§10 was not re-read at 8bb450c9.** Port-2's Amendment 4 (commit 8bb450c9) landed after 5c6b7e37. I did not check whether it changes port-2's file list. The custodian's rule (00) finding at dispatch governs.
- **G-4's changed outcome.** A file that opens at main (`GEOMETRY_1` declared beside `geometry` and `GEOMETRY`) is refused after the change.
  - I read this as inside OPEN-4 and OPEN-6: the file's names judge `primary_column`, and the text and code stay byte for byte.
  - The human sees it through §1 item 4, §5 and item 53's words. If the custodian reads an open-to-refusal change as needing its own ruling, it is a question for the human, not a decision of mine.
- **The ceilings are estimates.** The +60 test lines, the KL count of 6 (taken from the redraft's own count) and the 330 minutes are all estimates, not counts.
- **Row g5 is code reading only** (C-1's), like the other generated-name rows.

Result: the full form is revised for C-1, E-1 and E-2, with §7 re-derived and §11 carrying the architect's words; OPEN-A to OPEN-F are unchanged.
Blocking questions: none.
Report path: C:/dev/spatial-ide/state/consults/2026-10-23-covering-case-collision-binds-other-column-full-form-revised-lead-data-draft.md (not written by me; the brief says write no file and this message is the report).
sha256: not computed (no shell; the custodian hashes the filed bytes).
