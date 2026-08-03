//! M4: synthetic P2 "parcel" polygon dataset (README "Test data", docs/08
//! polygon benchmark class: 100k features / 10M vertices).
//!
//! Generated as a perturbed grid over the same EPSG:2056 extent as P1 (E
//! 2,485,000-2,834,000 x N 1,075,000-1,296,000): GRID_COLS x GRID_ROWS
//! cells, each holding one polygon whose ring walks an inset rectangle at
//! VERTS_PER_POLYGON evenly-spaced steps, each perturbed by a small random
//! offset. This is a synthetic stress shape sized to match docs/08's
//! polygon budget class exactly (100,000 features, 10,000,000 vertices) --
//! not a claim about real cadastral parcel geometry.
//!
//! Absolute, untransformed EPSG:2056 metres throughout, exactly like P1 and
//! the M2/M3 markers -- no reprojection anywhere in this module or on the
//! delivery path.
//!
//! Storage is polygon-major and every polygon has exactly VERTS_PER_POLYGON
//! vertices, so a vertex's global id is simply its storage index: id / 100
//! is the polygon id, id % 100 is the vertex's position within its ring. No
//! separate id array is stored server-side for that reason -- but the wire
//! format still carries an explicit `id` column (arrow_en::serialize_en_id,
//! shared with M2/M3) on every response, because M3's diagnostic notes
//! established that any subset (this module's bbox filter included) makes
//! the GPU buffer ordinal diverge from that id, and the divergence is the
//! whole reason a picked feature must be resolved by id rather than
//! ordinal.

use std::sync::Mutex;

use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

use crate::arrow_en::serialize_en_id;
use crate::p1::{EXTENT_E, EXTENT_N};

pub const GRID_COLS: usize = 400;
pub const GRID_ROWS: usize = 250;
pub const POLYGON_COUNT: usize = GRID_COLS * GRID_ROWS; // 100,000
pub const VERTS_PER_POLYGON: usize = 100;
pub const VERTEX_COUNT: usize = POLYGON_COUNT * VERTS_PER_POLYGON; // 10,000,000

const _: () = assert!(
    VERTS_PER_POLYGON % 4 == 0,
    "the perimeter walk below splits VERTS_PER_POLYGON evenly across 4 sides"
);

/// Distinct from P1's and the markers' seeds -- a spike benchmark needs a
/// stable dataset across runs, and reusing a seed across unrelated
/// generators would make that coincidental rather than intentional.
const SEED: u64 = 2_004_100; // ADR-003, arbitrary

/// Inset margin so neighbouring parcels never touch -- 10% of the cell on
/// each side, leaving an 80%-sized parcel centred in its cell.
const INSET_FRAC: f64 = 0.10;
/// Perturbation amplitude, well under both the ~28 m average inter-vertex
/// spacing (perimeter / VERTS_PER_POLYGON) and the inset margin -- rings
/// never self-intersect or cross into a neighbouring cell.
const JITTER_M: f64 = 3.0;

fn cell_dims() -> (f64, f64) {
    (
        (EXTENT_E.1 - EXTENT_E.0) / GRID_COLS as f64,
        (EXTENT_N.1 - EXTENT_N.0) / GRID_ROWS as f64,
    )
}

/// Analytic centroid of the grid cell holding `polygon_id` -- derived from
/// indices rather than stored, so the bbox filter below is an
/// O(POLYGON_COUNT) scan over arithmetic, not a stored spatial index (same
/// "crude, no real index" caveat class as p1.rs::arrow_ipc_bbox, but 100x
/// cheaper here since it scans polygons, not vertices).
fn polygon_centroid(polygon_id: usize, cell_w: f64, cell_h: f64) -> (f64, f64) {
    let col = (polygon_id % GRID_COLS) as f64;
    let row = (polygon_id / GRID_COLS) as f64;
    (
        EXTENT_E.0 + (col + 0.5) * cell_w,
        EXTENT_N.0 + (row + 0.5) * cell_h,
    )
}

pub struct P2Dataset {
    /// Flattened, polygon-major: polygon i occupies
    /// `[i*VERTS_PER_POLYGON, (i+1)*VERTS_PER_POLYGON)`.
    vertex_e: Vec<f64>,
    vertex_n: Vec<f64>,
}

