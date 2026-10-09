*Custodian's filing note (2026-10-09): the worker's report of `duckdb-parquet-geometry-probe`, reported only, in the detached worktree `C:/dev/wt/cov` at e73a594c (slot 2, item d, run ahead of items a to c, which wait on the human). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 66500e97cbb0a518045122f933bea25c6134567586939375e9a47852a19c1ba4. Run window from the transcript: 07:01:58Z to 07:03:34Z (Bash 8, Grep 2, Read 1, no Write; the scratch test was written and deleted through Bash, as the brief allowed). The custodian checked that the worktree's `git status --porcelain` is empty at e73a594c. The run's output is the capture file's lines 5 to the end, byte for byte, at `state/drafts/duckdb-parquet-geometry-probe/probe-output.txt`, and the scratch source is the report's section 2, at `state/drafts/duckdb-parquet-geometry-probe/probe-test.rs.txt`. The claim it checks is in the human's private repository `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, `REUSE-ROUND-1.md` lines 94 and 95; the report puts two short phrases of that claim in quotation marks, cited by repository, commit, path and line, and copies nothing else from it. The worker's two deviations from the machine paragraph's literal shape are in its section 5: the script path held in a shell variable, and a call timeout above the tool's maximum; the hold was granted and released.*

---

1. Result: on the bundled DuckDB, the Parquet-native GEOMETRY column of corpus #11 reads back as WKB bytes that are identical with `enable_geoparquet_conversion` true and false. That supports the claim's behavioural part, which says the setting does not change the result. The probe cannot show the mechanism, meaning that DuckDB uses its own WKB reader. The manifest part is only partly checked (see Q5).

Preliminary check: the file's sha256 is ff90b4800d71b94c6f0e2bb813835f6d85828a82d991a1fe71c80cc756f38767. That matches the MANIFEST.json entry for geoparquet-spec/example.parquet.

