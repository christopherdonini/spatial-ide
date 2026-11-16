# dictionary-column-described-as-its-value-type-for-the-chooser: probe U3 (ADV-2026-11-16-06 item 1 (e)), a GeoParquet text column typed Dictionary(Int32, Utf8): the type read back, the described type, the batch's type, and whether PR B's match-key rule offers it; scratch, nothing committed

*Filed by the custodian, 2026-11-16: the hand-back of 2026-11-16T04:06:03Z, 6970 bytes, sha256 53486168c0a53f6ece00d909da7e0faa25c5758367337c214d95c3fcf77e292c, model claude-sonnet-5-5, 27 calls in the transcript (Bash 24, Monitor 1, Read 1, SubagentHandback 1), 1 errored; dispatched 2026-11-16T03:38:11Z, the tester on its default model, a clean worktree at main 2e99751d; changes: the scratch path written <S> (1).*

---

U3 probe at 2e99751d: file embeds Dictionary(Int32, Utf8); described arrow_type `Utf8` (projectable=true), batch column Utf8; offered YES (see caveat: the kernel's describe on a dictionary file does NOT say Dictionary at all).

Model: I observe myself as claude-sonnet-5-5 (Sonnet 5.5). No override, no context handoff. No usage figures at hand.

Four failure classes: (1) interface: kernel SkpHost open_dataset, describe, viewport_query, then tickets.redeem + next_into, decoded with the IPC StreamReader (what EngineSourceFactory does behind the data plane; not through WebSocket or shell). (2) Claims point to existing files: `<S>/o4p/run-1.log` and the saved programs. (3) Operator-facing lines describe what was measured at 2e99751d. (4) Assertion reached: the probe printed the describe and batch values; it has no assert statements, it records values only.

`<S>` = <S>

**Start state**: HEAD 2e99751dc20106d36f1fe151815f7ed6eb1b5029; porcelain empty; C:/dev/wt/o4p/Cargo.lock sha256 44e10a8cc5b0d246ff370778d9fb825dd0bab7fa123c2e5a6bead30020889de2. Brief 12374 bytes, sha256 0b8bf185...b854 as given. m4b-rec-onehold.mjs 635 bytes, sha256 18677923dc49fe463c072f071a2d74a70fefdec9119f46eff4600564743c28bf, as given.

**U3 results**
- Type read back from the file's embedded schema (ParquetRecordBatchReaderBuilder::schema()): `Dictionary(Int32, Utf8)` for `zone` (writer's own readback line in run-1.log).
- Described by the kernel: `zone arrow_type=Utf8 nullable=true projectable=true` (id UInt64 projectable=false; geometry Binary projectable=false).
- First batch (viewport_query, columns=["zone"], 10 rows, meta.rows=10): `zone` Utf8; IPC schema field `zone` type=Utf8.
- File: `<S>/o4p/files/o4-dictionary.parquet`, 4510 bytes, sha256 de2fda611325f64b95306f826bb8f9f7bde432fe600def32be18dfc0c7a3a420. 10 features, zone cycles alpha/beta/gamma (3 distinct). Base fixture `o4-base-fixture.parquet` 4594 bytes, sha256 aa797b1aa49e6834a5721377700b0c16bb54be10f64cb905f62079a68bfe7a75.
- Reading (mine): DuckDB, which describe reads through, presents the dictionary column as a plain string. The describe never carries "Dictionary(...)" for this file, as with LargeUtf8 and Utf8View in the earlier probe. The architect's premise (described by its dictionary type, batches carrying the value type) did not hold for a Parquet file read by this engine.

