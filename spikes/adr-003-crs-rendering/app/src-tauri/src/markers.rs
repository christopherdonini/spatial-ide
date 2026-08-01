//! M2: precision probe markers.
//!
//! Five probe locations — the four corners of the spike's EPSG:2056 extent
//! plus its centre — each carrying a 5x5 grid of points at exactly 0.1 m
//! spacing. At M2's 1:500 test scale (~0.132 m/px) that spacing is ~0.76 px,
//! so the pattern is precisely the decimetre-scale structure the milestone
//! asks the renderer to hold onto without jitter.
//!
//! The grid is symmetric about its location, so its true geometric centroid
//! *is* the location — which is what makes the rendered intensity centroid a
//! usable estimator of "where did this known f64 coordinate actually land."
//! Coordinates are absolute, untransformed EPSG:2056; the offset-relative
//! recentring M2 tests happens client-side, in f64, right before the f32 GPU
//! upload (see src/offset-frame.ts).

use crate::arrow_en::serialize_en;

pub const PATTERN_SPACING_M: f64 = 0.1;
pub const PATTERN_SIDE: usize = 5;
pub const POINTS_PER_LOCATION: usize = PATTERN_SIDE * PATTERN_SIDE;

/// Probe locations, in the order the client slices them: SW, SE, NW, NE,
/// centre.
///
/// These deliberately carry centimetre fractions instead of sitting on the
/// round extent bounds (2_485_000 etc.). Those round bounds are integers
/// below 2^24 and therefore *exactly* representable in f32 — using them
/// would hide the very quantisation M2 exists to measure and would flatter
/// the naive-f32 control. Real cadastral coordinates have centimetre
/// fractions; so do these. Each sits within a metre of its extent corner,
/// inset so the whole 0.4 m pattern stays inside the extent.
pub const LOCATIONS: [(f64, f64); 5] = [
    (2_485_000.37, 1_075_000.23), // SW
    (2_833_999.63, 1_075_000.23), // SE
    (2_485_000.37, 1_295_999.77), // NW
    (2_833_999.63, 1_295_999.77), // NE
    (2_659_500.19, 1_185_500.31), // centre
];

/// Builds the marker set. The client recomputes these same f64 values with
/// the identical formula and asserts bitwise equality against what arrives
/// over Arrow IPC — so M2's "exactly-known ground truth" is verified end to
/// end rather than assumed. Keep the arithmetic here and in
/// src/m2-precision.ts textually identical or that check will (correctly)
/// start failing.
pub fn generate() -> (Vec<f64>, Vec<f64>) {
    let half = (PATTERN_SIDE as f64 - 1.0) / 2.0;
    let total = LOCATIONS.len() * POINTS_PER_LOCATION;
    let mut e = Vec::with_capacity(total);
    let mut n = Vec::with_capacity(total);
    for (loc_e, loc_n) in LOCATIONS {
        for row in 0..PATTERN_SIDE {
            for col in 0..PATTERN_SIDE {
                e.push(loc_e + (col as f64 - half) * PATTERN_SPACING_M);
                n.push(loc_n + (row as f64 - half) * PATTERN_SPACING_M);
            }
        }
    }
    (e, n)
}

/// Cheap enough (125 points) to build per request — no cached state needed.
pub fn arrow_ipc() -> Vec<u8> {
    let (e, n) = generate();
    serialize_en(&e, &n)
}
