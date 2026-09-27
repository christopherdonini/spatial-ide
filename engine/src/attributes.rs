// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The **admitted attribute projection** — which non-geometry columns may leave this module, and
//! under what type discipline. Shared by three surfaces: a published bundle's projection, a live
//! `viewport_query`'s declared projection, and the filter namespace's per-column type check
//! (`predicate.rs`).
//!
//! Until Brief B stage B1 the engine emitted exactly `[id, geometry]` on the live path (a bundle
//! could already carry a declared projection). A categorical style needs a column to match on and a
//! hover panel needs something to show, so the live batch schema widens the same way a bundle's
//! already does: an explicit, caller-supplied, ordered list of column names.
//!
//! ## Explicit, never "all attributes"
//!
//! Three independent reasons, none of them convenience:
//!
//! - **`docs/09`.** A published bundle is a redistributable copy. An unbounded projection publishes
//!   every column a source happens to carry — including ones nobody reviewed — into an artifact
//!   whose whole purpose is to be handed to other people. The same argument bounds a live query: an
//!   unbounded live projection is unbounded work in the hover panel and on the wire.
//! - **Determinism.** "All attributes" makes the emitted schema a function of the file's column
//!   order, so a re-export of the same data with columns reordered would change every partition's
//!   bytes and every hash while nothing about the request changed.
//! - **Size.** A projection is the only bound on how much of a 5 GB source lands in a bundle or a
//!   live batch.
//!
//! ## Types are admitted, never converted
//!
//! The admissible set is small and every refusal is typed. Nothing here casts, widens, or
//! stringifies a column to make it fit: a conversion the caller did not ask for is the silent
//! conversion `docs/01` principle 8 forbids, and it would also make the schema a claim about data
//! that was never in the source.
//!
//! **`Float32` is admitted and emitted as `Float32`, never widened to `Float64`** (ADR-023 §2 as
//! amended, RULED 2026-09-24 question round 17 item 3). Widening it would be exactly the silent
//! conversion this module refuses everywhere else: a consumer reading `float64` would be told the
//! source held one.
//!
//! **A dictionary-encoded column is admitted exactly when its value type is, and is emitted as the
//! value type** — the same round 17 item 3 ruling. A dictionary index is an ordinal (ADR-016 §4
//! names this explicitly), so the value actually admitted and emitted is never the index; decoding
//! happens in the chunk loop (`stream.rs`), never here.
//!
//! **The bundle format's own restriction is a separate, named thing, and it is not this gate.**
//! `kernel/src/publish` refuses a `Float32` or dictionary-encoded column at preflight as ADR-017 §4's
//! bundle-format restriction — a fact about what a `bundle_version` 1 partition can carry, not about
//! what a live query may stream. This module's own admissible set no longer coincides with it.
//!
//! ## Every admitted attribute is nullable
//!
//! Not "nullable if the source says so". A source NULL is a value the data carries, and a schema
//! that could not represent it would force either a substituted default or a refusal at write time —
//! the first is a silent conversion, the second is a failure discovered halfway through a publish or
//! a stream. So NULL travels: Arrow validity bit → batch or partition → viewer → the style's
//! declared `on_null` branch → an explicit "no value" marker in the hover panel. **The identity
//! column is the one exception and it is not an attribute**: `id` stays non-nullable, because a NULL
//! identity is the wrong-but-plausible feature ADR-010 rule 2 exists to prevent.

use arrow::datatypes::{DataType, Field, Fields};

use crate::error::{EngineError, Result};

/// Attribute columns one bundle or one live query may carry. Declared, not discovered (ADR-010
/// rule 6): the projection is carried in every partition's schema (or every live batch's) and
/// rendered in every hover panel, and an unbounded one is unbounded work in both places.
///
/// **One number bounding both surfaces** (ADR-023 §4) — renamed from `MAX_PUBLISHED_ATTRIBUTES`,
/// which named only the publish surface this constant used to bound alone.
pub const MAX_PROJECTED_ATTRIBUTES: usize = 32;

