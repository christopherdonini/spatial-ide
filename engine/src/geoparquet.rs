// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Parsing of the GeoParquet `geo` file-level metadata, and the **format-governed** admission
//! rules that read from it.
//!
//! Pure functions over the JSON document, kept apart from the DuckDB read so the admission rules
//! can be tested without a database. What this file establishes — CRS identity, the CRS definition,
//! the declared axis order, the **data's** axis order, the covering bbox column — is what `crs.rs`
//! then admits or refuses.
//!
//! **This module is the only site that establishes the data's axis order.** `crs.rs` decides who
//! supplied a CRS (file, caller, or — since Brief A P1 — the format's own rule); it never decides
//! what order the coordinates are in.
//!
//! **What changed at Brief A P1, and what did not.** An *absent* `crs` key is admitted as
//! OGC:CRS84 under GeoParquet's own published rule, whose text is pinned in-tree
//! (`engine/ADMISSION-PREREGISTRATION.md` Appendix A), and the admission is recorded with the
//! provenance `crs:format-default`, the spec version, and the pinned-rule reference it relied on.
//! An explicit `"crs": null` is **unchanged**: the file says its CRS is undefined or unknown, and
//! no rule answers for it — `CrsUndeclared` unless the caller asserts. A file declaring a spec
//! version whose governing text is not pinned in this tree takes **no** format rule at all: reading
//! a rule and remembering one are different things (`docs/01` principle 8).

use serde_json::Value;

use crate::crs::AxisOrder;
use crate::error::{EngineError, Result};

/// The GeoParquet versions whose governing `crs` text is pinned in this tree — **R-C1's
/// precondition** (`engine/ADMISSION-PREREGISTRATION.md` §2b).
///
/// The pin is `engine/ADMISSION-PREREGISTRATION.md` Appendix A (URL, commit, UTC retrieval time,
/// sha256, byte count, verbatim quote, entry-51 discipline). A file declaring any other version —
/// including `2.0.0`, which has no release tag to pin and is pinned there only at `v2.0.0-rc.1` and
/// at `main` — takes no format rule from this module.
pub const PINNED_SPEC_VERSIONS: [&str; 2] = ["1.0.0", "1.1.0"];

/// Where the pinned text lives, carried into the record so a reader of a `describe` can find the
/// bytes the rule was read from rather than take the rule on this engine's word.
pub const PINNED_RULE_RECORD: &str = "engine/ADMISSION-PREREGISTRATION.md#appendix-a";

/// The CRS an absent `crs` key resolves to, by the format's own rule.
pub const FORMAT_DEFAULT_CRS: &str = "OGC:CRS84";

/// Rule fragment for the absent-key default. Pinned at `ADMISSION-PREREGISTRATION.md:322` (1.0.0)
/// and `:351` (1.1.0); 1.1.0's sentence reads, verbatim:
///
/// > If the `crs` key does not exist, all coordinates in the geometries MUST use longitude,
/// > latitude based on the WGS84 datum, and the default value is
/// > [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) for CRS-aware implementations. Note
/// > that a missing `crs` key has different meaning than a `crs` key set to `null` (see below).
const RULE_CRS_ABSENT_DEFAULT: &str = "crs-absent-default";

/// Rule fragment for the WKB coordinate-order override. Pinned at
/// `spikes/item8-crs-catalog-extension/README.md:62-65`, verbatim:
///
/// > **Coordinate axis order** — The axis order of the coordinates in WKB stored in a GeoParquet
/// > follows the de facto standard for axis order in WKB and is therefore always (x, y) where x is
/// > easting or longitude and y is northing or latitude. This ordering explicitly overrides the
/// > axis order as specified in the CRS. This follows the precedent of GeoPackage, see the note in
/// > their spec.
const RULE_COORDINATE_AXIS_ORDER: &str = "coordinate-axis-order";

/// The most rows the `sample` sanity level reads — **declared, not discovered** (ADR-010 rule 6),
/// `engine/ADMISSION-PREREGISTRATION.md` §7: one row group at the row-group figure the tree already
/// records. The read is of the covering bbox columns only, never of the WKB.
pub const SANITY_SAMPLE_MAX_ROWS: usize = 8_192;

