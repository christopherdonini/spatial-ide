// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! WAVE1 A3 probe (evidence only, not product code): hand-crafted, malformed GeoParquet files driven
//! through `Dataset::open` and a full `stream` drain, recording for each whether the outcome is a
//! typed `EngineError` or a panic. Every case is wrapped in `catch_unwind` so a panic is *reported*
//! by label instead of hiding the remaining cases.
//!
//! Run: `cargo test -p spatial-engine --test wave1_a3_crafted_geoparquet -- --nocapture`.

use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::PathBuf;

use spatial_engine::{Bbox, Dataset, ViewportQuery};

const LV95: &str = include_str!("data/epsg2056.projjson");

fn dir() -> PathBuf {
    let d = std::env::temp_dir().join("spatial-engine-wave1-a3-crafted");
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn geo_json(crs: &str, extra: &str) -> String {
    format!(
        r#"{{"version":"1.1.0","primary_column":"geometry","columns":{{"geometry":{{"encoding":"WKB","geometry_types":["Polygon"],"crs":{crs},"covering":{{"bbox":{{"xmin":["bbox","xmin"],"ymin":["bbox","ymin"],"xmax":["bbox","xmax"],"ymax":["bbox","ymax"]}}}}{extra}}}}}}}"#
    )
}

/// Write a one-or-more-row parquet with the given geometry SQL expressions and `geo` metadata.
fn write(name: &str, geometry_exprs: &[&str], bbox_type: &str, geo: &str) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    let _ = std::fs::remove_file(&path);
    let conn = duckdb::Connection::open_in_memory().unwrap();
    let rows: Vec<String> = geometry_exprs
        .iter()
        .enumerate()
        .map(|(i, g)| {
            format!(
                "SELECT {i}::UBIGINT AS id, {g} AS geometry, \
                 {{'xmin': 2600000::{bbox_type}, 'ymin': 1200000::{bbox_type}, \
                   'xmax': 2600010::{bbox_type}, 'ymax': 1200010::{bbox_type}}} AS bbox"
            )
        })
        .collect();
    let sql = format!(
        "COPY ({}) TO '{}' (FORMAT parquet, KV_METADATA {{geo: '{}'}})",
        rows.join(" UNION ALL "),
        path.display(),
        geo.replace('\'', "''")
    );
    conn.execute_batch(&sql).unwrap_or_else(|e| panic!("writing {name}: {e}"));
    path
}

fn run(label: &str, path: PathBuf) {
    let outcome = catch_unwind(AssertUnwindSafe(|| -> String {
        let ds = match Dataset::open(&path) {
            Ok(ds) => ds,
            Err(e) => return format!("open refused: {e:?}"),
        };
        let mut notes = Vec::new();
        let view = Bbox { xmin: 2_599_000.0, ymin: 1_199_000.0, xmax: 2_601_000.0, ymax: 1_201_000.0 };
        for (qname, q) in [
            ("all", ViewportQuery::all()),
            ("viewport", ViewportQuery::viewport(view, "EPSG:2056")),
        ] {
            let mut s = match ds.stream(&q) {
                Ok(s) => s,
                Err(e) => {
                    notes.push(format!("{qname}: stream refused: {e:?}"));
                    continue;
                }
            };
            let mut buf = Vec::new();
            let mut rows = 0usize;
            let mut err = None;
            while let Some(info) = s.next_into(&mut buf) {
                match info {
                    Ok(i) => rows += i.rows,
                    Err(e) => {
                        err = Some(format!("{e:?}"));
                        break;
                    }
                }
                buf.clear();
            }
            notes.push(format!("{qname}: rows={rows} err={err:?}"));
        }
        format!("opened; {}", notes.join(" | "))
    }));
    let shown = match outcome {
        Ok(s) => s,
        Err(p) => format!(
            "PANIC: {}",
            p.downcast_ref::<String>().cloned().or_else(|| p.downcast_ref::<&str>().map(|s| s.to_string())).unwrap_or_default()
        ),
    };
    let shown: String = shown.chars().take(400).collect();
    eprintln!("[{label}] {shown}");
}