/// Whether reading this type into an admitted projection preserves the source value exactly, and
/// what it is emitted as.
///
/// The list is deliberately short. Everything absent from it is refused with a message that says
/// what would have had to happen to admit it. Returns the **emitted** field type: identical to `ty`
/// for every directly-admitted type, and the **value type** for an admitted dictionary.
pub fn admit_attribute_type(column: &str, ty: &DataType) -> Result<DataType> {
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
        | D::Float64
        | D::Float32 => Ok(ty.clone()),
        D::Dictionary(_, value) => match admit_scalar_value_type(value) {
            Some(emitted) => Ok(emitted),
            None => Err(EngineError::AttributeUnpublishable {
                column: column.to_string(),
                detail: format!(
                    "type is {ty}. Its value type, {value}, is not in the admissible set, so the \
                     dictionary is refused rather than decoded into something a caller did not ask \
                     for"
                ),
            }),
        },
        other => Err(EngineError::AttributeUnpublishable {
            column: column.to_string(),
            detail: format!(
                "[B1 close placeholder] type is {other}, which is not in the admissible set for an \
                 attribute (utf8, boolean, the 8/16/32/64-bit integers, float32, float64, or a \
                 dictionary over one of those)"
            ),
        }),
    }
}

/// The scalar (non-dictionary) admitted types, checked without minting a refusal — used only to
/// decide a dictionary's own value type inside [`admit_attribute_type`], which mints the refusal
/// itself so the dictionary's own source type (not just its value type) appears in the message.
fn admit_scalar_value_type(ty: &DataType) -> Option<DataType> {
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
        | D::Float64
        | D::Float32 => Some(ty.clone()),
        _ => None,
    }
}

/// Every way a declared projection can be refused, shared by the live `viewport_query` path
/// (`kernel::skp::build_viewport_query`) and the publish path ([`admit_projection`]'s own callers).
///
/// **A deliberate 1:1 correspondence with SKP-V0.md's six new `skp.projection_*` wire codes** —
/// `kernel::skp::projection_error_of` maps each variant to its own code by name; a seventh variant
/// here would be inventing wire taxonomy this crate does not own. Every match on this enum is
/// exhaustive, with no wildcard arm, for the same reason `FilterError`'s own doc gives.
///
/// **Not [`EngineError`].** A live projection refusal is synchronous, pre-lease and pre-mint
/// (ADR-023 §3), and the kernel needs the variant apart to pick one of six typed SKP codes — folding
/// it into `EngineError` first would lose exactly the distinction the wire mapping needs. Publish,
/// which has no such distinction to make, converts via `impl From<ProjectionError> for EngineError`
/// below.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ProjectionError {
    /// The declared projection named more columns than [`MAX_PROJECTED_ATTRIBUTES`] admits. Checked
    /// before any name is resolved (ADR-023 §3's declared order).
    TooManyColumns { limit: u64, saw: u64 },
    /// A name resolves to nothing in the dataset's own resident schema — including the reserved
    /// wire identity name `id` treated specially first, so this never fires for it (see
    /// [`ColumnIsIdentity`](Self::ColumnIsIdentity)'s own doc).
    ColumnUnknown { column: String, known_columns: Vec<String> },
    /// The name is the geometry column; it already travels as GeoArrow.
    ColumnIsGeometry { column: String },
    /// The name is the reserved wire identity name `id`, or the dataset's own identity **source**
    /// column under a declared mapping — either way, a second identity-shaped column would be two
    /// names for one fact.
    ///
    /// `id_column` is the dataset's identity **source** column (ADR-016 §3) — `id` itself for a
    /// native identity, or the mapped column's own name (e.g. `parcel_key`) under a declared
    /// mapping. `column` is whichever of the two names the caller actually wrote; the two can
    /// differ, and [`std::fmt::Display`] states whichever fact applies.
    ColumnIsIdentity { column: String, id_column: String },
    /// The same name appears more than once in the declared projection.
    ColumnDuplicated { column: String },
    /// The column resolves and is not geometry, not identity, and not a duplicate, but its Arrow
    /// type is not in [`admit_attribute_type`]'s admissible set. `arrow_type` is
    /// `describe.schema[].arrow_type`'s string — the **source** type, not an emitted one.
    TypeNotAdmitted { column: String, arrow_type: String, detail: String },
}

