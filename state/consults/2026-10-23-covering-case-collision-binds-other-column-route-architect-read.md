*Custodian's filing note (2026-10-23): the architect's read of `covering-case-collision-binds-other-column`'s P0 result for the human, read only at main c8351520. The run 14:03:43Z to 14:11:37Z by its transcript (Read 23, Glob 3, Grep 26; no Write, Edit or Bash). It drafts no form; its OPEN-1 to OPEN-9 are the human's, and nothing is dispatched under the node until the human answers. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 69911d064210b45b7f6eaabaa7b708caf645deeee6049e7804cee80be11ebd77.*

---

Read: covering-case-collision-binds-other-column, its P0 result for the human, at main c8351520

This is a read for the human, not a gate. I read the main checkout at c8351520 and ran nothing. I have no shell, so the report carries no sha256. Every cite is `@ c8351520`. The only quotation is the human's item 1, byte-copied from `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:8`. Everything else is my reading.

## What the P0 settles, and one case it did not test

- **Settled.** DuckDB's DESCRIBE and its Arrow export both rename the later of two names that differ only by case, at the top level and among struct children (`state/drafts/covering-case-collision-p0/p0-output.txt:185-215` @ c8351520). So the resident schema never holds two such names. The file's own names exist only in the footer. In r2 the covering is kept, and a bbox stream over the true extent returns 0 rows (`state/drafts/covering-case-collision-p0/p0-output.txt:193-199` @ c8351520).
- **Not tested: a generated name.** A covering path that matches exactly one of the file's names can still bind the wrong column, if one of DuckDB's generated names collides with it. The pinned rename test shows the pattern. A file with `zone`, `Zone` and `Zone_1` becomes resident `zone`, `Zone_1` and `Zone_1_1`, and resident `Zone_1` reads the file's `Zone` (`engine/tests/b1_projection_hostile_names.rs:228-267` @ c8351520).
  - The covering version of this is a file with `bbox`, `BBOX` and `BBOX_1` whose covering declares `BBOX_1`. The declared name matches one name in the file, yet binds the file's `BBOX`.
  - This is code reading over that test, not reproduced.
  - A check that only counts matches among the file's names misses this case. The human's item 1 rule ("a covering path that matches more than one schema name case-insensitively refuses the open by name") does not cover it either.
- **The footer read already exists.** DuckDB's `parquet_schema` returns the file's own names. The repo measured this at the top level: c14 gave `"zone", "Zone", "Zone_1"` (`state/drafts/a2-1-p0/p0-output.txt:185-188` @ c8351520; `engine/B1-PROJECTION-PREREGISTRATION.md:812-817` @ c8351520). Struct children were not measured.

## Where the engine reads a footer or file metadata

- **Through DuckDB:**
  - `parquet_kv_metadata` (`engine/src/dataset.rs:1075-1099` @ c8351520).
  - The schema probe (`engine/src/dataset.rs:1108-1164` @ c8351520).
  - `parquet_metadata`, used for the first row group's row count and for the covering statistics (`engine/src/dataset.rs:1500-1586` @ c8351520).
- **Directly with arrow-rs:** `lod.rs` only (`engine/src/lod.rs:1360-1366` @ c8351520).
- **Raw footer bytes, hashed and never parsed:** `engine/src/descriptor.rs`. It runs after admission (`engine/src/dataset.rs:565` @ c8351520).
- **A second divergence, which the siblings check did not name.** `covering_statistics` matches the declared path against the file's own `path_in_schema` names by byte equality (`engine/src/dataset.rs:1558-1563` @ c8351520). `covering_sample` and the stream bind through DuckDB instead (`engine/src/dataset.rs:1601-1610` @ c8351520). Under a format rule, r2's sanity level would read one struct while the stream reads the other.
- **The design note against a second reader.** The open path keeps one reader: metadata is read through DuckDB, "rather than through a second parquet implementation" (`engine/src/dataset.rs:6-8` @ c8351520). docs/05 gives DuckDB the GeoParquet-querying role (`docs/05_Data_Engine.md:9` @ c8351520).

## (1) Routes that could refuse r2 before any stream

**Route 1: read the file's own names through DuckDB, then judge the covering against them and against DuckDB's names. I recommend this one.**
- **The read.** One drained `parquet_schema(?)` statement on the open's existing lease, after `probe_schema` (`engine/src/dataset.rs:428` @ c8351520). From its rows the engine rebuilds the file's name tree, top level and struct children. Each name lines up by position with the resident field DuckDB binds.
- **The decision stays pure.** `judge_covering` takes the tree beside the resident schema and runs no statement. That keeps the parent form's rule of no `Connection` in the decision.
- **When it refuses**, with the existing `EngineError::GeoMetadata`, before `sanity_check`, the identity scan and the descriptor (`engine/src/dataset.rs:436` and `:524-565` @ c8351520):
  - (a) a declared segment matches more than one of the file's names at its level, ignoring ASCII case. This is item 1's rule, applied to the file's names. It refuses r1, r2, r3 and r4.
  - (b) the resident column DuckDB will bind for that segment is not at the position of the file's name it matches. This is the generated-name case above.
