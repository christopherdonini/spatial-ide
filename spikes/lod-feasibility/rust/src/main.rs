//! LOD feasibility spike -- route (B): Rust-side simplification via the `geo` crate.
//!
//! Not shipped, not wired into the product (spike-only, per this crate's Cargo.toml). Mirrors the
//! Python/DuckDB route (A) script's measurements: wall time, vertex reduction, identity (id
//! round-trip), streaming-by-row-group, and cooperative cancellation.
//!
//! WKB decoding: `wkb` 0.9.2 (`wkb::reader::read_wkb`), producing a zero-copy `geo_traits`
//! `GeometryTrait` view converted to a `geo_types::Geometry<f64>` via `geo_traits::to_geo::
//! ToGeoGeometry`. Simplification: `geo` 0.33.1's `Simplify` (Ramer-Douglas-Peucker, matching
//! route A's `ST_Simplify`/"simple" variant) and `SimplifyVwPreserve` (topology-preserving
//! Visvalingam-Whyatt -- NOT the same algorithm family as route A's `ST_SimplifyPreserveTopology`,
//! which is RDP-based; both are labelled "preserve" only in the sense that each is its route's
//! topology-aware option, not because they implement the same algorithm; see the README's Route
//! comparison section).
//!
//! Every JSON emitted here is a spike measurement, not a docs/08 product perf claim.

use std::collections::HashSet;
use std::fs::File;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use arrow::array::{Array, BinaryArray, LargeBinaryArray, UInt64Array};
use geo::{Simplify, SimplifyVwPreserve, Validation};
use geo_traits::to_geo::ToGeoGeometry;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;

#[derive(Clone, Copy, PartialEq, Eq)]
enum Variant {
    Simple,
    Preserve,
}

impl Variant {
    fn parse(s: &str) -> Variant {
        match s {
            "simple" => Variant::Simple,
            "preserve" => Variant::Preserve,
            other => panic!("--variant must be simple|preserve, got {other:?}"),
        }
    }

    fn label(self) -> &'static str {
        match self {
            Variant::Simple => "simple",
            Variant::Preserve => "preserve",
        }
    }

    fn function(self) -> &'static str {
        match self {
            Variant::Simple => "geo::Simplify (Ramer-Douglas-Peucker)",
            Variant::Preserve => "geo::SimplifyVwPreserve (topology-preserving Visvalingam-Whyatt)",
        }
    }
}

/// One row group's worth of (id, vertex_count_before, vertex_count_after, valid_after).
struct GroupStats {
    ids: Vec<u64>,
    vertices_before: u64,
    vertices_after: u64,
    invalid_after: u64,
}

fn n_points_polygon(p: &geo::Polygon<f64>) -> u64 {
    let mut n = p.exterior().0.len() as u64;
    for interior in p.interiors() {
        n += interior.0.len() as u64;
    }
    n
}

fn geometry_column_index(builder: &ParquetRecordBatchReaderBuilder<File>, name: &str) -> usize {
    let schema = builder.schema();
    schema
        .fields()
        .iter()
        .position(|f| f.name() == name)
        .unwrap_or_else(|| panic!("column {name:?} not found in schema {schema:?}"))
}

