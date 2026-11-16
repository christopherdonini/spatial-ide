# large-utf8-and-utf8-view-attribute-columns: the probes U1 and U2 at ddaabe8e, run by a tester as scratch probes (ADV-2026-11-16-03 items 1 to 4); the tester's report

*Custodian's filing note (2026-11-16): the tester's report from its hand-back (9407 bytes, sha256 4ae1300d0ecfd79dcab0ef496ca5807905a598294b9689213b84360ddc5bb913), below the rule, byte for byte except as listed here. Its brief by file (13088 bytes, sha256 6cf56f54a67161b4c2c1adb639b2d1c0ad43484fdc057dacd5bc1fa853dafea7), dispatched at 2026-11-16T01:52:29Z; the run 2026-11-16T01:52:30Z to 2026-11-16T02:26:19Z by its transcript, 47 calls (Bash 40, Monitor 1, Read 1, SubagentHandback 1, Write 4), 3 errored, model claude-sonnet-5-5. Changes: the scratch folder's path written as <S> (1 time), as the profile-path rule asks. Nothing it wrote was committed; the probe worktree and its target on D: were removed after the report, the worktree's porcelain empty. By the report neither setting is on and neither type reaches a batch, so nothing is graded S1 (ADV-2026-11-16-03 item 3); told to the advisor.*

---

O3 probes at ddaabe8e: U1 on the product-configured connection DuckDB v1.5.5 has produce_arrow_string_view=false, arrow_large_buffer_size=false and arrow_output_version=1.0 (plain Utf8); U2 Utf8, LargeUtf8 and Utf8View sources all describe as `Utf8` / projectable=true and all stream a first batch with the column as Utf8 (no LargeUtf8 or Utf8View reached the IPC output).

Model: I observe myself as claude-sonnet-5-5 (Sonnet 5.5). No model override and no context handoff.

**Four failure classes for this harness:**
1. Interface: the harness uses the kernel's own SkpHost (open_dataset, describe, viewport_query), then redeems the ticket and calls BatchSource::next_into. That is what EngineSourceFactory does behind the data plane. It does not go through the WebSocket or the shell.
2. Claims point to existing results: every claim below points to `<S>/o3p/run-1.log` or to the saved program copies.
3. Operator-facing lines: the lines below describe what was measured at ddaabe8e.
4. Assertion reached: the probe printed the (a) and (b) values for all three files, so the measurement was reached, not only set up. The probe has no assert statements. It records values only.

No usage figures are at hand.

Paths: `<S>` = `<S>`, `<W>` = `C:/dev/wt/o3p`.

**Start state**
- HEAD ddaabe8e355b3b76530a2ba9c2879ccf838fcfe0.
- Porcelain empty.
- Cargo.lock sha256 44e10a8cc5b0d246ff370778d9fb825dd0bab7fa123c2e5a6bead30020889de2.
- `<S>/m4b-rec-onehold.mjs` was 635 bytes with sha256 18677923dc49fe463c072f071a2d74a70fefdec9119f46eff4600564743c28bf, as the brief gave.

**U1**
- How the connection was made: `spatial_engine::fixture::configured_connection()`. It is `Connection::open_in_memory()` plus `pool::configure_connection`, which runs `CONFIGURE_SQL` from `engine/src/pool.rs`.
- This is not a pooled connection from `Dataset`. The pool applies the same `CONFIGURE_SQL` through `configure_connection`, but I did not lease one.
- The statement that ran: `SET autoinstall_known_extensions=false; SET autoload_known_extensions=false; SET enable_geoparquet_conversion=false`.
- I read the three settings back, and all were `false`.
- `SELECT version()` returned `v1.5.5`.

Settings rows, whole (name, value, description):

| name | value | description |
|---|---|---|
| arrow_large_buffer_size | false | Whether Arrow buffers for strings, blobs, uuids and bits should be exported using large buffers |
| arrow_lossless_conversion | false | Whenever a DuckDB type does not have a clear native or canonical extension match in Arrow, export the types with a duckdb.type_name extension name. |
| arrow_output_list_view | false | Whether export to Arrow format should use ListView as the physical layout for LIST columns |
| arrow_output_version | 1.0 | Whether strings should be produced by DuckDB in Utf8View format instead of Utf8 |
| produce_arrow_string_view | false | Whether Arrow strings should be produced by DuckDB in Utf8View format instead of Utf8 |

No row matched `string_view` or `large` beyond the rows above.

**U2**
Each file has `id` (UInt64), `geometry` (Binary WKB) and one text column `zone`, 10 rows. The embedded Arrow schema was read back with `ParquetRecordBatchReaderBuilder::schema()`. The footer holds the `geo` and `ARROW:schema` keys.

| file | intended | read back from file | described `arrow_type` / `projectable` | batch column type | IPC field type |
|---|---|---|---|---|---|
| o3-utf8.parquet | Utf8 | Utf8 | Utf8 / true | Utf8 | Utf8 |
| o3-large-utf8.parquet | LargeUtf8 | LargeUtf8 | **Utf8** / true | Utf8 | Utf8 |
| o3-utf8-view.parquet | Utf8View | Utf8View | **Utf8** / true | Utf8 | Utf8 |

- (b) and the IPC field type are one and the same measurement. The engine's `BatchStream::next_into` writes IPC bytes directly, so there is no separate Arrow batch type to read. I decoded the bytes with `arrow::ipc::reader::StreamReader`. This is the IPC schema the data plane would send, but I did not run it through the WebSocket.
- (b) was read from the first batch returned (10 rows). The IPC schema fields were `id` UInt64, `geometry` a List of List of FixedSizeList(Float64, 2), and `zone` Utf8.