/// The coordinate domain of OGC:CRS84, in its own units.
pub const CRS84_MAX_ABS_X: f64 = 180.0;
/// See [`CRS84_MAX_ABS_X`].
pub const CRS84_MAX_ABS_Y: f64 = 90.0;

/// Where the dataset's CRS came from — **a recorded fact, never a judgement** (the proposed ADR-015
/// Amendment 1, item 5; Brief A settled boundary 1).
///
/// None of these values is an equivalence finding, and none says anything about whether the file's
/// producer conformed to the rule that was read.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CrsProvenance {
    /// The file's own `crs` member.
    Declared,
    /// A caller's assertion over a file that declares nothing (unchanged by this cut).
    Asserted,
    /// The format's published rule for an absent `crs` key.
    FormatDefault,
}

impl CrsProvenance {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Declared => "crs:declared",
            Self::Asserted => "crs:asserted",
            Self::FormatDefault => "crs:format-default",
        }
    }
}

/// Where the **data's** axis order came from. The definition's own declared order is a separate
/// recorded fact and is never discarded (boundary 1).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AxisProvenance {
    /// Established from the CRS definition — the file's, or the caller's assertion.
    Declared,
    /// Established from the format's specification, with its version.
    FormatOverride,
}

impl AxisProvenance {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Declared => "axis:declared",
            Self::FormatOverride => "axis:format-override",
        }
    }
}

/// What the range check was decided from at this open — **an assurance level, not a verdict**
/// (boundary 2; R-S1).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum SanityLevel {
    /// Footer-resident facts only: the geometry column's `bbox` member, or Parquet statistics on
    /// the covering bbox columns.
    Metadata,
    /// The **first row group** of the covering bbox columns, capped at [`SANITY_SAMPLE_MAX_ROWS`],
    /// and nothing else (R-S1; `ADMISSION-PREREGISTRATION.md` §13 B). The recorded reason names the
    /// row group's own row count, or the capped form where the cap is what bounded the read.
    Sample,
    /// Neither was available, or no format rule was applied. Recorded as `none`; the reason says
    /// which. **Not checked — never "passed".**
    NotChecked,
}

impl SanityLevel {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Metadata => "metadata",
            Self::Sample => "sample",
            Self::NotChecked => "none",
        }
    }
}

/// The coordinate unit an admitted CRS definition declares **on its own coordinate-system axes** —
/// a recorded fact, read and never inferred.
///
/// `engine/ADMISSION-PREREGISTRATION.md` §14 item I fixes where it is read from and what the
/// unreadable cases record; the proposed ADR-013 Amendment 1 §2 is the rule it serves ("the unit is
/// read from the CRS definition and recorded as a fact of the instance — never inferred from the
/// identifier string […], and never defaulted" — the elision is its `docs/05` parenthetical).
///
/// **`Unestablished` is not a refusal and not an instance.** It is what the record says when the
/// two axes disagree, when the `unit` member is missing, when its form is one this reader takes no
/// name from, or when there was no definition to read at all — the absent-key format-default
/// admission being the last case, which carries no definition (DECISIONS-PENDING entry 81 is open
/// and this piece does not pre-empt it).
///
/// **Nothing here is normalized.** A name that is neither `degree` nor `metre` is carried in
/// [`Self::Named`] exactly as the definition spells it; folding case or mapping synonyms would be
/// this reader deciding that two spellings mean one unit, which is a definitional-equivalence
/// judgement (`docs/05`) it is not entitled to make.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum CoordinateUnit {
    /// The angular degree — both axes, by name.
    Degree,
    /// The linear metre — both axes, by name.
    Metre,
    /// Another name, both axes agreeing, recorded exactly as read.
    Named(String),
    /// No unit was established. See the type's own note: not a refusal, not an instance.
    Unestablished,
}