impl P2Dataset {
    pub fn generate() -> Self {
        let mut rng = StdRng::seed_from_u64(SEED);
        let mut vertex_e = Vec::with_capacity(VERTEX_COUNT);
        let mut vertex_n = Vec::with_capacity(VERTEX_COUNT);

        let (cell_w, cell_h) = cell_dims();
        let inset_e = cell_w * INSET_FRAC;
        let inset_n = cell_h * INSET_FRAC;
        let side_w = cell_w - 2.0 * inset_e;
        let side_h = cell_h - 2.0 * inset_n;
        let per_side = VERTS_PER_POLYGON / 4;

        for polygon_id in 0..POLYGON_COUNT {
            let col = (polygon_id % GRID_COLS) as f64;
            let row = (polygon_id / GRID_COLS) as f64;
            let x0 = EXTENT_E.0 + col * cell_w + inset_e;
            let y0 = EXTENT_N.0 + row * cell_h + inset_n;
            // Corners walked clockwise: bottom-left -> bottom-right ->
            // top-right -> top-left -> (back to bottom-left, unstored --
            // the ring closes implicitly, the same way a polygon's last
            // edge always closes back to its first vertex).
            let corners = [
                (x0, y0),
                (x0 + side_w, y0),
                (x0 + side_w, y0 + side_h),
                (x0, y0 + side_h),
            ];
            for side in 0..4 {
                let (sx, sy) = corners[side];
                let (ex, ey) = corners[(side + 1) % 4];
                for step in 0..per_side {
                    let t = step as f64 / per_side as f64;
                    let jx = rng.gen_range(-JITTER_M..=JITTER_M);
                    let jy = rng.gen_range(-JITTER_M..=JITTER_M);
                    vertex_e.push(sx + (ex - sx) * t + jx);
                    vertex_n.push(sy + (ey - sy) * t + jy);
                }
            }
        }

        Self { vertex_e, vertex_n }
    }

    /// The full 10,000,000-vertex dataset. `id` is each vertex's storage
    /// index, which for this unfiltered response also happens to equal its
    /// buffer ordinal -- `arrow_ipc_bbox` below is where the two diverge.
    pub fn full_arrow_ipc(&self) -> Vec<u8> {
        let ids: Vec<u64> = (0..self.vertex_e.len() as u64).collect();
        serialize_en_id(&self.vertex_e, &self.vertex_n, &ids)
    }

    /// Polygons whose analytic centroid falls in the bbox, every one of
    /// their vertices included (never a partial polygon) -- an
    /// O(POLYGON_COUNT) scan, not O(VERTEX_COUNT). `id` is each vertex's
    /// true global storage index, which is *not* its position in this
    /// filtered response -- the whole reason the wire format carries an
    /// explicit id column rather than letting the client infer identity
    /// from buffer position.
    pub fn arrow_ipc_bbox(&self, e_min: f64, n_min: f64, e_max: f64, n_max: f64) -> Vec<u8> {
        let (cell_w, cell_h) = cell_dims();
        let mut e_out = Vec::new();
        let mut n_out = Vec::new();
        let mut ids_out = Vec::new();
        for polygon_id in 0..POLYGON_COUNT {
            let (cx, cy) = polygon_centroid(polygon_id, cell_w, cell_h);
            if cx < e_min || cx > e_max || cy < n_min || cy > n_max {
                continue;
            }
            let start = polygon_id * VERTS_PER_POLYGON;
            for local in 0..VERTS_PER_POLYGON {
                let idx = start + local;
                e_out.push(self.vertex_e[idx]);
                n_out.push(self.vertex_n[idx]);
                ids_out.push(idx as u64);
            }
        }
        serialize_en_id(&e_out, &n_out, &ids_out)
    }

    /// M4's write path: commits an edited vertex back into the source of
    /// truth. Bounds- and finite-checked like markers::resolve_by_id -- a
    /// non-finite coordinate must never be silently serialisable later.
    pub fn commit_vertex(&mut self, id: u64, e: f64, n: f64) -> Result<(), String> {
        let idx = id as usize;
        if idx >= self.vertex_e.len() {
            return Err(format!(
                "vertex id {id} out of range (len {})",
                self.vertex_e.len()
            ));
        }
        if !e.is_finite() || !n.is_finite() {
            return Err(format!(
                "non-finite coordinate for vertex {id} -- refusing to commit"
            ));
        }
        self.vertex_e[idx] = e;
        self.vertex_n[idx] = n;
        Ok(())
    }

    /// Read-back for the commit round-trip check (M3-style bit-exactness):
    /// resolves a vertex id to its currently stored f64 coordinate.
    pub fn resolve_vertex(&self, id: u64) -> Result<(f64, f64), String> {
        let idx = id as usize;
        if idx >= self.vertex_e.len() {
            return Err(format!(
                "vertex id {id} out of range (len {})",
                self.vertex_e.len()
            ));
        }
        Ok((self.vertex_e[idx], self.vertex_n[idx]))
    }
}

