//! Parsing of the GeoParquet `geo` file-level metadata.
//!
//! Pure functions over the JSON document, kept apart from the DuckDB read so the admission rules
//! can be tested without a database. What this file establishes — CRS identity, the CRS definition,
//! axis order, the covering bbox column — is what `crs.rs` then admits or refuses.
//!
//! **One deliberate deviation from the GeoParquet specification, stated where a reader will find
//! it:** the spec says an *absent* `crs` key means OGC:CRS84. This engine does not apply that
//! default. A CRS the file does not state is a CRS this engine does not have (`docs/05`, no silent
//! conversion; `docs/01` principle 8). The refusal is typed and tells the caller exactly this.

use serde_json::Value;

use crate::crs::AxisOrder;
use crate::error::{EngineError, Result};

/// The path to one covering-bbox component, e.g. `["bbox", "xmin"]`.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct FieldPath(pub Vec<String>);

impl FieldPath {
    /// Renders the path as a SQL column reference. Every segment is a quoted identifier, so a
    /// column named `"; DROP` is a column name and not a statement.
    pub fn to_sql(&self) -> String {
        self.0
            .iter()
            .map(|seg| format!("\"{}\"", seg.replace('"', "\"\"")))
            .collect::<Vec<_>>()
            .join(".")
    }
}

#[derive(Clone, Debug)]
pub struct CoveringBbox {
    pub xmin: FieldPath,
    pub ymin: FieldPath,
    pub xmax: FieldPath,
    pub ymax: FieldPath,
}

/// What the file says about its primary geometry column.
#[derive(Clone, Debug)]
pub struct GeoMeta {
    pub version: String,
    pub primary_column: String,
    pub encoding: String,
    pub geometry_types: Vec<String>,
    /// `(identifier, definition_json, axis_order)` — `None` when the file declares no CRS.
    pub declared_crs: Option<(String, Option<String>, AxisOrder)>,
    pub covering: Option<CoveringBbox>,
}

impl GeoMeta {
    pub fn parse(json: &str) -> Result<Self> {
        let root: Value = serde_json::from_str(json)
            .map_err(|e| EngineError::GeoMetadata(format!("`geo` is not JSON: {e}")))?;

        let version = root
            .get("version")
            .and_then(Value::as_str)
            .ok_or_else(|| EngineError::GeoMetadata("`geo.version` missing".into()))?
            .to_string();

        let primary_column = root
            .get("primary_column")
            .and_then(Value::as_str)
            .ok_or_else(|| EngineError::GeoMetadata("`geo.primary_column` missing".into()))?
            .to_string();

        let col = root
            .get("columns")
            .and_then(|c| c.get(&primary_column))
            .ok_or_else(|| {
                EngineError::GeoMetadata(format!(
                    "`geo.columns.{primary_column}` missing, but it is named as the primary column"
                ))
            })?;

        let encoding = col
            .get("encoding")
            .and_then(Value::as_str)
            .ok_or_else(|| EngineError::GeoMetadata("`geo.columns.*.encoding` missing".into()))?
            .to_string();

        let geometry_types = col
            .get("geometry_types")
            .and_then(Value::as_array)
            .map(|a| a.iter().filter_map(Value::as_str).map(str::to_string).collect())
            .unwrap_or_default();

        // Three distinguishable states, only one of which is "the file declares a CRS":
        //   key present and an object -> declared
        //   key present and null      -> the spec's "no CRS" -> not declared
        //   key absent                -> the spec's OGC:CRS84 default -> NOT applied; not declared
        let declared_crs = match col.get("crs") {
            Some(Value::Object(_)) => {
                let crs = col.get("crs").unwrap();
                let axis = axis_order_from_projjson(crs)?;
                Some((
                    identifier_from_projjson(crs),
                    Some(crs.to_string()),
                    axis,
                ))
            }
            _ => None,
        };

        let covering = col.get("covering").and_then(|c| c.get("bbox")).map(parse_covering).transpose()?;

        Ok(Self { version, primary_column, encoding, geometry_types, declared_crs, covering })
    }
}

fn parse_covering(bbox: &Value) -> Result<CoveringBbox> {
    let one = |k: &str| -> Result<FieldPath> {
        let arr = bbox
            .get(k)
            .and_then(Value::as_array)
            .ok_or_else(|| EngineError::GeoMetadata(format!("`covering.bbox.{k}` missing")))?;
        let segs: Vec<String> = arr.iter().filter_map(Value::as_str).map(str::to_string).collect();
        if segs.is_empty() || segs.len() != arr.len() {
            return Err(EngineError::GeoMetadata(format!(
                "`covering.bbox.{k}` is not a path of strings"
            )));
        }
        Ok(FieldPath(segs))
    };
    Ok(CoveringBbox { xmin: one("xmin")?, ymin: one("ymin")?, xmax: one("xmax")?, ymax: one("ymax")? })
}

/// `EPSG:2056` when the definition carries an authority id; otherwise an explicit marker.
///
/// Never derived from the CRS *name*. `docs/05`: two datasets labelled "CH1903+ / LV95" may carry
/// different definitions, so a name is not an identity. When there is no id, the identifier says so
/// and the full definition travels alongside it.
pub fn identifier_from_projjson(crs: &Value) -> String {
    match (
        crs.get("id").and_then(|i| i.get("authority")).and_then(Value::as_str),
        crs.get("id").and_then(|i| i.get("code")),
    ) {
        (Some(auth), Some(code)) => match code {
            Value::String(s) => format!("{auth}:{s}"),
            Value::Number(n) => format!("{auth}:{n}"),
            _ => crate::crs::DEFINITION_ONLY.to_string(),
        },
        _ => crate::crs::DEFINITION_ONLY.to_string(),
    }
}

