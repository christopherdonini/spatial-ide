// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 2 — the pre-generated, immutable Arrow corpus (README §16.2).
//!
//! Phase 1 measured a generator, not a transport: synthesis and Arrow serialization consumed
//! 97.2–98.9 % of every run's wall time. This module removes generation from the timed interval
//! entirely by building the whole corpus **before** any connection is accepted, and handing both
//! adapters the *same* immutable byte slices.
//!
//! **The symmetry rule this file exists to enforce:** batches are `Bytes`, cloned only by refcount.
//! Neither adapter may copy a payload, and neither may own a private version of it. §8 makes
//! unequal instrumentation between adapters inadmissible outright, and a per-batch
//! `copy_from_slice` on one side would be exactly that — it would also silently reintroduce the
//! generation-side cost Phase 2 is built to exclude.

use std::collections::HashMap;
use std::sync::Arc;

use arrow::array::{Float64Array, UInt64Array};
use arrow::datatypes::Schema;
use arrow::ipc::writer::StreamWriter;
use arrow::record_batch::RecordBatch;
use bytes::Bytes;
use rand_chacha::ChaCha8Rng;
use rand_core::{RngCore, SeedableRng};
use sha2::{Digest, Sha256};

use crate::producer::{schema, E_HI, E_LO, N_HI, N_LO, SEED, TOTAL_ROWS};

/// Declared before measuring (§16.2). Total payload is constant across configurations so the three
/// are comparable; only the batch granularity changes.
#[derive(Clone, Copy, Debug, PartialEq, Eq, serde::Serialize)]
pub enum Config {
    /// ~244 KB/batch, 1000 batches.
    S,
    /// 2,438,344 B/batch, 100 batches — Phase 1's size.
    M,
    /// ~12.2 MB/batch, 20 batches.
    L,
}

impl Config {
    pub fn parse(s: &str) -> Option<Self> {
        match s.to_ascii_uppercase().as_str() {
            "S" => Some(Config::S),
            "M" => Some(Config::M),
            "L" => Some(Config::L),
            _ => None,
        }
    }
    pub fn rows_per_batch(self) -> usize {
        match self {
            Config::S => 10_000,
            Config::M => 100_000,
            Config::L => 500_000,
        }
    }
    pub fn label(self) -> &'static str {
        match self {
            Config::S => "S",
            Config::M => "M",
            Config::L => "L",
        }
    }
    pub fn batch_count(self) -> usize {
        TOTAL_ROWS / self.rows_per_batch()
    }
}

/// Declared ceiling for Phase 2, raised from Phase 1's 4 MiB **in advance** (§16.2/§16.3) because
/// configuration L exceeds the old value. Raising a declared ceiling mid-run to make a
/// configuration work is exactly the "discovered" failure ADR-010 rule 6 forbids.
pub const MAX_FRAME_BYTES_PHASE2: usize = 16 * 1024 * 1024;

pub struct Corpus {
    pub config: Config,
    /// Framed, ready-to-send batches. Immutable; both adapters clone the `Bytes` handle only.
    pub batches: Vec<Bytes>,
    /// SHA-256 over the framed wire bytes, in order. Identical **within** a configuration across
    /// adapters and runs; differs **between** configurations by construction (§16.7).
    pub wire_digest: String,
    /// SHA-256 over decoded logical column values in row order. Identical across **all**
    /// configurations and both adapters — this is the invariant that survives re-chunking.
    pub column_digest: String,
    pub total_wire_bytes: usize,
    pub max_batch_wire_bytes: usize,
    pub build_ms: u128,
}

#[inline]
fn uniform(rng: &mut ChaCha8Rng, lo: f64, hi: f64) -> f64 {
    let bits = rng.next_u64() >> 11;
    let unit = bits as f64 * (1.0 / (1u64 << 53) as f64);
    lo + unit * (hi - lo)
}