2. Scratch test source: `engine/tests/p0_parquet_geometry_scratch.rs`, untracked and now deleted. A copy is at D:/wt-targets/p0_parquet_geometry_scratch.rs.txt.
```rust
//! Scratch probe, untracked, not committed.
use duckdb::arrow::array::{Array, BinaryArray, LargeBinaryArray, RecordBatch};
use duckdb::arrow::util::display::array_value_to_string;
use duckdb::Connection;
use spatial_engine::{Dataset, ViewportQuery};

const P: &str = "C:/dev/spatial-ide/target/fixtures/compat-corpus/geoparquet-spec/example.parquet";

fn hex(b: &[u8]) -> String {
    b.iter().map(|x| format!("{x:02x}")).collect()
}

fn first_bytes(batches: &[RecordBatch], col: &str) -> (String, Option<Vec<u8>>) {
    let b = &batches[0];
    let idx = b.schema().index_of(col).unwrap();
    let a = b.column(idx);
    let dt = format!("{:?}", a.data_type());
    if let Some(x) = a.as_any().downcast_ref::<BinaryArray>() {
        return (dt, Some(x.value(0).to_vec()));
    }
    if let Some(x) = a.as_any().downcast_ref::<LargeBinaryArray>() {
        return (dt, Some(x.value(0).to_vec()));
    }
    (format!("{dt} [not a binary array; display: {}]", array_value_to_string(a, 0).unwrap_or_default()), None)
}

#[test]
fn probe() {
    let con = Connection::open_in_memory().unwrap();
    let v: String = con.query_row("PRAGMA version", [], |r| r.get(1)).unwrap();
    println!("=== Q0 DuckDB library version ===\nlibrary_version={v}");
    let src: String = con.query_row("PRAGMA version", [], |r| r.get(0)).unwrap();
    println!("pragma col0={src}");

    println!("=== Q1 type as DuckDB reports ===");
    let mut st = con.prepare(&format!("DESCRIBE SELECT * FROM read_parquet('{P}')")).unwrap();
    let rows = st.query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?))).unwrap();
    for r in rows { let (n, t) = r.unwrap(); println!("DESCRIBE {n}: {t}"); }
    let mut st = con.prepare(&format!("SELECT name, type, converted_type, logical_type FROM parquet_schema('{P}')")).unwrap();
    let rows = st.query_map([], |r| Ok(format!("{:?} | {:?} | {:?} | {:?}",
        r.get::<_, Option<String>>(0)?, r.get::<_, Option<String>>(1)?, r.get::<_, Option<String>>(2)?, r.get::<_, Option<String>>(3)?))).unwrap();
    for r in rows { println!("parquet_schema: {}", r.unwrap()); }

    println!("=== Q2 read_parquet geometry column per setting ===");
    let mut got: Vec<(bool, Option<Vec<u8>>)> = vec![];
    for flag in [true, false] {
        con.execute_batch(&format!("SET enable_geoparquet_conversion = {flag}")).unwrap();
        let mut st = con.prepare(&format!("DESCRIBE SELECT geometry FROM read_parquet('{P}')")).unwrap();
        let rows = st.query_map([], |r| Ok(r.get::<_, String>(1)?)).unwrap();
        for r in rows { println!("flag={flag} DESCRIBE geometry: {}", r.unwrap()); }
        let mut st = con.prepare(&format!("SELECT geometry FROM read_parquet('{P}') LIMIT 1")).unwrap();
        let batches: Vec<RecordBatch> = st.query_arrow([]).unwrap().collect();
        let (dt, bytes) = first_bytes(&batches, "geometry");
        match &bytes {
            Some(b) => println!("flag={flag} arrow={dt} len={} first32hex={}", b.len(), hex(&b[..b.len().min(32)])),
            None => println!("flag={flag} arrow={dt}"),
        }
        got.push((flag, bytes));
    }

    println!("=== Q3 WKB check and equality ===");
    for (flag, b) in &got {
        match b {
            Some(b) if b.len() >= 5 => {
                let le = b[0] == 1;
                let t = if le { u32::from_le_bytes([b[1], b[2], b[3], b[4]]) } else { u32::from_be_bytes([b[1], b[2], b[3], b[4]]) };
                println!("flag={flag} byte_order_flag={} ({}) geometry_type_code={t}", b[0], if le { "little-endian" } else if b[0]==0 {"big-endian"} else {"invalid"});
            }
            _ => println!("flag={flag} not a byte array"),
        }
    }
    println!("same_bytes_first_value={}", got[0].1 == got[1].1);
    let n_all: i64 = {
        let mut eq = true;
        let mut cnt = 0i64;
        let mut vals: Vec<Vec<Option<Vec<u8>>>> = vec![];
        for flag in [true, false] {
            con.execute_batch(&format!("SET enable_geoparquet_conversion = {flag}")).unwrap();
            let mut st = con.prepare(&format!("SELECT geometry FROM read_parquet('{P}')")).unwrap();
            let batches: Vec<RecordBatch> = st.query_arrow([]).unwrap().collect();
            let mut v = vec![];
            for b in &batches {
                let a = b.column(0);
                if let Some(x) = a.as_any().downcast_ref::<BinaryArray>() { for i in 0..x.len() { v.push(Some(x.value(i).to_vec())); } }
                else if let Some(x) = a.as_any().downcast_ref::<LargeBinaryArray>() { for i in 0..x.len() { v.push(Some(x.value(i).to_vec())); } }
                else { v.push(None); }
            }
            cnt = v.len() as i64;
            vals.push(v);
        }
        if vals[0] != vals[1] { eq = false; }
        println!("all_rows_count={cnt} all_rows_identical_across_settings={eq}");
        cnt
    };
    let _ = n_all;

    println!("=== Q4 engine today ===");
    match Dataset::open(P) {
        Ok(ds) => {
            println!("open=Ok geometry_column={}", ds.geometry_column());
            println!("geometry_encoding={:?}", ds.geometry_encoding());
            println!("declared_geometry_types={:?}", ds.declared_geometry_types());
            println!("covering={:?}", ds.covering());
            println!("geoparquet_version={}", ds.geoparquet_version());
            println!("file_schema={:?}", ds.file_schema());
            match ds.stream(&ViewportQuery::all()) {
                Ok(mut s) => {
                    let mut buf = Vec::new();
                    match s.next_into(&mut buf) {
                        Some(Ok(info)) => println!("first_batch=Some(Ok) rows={} vertices={} bytes={}", info.rows, info.vertices, buf.len()),
                        Some(Err(e)) => println!("first_batch=Some(Err) {e:?} / {e}"),
                        None => println!("first_batch=None"),
                    }
                }
                Err(e) => println!("stream=Err {e:?} / {e}"),
            }
        }
        Err(e) => println!("open=Err {e:?} / {e}"),
    }
}
```

3. Run stdout, byte for byte from the test's lines. The full captured file, with cargo's lines, is D:/wt-targets/p0_probe_out.txt.
```
running 1 test
=== Q0 DuckDB library version ===
library_version=d8cdaa33fd
pragma col0=v1.5.5
=== Q1 type as DuckDB reports ===
DESCRIBE pop_est: DOUBLE
DESCRIBE continent: VARCHAR
DESCRIBE name: VARCHAR
DESCRIBE iso_a3: VARCHAR
DESCRIBE gdp_md_est: BIGINT
DESCRIBE geometry: GEOMETRY
parquet_schema: Some("schema") | None | None | None
parquet_schema: Some("pop_est") | Some("DOUBLE") | None | None
parquet_schema: Some("continent") | Some("BYTE_ARRAY") | Some("UTF8") | Some("StringType()")
parquet_schema: Some("name") | Some("BYTE_ARRAY") | Some("UTF8") | Some("StringType()")
parquet_schema: Some("iso_a3") | Some("BYTE_ARRAY") | Some("UTF8") | Some("StringType()")
parquet_schema: Some("gdp_md_est") | Some("INT64") | None | None
parquet_schema: Some("geometry") | Some("BYTE_ARRAY") | None | Some("GeometryType(crs=<null>)")
=== Q2 read_parquet geometry column per setting ===
flag=true DESCRIBE geometry: GEOMETRY
flag=true arrow=Binary len=400 first32hex=01060000000300000001030000000100000008000000000000000080664072d6
flag=false DESCRIBE geometry: GEOMETRY
flag=false arrow=Binary len=400 first32hex=01060000000300000001030000000100000008000000000000000080664072d6
=== Q3 WKB check and equality ===
flag=true byte_order_flag=1 (little-endian) geometry_type_code=6
flag=false byte_order_flag=1 (little-endian) geometry_type_code=6
same_bytes_first_value=true
all_rows_count=5 all_rows_identical_across_settings=true
=== Q4 engine today ===
open=Ok geometry_column=geometry
geometry_encoding=MultiPolygon
declared_geometry_types=Some(["Polygon", "MultiPolygon"])
covering=None
geoparquet_version=2.0.0
file_schema=Schema { fields: [Field { name: "pop_est", data_type: Float64, nullable: true }, Field { name: "continent", data_type: Utf8, nullable: true }, Field { name: "name", data_type: Utf8, nullable: true }, Field { name: "iso_a3", data_type: Utf8, nullable: true }, Field { name: "gdp_md_est", data_type: Int64, nullable: true }, Field { name: "geometry", data_type: Binary, nullable: true, metadata: {"ARROW:extension:name": "geoarrow.wkb", "ARROW:extension:metadata": "{}"} }], metadata: {} }
first_batch=Some(Ok) rows=5 vertices=1343 bytes=26376
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s
```

