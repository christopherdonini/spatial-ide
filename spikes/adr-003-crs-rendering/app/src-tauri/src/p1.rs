//! M1: synthetic P1 point cloud (README "Test data").
//!
//! 10M points, uniform random over the EPSG:2056 extent used by this spike:
//! E 2,485,000-2,834,000 · N 1,075,000-1,296,000. Coordinates are absolute,
//! untransformed EPSG:2056 metres — no reprojection happens anywhere in this
//! module or the delivery path. The offset-relative recentring the spike's
//! technical approach calls for happens client-side, in f64, right before
//! the f32 GPU upload (see src/render.ts) — never here, so the wire format
//! stays the untouched ground truth M3 picking will validate against.

use std::sync::Arc;

use arrow::array::{ArrayRef, Float64Array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::ipc::writer::StreamWriter;
use arrow::record_batch::RecordBatch;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

pub const POINT_COUNT: usize = 10_000_000;
pub const EXTENT_E: (f64, f64) = (2_485_000.0, 2_834_000.0);
pub const EXTENT_N: (f64, f64) = (1_075_000.0, 1_296_000.0);

/// Fixed seed: a spike benchmark needs a stable dataset across runs so
/// frame-time measurements aren't confounded by point distribution changes.
const SEED: u64 = 2_003_005; // ADR-003, arbitrary

/// Builds P1 and serializes it straight to Arrow IPC *stream* bytes.
///
/// Single-shot, unchunked: the whole 10M-point batch is generated and
/// framed as one IPC message. That's deliberately out of scope for M1 (which
/// only has to prove the binary-attribute render path and frame rate at the
/// default view) — real chunking/backpressure over the wire is M5's job
/// (docs/02, docs/06: "binary, chunked, backpressured"; ADR-004 honesty
/// check). Stream format (not File format) is chosen so M5 can start
/// emitting multiple record batches without changing the framing.
pub fn generate_p1_arrow_ipc() -> Vec<u8> {
    let mut rng = StdRng::seed_from_u64(SEED);

    let mut easting = Vec::with_capacity(POINT_COUNT);
    let mut northing = Vec::with_capacity(POINT_COUNT);
    for _ in 0..POINT_COUNT {
        easting.push(rng.gen_range(EXTENT_E.0..=EXTENT_E.1));
        northing.push(rng.gen_range(EXTENT_N.0..=EXTENT_N.1));
    }

    let schema = Schema::new(vec![
        Field::new("e", DataType::Float64, false),
        Field::new("n", DataType::Float64, false),
    ]);
    let columns: Vec<ArrayRef> = vec![
        Arc::new(Float64Array::from(easting)),
        Arc::new(Float64Array::from(northing)),
    ];
    let batch = RecordBatch::try_new(Arc::new(schema.clone()), columns)
        .expect("P1 batch schema/columns must match");

    // Copy chain from here to the GPU (kept honest per ADR-004, never
    // "zero-copy"): this Vec<u8>, leaked to 'static in lib.rs with no
    // resizing copy (1) -> protocol response body, an OS-level copy into
    // the webview's fetch buffer (2) -> JS ArrayBuffer, sliced into
    // typed-array *views* by apache-arrow (no copy) -> Float32Array cast in
    // p1-loader.ts, one unavoidable copy for the f64->f32 GPU upload (3).
    let mut buf = Vec::new();
    {
        let mut writer =
            StreamWriter::try_new(&mut buf, &schema).expect("failed to open Arrow IPC writer");
        writer.write(&batch).expect("failed to write P1 batch");
        writer.finish().expect("failed to finish Arrow IPC stream");
    }
    buf
}
