// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! GeoArrow polygon and multipolygon assembly, and the check that the claimed encoding matches the
//! data.
//!
//! Layouts (GeoArrow, interleaved coordinates). Which one a dataset travels in is fixed at open, from
//! the file's declared `geometry_types` (ADR-034 Decision 2), and never varies per batch or stream:
//!
//! ```text
//! geoarrow.polygon       List<rings: List<vertices: FixedSizeList<xy: double>[2]>>
//! geoarrow.multipolygon  List<polygons: List<rings: List<vertices: FixedSizeList<xy: double>[2]>>>
//! ```
//!
//! Variable-width by construction — the offsets differ per feature and per ring, which is the
//! shape the transport work had not yet met (the bake-off's payload was three fixed-width columns).
//! The multipolygon encoding adds one offsets buffer and appends each coordinate once.

use std::collections::HashMap;
use std::sync::Arc;

use arrow::array::{Array, ArrayRef, FixedSizeListArray, Float64Array, ListArray};
use arrow::buffer::{OffsetBuffer, ScalarBuffer};
use arrow::datatypes::{DataType, Field, FieldRef};

use crate::crs::DatasetCrs;
use crate::error::{EngineError, Result};
use crate::wkb::{MultiPolygonBuilder, PolygonBuilder};

pub const EXT_NAME_POLYGON: &str = "geoarrow.polygon";
pub const EXT_NAME_MULTIPOLYGON: &str = "geoarrow.multipolygon";

/// The GeoArrow encoding a dataset's geometry travels in: **a fact of the open** (ADR-034
/// Decision 2), chosen from the file's declared `geometry_types` and the same for the envelope,
/// `describe` and every batch of every stream.
///
/// `encoding` is the engine's fact. A file's own declaration is a separate one
/// ([`crate::Dataset::declared_geometry_types`]), and neither is ever presented as the other
/// (Decision 3's rider).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GeometryEncoding {
    /// `geoarrow.polygon`: a declared set of exactly Polygon.
    Polygon,
    /// `geoarrow.multipolygon`: a declared set that includes MultiPolygon, or an empty or absent
    /// declaration. A Polygon row is then a one-part MultiPolygon.
    MultiPolygon,
}

impl GeometryEncoding {
    /// The GeoArrow extension name, as it travels on the geometry field, in the envelope's
    /// `geometry_encoding` key and in `describe`.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Polygon => EXT_NAME_POLYGON,
            Self::MultiPolygon => EXT_NAME_MULTIPOLYGON,
        }
    }
}

/// **The readable geometry types, declared once per engine release** (ADR-034 Decision 1), in the
/// order the refusal text states them. The admission gate and that text both read this, so the text
/// can never state a set the gate does not admit.
pub(crate) const READABLE_GEOMETRY_TYPES: [&str; 2] = ["Polygon", "MultiPolygon"];

/// The readable set as prose: `A and B`, or `A, B and C`.
fn readable_set_phrase() -> String {
    match READABLE_GEOMETRY_TYPES.split_last() {
        Some((last, [])) => (*last).to_string(),
        Some((last, rest)) => format!("{} and {last}", rest.join(", ")),
        None => String::new(),
    }
}

/// The encoding a file's declared `geometry_types` selects, or the refusal (ADR-034 Decisions 2
/// and 7). Type names compare case-insensitively.
///
/// - a set whose members are all `Polygon` gives [`GeometryEncoding::Polygon`];
/// - a non-empty set within the readable set that includes `MultiPolygon` gives
///   [`GeometryEncoding::MultiPolygon`];
/// - an explicit empty list, **or an absent key** (`None`), gives [`GeometryEncoding::MultiPolygon`];
/// - any member outside the readable set, mixed kinds and Z or M names included, is refused as
///   `EngineError::GeoMetadata` with Decision 4's sighted wording, the declared list rendered as
///   `{:?}` renders it and the readable set read from [`READABLE_GEOMETRY_TYPES`].
pub(crate) fn encoding_for_declared_types(declared: Option<&[String]>) -> Result<GeometryEncoding> {
    let types = match declared {
        None | Some([]) => return Ok(GeometryEncoding::MultiPolygon),
        Some(types) => types,
    };
    let readable = |t: &String| {
        READABLE_GEOMETRY_TYPES
            .iter()
            .any(|r| r.eq_ignore_ascii_case(t))
    };
    if !types.iter().all(readable) {
        return Err(EngineError::GeoMetadata(format!(
            "geometry_types {types:?} include types this engine does not read; it reads {}",
            readable_set_phrase()
        )));
    }
    if types.iter().all(|t| t.eq_ignore_ascii_case("Polygon")) {
        Ok(GeometryEncoding::Polygon)
    } else {
        Ok(GeometryEncoding::MultiPolygon)
    }
}

