// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! WKB → GeoArrow polygon decoding.
//!
//! Real GeoParquet in the wild stores geometry as WKB (the 1.0 encoding, and still the default in
//! 1.1), so this is the shape the engine actually meets. The decode is deliberately strict: every
//! thing it refuses is a thing that would otherwise be drawn wrong without saying so.
//!
//! **No repair.** An unclosed ring, a degenerate ring, a Z/M geometry or an EWKB SRID is a typed
//! error, never a quiet fix-up. Consent-based geometry repair belongs to the data doctor
//! (`docs/05`: original → proposed → diff, before approval), which is Alpha work (`docs/07`).
//!
//! **No transform.** Coordinate f64 bit patterns are carried through unchanged — parsed from the
//! WKB and appended to the coordinate buffer with no arithmetic applied at all.

use crate::error::{EngineError, Result};

/// OGC WKB geometry code for a 2D polygon. Codes 1003/2003/3003 (Z, M, ZM) are refused.
const WKB_POLYGON: u32 = 3;
/// PostGIS EWKB flag. A geometry-embedded SRID is a second CRS claim on a dataset that already has
/// one, which is the "mixing CRS without a declared transform" case `docs/05` makes an error.
const EWKB_SRID_FLAG: u32 = 0x2000_0000;
const EWKB_Z_FLAG: u32 = 0x8000_0000;
const EWKB_M_FLAG: u32 = 0x4000_0000;

/// Accumulates decoded polygons into the three buffers a GeoArrow polygon array is made of.
///
/// Interleaved coordinates (`FixedSizeList<xy: double>[2]`), which is what the GeoArrow
/// specification calls the interleaved coordinate layout, chosen over the separated (`Struct<x, y>`)
/// layout because the consumer draws from one contiguous run of doubles.
#[derive(Default)]
pub struct PolygonBuilder {
    /// x0, y0, x1, y1, … across every ring of every polygon.
    pub coords: Vec<f64>,
    /// Start index (in vertices, not floats) of each ring.
    pub ring_offsets: Vec<i32>,
    /// Start index (in rings) of each polygon.
    pub geom_offsets: Vec<i32>,
}

impl PolygonBuilder {
    pub fn new() -> Self {
        Self { coords: Vec::new(), ring_offsets: vec![0], geom_offsets: vec![0] }
    }

    pub fn polygons(&self) -> usize {
        self.geom_offsets.len().saturating_sub(1)
    }

    pub fn vertices(&self) -> usize {
        self.coords.len() / 2
    }

    /// Decode one WKB polygon and append it.
    pub fn push_wkb(&mut self, bytes: &[u8]) -> Result<()> {
        let mut r = Reader::new(bytes)?;

        let raw_type = r.u32()?;
        if raw_type & (EWKB_SRID_FLAG | EWKB_Z_FLAG | EWKB_M_FLAG) != 0 {
            return Err(EngineError::Wkb(
                "EWKB flags (SRID/Z/M) present; a geometry-embedded CRS or a third dimension is \
                 refused rather than dropped"
                    .into(),
            ));
        }
        if raw_type != WKB_POLYGON {
            return Err(EngineError::Wkb(format!(
                "geometry type {raw_type} is not a 2D polygon (3); this slice reads polygons only"
            )));
        }

        let n_rings = r.u32()? as usize;
        if n_rings == 0 {
            return Err(EngineError::Wkb("polygon with zero rings".into()));
        }

        for ring in 0..n_rings {
            let n_pts = r.u32()? as usize;
            // A closed ring needs at least 4 positions (3 distinct + the repeat).
            if n_pts < 4 {
                return Err(EngineError::Wkb(format!(
                    "ring {ring} has {n_pts} positions; a closed ring needs at least 4"
                )));
            }
            let first = self.coords.len();
            for _ in 0..n_pts {
                let x = r.f64()?;
                let y = r.f64()?;
                self.coords.push(x);
                self.coords.push(y);
            }
            let last = self.coords.len() - 2;
            // Bit-exact closure, not an epsilon: an "almost closed" ring is a defect the data
            // doctor should show the user, not something this decoder decides to tolerate.
            if self.coords[first] != self.coords[last] || self.coords[first + 1] != self.coords[last + 1] {
                return Err(EngineError::Wkb(format!("ring {ring} is not closed")));
            }
            self.ring_offsets.push((self.coords.len() / 2) as i32);
        }

        self.geom_offsets.push((self.ring_offsets.len() - 1) as i32);

        if !r.is_exhausted() {
            return Err(EngineError::Wkb(format!("{} trailing bytes after the polygon", r.remaining())));
        }
        Ok(())
    }
}

