//! Shared Arrow IPC framing for the spike's two-column `(e, n)` EPSG:2056
//! point payloads — used by both P1 (p1.rs) and the M2 precision markers
//! (markers.rs) so every dataset crosses the protocol boundary in exactly
//! the same binary shape. Extracted verbatim from p1.rs; the bytes it emits
//! for P1 are unchanged (M1's startup log prints the byte count, which is
//! the cheap regression check).
//!
//! Values are absolute, untransformed EPSG:2056 metres. No reprojection
//! happens here or anywhere on the delivery path; f64 crosses the wire
//! bit-exact, which is what lets M2 treat the received coordinates as
//! ground truth rather than an approximation.

use std::sync::Arc;

use arrow::array::{ArrayRef, Float64Array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::ipc::writer::StreamWriter;
use arrow::record_batch::RecordBatch;

pub fn schema_en() -> Schema {
    Schema::new(vec![
        Field::new("e", DataType::Float64, false),
        Field::new("n", DataType::Float64, false),
    ])
}

/// Serializes `e`/`n` to Arrow IPC *stream* bytes (not File format): a
/// schema message followed by one record-batch message. Stream framing is
/// chosen so M5 can emit multiple batches over a real streaming transport
/// without changing the shape.
///
/// Takes `&[f64]` rather than owned `Vec<f64>` because callers keep their
/// data for reuse across requests, so `to_vec()` here is a real copy.
/// Kept honest per ADR-004 — the chain from here to the GPU is: this
/// `to_vec()` -> the `Vec<u8>` IPC buffer (leaked to `'static` with no
/// further copy for P1's default path, freshly owned for diagnostic and
/// marker requests) -> protocol response body, an OS-level copy into the
/// webview's fetch buffer -> JS `ArrayBuffer`, sliced into typed-array
/// *views* by apache-arrow (no copy) -> one last copy narrowing f64 to f32
/// for the GPU upload. Never zero-copy end to end.
pub fn serialize_en(e: &[f64], n: &[f64]) -> Vec<u8> {
    let schema = schema_en();
    let columns: Vec<ArrayRef> = vec![
        Arc::new(Float64Array::from(e.to_vec())),
        Arc::new(Float64Array::from(n.to_vec())),
    ];
    let batch = RecordBatch::try_new(Arc::new(schema.clone()), columns)
        .expect("(e, n) batch schema/columns must match");

    let mut buf = Vec::new();
    {
        let mut writer =
            StreamWriter::try_new(&mut buf, &schema).expect("failed to open Arrow IPC writer");
        writer.write(&batch).expect("failed to write batch");
        writer.finish().expect("failed to finish Arrow IPC stream");
    }
    buf
}
