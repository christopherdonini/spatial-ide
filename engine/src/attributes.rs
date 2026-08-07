// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The **published attribute projection** — which non-geometry columns may leave this module, and
//! under what type discipline.
//!
//! Until this cut the engine emitted exactly `[id, geometry]`. A categorical style needs a column to
//! match on and a hover panel needs something to show, so the batch schema widens by a **declared
//! projection**: an explicit, caller-supplied, ordered list of column names.
//!
//! ## Explicit, never "all attributes"
//!
//! Three independent reasons, none of them convenience:
//!
//! - **`docs/09`.** A published bundle is a redistributable copy. An unbounded projection publishes
//!   every column a source happens to carry — including ones nobody reviewed — into an artifact
//!   whose whole purpose is to be handed to other people.
//! - **Determinism.** "All attributes" makes the emitted schema a function of the file's column
//!   order, so a re-export of the same data with columns reordered would change every partition's
//!   bytes and every hash while nothing about the request changed.
//! - **Size.** A projection is the only bound on how much of a 5 GB source lands in a bundle.
//!
//! ## Types are admitted, never converted
//!
//! The admissible set is small and every refusal is typed. Nothing here casts, widens, or
//! stringifies a column to make it fit: a conversion the caller did not ask for is the silent
//! conversion `docs/01` principle 8 forbids, and it would also make the bundle's schema a claim
//! about data that was never in the source.
//!
//! **Dictionary-encoded columns are refused rather than decoded.** A dictionary index is an ordinal,
//! which ADR-016 §4 names explicitly as a synthesized identity wearing a mapping's clothes; and the
//! bundle format carries no dictionary batches at all, so admitting one here would mean an implicit
//! decode on the way out.
//!
//! ## Every published attribute is nullable
//!
//! Not "nullable if the source says so". A source NULL is a value the data carries, and a schema
//! that could not represent it would force either a substituted default or a refusal at write time —
//! the first is a silent conversion, the second is a failure discovered halfway through a publish.
//! So NULL travels: Arrow validity bit → partition → viewer → the style's declared `on_null`
//! branch → an explicit "no value" marker in the hover panel. **The identity column is the one
//! exception and it is not an attribute**: `id` stays non-nullable, because a NULL identity is the
//! wrong-but-plausible feature ADR-010 rule 2 exists to prevent.

use arrow::datatypes::{DataType, Field};

use crate::error::{EngineError, Result};

/// Attribute columns one bundle may publish. Declared, not discovered (ADR-010 rule 6): the
/// projection is carried in every partition's schema and rendered in every hover panel, and an
/// unbounded one is unbounded work in both places.
pub const MAX_PUBLISHED_ATTRIBUTES: usize = 32;

/// Whether reading this type into a published partition preserves the source value exactly.
///
/// The list is deliberately short. Everything absent from it is refused with a message that says
/// what would have had to happen to admit it.
pub fn admit_attribute_type(column: &str, ty: &DataType) -> Result<()> {
    use DataType as D;
    match ty {
        D::Utf8
        | D::LargeUtf8
        | D::Utf8View
        | D::Boolean
        | D::Int8
        | D::Int16
        | D::Int32
        | D::Int64
        | D::UInt8
        | D::UInt16
        | D::UInt32
        | D::UInt64
        | D::Float64 => Ok(()),
        D::Dictionary(_, _) => Err(EngineError::AttributeUnpublishable {
            column: column.to_string(),
            detail: format!(
                "type is {ty}. A dictionary index is an ordinal, and decoding one to publish it \
                 would be a conversion the caller did not ask for. The bundle format carries no \
                 dictionary batches"
            ),
        }),
        D::Float32 => Err(EngineError::AttributeUnpublishable {
            column: column.to_string(),
            detail: "type is Float32. The bundle carries doubles; widening f32 to f64 is exact but \
                     it is still a conversion this engine was not asked to perform, and a consumer \
                     reading `float64` would be told the source held one"
                .to_string(),
        }),
        other => Err(EngineError::AttributeUnpublishable {
            column: column.to_string(),
            detail: format!(
                "type is {other}, which is not in the admissible set for a published attribute \
                 (utf8, boolean, the 8/16/32/64-bit integers, float64)"
            ),
        }),
    }
}

/// A projection that has passed [`admit_projection`].
///
/// **The single-constructor discipline `BatchEnvelope` uses, applied to the projection.** Without
/// it, `stream_for_publish` would take a bare `&[Field]` on a public API, so a caller could hand it
/// a `Float32` column, the geometry column, or a duplicate — bypassing every typed refusal in this
/// module and reaching a DuckDB error or an `EncodingMismatch` instead. The refusals are the
/// module's whole point; a type that can only be built by passing them is what makes them
/// unavoidable rather than merely available.
#[derive(Clone, Debug, PartialEq)]
pub struct PublishedProjection {
    fields: Vec<Field>,
}