struct Reader<'a> {
    b: &'a [u8],
    at: usize,
    little: bool,
}

impl<'a> Reader<'a> {
    fn new(b: &'a [u8]) -> Result<Self> {
        match b.first() {
            Some(1) => Ok(Self { b, at: 1, little: true }),
            Some(0) => Ok(Self { b, at: 1, little: false }),
            Some(o) => Err(EngineError::Wkb(format!("byte-order byte {o} is neither 0 nor 1"))),
            None => Err(EngineError::Wkb("empty geometry".into())),
        }
    }

    fn take<const N: usize>(&mut self) -> Result<[u8; N]> {
        let end = self.at + N;
        let s = self
            .b
            .get(self.at..end)
            .ok_or_else(|| EngineError::Wkb(format!("truncated: wanted {N} bytes at {}", self.at)))?;
        self.at = end;
        Ok(s.try_into().expect("slice length checked above"))
    }

    fn u32(&mut self) -> Result<u32> {
        let raw = self.take::<4>()?;
        Ok(if self.little { u32::from_le_bytes(raw) } else { u32::from_be_bytes(raw) })
    }

    fn f64(&mut self) -> Result<f64> {
        let raw = self.take::<8>()?;
        Ok(if self.little { f64::from_le_bytes(raw) } else { f64::from_be_bytes(raw) })
    }

    fn is_exhausted(&self) -> bool {
        self.at == self.b.len()
    }

    fn remaining(&self) -> usize {
        self.b.len().saturating_sub(self.at)
    }
}