fn process_row_group(
    path: &str,
    row_group: usize,
    id_col: usize,
    geom_col: usize,
    variant: Variant,
    tolerance: f64,
    count_only: bool,
) -> GroupStats {
    let file = File::open(path).expect("open input");
    let builder = ParquetRecordBatchReaderBuilder::try_new(file)
        .expect("build reader")
        .with_row_groups(vec![row_group])
        .with_batch_size(1 << 20); // large enough that one row group is (usually) one batch
    let reader = builder.build().expect("build row group reader");

    let mut ids = Vec::new();
    let mut vertices_before = 0u64;
    let mut vertices_after = 0u64;
    let mut invalid_after = 0u64;

    for batch in reader {
        let batch = batch.expect("read batch");
        let id_arr = batch
            .column(id_col)
            .as_any()
            .downcast_ref::<UInt64Array>()
            .expect("id column is not UInt64Array");
        let geom_any = batch.column(geom_col).as_ref();
        let wkb_bytes: Vec<&[u8]> = if let Some(a) = geom_any.as_any().downcast_ref::<BinaryArray>() {
            (0..a.len()).map(|i| a.value(i)).collect()
        } else if let Some(a) = geom_any.as_any().downcast_ref::<LargeBinaryArray>() {
            (0..a.len()).map(|i| a.value(i)).collect()
        } else {
            panic!("geometry column is neither BinaryArray nor LargeBinaryArray: {:?}", geom_any.data_type());
        };

        for (i, wkb) in wkb_bytes.iter().enumerate() {
            let id = id_arr.value(i);
            let parsed = wkb::reader::read_wkb(wkb).expect("parse WKB");
            let geom = parsed
                .try_to_geometry()
                .expect("WKB geometry is empty (unsupported here)");
            let poly = match geom {
                geo::Geometry::Polygon(p) => p,
                other => panic!("expected Polygon, found {other:?} at id {id}"),
            };
            ids.push(id);
            vertices_before += n_points_polygon(&poly);

            if !count_only {
                let simplified = match variant {
                    Variant::Simple => poly.simplify(tolerance),
                    Variant::Preserve => poly.simplify_vw_preserve(tolerance),
                };
                vertices_after += n_points_polygon(&simplified);
                if !simplified.is_valid() {
                    invalid_after += 1;
                }
            }
        }
    }

    GroupStats {
        ids,
        vertices_before,
        vertices_after,
        invalid_after,
    }
}

/// `bench`: whole-file, non-cancelled pass. Used for the polygons-100k comparison table.
fn cmd_bench(input: &str, tolerance: f64, variant: Variant, identity_column: &str) {
    let file = File::open(input).expect("open input");
    let builder = ParquetRecordBatchReaderBuilder::try_new(file).expect("build reader");
    let id_col = geometry_column_index(&builder, identity_column);
    let geom_col = geometry_column_index(&builder, "geometry");
    let num_row_groups = builder.metadata().num_row_groups();
    drop(builder);

    let t0 = Instant::now();
    let mut ids_in: Vec<u64> = Vec::new();
    let mut vertices_before = 0u64;
    let mut vertices_after = 0u64;
    let mut invalid_after = 0u64;

    for rg in 0..num_row_groups {
        let s = process_row_group(input, rg, id_col, geom_col, variant, tolerance, false);
        ids_in.extend_from_slice(&s.ids);
        vertices_before += s.vertices_before;
        vertices_after += s.vertices_after;
        invalid_after += s.invalid_after;
    }
    let wall_s = t0.elapsed().as_secs_f64();

    let n_in = ids_in.len();
    let unique: HashSet<u64> = ids_in.iter().copied().collect();
    let duplicate_ids = n_in - unique.len();
    let n_out = n_in; // route B processes every input row; nothing is dropped by construction

    let vertex_reduction_ratio = if vertices_before > 0 {
        1.0 - (vertices_after as f64 / vertices_before as f64)
    } else {
        0.0
    };

    println!(
        "{{\n  \"route\": \"B-geo\",\n  \"variant\": \"{}\",\n  \"function\": \"{}\",\n  \"input\": \"{}\",\n  \"tolerance\": {},\n  \"wall_s\": {},\n  \"features_before\": {},\n  \"features_after\": {},\n  \"vertices_before\": {},\n  \"vertices_after\": {},\n  \"vertex_reduction_ratio\": {},\n  \"invalid_after\": {},\n  \"identity\": {{\n    \"n_in\": {},\n    \"n_out\": {},\n    \"duplicate_ids_out\": {},\n    \"preserved\": {}\n  }}\n}}",
        variant.label(),
        variant.function(),
        input,
        tolerance,
        wall_s,
        n_in,
        n_out,
        vertices_before,
        vertices_after,
        vertex_reduction_ratio,
        invalid_after,
        n_in,
        n_out,
        duplicate_ids,
        duplicate_ids == 0 && n_in == n_out,
    );
}

