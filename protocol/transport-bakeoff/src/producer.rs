// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Synthetic, seeded Arrow batch producer — a **test fixture**, not a data-engine capability.
//!
//! docs/02 scopes `engine/` to "DuckDB + Arrow, connectors, CRS engine, data doctor". A seeded
//! synthetic generator is none of those, so it stays here (precedent: the ADR-003 spike's
//! `p1.rs`/`p2.rs` generators lived inside the spike, never in a module).
//!
//! **Bright line:** the moment this reads GeoParquet or touches DuckDB it *is* engine work and
//! belongs in `engine/`. It must not.

use std::collections::HashMap;
use std::sync::Arc;

use arrow::array::{Float64Array, UInt64Array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::ipc::writer::StreamWriter;
use arrow::record_batch::RecordBatch;
use rand_chacha::ChaCha8Rng;
use rand_core::{RngCore, SeedableRng};
use sha2::{Digest, Sha256};

/// Fixed workload constants — these are the preregistered figures (README §4) and are asserted at
/// startup. Changing one invalidates the preregistration.
pub const TOTAL_ROWS: usize = 10_000_000;
pub const ROWS_PER_BATCH: usize = 100_000;
pub const BATCH_COUNT: usize = TOTAL_ROWS / ROWS_PER_BATCH;
pub const SEED: u64 = 0x5EED_2056_0000_0001;
pub const COLUMN_BYTES_PER_ROW: usize = 24;

/// EPSG:2056 (LV95) domain, per README §4.
pub const E_LO: f64 = 2_485_000.0;
pub const E_HI: f64 = 2_834_000.0;
pub const N_LO: f64 = 1_075_000.0;
pub const N_HI: f64 = 1_296_000.0;

/// Declared ceilings (README §4). ADR-010 rule 6's discipline: declared, not discovered.
pub const MAX_FRAME_BYTES: usize = 4 * 1024 * 1024;
pub const MAX_INFLIGHT_BATCHES: usize = 4;

/// ADR-010 rule 1 — the tag-on-envelope clause. Every batch's schema names its coordinate space.
/// A bulk buffer whose envelope does not name its frame is untagged and is in violation.
pub fn schema() -> Arc<Schema> {
    let mut md = HashMap::new();
    md.insert("crs".to_string(), "EPSG:2056".to_string());
    md.insert(
        "frame".to_string(),
        "authoritative-project-crs".to_string(),
    );
    // docs/05 names the EPSG:4326 lat/lon trap; an untagged axis convention is the same class of
    // silent error, so the convention is explicit rather than assumed.
    md.insert("axis_order".to_string(), "easting,northing".to_string());
    Arc::new(Schema::new_with_metadata(
        vec![
            // Stable feature identity. ADR-010 rule 2's id indirection consumes this; docs/11
            // requires stable per-feature identity for editing and lineage.
            Field::new("id", DataType::UInt64, false),
            Field::new("e", DataType::Float64, false),
            Field::new("n", DataType::Float64, false),
        ],
        md,
    ))
}

/// Serialized wire size of one batch, by actually serializing one.
///
/// Deterministic for the fixed workload and fixed seed, so calling this at startup yields a figure
/// that is still "declared before the run". H3's memory bound must be stated in this unit — the
/// resident counter accumulates serialized IPC bytes, and a bound derived from
/// `ROWS_PER_BATCH * COLUMN_BYTES_PER_ROW` omits the IPC framing.
pub fn batch_wire_bytes() -> usize {
    Generator::new()
        .next_batch()
        .map(|b| b.len())
        .unwrap_or(ROWS_PER_BATCH * COLUMN_BYTES_PER_ROW)
}

/// Deterministic uniform f64 in [lo, hi) from the top 53 bits of a ChaCha8 draw.
#[inline]
fn uniform(rng: &mut ChaCha8Rng, lo: f64, hi: f64) -> f64 {
    let bits = rng.next_u64() >> 11; // 53 bits
    let unit = bits as f64 * (1.0 / (1u64 << 53) as f64);
    lo + unit * (hi - lo)
}

pub struct Generator {
    rng: ChaCha8Rng,
    next_id: u64,
    /// Chained digest: `SHA256( SHA256(batch_1_wire_bytes) || ... || SHA256(batch_n_wire_bytes) )`.
    ///
    /// Deliberately over the **serialized wire bytes**, not the logical values, for two reasons:
    /// the consumer can recompute it incrementally from what it actually received without
    /// retaining 240 MB, and it covers schema and IPC framing as well as the values — so a dropped
    /// CRS metadata key or a reframed batch fails H1 rather than sliding through. What it does not
    /// cover is decode correctness, which H1 checks separately via row count, id contiguity and
    /// domain bounds.
    chain: Sha256,
}

impl Generator {
    pub fn new() -> Self {
        Self {
            rng: ChaCha8Rng::seed_from_u64(SEED),
            next_id: 0,
            chain: Sha256::new(),
        }
    }

    /// Generate one batch and serialize it as a **complete, self-contained Arrow IPC stream**
    /// (schema + one RecordBatch + EOS).
    ///
    /// Self-contained per batch is deliberate, for two reasons: it puts the CRS tag on *every*
    /// batch envelope as ADR-010 rule 1 wants, and it makes the consumer's decode the same
    /// `tableFromIPC` call spike M5 audited, so the stage-5 buffer-identity check stays comparable
    /// to M5's.
    pub fn next_batch(&mut self) -> Result<Vec<u8>, String> {
        let n = ROWS_PER_BATCH;
        let mut ids = Vec::with_capacity(n);
        let mut es = Vec::with_capacity(n);
        let mut ns = Vec::with_capacity(n);

        for _ in 0..n {
            let id = self.next_id;
            self.next_id += 1;
            let e = uniform(&mut self.rng, E_LO, E_HI);
            let nn = uniform(&mut self.rng, N_LO, N_HI);
            ids.push(id);
            es.push(e);
            ns.push(nn);
        }

        let schema = schema();
        let batch = RecordBatch::try_new(
            schema.clone(),
            vec![
                Arc::new(UInt64Array::from(ids)),
                Arc::new(Float64Array::from(es)),
                Arc::new(Float64Array::from(ns)),
            ],
        )
        .map_err(|e| format!("record batch: {e}"))?;

        let mut buf: Vec<u8> = Vec::with_capacity(n * COLUMN_BYTES_PER_ROW + 4096);
        {
            let mut w = StreamWriter::try_new(&mut buf, &schema)
                .map_err(|e| format!("ipc writer: {e}"))?;
            w.write(&batch).map_err(|e| format!("ipc write: {e}"))?;
            w.finish().map_err(|e| format!("ipc finish: {e}"))?;
        }

        if buf.len() > MAX_FRAME_BYTES {
            return Err(format!(
                "batch {} bytes exceeds declared MAX_FRAME_BYTES {}",
                buf.len(),
                MAX_FRAME_BYTES
            ));
        }
        self.chain.update(Sha256::digest(&buf));
        Ok(buf)
    }

    /// The chained payload digest (H1). Identical across both adapters by construction, and
    /// asserted equal against the consumer's independently computed value.
    pub fn finish_hash(self) -> String {
        hex::encode(self.chain.finalize())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn workload_constants_match_preregistration() {
        // README §4 is the contract. If these drift, the preregistration is void.
        assert_eq!(TOTAL_ROWS, 10_000_000);
        assert_eq!(ROWS_PER_BATCH, 100_000);
        assert_eq!(BATCH_COUNT, 100);
        assert_eq!(TOTAL_ROWS * COLUMN_BYTES_PER_ROW, 240_000_000);
    }

    #[test]
    fn schema_carries_the_crs_envelope_tag() {
        // ADR-010 rule 1: a bulk buffer whose envelope does not name its frame is in violation.
        let s = schema();
        assert_eq!(s.metadata().get("crs").map(String::as_str), Some("EPSG:2056"));
        assert_eq!(
            s.metadata().get("frame").map(String::as_str),
            Some("authoritative-project-crs")
        );
        assert_eq!(
            s.metadata().get("axis_order").map(String::as_str),
            Some("easting,northing")
        );
        for f in s.fields() {
            assert!(!f.is_nullable(), "field {} must be non-nullable", f.name());
        }
    }

    #[test]
    fn generation_is_deterministic_and_in_domain() {
        // Identical payload across adapters is enforced, not assumed (H1). Same seed => same bytes.
        let mut a = Generator::new();
        let mut b = Generator::new();
        let ba = a.next_batch().unwrap();
        let bb = b.next_batch().unwrap();
        assert_eq!(ba, bb, "same seed must produce byte-identical batches");
        assert!(!ba.is_empty());
    }

    #[test]
    fn coordinates_stay_inside_the_declared_epsg2056_domain() {
        let mut rng = ChaCha8Rng::seed_from_u64(SEED);
        for _ in 0..100_000 {
            let e = uniform(&mut rng, E_LO, E_HI);
            let n = uniform(&mut rng, N_LO, N_HI);
            assert!((E_LO..E_HI).contains(&e), "easting {e} out of domain");
            assert!((N_LO..N_HI).contains(&n), "northing {n} out of domain");
        }
    }
}