impl std::fmt::Display for ProjectionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::TooManyColumns { limit, saw } => write!(
                f,
                "refused: the declared projection names {saw} column(s), over the declared ceiling \
                 of {limit}"
            ),
            Self::ColumnUnknown { column, known_columns } => {
                // `known_columns` is comma-joined in the `candidate_columns` form on the wire
                // (`kernel::skp::projection_error_of`); a name that contains a comma is omitted
                // there, so this Display states that rather than silently listing a superset of
                // what the wire field carries (round 17 item 4, stop item 8).
                let (kept, omitted): (Vec<&str>, usize) = {
                    let kept: Vec<&str> =
                        known_columns.iter().filter(|c| !c.contains(',')).map(String::as_str).collect();
                    let omitted = known_columns.len() - kept.len();
                    (kept, omitted)
                };
                write!(f, "refused: `{column}` is not a column this dataset carries (it has: {}", kept.join(", "))?;
                if omitted > 0 {
                    write!(f, "; {omitted} name(s) containing a comma omitted")?;
                }
                write!(f, ")")
            }
            Self::ColumnIsGeometry { column } => write!(
                f,
                "refused: `{column}` is the geometry column; it already travels as GeoArrow"
            ),
            Self::ColumnIsIdentity { column, id_column } if column == id_column => write!(
                f,
                "refused: `{column}` is this dataset's identity column; it already travels as \
                 `id`, and a second identity-shaped column is two names for one fact"
            ),
            Self::ColumnIsIdentity { column, id_column } => write!(
                f,
                "refused: `{column}` is the reserved identity column name; this dataset's identity \
                 is mapped from `{id_column}`, and requesting `{column}` directly would be a second \
                 name for the same fact"
            ),
            Self::ColumnDuplicated { column } => {
                write!(f, "refused: `{column}` is named twice in the declared projection")
            }
            Self::TypeNotAdmitted { column, arrow_type, detail } => {
                write!(f, "refused: `{column}` is {arrow_type} — {detail}")
            }
        }
    }
}

impl std::error::Error for ProjectionError {}

/// `known_columns`, comma-joined in the `candidate_columns` form `kernel::skp::error_of` already
/// uses for `EngineError::IdentityUnusable` — a name containing a comma is omitted, never escaped,
/// so the wire field itself is never ambiguous about where one name ends and the next begins (round
/// 17 item 4, stop item 8). One function, so [`ProjectionError`]'s own `Display` and the kernel's
/// wire field cannot silently list two different sets.
pub fn known_columns_wire_field(known_columns: &[String]) -> String {
    known_columns.iter().filter(|c| !c.contains(',')).cloned().collect::<Vec<_>>().join(",")
}

/// Serves publish, whose refusals are typed as [`EngineError`] rather than [`ProjectionError`]
/// (`kernel/src/publish`'s `?` on `Dataset::resolve_projection`). Every text below is
/// [`admit_attribute_type`]'s and [`admit_projection`]'s own **former** wording, kept byte for byte
/// (O1, O2) — this function exists so a rename or a widening on the live path does not silently
/// change publish's own refusal text.
impl From<ProjectionError> for EngineError {
    fn from(e: ProjectionError) -> Self {
        match e {
            ProjectionError::TooManyColumns { limit, saw } => {
                EngineError::CeilingExceeded { ceiling: "MAX_PROJECTED_ATTRIBUTES", limit, saw }
            }
            ProjectionError::ColumnUnknown { column, known_columns } => {
                EngineError::AttributeUnpublishable {
                    column: column.clone(),
                    detail: format!("the file has no such column (it has: {})", known_columns.join(", ")),
                }
            }
            ProjectionError::ColumnIsGeometry { column } => EngineError::AttributeUnpublishable {
                column: column.clone(),
                detail: "this is the geometry column; it already travels as GeoArrow".to_string(),
            },
            ProjectionError::ColumnIsIdentity { column, .. } => EngineError::AttributeUnpublishable {
                column: column.clone(),
                detail: format!(
                    "this is the dataset's identity column; it already travels as `{}`, and a \
                     second identity-shaped column is two names for one fact",
                    crate::envelope::ID_COLUMN
                ),
            },
            ProjectionError::ColumnDuplicated { column } => EngineError::AttributeUnpublishable {
                column: column.clone(),
                detail: "named twice in the projection".to_string(),
            },
            ProjectionError::TypeNotAdmitted { column, arrow_type, .. } => {
                EngineError::AttributeUnpublishable {
                    column: column.clone(),
                    detail: format!(
                        "type is {arrow_type}, which is not in the admissible set for a published \
                         attribute (utf8, boolean, the 8/16/32/64-bit integers, float64)"
                    ),
                }
            }
        }
    }
}