/// `stream-count`: streaming, no output write -- used for the 5 GB fixture (disk cost zero).
/// If `count_only` is false, still simplifies (to get vertices_after) but never writes to disk.
fn cmd_stream_count(input: &str, tolerance: f64, variant: Variant, identity_column: &str) {
    let file = File::open(input).expect("open input");
    let builder = ParquetRecordBatchReaderBuilder::try_new(file).expect("build reader");
    let id_col = geometry_column_index(&builder, identity_column);
    let geom_col = geometry_column_index(&builder, "geometry");
    let num_row_groups = builder.metadata().num_row_groups();
    drop(builder);

    let t0 = Instant::now();
    let mut n_in: u64 = 0;
    let mut vertices_before = 0u64;
    let mut vertices_after = 0u64;
    let mut invalid_after = 0u64;

    for rg in 0..num_row_groups {
        let s = process_row_group(input, rg, id_col, geom_col, variant, tolerance, false);
        n_in += s.ids.len() as u64;
        vertices_before += s.vertices_before;
        vertices_after += s.vertices_after;
        invalid_after += s.invalid_after;
    }
    let wall_s = t0.elapsed().as_secs_f64();
    let vertex_reduction_ratio = if vertices_before > 0 {
        1.0 - (vertices_after as f64 / vertices_before as f64)
    } else {
        0.0
    };

    println!(
        "{{\n  \"route\": \"B-geo\",\n  \"mode\": \"stream-count\",\n  \"variant\": \"{}\",\n  \"function\": \"{}\",\n  \"input\": \"{}\",\n  \"tolerance\": {},\n  \"row_groups\": {},\n  \"wall_s\": {},\n  \"features\": {},\n  \"vertices_before\": {},\n  \"vertices_after\": {},\n  \"vertex_reduction_ratio\": {},\n  \"invalid_after\": {},\n  \"output_bytes\": 0,\n  \"note\": \"no parquet written; vertices_after computed but discarded, disk cost zero\"\n}}",
        variant.label(),
        variant.function(),
        input,
        tolerance,
        num_row_groups,
        wall_s,
        n_in,
        vertices_before,
        vertices_after,
        vertex_reduction_ratio,
        invalid_after,
    );
}