- **Absence** would be judged against the file's names too. Today a covering that declares a generated name such as `BBOX_1` is kept. Under this route it would be dropped as absent. That is OPEN-3.
- **Code it touches:** `engine/src/dataset.rs` (`judge_covering` and `field_path_exists` at `:1421-1472`, the call site at `:436`, and one new private reader), a new test file, KNOWN-LIMITATIONS and the `engine/README.md` index.
- **Dependency:** none. DuckDB's parquet extension is already built in (`engine/Cargo.toml:39` @ c8351520).
- **Wire:** nothing new. The refusal travels as the existing `engine.geo_metadata`. `describe.covering_bbox` stays a bool (`protocol/skp/SKP-V0.md:84` @ c8351520).
- **Cost and cancellation.**
  - It adds one statement to every open. Its cost is bounded by the footer, not the data.
  - docs/08's cold-open budget applies (`docs/08_Testing.md:7` @ c8351520). No performance claim can be made without a measurement.
  - docs/01 principle 7 says every operation is cancellable (`docs/01_Principles.md:13` @ c8351520). The neighbouring kv read and schema probe are not bound to the cancel token; the sanity reads are, through `cancellable` (`engine/src/dataset.rs:1480-1492` @ c8351520).
- **Which form.** My estimate is about 90–110 lines of code and 120–160 lines of tests: r2's order, the child level, the generated-name case, and an absent path beside an ambiguous one.
  - That crosses §21c's 150-line bound before any code (`AUTONOMY.md:349-353` @ c8351520).
  - It also crosses §21c's "no new user-visible behaviour" bound, as the current form already does.
  - So it needs full gating with the full form (`AUTONOMY.md:329-332` @ c8351520).
  - §21b's mid-piece overrun clause does not apply to an overrun known before dispatch (`AUTONOMY.md:345` @ c8351520).
- **P0 owed before its code:**
  - `parquet_schema` at DuckDB v1.5.5 gives the file's names for struct children, and `num_children` is enough to rebuild the tree.
  - The root's child count equals DESCRIBE's column count, including for a path under a `k=v` folder. Whether DuckDB auto-detects hive partitions there is not settled.
  - The generated-name case reproduces.

**Route 2: the same rule, with the file's names read by arrow-rs.**
- **Code:** the same as Route 1.
- **Dependency:** none new. `parquet` is already a non-optional shipped dependency (`engine/Cargo.toml:14-19` and `:44` @ c8351520).
- **Against it:**
  - It puts a second parquet reader into the open path, against `engine/src/dataset.rs:6-8` @ c8351520.
  - The open could newly fail wherever arrow-rs and DuckDB disagree about a footer.
  - It is the same size as Route 1, so it also needs the full form.
- **Not recommended.**

**Route 3: infer DuckDB's renames from the resident schema alone (the `_N` pattern).**
- **For it:** no new statement, and it might fit a five-line form.
- **Against it:**
  - It refuses a legitimate file that has a real `bbox_1` beside `BBOX`, with a detail that is untrue.
  - It encodes DuckDB's renaming scheme, which is pinned only by the test at `engine/tests/b1_projection_hostile_names.rs:262` @ c8351520.
  - It fails docs/01 principle 8 (`docs/01_Principles.md:14` @ c8351520).
- **Not recommended.**

**Route 4: read the column the file names instead of refusing.**
- **How:** the covering is rewritten to the bound names where it is stored (`engine/src/dataset.rs:582-587` @ c8351520). The statistics level keeps the file's names.
- **Against it:**
  - It chooses a column where item 1 says the open is refused.
  - It needs a precedence rule (does an exact spelling win?).
  - It touches both sanity reads.
- **For later, if at all.**

**Route 5: no code now.**
- A KNOWN-LIMITATIONS item states the fact in H3's terms (the KL words report, section 1, "Under H2 or H3"). It would be a docs-lane piece.
- The wrong-rows risk stays open. This is an interim measure at most.

## (2) Does the same change close the siblings check's findings?

- **Geometry column: not by itself.** Route 1's read and name tree are the primitive it needs, but it needs its own check in `check_geometry_column` (`engine/src/dataset.rs:1899-1926` @ c8351520).
  - The check: refuse when the column found by byte match is not at the position of the file's `primary_column`.
  - The two-name case would get a true text in place of "does not contain" (`engine/src/dataset.rs:1906` @ c8351520).
  - It needs its own tests and mutation.
  - It changes an existing text. If the refusal moves from `Source` to `GeoMetadata`, the code a client sees for that file also changes, from `engine.source` to `engine.geo_metadata`. That is a wire question for the human.
  - It is in the same file, so it can join Route 1's piece at a size cost, or follow it as its own piece.