/// Arrow's conventional extension-type keys. The geometry column is a GeoArrow extension type, so
/// a reader that knows GeoArrow gets the CRS from the field itself, without knowing anything about
/// this engine's own envelope keys.
pub const EXT_NAME_KEY: &str = "ARROW:extension:name";
pub const EXT_META_KEY: &str = "ARROW:extension:metadata";

fn coord_field() -> FieldRef {
    Arc::new(Field::new("xy", DataType::Float64, false))
}

fn vertices_field() -> FieldRef {
    Arc::new(Field::new(
        "vertices",
        DataType::FixedSizeList(coord_field(), 2),
        false,
    ))
}

fn rings_field() -> FieldRef {
    Arc::new(Field::new("rings", DataType::List(vertices_field()), false))
}

fn polygons_field() -> FieldRef {
    Arc::new(Field::new("polygons", DataType::List(rings_field()), false))
}

/// The storage type a `geoarrow.polygon` column must have.
pub fn polygon_storage_type() -> DataType {
    DataType::List(rings_field())
}

/// The storage type a `geoarrow.multipolygon` column must have.
pub(crate) fn multipolygon_storage_type() -> DataType {
    DataType::List(polygons_field())
}

/// The storage type the open's encoding names.
fn storage_type(encoding: GeometryEncoding) -> DataType {
    match encoding {
        GeometryEncoding::Polygon => polygon_storage_type(),
        GeometryEncoding::MultiPolygon => multipolygon_storage_type(),
    }
}

/// Build the GeoArrow multipolygon array from decoded geometries: three offset levels (geometry,
/// part, ring) over one interleaved coordinate run, each checked rather than asserted.
pub(crate) fn build_multipolygon_array(b: MultiPolygonBuilder) -> Result<ArrayRef> {
    let n_coords = b.coords.len();
    if !n_coords.is_multiple_of(2) {
        return Err(EngineError::Arrow(format!(
            "coordinate buffer has odd length {n_coords}"
        )));
    }

    let flat = Float64Array::from(b.coords);
    let coords = FixedSizeListArray::try_new(coord_field(), 2, Arc::new(flat), None)
        .map_err(|e| EngineError::Arrow(format!("coordinates: {e}")))?;

    let rings = ListArray::try_new(
        vertices_field(),
        checked_offsets(b.ring_offsets, "ring offsets")?,
        Arc::new(coords),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("rings: {e}")))?;

    let polygons = ListArray::try_new(
        rings_field(),
        checked_offsets(b.part_offsets, "part offsets")?,
        Arc::new(rings),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("polygons: {e}")))?;

    let multipolygons = ListArray::try_new(
        polygons_field(),
        checked_offsets(b.geom_offsets, "geometry offsets")?,
        Arc::new(polygons),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("multipolygons: {e}")))?;

    Ok(Arc::new(multipolygons))
}

/// Build the GeoArrow polygon array from decoded rings.
pub fn build_polygon_array(b: PolygonBuilder) -> Result<ArrayRef> {
    let n_coords = b.coords.len();
    if !n_coords.is_multiple_of(2) {
        return Err(EngineError::Arrow(format!(
            "coordinate buffer has odd length {n_coords}"
        )));
    }

    let flat = Float64Array::from(b.coords);
    let coords = FixedSizeListArray::try_new(coord_field(), 2, Arc::new(flat), None)
        .map_err(|e| EngineError::Arrow(format!("coordinates: {e}")))?;

    let rings = ListArray::try_new(
        vertices_field(),
        checked_offsets(b.ring_offsets, "ring offsets")?,
        Arc::new(coords),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("rings: {e}")))?;

    let polygons = ListArray::try_new(
        rings_field(),
        checked_offsets(b.geom_offsets, "geometry offsets")?,
        Arc::new(rings),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("polygons: {e}")))?;

    Ok(Arc::new(polygons))
}