**Match-key rule (read only, at 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a)**
- Path/lines: `renderer/style-ts/src/style.ts` lines 45-47, exactly:
```
export function admitsMatchKeyType(arrowType: string): boolean {
  return arrowType === 'Utf8' || arrowType === 'LargeUtf8' || arrowType === 'Utf8View';
}
```
- Caller: `frontends/shell/src/style/StylePanel.tsx:94`: `const candidates = columns.filter((c) => admitsMatchKeyType(c.arrowType));`
- Input to the rule: the DESCRIBED type only. `frontends/shell/src/App.tsx:857` builds `columns` as `admitted.describe.schema.filter((f) => projection.includes(f.name)).map((f) => ({ name: f.name, arrowType: f.arrow_type }))`; `projection` is `projectionFor(describe)`, which keeps `projectable: true` rows (`frontends/shell/src/attributes/projection.ts:16`). The batch type is not consulted.
- With the described values from U3 (Utf8, projectable=true): the column is projected and `admitsMatchKeyType('Utf8')` is true (style.ts:46), so the chooser OFFERS it. Deciding lines: projection.ts:16, App.tsx:857, StylePanel.tsx:94, style.ts:45-46.
- Also in the tree: `renderer/tests/data/style-agreement.json` line 49 has `{"arrow_type": "Dictionary(Int32, Utf8)", "admitted": false}`, so the rule would refuse the string `Dictionary(Int32, Utf8)` if it were ever described. By this probe a Parquet dictionary column is never described that way here. Not tested: other sources or DuckDB paths that might describe a dictionary type.

**Scratch programs** (saved copies; originals removed from `<W>`)
- `<S>/o4p/o4_probe_write.rs`: 2704 bytes, sha256 fdba52a7df08b5fbf4bf16e53d21254b912e37a30385d258a646f664ad015e66 (ran from engine/examples/). Dictionary-setting lines, quoted exactly:
```
let dict: DictionaryArray<Int32Type> = vals.iter().copied().collect();
let ty = DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8));
fields[zi] = Field::new("zone", ty.clone(), true);
```
It uses write_hostile_names for the base fixture and geo metadata, then rewrites with parquet's ArrowWriter (crates already in the lockfile).
- `<S>/o4p/o4_probe.rs`: 5083 bytes, sha256 e387f5d35789c72b14267f5e3b7e0fa6abc7be592c3faa8b69b634495a144d28 (ran from kernel/examples/). Adapted from the earlier o3 probe: open, describe, viewport_query on `zone`, redeem, next_into, IPC decode; the U1 function is left in but not called.
- `<S>/o4p/run.sh`: 508 bytes, sha256 6e9b9b9ce308fa1c5285e107f85489e5c3a4c482e5dbb2adf918f38d3217ca9b (cargo run --locked, CARGO_TARGET_DIR=D:/wt-targets/o4p, jobs 8).
- Full output `<S>/o4p/run-1.log`.

**Holds** (one)
- Status read before it: `<S>/o4p/status-1.txt` at 2026-11-16T03:40:42Z (own call): no `project=SpatialIDE` line; reading line: quiet=False, average=50.1%, peaks-over-25=60.
- Hold: `hold shared -Project SpatialIDE -What "u3 probe: cargo run two scratch examples" -Minutes 40 -MaxWaitMinutes 8`, granted (pid 4280, started 03:40:49Z).
- Re-read `<S>/o4p/status-2b.txt`, then m4b-rec-onehold.mjs: the hold printed "holds of this project after the grant: 1", and the chain continued, so the exit was 0. The re-read's reading line: average=45.4%, peaks-over-25=60; only my own hold showed for this project.
- Command: `bash <S>/o4p/run.sh > <S>/o4p/run-1.log 2>&1` (writer then kernel probe, cargo run --locked). rc=0 (`<S>/o4p/rc.txt`). Start 03:41:54Z, end 04:05:13Z (build-dominated; not a performance measurement). Released (MACHINE_RELEASED printed). The hold lines carried no `<m>` values.

**End state**: removed engine/examples/o4_probe_write.rs and kernel/examples/o4_probe.rs from `<W>`; `git status --porcelain` empty; `git diff --exit-code Cargo.lock` rc 0; Cargo.lock sha256 44e10a8cc5b0d246ff370778d9fb825dd0bab7fa123c2e5a6bead30020889de2 (equals start); HEAD still 2e99751d. The tasklist check found no cargo or o4_probe process. The wait loops I started in the background have all finished. `D:/wt-targets/o4p` and `<S>/o4p/` remain. Nothing committed.

**Surprises**
- Describe reports the VALUE type (`Utf8`) for the dictionary column, not the dictionary type: the node's premise (chooser hides it) does not reproduce for Parquet through the shipped describe; the chooser offers it.
- The tester tool set has no Monitor tool, so I waited with bounded foreground loops; several were moved to the background by the harness after 180 s, and all ended on their own.
- The run's first status-1 read was taken in a separate call before the hold, as briefed; the hold was taken straight after (7 s later).