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
        // A dictionary is admitted exactly when its value type is, and is emitted as the value
        // type. A dictionary over a refused value type falls through to the final arm below and
        // carries no refusal text of its own (C-a): no owner renders one. `type_check` discards
        // this detail, `predicate.rs::filterable_column_type` refuses a dictionary by name before
        // this gate runs, and publish renders its own dictionary text from the carried source type
        // (`From<ProjectionError> for EngineError`).
        D::Dictionary(_, value) if is_admitted_scalar(value) => Ok(value.as_ref().clone()),
        // **X1 (Amendment 5, row 5.5; O2).** This is the filter path's own refusal text for a
        // type the filter namespace still refuses (`predicate.rs::filterable_column_type` renders
        // this `Display` verbatim as `FilterError::ColumnNotFilterable`'s `reason`), and F7 / round
        // 17 item 3 keep every such text byte for byte. Byte-copied by script from main's rendering
        // at `d6d9862` (`engine/src/attributes.rs`'s own former final arm there) — never the live
        // admissible set's own list, which now differs from this text on purpose (O2: "each owner
        // renders its own text").
        other => Err(EngineError::AttributeUnpublishable {
            column: column.to_string(),
            detail: format!(
                "type is {other}, which is not in the admissible set for a published attribute \
                 (utf8, boolean, the 8/16/32/64-bit integers, float64)"
            ),
        }),
    }
}

/// Whether `ty` is one of the scalar (non-dictionary) admitted types — used only to decide a
/// dictionary's own value type inside [`admit_attribute_type`].
fn is_admitted_scalar(ty: &DataType) -> bool {
    use DataType as D;
    matches!(
        ty,
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
            | D::Float32
    )
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
    ///
    /// `source_type` (X4; O1(c), O2) is the same source type as a typed fact rather than a
    /// pre-rendered string, so [`From<ProjectionError> for EngineError`](#impl-From<ProjectionError>-for-EngineError)
    /// (publish's own renderer) can tell a still-refused `Dictionary` and a still-refused `Float32`
    /// apart from every other refused type and render each one's own byte-for-byte "today's text"
    /// (O2), without a second, fallible lookup back into the file schema.
    TypeNotAdmitted {
        column: String,
        arrow_type: String,
        source_type: DataType,
        detail: String,
    },
    /// The column's own bound name does not round-trip through this engine's admission (§10
    /// Amendment 12, 12.1(c)): DuckDB's Arrow export truncated it to a different name than the one
    /// DESCRIBE binds it by, or it carries U+0000 outright. Checked first among the per-column
    /// rules — before geometry, identity, duplicate and type — because no other rule can be
    /// trusted to mean what it says about a name nothing can address.
    ColumnNameNotAddressable { column: String, detail: String },
}

impl std::fmt::Display for ProjectionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::TooManyColumns { limit, saw } => write!(
                f,
                "refused: the declared projection names {saw} column(s), over the declared ceiling \
                 of {limit}"
            ),
            Self::ColumnUnknown {
                column,
                known_columns,
            } => {
                // `known_columns` is comma-joined in the `candidate_columns` form on the wire
                // (`kernel::skp::projection_error_of`); a name that contains a comma is omitted
                // there, so this Display states that rather than silently listing a superset of
                // what the wire field carries (round 17 item 4, stop item 8). Every name is
                // rendered through `render_visible_escape` (§8 item 34; N-1a) — the wire field
                // itself (`known_columns_wire_field`) stays raw (OPEN A12-a).
                let (kept, omitted): (Vec<String>, usize) = {
                    let kept: Vec<String> = known_columns
                        .iter()
                        .filter(|c| !c.contains(','))
                        .map(|c| crate::addressability::render_visible_escape(c))
                        .collect();
                    let omitted = known_columns.len() - kept.len();
                    (kept, omitted)
                };
                write!(
                    f,
                    "refused: `{}` is not a column this dataset carries (it has: {}",
                    crate::addressability::render_visible_escape(column),
                    kept.join(", ")
                )?;
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
            // C-c: the reserved-name fact, true both when the file carries no column named `id`
            // (O8) and when it carries an unrelated one under a mapped identity (X3). Publish never
            // renders this arm: its text is `From<ProjectionError> for EngineError`'s, main's bytes.
            Self::ColumnIsIdentity { column, id_column } => write!(
                f,
                "refused: `{column}` is the name reserved for the identity column in every batch; \
                 this dataset's identity is mapped from `{id_column}`"
            ),
            Self::ColumnDuplicated { column } => {
                write!(
                    f,
                    "refused: `{column}` is named twice in the declared projection"
                )
            }
            Self::TypeNotAdmitted {
                column,
                arrow_type,
                detail,
                ..
            } => {
                write!(f, "refused: `{column}` is {arrow_type} — {detail}")
            }
            Self::ColumnNameNotAddressable { column, detail } => write!(
                f,
                "refused: `{}` is not addressable — {detail}",
                crate::addressability::render_visible_escape(column)
            ),
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
    known_columns
        .iter()
        .filter(|c| !c.contains(','))
        .cloned()
        .collect::<Vec<_>>()
        .join(",")
}