/// `stream-cancel`: cooperative cancellation checked once per row group. A timer thread flips an
/// `AtomicBool` after `interrupt_after_s`; the main loop checks it before starting the next row
/// group and stops without finishing the file.
fn cmd_stream_cancel(input: &str, tolerance: f64, variant: Variant, identity_column: &str, interrupt_after_s: f64) {
    let file = File::open(input).expect("open input");
    let builder = ParquetRecordBatchReaderBuilder::try_new(file).expect("build reader");
    let id_col = geometry_column_index(&builder, identity_column);
    let geom_col = geometry_column_index(&builder, "geometry");
    let num_row_groups = builder.metadata().num_row_groups();
    drop(builder);

    // `t0` is shared with the timer thread (an `Instant` is `Copy`) so that both "when did the flag
    // actually flip" and "when did the loop actually notice" are measured on the *same* clock
    // origin. An earlier version of this function started a second, separate `Instant` for the
    // timer and diffed across the two clocks, which measured the ~0 ns gap between the two
    // `Instant::now()` calls instead of the real detection latency -- a spike-harness bug, not a
    // route-B finding; noted here so it is not repeated.
    let t0 = Instant::now();
    let cancel = Arc::new(AtomicBool::new(false));
    let flag_set_at_s: Arc<std::sync::Mutex<Option<f64>>> = Arc::new(std::sync::Mutex::new(None));
    let cancel_writer = Arc::clone(&cancel);
    let flag_set_at_writer = Arc::clone(&flag_set_at_s);
    let interrupt_at = Duration::from_secs_f64(interrupt_after_s);
    let timer = std::thread::spawn(move || {
        std::thread::sleep(interrupt_at);
        cancel_writer.store(true, Ordering::SeqCst);
        *flag_set_at_writer.lock().unwrap() = Some(t0.elapsed().as_secs_f64());
    });

    let mut row_groups_processed = 0usize;
    let mut n_in: u64 = 0;
    let mut stopped_at: Option<f64> = None;

    for rg in 0..num_row_groups {
        if cancel.load(Ordering::SeqCst) {
            stopped_at = Some(t0.elapsed().as_secs_f64());
            break;
        }
        let s = process_row_group(input, rg, id_col, geom_col, variant, tolerance, false);
        n_in += s.ids.len() as u64;
        row_groups_processed += 1;
    }
    let wall_s = t0.elapsed().as_secs_f64();
    timer.join().expect("join timer thread");
    let flag_set_at = flag_set_at_s.lock().unwrap().unwrap_or(f64::NAN);
    let detection_latency_s = stopped_at.map(|s| s - flag_set_at).unwrap_or(f64::NAN);

    println!(
        "{{\n  \"route\": \"B-geo\",\n  \"mode\": \"stream-cancel\",\n  \"input\": \"{}\",\n  \"tolerance\": {},\n  \"interrupt_after_s_requested\": {},\n  \"row_groups_total\": {},\n  \"row_groups_processed\": {},\n  \"features_processed\": {},\n  \"wall_s_total\": {},\n  \"flag_set_at_s\": {},\n  \"loop_exit_at_s\": {},\n  \"time_from_flag_set_to_loop_exit_s\": {},\n  \"output_bytes\": 0,\n  \"note\": \"cooperative flag checked once per row group boundary; no partial file, nothing written\"\n}}",
        input,
        tolerance,
        interrupt_after_s,
        num_row_groups,
        row_groups_processed,
        n_in,
        wall_s,
        flag_set_at,
        stopped_at.unwrap_or(f64::NAN),
        detection_latency_s,
    );
}

// ---------------------------------------------------------------------------------------------
// `explain` mode -- added 2026-09-15 for DECISIONS-PENDING question set C, item C3 step 3:
// "route B's invalid-output divergence is explained before either route is preregistered".
//
// Finds every feature whose `geo::Simplify` (RDP) output fails `geo`'s OGC validity check at a
// given tolerance and dumps, per feature, everything needed to name the mechanism: the INPUT's own
// validity (an invalid input is a different explanation than an invalid output), ring counts and
// per-ring vertex counts before and after, the validation error text verbatim, and the same
// feature's `SimplifyVwPreserve` result for comparison.
//
// Note on API names: the task brief called for `explain_invalidity()`; `geo` 0.33.1's `Validation`
// trait (src/algorithm/validation/mod.rs) exposes `is_valid()`, `check_validation()` and
// `validation_errors()` -- there is no method named `explain_invalidity` in this version. The
// strings below are `validation_errors()` rendered through each error's `Display` impl, which is
// the human-readable reason this crate version offers.
// ---------------------------------------------------------------------------------------------

/// Minimal WKT writer -- the spike's pinned dependency set has no `wkt` crate and this task adds
/// none. `{}` on `f64` prints the shortest representation that round-trips, so no precision is
/// lost relative to the in-memory coordinates.
fn polygon_wkt(p: &geo::Polygon<f64>) -> String {
    let ring = |ls: &geo::LineString<f64>| -> String {
        let coords: Vec<String> = ls.0.iter().map(|c| format!("{} {}", c.x, c.y)).collect();
        format!("({})", coords.join(", "))
    };
    let mut parts = vec![ring(p.exterior())];
    for i in p.interiors() {
        parts.push(ring(i));
    }
    format!("POLYGON ({})", parts.join(", "))
}

