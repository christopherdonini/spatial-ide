// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The batch envelope — ADR-010 rule 1's tag, made unforgeable.
//!
//! Rule 1: "A bulk buffer whose envelope does not name its frame is untagged and is in violation."
//! A test is a backstop; the mechanism is the type. `TaggedBatch` has exactly one constructor and
//! it takes a `BatchEnvelope`; `BatchEnvelope` has exactly one constructor and it takes a
//! `DatasetCrs`; `DatasetCrs` has no public constructor at all and can only come out of
//! `crs::admit`. There is no path from raw arrays to a serialized batch that skips the tag.

use std::collections::HashMap;
use std::sync::Arc;

use arrow::array::{ArrayRef, RecordBatch};
use arrow::datatypes::{DataType, Field, Schema, SchemaRef};
use arrow::ipc::writer::{IpcWriteOptions, StreamWriter};

use crate::crs::{CrsSource, DatasetCrs};
use crate::identity::DatasetIdentity;
use crate::error::{EngineError, Result};
use crate::geoarrow;

/// ADR-010 rule 1, row 1. The only coordinate a caller outside the renderer may treat as ground
/// truth, and the only frame this engine emits.
pub const FRAME_AUTHORITATIVE: &str = "authoritative-project-crs";

/// The stable-identity column (`docs/11`; ADR-010 rule 2's id indirection consumes it).
pub const ID_COLUMN: &str = "id";

#[derive(Clone, Debug)]
pub struct BatchEnvelope {
    crs: DatasetCrs,
    geometry_column: String,
    identity: DatasetIdentity,
    attributes: Vec<Field>,
    schema: SchemaRef,
}

impl BatchEnvelope {
    pub(crate) fn new(
        crs: DatasetCrs,
        geometry_column: String,
        identity: DatasetIdentity,
    ) -> Self {
        Self::with_attributes(crs, geometry_column, identity, Vec::new())
    }

    /// As [`Self::new`], carrying a **declared attribute projection** after the geometry column.
    ///
    /// The schema widens to `[id, geometry, ...attributes]` and the envelope names the projection.
    /// Nothing about the frame tag changes: `TaggedBatch` still has exactly one constructor, it
    /// still takes a `BatchEnvelope`, which still takes a `DatasetCrs` that has no public
    /// constructor — so the ADR-010 rule 1 property is untouched, and widening the schema is not a
    /// change to it.
    ///
    /// **`attribute_columns` is recorded on the authority of `docs/11` and `docs/01` principle 8,
    /// not ADR-010 rule 1.** Rule 1's tag-on-envelope clause is about *coordinate space*; citing it
    /// for a projection would enlarge an Accepted, architect-blockable rule by analogy — which is
    /// what ADR-016 §6 refuses to do for exactly this reason. `docs/11` requires a resource to carry
    /// its schema; principle 8 requires the record to say what is actually there.
    pub(crate) fn with_attributes(
        crs: DatasetCrs,
        geometry_column: String,
        identity: DatasetIdentity,
        attributes: Vec<Field>,
    ) -> Self {
        let mut md = HashMap::new();

        // The space this buffer is in (rule 1) …
        md.insert("frame".to_string(), FRAME_AUTHORITATIVE.to_string());
        md.insert("crs".to_string(), crs.identifier().to_string());
        // … where that CRS came from — a file fact and a caller's claim stay distinguishable …
        md.insert("crs_source".to_string(), crs.source().as_str().to_string());
        if crs.source() == CrsSource::CallerAsserted {
            md.insert(
                "crs_asserted_by".to_string(),
                crs.asserted_by().unwrap_or_default().to_string(),
            );
            md.insert(
                "crs_asserted_at".to_string(),
                crs.asserted_at().unwrap_or_default().to_string(),
            );
        }
        // … the axis order established from the definition, and the fact that nothing was
        // normalized to get there (docs/05: the normalization performed is recorded).
        md.insert("axis_order".to_string(), crs.axis_order().as_str().to_string());
        md.insert("axis_normalization".to_string(), "none-performed".to_string());
        // … where the feature identity came from, and **what was actually checked about it**.
        //
        // ADR-016 §6. The basis is `docs/11`'s "the ID-assignment policy is per dataset and
        // recorded in metadata" plus `docs/01` principle 8 — **not** ADR-010 rule 1, which is about
        // coordinate space. The *form* follows `crs_source` above: a caller's declaration and a
        // file fact stay distinguishable, and the record says what was verified rather than
        // asserting the word "unique".
        md.insert("id_source".to_string(), identity.source().as_envelope_value());
        md.insert("id_uniqueness".to_string(), identity.uniqueness().as_str().to_string());
        if let Some(rows) = identity.verified_rows() {
            md.insert("id_verified_rows".to_string(), rows.to_string());
        }
        // Width is part of the contract (§7): a JS consumer narrowing to `Number` is exact only
        // below 2^53, so a consumer can see from the envelope whether that would have been lossy
        // instead of discovering it per value. Absent when nothing was verified — which is the
        // honest answer, not `true`.
        if let Some(exact) = identity.js_exact() {
            md.insert("id_js_exact".to_string(), exact.to_string());
        }
        if let crate::identity::IdSource::Mapped { by, at, .. } = identity.source() {
            md.insert("id_declared_by".to_string(), by.clone());
            md.insert("id_declared_at".to_string(), at.clone());
        }

        md.insert("geometry_column".to_string(), geometry_column.clone());
        md.insert("geometry_encoding".to_string(), geoarrow::EXT_NAME_POLYGON.to_string());
        md.insert("coordinate_layout".to_string(), "interleaved-xy".to_string());

        // The declared projection, in declared order, as a JSON array of names. JSON is admissible
        // *here* and nowhere near the payload: this is schema metadata, which is already a string
        // key/value map, and ADR-004's prohibition is on JSON in the **data** path.
        md.insert(
            "attribute_columns".to_string(),
            serde_json::Value::Array(
                attributes.iter().map(|f| serde_json::Value::String(f.name().clone())).collect(),
            )
            .to_string(),
        );

        let mut fields: Vec<Arc<Field>> = Vec::with_capacity(2 + attributes.len());
        fields.push(Arc::new(Field::new(ID_COLUMN, DataType::UInt64, false)));
        fields.push(geoarrow::geometry_field(&geometry_column, &crs));
        fields.extend(attributes.iter().cloned().map(Arc::new));

        let schema = Arc::new(Schema::new_with_metadata(fields, md));

        Self { crs, geometry_column, identity, attributes, schema }
    }

