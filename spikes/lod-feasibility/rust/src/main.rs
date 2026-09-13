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
        "stream-count" => cmd_stream_count(&input, tolerance, variant, &identity_column),
        "stream-cancel" => {
            let interrupt_after_s: f64 = get("--interrupt-after-s")
                .unwrap_or_else(|| "20".to_string())
                .parse()
                .expect("--interrupt-after-s must be a float");
            cmd_stream_cancel(&input, tolerance, variant, &identity_column, interrupt_after_s)
        }
        other => {
            eprintln!("unknown subcommand {other:?}; expected bench|stream-count|stream-cancel");
            std::process::exit(2);
        }
    }
}