fn ring_vertex_counts(p: &geo::Polygon<f64>) -> Vec<usize> {
    let mut v = vec![p.exterior().0.len()];
    for i in p.interiors() {
        v.push(i.0.len());
    }
    v
}

fn validation_error_strings(p: &geo::Polygon<f64>) -> Vec<String> {
    p.validation_errors().iter().map(|e| e.to_string()).collect()
}

fn json_string_array(v: &[String]) -> String {
    let items: Vec<String> = v
        .iter()
        .map(|s| format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\"")))
        .collect();
    format!("[{}]", items.join(", "))
}

fn json_usize_array(v: &[usize]) -> String {
    let items: Vec<String> = v.iter().map(|n| n.to_string()).collect();
    format!("[{}]", items.join(", "))
}

/// Re-runs RDP on one ring as a standalone `LineString` rather than as part of a `Polygon`.
///
/// This is the mechanical probe for geo's min-points guard: `geo` 0.33.1's
/// `src/algorithm/simplify.rs` uses two different `INITIAL_MIN` constants -- `POLYGON_INITIAL_MIN
/// = 4` (line 6) when simplifying a `Polygon`'s rings, `LINE_STRING_INITIAL_MIN = 2` (line 5) for
/// a bare `LineString`. `compute_rdp` (lines 131-138) refuses to cull a whole subsegment when
/// culling it would take the running count below `INITIAL_MIN`, returning that subsegment's
/// *original* vertices instead. So running the same ring at INITIAL_MIN = 2 shows what RDP would
/// have produced with the guard out of the way.
fn simplify_ring_as_linestring(ring: &geo::LineString<f64>, tolerance: f64) -> geo::LineString<f64> {
    ring.simplify(tolerance)
}

struct InvalidCase {
    id: u64,
    input_valid: bool,
    input_errors: Vec<String>,
    input_rings: Vec<usize>,
    simple_valid: bool,
    simple_errors: Vec<String>,
    simple_rings: Vec<usize>,
    vw_valid: bool,
    vw_errors: Vec<String>,
    vw_rings: Vec<usize>,
    /// Per-ring vertex counts when each ring is simplified as a bare `LineString`
    /// (INITIAL_MIN = 2) instead of as a `Polygon` ring (INITIAL_MIN = 4).
    unguarded_rings: Vec<usize>,
    wkt_input: String,
    wkt_simple: String,
    wkt_vw: String,
}