4. Answers.
Q0: `PRAGMA version` reports library version v1.5.5, source id d8cdaa33fd.
Q1: `DESCRIBE` gives the column type GEOMETRY. `parquet_schema` gives physical type BYTE_ARRAY, no converted type, and logical type `GeometryType(crs=<null>)`. So the file carries the Parquet-native GEOMETRY logical type.
Q2: both settings give `DESCRIBE geometry` = GEOMETRY. `query_arrow` hands the column over as Arrow `Binary`. The first value is 400 bytes in both settings, starting `0106000000030000000103000000010000000800000000000000008066 4072d6` (hex run together as printed in the output).
Q3: yes, it is standard WKB: byte-order flag 1 (little-endian) and type code 6 (MultiPolygon). The first value is identical in both settings. All 5 rows are identical across the settings too.
Q4: `Dataset::open` returns Ok. The geometry column is `geometry`, the encoding is MultiPolygon, and declared types are ["Polygon","MultiPolygon"]. There is no covering (None), and the GeoParquet version is 2.0.0. The engine's file schema shows `geometry` as Arrow Binary with the geoarrow.wkb extension. `stream(&ViewportQuery::all())` yields a first batch: 5 rows, 1343 vertices, 26376 bytes. So the no-bbox stream works for this file today.
Q5: against the claim, which I read at spatial-ide-reuse, commit 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, `REUSE-ROUND-1.md` lines 94-95:
- Shown: DuckDB v1.5.5 is the bundled version (Q0). File #11 does carry the Parquet-native GEOMETRY type (Q1). The `enable_geoparquet_conversion` setting made no difference to the decoded output in either setting (Q2, Q3), and the bytes are valid WKB.
- Contradicted: nothing.
- Cannot show: that DuckDB decodes through "its own WKB reader". The output shows only the outcome, not the code path. Also not covered: the manifest "records no logical types". I did not search the manifest for that. I only saw that `parquet_schema` reports a logical type for this file.

5. Commands.
- Check command (sha256sum, `git status`, `rev-parse`, `ls`): exit 0, no hold, light.
- Build and test: `cd C:/dev/wt/cov && powershell.exe ... machine.ps1 hold shared -Project SpatialIDE -What "duckdb-parquet-geometry-probe: cargo test scratch" -Minutes 20 -MaxWaitMinutes 10 && cargo test -p spatial-engine --test p0_parquet_geometry_scratch -- --nocapture > D:/wt-targets/p0_probe_out.txt 2>&1 ; rc=$? ; ...release... ; exit $rc`. I set `CARGO_TARGET_DIR=D:/wt-targets/cov CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8` before it. The hold was granted (cores 0-7, released) and the exit code was 0.
- One deviation: I wrote the script path as a shell variable (`M=~/Development/Claude/machine/machine.ps1`) rather than inline. I also gave the call a 1500000 ms timeout, above the tool's 600000 ms maximum. It ran anyway.
- A final light cleanup call (`cp` the copy of the source to D:/wt-targets, `rm` the scratch test, `git status`, `rev-parse`) also exited 0, no hold.

6. Final `git -C C:/dev/wt/cov status --porcelain` is empty. HEAD is e73a594c7011707b03271f5921c4dc3b1e58e214. No tracked file anywhere was changed.

Self-check:
- Cross-module use matches the real interfaces: the engine API calls (`Dataset::open`, `stream`, `next_into`) follow `engine/tests/point_stream.rs` in the worktree.
- Completion claims point to the run output above.
- No user-facing message was added.
- The test reached its assertions only for Q4 and the prints. It asserts nothing, so the run's output is the record.
- I ran as Sonnet 5.5, with no model override and no context handoff.
