//! GeoArrow polygon assembly, and the check that the claimed encoding matches the data.
//!
//! Layout (GeoArrow, interleaved coordinates):
//!
//! ```text
//! List<rings: List<vertices: FixedSizeList<xy: double>[2]>>
//! ```
//!
//! Variable-width by construction — the offsets differ per feature and per ring, which is the
//! shape the transport work had not yet met (the bake-off's payload was three fixed-width columns).

use std::collections::HashMap;
use std::sync::Arc;

use arrow::array::{Array, ArrayRef, FixedSizeListArray, Float64Array, ListArray};
use arrow::buffer::{OffsetBuffer, ScalarBuffer};
use arrow::datatypes::{DataType, Field, FieldRef};

use crate::crs::{CrsSource, DatasetCrs};
use crate::error::{EngineError, Result};
use crate::wkb::PolygonBuilder;

pub const EXT_NAME_POLYGON: &str = "geoarrow.polygon";

/// Arrow's conventional extension-type keys. The geometry column is a GeoArrow extension type, so
/// a reader that knows GeoArrow gets the CRS from the field itself, without knowing anything about
/// this engine's own envelope keys.
pub const EXT_NAME_KEY: &str = "ARROW:extension:name";
pub const EXT_META_KEY: &str = "ARROW:extension:metadata";

fn coord_field() -> FieldRef {
    Arc::new(Field::new("xy", DataType::Float64, false))
}

fn vertices_field() -> FieldRef {
    Arc::new(Field::new("vertices", DataType::FixedSizeList(coord_field(), 2), false))
}

fn rings_field() -> FieldRef {
    Arc::new(Field::new("rings", DataType::List(vertices_field()), false))
}

/// The storage type a `geoarrow.polygon` column must have.
pub fn polygon_storage_type() -> DataType {
    DataType::List(rings_field())
}

/// Build the GeoArrow polygon array from decoded rings.
pub fn build_polygon_array(b: PolygonBuilder) -> Result<ArrayRef> {
    let n_coords = b.coords.len();
    if !n_coords.is_multiple_of(2) {
        return Err(EngineError::Arrow(format!("coordinate buffer has odd length {n_coords}")));
    }

    let flat = Float64Array::from(b.coords);
    let coords = FixedSizeListArray::try_new(coord_field(), 2, Arc::new(flat), None)
        .map_err(|e| EngineError::Arrow(format!("coordinates: {e}")))?;

    let rings = ListArray::try_new(
        vertices_field(),
        OffsetBuffer::new(ScalarBuffer::from(b.ring_offsets)),
        Arc::new(coords),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("rings: {e}")))?;

    let polygons = ListArray::try_new(
        rings_field(),
        OffsetBuffer::new(ScalarBuffer::from(b.geom_offsets)),
        Arc::new(rings),
        None,
    )
    .map_err(|e| EngineError::Arrow(format!("polygons: {e}")))?;

    Ok(Arc::new(polygons))
}

/// The geometry field, carrying the GeoArrow extension name and the CRS **as the file states it**.
///
/// When the file declared a CRS, its own PROJJSON travels verbatim (`crs_type: projjson`) — the
/// definition, not a name. When the CRS was asserted by the caller for a file that declared none,
/// what travels is the assertion, marked as such (`crs_type: authority_code`), so a consumer can
/// tell a file fact from a caller's claim without asking this engine.
pub fn geometry_field(name: &str, crs: &DatasetCrs) -> FieldRef {
    let mut md = HashMap::new();
    md.insert(EXT_NAME_KEY.to_string(), EXT_NAME_POLYGON.to_string());

    let crs_meta = match (crs.definition_json(), crs.source()) {
        (Some(def), _) => format!(r#"{{"crs":{def},"crs_type":"projjson"}}"#),
        (None, CrsSource::CallerAsserted) => {
            format!(r#"{{"crs":"{}","crs_type":"authority_code"}}"#, escape(crs.identifier()))
        }
        (None, CrsSource::File) => {
            format!(r#"{{"crs":"{}","crs_type":"authority_code"}}"#, escape(crs.identifier()))
        }
    };
    md.insert(EXT_META_KEY.to_string(), crs_meta);

    Arc::new(Field::new(name, polygon_storage_type(), false).with_metadata(md))
}

fn escape(s: &str) -> String {
    s.replace('\\', "\\\\").replace('"', "\\\"")
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
        vec![vec![[x, y], [x + 1.0, y], [x + 1.0, y + 1.0], [x, y + 1.0], [x, y]]]
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
        let f = geometry_field("geometry", &crs);
        assert_eq!(f.metadata().get(EXT_NAME_KEY).unwrap(), EXT_NAME_POLYGON);
        let meta = f.metadata().get(EXT_META_KEY).unwrap();
        assert!(meta.contains("\"crs_type\":\"projjson\""));
        assert!(meta.contains("Bessel 1841"), "the definition travels, not just the code");
    }
}