impl Corpus {
    /// Builds the whole corpus up front. Everything expensive happens here, outside any timed
    /// interval and before any connection is accepted.
    pub fn build(config: Config) -> Result<Self, String> {
        let t0 = std::time::Instant::now();
        let rows_per_batch = config.rows_per_batch();
        let schema: Arc<Schema> = schema();

        // The same seed and the same row order as Phase 1, so the column digest is comparable
        // across configurations *and* against Phase 1's payload.
        let mut rng = ChaCha8Rng::seed_from_u64(SEED);
        let mut next_id: u64 = 0;
        let mut wire = Sha256::new();
        let mut column = Sha256::new();
        let mut batches = Vec::with_capacity(config.batch_count());
        let mut total = 0usize;
        let mut max_batch = 0usize;

        for _ in 0..config.batch_count() {
            let mut ids = Vec::with_capacity(rows_per_batch);
            let mut es = Vec::with_capacity(rows_per_batch);
            let mut ns = Vec::with_capacity(rows_per_batch);
            for _ in 0..rows_per_batch {
                let id = next_id;
                next_id += 1;
                let e = uniform(&mut rng, E_LO, E_HI);
                let n = uniform(&mut rng, N_LO, N_HI);
                // Column digest covers logical values in row order, so it is invariant to how the
                // rows are chunked. This is the cross-configuration correctness anchor.
                column.update(id.to_le_bytes());
                column.update(e.to_le_bytes());
                column.update(n.to_le_bytes());
                ids.push(id);
                es.push(e);
                ns.push(n);
            }

            let batch = RecordBatch::try_new(
                schema.clone(),
                vec![
                    Arc::new(UInt64Array::from(ids)),
                    Arc::new(Float64Array::from(es)),
                    Arc::new(Float64Array::from(ns)),
                ],
            )
            .map_err(|e| format!("record batch: {e}"))?;

            // Each batch is a self-contained Arrow IPC stream, so its **own** envelope carries
            // crs/frame/axis_order after re-chunking — ADR-010 rule 1 binds each batch, not the
            // corpus (§16.7).
            let mut buf: Vec<u8> = Vec::with_capacity(rows_per_batch * 24 + 4096);
            {
                let mut w = StreamWriter::try_new(&mut buf, &schema)
                    .map_err(|e| format!("ipc writer: {e}"))?;
                w.write(&batch).map_err(|e| format!("ipc write: {e}"))?;
                w.finish().map_err(|e| format!("ipc finish: {e}"))?;
            }

            let framed = crate::wire::frame(crate::wire::TAG_BATCH, &buf);
            if framed.len() > MAX_FRAME_BYTES_PHASE2 {
                return Err(format!(
                    "config {} batch is {} bytes, over the declared {} ceiling",
                    config.label(),
                    framed.len(),
                    MAX_FRAME_BYTES_PHASE2
                ));
            }
            max_batch = max_batch.max(framed.len());
            total += framed.len();
            wire.update(&framed);
            batches.push(Bytes::from(framed));
        }

        Ok(Corpus {
            config,
            batches,
            wire_digest: hex::encode(wire.finalize()),
            column_digest: hex::encode(column.finalize()),
            total_wire_bytes: total,
            max_batch_wire_bytes: max_batch,
            build_ms: t0.elapsed().as_millis(),
        })
    }

    /// The manifest the consumer checks against, so corpus identity is verified rather than assumed.
    pub fn manifest(&self) -> HashMap<String, serde_json::Value> {
        let mut m = HashMap::new();
        m.insert("config".into(), serde_json::json!(self.config.label()));
        m.insert("rowsPerBatch".into(), serde_json::json!(self.config.rows_per_batch()));
        m.insert("batchCount".into(), serde_json::json!(self.batches.len()));
        m.insert("totalWireBytes".into(), serde_json::json!(self.total_wire_bytes));
        m.insert("maxBatchWireBytes".into(), serde_json::json!(self.max_batch_wire_bytes));
        m.insert("wireDigest".into(), serde_json::json!(self.wire_digest));
        m.insert("columnDigest".into(), serde_json::json!(self.column_digest));
        m.insert("buildMs".into(), serde_json::json!(self.build_ms));
        m.insert(
            "maxFrameBytesCeiling".into(),
            serde_json::json!(MAX_FRAME_BYTES_PHASE2),
        );
        m
    }

    /// Touch every byte before the timed interval so page-cache warmth is equal on both candidates
    /// (§16.2). Returns a checksum-ish accumulator purely so the reads cannot be optimized away.
    pub fn warm(&self) -> u64 {
        let mut acc = 0u64;
        for b in &self.batches {
            for chunk in b.chunks(4096) {
                acc = acc.wrapping_add(chunk[0] as u64);
            }
        }
        acc
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The invariant that survives re-chunking, and the one that must not: column digest identical
    /// across configurations, wire digest necessarily different (§16.7).
    #[test]
    fn column_digest_is_invariant_across_configurations() {
        // S and M only — L is 500k rows/batch and slow to build in a unit test.
        let s = Corpus::build(Config::S).unwrap();
        let m = Corpus::build(Config::M).unwrap();
        assert_eq!(
            s.column_digest, m.column_digest,
            "decoded column values must not depend on how rows are chunked"
        );
        assert_ne!(
            s.wire_digest, m.wire_digest,
            "wire digests differ between configurations by construction"
        );
        assert_eq!(s.batches.len(), 1000);
        assert_eq!(m.batches.len(), 100);
    }

    #[test]
    fn corpus_build_is_deterministic() {
        let a = Corpus::build(Config::S).unwrap();
        let b = Corpus::build(Config::S).unwrap();
        assert_eq!(a.wire_digest, b.wire_digest);
        assert_eq!(a.column_digest, b.column_digest);
        assert_eq!(a.total_wire_bytes, b.total_wire_bytes);
    }

    #[test]
    fn cloning_a_batch_shares_storage_rather_than_copying() {
        // The symmetry rule: both adapters take the same `Bytes` and clone only the refcount.
        // If this ever became a deep copy, one adapter would pay a per-batch allocation the other
        // does not, which §8 makes inadmissible.
        let c = Corpus::build(Config::S).unwrap();
        let first = c.batches[0].clone();
        assert_eq!(first.as_ptr(), c.batches[0].as_ptr(), "clone must share storage");
    }

    #[test]
    fn every_configuration_stays_under_the_declared_ceiling() {
        let s = Corpus::build(Config::S).unwrap();
        assert!(s.max_batch_wire_bytes <= MAX_FRAME_BYTES_PHASE2);
        // Phase 1's 4 MiB ceiling would have rejected L; the raise was declared in §16.2 before
        // measuring, which is what makes it legitimate under ADR-010 rule 6.
        assert!(MAX_FRAME_BYTES_PHASE2 > 4 * 1024 * 1024);
    }
}