/// A projection that has passed [`admit_projection`].
///
/// **The single-constructor discipline `BatchEnvelope` uses, applied to the projection.** Without
/// it, a caller could hand `stream_for_publish` or the live entry point a bare `&[Field]`, letting a
/// `Float32`-widened, geometry, or duplicate column bypass every typed refusal in this module and
/// reach a DuckDB error or an `EncodingMismatch` instead. The refusals are the module's whole point;
/// a type that can only be built by passing them is what makes them unavoidable rather than merely
/// available.
///
/// Renamed from `PublishedProjection`: this type now backs a live query's projection too, and the
/// old name claimed a surface it no longer names alone.
#[derive(Clone, Debug, PartialEq)]
pub struct AdmittedProjection {
    fields: Vec<Field>,
}

impl AdmittedProjection {
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

/// Per-column admission: geometry, identity, then type — **not** duplicate, which needs state
/// across the whole declared list and so lives in [`admit_projection`] alone.
///
/// Shared by [`admit_projection`] and `kernel::skp::describe_dataset`'s `projectable` fact (round 17
/// item 4, stop item 4): both ask "would this one column, alone, be admitted", and `projectable`
/// states **live** admission only — a projectable `Float32` or dictionary column is still refused
/// at publish by the bundle-format restriction (`kernel/src/publish`), which this function knows
/// nothing about.
///
/// Returns the field as it would be **emitted**: nullable by construction (see the module doc), and
/// carrying the emitted type (the dictionary's value type, where the source was a dictionary).
pub fn admit_projection_column(
    field: &Field,
    geometry_column: &str,
    identity_column: &str,
) -> std::result::Result<Field, ProjectionError> {
    let name = field.name().as_str();
    if name == geometry_column {
        return Err(ProjectionError::ColumnIsGeometry { column: name.to_string() });
    }
    if name == identity_column {
        return Err(ProjectionError::ColumnIsIdentity {
            column: name.to_string(),
            id_column: identity_column.to_string(),
        });
    }
    let emitted = admit_attribute_type(name, field.data_type()).map_err(|_| {
        ProjectionError::TypeNotAdmitted {
            column: name.to_string(),
            arrow_type: field.data_type().to_string(),
            detail: format!(
                "[B1 close placeholder] type is {}; not in the admissible set for a live \
                 projection (utf8, boolean, the 8/16/32/64-bit integers, float32, float64, or a \
                 dictionary over one of those)",
                field.data_type()
            ),
        }
    })?;
    Ok(Field::new(name, emitted, true))
}

/// Validate a caller's declared projection against the dataset's own columns, in the declared order
/// (ADR-023 §3):
///
/// 1. `names.len()` over [`MAX_PROJECTED_ATTRIBUTES`] refuses before any name is resolved.
/// 2. Each name is resolved in declared order. The reserved wire identity name `id` is recognised
///    **before** the unknown-column check (round 17 item 4, stop item 8 / O8) — so a mapped
///    identity's file, which carries no column literally named `id`, still refuses a request for
///    `id` as an identity collision rather than as an unknown column.
/// 3. Per-column rules run in declared order — geometry, identity (the mapped identity's own
///    **source** column, e.g. `parcel_key`), duplicate, type — via [`admit_projection_column`] for
///    geometry/identity/type, with the duplicate check run alongside it.
/// 4. The first failure is reported.
///
/// `file_schema` is the dataset's resident schema fields, in file order — never the caller's
/// declared order, which is `names`' own.
pub fn admit_projection(
    names: &[String],
    file_schema: &Fields,
    geometry_column: &str,
    identity_column: &str,
) -> std::result::Result<AdmittedProjection, ProjectionError> {
    if names.len() > MAX_PROJECTED_ATTRIBUTES {
        return Err(ProjectionError::TooManyColumns {
            limit: MAX_PROJECTED_ATTRIBUTES as u64,
            saw: names.len() as u64,
        });
    }
    let mut seen: Vec<&str> = Vec::with_capacity(names.len());
    let mut out = Vec::with_capacity(names.len());
    for name in names {
        let name = name.as_str();
        // The reserved wire identity name, recognised before the unknown-column check runs at all
        // (O8): a mapped identity's file carries no column literally named `id`, and without this
        // the lookup below would refuse it as unknown rather than as the identity collision it is.
        if name == crate::envelope::ID_COLUMN {
            return Err(ProjectionError::ColumnIsIdentity {
                column: name.to_string(),
                id_column: identity_column.to_string(),
            });
        }
        let field = file_schema.iter().find(|f| f.name() == name).ok_or_else(|| {
            ProjectionError::ColumnUnknown {
                column: name.to_string(),
                known_columns: file_schema.iter().map(|f| f.name().clone()).collect(),
            }
        })?;
        if seen.contains(&name) {
            return Err(ProjectionError::ColumnDuplicated { column: name.to_string() });
        }
        let admitted = admit_projection_column(field, geometry_column, identity_column)?;
        seen.push(name);
        out.push(admitted);
    }
    Ok(AdmittedProjection { fields: out })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// F14 / the changed existing test: the admissible set now admits `Float32` and a dictionary
    /// over an admitted value type — moved here from a refusal, and the test renamed for the live
    /// admitted set (publish's own refusal of them is a separate, later check — `kernel/tests`'
    /// `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text`).
    // RECORDED MUTATION: in `admit_attribute_type`, remove `D::Float32` from the admitted-types
    // arm (falls through to the refused `other` arm). Observed: this test fails by name -- "Float32
    // should be admissible" panics at `engine/src/attributes.rs:438`. Reverted.
    #[test]
    fn the_live_admissible_set_admits_float32_and_a_dictionary_over_an_admitted_value_type() {
        for ty in [
            DataType::Utf8,
            DataType::LargeUtf8,
            DataType::Boolean,
            DataType::Int32,
            DataType::UInt64,
            DataType::Float64,
            DataType::Float32,
            DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8)),
        ] {
            assert!(admit_attribute_type("c", &ty).is_ok(), "{ty} should be admissible");
        }
        for ty in [
            DataType::Binary,
            DataType::Date32,
            DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Date32)),
        ] {
            assert!(admit_attribute_type("c", &ty).is_err(), "{ty} must be refused");
        }
    }

    /// E-1: `float32_is_admitted_as_its_own_type_and_never_widened`.
    #[test]
    fn float32_is_admitted_as_its_own_type_and_never_widened() {
        let emitted = admit_attribute_type("f32", &DataType::Float32).unwrap();
        assert_eq!(emitted, DataType::Float32, "Float32 must never widen to Float64");
    }

    /// E-2: `dictionary_is_admitted_under_its_value_types_rule_and_emitted_as_the_value_type`.
    #[test]
    fn dictionary_is_admitted_under_its_value_types_rule_and_emitted_as_the_value_type() {
        let ok = DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8));
        assert_eq!(admit_attribute_type("c", &ok).unwrap(), DataType::Utf8);

        let refused = DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Date32));
        assert!(admit_attribute_type("c", &refused).is_err());
    }

    /// E-3: `every_type_still_refused_is_refused_by_the_gate`.
    #[test]
    fn every_type_still_refused_is_refused_by_the_gate() {
        for ty in [
            DataType::Binary,
            DataType::Date32,
            DataType::Decimal128(10, 2),
            DataType::Timestamp(arrow::datatypes::TimeUnit::Microsecond, None),
            DataType::List(std::sync::Arc::new(Field::new("item", DataType::Int32, true))),
            DataType::Struct(Fields::from(vec![Field::new("a", DataType::Int32, true)])),
        ] {
            assert!(admit_attribute_type("c", &ty).is_err(), "{ty} must still be refused");
        }
    }

    fn native_schema() -> Fields {
        Fields::from(vec![
            Field::new("id", DataType::UInt64, false),
            Field::new("geometry", DataType::Binary, false),
            Field::new("area", DataType::Float64, true),
            Field::new("zone", DataType::Utf8, true),
            Field::new("d32", DataType::Date32, true),
        ])
    }

    /// E-4: `each_projection_refusal_is_its_own_variant`.
    #[test]
    fn each_projection_refusal_is_its_own_variant() {
        let schema = native_schema();
        assert!(matches!(
            admit_projection(&["geometry".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::ColumnIsGeometry { .. })
        ));
        assert!(matches!(
            admit_projection(&["id".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::ColumnIsIdentity { .. })
        ));
        assert!(matches!(
            admit_projection(&["zone".to_string(), "zone".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::ColumnDuplicated { .. })
        ));
        assert!(matches!(
            admit_projection(&["d32".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::TypeNotAdmitted { .. })
        ));
        assert!(matches!(
            admit_projection(&["nope".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::ColumnUnknown { .. })
        ));
    }

    /// E-5: `the_count_ceiling_is_checked_before_any_name_is_resolved`.
    #[test]
    fn the_count_ceiling_is_checked_before_any_name_is_resolved() {
        let schema = native_schema();
        let names: Vec<String> = (0..MAX_PROJECTED_ATTRIBUTES + 1)
            .map(|i| format!("nope-{i}"))
            .collect();
        match admit_projection(&names, &schema, "geometry", "id") {
            Err(ProjectionError::TooManyColumns { limit, saw }) => {
                assert_eq!(limit, MAX_PROJECTED_ATTRIBUTES as u64);
                assert_eq!(saw, names.len() as u64);
            }
            other => panic!("expected TooManyColumns before any name was resolved, got {other:?}"),
        }
    }

    /// E-6: `names_resolve_before_per_column_rules_in_declared_order` — the first name in the list
    /// is the one whose refusal is reported, never a later one.
    #[test]
    fn names_resolve_before_per_column_rules_in_declared_order() {
        let schema = native_schema();
        match admit_projection(
            &["nope".to_string(), "geometry".to_string()],
            &schema,
            "geometry",
            "id",
        ) {
            Err(ProjectionError::ColumnUnknown { column, .. }) => assert_eq!(column, "nope"),
            other => panic!("expected the first name's own refusal, got {other:?}"),
        }
    }

    /// E-7: `projectable_is_the_per_column_admission`.
    #[test]
    fn projectable_is_the_per_column_admission() {
        let schema = native_schema();
        let projectable = |name: &str| {
            let field = schema.iter().find(|f| f.name() == name).unwrap();
            admit_projection_column(field, "geometry", "id").is_ok()
        };
        assert!(!projectable("id"));
        assert!(!projectable("geometry"));
        assert!(projectable("area"));
        assert!(projectable("zone"));
        assert!(!projectable("d32"));
    }

    /// O8: a mapped identity's file carries no column literally named `id` — the reserved name must
    /// still refuse as an identity collision, not as unknown.
    #[test]
    fn the_reserved_id_name_refuses_as_identity_even_when_the_file_has_no_such_column() {
        let schema = Fields::from(vec![
            Field::new("parcel_key", DataType::UInt64, false),
            Field::new("geometry", DataType::Binary, false),
        ]);
        match admit_projection(&["id".to_string()], &schema, "geometry", "parcel_key") {
            Err(ProjectionError::ColumnIsIdentity { column, id_column }) => {
                assert_eq!(column, "id");
                assert_eq!(id_column, "parcel_key");
            }
            other => panic!("expected ColumnIsIdentity naming the mapped source column, got {other:?}"),
        }
    }

    // RECORDED MUTATION: in `admit_projection_column`, return `Field::new(name, emitted,
    // field.is_nullable())` instead of forcing `true`. Observed: this test fails by name -- "an
    // admitted projection must not be able to lose a NULL" panics at
    // `engine/src/attributes.rs:594`. Reverted.
    #[test]
    fn every_admitted_projection_column_comes_back_nullable_whatever_the_source_said() {
        // A source NULL is a value; a schema that could not carry it would force a substitution.
        let schema = Fields::from(vec![
            Field::new("id", DataType::UInt64, false),
            Field::new("geometry", DataType::Binary, false),
            Field::new("zone", DataType::Utf8, false),
        ]);
        let out = admit_projection(&["zone".to_string()], &schema, "geometry", "id").unwrap();
        assert!(out.fields()[0].is_nullable(), "an admitted projection must not be able to lose a NULL");
    }
}