/// Serves publish, whose refusals are typed as [`EngineError`] rather than [`ProjectionError`]
/// (`kernel/src/publish`'s `?` on `Dataset::resolve_projection`). Every text below is
/// [`admit_attribute_type`]'s and [`admit_projection`]'s own **former** wording, kept byte for byte
/// (O1, O2) — this function exists so a rename or a widening on the live path does not silently
/// change publish's own refusal text.
impl From<ProjectionError> for EngineError {
    fn from(e: ProjectionError) -> Self {
        match e {
            ProjectionError::TooManyColumns { limit, saw } => EngineError::CeilingExceeded {
                ceiling: "MAX_PROJECTED_ATTRIBUTES",
                limit,
                saw,
            },
            ProjectionError::ColumnUnknown {
                column,
                known_columns,
            } => {
                // §8 item 34; N-1a: every name in the list is rendered through
                // `render_visible_escape` before it reaches this detail text.
                let rendered: Vec<String> = known_columns
                    .iter()
                    .map(|c| crate::addressability::render_visible_escape(c))
                    .collect();
                EngineError::AttributeUnpublishable {
                    column: column.clone(),
                    detail: format!(
                        "the file has no such column (it has: {})",
                        rendered.join(", ")
                    ),
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
            // **X4 (Amendment 5, row 5.5; O1(c), O2).** `source_type` is the typed fact
            // [`ProjectionError::TypeNotAdmitted`] carries; this renders publish's own
            // byte-for-byte "today's text" from it directly, never from a second lookup. A
            // `Dictionary` gets the dictionary text and a `Float32` gets the float32 text —
            // both byte-copied by script from main's rendering at `d6d9862` (`admit_attribute_
            // type`'s **former** `Dictionary`/`Float32` arms there; `kernel/src/publish/mod.rs`'s
            // `admit_bundle_format` renders the identical two texts for its own, later,
            // bundle-format restriction) — anything else gets the final-arm text X1 restored.
            // `Float32` is unreachable here today (the live gate always admits it), kept for
            // exhaustiveness against the day the admitted set narrows again.
            ProjectionError::TypeNotAdmitted {
                column,
                source_type,
                ..
            } => {
                use DataType as D;
                let detail = match &source_type {
                    D::Dictionary(..) => format!(
                        "type is {source_type}. A dictionary index is an ordinal, and decoding one \
                         to publish it would be a conversion the caller did not ask for. The bundle \
                         format carries no dictionary batches"
                    ),
                    D::Float32 => "type is Float32. The bundle carries doubles; widening f32 to f64 \
                                   is exact but it is still a conversion this engine was not asked \
                                   to perform, and a consumer reading `float64` would be told the \
                                   source held one"
                        .to_string(),
                    other => format!(
                        "type is {other}, which is not in the admissible set for a published \
                         attribute (utf8, boolean, the 8/16/32/64-bit integers, float64)"
                    ),
                };
                EngineError::AttributeUnpublishable {
                    column: column.clone(),
                    detail,
                }
            }
            // **§10 Amendment 12, 12.1(e).** `detail` is already
            // [`crate::addressability::NotAddressableFact::render`]'s own text — carried verbatim,
            // never re-derived, the same discipline `TypeNotAdmitted`'s arm above keeps.
            ProjectionError::ColumnNameNotAddressable { column, detail } => {
                EngineError::AttributeUnpublishable { column, detail }
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
    /// Each admitted column's **source** type, parallel to `fields` (C-b): what the file holds,
    /// where `fields` holds what is emitted. The two differ only for a dictionary.
    source_types: Vec<DataType>,
}

impl AdmittedProjection {
    pub fn fields(&self) -> &[Field] {
        &self.fields
    }
    /// Each admitted column's **source** type, in the same order as [`Self::fields`]. Carried from
    /// admission so publish's bundle-format restriction (`kernel/src/publish`'s
    /// `preflight_pinless_parts`, its product caller) refuses by the type the file holds, with no
    /// second lookup into the file schema (C-b).
    pub fn source_types(&self) -> &[DataType] {
        &self.source_types
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

/// Name, then geometry, then identity — the first three of the four per-column rules (§10
/// Amendment 12, 12.1(d): the per-column order is now name, geometry, identity, duplicate, type).
/// Shared by [`admit_projection_column`] (which has no duplicate concept of its own — a single
/// column, alone) and [`admit_projection`]'s own per-column pass, which interleaves the duplicate
/// check between this and the type check.
///
/// **This is projection's one site for [`crate::addressability::not_addressable_for_field`]**
/// (12.4 item 25): both callers used to check it themselves before calling this function; moving
/// the check inside it means projection reaches (c) at exactly one place, checked before geometry
/// or identity can be asked about a name nothing can address.
///
/// **The reserved wire identity name `id` refuses here too, whatever `identity_column` is** (X3):
/// `admit_projection`'s own name-resolution pass already special-cases a *declared* `id` before this
/// runs (O8), but `kernel::skp::describe_dataset`'s `projectable` fact calls [`admit_projection_column`]
/// directly, one column at a time, and never goes through that pass — so without this, a file that
/// carries an unrelated column literally named `id` (identity mapped elsewhere) could disagree with
/// `viewport_query`'s own admission of the reserved name (K-5's mapped-to-`i64` case).
fn check_geometry_and_identity(
    field: &Field,
    geometry_column: &str,
    identity_column: &str,
) -> std::result::Result<(), ProjectionError> {
    if let Some(fact) = crate::addressability::not_addressable_for_field(field) {
        return Err(ProjectionError::ColumnNameNotAddressable {
            column: field.name().clone(),
            detail: fact.render(),
        });
    }
    let name = field.name().as_str();
    if name == geometry_column {
        return Err(ProjectionError::ColumnIsGeometry {
            column: name.to_string(),
        });
    }
    if name == crate::envelope::ID_COLUMN || name == identity_column {
        return Err(ProjectionError::ColumnIsIdentity {
            column: name.to_string(),
            id_column: identity_column.to_string(),
        });
    }
    Ok(())
}

/// The fourth per-column rule, type, applied after geometry/identity/duplicate have already passed.
/// Returns the field as it would be **emitted**: nullable by construction (see the module doc), and
/// carrying the emitted type (the dictionary's value type, where the source was a dictionary).
fn type_check(field: &Field) -> std::result::Result<Field, ProjectionError> {
    let name = field.name().as_str();
    let emitted = admit_attribute_type(name, field.data_type()).map_err(|_| {
        ProjectionError::TypeNotAdmitted {
            column: name.to_string(),
            arrow_type: field.data_type().to_string(),
            source_type: field.data_type().clone(),
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
    check_geometry_and_identity(field, geometry_column, identity_column)?;
    type_check(field)
}

/// Validate a caller's declared projection against the dataset's own columns, in the declared order
/// (ADR-023 §3; X2's fix — two full passes, never interleaved):
///
/// 1. `names.len()` over [`MAX_PROJECTED_ATTRIBUTES`] refuses before any name is resolved.
/// 2. **Pass 1 — name resolution, every declared name, in declared order.** The reserved wire
///    identity name `id` is recognised **before** the unknown-column check (round 17 item 4, stop
///    item 8 / O8) — so a mapped identity's file, which carries no column literally named `id`,
///    still refuses a request for `id` as an identity collision rather than as an unknown column.
///    This pass resolves every name to its schema field before any per-column rule below runs, so a
///    later name's resolution failure (e.g. unknown) is reported even when an earlier name would
///    have failed a per-column rule instead (X2).
/// 3. **Pass 2 — per-column rules, column by column, in declared order** — geometry, identity (the
///    mapped identity's own **source** column, e.g. `parcel_key`), duplicate, type — via
///    [`check_geometry_and_identity`] and [`type_check`], with the duplicate check run between them.
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

    // Pass 1: every declared name is resolved against the dataset's own schema, in declared order,
    // before any per-column rule runs (X2).
    let mut resolved: Vec<&Field> = Vec::with_capacity(names.len());
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
        let field = file_schema
            .iter()
            .find(|f| f.name() == name)
            .ok_or_else(|| ProjectionError::ColumnUnknown {
                column: name.to_string(),
                known_columns: file_schema.iter().map(|f| f.name().clone()).collect(),
            })?;
        resolved.push(field);
    }

    // Pass 2: per-column rules, column by column, in declared order — geometry, identity,
    // duplicate, type (X2). Duplicate detection needs state across the whole declared list, so it
    // runs here, interleaved between [`check_geometry_and_identity`] and [`type_check`], rather than
    // inside [`admit_projection_column`], which is shared with `projectable`'s single-column
    // question and knows nothing about a caller's whole list.
    let mut seen: Vec<&str> = Vec::with_capacity(resolved.len());
    let mut out = Vec::with_capacity(resolved.len());
    let mut source_types = Vec::with_capacity(resolved.len());
    for field in resolved {
        let name = field.name().as_str();
        // **§10 Amendment 12, 12.1(d): the per-column order is now name, geometry, identity,
        // duplicate, type.** [`check_geometry_and_identity`] checks the name first, so projection
        // reaches (c) at exactly one site (12.4 item 25) — the same order [`admit_projection_column`]
        // applies.
        check_geometry_and_identity(field, geometry_column, identity_column)?;
        if seen.contains(&name) {
            return Err(ProjectionError::ColumnDuplicated {
                column: name.to_string(),
            });
        }
        seen.push(name);
        out.push(type_check(field)?);
        source_types.push(field.data_type().clone());
    }
    Ok(AdmittedProjection {
        fields: out,
        source_types,
    })
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

    /// E-6: `names_resolve_before_per_column_rules_in_declared_order` (X2, row 5.6 — the input is
    /// now `["geometry", "nope"]`, not `["nope", "geometry"]`). `geometry` resolves fine in pass 1
    /// (it exists in the schema) and would only fail pass 2's own per-column geometry check; `nope`
    /// fails pass 1's own resolution. Because pass 1 runs to completion over every declared name
    /// before pass 2 begins, `nope`'s resolution failure is reported even though `geometry` is
    /// first in the declared order and would fail a per-column rule of its own.
    // RECORDED MUTATION: interleave — replace `admit_projection`'s two passes with the single
    // former loop (resolve, then immediately run `check_geometry_and_identity`/duplicate/type on
    // that same name, before moving to the next). Observed: this test fails by name -- "expected
    // nope's own resolution failure, got Err(ColumnIsGeometry { column: \"geometry\" })" at
    // `engine/src/attributes.rs:625` (the interleaved loop fails on `geometry`'s own per-column
    // rule before ever reaching `nope`). Reverted.
    #[test]
    fn names_resolve_before_per_column_rules_in_declared_order() {
        let schema = native_schema();
        match admit_projection(
            &["geometry".to_string(), "nope".to_string()],
            &schema,
            "geometry",
            "id",
        ) {
            Err(ProjectionError::ColumnUnknown { column, .. }) => assert_eq!(column, "nope"),
            other => panic!("expected nope's own resolution failure, got {other:?}"),
        }
    }

    /// The multi-failure order table (X2, row 5.6): count, then names (pass 1, whole list), then
    /// per-column rules (pass 2, column by column) — geometry, identity, duplicate, type.
    /// Mutation: interleave (see `names_resolve_before_per_column_rules_in_declared_order`'s own
    /// recorded mutation) — the `["geometry", "id"]` and `["d32", "geometry"]` cases below then
    /// fail by name too, for the same reason.
    #[test]
    fn the_multi_failure_order_is_count_then_names_then_per_column_rules() {
        let schema = native_schema();
        // Both names resolve in pass 1 (`geometry` and `nope`... `nope` does not resolve): the
        // unresolved name wins over `geometry`'s own per-column failure.
        assert!(matches!(
            admit_projection(&["geometry".to_string(), "nope".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::ColumnUnknown { column, .. }) if column == "nope"
        ));
        // `id` is recognised as the reserved identity name during pass 1 itself (before the
        // unknown check even runs), so it wins over `geometry`'s own per-column failure too.
        assert!(matches!(
            admit_projection(&["geometry".to_string(), "id".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::ColumnIsIdentity { .. })
        ));
        // Both `d32` and `geometry` resolve in pass 1 (both are real columns); pass 2 then runs
        // per-column rules in declared order, so `d32`'s own type failure fires first.
        assert!(matches!(
            admit_projection(&["d32".to_string(), "geometry".to_string()], &schema, "geometry", "id"),
            Err(ProjectionError::TypeNotAdmitted { column, .. }) if column == "d32"
        ));
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

    /// X3 (row 5.6; K-5's mapped-to-`i64` case): `admit_projection_column` refuses the reserved wire
    /// identity name `id` even when this dataset's own identity is declared mapped to a different
    /// column — so `projectable` agrees with `admit_projection`'s own name-resolution pass, which
    /// already refuses a declared `id` this way (O8) regardless of what the file's own identity
    /// mapping is.
    // RECORDED MUTATION: remove the `name == crate::envelope::ID_COLUMN` arm from
    // `check_geometry_and_identity`, leaving only `name == identity_column`. Observed: this test
    // fails by name -- "the reserved `id` name must refuse even under a mapped identity" panics at
    // `engine/src/attributes.rs` (the call now returns `Ok`, since `id` != `i64`). Reverted.
    #[test]
    fn admit_projection_column_refuses_the_reserved_id_name_even_under_a_mapped_identity() {
        // A file whose identity is mapped to `i64` but which separately carries its own, unrelated
        // `id` column (the shape `predicate.rs::identity_alias_ambiguity` names, and K-5's own new
        // case: `AttributeMode::MultiType` opened with the identity declared mapped to `i64`).
        let schema = Fields::from(vec![
            Field::new("id", DataType::UInt64, false),
            Field::new("geometry", DataType::Binary, false),
            Field::new("i64", DataType::Int64, false),
        ]);
        let id_field = schema.iter().find(|f| f.name() == "id").unwrap();
        assert!(
            admit_projection_column(id_field, "geometry", "i64").is_err(),
            "the reserved `id` name must refuse even under a mapped identity"
        );
        assert!(matches!(
            admit_projection_column(id_field, "geometry", "i64"),
            Err(ProjectionError::ColumnIsIdentity { .. })
        ));
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

    /// X4 (row 5.6; O1(c), O2): `From<ProjectionError> for EngineError`'s `TypeNotAdmitted` arm
    /// renders a `Dictionary` source type's own byte-copied dictionary text, and any other
    /// still-refused type's byte-copied final-arm text — proven directly against the `From` impl
    /// (`resolve_projection`'s own conversion), since no live `Dataset` can ever construct a
    /// `TypeNotAdmitted` over a `Dictionary` source (H2: unreachable through `read_parquet`).
    // RECORDED MUTATION: in the `From<ProjectionError> for EngineError` impl's `TypeNotAdmitted`
    // arm, replace the `match &source_type { ... }` with the single final-arm branch unconditionally
    // (`From` renders the final-arm text for every `TypeNotAdmitted`). Observed: this test fails by
    // name -- "a Dictionary source_type must render today's dictionary text" panics at
    // `engine/src/attributes.rs` (the detail reads "type is Dictionary(...), which is not in the
    // admissible set for a published attribute ..." instead of the dictionary text). Reverted.
    #[test]
    fn from_projection_error_renders_a_dictionary_sources_own_text_and_the_final_arm_otherwise() {
        let dict_ty = DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Date32));
        let dict_err = ProjectionError::TypeNotAdmitted {
            column: "cat".to_string(),
            arrow_type: dict_ty.to_string(),
            source_type: dict_ty.clone(),
            detail: "[B1 close placeholder]".to_string(),
        };
        match EngineError::from(dict_err) {
            EngineError::AttributeUnpublishable { column, detail } => {
                assert_eq!(column, "cat");
                assert_eq!(
                    detail,
                    format!(
                        "type is {dict_ty}. A dictionary index is an ordinal, and decoding one to \
                         publish it would be a conversion the caller did not ask for. The bundle \
                         format carries no dictionary batches"
                    ),
                    "a Dictionary source_type must render today's dictionary text"
                );
            }
            other => panic!("expected AttributeUnpublishable, got {other:?}"),
        }

        let other_err = ProjectionError::TypeNotAdmitted {
            column: "d32".to_string(),
            arrow_type: "Date32".to_string(),
            source_type: DataType::Date32,
            detail: "[B1 close placeholder]".to_string(),
        };
        match EngineError::from(other_err) {
            EngineError::AttributeUnpublishable { column, detail } => {
                assert_eq!(column, "d32");
                assert_eq!(
                    detail,
                    "type is Date32, which is not in the admissible set for a published attribute \
                     (utf8, boolean, the 8/16/32/64-bit integers, float64)",
                    "any other still-refused type must render the final-arm text"
                );
            }
            other => panic!("expected AttributeUnpublishable, got {other:?}"),
        }
    }

    /// C-a (gate 2): a dictionary over a refused value type carries no refusal text of its own in
    /// the gate, since no owner renders one. It takes the final arm's text, with its own source type.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): restore the
    // `Dictionary` arm's own refusal text (its text at `273a79d`). Observed: this test fails by
    // name -- "a refused dictionary must carry the final arm's text, not a text of its own" at
    // `engine/src/attributes.rs:818`. Reverted.
    #[test]
    fn a_refused_dictionary_takes_the_final_arms_text_and_no_text_of_its_own() {
        let ty = DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Date32));
        match admit_attribute_type("cat", &ty) {
            Err(EngineError::AttributeUnpublishable { column, detail }) => {
                assert_eq!(column, "cat");
                assert_eq!(
                    detail,
                    format!(
                        "type is {ty}, which is not in the admissible set for a published attribute \
                         (utf8, boolean, the 8/16/32/64-bit integers, float64)"
                    ),
                    "a refused dictionary must carry the final arm's text, not a text of its own"
                );
            }
            other => panic!("expected AttributeUnpublishable, got {other:?}"),
        }
    }

    /// C-b (gate 2): admission carries each column's **source** type beside its emitted field, so
    /// publish's bundle-format restriction reads the type the file holds without a second lookup.
    /// A dictionary is the one type whose source and emitted types differ.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): `admit_projection`
    // pushes the emitted type into `source_types`. Observed: this test fails by name -- "each
    // admitted column must carry the type the file holds, not the emitted one" at
    // `engine/src/attributes.rs:847`. Reverted.
    #[test]
    fn an_admitted_projection_carries_each_columns_source_type_beside_its_emitted_field() {
        let dict = DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8));
        let schema = Fields::from(vec![
            Field::new("id", DataType::UInt64, false),
            Field::new("geometry", DataType::Binary, false),
            Field::new("cat", dict.clone(), true),
            Field::new("f32", DataType::Float32, true),
        ]);
        let admitted =
            admit_projection(&["cat".to_string(), "f32".to_string()], &schema, "geometry", "id").unwrap();
        let emitted: Vec<DataType> = admitted.fields().iter().map(|f| f.data_type().clone()).collect();
        assert_eq!(emitted, vec![DataType::Utf8, DataType::Float32]);
        assert_eq!(
            admitted.source_types(),
            &[dict, DataType::Float32],
            "each admitted column must carry the type the file holds, not the emitted one"
        );
    }

    /// C-c (gate 2): the reserved `id` under a mapped identity. The wire's text
    /// (`ProjectionError`'s `Display`, which `kernel::skp::projection_error_of` renders for
    /// `skp.projection_column_is_identity`) states the reserved-name fact. Publish's text
    /// (`From<ProjectionError> for EngineError`) stays main's byte for byte (O2); the expected
    /// detail below is byte-copied by script from main's rendering at `46ff585`
    /// (`engine/src/attributes.rs`'s identity arm in `admit_projection` there).
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): publish's `From` arm
    // for `ColumnIsIdentity` renders the wire's reworded text. Observed: this test fails by name --
    // "publish's identity text must stay main's byte for byte" at `engine/src/attributes.rs:871`.
    // Reverted.
    #[test]
    fn the_reserved_id_refusal_states_the_reserved_name_on_the_wire_and_keeps_publishs_text() {
        let e = ProjectionError::ColumnIsIdentity { column: "id".to_string(), id_column: "i64".to_string() };
        assert_eq!(
            e.to_string(),
            "refused: `id` is the name reserved for the identity column in every batch; this \
             dataset's identity is mapped from `i64`"
        );
        match EngineError::from(e) {
            EngineError::AttributeUnpublishable { column, detail } => {
                assert_eq!(column, "id");
                assert_eq!(
                    detail,
                    "this is the dataset's identity column; it already travels as `id`, and a second identity-shaped column is two names for one fact",
                    "publish's identity text must stay main's byte for byte"
                );
            }
            other => panic!("expected AttributeUnpublishable, got {other:?}"),
        }
    }
}