/// The geometry field, carrying the GeoArrow extension name and whatever CRS the dataset carries.
///
/// **This field says what the CRS *is*, not where it came from.** A definition travels verbatim as
/// `crs_type: projjson`; a bare identifier travels as `crs_type: authority_code`. Both forms occur
/// for both a file fact and a caller's assertion — a caller who supplies a definition produces
/// output byte-identical to a file that declared the same one, and that is correct: GeoArrow's
/// field metadata is a CRS carrier, not a provenance carrier.
///
/// The file-fact-versus-claim distinction lives on the **schema-level `crs_source` key** written by
/// `envelope.rs`, and only there. An earlier version of this comment claimed the two `crs_type`
/// values carried it, which was never true of the `Some(definition)` path and gave a reader licence
/// to infer provenance from a field that does not carry it.
pub fn geometry_field(name: &str, crs: &DatasetCrs, encoding: GeometryEncoding) -> FieldRef {
    let mut md = HashMap::new();
    md.insert(EXT_NAME_KEY.to_string(), encoding.as_str().to_string());

    let crs_meta = match crs.definition_json() {
        Some(def) => format!(r#"{{"crs":{def},"crs_type":"projjson"}}"#),
        None => {
            format!(
                r#"{{"crs":{},"crs_type":"authority_code"}}"#,
                json_string(crs.identifier())
            )
        }
    };
    md.insert(EXT_META_KEY.to_string(), crs_meta);

    Arc::new(Field::new(name, storage_type(encoding), false).with_metadata(md))
}

/// Build an `OffsetBuffer`, checking the invariant instead of asserting it.
///
/// **`OffsetBuffer::new` panics on non-monotonic offsets, and arrow-buffer 58 exposes no checked
/// constructor** — `try_new` arrived later. These offsets are accumulated from `as i32`
/// truncations over ring and part counts read out of untrusted WKB, so the one input that could
/// violate the invariant is the one input this engine does not control. A panic here would take
/// the producer thread with it and turn a malformed file into a lost stream instead of a typed
/// refusal.
fn checked_offsets(v: Vec<i32>, what: &str) -> Result<OffsetBuffer<i32>> {
    match v.first() {
        None => return Err(EngineError::Arrow(format!("{what}: buffer is empty"))),
        Some(&first) if first != 0 => {
            return Err(EngineError::Arrow(format!(
                "{what}: start at {first}, not 0"
            )))
        }
        Some(_) => {}
    }
    if let Some(w) = v.windows(2).find(|w| w[1] < w[0]) {
        return Err(EngineError::Arrow(format!(
            "{what}: not monotonically increasing ({} then {})",
            w[0], w[1]
        )));
    }
    Ok(OffsetBuffer::new(ScalarBuffer::from(v)))
}

/// JSON-quote a string, escaping **everything** JSON requires — including the C0 control characters
/// a hand-rolled quote-and-backslash pair passes through untouched.
///
/// `crs.identifier()` is assembled from the `authority` and `code` strings read straight out of the
/// file's PROJJSON, so it is untrusted input on every stream's schema. A raw control byte inside a
/// JSON string is invalid JSON, and `ARROW:extension:metadata` that will not parse is a batch no
/// GeoArrow-aware reader can use — the same defect the evidence-artifact escaping fix closed one
/// file over, on the path that actually ships.
fn json_string(s: &str) -> String {
    // Serializing a `&str` cannot fail. The fallback exists so this returns valid JSON even if that
    // ever stops being true, rather than unwrapping on a hot path.
    serde_json::to_string(s).unwrap_or_else(|_| String::from(r#""""#))
}

/// The interleaved `x, y, x, y…` run this array's features actually occupy.
///
/// **Walks the offsets rather than reaching for the flat child buffer**, because the two are not the
/// same thing the moment an array has been sliced: `values()` returns the whole child, including
/// coordinates belonging to features outside the slice window. Reading them would put vertices from
/// rows that are not in this batch into any bound computed from it — a wrong-but-plausible extent,
/// with nothing raised.
///
/// Walks either nesting: polygon (geometry → rings → vertices) or multipolygon (geometry → parts →
/// rings → vertices), by offsets at every level.
///
/// Returns `None` when the array is neither or the nesting cannot be walked; the caller treats that
/// as "no bound established", never as an empty one.
pub fn coordinate_values(array: &ArrayRef) -> Option<&[f64]> {
    let geoms = array.as_any().downcast_ref::<ListArray>()?;
    let geom_offsets = geoms.value_offsets();
    let lo = *geom_offsets.first()? as usize;
    let hi = *geom_offsets.last()? as usize;

    // The geometry's children are rings (polygon) or parts (multipolygon): which one is read off
    // the array's own shape, never off a flag.
    let level = geoms.values().as_any().downcast_ref::<ListArray>()?;
    let (ring_lo, ring_hi, rings) = match level.values().as_any().downcast_ref::<ListArray>() {
        // Multipolygon: the level just read is the parts; one more offsets walk reaches the rings.
        Some(rings) => {
            let part_offsets = level.value_offsets();
            (
                *part_offsets.get(lo)? as usize,
                *part_offsets.get(hi)? as usize,
                rings,
            )
        }
        None => (lo, hi, level),
    };
    let ring_offsets = rings.value_offsets();
    let vertex_lo = *ring_offsets.get(ring_lo)? as usize;
    let vertex_hi = *ring_offsets.get(ring_hi)? as usize;

    let fsl = rings
        .values()
        .as_any()
        .downcast_ref::<FixedSizeListArray>()?;
    let flat = fsl.values().as_any().downcast_ref::<Float64Array>()?;
    flat.values().get(vertex_lo * 2..vertex_hi * 2)
}

/// Assert that what was built is what is being claimed.
///
/// ADR-010 rule 1's tag rides on the envelope; a tag nobody checks against the data is decoration.
/// This runs on the first batch of every stream, so a geometry column that is not in fact a
/// 2-dimensional polygon array fails the stream instead of travelling under a `geoarrow.polygon`
/// label.
pub fn validate_polygon_encoding(array: &ArrayRef) -> Result<()> {
    let found = array.data_type();
    let want = polygon_storage_type();

    let describe = |dt: &DataType| -> String {
        match dt {
            DataType::List(f) => match f.data_type() {
                DataType::List(g) => match g.data_type() {
                    DataType::FixedSizeList(c, n) => {
                        format!("List<List<FixedSizeList<{}>[{}]>>", c.data_type(), n)
                    }
                    other => format!("List<List<{other}>>"),
                },
                other => format!("List<{other}>"),
            },
            other => format!("{other}"),
        }
    };

    // Compare structure, not field names: Arrow field naming inside nested types is not what makes
    // this array a polygon array. Nesting depth and coordinate dimensionality are.
    let structural_eq = match (found, &want) {
        (DataType::List(f1), DataType::List(f2)) => match (f1.data_type(), f2.data_type()) {
            (DataType::List(g1), DataType::List(g2)) => {
                matches!(
                    (g1.data_type(), g2.data_type()),
                    (DataType::FixedSizeList(c1, n1), DataType::FixedSizeList(c2, n2))
                        if n1 == n2 && c1.data_type() == c2.data_type()
                )
            }
            _ => false,
        },
        _ => false,
    };

    if !structural_eq {
        return Err(EngineError::EncodingMismatch {
            claimed: format!("{EXT_NAME_POLYGON} as {}", describe(&want)),
            found: describe(found),
        });
    }
    Ok(())
}

/// The same check for `geoarrow.multipolygon`: three list levels over a 2-dimensional coordinate.
pub(crate) fn validate_multipolygon_encoding(array: &ArrayRef) -> Result<()> {
    let found = array.data_type();
    let want = multipolygon_storage_type();

    // Structure, not field names, as for polygons: nesting depth and dimensionality are what make
    // this array a multipolygon array.
    let structural_eq = match found {
        DataType::List(geoms) => match geoms.data_type() {
            DataType::List(parts) => match parts.data_type() {
                DataType::List(rings) => matches!(
                    rings.data_type(),
                    DataType::FixedSizeList(c, 2) if c.data_type() == &DataType::Float64
                ),
                _ => false,
            },
            _ => false,
        },
        _ => false,
    };

    if !structural_eq {
        return Err(EngineError::EncodingMismatch {
            claimed: format!("{EXT_NAME_MULTIPOLYGON} as {}", describe_nesting(&want)),
            found: describe_nesting(found),
        });
    }
    Ok(())
}

/// Validate against the open's encoding — the one the envelope claims.
pub(crate) fn validate_encoding(array: &ArrayRef, encoding: GeometryEncoding) -> Result<()> {
    match encoding {
        GeometryEncoding::Polygon => validate_polygon_encoding(array),
        GeometryEncoding::MultiPolygon => validate_multipolygon_encoding(array),
    }
}

/// A nesting as `List<List<FixedSizeList<Float64>[2]>>`, to any depth.
fn describe_nesting(dt: &DataType) -> String {
    match dt {
        DataType::List(f) => format!("List<{}>", describe_nesting(f.data_type())),
        DataType::FixedSizeList(c, n) => format!("FixedSizeList<{}>[{}]", c.data_type(), n),
        other => format!("{other}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::crs::AxisOrder;
    use crate::wkb::encode_polygon;

    fn build(polys: &[Vec<Vec<[f64; 2]>>]) -> ArrayRef {
        let mut b = PolygonBuilder::new();
        for p in polys {
            b.push_wkb(&encode_polygon(p)).unwrap();
        }
        build_polygon_array(b).unwrap()
    }

    fn square(x: f64, y: f64) -> Vec<Vec<[f64; 2]>> {
        vec![vec![
            [x, y],
            [x + 1.0, y],
            [x + 1.0, y + 1.0],
            [x, y + 1.0],
            [x, y],
        ]]
    }

    #[test]
    fn built_array_has_the_geoarrow_polygon_storage_type_and_row_count() {
        let a = build(&[square(0.0, 0.0), square(5.0, 5.0)]);
        assert_eq!(a.len(), 2);
        assert_eq!(a.data_type(), &polygon_storage_type());
        validate_polygon_encoding(&a).unwrap();
    }

    #[test]
    fn coordinates_are_reachable_and_bit_exact_through_the_nesting() {
        let e = 2_600_000.5_f64;
        let n = 1_200_000.25_f64;
        let ring = vec![vec![[e, n], [e + 1.0, n], [e + 1.0, n + 1.0], [e, n]]];
        let a = build(&[ring]);

        let polys = a.as_any().downcast_ref::<ListArray>().unwrap();
        let rings = polys.value(0);
        let rings = rings.as_any().downcast_ref::<ListArray>().unwrap();
        let verts = rings.value(0);
        let verts = verts.as_any().downcast_ref::<FixedSizeListArray>().unwrap();
        let xy = verts.value(0);
        let xy = xy.as_any().downcast_ref::<Float64Array>().unwrap();
        assert_eq!(xy.value(0).to_bits(), e.to_bits());
        assert_eq!(xy.value(1).to_bits(), n.to_bits());
    }

    #[test]
    fn a_non_polygon_array_fails_the_encoding_check() {
        let flat: ArrayRef = Arc::new(Float64Array::from(vec![1.0, 2.0]));
        let e = validate_polygon_encoding(&flat).unwrap_err();
        assert!(matches!(e, EngineError::EncodingMismatch { .. }));

        // One nesting level short — a linestring-shaped array claiming to be polygons.
        let coords = FixedSizeListArray::try_new(
            coord_field(),
            2,
            Arc::new(Float64Array::from(vec![0.0, 0.0, 1.0, 1.0])),
            None,
        )
        .unwrap();
        let lines: ArrayRef = Arc::new(
            ListArray::try_new(
                vertices_field(),
                OffsetBuffer::new(ScalarBuffer::from(vec![0i32, 2])),
                Arc::new(coords),
                None,
            )
            .unwrap(),
        );
        assert!(matches!(
            validate_polygon_encoding(&lines),
            Err(EngineError::EncodingMismatch { .. })
        ));
    }

    #[test]
    fn a_file_declared_crs_travels_as_its_own_definition_not_as_a_name() {
        let def = include_str!("../tests/data/epsg2056.projjson");
        let crs = DatasetCrs::from_file(
            "EPSG:2056".into(),
            Some(def.to_string()),
            AxisOrder::EastingNorthing,
        );
        let f = geometry_field("geometry", &crs, GeometryEncoding::Polygon);
        assert_eq!(f.metadata().get(EXT_NAME_KEY).unwrap(), EXT_NAME_POLYGON);
        let meta = f.metadata().get(EXT_META_KEY).unwrap();
        assert!(meta.contains("\"crs_type\":\"projjson\""));
        assert!(
            meta.contains("Bessel 1841"),
            "the definition travels, not just the code"
        );
    }

    /// One MultiPolygon row per entry of `rows`; each entry is that row's parts, each part its rings.
    fn build_multi(rows: &[Vec<Vec<Vec<[f64; 2]>>>]) -> ArrayRef {
        let mut b = MultiPolygonBuilder::new();
        for parts in rows {
            b.push_wkb(&crate::fixture::encode_multipolygon(parts))
                .unwrap();
        }
        build_multipolygon_array(b).unwrap()
    }

    /// E-6. RECORDED MUTATION: in `validate_multipolygon_encoding`, drop the third list level from
    /// the comparison (accept `List<List<FixedSizeList>>`). It accepts a polygon array, and this
    /// test fails by name at the multipolygon validator's refusal of the polygon array.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `the_multipolygon_storage_type_is_three_lists_deep_and_each_validator_refuses_the_others_array`
    /// FAILED with the mutation applied, then reverted.
    #[test]
    fn the_multipolygon_storage_type_is_three_lists_deep_and_each_validator_refuses_the_others_array(
    ) {
        assert_eq!(
            describe_nesting(&multipolygon_storage_type()),
            "List<List<List<FixedSizeList<Float64>[2]>>>"
        );
        let DataType::List(top) = multipolygon_storage_type() else {
            panic!("not a list")
        };
        assert_eq!(top.name(), "polygons");

        let multi = build_multi(&[vec![square(0.0, 0.0), square(5.0, 5.0)]]);
        let poly = build(&[square(0.0, 0.0)]);
        assert_eq!(multi.data_type(), &multipolygon_storage_type());

        validate_multipolygon_encoding(&multi).unwrap();
        validate_polygon_encoding(&poly).unwrap();
        assert!(matches!(
            validate_multipolygon_encoding(&poly),
            Err(EngineError::EncodingMismatch { .. })
        ));
        assert!(matches!(
            validate_polygon_encoding(&multi),
            Err(EngineError::EncodingMismatch { .. })
        ));

        // The dispatch reads the open's encoding, and a flat array is neither.
        validate_encoding(&multi, GeometryEncoding::MultiPolygon).unwrap();
        validate_encoding(&poly, GeometryEncoding::Polygon).unwrap();
        assert!(validate_encoding(&multi, GeometryEncoding::Polygon).is_err());
        assert!(validate_encoding(&poly, GeometryEncoding::MultiPolygon).is_err());
        let flat: ArrayRef = Arc::new(Float64Array::from(vec![1.0, 2.0]));
        assert!(validate_multipolygon_encoding(&flat).is_err());
    }

    /// E-7. RECORDED MUTATION: in `coordinate_values`, return the whole child coordinate buffer
    /// instead of the slice `vertex_lo..vertex_hi` walks. This test fails by name at the first
    /// sliced assertion.
    ///
    /// Observed over `d8276158` on the uncommitted tree of the engine commit:
    /// `coordinate_values_over_a_sliced_multipolygon_array_returns_the_slices_run_only` FAILED with
    /// the mutation applied, then reverted.
    #[test]
    fn coordinate_values_over_a_sliced_multipolygon_array_returns_the_slices_run_only() {
        let a = build_multi(&[
            vec![square(0.0, 0.0), square(5.0, 5.0)],
            vec![square(100.0, 100.0)],
            vec![square(200.0, 200.0), square(300.0, 300.0)],
        ]);
        // Five squares of five vertices each.
        assert_eq!(coordinate_values(&a).unwrap().len(), 5 * 5 * 2);

        let middle = a.slice(1, 1);
        let run = coordinate_values(&middle).unwrap();
        assert_eq!(run.len(), 5 * 2, "one part of five vertices");
        assert_eq!(run[0], 100.0);

        let tail = a.slice(1, 2);
        let run = coordinate_values(&tail).unwrap();
        assert_eq!(run.len(), 3 * 5 * 2, "three parts across two rows");
        assert_eq!(run[0], 100.0);
        assert_eq!(
            run[run.len() - 1],
            300.0,
            "the last vertex of the last part"
        );

        // The polygon walk is unchanged and slices the same way.
        let p = build(&[square(0.0, 0.0), square(7.0, 7.0), square(9.0, 9.0)]);
        let sliced = p.slice(1, 1);
        let run = coordinate_values(&sliced).unwrap();
        assert_eq!(run.len(), 5 * 2);
        assert_eq!(run[0], 7.0);
    }
}