    /// The declared attribute projection, in declared order. Empty on the streaming query path.
    pub fn attributes(&self) -> &[Field] {
        &self.attributes
    }

    pub fn crs(&self) -> &DatasetCrs {
        &self.crs
    }

    pub fn geometry_column(&self) -> &str {
        &self.geometry_column
    }

    pub fn identity(&self) -> &DatasetIdentity {
        &self.identity
    }

    pub fn schema(&self) -> SchemaRef {
        self.schema.clone()
    }
}

/// A batch that is tagged by construction.
#[derive(Debug)]
pub struct TaggedBatch {
    batch: RecordBatch,
}

impl TaggedBatch {
    /// **The one way to make a batch**, and still the only one now that the schema can widen — a
    /// second constructor taking "just id and geometry" would make the sentence at the top of this
    /// module false, so the empty projection is spelled `Vec::new()` at the call site instead.
    ///
    /// Validates the geometry encoding against the array actually handed in, so the claim on the
    /// envelope is checked rather than asserted.
    ///
    /// **The attribute arrays are checked against the declared fields, not trusted to match them.**
    /// Count, order and type are all verified here, and a mismatch is a typed engine error rather
    /// than an Arrow string surfacing three layers up. Without this, `attribute_columns` on the
    /// envelope would be an *assertion* about the payload — and an envelope whose claims are
    /// unchecked is exactly what the single-constructor discipline exists to prevent, surviving in
    /// form while being hollow in substance.
    pub(crate) fn assemble(
        env: &BatchEnvelope,
        ids: ArrayRef,
        geometry: ArrayRef,
        attributes: Vec<ArrayRef>,
    ) -> Result<Self> {
        geoarrow::validate_polygon_encoding(&geometry)?;

        let declared = env.attributes();
        if attributes.len() != declared.len() {
            return Err(EngineError::EncodingMismatch {
                claimed: format!("{} declared attribute column(s)", declared.len()),
                found: format!("{} array(s)", attributes.len()),
            });
        }
        for (field, array) in declared.iter().zip(attributes.iter()) {
            if field.data_type() != array.data_type() {
                return Err(EngineError::EncodingMismatch {
                    claimed: format!("attribute `{}` is {}", field.name(), field.data_type()),
                    found: array.data_type().to_string(),
                });
            }
            if array.len() != ids.len() {
                return Err(EngineError::EncodingMismatch {
                    claimed: format!("attribute `{}` has {} row(s)", field.name(), ids.len()),
                    found: format!("{} row(s)", array.len()),
                });
            }
        }

        let mut columns: Vec<ArrayRef> = Vec::with_capacity(2 + attributes.len());
        columns.push(ids);
        columns.push(geometry);
        columns.extend(attributes);

        let batch = RecordBatch::try_new(env.schema(), columns)
            .map_err(|e| EngineError::Arrow(format!("record batch: {e}")))?;
        Ok(Self { batch })
    }