impl CoordinateUnit {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Degree => "degree",
            Self::Metre => "metre",
            Self::Named(name) => name.as_str(),
            Self::Unestablished => "unestablished",
        }
    }

    /// The name as read, mapped onto the two spellings this engine names and nothing else.
    fn from_name(name: String) -> Self {
        match name.as_str() {
            "degree" => Self::Degree,
            "metre" => Self::Metre,
            _ => Self::Named(name),
        }
    }
}

/// Where a recorded [`CoordinateUnit`] was read from.
///
/// **One class, because this piece can reach exactly one.** The unit is read from the admitted
/// PROJJSON's coordinate-system axes or it is not established; there is no format rule that supplies
/// a unit, no catalog lookup and no inference from an identifier. A second class would have to be
/// something this engine actually did.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CoordinateUnitSource {
    /// A CRS definition was there to read, and its axes are what was read.
    Definition,
}

impl CoordinateUnitSource {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Definition => "unit:definition",
        }
    }
}

/// The three states of the `crs` key, which are **three different facts** and must not collapse
/// into two: 1.1.0 says so in its own words (`ADMISSION-PREREGISTRATION.md:351`, "a missing `crs`
/// key has different meaning than a `crs` key set to `null`").
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CrsKeyState {
    /// The key is present and is an object.
    Declared,
    /// The key is present and is `null` — the file says its CRS is undefined or unknown.
    ExplicitNull,
    /// The key is not there at all.
    Absent,
}

/// What the format's rules established for one file, before any caller assertion is consulted.
///
/// `admissible_crs` is what `crs::admit` is handed as "what the file declares", and **its axis
/// order is the data's order**, not necessarily the definition's. `declared_axis_order` retains the
/// definition's own order whenever a definition existed, so a later reprojection or export still
/// has the file fact (boundary 1: never discarded).
#[derive(Clone, Debug, Default)]
pub struct FormatSemantics {
    pub admissible_crs: Option<(String, Option<String>, AxisOrder)>,
    pub crs_provenance: Option<CrsProvenance>,
    pub axis_provenance: Option<AxisProvenance>,
    pub declared_axis_order: Option<AxisOrder>,
    pub format_rule_reference: Option<String>,
    /// Set when R-C1's precondition failed on an absent key: the `detail` the existing
    /// `CrsUndeclared` refusal must carry, naming the unpinned version. `None` leaves the refusal
    /// exactly as it is today.
    pub undeclared_detail: Option<String>,
}

/// The admission facts recorded on the envelope for one open — additive to every field that was
/// already there, none of which changes.
#[derive(Clone, Debug)]
pub struct AdmissionRecord {
    pub crs_provenance: CrsProvenance,
    pub axis_provenance: AxisProvenance,
    /// Present whenever a CRS definition existed; absent for the format-default admission, where
    /// there is no definition in the file to retain.
    pub declared_axis_order: Option<AxisOrder>,
    /// `geoparquet:<version>#<rule>` — absent when no format rule was applied.
    pub format_rule_reference: Option<String>,
    /// The unit the admitted definition declares on both of its coordinate-system axes, or
    /// `unestablished`. Read from [`coordinate_unit_from_definition`] and nowhere else.
    pub coordinate_unit: CoordinateUnit,
    /// Present whenever there was a definition to read the unit from — **including where the read
    /// established nothing**. It answers "was a definition consulted", not "was a unit found"; the
    /// second question is `coordinate_unit`'s and the two are different facts.
    pub coordinate_unit_source: Option<CoordinateUnitSource>,
    pub sanity_level: SanityLevel,
    pub sanity_reason: String,
}

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
    ///
    /// The axis order here is **the definition's own**, exactly as it always was. The data's order
    /// is established separately, in [`format_semantics`].
    pub declared_crs: Option<(String, Option<String>, AxisOrder)>,
    pub covering: Option<CoveringBbox>,
    /// Which of the three `crs` states the file is in. Kept apart from `declared_crs`, which
    /// answers only "is there a definition" and cannot tell an absent key from an explicit null.
    pub crs_key: CrsKeyState,
    /// The geometry column's own `bbox` member as `[xmin, ymin, xmax, ymax]`, when it carries one.
    /// Footer-resident, so reading it is not a read of the data.
    pub bbox: Option<[f64; 4]>,
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
        //   key present and null      -> the file states its CRS is undefined or unknown
        //   key absent                -> the format's OGC:CRS84 rule, applied in `format_semantics`
        //                                under R-C1's pinned-version precondition and never here
        let (declared_crs, crs_key) = match col.get("crs") {
            Some(Value::Object(_)) => {
                let crs = col.get("crs").unwrap();
                let axis = axis_order_from_projjson(crs)?;
                (
                    Some((identifier_from_projjson(crs), Some(crs.to_string()), axis)),
                    CrsKeyState::Declared,
                )
            }
            Some(Value::Null) => (None, CrsKeyState::ExplicitNull),
            None => (None, CrsKeyState::Absent),
            // A `crs` that is neither an object nor null is not a definition this reader can use
            // and is not the absent key either; treated as the file having stated something
            // unusable, which is `ExplicitNull`'s outcome (refused, assertion admissible) rather
            // than the format default's.
            Some(_) => (None, CrsKeyState::ExplicitNull),
        };

        let covering = col.get("covering").and_then(|c| c.get("bbox")).map(parse_covering).transpose()?;
        let bbox = col.get("bbox").and_then(parse_bbox_member);

        Ok(Self {
            version,
            primary_column,
            encoding,
            geometry_types,
            declared_crs,
            covering,
            crs_key,
            bbox,
        })
    }
}