fn cmd_explain(input: &str, tolerance: f64, identity_column: &str, wkt_out: Option<String>) {
    let file = File::open(input).expect("open input");
    let builder = ParquetRecordBatchReaderBuilder::try_new(file).expect("build reader");
    let id_col = geometry_column_index(&builder, identity_column);
    let geom_col = geometry_column_index(&builder, "geometry");
    let num_row_groups = builder.metadata().num_row_groups();
    drop(builder);

    let t0 = Instant::now();
    let mut scanned: u64 = 0;
    let mut cases: Vec<InvalidCase> = Vec::new();

    for rg in 0..num_row_groups {
        let file = File::open(input).expect("open input");
        let reader = ParquetRecordBatchReaderBuilder::try_new(file)
            .expect("build reader")
            .with_row_groups(vec![rg])
            .with_batch_size(1 << 20)
            .build()
            .expect("build row group reader");

        for batch in reader {
            let batch = batch.expect("read batch");
            let id_arr = batch
                .column(id_col)
                .as_any()
                .downcast_ref::<UInt64Array>()
                .expect("id column is not UInt64Array");
            let geom_any = batch.column(geom_col).as_ref();
            let wkb_bytes: Vec<&[u8]> =
                if let Some(a) = geom_any.as_any().downcast_ref::<BinaryArray>() {
                    (0..a.len()).map(|i| a.value(i)).collect()
                } else if let Some(a) = geom_any.as_any().downcast_ref::<LargeBinaryArray>() {
                    (0..a.len()).map(|i| a.value(i)).collect()
                } else {
                    panic!(
                        "geometry column is neither BinaryArray nor LargeBinaryArray: {:?}",
                        geom_any.data_type()
                    );
                };

            for (i, wkb) in wkb_bytes.iter().enumerate() {
                let id = id_arr.value(i);
                let parsed = wkb::reader::read_wkb(wkb).expect("parse WKB");
                let geom = parsed
                    .try_to_geometry()
                    .expect("WKB geometry is empty (unsupported here)");
                let poly = match geom {
                    geo::Geometry::Polygon(p) => p,
                    other => panic!("expected Polygon, found {other:?} at id {id}"),
                };
                scanned += 1;

                let simple = poly.simplify(tolerance);
                if simple.is_valid() {
                    continue;
                }
                // Only the invalid-output features pay for the extra VW pass and the WKT dumps.
                let vw = poly.simplify_vw_preserve(tolerance);
                let mut unguarded_rings =
                    vec![simplify_ring_as_linestring(poly.exterior(), tolerance).0.len()];
                for interior in poly.interiors() {
                    unguarded_rings.push(simplify_ring_as_linestring(interior, tolerance).0.len());
                }
                cases.push(InvalidCase {
                    id,
                    input_valid: poly.is_valid(),
                    input_errors: validation_error_strings(&poly),
                    input_rings: ring_vertex_counts(&poly),
                    simple_valid: false,
                    simple_errors: validation_error_strings(&simple),
                    simple_rings: ring_vertex_counts(&simple),
                    vw_valid: vw.is_valid(),
                    vw_errors: validation_error_strings(&vw),
                    vw_rings: ring_vertex_counts(&vw),
                    unguarded_rings,
                    wkt_input: polygon_wkt(&poly),
                    wkt_simple: polygon_wkt(&simple),
                    wkt_vw: polygon_wkt(&vw),
                });
            }
        }
    }
    let wall_s = t0.elapsed().as_secs_f64();

    if let Some(path) = wkt_out.as_deref() {
        use std::io::Write;
        let mut f = File::create(path).expect("create wkt output file");
        writeln!(
            f,
            "# LOD feasibility spike -- route B `simple` (geo::Simplify, RDP) invalid outputs"
        )
        .unwrap();
        writeln!(f, "# input:     {input}").unwrap();
        writeln!(f, "# tolerance: {tolerance}").unwrap();
        writeln!(f, "# generated: lod-feasibility-spike `explain` mode, 2026-09-15 (C3 step 3)").unwrap();
        writeln!(
            f,
            "# validity:  geo 0.33.1 `Validation` trait (is_valid / validation_errors)"
        )
        .unwrap();
        writeln!(f, "# features scanned: {scanned}; invalid `simple` outputs: {}", cases.len()).unwrap();
        for c in &cases {
            writeln!(f, "\n===== id {} =====", c.id).unwrap();
            writeln!(
                f,
                "input_valid: {}  input_errors: {:?}  input_ring_vertex_counts: {:?}",
                c.input_valid, c.input_errors, c.input_rings
            )
            .unwrap();
            writeln!(
                f,
                "simple_valid: {}  simple_errors: {:?}  simple_ring_vertex_counts: {:?}",
                c.simple_valid, c.simple_errors, c.simple_rings
            )
            .unwrap();
            writeln!(
                f,
                "vw_preserve_valid: {}  vw_preserve_errors: {:?}  vw_preserve_ring_vertex_counts: {:?}",
                c.vw_valid, c.vw_errors, c.vw_rings
            )
            .unwrap();
            writeln!(
                f,
                "rdp_unguarded_ring_vertex_counts (each ring simplified as a bare LineString, INITIAL_MIN=2): {:?}",
                c.unguarded_rings
            )
            .unwrap();
            writeln!(f, "\n-- WKT input --\n{}", c.wkt_input).unwrap();
            writeln!(f, "\n-- WKT geo::Simplify({tolerance}) --\n{}", c.wkt_simple).unwrap();
            writeln!(
                f,
                "\n-- WKT geo::SimplifyVwPreserve({tolerance}) --\n{}",
                c.wkt_vw
            )
            .unwrap();
        }
    }

    let mut records: Vec<String> = Vec::new();
    for c in &cases {
        records.push(format!(
            "    {{\n      \"id\": {},\n      \"input_valid\": {},\n      \"input_errors\": {},\n      \"input_ring_count\": {},\n      \"input_ring_vertex_counts\": {},\n      \"input_vertices\": {},\n      \"simple_valid\": {},\n      \"simple_errors\": {},\n      \"simple_ring_vertex_counts\": {},\n      \"simple_vertices\": {},\n      \"vw_preserve_valid\": {},\n      \"vw_preserve_errors\": {},\n      \"vw_preserve_ring_vertex_counts\": {},\n      \"vw_preserve_vertices\": {},\n      \"rdp_unguarded_ring_vertex_counts\": {}\n    }}",
            c.id,
            c.input_valid,
            json_string_array(&c.input_errors),
            c.input_rings.len(),
            json_usize_array(&c.input_rings),
            c.input_rings.iter().sum::<usize>(),
            c.simple_valid,
            json_string_array(&c.simple_errors),
            json_usize_array(&c.simple_rings),
            c.simple_rings.iter().sum::<usize>(),
            c.vw_valid,
            json_string_array(&c.vw_errors),
            json_usize_array(&c.vw_rings),
            c.vw_rings.iter().sum::<usize>(),
            json_usize_array(&c.unguarded_rings),
        ));
    }

    println!(
        "{{\n  \"route\": \"B-geo\",\n  \"mode\": \"explain\",\n  \"input\": \"{}\",\n  \"tolerance\": {},\n  \"geo_version\": \"0.33.1\",\n  \"validity_api\": \"geo::Validation::is_valid / validation_errors (geo 0.33.1 has no explain_invalidity)\",\n  \"features_scanned\": {},\n  \"invalid_simple_outputs\": {},\n  \"wall_s_incidental\": {},\n  \"cases\": [\n{}\n  ]\n}}",
        input,
        tolerance,
        scanned,
        cases.len(),
        wall_s,
        records.join(",\n"),
    );
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let cmd = args.get(1).cloned().unwrap_or_default();

    let get = |flag: &str| -> Option<String> {
        args.iter()
            .position(|a| a == flag)
            .and_then(|i| args.get(i + 1).cloned())
    };

    let input = get("--input").expect("--input required");
    let tolerance: f64 = get("--tolerance")
        .expect("--tolerance required")
        .parse()
        .expect("--tolerance must be a float");
    let variant = Variant::parse(&get("--variant").unwrap_or_else(|| "preserve".to_string()));
    let identity_column = get("--identity-column").unwrap_or_else(|| "id".to_string());

    match cmd.as_str() {
        "bench" => cmd_bench(&input, tolerance, variant, &identity_column),
        "explain" => cmd_explain(&input, tolerance, &identity_column, get("--wkt-out")),
        "stream-count" => cmd_stream_count(&input, tolerance, variant, &identity_column),
        "stream-cancel" => {
            let interrupt_after_s: f64 = get("--interrupt-after-s")
                .unwrap_or_else(|| "20".to_string())
                .parse()
                .expect("--interrupt-after-s must be a float");
            cmd_stream_cancel(&input, tolerance, variant, &identity_column, interrupt_after_s)
        }
        other => {
            eprintln!(
                "unknown subcommand {other:?}; expected bench|explain|stream-count|stream-cancel"
            );
            std::process::exit(2);
        }
    }
}