    /// The bounding box of every vertex in this batch, in the dataset's CRS, as
    /// `[xmin, ymin, xmax, ymax]`. `None` for a batch with no vertices.
    ///
    /// **Here rather than in the publisher** because walking the GeoArrow nesting is this module's
    /// knowledge, and because it is what lets a bundle's `bounds` be computed over the rows actually
    /// published. The file's own `covering.bbox` is the wrong source for that: under a filter it
    /// describes rows the bundle does not contain, and a viewer fitted to it opens on a mostly-empty
    /// map that looks like a rendering fault.
    ///
    /// The values are the **authoritative f64 coordinates**, untouched — no origin, no narrowing.
    /// A render origin is renderer-local state (ADR-010 rule 1) and never leaves the renderer, so
    /// nothing derived from one appears here or in anything built from this.
    pub fn xy_bounds(&self) -> Option<[f64; 4]> {
        let coords = geoarrow::coordinate_values(self.batch.column(1))?;
        if coords.is_empty() {
            return None;
        }
        let mut b = [f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY];
        for pair in coords.chunks_exact(2) {
            b[0] = b[0].min(pair[0]);
            b[1] = b[1].min(pair[1]);
            b[2] = b[2].max(pair[0]);
            b[3] = b[3].max(pair[1]);
        }
        // A non-finite coordinate would poison every bound derived from it, and the manifest's
        // canonical JSON has no spelling for one. Refusing to report a bound is honest; reporting
        // an infinity as a bound is not.
        b.iter().all(|v| v.is_finite()).then_some(b)
    }

    pub fn num_rows(&self) -> usize {
        self.batch.num_rows()
    }

    pub fn schema(&self) -> SchemaRef {
        self.batch.schema()
    }

    pub fn record_batch(&self) -> &RecordBatch {
        &self.batch
    }