/// Axis order **established from the file's own definition**, or a typed refusal.
///
/// ADR-010 rule 1 wants the envelope to name the space it carries. A hardcoded `easting,northing`
/// would satisfy the letter and record nothing, so the order is read out of the PROJJSON
/// coordinate system — and when the definition does not contain one, the dataset is refused rather
/// than tagged with a guess (`docs/05`: "the normalization performed is recorded").
pub fn axis_order_from_projjson(crs: &Value) -> Result<AxisOrder> {
    let axes = crs
        .get("coordinate_system")
        .and_then(|cs| cs.get("axis"))
        .and_then(Value::as_array)
        .ok_or_else(|| EngineError::AxisOrderUnestablished {
            detail: "PROJJSON carries no `coordinate_system.axis`".into(),
        })?;

    if axes.len() < 2 {
        return Err(EngineError::AxisOrderUnestablished {
            detail: format!("PROJJSON declares {} axis/axes", axes.len()),
        });
    }

    let dir = |i: usize| axes[i].get("direction").and_then(Value::as_str).unwrap_or("").to_ascii_lowercase();
    let name = |i: usize| axes[i].get("name").and_then(Value::as_str).unwrap_or("").to_ascii_lowercase();

    let geographic = name(0).contains("longitude")
        || name(0).contains("latitude")
        || name(1).contains("longitude")
        || name(1).contains("latitude");

    match (dir(0).as_str(), dir(1).as_str()) {
        ("east", "north") => Ok(if geographic { AxisOrder::LongitudeLatitude } else { AxisOrder::EastingNorthing }),
        ("north", "east") => Ok(if geographic { AxisOrder::LatitudeLongitude } else { AxisOrder::NorthingEasting }),
        (a, b) => Err(EngineError::AxisOrderUnestablished {
            detail: format!("axis directions ({a}, {b}) are not a planar east/north pair"),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const LV95: &str = include_str!("../tests/data/epsg2056.projjson");

    fn geo_doc(crs_fragment: &str) -> String {
        format!(
            r#"{{"version":"1.1.0","primary_column":"geometry","columns":{{"geometry":{{
                 "encoding":"WKB","geometry_types":["Polygon"]{crs_fragment},
                 "covering":{{"bbox":{{"xmin":["bbox","xmin"],"ymin":["bbox","ymin"],
                                       "xmax":["bbox","xmax"],"ymax":["bbox","ymax"]}}}}}}}}}}"#
        )
    }

    #[test]
    fn a_declared_crs_yields_identifier_definition_and_axis_order() {
        let doc = geo_doc(&format!(",\"crs\":{LV95}"));
        let m = GeoMeta::parse(&doc).unwrap();
        let (id, def, axis) = m.declared_crs.unwrap();
        assert_eq!(id, "EPSG:2056");
        assert!(def.unwrap().contains("coordinate_system"));
        assert_eq!(axis, AxisOrder::EastingNorthing);
        assert_eq!(m.encoding, "WKB");
    }

    #[test]
    fn an_absent_crs_key_is_not_silently_ogc_crs84() {
        // The GeoParquet spec's default. Not applied: see the module comment.
        let m = GeoMeta::parse(&geo_doc("")).unwrap();
        assert!(m.declared_crs.is_none());
    }

    #[test]
    fn an_explicit_null_crs_is_not_a_declaration_either() {
        let m = GeoMeta::parse(&geo_doc(",\"crs\":null")).unwrap();
        assert!(m.declared_crs.is_none());
    }

    #[test]
    fn a_definition_without_a_coordinate_system_is_refused_not_guessed() {
        let doc = geo_doc(r#","crs":{"type":"ProjectedCRS","name":"CH1903+ / LV95","id":{"authority":"EPSG","code":2056}}"#);
        let e = GeoMeta::parse(&doc).unwrap_err();
        assert!(matches!(e, EngineError::AxisOrderUnestablished { .. }));
    }

    #[test]
    fn a_definition_without_an_id_is_not_identified_by_its_name() {
        let doc = geo_doc(
            r#","crs":{"type":"ProjectedCRS","name":"CH1903+ / LV95","coordinate_system":{"axis":[
                 {"name":"Easting","abbreviation":"E","direction":"east"},
                 {"name":"Northing","abbreviation":"N","direction":"north"}]}}"#,
        );
        let m = GeoMeta::parse(&doc).unwrap();
        let (id, _, _) = m.declared_crs.unwrap();
        assert_eq!(id, "(definition-only)");
    }

    #[test]
    fn latitude_first_geographic_axes_are_established_as_such() {
        let doc = geo_doc(
            r#","crs":{"type":"GeographicCRS","name":"WGS 84","coordinate_system":{"axis":[
                 {"name":"Geodetic latitude","abbreviation":"Lat","direction":"north"},
                 {"name":"Geodetic longitude","abbreviation":"Lon","direction":"east"}]},
                 "id":{"authority":"EPSG","code":4326}}"#,
        );
        let m = GeoMeta::parse(&doc).unwrap();
        let (_, _, axis) = m.declared_crs.unwrap();
        assert_eq!(axis, AxisOrder::LatitudeLongitude);
        assert!(!axis.is_x_first(), "the EPSG:4326 trap must not read as x-first");
    }

    #[test]
    fn covering_paths_render_as_quoted_sql_identifiers() {
        let m = GeoMeta::parse(&geo_doc(&format!(",\"crs\":{LV95}"))).unwrap();
        let c = m.covering.unwrap();
        assert_eq!(c.xmin.to_sql(), "\"bbox\".\"xmin\"");
        assert_eq!(FieldPath(vec!["we\"ird".into()]).to_sql(), "\"we\"\"ird\"");
    }
}
