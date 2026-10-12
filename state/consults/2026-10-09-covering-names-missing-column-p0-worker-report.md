*Custodian's filing note (2026-10-09): the worker's report of `covering-names-missing-column`'s P0 (the form's §3a), reported only, in the detached worktree `C:/dev/wt/cov` at e73a594c. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8955c419fd88de94844a63aec983450497859938124cd2be27794f975617715e. Run window from the transcript: 05:48:18Z to 06:04:07Z (Bash 4, Read 4, Grep 3, Write 1, Monitor 1). Its one Write was the scratch test the brief allowed, untracked and deleted after the run. The custodian checked that `git status --porcelain` in the worktree is empty at e73a594c and that no process from the run was left. The run's output is the capture file's lines 183 to the end, byte for byte, at `state/drafts/covering-names-missing-column-p0/p0-output.txt`, and it governs over the report's section 3. The report says it mistyped one echo line of row g while transcribing; the capture has that line as the report's correction gives it. The scratch source is the report's section 2, at `state/drafts/covering-names-missing-column-p0/p0-test.rs.txt`.*

---

1. RESULT: no invalidator fired. Rows a, b, c, f match their predictions, and the oracle and the stream agree on every row. The selected rule is **case-insensitive at both levels (struct and child), ASCII-only**. d (struct `BBOX`) and e (child `XMIN`) both bind. g (`bböx` vs `BÖX`) errors, so the case folding is ASCII-only, not Unicode. The oracle `FieldPath::to_sql` is reachable as `spatial_engine::geoparquet::FieldPath` (`engine/src/geoparquet.rs:326-335`, per-segment quoting at line 332), so no rebuilt SQL was needed. The crate is named `spatial_engine`, and `spatial_engine::fixture::write_hostile_covering` is at `engine/src/fixture.rs:1671`. One thing to watch: g's error is "Referenced table not found" for the struct name, which fits ASCII-only folding of a non-ASCII struct name. I did not test a non-ASCII child name.

2. SCRATCH SOURCE (`engine/tests/p0_covering_binder_scratch.rs`, now deleted):
```rust
use spatial_engine::geoparquet::FieldPath;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

fn stream(ds: &Dataset, q: &ViewportQuery) -> String {
    let mut s = match ds.stream_with_cancel(q, CancelToken::new()) {
        Ok(s) => s,
        Err(e) => return format!("STREAM OPEN ERR: {e:?}"),
    };
    let mut buf = Vec::new();
    match s.next_into(&mut buf) {
        None => "NO ITEMS".to_string(),
        Some(Ok(_)) => "FIRST ITEM OK".to_string(),
        Some(Err(e)) => format!("FIRST ITEM ERR: {e}"),
    }
}

#[test]
fn p0_covering_binder() {
    let dir = std::env::temp_dir().join("cov-p0");
    std::fs::create_dir_all(&dir).unwrap();
    let std4 = ["xmin", "ymin", "xmax", "ymax"];
    let cases: Vec<(&str, &str, [&str; 4], &str, [&str; 4])> = vec![
        ("a", "bbox", std4, "bbox", std4),
        ("b", "bbox", std4, "nobbox", std4),
        ("c", "bbox", std4, "bbox", ["xmin", "ymin", "xmax", "nomax"]),
        ("d", "bbox", std4, "BBOX", std4),
        ("e", "bbox", std4, "bbox", ["XMIN", "ymin", "xmax", "ymax"]),
        ("f", "bbox", std4, "id", std4),
        ("g", "b\u{f6}x", std4, "B\u{d6}X", std4),
    ];
    let conn = duckdb::Connection::open_in_memory().unwrap();
    for (tag, sname, child, dstruct, dchild) in cases {
        let path = dir.join(format!("{tag}.parquet"));
        spatial_engine::fixture::write_hostile_covering(&path, sname, child, (dstruct, dchild));
        let p = path.to_string_lossy().to_string();
        let sel: Vec<String> = dchild
            .iter()
            .map(|c| FieldPath(vec![dstruct.to_string(), c.to_string()]).to_sql())
            .collect();
        let sql = format!("SELECT {} FROM read_parquet(?) LIMIT 0", sel.join(", "));
        let oracle = match conn.prepare(&sql) {
            Ok(mut st) => match st.query_arrow([p.as_str()]) {
                Ok(_) => "BINDS".to_string(),
                Err(e) => format!("BINDER ERR (query): {e}"),
            },
            Err(e) => format!("BINDER ERR (prepare): {e}"),
        };
        println!("=== row {tag} | written {sname:?}/{child:?} | declared {dstruct:?}/{dchild:?}");
        println!("  oracle sql: {sql}");
        println!("  oracle: {oracle}");
        let ds = match Dataset::open(&path) {
            Ok(d) => d,
            Err(e) => {
                println!("  open: ERR {e:?}");
                continue;
            }
        };
        println!("  open: OK; covering().is_some()={}", ds.covering().is_some());
        let mut q = ViewportQuery::all();
        q.bbox = Some(Bbox { xmin: 2_599_000.0, ymin: 1_199_000.0, xmax: 2_601_000.0, ymax: 1_201_000.0 });
        q.bbox_crs = Some("EPSG:2056".to_string());
        println!("  bbox stream: {}", stream(&ds, &q));
        println!("  no-bbox stream: {}", stream(&ds, &ViewportQuery::all()));
    }
}
```
(The oracle runs `prepare` and then `query_arrow`; in this duckdb crate the binder error surfaced at the query step, labelled "(query)". The stream reports only the first item.)

