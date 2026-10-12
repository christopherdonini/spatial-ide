// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! WKB → GeoArrow polygon, multipolygon, point, linestring and multilinestring decoding.
//!
//! Five builders, one per encoding a dataset can be opened under (`geoarrow.rs`'s
//! `GeometryEncoding`, fixed at open from the file's declared `geometry_types`): [`PolygonBuilder`]
//! reads WKB type 3 only, `MultiPolygonBuilder` reads types 3 and 6, `PointBuilder` reads type 1
//! only, `LineStringBuilder` reads type 2 only, and `MultiLineStringBuilder` reads types 2 and 5.
//! A row of any other type is refused by name and stops the stream at that row; nothing is
//! skipped.
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
use crate::geoarrow::{
    EXT_NAME_LINESTRING, EXT_NAME_MULTILINESTRING, EXT_NAME_MULTIPOLYGON, EXT_NAME_POINT,
    EXT_NAME_POLYGON,
};

/// OGC WKB geometry code for a 2D point. Codes 1001/2001/3001 (Z, M, ZM) are refused.
const WKB_POINT: u32 = 1;
/// OGC WKB geometry code for a 2D linestring. Codes 1002/2002/3002 (Z, M, ZM) are refused.
const WKB_LINESTRING: u32 = 2;
/// OGC WKB geometry code for a 2D polygon. Codes 1003/2003/3003 (Z, M, ZM) are refused.
const WKB_POLYGON: u32 = 3;
/// OGC WKB geometry code for a 2D MultiLineString. Codes 1005/2005/3005 (Z, M, ZM) are refused.
const WKB_MULTILINESTRING: u32 = 5;
/// OGC WKB geometry code for a 2D MultiPolygon. Codes 1006/2006/3006 (Z, M, ZM) are refused.
const WKB_MULTIPOLYGON: u32 = 6;
/// PostGIS EWKB flag. A geometry-embedded SRID is a second CRS claim on a dataset that already has
/// one, which is the "mixing CRS without a declared transform" case `docs/05` makes an error.
const EWKB_SRID_FLAG: u32 = 0x2000_0000;
const EWKB_Z_FLAG: u32 = 0x8000_0000;
const EWKB_M_FLAG: u32 = 0x4000_0000;
const EWKB_FLAGS: u32 = EWKB_SRID_FLAG | EWKB_Z_FLAG | EWKB_M_FLAG;

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
        Self {
            coords: Vec::new(),
            ring_offsets: vec![0],
            geom_offsets: vec![0],
        }
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
        if raw_type & EWKB_FLAGS != 0 {
            return Err(EngineError::Wkb(
                "EWKB flags (SRID/Z/M) present; a geometry-embedded CRS or a third dimension is \
                 refused rather than dropped"
                    .into(),
            ));
        }
        if raw_type != WKB_POLYGON {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, \
                 {EXT_NAME_POLYGON}, reads WKB type {WKB_POLYGON} (Polygon) only"
            )));
        }

        let n_rings = r.u32()? as usize;
        if n_rings == 0 {
            return Err(EngineError::Wkb("polygon with zero rings".into()));
        }

        for ring in 0..n_rings {
            read_ring(&mut r, ring, &mut self.coords, &mut self.ring_offsets)?;
        }

        self.geom_offsets.push((self.ring_offsets.len() - 1) as i32);

        if !r.is_exhausted() {
            return Err(EngineError::Wkb(format!(
                "{} trailing bytes after the polygon",
                r.remaining()
            )));
        }
        Ok(())
    }
}

/// One ring: its position count, its coordinates appended with no arithmetic, bit-exact closure,
/// and its end offset. Shared by both builders so a ring is read one way.
fn read_ring(
    r: &mut Reader<'_>,
    ring: usize,
    coords: &mut Vec<f64>,
    ring_offsets: &mut Vec<i32>,
) -> Result<()> {
    let n_pts = r.u32()? as usize;
    // A closed ring needs at least 4 positions (3 distinct + the repeat).
    if n_pts < 4 {
        return Err(EngineError::Wkb(format!(
            "ring {ring} has {n_pts} positions; a closed ring needs at least 4"
        )));
    }
    let first = coords.len();
    for _ in 0..n_pts {
        let x = r.f64()?;
        let y = r.f64()?;
        coords.push(x);
        coords.push(y);
    }
    let last = coords.len() - 2;
    // Bit-exact closure, not an epsilon: an "almost closed" ring is a defect the data
    // doctor should show the user, not something this decoder decides to tolerate.
    if coords[first] != coords[last] || coords[first + 1] != coords[last + 1] {
        return Err(EngineError::Wkb(format!("ring {ring} is not closed")));
    }
    ring_offsets.push((coords.len() / 2) as i32);
    Ok(())
}

/// Accumulates decoded geometries into the four buffers a GeoArrow multipolygon array is made of
/// (ADR-034 Decision 3): geometry, part and ring offsets over one interleaved coordinate run.
///
/// **A Polygon row is a one-part MultiPolygon.** Its coordinate bit patterns are carried through
/// with no arithmetic, exactly as [`PolygonBuilder`] carries them. One wire row per feature,
/// always: parts never become rows (Decision 5).
///
/// **No allocation from a WKB count.** A part count or ring count only drives a loop that reads
/// bytes, so a lying count ends at the first missing byte and never reserves memory.
#[derive(Default)]
pub(crate) struct MultiPolygonBuilder {
    /// x0, y0, x1, y1, … across every ring of every part of every geometry.
    pub(crate) coords: Vec<f64>,
    /// Start index (in vertices, not floats) of each ring.
    pub(crate) ring_offsets: Vec<i32>,
    /// Start index (in rings) of each part.
    pub(crate) part_offsets: Vec<i32>,
    /// Start index (in parts) of each geometry.
    pub(crate) geom_offsets: Vec<i32>,
}

impl MultiPolygonBuilder {
    pub(crate) fn new() -> Self {
        Self {
            coords: Vec::new(),
            ring_offsets: vec![0],
            part_offsets: vec![0],
            geom_offsets: vec![0],
        }
    }

    pub(crate) fn vertices(&self) -> usize {
        self.coords.len() / 2
    }