/// The column metadata's `bbox` member, as `[xmin, ymin, xmax, ymax]`.
///
/// GeoParquet writes four values in 2D and six when a z range is carried
/// (`[xmin, ymin, zmin, xmax, ymax, zmax]`); anything else is not a shape this reader takes a fact
/// from, and the member is treated as absent rather than reinterpreted.
fn parse_bbox_member(bbox: &Value) -> Option<[f64; 4]> {
    let arr = bbox.as_array()?;
    let n: Vec<f64> = arr.iter().filter_map(Value::as_f64).collect();
    match (arr.len(), n.len()) {
        (4, 4) => Some([n[0], n[1], n[2], n[3]]),
        (6, 6) => Some([n[0], n[1], n[3], n[4]]),
        _ => None,
    }
}

/// **R-C1…R-C5** (`engine/ADMISSION-PREREGISTRATION.md` §2b): what the format's own rules establish
/// for this file, before any caller assertion is consulted.
///
/// Rule by rule:
///
/// - **R-C1** the rules below apply only when the file's declared `geo.version` is one whose
///   governing text is pinned in-tree ([`PINNED_SPEC_VERSIONS`]). A file declaring anything else
///   takes no format rule; with an absent key it carries the `detail` that names the version, and
///   the existing `CrsUndeclared` refusal is what the caller sees.
/// - **R-C2** absent key → OGC:CRS84, `crs:format-default`, with the version and the pinned-rule
///   reference.
/// - **R-C3** explicit `null` → nothing is established here, exactly as before.
/// - **R-C4** a declared definition whose own axis order is not x-first → the **data** order comes
///   from the format's WKB rule ([`data_order_under_wkb_rule`]), `axis:format-override`, and the
///   definition's declared order is retained beside it.
/// - **R-C5** a declared x-first definition → admitted as declared, `axis:declared`, no rule
///   reference.
///
/// Nothing here is a statement about the file's producer: applying a format rule records what the
/// *format* states, and a producer that ignored the rule is not convicted or acquitted by it.
pub(crate) fn format_semantics(geo: &GeoMeta) -> FormatSemantics {
    let pinned = PINNED_SPEC_VERSIONS.contains(&geo.version.as_str());
    let reference = |rule: &str| Some(format!("geoparquet:{}#{rule}", geo.version));

    match geo.crs_key {
        CrsKeyState::Declared => {
            let Some((id, def, declared_axis)) = geo.declared_crs.clone() else {
                // `GeoMeta::parse` sets `Declared` only where it also produced a definition, so the
                // two cannot disagree today. If they ever do, the file is treated as having stated
                // something this reader cannot use — `ExplicitNull`'s outcome, refused with an
                // assertion admissible — rather than the open path panicking on a file's contents.
                return FormatSemantics::default();
            };
            if declared_axis.is_x_first() {
                // R-C5.
                FormatSemantics {
                    admissible_crs: Some((id, def, declared_axis)),
                    crs_provenance: Some(CrsProvenance::Declared),
                    axis_provenance: Some(AxisProvenance::Declared),
                    declared_axis_order: Some(declared_axis),
                    format_rule_reference: None,
                    undeclared_detail: None,
                }
            } else if pinned {
                // R-C4. The declared order is retained beside the data order, never replaced by it.
                FormatSemantics {
                    admissible_crs: Some((id, def, data_order_under_wkb_rule(declared_axis))),
                    crs_provenance: Some(CrsProvenance::Declared),
                    axis_provenance: Some(AxisProvenance::FormatOverride),
                    declared_axis_order: Some(declared_axis),
                    format_rule_reference: reference(RULE_COORDINATE_AXIS_ORDER),
                    undeclared_detail: None,
                }
            } else {
                // R-C1: no format rule. The declaration is handed on as it stands, and a non-x-first
                // order meets the same refusal it has always met.
                FormatSemantics {
                    admissible_crs: Some((id, def, declared_axis)),
                    crs_provenance: Some(CrsProvenance::Declared),
                    axis_provenance: Some(AxisProvenance::Declared),
                    declared_axis_order: Some(declared_axis),
                    format_rule_reference: None,
                    undeclared_detail: None,
                }
            }
        }
        // R-C3, unchanged: the file said "I do not know", and no rule may answer for it.
        CrsKeyState::ExplicitNull => FormatSemantics::default(),
        CrsKeyState::Absent => {
            if pinned {
                // R-C2. No definition travels with it: the rule names a CRS, and inventing PROJJSON
                // the file does not carry would be this engine writing a definition it did not read.
                FormatSemantics {
                    admissible_crs: Some((
                        FORMAT_DEFAULT_CRS.to_string(),
                        None,
                        AxisOrder::LongitudeLatitude,
                    )),
                    crs_provenance: Some(CrsProvenance::FormatDefault),
                    axis_provenance: Some(AxisProvenance::FormatOverride),
                    declared_axis_order: None,
                    format_rule_reference: reference(RULE_CRS_ABSENT_DEFAULT),
                    undeclared_detail: None,
                }
            } else {
                FormatSemantics {
                    undeclared_detail: Some(format!(
                        "the `crs` key is absent and `geo.version` is {}, whose text is not pinned \
                         in this tree ({}); no format rule is taken from a specification version \
                         this tree has not read",
                        geo.version, PINNED_RULE_RECORD
                    )),
                    ..FormatSemantics::default()
                }
            }
        }
    }
}