/// Encode a polygon as little-endian ISO WKB. Test-support for the fixture writer and the
/// round-trip assertions; the engine itself only ever decodes.
pub fn encode_polygon(rings: &[Vec<[f64; 2]>]) -> Vec<u8> {
    let mut out = Vec::new();
    out.push(1u8);
    out.extend_from_slice(&WKB_POLYGON.to_le_bytes());
    out.extend_from_slice(&(rings.len() as u32).to_le_bytes());
    for ring in rings {
        out.extend_from_slice(&(ring.len() as u32).to_le_bytes());
        for p in ring {
            out.extend_from_slice(&p[0].to_le_bytes());
            out.extend_from_slice(&p[1].to_le_bytes());
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn square(x: f64, y: f64, s: f64) -> Vec<Vec<[f64; 2]>> {
        vec![vec![[x, y], [x + s, y], [x + s, y + s], [x, y + s], [x, y]]]
    }

    #[test]
    fn decodes_a_polygon_with_a_hole_and_keeps_the_ring_structure() {
        let outer = vec![[0.0, 0.0], [10.0, 0.0], [10.0, 10.0], [0.0, 10.0], [0.0, 0.0]];
        let hole = vec![[2.0, 2.0], [4.0, 2.0], [4.0, 4.0], [2.0, 4.0], [2.0, 2.0]];
        let wkb = encode_polygon(&[outer, hole]);

        let mut b = PolygonBuilder::new();
        b.push_wkb(&wkb).unwrap();

        assert_eq!(b.polygons(), 1);
        assert_eq!(b.vertices(), 10);
        assert_eq!(b.geom_offsets, vec![0, 2], "one polygon spanning two rings");
        assert_eq!(b.ring_offsets, vec![0, 5, 10]);
    }

    #[test]
    fn variable_width_is_the_point_offsets_differ_per_feature() {
        let mut b = PolygonBuilder::new();
        b.push_wkb(&encode_polygon(&square(0.0, 0.0, 1.0))).unwrap();
        let mut many = vec![[0.0, 0.0]];
        for i in 1..12 {
            many.push([i as f64, (i * i) as f64]);
        }
        many.push([0.0, 0.0]);
        b.push_wkb(&encode_polygon(&[many])).unwrap();

        assert_eq!(b.geom_offsets, vec![0, 1, 2]);
        assert_eq!(b.ring_offsets, vec![0, 5, 18], "features have different vertex counts");
    }

    #[test]
    fn coordinate_bit_patterns_survive_the_decode_exactly() {
        // The value below is chosen because its decimal shortest-round-trip and its bit pattern are
        // easy to get subtly wrong; ADR-013 §6's bit-identity invariant is about exactly this.
        let e = 2_600_000.123_456_789_f64;
        let n = 1_200_000.987_654_321_f64;
        let ring = vec![[e, n], [e + 1.0, n], [e + 1.0, n + 1.0], [e, n]];
        let mut b = PolygonBuilder::new();
        b.push_wkb(&encode_polygon(&[ring])).unwrap();
        assert_eq!(b.coords[0].to_bits(), e.to_bits());
        assert_eq!(b.coords[1].to_bits(), n.to_bits());
    }

    #[test]
    fn big_endian_wkb_decodes_to_the_same_values() {
        let mut be = Vec::new();
        be.push(0u8);
        be.extend_from_slice(&WKB_POLYGON.to_be_bytes());
        be.extend_from_slice(&1u32.to_be_bytes());
        be.extend_from_slice(&4u32.to_be_bytes());
        for p in [[1.5f64, 2.5f64], [3.5, 2.5], [3.5, 4.5], [1.5, 2.5]] {
            be.extend_from_slice(&p[0].to_be_bytes());
            be.extend_from_slice(&p[1].to_be_bytes());
        }
        let mut b = PolygonBuilder::new();
        b.push_wkb(&be).unwrap();
        assert_eq!(&b.coords[..4], &[1.5, 2.5, 3.5, 2.5]);
    }

    #[test]
    fn refusals_are_typed_and_specific() {
        let mut b = PolygonBuilder::new();

        // Unclosed ring.
        let open = vec![vec![[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]];
        assert!(matches!(b.push_wkb(&encode_polygon(&open)), Err(EngineError::Wkb(_))));

        // A point, not a polygon.
        let mut point = vec![1u8];
        point.extend_from_slice(&1u32.to_le_bytes());
        point.extend_from_slice(&0.0f64.to_le_bytes());
        point.extend_from_slice(&0.0f64.to_le_bytes());
        assert!(matches!(b.push_wkb(&point), Err(EngineError::Wkb(_))));

        // EWKB with an embedded SRID.
        let mut ewkb = vec![1u8];
        ewkb.extend_from_slice(&(WKB_POLYGON | EWKB_SRID_FLAG).to_le_bytes());
        ewkb.extend_from_slice(&2056u32.to_le_bytes());
        let e = b.push_wkb(&ewkb).unwrap_err();
        assert!(format!("{e}").contains("SRID"));

        // Truncated.
        let full = encode_polygon(&square(0.0, 0.0, 1.0));
        assert!(matches!(b.push_wkb(&full[..full.len() - 3]), Err(EngineError::Wkb(_))));

        // Trailing bytes.
        let mut trailing = full.clone();
        trailing.push(0xAA);
        assert!(matches!(b.push_wkb(&trailing), Err(EngineError::Wkb(_))));
    }
}