    /// Decode one WKB Polygon (type 3, one part) or MultiPolygon (type 6) and append it.
    pub(crate) fn push_wkb(&mut self, bytes: &[u8]) -> Result<()> {
        let mut r = Reader::new(bytes)?;

        let raw_type = r.u32()?;
        if raw_type & EWKB_FLAGS != 0 {
            return Err(EngineError::Wkb(
                "[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \
                 geometry-embedded CRS or a third dimension is refused rather than dropped"
                    .into(),
            ));
        }
        match raw_type {
            WKB_POLYGON => self.push_part(&mut r, 0)?,
            WKB_MULTIPOLYGON => {
                let n_parts = r.u32()? as usize;
                if n_parts == 0 {
                    return Err(EngineError::Wkb(
                        "[P6 placeholder] MultiPolygon with zero parts".into(),
                    ));
                }
                for part in 0..n_parts {
                    // Each part is a complete WKB geometry: its own byte-order byte, then its own
                    // type code, which must be exactly 3.
                    r.byte_order()?;
                    let part_type = r.u32()?;
                    if part_type & EWKB_FLAGS != 0 {
                        return Err(EngineError::Wkb(format!(
                            "[P6 placeholder] MultiPolygon part {part} carries EWKB flags \
                             (SRID/Z/M); a geometry-embedded CRS or a third dimension is refused \
                             rather than dropped"
                        )));
                    }
                    if part_type != WKB_POLYGON {
                        return Err(EngineError::Wkb(format!(
                            "[P6 placeholder] MultiPolygon part {part} has WKB geometry type \
                             {part_type}; a part must be WKB type {WKB_POLYGON} (Polygon)"
                        )));
                    }
                    self.push_part(&mut r, part)?;
                }
            }
            other => {
                return Err(EngineError::Wkb(format!(
                    "[P6 placeholder] WKB geometry type {other} met; this open's encoding, \
                     {EXT_NAME_MULTIPOLYGON}, reads WKB type {WKB_POLYGON} (Polygon) and type \
                     {WKB_MULTIPOLYGON} (MultiPolygon)"
                )));
            }
        }

        if !r.is_exhausted() {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] {} trailing bytes after the geometry",
                r.remaining()
            )));
        }
        self.geom_offsets.push((self.part_offsets.len() - 1) as i32);
        Ok(())
    }

    /// One part: a polygon body (ring count, then the rings), after its header has been read.
    fn push_part(&mut self, r: &mut Reader<'_>, part: usize) -> Result<()> {
        let n_rings = r.u32()? as usize;
        if n_rings == 0 {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] MultiPolygon part {part} has zero rings"
            )));
        }
        for ring in 0..n_rings {
            read_ring(r, ring, &mut self.coords, &mut self.ring_offsets)?;
        }
        self.part_offsets.push((self.ring_offsets.len() - 1) as i32);
        Ok(())
    }
}

/// Accumulates decoded Points into the one buffer a GeoArrow point array is made of: interleaved
/// coordinates, one pair per row, and no offsets. Coordinate bits are carried through with no
/// arithmetic. **A refused row stops the stream at that row; none is skipped.**
#[derive(Default)]
pub(crate) struct PointBuilder {
    /// x0, y0, x1, y1, … one pair per row.
    pub(crate) coords: Vec<f64>,
}

impl PointBuilder {
    pub(crate) fn new() -> Self {
        Self { coords: Vec::new() }
    }

    /// Vertices appended: one per row.
    pub(crate) fn vertices(&self) -> usize {
        self.coords.len() / 2
    }

    /// Decode one WKB Point (type 1) and append it.
    pub(crate) fn push_wkb(&mut self, bytes: &[u8]) -> Result<()> {
        let mut r = Reader::new(bytes)?;
        let raw_type = r.u32()?;
        if raw_type & EWKB_FLAGS != 0 {
            return Err(EngineError::Wkb(
                "[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \
                 geometry-embedded CRS or a third dimension is refused rather than dropped"
                    .into(),
            ));
        }
        if raw_type != WKB_POINT {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, \
                 {EXT_NAME_POINT}, reads WKB type {WKB_POINT} (Point) only"
            )));
        }
        let (x, y) = (r.f64()?, r.f64()?);
        if x.is_nan() || y.is_nan() {
            // WKB's empty-Point convention. It is refused, never drawn, dropped or skipped.
            return Err(EngineError::Wkb(
                "[P6 placeholder] a Point with a NaN coordinate (WKB's empty Point) was met".into(),
            ));
        }
        if !r.is_exhausted() {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] {} trailing bytes after the point",
                r.remaining()
            )));
        }
        self.coords.push(x);
        self.coords.push(y);
        Ok(())
    }
}

/// One linestring body, after its header has been read: the position count, then the positions,
/// appended with no arithmetic. **A line needs at least 2 positions.** WKB's empty LineString (0)
/// and a single position are refused, never drawn, dropped or skipped (the strict-decode policy
/// above, and ADR-034's acceptance item 5). The count only drives a loop that reads bytes, so a
/// lying count ends at the first missing byte and never reserves memory.
fn read_line(r: &mut Reader<'_>, what: &str, coords: &mut Vec<f64>) -> Result<()> {
    let n_pts = r.u32()? as usize;
    if n_pts < 2 {
        return Err(EngineError::Wkb(format!(
            "[P6 placeholder] {what} has {n_pts} positions; a line needs at least 2"
        )));
    }
    for _ in 0..n_pts {
        let x = r.f64()?;
        let y = r.f64()?;
        coords.push(x);
        coords.push(y);
    }
    Ok(())
}

/// Accumulates decoded LineStrings into the two buffers a GeoArrow linestring array is made of:
/// interleaved coordinates, and the start index (in vertices) of each line. Coordinate bits are
/// carried through with no arithmetic. **A refused row stops the stream at that row; none is
/// skipped, and a refused row appends nothing.**
#[derive(Default)]
pub(crate) struct LineStringBuilder {
    /// x0, y0, x1, y1, … across every line.
    pub(crate) coords: Vec<f64>,
    /// Start index (in vertices, not floats) of each line.
    pub(crate) geom_offsets: Vec<i32>,
}

impl LineStringBuilder {
    pub(crate) fn new() -> Self {
        Self {
            coords: Vec::new(),
            geom_offsets: vec![0],
        }
    }

    pub(crate) fn vertices(&self) -> usize {
        self.coords.len() / 2
    }

    /// Decode one WKB LineString (type 2) and append it.
    pub(crate) fn push_wkb(&mut self, bytes: &[u8]) -> Result<()> {
        let start = self.coords.len();
        let decoded = self.decode(bytes);
        if decoded.is_err() {
            self.coords.truncate(start);
        } else {
            self.geom_offsets.push(self.vertices() as i32);
        }
        decoded
    }