/// The **data's** axis order under GeoParquet's WKB rule — the one site in this engine that
/// establishes it (the proposed ADR-015 Amendment 1, block-on-sight condition 5).
///
/// The pinned passage (`spikes/item8-crs-catalog-extension/README.md:62-65`) states the coordinates
/// in WKB are "always (x, y) where x is easting or longitude and y is northing or latitude", and
/// that this "explicitly overrides the axis order as specified in the CRS". So a definition
/// declaring (northing, easting) or (latitude, longitude) describes a file whose coordinates are
/// stored the other way round, and **the declared order stays on the record** — this function
/// returns the data's order, it does not overwrite anything.
///
/// Nothing is transformed: no coordinate value changes, and `axis_normalization` stays
/// `none-performed`.
fn data_order_under_wkb_rule(declared: AxisOrder) -> AxisOrder {
    match declared {
        AxisOrder::EastingNorthing | AxisOrder::LongitudeLatitude => declared,
        AxisOrder::NorthingEasting => AxisOrder::EastingNorthing,
        AxisOrder::LatitudeLongitude => AxisOrder::LongitudeLatitude,
    }
}

/// Whether a bbox `[xmin, ymin, xmax, ymax]` lies inside OGC:CRS84's own domain.
///
/// **This can convict and can never confirm.** A `false` says the coordinates cannot be
/// longitude/latitude on WGS84, which is what the format-default rule assumed; a `true` says
/// nothing at all about the file. Brief A settled boundary 2, verbatim: *"A projected file inside
/// ±180/±90 is NOT detected by it"*.
pub fn inside_crs84_domain(bbox: [f64; 4]) -> bool {
    let [xmin, ymin, xmax, ymax] = bbox;
    xmin.abs() <= CRS84_MAX_ABS_X
        && xmax.abs() <= CRS84_MAX_ABS_X
        && ymin.abs() <= CRS84_MAX_ABS_Y
        && ymax.abs() <= CRS84_MAX_ABS_Y
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

/// The coordinate unit of an admitted CRS, read from **the definition that was admitted** — the
/// file's own, or a caller's assertion — and `Unestablished` where there is none.
///
/// The second value is the source fact: `Some(Definition)` exactly when a definition was there to
/// read, whatever the read established. The absent-key format-default admission carries no
/// definition (`format_semantics`' R-C2 arm passes `None`), so it records `unestablished` with no
/// source — DECISIONS-PENDING entry 81 is open on whether that admission should yield the instance,
/// and recording a unit it has no definition for would answer that question here.
pub fn coordinate_unit_from_definition(
    definition_json: Option<&str>,
) -> (CoordinateUnit, Option<CoordinateUnitSource>) {
    let Some(text) = definition_json else {
        return (CoordinateUnit::Unestablished, None);
    };
    let Ok(value) = serde_json::from_str::<Value>(text) else {
        // A definition that does not parse is one nothing can be read from. It is not silently a
        // degree: the record says `unestablished`, and the source says a definition was there.
        return (CoordinateUnit::Unestablished, Some(CoordinateUnitSource::Definition));
    };
    (coordinate_unit_from_projjson(&value), Some(CoordinateUnitSource::Definition))
}

/// The unit declared on `coordinate_system.axis[0]` and `coordinate_system.axis[1]`, and on nothing
/// else — `ADMISSION-PREREGISTRATION.md` §14 item I, in code.
///
/// **The three places it must not read from, and why they are traps rather than alternatives.**
/// EPSG:2056's own definition (`engine/src/crs-catalog.json:8`,
/// `engine/tests/data/epsg2056.projjson`) declares `"unit": "degree"` on four of its
/// `conversion.parameters` and on both axes of its `base_crs` (six occurrences), while the CRS it defines has
/// `metre` axes — so a reader consulting either would call a projected metre CRS a degrees
/// instance. The `id` is the third: `docs/05` decides CRS identity by comparing definitions and
/// never by name-string comparison, and a unit taken from `EPSG:2056` or `OGC:CRS84` would be
/// exactly that comparison (the proposed ADR-013 Amendment 1's block-on-sight 8).
///
/// **Both forms PROJJSON writes are read, by `name`.** `"unit": "degree"` and
/// `"unit": { "type": "AngularUnit", "name": "degree", "conversion_factor": … }` are the same
/// declaration written two ways; a conversion factor is a number this function does not read, and
/// no arithmetic is performed on anything here.
///
/// Disagreeing axes, a missing member, a form carrying no name, or fewer than two axes all record
/// [`CoordinateUnit::Unestablished`] — never a default.
pub fn coordinate_unit_from_projjson(crs: &Value) -> CoordinateUnit {
    let Some(axes) = crs
        .get("coordinate_system")
        .and_then(|cs| cs.get("axis"))
        .and_then(Value::as_array)
    else {
        return CoordinateUnit::Unestablished;
    };
    if axes.len() < 2 {
        return CoordinateUnit::Unestablished;
    }
    match (axis_unit_name(&axes[0]), axis_unit_name(&axes[1])) {
        (Some(x), Some(y)) if x == y => CoordinateUnit::from_name(x),
        // Two axes in different units are two facts, and this record carries one value. The
        // disagreement is recorded as "not established" rather than resolved by preferring an axis.
        _ => CoordinateUnit::Unestablished,
    }
}

/// One axis's declared unit name, in either of PROJJSON's two forms. `None` where the member is
/// absent or carries no name.
fn axis_unit_name(axis: &Value) -> Option<String> {
    match axis.get("unit")? {
        Value::String(name) => Some(name.clone()),
        Value::Object(unit) => unit.get("name").and_then(Value::as_str).map(str::to_string),
        _ => None,
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

    // ---- the coordinate unit: read from the axes, never from anything else ------------------

    #[test]
    fn the_unit_comes_from_the_coordinate_system_axes_in_either_form() {
        let string_form = serde_json::json!({
            "coordinate_system": {"axis": [
                {"direction": "east", "unit": "degree"},
                {"direction": "north", "unit": "degree"}]}
        });
        let object_form = serde_json::json!({
            "coordinate_system": {"axis": [
                {"direction": "east", "unit": {"type": "AngularUnit", "name": "degree"}},
                {"direction": "north", "unit": {"type": "AngularUnit", "name": "degree"}}]}
        });
        assert_eq!(coordinate_unit_from_projjson(&string_form), CoordinateUnit::Degree);
        assert_eq!(coordinate_unit_from_projjson(&object_form), CoordinateUnit::Degree);
    }

    #[test]
    fn epsg2056s_conversion_parameters_and_base_crs_are_not_a_unit_source() {
        let lv95: Value = serde_json::from_str(LV95).unwrap();
        assert!(
            LV95.contains("\"unit\": \"degree\""),
            "the fixture must still carry the degree units this test exists for"
        );
        assert_eq!(
            coordinate_unit_from_projjson(&lv95),
            CoordinateUnit::Metre,
            "EPSG:2056 declares degrees on its conversion parameters and on its base CRS's axes, \
             and metres on its own; only the last of the three is the coordinate unit"
        );
    }

    #[test]
    fn disagreeing_a_missing_member_and_an_unreadable_form_all_record_unestablished() {
        let disagreeing = serde_json::json!({
            "coordinate_system": {"axis": [{"unit": "degree"}, {"unit": "metre"}]}
        });
        let missing = serde_json::json!({
            "coordinate_system": {"axis": [{"direction": "east"}, {"direction": "north"}]}
        });
        let unreadable = serde_json::json!({
            "coordinate_system": {"axis": [{"unit": 1}, {"unit": 1}]}
        });
        let one_axis = serde_json::json!({"coordinate_system": {"axis": [{"unit": "degree"}]}});
        let no_cs = serde_json::json!({"id": {"authority": "OGC", "code": "CRS84"}});
        for case in [disagreeing, missing, unreadable, one_axis, no_cs] {
            assert_eq!(coordinate_unit_from_projjson(&case), CoordinateUnit::Unestablished);
        }
    }

    #[test]
    fn a_name_that_is_neither_degree_nor_metre_is_recorded_exactly_as_read() {
        let other = serde_json::json!({
            "coordinate_system": {"axis": [
                {"unit": "US survey foot"}, {"unit": "US survey foot"}]}
        });
        let unit = coordinate_unit_from_projjson(&other);
        assert_eq!(unit, CoordinateUnit::Named("US survey foot".to_string()));
        assert_eq!(unit.as_str(), "US survey foot");
    }

    #[test]
    fn no_definition_records_unestablished_with_no_source_at_all() {
        assert_eq!(
            coordinate_unit_from_definition(None),
            (CoordinateUnit::Unestablished, None),
            "the absent-key format default carries no definition, and this record does not invent \
             one for it (§14 item IV, DECISIONS-PENDING entry 81 — open, the human's)"
        );
        assert_eq!(
            coordinate_unit_from_definition(Some("{not json")),
            (CoordinateUnit::Unestablished, Some(CoordinateUnitSource::Definition)),
            "a definition was there to read; nothing was established from it"
        );
    }

    #[test]
    fn covering_paths_render_as_quoted_sql_identifiers() {
        let m = GeoMeta::parse(&geo_doc(&format!(",\"crs\":{LV95}"))).unwrap();
        let c = m.covering.unwrap();
        assert_eq!(c.xmin.to_sql(), "\"bbox\".\"xmin\"");
        assert_eq!(FieldPath(vec!["we\"ird".into()]).to_sql(), "\"we\"\"ird\"");
    }
}