    /// Serialize as a **complete, self-contained Arrow IPC stream** (schema + one batch + EOS),
    /// appended to `out`.
    ///
    /// Self-contained per batch for the reason the bake-off's producer gave: it puts the envelope
    /// on *every* batch, which is what ADR-010 rule 1 asks for, and it keeps the consumer's decode
    /// a single `tableFromIPC` call.
    ///
    /// `out` is appended to, never cleared. The caller may hand in a buffer that already contains
    /// bytes — which is how the data-plane binding gets its frame prefix in front of the payload
    /// without a second pass over it. Nothing here knows what those leading bytes are.
    pub fn write_ipc_into(&self, out: &mut Vec<u8>) -> Result<()> {
        let opts = IpcWriteOptions::default();
        let mut w = StreamWriter::try_new_with_options(out, &self.batch.schema(), opts)
            .map_err(|e| EngineError::Arrow(format!("ipc writer: {e}")))?;
        w.write(&self.batch).map_err(|e| EngineError::Arrow(format!("ipc write: {e}")))?;
        w.finish().map_err(|e| EngineError::Arrow(format!("ipc finish: {e}")))?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::crs::{AxisOrder, CrsAssertion};
    use crate::wkb::{encode_polygon, PolygonBuilder};
    use arrow::array::UInt64Array;

    /// A verified native identity, for tests that are about something else.
    fn test_identity() -> DatasetIdentity {
        DatasetIdentity::new(
            crate::identity::IdSource::File,
            crate::identity::IdUniqueness::VerifiedAtOpenFullFile,
            Some(1),
            Some(0),
        )
    }

    fn file_crs() -> DatasetCrs {
        DatasetCrs::from_file(
            "EPSG:2056".into(),
            Some(include_str!("../tests/data/epsg2056.projjson").to_string()),
            AxisOrder::EastingNorthing,
        )
    }

    fn two_polygons() -> ArrayRef {
        let mut b = PolygonBuilder::new();
        for offset in [0.0, 100.0] {
            b.push_wkb(&encode_polygon(&[vec![
                [2_600_000.0 + offset, 1_200_000.0],
                [2_600_010.0 + offset, 1_200_000.0],
                [2_600_010.0 + offset, 1_200_010.0],
                [2_600_000.0 + offset, 1_200_000.0],
            ]]))
            .unwrap();
        }
        crate::geoarrow::build_polygon_array(b).unwrap()
    }

    fn one_polygon() -> ArrayRef {
        let mut b = PolygonBuilder::new();
        b.push_wkb(&encode_polygon(&[vec![
            [2_600_000.0, 1_200_000.0],
            [2_600_010.0, 1_200_000.0],
            [2_600_010.0, 1_200_010.0],
            [2_600_000.0, 1_200_000.0],
        ]]))
        .unwrap();
        crate::geoarrow::build_polygon_array(b).unwrap()
    }

    #[test]
    fn every_batch_carries_frame_crs_and_axis_order() {
        let env = BatchEnvelope::new(file_crs(), "geometry".into(), test_identity());
        let b = TaggedBatch::assemble(&env, Arc::new(UInt64Array::from(vec![1u64])), one_polygon(), Vec::new())
            .unwrap();
        let md = b.schema().metadata().clone();
        assert_eq!(md.get("frame").unwrap(), FRAME_AUTHORITATIVE);
        assert_eq!(md.get("crs").unwrap(), "EPSG:2056");
        assert_eq!(md.get("crs_source").unwrap(), "file");
        assert_eq!(md.get("axis_order").unwrap(), "easting,northing");
        assert_eq!(md.get("axis_normalization").unwrap(), "none-performed");
    }

    #[test]
    fn an_asserted_crs_stays_marked_as_asserted_on_the_wire() {
        let a = CrsAssertion {
            identifier: "EPSG:2056".into(),
            definition_json: None,
            by: "operator".into(),
            at: "2026-08-04T12:00:00Z".into(),
        };
        let env = BatchEnvelope::new(
            DatasetCrs::from_assertion(&a, AxisOrder::EastingNorthing),
            "geometry".into(),
            test_identity(),
        );
        let md = env.schema().metadata().clone();
        assert_eq!(md.get("crs_source").unwrap(), "caller_asserted");
        assert_eq!(md.get("crs_asserted_by").unwrap(), "operator");
        assert_eq!(md.get("crs_asserted_at").unwrap(), "2026-08-04T12:00:00Z");
    }

    #[test]
    fn two_envelopes_built_separately_serialize_to_identical_bytes() {
        // **A published bundle's byte-identical-rebuild guarantee runs through here.** The envelope's
        // metadata is a `HashMap`, whose iteration order differs between instances; what makes the
        // emitted IPC deterministic is that the Arrow writer sorts those keys before serializing.
        // That is a property of a dependency and nothing in this repository asserted it — so an
        // Arrow that stopped sorting would silently make two publishes of the same data differ, and
        // the failure would surface as a determinism test in another crate, three layers from the
        // cause.
        let one = BatchEnvelope::new(file_crs(), "geometry".into(), test_identity());
        let two = BatchEnvelope::new(file_crs(), "geometry".into(), test_identity());

        let bytes = |env: &BatchEnvelope| {
            let b = TaggedBatch::assemble(
                env,
                Arc::new(UInt64Array::from(vec![1u64, 2])),
                two_polygons(),
                Vec::new(),
            )
            .unwrap();
            let mut buf = Vec::new();
            b.write_ipc_into(&mut buf).unwrap();
            buf
        };
        assert_eq!(bytes(&one), bytes(&two), "envelope serialization is not deterministic");
    }

    #[test]
    fn the_tag_survives_ipc_serialization() {
        let env = BatchEnvelope::new(file_crs(), "geometry".into(), test_identity());
        let b = TaggedBatch::assemble(&env, Arc::new(UInt64Array::from(vec![7u64])), one_polygon(), Vec::new())
            .unwrap();

        let mut buf = Vec::new();
        b.write_ipc_into(&mut buf).unwrap();

        let mut rdr = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let round = rdr.next().unwrap().unwrap();
        assert_eq!(round.schema().metadata().get("crs").unwrap(), "EPSG:2056");
        assert_eq!(
            round.schema().field(1).metadata().get(crate::geoarrow::EXT_NAME_KEY).unwrap(),
            crate::geoarrow::EXT_NAME_POLYGON
        );
    }

    #[test]
    fn ipc_bytes_are_appended_so_a_caller_may_reserve_a_prefix() {
        let env = BatchEnvelope::new(file_crs(), "geometry".into(), test_identity());
        let b = TaggedBatch::assemble(&env, Arc::new(UInt64Array::from(vec![1u64])), one_polygon(), Vec::new())
            .unwrap();
        let mut buf = vec![0xAAu8; 8];
        b.write_ipc_into(&mut buf).unwrap();
        assert_eq!(&buf[..8], &[0xAA; 8], "pre-existing bytes are untouched");
        // Arrow IPC streams open with the 0xFFFFFFFF continuation marker.
        assert_eq!(&buf[8..12], &[0xFF, 0xFF, 0xFF, 0xFF]);
    }

    #[test]
    fn a_geometry_array_of_the_wrong_shape_cannot_be_assembled_into_a_batch() {
        use arrow::array::Float64Array;
        let env = BatchEnvelope::new(file_crs(), "geometry".into(), test_identity());
        let wrong: ArrayRef = Arc::new(Float64Array::from(vec![1.0]));
        let e = TaggedBatch::assemble(&env, Arc::new(UInt64Array::from(vec![1u64])), wrong, Vec::new()).unwrap_err();
        assert!(matches!(e, EngineError::EncodingMismatch { .. }));
    }
}