    fn decode(&mut self, bytes: &[u8]) -> Result<()> {
        let mut r = Reader::new(bytes)?;
        let raw_type = r.u32()?;
        if raw_type & EWKB_FLAGS != 0 {
            return Err(EngineError::Wkb(
                "[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \
                 geometry-embedded CRS or a third dimension is refused rather than dropped"
                    .into(),
            ));
        }
        if raw_type != WKB_LINESTRING {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, \
                 {EXT_NAME_LINESTRING}, reads WKB type {WKB_LINESTRING} (LineString) only"
            )));
        }
        read_line(&mut r, "LineString", &mut self.coords)?;
        if !r.is_exhausted() {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] {} trailing bytes after the linestring",
                r.remaining()
            )));
        }
        Ok(())
    }
}

/// Accumulates decoded geometries into the three buffers a GeoArrow multilinestring array is made
/// of: geometry and part offsets over one interleaved coordinate run.
///
/// **A LineString row is a one-part MultiLineString.** Its coordinate bit patterns are carried
/// through with no arithmetic, exactly as [`LineStringBuilder`] carries them. One wire row per
/// feature, always: parts never become rows (ADR-034 Decision 5). **A refused row appends
/// nothing.**
///
/// **No allocation from a WKB count.** A part count or position count only drives a loop that reads
/// bytes, so a lying count ends at the first missing byte and never reserves memory.
#[derive(Default)]
pub(crate) struct MultiLineStringBuilder {
    /// x0, y0, x1, y1, … across every part of every geometry.
    pub(crate) coords: Vec<f64>,
    /// Start index (in vertices, not floats) of each part.
    pub(crate) part_offsets: Vec<i32>,
    /// Start index (in parts) of each geometry.
    pub(crate) geom_offsets: Vec<i32>,
}

impl MultiLineStringBuilder {
    pub(crate) fn new() -> Self {
        Self {
            coords: Vec::new(),
            part_offsets: vec![0],
            geom_offsets: vec![0],
        }
    }

    pub(crate) fn vertices(&self) -> usize {
        self.coords.len() / 2
    }

    /// Decode one WKB LineString (type 2, one part) or MultiLineString (type 5) and append it.
    pub(crate) fn push_wkb(&mut self, bytes: &[u8]) -> Result<()> {
        let (coords, parts) = (self.coords.len(), self.part_offsets.len());
        let decoded = self.decode(bytes);
        if decoded.is_err() {
            self.coords.truncate(coords);
            self.part_offsets.truncate(parts);
        } else {
            self.geom_offsets.push((self.part_offsets.len() - 1) as i32);
        }
        decoded
    }

    fn decode(&mut self, bytes: &[u8]) -> Result<()> {
        let mut r = Reader::new(bytes)?;
        let raw_type = r.u32()?;
        if raw_type & EWKB_FLAGS != 0 {
            return Err(EngineError::Wkb(
                "[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \
                 geometry-embedded CRS or a third dimension is refused rather than dropped"
                    .into(),
            ));
        }
        match raw_type {
            WKB_LINESTRING => self.push_part(&mut r, "LineString")?,
            WKB_MULTILINESTRING => {
                let n_parts = r.u32()? as usize;
                if n_parts == 0 {
                    return Err(EngineError::Wkb(
                        "[P6 placeholder] MultiLineString with zero parts".into(),
                    ));
                }
                for part in 0..n_parts {
                    // Each part is a complete WKB geometry: its own byte-order byte, then its own
                    // type code, which must be exactly 2.
                    r.byte_order()?;
                    let part_type = r.u32()?;
                    if part_type & EWKB_FLAGS != 0 {
                        return Err(EngineError::Wkb(format!(
                            "[P6 placeholder] MultiLineString part {part} carries EWKB flags \
                             (SRID/Z/M); a geometry-embedded CRS or a third dimension is refused \
                             rather than dropped"
                        )));
                    }
                    if part_type != WKB_LINESTRING {
                        return Err(EngineError::Wkb(format!(
                            "[P6 placeholder] MultiLineString part {part} has WKB geometry type \
                             {part_type}; a part must be WKB type {WKB_LINESTRING} (LineString)"
                        )));
                    }
                    self.push_part(&mut r, &format!("MultiLineString part {part}"))?;
                }
            }
            other => {
                return Err(EngineError::Wkb(format!(
                    "[P6 placeholder] WKB geometry type {other} met; this open's encoding, \
                     {EXT_NAME_MULTILINESTRING}, reads WKB type {WKB_LINESTRING} (LineString) and \
                     type {WKB_MULTILINESTRING} (MultiLineString)"
                )));
            }
        }
        if !r.is_exhausted() {
            return Err(EngineError::Wkb(format!(
                "[P6 placeholder] {} trailing bytes after the geometry",
                r.remaining()
            )));
        }
        Ok(())
    }