impl PublishedProjection {
    pub fn fields(&self) -> &[Field] {
        &self.fields
    }
    pub fn names(&self) -> Vec<String> {
        self.fields.iter().map(|f| f.name().clone()).collect()
    }
    pub fn len(&self) -> usize {
        self.fields.len()
    }
    pub fn is_empty(&self) -> bool {
        self.fields.is_empty()
    }
}

/// Validate a caller's projection against the dataset's own columns.
///
/// `resolved` are the fields as the reader actually reports them, in the caller's declared order.
/// The geometry column and the identity source column are **refused**: geometry already travels as
/// GeoArrow and re-publishing it as an attribute would put two encodings of one thing in one batch;
/// identity already travels as `id`, and a second identity-shaped column is two names for one fact,
/// which is how a consumer ends up addressing features by the wrong one.
pub fn admit_projection(
    resolved: &[Field],
    geometry_column: &str,
    identity_column: &str,
) -> Result<PublishedProjection> {
    if resolved.len() > MAX_PUBLISHED_ATTRIBUTES {
        return Err(EngineError::CeilingExceeded {
            ceiling: "MAX_PUBLISHED_ATTRIBUTES",
            limit: MAX_PUBLISHED_ATTRIBUTES as u64,
            saw: resolved.len() as u64,
        });
    }
    let mut seen: Vec<&str> = Vec::with_capacity(resolved.len());
    let mut out = Vec::with_capacity(resolved.len());
    for f in resolved {
        let name = f.name().as_str();
        if name == geometry_column {
            return Err(EngineError::AttributeUnpublishable {
                column: name.to_string(),
                detail: "this is the geometry column; it already travels as GeoArrow".to_string(),
            });
        }
        if name == identity_column || name == crate::envelope::ID_COLUMN {
            return Err(EngineError::AttributeUnpublishable {
                column: name.to_string(),
                detail: format!(
                    "this is the dataset's identity column; it already travels as `{}`, and a \
                     second identity-shaped column is two names for one fact",
                    crate::envelope::ID_COLUMN
                ),
            });
        }
        if seen.contains(&name) {
            return Err(EngineError::AttributeUnpublishable {
                column: name.to_string(),
                detail: "named twice in the projection".to_string(),
            });
        }
        seen.push(name);
        admit_attribute_type(name, f.data_type())?;
        // Nullable by construction — see the module comment. The source's own nullability is
        // deliberately not consulted.
        out.push(Field::new(name, f.data_type().clone(), true));
    }
    Ok(PublishedProjection { fields: out })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_admissible_set_is_exactly_what_the_bundle_can_carry_exactly() {
        for ty in [
            DataType::Utf8,
            DataType::LargeUtf8,
            DataType::Boolean,
            DataType::Int32,
            DataType::UInt64,
            DataType::Float64,
        ] {
            assert!(admit_attribute_type("c", &ty).is_ok(), "{ty} should be admissible");
        }
        for ty in [
            DataType::Float32,
            DataType::Binary,
            DataType::Date32,
            DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8)),
        ] {
            assert!(admit_attribute_type("c", &ty).is_err(), "{ty} must be refused");
        }
    }

    #[test]
    fn every_published_attribute_comes_back_nullable_whatever_the_source_said() {
        // A source NULL is a value; a schema that could not carry it would force a substitution.
        let resolved = vec![Field::new("zone", DataType::Utf8, false)];
        let out = admit_projection(&resolved, "geometry", "id").unwrap();
        assert!(out.fields()[0].is_nullable(), "publishing must not be able to lose a NULL");
    }

    #[test]
    fn the_geometry_and_identity_columns_are_refused_as_attributes() {
        let geom = vec![Field::new("geometry", DataType::Utf8, true)];
        assert!(matches!(
            admit_projection(&geom, "geometry", "id").unwrap_err(),
            EngineError::AttributeUnpublishable { .. }
        ));
        // Both the engine's emitted name and the source column a mapping declared.
        for col in ["id", "parcel_key"] {
            let f = vec![Field::new(col, DataType::UInt64, true)];
            assert!(
                matches!(
                    admit_projection(&f, "geometry", "parcel_key").unwrap_err(),
                    EngineError::AttributeUnpublishable { .. }
                ),
                "{col} must be refused"
            );
        }
    }

    #[test]
    fn a_column_named_twice_is_refused_rather_than_published_twice() {
        let dup = vec![
            Field::new("zone", DataType::Utf8, true),
            Field::new("zone", DataType::Utf8, true),
        ];
        assert!(admit_projection(&dup, "geometry", "id").is_err());
    }
}
