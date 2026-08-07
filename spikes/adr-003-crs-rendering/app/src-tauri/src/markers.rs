// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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

/// M3: just the five probe locations, isolated from each other by >100 km.
/// Click classes (a) and (b) need features with no near neighbour, so that a
/// mis-resolved id is unambiguous rather than a plausible near miss.
pub fn centres() -> (Vec<f64>, Vec<f64>) {
    let mut e = Vec::with_capacity(LOCATIONS.len());
    let mut n = Vec::with_capacity(LOCATIONS.len());
    for (loc_e, loc_n) in LOCATIONS {
        e.push(loc_e);
        n.push(loc_n);
    }
    (e, n)
}

/// M3 click class (c): one pair per probe location, separated by `sep_mm`.
///
/// Separation arrives as an integer millimetre count rather than a float in a
/// URL, so both sides derive the identical f64 from the *identical expression*
/// `sep_mm / 1000.0` — note `x / 1000.0` and `x * 0.001` differ in the last
/// ULP for some x, which would break the client's bit-equality check for
/// reasons having nothing to do with picking.
///
/// `axis` matters because the f32 ULP is asymmetric across the extent: at
/// easting ~2.8e6 it is 0.25 m, at northing ~1.3e6 it is 0.125 m. Separating
/// only along easting would leave that 2x asymmetry untested.
pub fn pairs(sep_mm: u32, axis: &str) -> Option<(Vec<f64>, Vec<f64>)> {
    // Deliberately not a silent fallback to easting for an unknown axis. The
    // sweep's headline sub-claim is "identical on easting, northing and
    // diagonal" — which is also the exact signature of an axis parameter that
    // was quietly ignored, and nothing in the results artifact would tell the
    // two apart. Fail instead.
    let (unit_e, unit_n) = match axis {
        "e" => (1.0, 0.0),
        "n" => (0.0, 1.0),
        "d" => (
            1.0 / std::f64::consts::SQRT_2,
            1.0 / std::f64::consts::SQRT_2,
        ),
        _ => return None,
    };
    let half = (sep_mm as f64 / 1000.0) / 2.0;
    let mut e = Vec::with_capacity(LOCATIONS.len() * 2);
    let mut n = Vec::with_capacity(LOCATIONS.len() * 2);
    for (loc_e, loc_n) in LOCATIONS {
        let (de, dn) = (half * unit_e, half * unit_n);
        e.push(loc_e - de);
        n.push(loc_n - dn);
        e.push(loc_e + de);
        n.push(loc_n + dn);
    }
    Some((e, n))
}

/// A dataset plus explicit per-feature identity.
///
/// Ids are assigned in generation order and then travel *with* the rows, so
/// reordering the buffer reorders the ids alongside it. That is what makes
/// `shuffle` a real test: the client picks a buffer ordinal, reads the id at
/// that ordinal, and asks for the id — and gets the right coordinate even
/// though ordinal != id.
pub fn dataset(name: &str, sep_mm: u32, axis: &str, shuffle: bool) -> Option<(Vec<f64>, Vec<f64>, Vec<u64>)> {
    let (mut e, mut n) = match name {
        "markers" => generate(),
        "centres" => centres(),
        "pairs" => pairs(sep_mm, axis)?,
        _ => return None,
    };
    let mut ids: Vec<u64> = (0..e.len() as u64).collect();
    if shuffle {
        // Reversal is enough to break ordinal==id everywhere except a
        // fixed point, and unlike a random permutation it stays
        // deterministic without carrying a seed through the URL.
        e.reverse();
        n.reverse();
        ids.reverse();
    }
    Some((e, n, ids))
}

/// M3's whole point: a GPU pick yields a *feature id*, and the exact source
/// coordinate comes back by looking that id up in f64 — never by unprojecting
/// the cursor, and never by reading back a rendered position. The rendered
/// positions were narrowed to f32 for the GPU; these were not, and the two
/// paths never meet.
///
/// Resolution is by id against the dataset in its natural generation order,
/// so it is independent of whatever order the renderer happened to receive.
pub fn resolve_by_id(name: &str, sep_mm: u32, axis: &str, id: u64) -> Result<(f64, f64), String> {
    let (e, n, _) = dataset(name, sep_mm, axis, false).ok_or_else(|| format!("unknown dataset {name}"))?;
    let idx = id as usize;
    if idx >= e.len() {
        return Err(format!("id {id} out of range for dataset {name} (len {})", e.len()));
    }
    // Coordinates must never be non-finite. serde_json renders NaN and
    // infinities as `null`, which JavaScript will happily coerce to 0 — a
    // silent corruption that would look like a plausible coordinate at the
    // origin. Fail loudly instead of serialising something unrepresentable.
    if !e[idx].is_finite() || !n[idx].is_finite() {
        return Err(format!("non-finite coordinate at id {id} — refusing to serialise"));
    }
    Ok((e[idx], n[idx]))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The invariant M3's whole result rests on: resolving by id must ignore
    /// buffer order. If this ever fails, the harness silently degrades into
    /// the identity function `dataset[i] == dataset[i]`.
    #[test]
    fn resolve_by_id_ignores_buffer_order() {
        let (e, n, ids) = dataset("centres", 100, "e", true).unwrap();
        let mut diverged = 0;
        for ordinal in 0..e.len() {
            let id = ids[ordinal];
            if id as usize != ordinal {
                diverged += 1;
            }
            let (re, rn) = resolve_by_id("centres", 100, "e", id).unwrap();
            assert_eq!(re, e[ordinal], "id {id} resolved to the wrong easting");
            assert_eq!(rn, n[ordinal], "id {id} resolved to the wrong northing");
        }
        // Reversing 5 elements leaves the middle a fixed point, so 4 of 5.
        assert_eq!(diverged, 4, "shuffle must actually reorder the buffer");
    }

    #[test]
    fn resolve_by_id_rejects_out_of_range_and_unknown() {
        assert!(resolve_by_id("centres", 100, "e", 999).is_err());
        assert!(resolve_by_id("nope", 100, "e", 0).is_err());
    }

    /// An unrecognised axis must fail rather than fall back to easting: a
    /// silent fallback is indistinguishable from the sweep's own finding that
    /// all three axes behave identically.
    #[test]
    fn unknown_axis_is_rejected() {
        assert!(pairs(100, "e").is_some());
        assert!(pairs(100, "n").is_some());
        assert!(pairs(100, "d").is_some());
        assert!(pairs(100, "x").is_none());
        assert!(dataset("pairs", 100, "x", false).is_none());
    }

    /// Pair separation must equal the requested millimetres on every axis,
    /// or the sweep's x-axis is mislabelled.
    #[test]
    fn pair_separation_matches_request() {
        for axis in ["e", "n", "d"] {
            let (e, n) = pairs(300, axis).unwrap();
            let d = ((e[1] - e[0]).powi(2) + (n[1] - n[0]).powi(2)).sqrt();
            assert!((d - 0.3).abs() < 1e-9, "axis {axis} separation was {d}");
        }
    }
}