    /// One part: a linestring body, after its header has been read.
    fn push_part(&mut self, r: &mut Reader<'_>, what: &str) -> Result<()> {
        read_line(r, what, &mut self.coords)?;
        self.part_offsets.push(self.vertices() as i32);
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
            Some(1) => Ok(Self {
                b,
                at: 1,
                little: true,
            }),
            Some(0) => Ok(Self {
                b,
                at: 1,
                little: false,
            }),
            Some(o) => Err(EngineError::Wkb(format!(
                "byte-order byte {o} is neither 0 nor 1"
            ))),
            None => Err(EngineError::Wkb("empty geometry".into())),
        }
    }

    /// A nested geometry's own byte-order byte. Every WKB geometry carries one, so a MultiPolygon's
    /// parts may differ from the outer geometry and from each other.
    fn byte_order(&mut self) -> Result<()> {
        let [o] = self.take::<1>()?;
        self.little = match o {
            1 => true,
            0 => false,
            o => {
                return Err(EngineError::Wkb(format!(
                    "byte-order byte {o} is neither 0 nor 1"
                )))
            }
        };
        Ok(())
    }

    fn take<const N: usize>(&mut self) -> Result<[u8; N]> {
        let end = self.at + N;
        let s = self.b.get(self.at..end).ok_or_else(|| {
            EngineError::Wkb(format!("truncated: wanted {N} bytes at {}", self.at))
        })?;
        self.at = end;
        Ok(s.try_into().expect("slice length checked above"))
    }

    fn u32(&mut self) -> Result<u32> {
        let raw = self.take::<4>()?;
        Ok(if self.little {
            u32::from_le_bytes(raw)
        } else {
            u32::from_be_bytes(raw)
        })
    }

    fn f64(&mut self) -> Result<f64> {
        let raw = self.take::<8>()?;
        Ok(if self.little {
            f64::from_le_bytes(raw)
        } else {
            f64::from_be_bytes(raw)
        })
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
        let outer = vec![
            [0.0, 0.0],
            [10.0, 0.0],
            [10.0, 10.0],
            [0.0, 10.0],
            [0.0, 0.0],
        ];
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
        assert_eq!(
            b.ring_offsets,
            vec![0, 5, 18],
            "features have different vertex counts"
        );
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
        assert!(matches!(
            b.push_wkb(&encode_polygon(&open)),
            Err(EngineError::Wkb(_))
        ));

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
        assert!(matches!(
            b.push_wkb(&full[..full.len() - 3]),
            Err(EngineError::Wkb(_))
        ));

        // Trailing bytes.
        let mut trailing = full.clone();
        trailing.push(0xAA);
        assert!(matches!(b.push_wkb(&trailing), Err(EngineError::Wkb(_))));
    }

    // ---- MultiPolygon (MP-1 preregistration §4, rows E-1 to E-5) -----------------------------

    use crate::fixture::{encode_multipolygon, multipolygon_f1_rows};

    /// Big-endian ISO WKB for a polygon, for a part whose byte order differs from its parent's.
    fn encode_polygon_be(rings: &[Vec<[f64; 2]>]) -> Vec<u8> {
        let mut out = vec![0u8];
        out.extend_from_slice(&WKB_POLYGON.to_be_bytes());
        out.extend_from_slice(&(rings.len() as u32).to_be_bytes());
        for ring in rings {
            out.extend_from_slice(&(ring.len() as u32).to_be_bytes());
            for p in ring {
                out.extend_from_slice(&p[0].to_be_bytes());
                out.extend_from_slice(&p[1].to_be_bytes());
            }
        }
        out
    }

    /// A refusal's text, which must be typed `Wkb` and carry the placeholder mark.
    fn refusal(b: &mut MultiPolygonBuilder, wkb: &[u8]) -> String {
        match b.push_wkb(wkb) {
            Err(EngineError::Wkb(d)) => {
                assert!(d.starts_with("[P6 placeholder] "), "{d}");
                d
            }
            other => panic!("expected a typed Wkb refusal, got {other:?}"),
        }
    }

    /// E-1. RECORDED MUTATION: in `MultiPolygonBuilder::push_part`, push the part offset before the
    /// part's rings are read instead of after. The part offsets come out one ring short and this
    /// test fails by name at the `part_offsets` assertion.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `a_multipolygon_row_keeps_its_three_offset_levels_exactly` FAILED with the mutation applied,
    /// then reverted.
    #[test]
    fn a_multipolygon_row_keeps_its_three_offset_levels_exactly() {
        // F-1's row 0: three parts, the second with a hole.
        let rows = multipolygon_f1_rows([0.0, 0.0], 1.0);
        let mut b = MultiPolygonBuilder::new();
        b.push_wkb(&rows[0]).unwrap();
        assert_eq!(
            b.geom_offsets,
            vec![0, 3],
            "one geometry spanning three parts"
        );
        assert_eq!(
            b.part_offsets,
            vec![0, 1, 3, 4],
            "parts span one, two and one rings"
        );
        assert_eq!(b.ring_offsets, vec![0, 5, 10, 15, 20]);
        assert_eq!(b.vertices(), 20);

        // The next row continues every level from where the last one ended.
        b.push_wkb(&rows[1]).unwrap();
        assert_eq!(b.geom_offsets, vec![0, 3, 4]);
        assert_eq!(b.part_offsets, vec![0, 1, 3, 4, 5]);
        assert_eq!(b.ring_offsets, vec![0, 5, 10, 15, 20, 25]);
    }

    /// E-2. RECORDED MUTATION: in `read_ring`, narrow each coordinate through `f32` (`x as f32 as
    /// f64`). The promoted coordinates lose their low bits and this test fails by name at the
    /// bit comparison.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `a_polygon_row_under_multipolygon_is_one_part_with_its_coordinate_bits_unchanged` FAILED
    /// with the mutation applied, then reverted.
    #[test]
    fn a_polygon_row_under_multipolygon_is_one_part_with_its_coordinate_bits_unchanged() {
        let e = 2_600_000.123_456_789_f64;
        let n = 1_200_000.987_654_321_f64;
        let ring = vec![[e, n], [e + 1.0, n], [e + 1.0, n + 1.0], [e, n]];
        let mut b = MultiPolygonBuilder::new();
        b.push_wkb(&encode_polygon(std::slice::from_ref(&ring)))
            .unwrap();

        assert_eq!(b.geom_offsets, vec![0, 1], "one geometry of one part");
        assert_eq!(b.part_offsets, vec![0, 1]);
        assert_eq!(b.ring_offsets, vec![0, 4]);
        let want: Vec<u64> = ring
            .iter()
            .flat_map(|p| [p[0].to_bits(), p[1].to_bits()])
            .collect();
        let got: Vec<u64> = b.coords.iter().map(|v| v.to_bits()).collect();
        assert_eq!(got, want);
    }

    /// E-3. RECORDED MUTATION: delete the per-part type check (`part_type != WKB_POLYGON`) in
    /// `MultiPolygonBuilder::push_wkb`. A part typed 6 is then read as a polygon body and ends in a
    /// truncation error that does not name the part's type, so this test fails by name at that
    /// refusal's text.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `each_unreadable_multipolygon_row_is_a_typed_refusal_naming_what_was_met` FAILED with the
    /// mutation applied, then reverted.
    #[test]
    fn each_unreadable_multipolygon_row_is_a_typed_refusal_naming_what_was_met() {
        let mut b = MultiPolygonBuilder::new();
        let sq = vec![vec![[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 0.0]]];

        // Zero parts.
        let mut zero_parts = vec![1u8];
        zero_parts.extend_from_slice(&WKB_MULTIPOLYGON.to_le_bytes());
        zero_parts.extend_from_slice(&0u32.to_le_bytes());
        assert!(refusal(&mut b, &zero_parts).contains("zero parts"));

        // A part with zero rings.
        let mut zero_rings = vec![1u8];
        zero_rings.extend_from_slice(&WKB_MULTIPOLYGON.to_le_bytes());
        zero_rings.extend_from_slice(&1u32.to_le_bytes());
        zero_rings.push(1u8);
        zero_rings.extend_from_slice(&WKB_POLYGON.to_le_bytes());
        zero_rings.extend_from_slice(&0u32.to_le_bytes());
        assert!(refusal(&mut b, &zero_rings).contains("part 0 has zero rings"));

        // A part that is itself a MultiPolygon (type 6).
        let mut nested = vec![1u8];
        nested.extend_from_slice(&WKB_MULTIPOLYGON.to_le_bytes());
        nested.extend_from_slice(&1u32.to_le_bytes());
        nested.extend_from_slice(&encode_multipolygon(std::slice::from_ref(&sq)));
        let d = refusal(&mut b, &nested);
        assert!(d.contains("part 0 has WKB geometry type 6"), "{d}");

        // EWKB flags on a part, and on the header.
        let mut flagged_part = vec![1u8];
        flagged_part.extend_from_slice(&WKB_MULTIPOLYGON.to_le_bytes());
        flagged_part.extend_from_slice(&1u32.to_le_bytes());
        flagged_part.push(1u8);
        flagged_part.extend_from_slice(&(WKB_POLYGON | EWKB_SRID_FLAG).to_le_bytes());
        assert!(refusal(&mut b, &flagged_part).contains("part 0 carries EWKB flags"));
        let mut flagged_header = vec![1u8];
        flagged_header.extend_from_slice(&(WKB_MULTIPOLYGON | EWKB_Z_FLAG).to_le_bytes());
        assert!(refusal(&mut b, &flagged_header).contains("EWKB flags"));

        // A type that is neither 3 nor 6, ISO Z codes included, each naming the type met.
        for (code, name) in [
            (1u32, "Point"),
            (7, "GeometryCollection"),
            (1006, "MultiPolygon Z"),
        ] {
            let mut other = vec![1u8];
            other.extend_from_slice(&code.to_le_bytes());
            let d = refusal(&mut b, &other);
            assert!(
                d.contains(&format!("geometry type {code} met")),
                "{name}: {d}"
            );
            assert!(d.contains(EXT_NAME_MULTIPOLYGON), "{d}");
        }
    }

    /// E-4. RECORDED MUTATION: in `PolygonBuilder::push_wkb`, accept type 6 as well as 3
    /// (`raw_type != WKB_POLYGON && raw_type != 6`). A MultiPolygon row is then read as a polygon
    /// body and ends in a truncation error, so this test fails by name at the refusal's text.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `the_polygon_builder_still_refuses_a_multipolygon_row` FAILED with the mutation applied,
    /// then reverted.
    #[test]
    fn the_polygon_builder_still_refuses_a_multipolygon_row() {
        let rows = multipolygon_f1_rows([0.0, 0.0], 1.0);
        let e = PolygonBuilder::new().push_wkb(&rows[1]).unwrap_err();
        let EngineError::Wkb(d) = e else {
            panic!("expected Wkb")
        };
        assert!(d.starts_with("[P6 placeholder] "), "{d}");
        assert!(d.contains("geometry type 6 met"), "{d}");
        assert!(d.contains(EXT_NAME_POLYGON), "{d}");
    }

    /// E-5. RECORDED MUTATION: in `MultiPolygonBuilder::push_wkb`, read each part's byte-order byte
    /// but keep the outer geometry's order (replace `r.byte_order()?` with `r.take::<1>()?`). A
    /// big-endian part is then misread and this test fails by name at the first `unwrap`.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `parts_with_mixed_byte_orders_decode_to_the_same_values` FAILED with the mutation applied,
    /// then reverted.
    #[test]
    fn parts_with_mixed_byte_orders_decode_to_the_same_values() {
        let a = vec![vec![[1.5, 2.5], [3.5, 2.5], [3.5, 4.5], [1.5, 2.5]]];
        let b2 = vec![vec![
            [10.25, 20.5],
            [30.25, 20.5],
            [30.25, 40.5],
            [10.25, 20.5],
        ]];

        let mut reference = MultiPolygonBuilder::new();
        reference
            .push_wkb(&encode_multipolygon(&[a.clone(), b2.clone()]))
            .unwrap();

        // Outer little-endian, first part little-endian, second part big-endian.
        let mut mixed = vec![1u8];
        mixed.extend_from_slice(&WKB_MULTIPOLYGON.to_le_bytes());
        mixed.extend_from_slice(&2u32.to_le_bytes());
        mixed.extend_from_slice(&encode_polygon(&a));
        mixed.extend_from_slice(&encode_polygon_be(&b2));

        // Outer big-endian, first part little-endian, second part big-endian.
        let mut outer_be = vec![0u8];
        outer_be.extend_from_slice(&WKB_MULTIPOLYGON.to_be_bytes());
        outer_be.extend_from_slice(&2u32.to_be_bytes());
        outer_be.extend_from_slice(&encode_polygon(&a));
        outer_be.extend_from_slice(&encode_polygon_be(&b2));

        for wkb in [mixed, outer_be] {
            let mut got = MultiPolygonBuilder::new();
            got.push_wkb(&wkb).unwrap();
            assert_eq!(got.geom_offsets, reference.geom_offsets);
            assert_eq!(got.part_offsets, reference.part_offsets);
            assert_eq!(got.ring_offsets, reference.ring_offsets);
            let bits = |b: &MultiPolygonBuilder| -> Vec<u64> {
                b.coords.iter().map(|v| v.to_bits()).collect()
            };
            assert_eq!(bits(&got), bits(&reference));
        }
    }

    // ---- Point (points-cut preregistration §4, rows PE-1 to PE-4) ----------------------------

    use crate::fixture::encode_point;

    /// The text of a typed `Wkb` refusal of `wkb` by a fresh `PointBuilder`.
    fn point_refusal(wkb: &[u8]) -> String {
        let mut b = PointBuilder::new();
        match b.push_wkb(wkb) {
            Err(EngineError::Wkb(d)) => {
                assert_eq!(b.vertices(), 0, "a refused row appends nothing");
                d
            }
            other => panic!("expected a typed Wkb refusal, got {other:?}"),
        }
    }

    /// PE-1. RECORDED MUTATION: in `PointBuilder::push_wkb`, narrow x through `f32` (`x as f32 as
    /// f64`). The coordinate loses its low bits and this test fails by name at the bit comparison.
    ///
    /// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
    /// `a_point_row_is_one_coordinate_pair_with_its_bits_unchanged` FAILED with the mutation
    /// applied, at its assertion `x then y, bits unchanged`, then reverted.
    #[test]
    fn a_point_row_is_one_coordinate_pair_with_its_bits_unchanged() {
        let e = 2_600_000.123_456_789_f64;
        let n = 1_200_000.987_654_321_f64;
        let mut b = PointBuilder::new();
        b.push_wkb(&encode_point(e, n)).unwrap();
        b.push_wkb(&encode_point(n, e)).unwrap();
        assert_eq!(b.vertices(), 2, "one vertex per row");
        let got: Vec<u64> = b.coords.iter().map(|v| v.to_bits()).collect();
        let want = [e, n, n, e].map(f64::to_bits);
        assert_eq!(got, want, "x then y, bits unchanged");
    }

    /// PE-2. RECORDED MUTATION: delete the type-1 check (`raw_type != WKB_POINT`) in
    /// `PointBuilder::push_wkb` (applied as `if false && raw_type != WKB_POINT`). The type-1001 row
    /// is then read as a point (this test's rows carry no third coordinate) and this test fails by
    /// name where it expects a refusal.
    ///
    /// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
    /// `each_unreadable_point_row_is_a_typed_refusal_naming_what_was_met` FAILED with the mutation
    /// applied, at `expected a typed Wkb refusal, got Ok(())`, then reverted.
    #[test]
    fn each_unreadable_point_row_is_a_typed_refusal_naming_what_was_met() {
        // EWKB flags: an embedded SRID, and the Z flag.
        let mut srid = vec![1u8];
        srid.extend_from_slice(&(WKB_POINT | EWKB_SRID_FLAG).to_le_bytes());
        srid.extend_from_slice(&2056u32.to_le_bytes());
        assert!(point_refusal(&srid).contains("EWKB flags"));
        let mut flagged = encode_point(1.0, 2.0);
        flagged[1..5].copy_from_slice(&(WKB_POINT | EWKB_Z_FLAG).to_le_bytes());
        assert!(point_refusal(&flagged).contains("EWKB flags"));

        // A type other than 1, ISO Z, M and ZM codes included, each naming the type met.
        for (code, name) in [
            (1001u32, "Point Z"),
            (2001, "Point M"),
            (3001, "Point ZM"),
            (3, "Polygon"),
            (4, "MultiPoint"),
        ] {
            let mut other = encode_point(1.0, 2.0);
            other[1..5].copy_from_slice(&code.to_le_bytes());
            let d = point_refusal(&other);
            assert!(d.starts_with("[P6 placeholder] "), "{name}: {d}");
            assert!(
                d.contains(&format!("geometry type {code} met")),
                "{name}: {d}"
            );
            assert!(d.contains(EXT_NAME_POINT), "{name}: {d}");
        }

        // Trailing bytes, and truncation.
        let mut trailing = encode_point(1.0, 2.0);
        trailing.push(0xAA);
        assert!(point_refusal(&trailing).contains("1 trailing bytes"));
        let full = encode_point(1.0, 2.0);
        assert!(point_refusal(&full[..full.len() - 3]).contains("truncated"));
    }

    /// PE-3. RECORDED MUTATION: in `PointBuilder::push_wkb`, ignore the byte-order byte (set
    /// `r.little = true` after `Reader::new`). The big-endian row is then misread and this test
    /// fails by name at the first `unwrap`.
    ///
    /// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
    /// `a_big_endian_point_decodes_to_the_same_values` FAILED with the mutation applied, at its
    /// first `unwrap`, an `Err` naming `geometry type 16777216`, then reverted.
    #[test]
    fn a_big_endian_point_decodes_to_the_same_values() {
        let (x, y) = (1_234_567.891_f64, -2.5_f64);
        let mut be = vec![0u8];
        be.extend_from_slice(&WKB_POINT.to_be_bytes());
        be.extend_from_slice(&x.to_be_bytes());
        be.extend_from_slice(&y.to_be_bytes());
        let mut got = PointBuilder::new();
        got.push_wkb(&be).unwrap();
        let mut reference = PointBuilder::new();
        reference.push_wkb(&encode_point(x, y)).unwrap();
        assert_eq!(
            got.coords.iter().map(|v| v.to_bits()).collect::<Vec<_>>(),
            reference
                .coords
                .iter()
                .map(|v| v.to_bits())
                .collect::<Vec<_>>()
        );
    }

    /// PE-4. RECORDED MUTATION: delete the NaN check in `PointBuilder::push_wkb` (applied as
    /// `if false && (x.is_nan() || y.is_nan())`). WKB's empty Point (NaN, NaN) is then appended as a
    /// coordinate and this test fails by name where it expects a refusal for the first case.
    ///
    /// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
    /// `a_point_with_a_nan_in_either_coordinate_is_refused` FAILED with the mutation applied, at
    /// `expected a typed Wkb refusal, got Ok(())`, then reverted.
    #[test]
    fn a_point_with_a_nan_in_either_coordinate_is_refused() {
        for (x, y) in [
            (f64::NAN, f64::NAN),
            (f64::NAN, 2.0),
            (1.0, f64::NAN),
            (f64::from_bits(0x7FF8_0000_0000_0001), 0.0),
        ] {
            let d = point_refusal(&encode_point(x, y));
            assert!(d.starts_with("[P6 placeholder] "), "{d}");
            assert!(d.contains("NaN"), "{d}");
        }
    }

    // ---- LineString and MultiLineString (lines-cut preregistration §4, rows LE-1 to LE-6) -----

    use crate::fixture::{encode_linestring, encode_multilinestring, line_l1, multilinestring_ml1};

    /// The text of a typed `Wkb` refusal of `wkb` by a fresh `LineStringBuilder`, which a refused
    /// row leaves empty.
    fn line_refusal(wkb: &[u8]) -> String {
        let mut b = LineStringBuilder::new();
        match b.push_wkb(wkb) {
            Err(EngineError::Wkb(d)) => {
                assert_eq!(b.vertices(), 0, "a refused row appends nothing");
                assert_eq!(b.geom_offsets, vec![0], "a refused row appends no offset");
                d
            }
            other => panic!("expected a typed Wkb refusal, got {other:?}"),
        }
    }

    /// The text of a typed `Wkb` refusal of `wkb` by a fresh `MultiLineStringBuilder`, which a
    /// refused row leaves empty.
    fn multiline_refusal(wkb: &[u8]) -> String {
        let mut b = MultiLineStringBuilder::new();
        match b.push_wkb(wkb) {
            Err(EngineError::Wkb(d)) => {
                assert_eq!(b.vertices(), 0, "a refused row appends nothing");
                assert_eq!(b.part_offsets, vec![0], "a refused row appends no part");
                assert_eq!(b.geom_offsets, vec![0], "a refused row appends no geometry");
                d
            }
            other => panic!("expected a typed Wkb refusal, got {other:?}"),
        }
    }

    fn bits_of(coords: &[f64]) -> Vec<u64> {
        coords.iter().map(|v| v.to_bits()).collect()
    }

    /// LE-1. RECORDED MUTATION: in `read_line`, narrow x through `f32` (`x as f32 as f64`). The
    /// coordinate loses its low bits and this test fails by name at the bit comparison.
    ///
    /// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
    /// `a_linestring_row_is_its_positions_in_order_with_bits_unchanged` FAILED with the mutation
    /// applied, at its assertion `x then y, in order, bits unchanged`, where the narrowed x differs
    /// in its bits, then reverted.
    #[test]
    fn a_linestring_row_is_its_positions_in_order_with_bits_unchanged() {
        let rows = line_l1([2_600_000.0, 1_200_000.0], 10.0);
        let mut b = LineStringBuilder::new();
        for row in &rows {
            b.push_wkb(&encode_linestring(row)).unwrap();
        }
        let want: Vec<f64> = rows.iter().flatten().flatten().copied().collect();
        assert_eq!(b.vertices(), 16, "L-1 holds 2 + 3 + 5 + 2 + 4 positions");
        assert_eq!(
            bits_of(&b.coords),
            bits_of(&want),
            "x then y, in order, bits unchanged"
        );
        assert_eq!(
            b.geom_offsets,
            vec![0, 2, 5, 10, 12, 16],
            "one offset per row, in vertices"
        );
    }

    /// LE-2. RECORDED MUTATION: delete the type-2 check (`raw_type != WKB_LINESTRING`) in
    /// `LineStringBuilder::decode` (applied as `if false && raw_type != WKB_LINESTRING`). The ISO
    /// Z row is then read as a linestring and this test fails by name where it expects a refusal.
    ///
    /// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
    /// `each_unreadable_linestring_row_is_a_typed_refusal_naming_what_was_met` FAILED with the
    /// mutation applied, at `expected a typed Wkb refusal, got Ok(())`, for the first row (the ISO
    /// LineString Z code), then reverted.
    #[test]
    fn each_unreadable_linestring_row_is_a_typed_refusal_naming_what_was_met() {
        let line = [[1.0, 2.0], [3.0, 4.0]];
        let with_code = |code: u32| {
            let mut w = encode_linestring(&line);
            w[1..5].copy_from_slice(&code.to_le_bytes());
            w
        };

        // A type other than 2, ISO Z, M and ZM codes included, each naming the type met.
        for (code, name) in [
            (1002u32, "LineString Z"),
            (2002, "LineString M"),
            (3002, "LineString ZM"),
            (1, "Point"),
            (3, "Polygon"),
            (5, "MultiLineString"),
            (7, "GeometryCollection"),
        ] {
            let d = line_refusal(&with_code(code));
            assert!(d.starts_with("[P6 placeholder] "), "{name}: {d}");
            assert!(
                d.contains(&format!("geometry type {code} met")),
                "{name}: {d}"
            );
            assert!(d.contains(EXT_NAME_LINESTRING), "{name}: {d}");
        }

        // EWKB flags: an embedded SRID, and the Z flag.
        for flag in [EWKB_SRID_FLAG, EWKB_Z_FLAG, EWKB_M_FLAG] {
            let d = line_refusal(&with_code(WKB_LINESTRING | flag));
            assert!(d.starts_with("[P6 placeholder] "), "{d}");
            assert!(d.contains("EWKB flags"), "{d}");
        }

        // Trailing bytes, and truncation.
        let mut trailing = encode_linestring(&line);
        trailing.push(0xAA);
        assert!(line_refusal(&trailing).contains("1 trailing bytes"));
        let full = encode_linestring(&line);
        assert!(line_refusal(&full[..full.len() - 3]).contains("truncated"));

        // A count far beyond the bytes present ends at the first missing byte: nothing is reserved
        // from the count, and nothing is appended.
        let mut lying = encode_linestring(&line);
        lying[5..9].copy_from_slice(&u32::MAX.to_le_bytes());
        assert!(line_refusal(&lying).contains("truncated"));
    }

    /// LE-3. RECORDED MUTATION: in `LineStringBuilder::decode`, ignore the byte-order byte (set
    /// `r.little = true` after `Reader::new`). The big-endian row is then misread and this test
    /// fails by name at its first `unwrap`.
    ///
    /// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
    /// `a_big_endian_linestring_decodes_to_the_same_values` FAILED with the mutation applied, at
    /// its first `unwrap`, an `Err` naming `geometry type 33554432`, then reverted.
    #[test]
    fn a_big_endian_linestring_decodes_to_the_same_values() {
        let line = [[1_234_567.891_f64, -2.5], [8.25, 1e-3]];
        let mut be = vec![0u8];
        be.extend_from_slice(&WKB_LINESTRING.to_be_bytes());
        be.extend_from_slice(&2u32.to_be_bytes());
        for p in &line {
            be.extend_from_slice(&p[0].to_be_bytes());
            be.extend_from_slice(&p[1].to_be_bytes());
        }
        let mut got = LineStringBuilder::new();
        got.push_wkb(&be).unwrap();
        let mut reference = LineStringBuilder::new();
        reference.push_wkb(&encode_linestring(&line)).unwrap();
        assert_eq!(bits_of(&got.coords), bits_of(&reference.coords));
        assert_eq!(got.geom_offsets, reference.geom_offsets);
    }

    /// LE-4. RECORDED MUTATION: in `read_line`, change `n_pts < 2` to `n_pts < 1`. A one-position
    /// line is then admitted and this test fails by name where it expects a refusal.
    ///
    /// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
    /// `a_linestring_of_fewer_than_two_positions_is_refused_and_two_is_admitted` FAILED with the
    /// mutation applied, at `expected a typed Wkb refusal, got Ok(())`, for the one-position row,
    /// then reverted.
    #[test]
    fn a_linestring_of_fewer_than_two_positions_is_refused_and_two_is_admitted() {
        for n in [0usize, 1] {
            let positions: Vec<[f64; 2]> = (0..n).map(|i| [i as f64, 0.5]).collect();
            let d = line_refusal(&encode_linestring(&positions));
            assert!(d.starts_with("[P6 placeholder] "), "{n}: {d}");
            assert!(d.contains(&format!("has {n} positions")), "{n}: {d}");
            assert!(d.contains("at least 2"), "{n}: {d}");
        }
        let mut b = LineStringBuilder::new();
        b.push_wkb(&encode_linestring(&[[1.0, 2.0], [3.0, 4.0]]))
            .unwrap();
        assert_eq!(b.vertices(), 2);
        // The same bound holds for a part, and for a one-part row.
        let d = multiline_refusal(&encode_linestring(&[[1.0, 2.0]]));
        assert!(d.contains("LineString has 1 positions"), "{d}");
    }

    /// LE-5. RECORDED MUTATION: in `MultiLineStringBuilder::push_part`, also push a geometry offset
    /// (`self.geom_offsets.push((self.part_offsets.len() - 1) as i32)`). Parts then become rows and
    /// this test fails by name at the geometry offsets.
    ///
    /// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
    /// `a_multilinestring_row_keeps_its_parts_and_a_linestring_row_is_one_part` FAILED with the
    /// mutation applied, at its assertion `one offset per row, in parts: rows of 2, 1, 3 and 1
    /// parts` (left `[0, 1, 2, 2, 3, 3, 4, 5, 6, 6, 7, 7]`, right `[0, 2, 3, 6, 7]`), then
    /// reverted.
    #[test]
    fn a_multilinestring_row_keeps_its_parts_and_a_linestring_row_is_one_part() {
        let rows = multilinestring_ml1([2_600_000.0, 1_200_000.0], 10.0);
        let mut b = MultiLineStringBuilder::new();
        for parts in &rows {
            b.push_wkb(&encode_multilinestring(parts)).unwrap();
        }
        // A type-2 row is one part, its bits unchanged.
        let single = [
            [7.123_456_789_f64, 8.987_654_321],
            [9.5, 10.25],
            [11.0, 12.0],
        ];
        b.push_wkb(&encode_linestring(&single)).unwrap();

        let mut want: Vec<f64> = rows.iter().flatten().flatten().flatten().copied().collect();
        want.extend(single.iter().flatten());
        assert_eq!(bits_of(&b.coords), bits_of(&want));
        assert_eq!(b.vertices(), 15 + 3);
        assert_eq!(
            b.part_offsets,
            vec![0, 2, 5, 7, 9, 11, 15, 18],
            "one offset per part, in vertices: parts of 2, 3, 2, 2, 2, 4 and 3"
        );
        assert_eq!(
            b.geom_offsets,
            vec![0, 2, 3, 6, 7],
            "one offset per row, in parts: rows of 2, 1, 3 and 1 parts"
        );
    }

    /// LE-6. RECORDED MUTATION: delete the part-type check (`part_type != WKB_LINESTRING`) in
    /// `MultiLineStringBuilder::decode` (applied as `if false && part_type != WKB_LINESTRING`). A
    /// part typed 1 is then read as a line body and this test fails by name where it expects the
    /// refusal to name the part's type.
    ///
    /// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
    /// `each_unreadable_multilinestring_row_is_a_typed_refusal_and_mixed_byte_orders_decode` FAILED
    /// with the mutation applied, at `expected a typed Wkb refusal, got Ok(())`, for the first part
    /// typed other than 2, then reverted.
    #[test]
    fn each_unreadable_multilinestring_row_is_a_typed_refusal_and_mixed_byte_orders_decode() {
        let line = || encode_linestring(&[[1.0, 2.0], [3.0, 4.0]]);
        let multi = |count: u32, parts: &[Vec<u8>]| {
            let mut w = vec![1u8];
            w.extend_from_slice(&WKB_MULTILINESTRING.to_le_bytes());
            w.extend_from_slice(&count.to_le_bytes());
            for p in parts {
                w.extend_from_slice(p);
            }
            w
        };

        // Zero parts.
        let d = multiline_refusal(&multi(0, &[]));
        assert!(d.starts_with("[P6 placeholder] "), "{d}");
        assert!(d.contains("zero parts"), "{d}");

        // A part of one position, and a part of none.
        let d = multiline_refusal(&multi(2, &[line(), encode_linestring(&[[5.0, 6.0]])]));
        assert!(d.contains("part 1 has 1 positions"), "{d}");
        let d = multiline_refusal(&multi(1, &[encode_linestring(&[])]));
        assert!(d.contains("part 0 has 0 positions"), "{d}");

        // A part typed 1, 3 or 5, each naming the type met.
        for code in [1u32, 3, 5, 1002] {
            let mut part = line();
            part[1..5].copy_from_slice(&code.to_le_bytes());
            let d = multiline_refusal(&multi(2, &[line(), part]));
            assert!(
                d.contains(&format!("part 1 has WKB geometry type {code}")),
                "{code}: {d}"
            );
        }

        // An EWKB-flagged part, and a flagged header.
        let mut flagged = line();
        flagged[1..5].copy_from_slice(&(WKB_LINESTRING | EWKB_SRID_FLAG).to_le_bytes());
        let d = multiline_refusal(&multi(1, &[flagged]));
        assert!(d.contains("part 0 carries EWKB flags"), "{d}");
        let mut flagged_header = multi(1, &[line()]);
        flagged_header[1..5].copy_from_slice(&(WKB_MULTILINESTRING | EWKB_Z_FLAG).to_le_bytes());
        assert!(multiline_refusal(&flagged_header).contains("EWKB flags"));

        // A type that is neither 2 nor 5, naming the type met, the encoding included.
        for code in [1u32, 3, 6, 1005] {
            let mut other = line();
            other[1..5].copy_from_slice(&code.to_le_bytes());
            let d = multiline_refusal(&other);
            assert!(d.contains(&format!("geometry type {code} met")), "{d}");
            assert!(d.contains(EXT_NAME_MULTILINESTRING), "{d}");
        }

        // Trailing bytes, and truncation.
        let mut trailing = multi(1, &[line()]);
        trailing.push(0xAA);
        assert!(multiline_refusal(&trailing).contains("1 trailing bytes"));
        let full = multi(2, &[line(), line()]);
        assert!(multiline_refusal(&full[..full.len() - 3]).contains("truncated"));

        // Mixed byte orders decode: a big-endian part inside a little-endian row, and back.
        let mut be_part = vec![0u8];
        be_part.extend_from_slice(&WKB_LINESTRING.to_be_bytes());
        be_part.extend_from_slice(&2u32.to_be_bytes());
        for v in [9.5_f64, 10.25, 11.0, 12.75] {
            be_part.extend_from_slice(&v.to_be_bytes());
        }
        let mut b = MultiLineStringBuilder::new();
        b.push_wkb(&multi(3, &[line(), be_part, line()])).unwrap();
        assert_eq!(
            bits_of(&b.coords),
            bits_of(&[1.0, 2.0, 3.0, 4.0, 9.5, 10.25, 11.0, 12.75, 1.0, 2.0, 3.0, 4.0])
        );
        assert_eq!(b.part_offsets, vec![0, 2, 4, 6]);
        assert_eq!(b.geom_offsets, vec![0, 3]);
    }
}
