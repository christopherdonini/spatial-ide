# large-utf8-and-utf8-view-attribute-columns: lead-data's read-only read, the engine and kernel side (the architect's O3 at PR 327; ADV-2026-11-16-01 item 5 (a))

*Custodian's filing note (2026-11-16): the read-only read's report from its hand-back (9201 bytes, sha256 8d57ce7612c0325043a2b0c3c3457bf9a0ab6eedeacc5257dcf7bbea6784d66c), below the rule, byte for byte except as listed here. Its brief, in the Agent call (2473 bytes), was dispatched at 2026-11-16T00:54:18Z; the run 2026-11-16T00:54:28Z to 2026-11-16T00:58:31Z by its transcript, 40 calls (Glob 3, Grep 17, Read 19, SubagentHandback 1), 0 errored, model claude-opus-5-5. It ran nothing. Changes: the scratch folder's path written as <S> (1 time), as the profile-path rule asks. The advisor's ruling ADV-2026-11-16-01, item 5, asked for this read (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-01-pr-327-the-two-p6-statements-one-colour-as-drafted-colour-by-one-clause-changed-the-node-added-not-placed-pr-326-lines-compared.md`).*

---

Result: from reading alone, no shipped engine or kernel path makes the engine emit a LargeUtf8 or Utf8View attribute column to the shell. That holds only if the bundled DuckDB's string-export settings are at their defaults, which nothing in engine/ or kernel/ shows. The first probe in part 3 settles it. If they are not at their defaults, an ordinary file would reach it.
Blocking questions: none.
Report path: <S>/o3-read-lead-data.md (nothing written there, as the brief asked).
sha256: none, because no file was written and I have no tool to hash this text. The custodian hashes the saved bytes.

---

# O3, the engine and kernel side: which shipped path can make the engine emit a LargeUtf8 or Utf8View attribute column

Read-only, main at c1d6ee05. All wording below is mine unless it is in a code span copied from the file.

## 1. The answer for each type

**The one source of an attribute's type.** Only DuckDB's Arrow export of `read_parquet` decides what type an attribute column has. Opening a dataset records that export as the dataset's resident schema. Admission, describe, the live stream and the filter all read that schema. The engine copies the type through unchanged: admission returns the source type as is, and the chunk loop refuses any chunk whose type differs from the declared one. So the engine emits LargeUtf8 or Utf8View exactly when DuckDB exports one. The arms O3 cites (`attributes.rs:81-83, 94`) do admit both types, but nothing in the engine ever creates either one.

**Whether DuckDB exports either type.** Every product connection runs one configuration statement. That statement sets extension autoload, extension autoinstall and GeoParquet conversion, and nothing about how strings are exported to Arrow. I believe, but have not checked against the bundled source, that with no such setting DuckDB exports VARCHAR as plain Utf8. If so, a Parquet text column reaches the engine as Utf8 whatever Arrow type its writer recorded, because DuckDB reads it as VARCHAR.

- **LargeUtf8.** No shipped path, by reading, if DuckDB's large-buffer export is off by default in the bundled version. If it is on, every text column of every file becomes LargeUtf8, so every ordinary file reaches it.
- **Utf8View.** The same, for DuckDB's string-view export setting and its Arrow output version. If either one turns views on, every ordinary file reaches it.
- **Dictionary of either type.** The engine decodes a dictionary column to its value type (`attributes.rs:101`, `stream.rs:2314-2321`), so a dictionary over LargeUtf8 or Utf8View would come out as that type. The engine's own comment says DuckDB's Parquet reader never reports a Dictionary in this pinned version (`stream.rs:2310-2311`). So this path is unreachable, on that comment's evidence.

**The paths, one by one:**

- **Open of a GeoParquet file, single file or partitioned.** `read_parquet` is the only format reader on the open path, and the schema probe takes the DuckDB export's types as they come. Whether an ordinary file reaches either type depends only on the export settings above.
- **No other format.** No other format reader exists in engine/ or kernel/; the only CSV names in kernel/src are test strings in `dataset_ref.rs:953, 977`. Which file types the shell lets a user open is on the architect's side of this read.
- **SQL filter.** It adds a WHERE clause only and changes no projected column. Its surrogate maps all three text types to VARCHAR (`predicate.rs:1283`). It reads types and emits none.
- **Viewport query and live projection.** The query selects the declared columns by name and nothing else; there is no cast and no expression. Chunk types must equal the resident schema's types.
- **The kernel.** Describe reports `f.data_type().to_string()` for each column, with `projectable` taken from the engine's own admission check. I found no batch rebuild or cast in `kernel/src/{lib,skp,params}.rs`.
- **The LOD tier builder.** It uses arrow-rs, which does follow a file's embedded Arrow schema. But it reads only the identity and geometry columns, and tiers carry no attributes. Not a path to this.
- **Layout rewriter.** `spatial_engine::layout` is test support behind the `fixture` feature (engine owner's index), not a shipped path.

**What an ordinary file is.** Text columns that their writer typed as large_string or string_view are common in my view: pyarrow large_string, pandas or GeoPandas with pyarrow-backed strings, and polars all write them. They sit in the file's embedded Arrow schema, while the Parquet data itself is plain UTF8 byte arrays. By the reading above, DuckDB ignores that embedded type, so those files still arrive as Utf8. No engine or kernel test opens such a file: no test or fixture under engine/ or kernel/ names LargeUtf8 or Utf8View. Only the unit test at `attributes.rs:618` does, and it calls the admission function directly.

**Where a fix would sit.** If the probes confirm that neither type can arrive:
- engine side: the admitted set (`attributes.rs:81-83`, `121-139`) and the filter surrogate (`predicate.rs:1283`);
- shell side: the decode and the column chooser O3 names.

Narrowing the admitted set would change describe's `projectable` fact. It would also make the engine disagree with the type list at `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:47` (ADR-023 is Proposed). That is a contract question for the custodian. I make no proposal.

## 2. The cites (main, c1d6ee05)

- Admission returns the type unchanged: `engine/src/attributes.rs:78-94`. Dictionary to value type: `:101`. The live type check builds the emitted field from that: `:480-496`. Projection admission runs against the dataset's own `file_schema`: `engine/src/stream.rs:989-998`.
- Resident schema = DuckDB's Arrow export of `SELECT * FROM read_parquet(?) LIMIT 0`, types kept: `engine/src/dataset.rs:1115-1122`, `1149-1170`. Called in the open: `:431`. Stored: `:157`, `:608`. Accessor: `:1052-1054`.
- Stream SQL, columns by name only: `engine/src/stream.rs:1440-1445`. Chunk type must equal the declared type, otherwise `EncodingMismatch`: `:1957-1972`. Dictionary decode, and the comment that read_parquet never yields a Dictionary: `:2305-2321`. String size estimate handles all three array types: `:2341-2346`.
- Connection configuration, with no Arrow export setting: `engine/src/pool.rs:185-187`, applied at `:201-212` and `:431-440`.
- Filter: it only reads `file_schema` (`engine/src/predicate.rs:1159-1179`), and all three text types map to VARCHAR (`:1283`). The predicate is wrapped and placed in WHERE: `engine/src/stream.rs:1451-1465`.
- Describe: `kernel/src/skp.rs:2029-2047`.
- LOD tier: reads only id and geometry (`engine/src/lod.rs:1363-1389`). Tier schema has no attributes (`:1684-1694`).
- Pinned crates: `engine/Cargo.toml:48` (duckdb `1.10505.0`, bundled), `:53` (parquet 58). `Cargo.lock:541-542`, `:1185-1186`.
- The only engine/kernel `.rs` mentions of either type, by search: `attributes.rs:82-83, 126-127, 618`, `predicate.rs:1283, 2691-2699`, `stream.rs:2327, 2343`.

## 3. What is unsettled, and a probe for each

I could not find DuckDB's bundled source on this machine, so the following were not settled by reading.

- **U1. DuckDB's default string export in the bundled version.** The whole answer depends on this.
  - Probe: on a connection set up with `configure_connection`, run `SELECT name, value FROM duckdb_settings() WHERE name ILIKE '%arrow%' OR name ILIKE '%string_view%'` and record the values.
- **U2. Whether DuckDB's reader honours a file's embedded large_string or string_view type.**
  - Probe: write small GeoParquet files whose text column is pyarrow `pa.string()`, `pa.large_string()` and `pa.string_view()`. Add one written by GeoPandas `to_parquet` under pandas with pyarrow-backed strings, and one written by polars.
  - Open each through the kernel's `open_dataset` and `describe`, or `Dataset::open_cancellable` and then `file_schema()`, and record `arrow_type`.
  - Then run a `viewport_query` that projects the column, and record the batch schema's field type.
- **U3. A dictionary over a large or view string type.** The evidence that this cannot arrive is the code comment at `stream.rs:2310-2311`, which I have not re-checked.
  - Probe: the same as U2, with the column written as a pandas categorical (pyarrow dictionary over large_string).
- **U4. Very large strings.** If one result chunk holds more than 2 GiB of text, DuckDB may either refuse or switch type; I could not tell which from reading. Only a crafted file reaches this.
  - Probe: a file whose single row group has rows of more than 1 MiB of text, enough to push one export chunk past 2^31 bytes. Record whether the open or the stream ends in a typed error or a type change. It is a heavy run, so the machine rules apply.
- **U5. Outside engine/ and kernel/.** I did not read whether the data plane's encoder (`protocol/data-plane`) changes a column's type on the wire. It is the protocol module's, not mine.
  - Probe: in the U2 run, record the field type in the IPC schema the shell receives, next to the engine's.