Files (all 4594 bytes; the base fixture is the writer's input, byte-identical to o3-utf8):

| file | sha256 |
|---|---|
| o3-utf8.parquet | aa797b1aa49e6834a5721377700b0c16bb54be10f64cb905f62079a68bfe7a75 |
| o3-large-utf8.parquet | 3c2c0cbcf402d5495f47e6daf260a8b6d318dbef0570289f3e0729499351af8a |
| o3-utf8-view.parquet | 59aa93ff0837fe8dee9161448e112aad916ee0d0f1b702e906e99451bb446e51 |
| o3-base-fixture.parquet | aa797b1aa49e6834a5721377700b0c16bb54be10f64cb905f62079a68bfe7a75 |

They are in `<S>/o3p/files/`. The four files have the same size, and the sha256 values separate them, so the three types are different files.

**Scratch programs** (saved copies; originals removed from `<W>`)
- `<S>/o3p/o3_probe_write.rs`: 3707 bytes, sha256 1d4bca5e7272085190e7bfe15afea9d3183df599f7a2fcdabf95d5e416a0220b. It ran from `engine/examples/`.
  - It calls `spatial_engine::fixture::write_hostile_names(&base, "id", &[HostileColumn{name:"zone",int:false}])`, reads the file back, copies its `geo` key-value metadata, and rewrites it with `ArrowWriter` (parquet 58.4.0, already in the lockfile).
  - The three column types come from `Arc::new(StringArray::from(vals))`, `Arc::new(LargeStringArray::from(vals))` and `Arc::new(StringViewArray::from(vals))`, with the schema field set by `Field::new("zone", ty, true)`.
- `<S>/o3p/o3_probe.rs`: 5094 bytes, sha256 f38b9d8aa6fe4783dae5a9a260eae40867ce9e22a06dad490acfcd7550d6d23c. It ran from `kernel/examples/`.
  - It builds `SkpHost::new(Arc::new(Catalog::new()), tickets.clone(), Arc::new(NoWatchArm), session_end_channel().0)`.
  - It opens each file with `host.open_dataset(...)`, then `host.describe(...)`, then `host.viewport_query(... columns: Some(vec!["zone"]))`.
  - It then calls `tickets.redeem(handle)` and `src.next_into(&mut buf)`, and decodes the bytes with `StreamReader`.
- `<S>/o3p/run.sh`: 585 bytes, sha256 e0febc3b6c0ee6312eabd5b64a1f28a8ea2f6626a100468ccaafacadbf496a89. It runs `cargo run --locked -p spatial-engine --example o3_probe_write` and then `cargo run --locked -p spatial-kernel --example o3_probe`, with `CARGO_TARGET_DIR=D:/wt-targets/o3p`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`.
- Full output is in `<S>/o3p/run-1.log`.

**Holds**
- Only one hold was taken.
- Status read before the wait: `<S>/o3p/status-1.txt`, at 01:55:45Z. It showed one `project=SpatialIDE` line (PR B's tester), so I waited with a 60 s loop (`<S>/o3p/wait.log`). The loop showed the line at 01:56:59Z and "none shown" at 01:59:02Z.
- I then waited 120 s more, which actually ran about 130 s.
- Status read before the hold: `<S>/o3p/status-2.txt`, at about 02:02:23Z. It showed no `project=SpatialIDE` line, and the `reading` line was quiet=False, average=14.9%, peaks-over-25=0.
- The hold: `hold shared -Project SpatialIDE -What "o3 probes: cargo run two scratch examples" -Minutes 40 -MaxWaitMinutes 8`.
- The re-read (`<S>/o3p/status-2b.txt`) passed `m4b-rec-onehold.mjs` with exit 0, and the hold printed "holds of this project after the grant: 1".
- The command was `bash <S>/o3p/run.sh > <S>/o3p/run-1.log`. It returned rc=0 and the script released the hold. The run logged START 02:03:34Z and END 02:25:21Z.
- The build took 10m39s for the writer and 11m05s for the kernel probe. These are build times, not a performance measurement.
- No `project=SpatialIDE` line was in the pre-hold read, and the hold-script lines I saw (MACHINE_HOLD, MACHINE_RELEASED) carried no `<m>` values to redact.

**End state**
- I removed `engine/examples/o3_probe_write.rs` and `kernel/examples/o3_probe.rs` after copying them.
- `git status --porcelain` is empty.
- `git diff --exit-code Cargo.lock` exited 0.
- Cargo.lock sha256 is again 44e10a8cc5b0d246ff370778d9fb825dd0bab7fa123c2e5a6bead30020889de2 (equal to the start).
- HEAD is still ddaabe8e.
- No process of mine is running. The background wait loops finished and I started no other processes.
- The build target `D:/wt-targets/o3p` still exists, and the `<S>/o3p/` files remain.

**Surprises**
- `describe` reports `Utf8` for a column the file embeds as LargeUtf8 or Utf8View. It reads the type through DuckDB, not through the embedded Arrow schema. So a shell that trusts `describe` sees no difference between the three files.
- DuckDB, not the product, converts the string type: `produce_arrow_string_view=false` and `arrow_large_buffer_size=false` hold on the product-configured connection, and the viewport output was `Utf8` even for the LargeUtf8 and Utf8View files.
- The product never receives a LargeUtf8 or Utf8View column from these three source types on this path. I did not test a different DuckDB setting or another export path, since nothing in engine/ or kernel/ sets one.
- In the parquet 58.4.0 writer, the schema written back for a Utf8View column is read back as Utf8View, which confirms the file really carried the type.
- A bash heredoc containing an apostrophe in an SQL string failed to parse, so I used the Write tool for the programs.
- My first wait-loop greps matched earlier than intended (they matched `rc=` text in the build log), so their notifications arrived before the run ended. The run itself was unaffected.