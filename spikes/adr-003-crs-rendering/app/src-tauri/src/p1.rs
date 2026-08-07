// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! M1: synthetic P1 point cloud (README "Test data").
//!
//! 10M points, uniform random over the EPSG:2056 extent used by this spike:
//! E 2,485,000-2,834,000 · N 1,075,000-1,296,000. Coordinates are absolute,
//! untransformed EPSG:2056 metres — no reprojection happens anywhere in this
//! module or the delivery path. The offset-relative recentring the spike's
//! technical approach calls for happens client-side, in f64, right before
//! the f32 GPU upload (see src/p1-loader.ts) — never here, so the wire
//! format stays the untouched ground truth M3 picking will validate against.
//!
//! M1.5 diagnostics add `arrow_ipc_range`/`arrow_ipc_bbox` alongside the
//! original `full_arrow_ipc` — all three slice the *same* fixed-seed
//! in-memory dataset, so M1.5's runs are directly comparable to each other
//! and to M1's own numbers (never a fresh RNG draw).

use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

use crate::arrow_en::serialize_en;

pub const POINT_COUNT: usize = 10_000_000;
pub const EXTENT_E: (f64, f64) = (2_485_000.0, 2_834_000.0);
pub const EXTENT_N: (f64, f64) = (1_075_000.0, 1_296_000.0);

/// Fixed seed: a spike benchmark needs a stable dataset across runs so
/// frame-time measurements aren't confounded by point distribution changes.
const SEED: u64 = 2_003_005; // ADR-003, arbitrary

/// The full P1 point set held in memory, generated once at startup. M1's
/// default (query-param-free) protocol response is still served from a
/// separately precomputed, leaked `&'static [u8]` (see lib.rs) so that
/// code path — and the M1 numbers already measured against it — stays
/// byte-for-byte unchanged. Everything in this struct is additive, for
/// M1.5's diagnostic slicing.
pub struct P1Dataset {
    easting: Vec<f64>,
    northing: Vec<f64>,
}

impl P1Dataset {
    pub fn generate() -> Self {
        let mut rng = StdRng::seed_from_u64(SEED);
        let mut easting = Vec::with_capacity(POINT_COUNT);
        let mut northing = Vec::with_capacity(POINT_COUNT);
        for _ in 0..POINT_COUNT {
            easting.push(rng.gen_range(EXTENT_E.0..=EXTENT_E.1));
            northing.push(rng.gen_range(EXTENT_N.0..=EXTENT_N.1));
        }
        Self { easting, northing }
    }

    /// The full 10M-point dataset. Used once at startup to build M1's
    /// precomputed static response; not on any per-request path.
    /// Serialization (and its copy accounting) lives in arrow_en.rs, shared
    /// with the M2 marker set so both cross the wire in identical framing.
    pub fn full_arrow_ipc(&self) -> Vec<u8> {
        serialize_en(&self.easting, &self.northing)
    }

    /// M1.5 scaling-curve support: the first `end - start` points of the
    /// fixed dataset (clamped to its length), i.e. a deterministic prefix —
    /// smaller N is a strict subset of larger N, so runs are nested and
    /// comparable, not independently-sampled distributions.
    pub fn arrow_ipc_range(&self, start: usize, end: usize) -> Vec<u8> {
        let len = self.easting.len();
        let end = end.min(len);
        let start = start.min(end);
        serialize_en(&self.easting[start..end], &self.northing[start..end])
    }

    /// M1.5 visible-count diagnostic: a crude O(n) linear scan, no spatial
    /// index. That scan cost is a confound on this experiment's own numbers
    /// (it answers "does a smaller visible set help render cost," not
    /// "is server-side viewport filtering itself cheap") — see README.
    pub fn arrow_ipc_bbox(&self, e_min: f64, n_min: f64, e_max: f64, n_max: f64) -> Vec<u8> {
        let mut e_out = Vec::new();
        let mut n_out = Vec::new();
        for i in 0..self.easting.len() {
            let e = self.easting[i];
            let n = self.northing[i];
            if e >= e_min && e <= e_max && n >= n_min && n <= n_max {
                e_out.push(e);
                n_out.push(n);
            }
        }
        serialize_en(&e_out, &n_out)
    }
}