- **LOD builder, geometry half:** closed by the geometry check. Once a renamed primary column is refused at open, the file's name and the bound name are the same.
- **LOD builder, identity half: not closed.**
  - `build_tiers` takes the bound identity name (`engine/src/lod.rs:1018` @ c8351520) and looks it up among arrow-rs's footer names (`engine/src/lod.rs:1365` @ c8351520).
  - It needs its own change in `lod.rs`.
  - `lod.rs` and `lod_tier_builder.rs` are among port-2's 16 files (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276` @ c8351520).
  - No product code calls `build_tiers` (`kernel/src/skp.rs:2204-2205` @ c8351520), so no operator can reach it today.
  - It should be its own node, after port-2, done before any SKP command calls `build_tiers`.
- **The statistics divergence above:** closed for refused files, because the refusal comes before `sanity_check`. Where the covering is kept, the two reads agree.
- **Not touched by any route:** the `file_row_number` session ordinal and the filter's `ID`/`"id"` alias case.

## (3) What the yardstick question decides for each route

- **Names the file supplies** (the covering's paths, `primary_column`). The file's writer chose them against the file's own columns. I read the file's names as the only coherent yardstick here.
  - If the human rules the app's names for these too, r2's read of `BBOX` is not wrong, and the node's S1 premise falls.
  - In that case Routes 1–4 lapse, and only Route 5's words remain.
- **Names the operator supplies from describe** (projection, filter, declared identity). The app's names are what ADR-023's 2026-09-29 amendment states (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:173` and `:178` @ c8351520). That amendment is Proposed and binds nothing.
  - Under the app's names, these are not defects, as the pinned test records.
  - Under the file's names, they become defects. Fixing them would change what `describe.schema[].name` carries: a wire and ADR matter, a separate full-gated piece, and outside Routes 1–4.
- **The LOD identity divergence** is wrong under either yardstick: one name reaches two columns inside the app.
- **My recommendation:** a split yardstick. The file's names for names the file supplies; the app's names for names the operator supplies.

## (4) Recommendation

Route 1, for the covering only, with both clauses (a) and (b), on a new full form.
- The current five-line form closes with a class-1 amendment. Its Change cannot fire, and no amendment class re-scopes a Change that widens (`docs/PREREGISTRATION-TEMPLATE.md:96-99` @ c8351520).
- The new form's P0 comes before any code.
- Geometry follows as its own piece on the same primitive, unless the human joins it.
- LOD identity becomes its own node after port-2.

Reasons:
- It is the only route that refuses r2 by name while keeping one reader and a pure decision.
- It adds no dependency and no wire change.
- Its refusal comes before every read that could disagree.

## In-flight pieces and shared engine files

- **Route 1** edits `engine/src/dataset.rs`, which no in-flight piece edits:
  - 1c declares `engine/` unchanged (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:677` @ c8351520).
  - #246 (PR A) declares `engine/**` unedited (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:402` @ c8351520).
  - #241's engine files are `engine/src/fixture.rs` and `engine/README.md` (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:734` and `:748` @ c8351520).
  - #244, #245 and #247 touch no engine file.
  - Port-2's engine files are `app_dirs.rs`, `lib.rs`, `lod.rs` and the `lod_tier` tests.
- **`engine/README.md`** is shared with #241, under the OPEN-4 (A) pattern.
- **KNOWN-LIMITATIONS:** the items differ.
- **The LOD route** shares `engine/src/lod.rs` and `engine/tests/lod_tier_builder.rs` with port-2.

## OPEN items, each the human's

- **OPEN-1, the route:** 1, 2, 3, 4 or 5. I recommend 1.
- **OPEN-2, the rule's reach:** item 1's rule alone (clause (a)), or with clause (b). Clause (b) goes beyond item 1's words.
- **OPEN-3, absence:** judged against the file's names. This turns today's kept covering into a dropped one for a declared generated name.
- **OPEN-4, the yardstick:** split, the file's names, or the app's names. I recommend split.
- **OPEN-5, the form:** a new full form that supersedes this one, or a five-line form with both gates by a ruling like OPEN-2 (A), knowing the line bound is crossed at dispatch.
- **OPEN-6, the geometry check:** joined to the covering piece or its own piece, and whether its refusal keeps `engine.source` or moves to `engine.geo_metadata`.
- **OPEN-7, the LOD identity:** its own node after port-2, done before `build_tiers` gets its first product caller.
- **OPEN-8, the KNOWN-LIMITATIONS words:** item 53 was drafted for H1 and needs new words for whichever route is chosen.
- **OPEN-9, cancellation:** whether the new statement is bound to the cancel token, unlike its neighbours.

## What I could not settle

- Whether `parquet_schema` at v1.5.5 gives struct children's own names, and whether `num_children` is enough to rebuild the tree. Only the top level was measured.
- Whether a path under a `k=v` folder adds hive columns to DESCRIBE, which would break the positional match.
- Whether the covering's generated-name case reproduces. It is code reading only.
- How arrow-rs names its fields when a file carries an embedded Arrow schema. This bears on the LOD half only.
- The line counts above are estimates, not counts.