pub type SharedP2Dataset = Mutex<P2Dataset>;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dataset_sizes_match_docs_08_polygon_class() {
        assert_eq!(POLYGON_COUNT, 100_000);
        assert_eq!(VERTEX_COUNT, 10_000_000);
    }

    #[test]
    fn commit_then_resolve_round_trips() {
        let mut d = P2Dataset::generate();
        d.commit_vertex(42, 2_600_000.123456, 1_150_000.654321).unwrap();
        let (e, n) = d.resolve_vertex(42).unwrap();
        assert_eq!(e, 2_600_000.123456);
        assert_eq!(n, 1_150_000.654321);
    }

    #[test]
    fn commit_rejects_out_of_range_and_non_finite() {
        let mut d = P2Dataset::generate();
        assert!(d.commit_vertex(VERTEX_COUNT as u64, 0.0, 0.0).is_err());
        assert!(d.commit_vertex(0, f64::NAN, 0.0).is_err());
        assert!(d.commit_vertex(0, 0.0, f64::INFINITY).is_err());
        assert!(d.resolve_vertex(VERTEX_COUNT as u64).is_err());
    }

    /// Every generated vertex must stay inside its own cell (jitter bounded
    /// by the inset margin) -- otherwise "parcels never touch" is a claim
    /// this generator doesn't actually keep.
    #[test]
    fn vertices_stay_within_their_own_cell() {
        let d = P2Dataset::generate();
        let (cell_w, cell_h) = cell_dims();
        for polygon_id in [0usize, 1, GRID_COLS, POLYGON_COUNT - 1] {
            let col = (polygon_id % GRID_COLS) as f64;
            let row = (polygon_id / GRID_COLS) as f64;
            let (e_lo, e_hi) = (EXTENT_E.0 + col * cell_w, EXTENT_E.0 + (col + 1.0) * cell_w);
            let (n_lo, n_hi) = (EXTENT_N.0 + row * cell_h, EXTENT_N.0 + (row + 1.0) * cell_h);
            let start = polygon_id * VERTS_PER_POLYGON;
            for idx in start..start + VERTS_PER_POLYGON {
                assert!(d.vertex_e[idx] > e_lo && d.vertex_e[idx] < e_hi, "polygon {polygon_id} vertex {idx} escaped its cell on E");
                assert!(d.vertex_n[idx] > n_lo && d.vertex_n[idx] < n_hi, "polygon {polygon_id} vertex {idx} escaped its cell on N");
            }
        }
    }

    /// The bbox filter's ids must be true storage indices, not sequential
    /// ordinals -- otherwise the "id indirection" the wire format exists to
    /// carry would be decorative rather than load-bearing (M3's own
    /// finding, one level up: see README diagnostic note 1).
    #[test]
    fn bbox_filter_ids_diverge_from_buffer_ordinal() {
        use arrow::array::UInt64Array;
        use arrow::ipc::reader::StreamReader;
        use std::io::Cursor;

        let d = P2Dataset::generate();
        let (cell_w, cell_h) = cell_dims();
        // An interior polygon far from id 0, and a bbox tight enough (2m x
        // 2m against ~872.5m x 884m cells) to select only that one polygon
        // -- so every returned vertex's true id should differ from its
        // buffer ordinal by the same constant offset (target*VERTS_PER_POLYGON),
        // which is far from zero.
        let target = 50_200;
        let (cx, cy) = polygon_centroid(target, cell_w, cell_h);
        let bytes = d.arrow_ipc_bbox(cx - 1.0, cy - 1.0, cx + 1.0, cy + 1.0);
        assert!(!bytes.is_empty());

        // Actually decode the wire bytes rather than asserting arithmetic on
        // a constant -- otherwise this test would pass even if
        // arrow_ipc_bbox stopped emitting true storage indices and started
        // emitting sequential ordinals instead (exactly the id-indirection
        // regression this test exists to catch).
        let reader = StreamReader::try_new(Cursor::new(bytes), None).expect("valid Arrow IPC stream");
        let mut total = 0usize;
        let mut diverged = 0usize;
        for batch in reader {
            let batch = batch.expect("valid record batch");
            let ids = batch
                .column_by_name("id")
                .expect("id column present")
                .as_any()
                .downcast_ref::<UInt64Array>()
                .expect("id column is UInt64Array");
            for ordinal in 0..batch.num_rows() {
                if ids.value(ordinal) as usize != ordinal {
                    diverged += 1;
                }
                total += 1;
            }
        }
        assert_eq!(total, VERTS_PER_POLYGON, "expected exactly one polygon's vertices from a 2m bbox");
        assert_eq!(diverged, total, "every returned vertex's true id must differ from its buffer ordinal");
    }
}