3. RUN STDOUT (the test's block, copied from the captured file `D:/wt-targets/cov-p0.out` lines 183-end; compile lines omitted):
```
running 1 test
=== row a | written "bbox"/["xmin", "ymin", "xmax", "ymax"] | declared "bbox"/["xmin", "ymin", "xmax", "ymax"]
  oracle sql: SELECT "bbox"."xmin", "bbox"."ymin", "bbox"."xmax", "bbox"."ymax" FROM read_parquet(?) LIMIT 0
  oracle: BINDS
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM OK
  no-bbox stream: FIRST ITEM OK
=== row b | written "bbox"/["xmin", "ymin", "xmax", "ymax"] | declared "nobbox"/["xmin", "ymin", "xmax", "ymax"]
  oracle sql: SELECT "nobbox"."xmin", "nobbox"."ymin", "nobbox"."xmax", "nobbox"."ymax" FROM read_parquet(?) LIMIT 0
  oracle: BINDER ERR (query): Binder Error: Referenced table "nobbox" not found!
Candidate tables: "read_parquet"

LINE 1: SELECT "nobbox"."xmin", "nobbox"."ymin", "nobbox"."xmax", "nobbox...
               ^
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM ERR: query: execute: Binder Error: Referenced table "nobbox" not found!
Candidate tables: "read_parquet"

LINE 1: SELECT "id" AS "id", "geometry" FROM read_parquet(?) WHERE "nobbox"."xmin" <= ? AND "nobbox"."xmax" >= ? AND "nobbox...
                                                                   ^
  no-bbox stream: FIRST ITEM OK
=== row c | written "bbox"/["xmin", "ymin", "xmax", "ymax"] | declared "bbox"/["xmin", "ymin", "xmax", "nomax"]
  oracle sql: SELECT "bbox"."xmin", "bbox"."ymin", "bbox"."xmax", "bbox"."nomax" FROM read_parquet(?) LIMIT 0
  oracle: BINDER ERR (query): Binder Error: Could not find key "nomax" in struct

Candidate Entries: "xmax", "ymax"
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM ERR: query: execute: Binder Error: Could not find key "nomax" in struct

Candidate Entries: "xmax", "ymax"
  no-bbox stream: FIRST ITEM OK
=== row d | written "bbox"/["xmin", "ymin", "xmax", "ymax"] | declared "BBOX"/["xmin", "ymin", "xmax", "ymax"]
  oracle sql: SELECT "BBOX"."xmin", "BBOX"."ymin", "BBOX"."xmax", "BBOX"."ymax" FROM read_parquet(?) LIMIT 0
  oracle: BINDS
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM OK
  no-bbox stream: FIRST ITEM OK
=== row e | written "bbox"/["xmin", "ymin", "xmax", "ymax"] | declared "bbox"/["XMIN", "ymin", "xmax", "ymax"]
  oracle sql: SELECT "bbox"."XMIN", "bbox"."ymin", "bbox"."xmax", "bbox"."ymax" FROM read_parquet(?) LIMIT 0
  oracle: BINDS
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM OK
  no-bbox stream: FIRST ITEM OK
=== row f | written "bbox"/["xmin", "ymin", "xmax", "ymax"] | declared "id"/["xmin", "ymin", "xmax", "ymax"]
  oracle sql: SELECT "id"."xmin", "id"."ymin", "id"."xmax", "id"."ymax" FROM read_parquet(?) LIMIT 0
  oracle: BINDER ERR (query): Binder Error: Cannot extract field 'xmin' from expression "id" because it is not a struct, union, map, or json
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM ERR: query: execute: Binder Error: Cannot extract field 'xmin' from expression "id" because it is not a struct, union, map, or json
  no-bbox stream: FIRST ITEM OK
=== row g | written "böx"/["xmin", "ymin", "xmax", "ymax"] | declared "BÖX"/["xmin", "ymin", "xmax", "ymax"]
  oracle sql: SELECT "BÖX"."xmin", "BÖX"."ymin", "BÖX"."xmax", "BÖX"."ymax" FROM read_parquet(?) LIMIT 0
  oracle: BINDER ERR (query): Binder Error: Referenced table "BÖX" not found!
Candidate tables: "read_parquet"

LINE 1: SELECT "BÖX"."xmin", "BÖX"."xmin", "BÖX"."ymin", "BÖX"."ymax" FROM...
               ^
  open: OK; covering().is_some()=true
  bbox stream: FIRST ITEM ERR: query: execute: Binder Error: Referenced table "BÖX" not found!
Candidate tables: "read_parquet"

LINE 1: SELECT "id" AS "id", "geometry" FROM read_parquet(?) WHERE "BÖX"."xmin" <= ? AND "BÖX"."xmax" >= ? AND "BÖX"."ymin...
                                                                   ^
  no-bbox stream: FIRST ITEM OK
test p0_covering_binder ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.67s
```
Correction to the block above: in row g the oracle's "LINE 1:" echo should read `SELECT "BÖX"."xmin", "BÖX"."ymin", "BÖX"."xmax", "BÖX"."ymax" FROM...`, byte for byte as in the capture. I mistyped it while transcribing. The capture file `D:/wt-targets/cov-p0.out` is the authoritative record.

4. TABLE (prediction vs seen; the oracle and the stream agreed on every row):
- a: predicted binds. Seen: oracle binds, open OK, covering present, bbox stream first item OK, no-bbox OK. Matches.
- b: predicted binder error. Seen: oracle error `Referenced table "nobbox" not found!`. The bbox stream failed on its first item with the same error. Open OK, covering present, no-bbox OK. Matches.
- c: predicted binder error. Seen: `Could not find key "nomax" in struct`, from both oracle and bbox stream. Matches.
- d: hypothesis binds. Seen: binds, bbox stream OK. Case-insensitive at the struct level.
- e: hypothesis binds. Seen: binds, bbox stream OK. Case-insensitive at the child level.
- f: predicted binder error. Seen: `Cannot extract field 'xmin' from expression "id" because it is not a struct, union, map, or json`, from both oracle and stream. Matches.
- g: not derivable statically. Seen: error `Referenced table "BÖX" not found!`, from both oracle and stream. Per the selection rule (§3a): the kind is ASCII-only.
- Invalidator (§3a): not fired. a, b, c and f match, the oracle and stream agree, and a case-insensitive ASCII comparison over the schema reproduces all seven rows.
- Not tested: a non-ASCII child name, and a mixed-case collision in the same schema (for example `bbox` and `BBOX` both present).

5. COMMANDS: one Bash call built and ran the tests (the first, with a mistaken fallback `cd` that did not trigger, so it ran in `C:/dev/wt/cov`):
`cd C:/wt/cov 2>/dev/null || cd C:/dev/wt/cov && export CARGO_TARGET_DIR=D:/wt-targets/cov CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 && powershell ... machine.ps1 hold shared -Project SpatialIDE -What "covering-names-missing-column: cargo test P0 scratch" -Minutes 30 -MaxWaitMinutes 20 && cargo test -p spatial-engine --test p0_covering_binder_scratch -- --nocapture > D:/wt-targets/cov-p0.out 2>&1 ; rc=$? ; powershell ... release -Project SpatialIDE ; echo rc=$rc ; exit $rc`
- The hold was granted (`MACHINE_HOLD shared project=SpatialIDE cores=0-7`) and released (`MACHINE_RELEASED`).
- Exit code 0.
- The call ran past the 600 s foreground limit, was moved to the background, and finished with code 0.
- 179 crates were compiled (a cold target), and the test itself ran in 0.67 s.
- Other commands (grep, git status, rm, reading the output file) were not builds or tests.

6. FINAL STATE: `git -C C:/dev/wt/cov status --porcelain` is empty after I deleted the scratch file. HEAD is `e73a594c7011707b03271f5921c4dc3b1e58e214`, detached. The build target `D:/wt-targets/cov` is left in place. The extra capture file `D:/wt-targets/cov-p0.out` is outside the worktree. The custodian may want to keep it as the P0's text output for `state/drafts/covering-names-missing-column-p0/`.

Model: claude-sonnet-5-5, no override, no context handoff received or produced. Pre-gate self-check:
- Interface: the scratch test used `write_hostile_covering` and `FieldPath::to_sql` as they exist at `engine/src/fixture.rs:1671` and `engine/src/geoparquet.rs:329`.
- Evidence: every claim above points to the captured stdout.
- Messages: no user-facing message was added.
- Assertions: the test asserts nothing and only prints, as the brief asked.
No gate was requested.