// A valid closed square at LV95 magnitudes, little-endian ISO WKB, as a DuckDB `from_hex` literal.
fn square_hex() -> String {
    let mut w = vec![1u8];
    w.extend_from_slice(&3u32.to_le_bytes());
    w.extend_from_slice(&1u32.to_le_bytes());
    w.extend_from_slice(&5u32.to_le_bytes());
    for (x, y) in [(0.0, 0.0), (10.0, 0.0), (10.0, 10.0), (0.0, 10.0), (0.0, 0.0)] {
        w.extend_from_slice(&(2_600_000.0f64 + x).to_le_bytes());
        w.extend_from_slice(&(1_200_000.0f64 + y).to_le_bytes());
    }
    w.iter().map(|b| format!("{b:02x}")).collect()
}

#[test]
fn crafted_geoparquet_cases_each_end_typed_or_are_reported_as_panics() {
    let geo = geo_json(LV95, "");
    let sq = format!("from_hex('{}')", square_hex());

    run("control-valid-square", write("control", &[&sq], "DOUBLE", &geo));

    // n_rings = u32::MAX, then nothing.
    run("wkb-rings-u32max", write("rings_max", &["from_hex('0103000000ffffffff')"], "DOUBLE", &geo));
    // one ring, n_pts = u32::MAX, one vertex present.
    run(
        "wkb-points-u32max",
        write("pts_max", &["from_hex('010300000001000000ffffffff0000000000000000000000000000f03f')"], "DOUBLE", &geo),
    );
    run("wkb-empty", write("empty", &["from_hex('')"], "DOUBLE", &geo));
    run("wkb-null", write("null", &["NULL::BLOB"], "DOUBLE", &geo));
    // A valid square followed by a malformed row in the same batch.
    run("wkb-valid-then-truncated", write("mixed", &[&sq, "from_hex('0103')"], "DOUBLE", &geo));
    // NaN coordinates: NaN != NaN, so bit-exact closure fails.
    let nan = {
        let mut w = vec![1u8];
        w.extend_from_slice(&3u32.to_le_bytes());
        w.extend_from_slice(&1u32.to_le_bytes());
        w.extend_from_slice(&4u32.to_le_bytes());
        for _ in 0..4 {
            w.extend_from_slice(&f64::NAN.to_le_bytes());
            w.extend_from_slice(&f64::NAN.to_le_bytes());
        }
        format!("from_hex('{}')", w.iter().map(|b| format!("{b:02x}")).collect::<String>())
    };
    run("wkb-nan-ring", write("nan", &[&nan], "DOUBLE", &geo));

    // geometry column is VARCHAR, not BLOB.
    run("geometry-varchar", write("varchar_geom", &["'not wkb'"], "DOUBLE", &geo));
    // covering bbox members are VARCHAR.
    run("covering-varchar", write("varchar_bbox", &[&sq], "VARCHAR", &geo));

    // `geo` JSON nested far past serde_json's recursion limit.
    let deep = format!(r#","deep":{}0{}"#, "[".repeat(100_000), "]".repeat(100_000));
    run("geo-json-deep-100k", write("geo_deep", &[&sq], "DOUBLE", &geo_json(LV95, &deep)));
    // `crs.coordinate_system.axis` entries that are not objects.
    run(
        "crs-axis-non-objects",
        write("axis_scalars", &[&sq], "DOUBLE", &geo_json(r#"{"coordinate_system":{"axis":[1,2]}}"#, "")),
    );
    // A `crs` object nested 100k deep.
    let deep_crs = format!("{}{{}}{}", r#"{"a":"#.repeat(100_000), "}".repeat(100_000));
    run("crs-deep-100k", write("crs_deep", &[&sq], "DOUBLE", &geo_json(&deep_crs, "")));
    // Unit name that is multi-byte across the 128-byte truncation point.
    let crs_unit = LV95.replacen("\"metre\"", &format!("\"{}\"", "é".repeat(200)), 1);
    run("crs-unit-multibyte-long", write("unit_mb", &[&sq], "DOUBLE", &geo_json(&crs_unit, "")));
    // `bbox` member that is not an array of numbers.
    run(
        "bbox-member-garbage",
        write("bbox_member", &[&sq], "DOUBLE", &geo_json(LV95, r#","bbox":[1,"x",3,4]"#)),
    );
}
