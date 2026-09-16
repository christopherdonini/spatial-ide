// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! LOD tier construction — route B, exactly as `engine/LOD-PREREGISTRATION.md` §2 (as amended)
//! declares it, and nothing else.
//!
//! ## What this module is
//!
//! Tier 0 is **the source itself**: the identity and geometry of record, never rewritten and never
//! derived. Tiers 1–3 are derived artifacts built by simplifying the source's geometry at the three
//! declared tolerances of [`LOD_TOLERANCE_LADDER`], one GeoParquet file per tier, in a sidecar
//! directory keyed by the source's content hash under the app-local cache. A tier is **never
//! authoritative** for identity, geometry, picking or export (`LOD-PREREGISTRATION.md` §8 item 6).
//!
//! ## What this module deliberately does not do (§5, "declared unchanged")
//!
//! - **No tier selection.** Which tier a viewport draws is renderer/shell work under its own gate.
//!   Nothing here is served to a shell, and this module has no viewport, no pixel and no zoom.
//! - **No SKP command, parameter or frame; no residency change; no renderer code.**
//! - **No row reordering** (§2d). The tier is written in the source's own identity order, so it
//!   differs from its source by geometry simplification and by nothing else. `crate::layout` is
//!   neither imported nor reached from here.
//! - **No reprojection.** The only CRS arithmetic is the declared, logged linear-unit conversion of
//!   §2c, performed explicitly with its factor and provenance recorded on the tier.
//! - **No post-processing rescue of the simplifier.** An invalid output stops the build with the
//!   feature's own evidence (§5, I2) — a degenerate-ring removal step is *not* added to make the
//!   pre-committed choice survive its own falsifier.
//!
//! ## No number here is a claim
//!
//! Every constant below is a **declared value** (ADR-010 rule 6), not a measurement.
//! [`LOD_CANCEL_OBSERVED_CEILING_MS`] is `docs/08`'s existing budget restated at its use site with
//! ADR-018's meaning (`cancel_requested → cancel_observed`, p50/p95 carrying the verdict); it is a
//! ceiling to be measured against, never a latency this module asserts it achieves. Wall time and
//! cancellation latency are the tester's measurements (§6, §9).

use std::collections::HashMap;
use std::path::{Path, PathBuf};

use arrow::array::{Array, ArrayRef, BinaryArray, BinaryBuilder, Float64Builder, Int64Array,
                   Int64Builder, LargeBinaryArray, StructArray, UInt64Array, UInt64Builder};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use geo::{SimplifyVwPreserve, Validation};
use geo_traits::to_geo::ToGeoGeometry;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::{ArrowWriter, ProjectionMask};
use parquet::basic::Compression;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;
use serde_json::{json, Value};

use crate::cancel::CancelToken;
use crate::dataset::Dataset;
use crate::error::{EngineError, Result};
use crate::geoparquet::CoordinateUnit;
use crate::index::{self, ValidityHeuristic};

// ---------------------------------------------------------------------------------------------
// §7 — declared values and ceilings. Every one of them is declared, not discovered
// (`ADR-010:70-74`), and lives at its own site with the preregistration cited beside it.
// ---------------------------------------------------------------------------------------------

/// The three derived tiers' tolerances, **in metres** (`LOD-PREREGISTRATION.md` §7, §2b, §2c).
///
/// Converted explicitly to the source CRS's linear unit, with the factor and its ADR-026 provenance
/// recorded on the tier (§2c). Revisable only by a preregistered measurement, never by amendment.
pub const LOD_TOLERANCE_LADDER: [f64; 3] = [0.1, 1.0, 5.0];

/// Derived tiers, over tier 0 = the source (`LOD-PREREGISTRATION.md` §7). Derived from the ladder's
/// length and asserted equal to it, so the two cannot drift.
pub const LOD_TIER_COUNT: usize = 3;
const _: () = assert!(LOD_TIER_COUNT == LOD_TOLERANCE_LADDER.len());

/// Part of [`LodTierKey`]: a builder change invalidates every tier it built
/// (`LOD-PREREGISTRATION.md` §7; the role `index.rs:42-47`'s `BUILDER_VERSION` plays for the index).
pub const LOD_BUILDER_VERSION: u32 = 1;

/// The simplifier, named on the key and in the manifest (`LOD-PREREGISTRATION.md` §2a's
/// pre-committed choice). Two tiers built by different algorithms are different derived objects,
/// so the name is part of what the tier *is*.
pub const LOD_SIMPLIFIER: &str = "geo::SimplifyVwPreserve";

/// Arm P's declared worker count (`LOD-PREREGISTRATION.md` §7).
///
/// **A declared choice recording that the reference machine is 8C/16T, never "all available cores"**
/// and never read from the machine at runtime. It is a *parameter* of [`build_tiers`], so the arm a
/// run used is a fact of the call rather than of the hardware it happened to run on.
pub const LOD_BUILD_WORKERS: usize = 8;

/// Arm S's worker count — the single-threaded baseline every later number is read against
/// (`LOD-PREREGISTRATION.md` §7: "Arm S is fixed at 1", §3's O6 item 3).
pub const LOD_BUILD_WORKERS_ARM_S: usize = 1;

/// The cooperative cancellation check runs **once per feature** (`LOD-PREREGISTRATION.md` §7), plus
/// once per row-group boundary.
///
/// The granularity is declared here rather than inherited: the spike's row-group-only design left a
/// detection window orders of magnitude outside `docs/08`'s budget, and T6's mutation — moving this
/// check back to the row-group boundary — is what keeps that from silently returning.
pub const LOD_CANCEL_CHECK_FEATURES: u64 = 1;

/// `cancel_requested → cancel_observed`, p50 and p95, per `docs/08`'s existing budget and ADR-018 §2
/// (`LOD-PREREGISTRATION.md` §7).
///
/// **A declared residual, stated rather than discovered:** a single feature's `SimplifyVwPreserve`
/// call has no interruption point inside it, so one pathological feature can exceed the ceiling on
/// its own. The max single-feature simplify time is measured and reported beside the p95 (§6); the
/// ceiling is never raised to accommodate a measurement (§5, I3).
pub const LOD_CANCEL_OBSERVED_CEILING_MS: u64 = 100;

/// A tier larger than its own source is a defect, not a tier (`LOD-PREREGISTRATION.md` §7) →
/// [`LOD_TIER_LARGER_THAN_SOURCE`].
pub const LOD_TIER_MAX_RELATIVE_BYTES: f64 = 1.0;

/// Disk ceiling for the whole three-tier set (`LOD-PREREGISTRATION.md` §7) →
/// [`LOD_TIER_SET_OVER_DISK_CEILING`]. Checked **arithmetically** from the per-tier sizes, never by
/// holding the ladder on disk (§3's disk discipline).
pub const LOD_TIER_SET_MAX_BYTES: f64 = 2.0;

/// The app-local cache subdirectory tiers live in, under `%LOCALAPPDATA%`
/// (`LOD-PREREGISTRATION.md` §10 Amendment 1: "the sidecar directory lives in the app-local cache
/// (%LOCALAPPDATA%\\spatial-ide\\tiers\\<content-hash>\\), never beside the source file without the
/// user's word").
///
/// **Resolved from the environment once, never discovered from the source's location.** A source may
/// sit on read-only or shared storage, and writing next to it is a side effect the user did not ask
/// for — which is why a missing `LOCALAPPDATA` is a typed refusal
/// ([`LOD_TIER_ROOT_UNRESOLVED`]) and never a fallback beside the source.
pub const LOD_TIER_ROOT: &str = "spatial-ide/tiers";

/// Rows per source batch **read** into memory before the per-feature loop begins.
///
/// **Not one of §7's values, and declared here because it is the build's other uninterruptible
/// window.** The cooperative check runs once per feature ([`LOD_CANCEL_CHECK_FEATURES`]) and once
/// before each batch is pulled — but a batch *being pulled* is a decompress with no interruption
/// point inside it, so the window a cancel can land in is one batch's read, and that window is this
/// value's size rather than the row group's. It is deliberately smaller than
/// [`LOD_TIER_ROW_GROUP_ROWS`]: the two are different decisions (how much is read at once, how much
/// is written per row group) and collapsing them would make a cancellation property a function of a
/// file-layout choice.
pub const LOD_READ_BATCH_ROWS: usize = 1_024;

/// Rows per Parquet **row group** in a written tier.
///
/// **A memory bound, not one of §7's ceilings** — declared here because the `ArrowWriter`'s own
/// default buffers 1 048 576 rows before flushing, which at `docs/07`'s 5 GB class is gigabytes of
/// live Arrow buffers inside an operation whose whole point is that it streams. The value is the
/// shipped granularity this tree already writes its 5 GB fixtures at
/// (`engine/tests/import_layout_5gb_fixtures.rs:68`), restated rather than re-derived.
pub const LOD_TIER_ROW_GROUP_ROWS: usize = 8_192;

// ---------------------------------------------------------------------------------------------
// Typed refusals and typed labels — identifiers, not user-facing prose (§1).
// ---------------------------------------------------------------------------------------------

/// The source CRS is geographic / angular (`LOD-PREREGISTRATION.md` §2c, §7).
///
/// A tolerance in degrees is not a length. **This cut's refusal, and a dated gap rather than a
/// permanent stance:** Amendment 1 records geographic-CRS tiers as a named follow-on owed its own
/// preregistered gate, on the corpus fact that most public GeoParquet is geographic.
pub const LOD_CRS_NOT_LINEAR: &str = "engine.lod_crs_not_linear";

/// The source CRS definition declares no linear-unit conversion factor (`§2c`, `§7`). No default
/// factor is assumed (`docs/01` principle 8).
pub const LOD_CRS_UNIT_UNDECLARED: &str = "engine.lod_crs_unit_undeclared";

/// A written tier exceeds [`LOD_TIER_MAX_RELATIVE_BYTES`] × its source's bytes (`§7`).
pub const LOD_TIER_LARGER_THAN_SOURCE: &str = "engine.lod_tier_larger_than_source";

/// The ladder's arithmetic total exceeds [`LOD_TIER_SET_MAX_BYTES`] × its source's bytes (`§7`).
pub const LOD_TIER_SET_OVER_DISK_CEILING: &str = "engine.lod_tier_set_over_disk_ceiling";

/// `%LOCALAPPDATA%` is not set, so [`LOD_TIER_ROOT`] cannot be resolved.
///
/// **Not one of §7's four declared refusal identifiers.** §7 declares the four above; this is the
/// typed form Amendment 1's tier-location ruling requires — "never beside the source file without
/// the user's word" — for the one case where the declared root cannot be resolved at all. Named
/// here, at its own site, because the alternative (a fallback directory chosen by this code) is
/// precisely what that ruling forbids.
pub const LOD_TIER_ROOT_UNRESOLVED: &str = "engine.lod_tier_root_unresolved";

/// `SimplifyVwPreserve` emitted a Polygon that fails `geo::Validation::is_valid()`.
///
/// **Not one of §7's four declared refusal identifiers**, and deliberately not silent: this is the
/// typed form of §5's invalidator I2 and of §2a's declared falsifier. The build stops here with the
/// feature's own evidence — the id and `validation_errors()` rendered through `InvalidPolygon`'s
/// `Display` — and no post-processing step is added to rescue the simplifier choice.
pub const LOD_INVALID_OUTPUT: &str = "engine.lod_invalid_output";

/// The typed label a batch originating from a tier whose key does not match **must** carry
/// (`LOD-PREREGISTRATION.md` §2e; `ADR-010:62-68` rule 5, "staleness is signalled, never silently
/// served").
///
/// **Declared and reserved, not surfaced.** No tier is served to any shell by this piece, so nothing
/// displays it today — which is exactly the condition under which a later change quietly starts
/// serving a stale tier. [`TierBatch`] is shaped so that a batch from a stale tier cannot be
/// constructed without it.
pub const LOD_TIER_STALE: &str = "lod.tier_stale";

/// The typed label naming which tier is resident (`§2f`), rendered `lod.tier_resident{N}`.
///
/// Declared and reserved here for the same reason as [`LOD_TIER_STALE`]; its shell surface is owed
/// by the selection piece and is not built here. A view complete *at tier 3* must never read as
/// complete *at the source*.
pub const LOD_TIER_RESIDENT_PREFIX: &str = "lod.tier_resident";

// ---------------------------------------------------------------------------------------------
// The key, the miss, and the label — the engine's existing machinery, one artifact across.
// ---------------------------------------------------------------------------------------------

/// The identity of one tier: what it was built **from**, **by**, and **for**
/// (`LOD-PREREGISTRATION.md` §2e; the sentence and the discipline are `index.rs:159-163`'s).
///
/// **Every member is in `PartialEq`**, "so a mismatch cannot be missed by a caller that forgot to
/// compare one". `Eq` is deliberately *not* derived: `tolerance_metres` is an `f64`, and the one
/// value that would make `Eq` a lie — `NaN`, which is not equal to itself — fails *closed* here,
/// producing a key that never admits anything. A tier that cannot be admitted is a miss; a tier
/// admitted on a comparison that was quietly skipped is the defect this type exists to prevent.
#[derive(Clone, Debug, PartialEq)]
pub struct LodTierKey {
    /// SHA-256 of the whole source file (`index.rs:575-585`) — `docs/05`'s grid rule applied one
    /// level up: a tier is identified by the content it was built from, never by a filename.
    pub source_content_hash: String,
    pub builder_version: u32,
    /// The ladder tolerance **in metres**, before the CRS's linear-unit conversion. Two tiers at
    /// different tolerances are different derived objects.
    pub tolerance_metres: f64,
    /// The simplifier that produced it ([`LOD_SIMPLIFIER`]). VW-preserve and RDP are different
    /// algorithm families, and a tier built by one may never be served for the other.
    pub simplifier: String,
    /// The column the emitted ids came from (`index.rs:173-178`'s argument): identity is part of
    /// what the tier *is*, not a detail of how it was used.
    pub id_column: String,
}

impl LodTierKey {
    pub fn new(
        source_content_hash: impl Into<String>,
        tolerance_metres: f64,
        id_column: impl Into<String>,
    ) -> Self {
        Self {
            source_content_hash: source_content_hash.into(),
            builder_version: LOD_BUILDER_VERSION,
            tolerance_metres,
            simplifier: LOD_SIMPLIFIER.to_string(),
            id_column: id_column.into(),
        }
    }
}

/// Why a tier on disk was not used. Signalled rather than silently absorbed (`docs/01` principle 8);
/// the same three reasons as `index.rs:227-236`'s `IndexMiss`, because it is the same question.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TierMiss {
    /// Nothing on disk for this source and tier.
    Absent,
    /// A different revision, builder, tolerance, simplifier or identity column.
    KeyMismatch,
    /// The source no longer looks like the file the tier was built from (the fail-closed validity
    /// heuristic, `index.rs:193-224` — a heuristic and never an identity).
    SourceChanged,
}

impl TierMiss {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Absent => "absent",
            Self::KeyMismatch => "key-mismatch",
            Self::SourceChanged => "source-changed",
        }
    }
}

/// The label a [`TierBatch`] carries. **Every batch has one**; there is no unlabelled state.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum TierLabel {
    /// `lod.tier_resident{N}` (`§2f`).
    Resident(u8),
    /// `lod.tier_stale` (`§2e`, `ADR-010` rule 5).
    Stale,
}

impl TierLabel {
    pub fn as_str(&self) -> String {
        match self {
            Self::Resident(tier) => format!("{LOD_TIER_RESIDENT_PREFIX}{{{tier}}}"),
            Self::Stale => LOD_TIER_STALE.to_string(),
        }
    }
}

/// A witness that a tier **was admitted** for a given source key. Constructible only by
/// [`TierRecord::admit`], so it cannot be fabricated by a caller that skipped the comparison.
#[derive(Clone, Debug)]
pub struct AdmittedTier {
    tier: u8,
}

impl AdmittedTier {
    pub fn tier(&self) -> u8 {
        self.tier
    }
}

/// A witness that a tier **was found and rejected** — it is behind the source it claims to describe.
/// Constructible only by [`TierRecord::admit`]'s error path.
#[derive(Clone, Debug)]
pub struct StaleTier {
    tier: u8,
    miss: TierMiss,
}

impl StaleTier {
    pub fn tier(&self) -> u8 {
        self.tier
    }
    pub fn miss(&self) -> TierMiss {
        self.miss
    }
}

/// A batch of rows originating from a tier, carrying the label that says which tier it came from and
/// whether that tier is behind the source (`§2e`, `§2f`).
///
/// **The structural guarantee, which is the whole point of this type** (`§2e`: "the type is shaped
/// so a stale-tier batch *cannot be constructed without it* — structural, not editorial"): every
/// field is private, there is no `Default`, no public field write, and exactly **two** constructors,
/// neither of which takes a label. Each derives the label from the witness it is handed —
/// [`AdmittedTier`] or [`StaleTier`] — and those two witnesses come only from [`TierRecord::admit`].
/// So there is no reachable path from "a tier whose key does not match" to "a batch without
/// `lod.tier_stale`", and adding one is a block-on-sight change (`§8` item 5) that
/// `a_stale_tier_batch_cannot_exist_without_the_stale_label` fails on.
#[derive(Clone, Debug)]
pub struct TierBatch {
    tier: u8,
    rows: u64,
    label: TierLabel,
}

impl TierBatch {
    /// A batch from a tier that was admitted for the source's current key.
    pub fn from_admitted(admitted: &AdmittedTier, rows: u64) -> Self {
        Self { tier: admitted.tier, rows, label: TierLabel::Resident(admitted.tier) }
    }

    /// A batch from a tier that was found and rejected. **The label is not a parameter** — holding a
    /// [`StaleTier`] is what makes this constructor callable, and it always sets
    /// [`TierLabel::Stale`].
    pub fn from_stale(stale: &StaleTier, rows: u64) -> Self {
        Self { tier: stale.tier, rows, label: TierLabel::Stale }
    }

    pub fn tier(&self) -> u8 {
        self.tier
    }
    pub fn rows(&self) -> u64 {
        self.rows
    }
    pub fn label(&self) -> &TierLabel {
        &self.label
    }
    /// Whether this batch came from a tier known to be behind the source. A serving path that reads
    /// this and proceeds anyway is `§8` item 5's block-on-sight.
    pub fn is_stale(&self) -> bool {
        matches!(self.label, TierLabel::Stale)
    }
}

// ---------------------------------------------------------------------------------------------
// The linear unit (§2c) — read, converted explicitly, recorded with its provenance.
// ---------------------------------------------------------------------------------------------

/// The source CRS's linear unit, as read from the definition this dataset actually carries.
#[derive(Clone, Debug, PartialEq)]
pub struct LinearUnit {
    /// The unit's name exactly as the definition spells it (nothing is normalized here, for the
    /// reason `geoparquet.rs:163-166` gives).
    pub name: String,
    /// Metres per one of this unit — the factor the conversion uses, read from the definition and
    /// never defaulted.
    pub metres_per_unit: f64,
    /// ADR-026's host-derived provenance for the definition the factor was read from
    /// (`crs_catalog::definition_provenance`): `catalog:<id>@sha256:<12 hex>`, or `pasted`.
    pub definition_provenance: String,
    /// The full sha256 of that definition text, exactly as received (`crs_catalog::sha256_hex`).
    pub definition_sha256: String,
}

impl LinearUnit {
    /// Convert a ladder tolerance from metres into this unit, explicitly (`§2c`, `docs/01`
    /// principle 8: every transform explicit, logged and inspectable).
    pub fn tolerance_in_unit(&self, metres: f64) -> f64 {
        metres / self.metres_per_unit
    }
}

/// Read the source CRS's linear unit, or refuse (`§2c`).
///
/// Order of the two refusals, stated because it decides which one a caller sees: the unit is read
/// **first**, from the two axes of the admitted definition and from nothing else
/// (`geoparquet.rs:693-729` — the `id` string and the `base_crs`/`conversion.parameters` units are
/// the three traps it names). An angular unit, or a definition whose own `type` is a geographic CRS,
/// refuses [`LOD_CRS_NOT_LINEAR`]; a unit that could not be established at all, or a non-metre
/// linear unit whose `conversion_factor` is absent, refuses [`LOD_CRS_UNIT_UNDECLARED`].
pub(crate) fn linear_unit_of(source: &Dataset) -> Result<LinearUnit> {
    let Some(definition) = source.crs().definition_json() else {
        // Nothing was read, so nothing is assumed. An admission that carries no definition at all
        // (the absent-key format rule's OGC:CRS84, `geoparquet.rs:652-669`) is angular anyway, but
        // this arm refuses on what is *missing* rather than on what the rule would have said.
        return Err(refusal(
            LOD_CRS_UNIT_UNDECLARED,
            format!(
                "the admitted CRS `{}` carries no definition to read a linear unit from",
                source.crs().identifier()
            ),
        ));
    };
    let value: Value = serde_json::from_str(definition).map_err(|e| {
        refusal(LOD_CRS_UNIT_UNDECLARED, format!("the admitted CRS definition does not parse: {e}"))
    })?;

    let crs_type = value.get("type").and_then(Value::as_str).unwrap_or("");
    let unit = crate::geoparquet::coordinate_unit_from_projjson(&value);
    if crs_type.eq_ignore_ascii_case("GeographicCRS") || unit == CoordinateUnit::Degree {
        return Err(refusal(
            LOD_CRS_NOT_LINEAR,
            format!(
                "`{}` is a {crs_type} whose coordinate unit reads `{}`; a tolerance in an angular \
                 unit is not a length, and simplifying by one would be the units-unaware \
                 measurement docs/01 forbids",
                source.crs().identifier(),
                unit.as_str()
            ),
        ));
    }
    if unit == CoordinateUnit::Unestablished {
        return Err(refusal(
            LOD_CRS_UNIT_UNDECLARED,
            format!(
                "`{}` declares no coordinate unit this reader can establish from its own two axes; \
                 no default factor is assumed",
                source.crs().identifier()
            ),
        ));
    }
    if is_angular_unit_object(&value) {
        return Err(refusal(
            LOD_CRS_NOT_LINEAR,
            format!(
                "`{}` declares an angular unit object on its coordinate-system axes",
                source.crs().identifier()
            ),
        ));
    }

    // The metre is PROJJSON's base linear unit and its factor is one; every other linear unit must
    // say what it is in metres, in its own definition, or it is not usable as a length here.
    let metres_per_unit = if unit == CoordinateUnit::Metre {
        1.0
    } else {
        match axis_conversion_factor(&value) {
            Some(f) if f.is_finite() && f > 0.0 => f,
            _ => {
                return Err(refusal(
                    LOD_CRS_UNIT_UNDECLARED,
                    format!(
                        "`{}` declares the unit `{}` with no usable `conversion_factor` on its \
                         coordinate-system axes; no default factor is assumed",
                        source.crs().identifier(),
                        unit.as_str()
                    ),
                ))
            }
        }
    };

    Ok(LinearUnit {
        name: unit.as_str().to_string(),
        metres_per_unit,
        definition_provenance: crate::crs_catalog::definition_provenance(Some(definition)),
        definition_sha256: crate::crs_catalog::sha256_hex(definition),
    })
}

/// Whether either coordinate-system axis declares its unit in PROJJSON's **object** form with an
/// angular type. Read from `coordinate_system.axis` only — the same two members
/// `coordinate_unit_from_projjson` reads, for the same reason.
fn is_angular_unit_object(crs: &Value) -> bool {
    axes(crs)
        .iter()
        .filter_map(|axis| axis.get("unit"))
        .filter_map(|u| u.get("type"))
        .filter_map(Value::as_str)
        .any(|t| t.to_ascii_lowercase().contains("angular"))
}

/// The `conversion_factor` both coordinate-system axes agree on, in PROJJSON's object form.
/// Disagreeing axes are two facts and this is one value, so a disagreement reads as absent — the
/// same posture `coordinate_unit_from_projjson` takes for a disagreeing unit *name*.
fn axis_conversion_factor(crs: &Value) -> Option<f64> {
    let axes = axes(crs);
    if axes.len() < 2 {
        return None;
    }
    let factor = |axis: &Value| -> Option<f64> {
        axis.get("unit")?.get("conversion_factor")?.as_f64()
    };
    match (factor(&axes[0]), factor(&axes[1])) {
        (Some(x), Some(y)) if x == y => Some(x),
        _ => None,
    }
}

fn axes(crs: &Value) -> Vec<Value> {
    crs.get("coordinate_system")
        .and_then(|cs| cs.get("axis"))
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default()
}

// ---------------------------------------------------------------------------------------------
// Progress and cancellation (docs/01 principle 7).
// ---------------------------------------------------------------------------------------------

/// Progress from a running tier build, as an observer rather than a log line — the same shape
/// `fixture.rs:531-543` and `index.rs:148-150` already use, so this tree keeps one progress idiom.
///
/// **The observer sees counts and phases, never per-feature data.** A data-bearing observer would be
/// a second bulk path out of this module, which is not what a progress seam is for.
pub trait TierBuildProgress: Send + Sync {
    /// One row group of `tier` has been written. Called on the building thread.
    fn tier_progress(&self, tier: u8, features_done: u64, features_total: u64);

    /// **`cancel_observed`** (ADR-018 §2, the second of the three cancellation instants): the
    /// cooperative check saw the token cancelled and the worker stopped advancing.
    ///
    /// Called **on the thread doing the work, at the instant it stopped**, before any unwinding —
    /// so an instrument stamps the instant the property is about, not the instant a result reached
    /// another thread (`index.rs:139-147`'s finding, applied here). `cancel_acknowledged` is the
    /// caller's to stamp when [`build_tiers`] returns.
    fn cancel_observed(&self, tier: u8, features_done: u64);
}

/// A no-op observer, so the build never branches on `Option` internally (`fixture.rs:545-549`).
struct SilentProgress;
impl TierBuildProgress for SilentProgress {
    fn tier_progress(&self, _: u8, _: u64, _: u64) {}
    fn cancel_observed(&self, _: u8, _: u64) {}
}

// ---------------------------------------------------------------------------------------------
// What a build returns.
// ---------------------------------------------------------------------------------------------

/// One tier's record — what `tiers.json` carries for it, and what admission compares.
#[derive(Clone, Debug)]
pub struct TierRecord {
    key: LodTierKey,
    tier: u8,
    tolerance_source_units: f64,
    unit: LinearUnit,
    features: u64,
    vertices_before: u64,
    vertices_after: u64,
    path: PathBuf,
    bytes: u64,
    sha256: String,
    source_validity: Option<ValidityHeuristic>,
}

impl TierRecord {
    pub fn key(&self) -> &LodTierKey {
        &self.key
    }
    pub fn tier(&self) -> u8 {
        self.tier
    }
    pub fn tolerance_source_units(&self) -> f64 {
        self.tolerance_source_units
    }
    pub fn unit(&self) -> &LinearUnit {
        &self.unit
    }
    pub fn features(&self) -> u64 {
        self.features
    }
    pub fn vertices_before(&self) -> u64 {
        self.vertices_before
    }
    pub fn vertices_after(&self) -> u64 {
        self.vertices_after
    }
    pub fn path(&self) -> &Path {
        &self.path
    }
    pub fn bytes(&self) -> u64 {
        self.bytes
    }
    pub fn sha256(&self) -> &str {
        &self.sha256
    }

    /// **Found by path, admitted by key** (`§2e`; the rule verbatim at `dataset.rs:516-519`).
    ///
    /// Key first, then the fail-closed heuristic — the same order and the same two checks
    /// `index.rs`'s `SpatialIndex::admits` runs, so the two derived artifacts cannot drift apart on
    /// what "may serve" means. The `Ok` and `Err` values are the witnesses [`TierBatch`] needs, so a
    /// caller cannot produce a batch without having run this comparison.
    pub fn admit(
        &self,
        key: &LodTierKey,
        source_validity: Option<&ValidityHeuristic>,
    ) -> std::result::Result<AdmittedTier, StaleTier> {
        if &self.key != key {
            return Err(StaleTier { tier: self.tier, miss: TierMiss::KeyMismatch });
        }
        if !ValidityHeuristic::fail_closed_matches(self.source_validity.as_ref(), source_validity) {
            return Err(StaleTier { tier: self.tier, miss: TierMiss::SourceChanged });
        }
        Ok(AdmittedTier { tier: self.tier })
    }

    fn to_json(&self) -> Value {
        json!({
            "tier": self.tier,
            "tolerance_metres": self.key.tolerance_metres,
            "tolerance_source_units": self.tolerance_source_units,
            "linear_unit": self.unit.name,
            "metres_per_unit": self.unit.metres_per_unit,
            "crs_definition_provenance": self.unit.definition_provenance,
            "crs_definition_sha256": self.unit.definition_sha256,
            "source_content_hash": self.key.source_content_hash,
            "builder_version": self.key.builder_version,
            "simplifier": self.key.simplifier,
            "id_column": self.key.id_column,
            "features": self.features,
            "vertices_before": self.vertices_before,
            "vertices_after": self.vertices_after,
            "path": self.path.to_string_lossy(),
            "bytes": self.bytes,
            "sha256": self.sha256,
            "source_validity": self.source_validity.as_ref().map(|v| json!({
                "len": v.len,
                "modified_nanos": v.modified_nanos.map(|n| n.to_string()),
            })),
        })
    }

    fn from_json(v: &Value) -> Option<Self> {
        let str_of = |k: &str| v.get(k).and_then(Value::as_str).map(str::to_string);
        let u64_of = |k: &str| v.get(k).and_then(Value::as_u64);
        let f64_of = |k: &str| v.get(k).and_then(Value::as_f64);
        let source_validity = v.get("source_validity").and_then(|sv| {
            let len = sv.get("len")?.as_u64()?;
            let modified_nanos = sv
                .get("modified_nanos")
                .and_then(Value::as_str)
                .and_then(|s| s.parse::<u128>().ok());
            Some(ValidityHeuristic { len, modified_nanos })
        });
        Some(Self {
            key: LodTierKey {
                source_content_hash: str_of("source_content_hash")?,
                builder_version: u64_of("builder_version")? as u32,
                tolerance_metres: f64_of("tolerance_metres")?,
                simplifier: str_of("simplifier")?,
                id_column: str_of("id_column")?,
            },
            tier: u64_of("tier")? as u8,
            tolerance_source_units: f64_of("tolerance_source_units")?,
            unit: LinearUnit {
                name: str_of("linear_unit")?,
                metres_per_unit: f64_of("metres_per_unit")?,
                definition_provenance: str_of("crs_definition_provenance")?,
                definition_sha256: str_of("crs_definition_sha256")?,
            },
            features: u64_of("features")?,
            vertices_before: u64_of("vertices_before")?,
            vertices_after: u64_of("vertices_after")?,
            path: PathBuf::from(str_of("path")?),
            bytes: u64_of("bytes")?,
            sha256: str_of("sha256")?,
            source_validity,
        })
    }
}

/// What happened to one tier in one call to [`build_tiers`].
#[derive(Clone, Debug)]
pub struct TierOutcome {
    record: TierRecord,
    /// `None` when a tier on disk was admitted and reused; otherwise why it was not, which is the
    /// reason the rebuild happened (`docs/01` principle 8: signalled, never absorbed).
    miss: Option<TierMiss>,
}

impl TierOutcome {
    pub fn record(&self) -> &TierRecord {
        &self.record
    }
    pub fn miss(&self) -> Option<TierMiss> {
        self.miss
    }
    pub fn was_rebuilt(&self) -> bool {
        self.miss.is_some()
    }
}

/// The ladder, after one call to [`build_tiers`].
#[derive(Clone, Debug)]
pub struct TierSet {
    source_content_hash: String,
    source_bytes: u64,
    directory: PathBuf,
    tiers: Vec<TierOutcome>,
}

impl TierSet {
    /// **Tier 0 is the source and is not in here.** This is the derived set, tiers 1..=3.
    pub fn tiers(&self) -> &[TierOutcome] {
        &self.tiers
    }
    pub fn directory(&self) -> &Path {
        &self.directory
    }
    pub fn source_content_hash(&self) -> &str {
        &self.source_content_hash
    }
    pub fn source_bytes(&self) -> u64 {
        self.source_bytes
    }
    /// The ladder's total on disk, summed arithmetically from the per-tier sizes — never by holding
    /// the ladder on disk (`§3`'s disk discipline).
    pub fn total_bytes(&self) -> u64 {
        self.tiers.iter().map(|t| t.record.bytes).sum()
    }
    pub fn manifest_path(&self) -> PathBuf {
        self.directory.join("tiers.json")
    }
}

// ---------------------------------------------------------------------------------------------
// The one public entry point.
// ---------------------------------------------------------------------------------------------

/// Build (or reuse) the three derived tiers for `source`.
///
/// **This is the module's only entry point.** Tier *selection* — which tier a viewport draws — is
/// not decided, designed or implemented here (`§1`, `§5`); a later selection piece calls this
/// function, and nothing in this module reaches a renderer, a shell or the wire.
///
/// - **Lazy and on request** (`§2e`): nothing is rebuilt at open, and there is no background job.
/// - **Cancellable per feature** ([`LOD_CANCEL_CHECK_FEATURES`]) and progress-reporting
///   (`docs/01` principle 7). A cancelled build removes the partial tier it was writing and reports
///   the removal's outcome rather than leaving an orphan nobody was told about.
/// - **A stale tier is never served**: a tier whose key does not match is a miss with a recorded
///   reason and is rebuilt (`§2e`).
/// - `workers` is a **declared** count — [`LOD_BUILD_WORKERS`] for arm P, [`LOD_BUILD_WORKERS_ARM_S`]
///   for arm S — and is never read from the machine.
pub fn build_tiers(
    source: &Dataset,
    workers: usize,
    cancel: &CancelToken,
    progress: Option<&dyn TierBuildProgress>,
) -> Result<TierSet> {
    let silent = SilentProgress;
    let progress: &dyn TierBuildProgress = progress.unwrap_or(&silent);

    // The unit is read before a byte is hashed or written: a source this module may not tier at all
    // is refused on that ground first, which is the cheapest true answer.
    let unit = linear_unit_of(source)?;
    let id_column = source.identity().source().source_column().to_string();

    let source_bytes = std::fs::metadata(source.path())
        .map_err(|e| EngineError::Source(format!("stat the source: {e}")))?
        .len();
    // Whole-file, cancellable, and the dominant cost of an open ladder (`index.rs:575-585`).
    let (content_hash, _hash_millis) = index::content_hash(source.path(), cancel)?;
    let source_validity = ValidityHeuristic::of(source.path());

    let directory = tier_directory(&content_hash)?;
    std::fs::create_dir_all(&directory)
        .map_err(|e| EngineError::Source(format!("create the tier directory: {e}")))?;
    let on_disk = read_manifest(&directory.join("tiers.json"));

    let mut outcomes: Vec<TierOutcome> = Vec::with_capacity(LOD_TIER_COUNT);
    for (i, tolerance_metres) in LOD_TOLERANCE_LADDER.iter().copied().enumerate() {
        if cancel.is_cancelled() {
            progress.cancel_observed(0, 0);
            return Err(EngineError::Cancelled);
        }
        let tier = (i + 1) as u8;
        let key = LodTierKey::new(content_hash.clone(), tolerance_metres, id_column.clone());

        // Found by path, admitted by key. A found-but-rejected tier is never served: its reason is
        // recorded and it is rebuilt over.
        let (record, miss) = match on_disk.get(&tier) {
            None => (None, Some(TierMiss::Absent)),
            Some(found) if !found.path.is_file() => (None, Some(TierMiss::Absent)),
            Some(found) => match found.admit(&key, source_validity.as_ref()) {
                Ok(_admitted) => (Some(found.clone()), None),
                Err(stale) => (None, Some(stale.miss())),
            },
        };

        let record = match record {
            Some(reused) => reused,
            None => build_one_tier(
                source,
                tier,
                tolerance_metres,
                &unit,
                key,
                &id_column,
                source_bytes,
                source_validity.clone(),
                &directory,
                workers,
                cancel,
                progress,
            )?,
        };
        outcomes.push(TierOutcome { record, miss });
    }

    // The ladder's disk ceiling, checked arithmetically from the per-tier sizes (§3, §7).
    let total: u64 = outcomes.iter().map(|o| o.record.bytes).sum();
    let ceiling = (source_bytes as f64 * LOD_TIER_SET_MAX_BYTES) as u64;
    if total > ceiling {
        for o in &outcomes {
            remove_reporting(&o.record.path)?;
        }
        return Err(EngineError::CeilingExceeded {
            ceiling: LOD_TIER_SET_OVER_DISK_CEILING,
            limit: ceiling,
            saw: total,
        });
    }

    let set = TierSet {
        source_content_hash: content_hash,
        source_bytes,
        directory,
        tiers: outcomes,
    };
    write_manifest(&set, source, &unit)?;
    Ok(set)
}

// ---------------------------------------------------------------------------------------------
// The sidecar directory and its manifest.
// ---------------------------------------------------------------------------------------------

/// `%LOCALAPPDATA%\spatial-ide\tiers\<source-content-hash>\` (Amendment 1).
///
/// **The variable is read from the environment and nothing is substituted for it.** No new crate is
/// taken for this; Windows is the reference platform (`CLAUDE.md`), and a platform whose app-local
/// cache is somewhere else needs its own declared value rather than a guess made here.
fn tier_directory(source_content_hash: &str) -> Result<PathBuf> {
    let root = std::env::var_os("LOCALAPPDATA").ok_or_else(|| {
        refusal(
            LOD_TIER_ROOT_UNRESOLVED,
            "LOCALAPPDATA is not set, so the declared tier root cannot be resolved. A tier is \
             never written beside its source instead: a source may sit on read-only or shared \
             storage, and writing next to it is a side effect the user did not ask for"
                .to_string(),
        )
    })?;
    Ok(PathBuf::from(root).join(LOD_TIER_ROOT).join(source_content_hash))
}

fn read_manifest(path: &Path) -> HashMap<u8, TierRecord> {
    let mut out = HashMap::new();
    let Ok(text) = std::fs::read_to_string(path) else { return out };
    let Ok(value) = serde_json::from_str::<Value>(&text) else { return out };
    let Some(tiers) = value.get("tiers").and_then(Value::as_array) else { return out };
    for t in tiers {
        if let Some(record) = TierRecord::from_json(t) {
            out.insert(record.tier, record);
        }
    }
    out
}

/// `tiers.json` — **a manifest, not a data path**, so plain diffable text is exactly right here and
/// JSON never comes near the geometry (`§2d`; `ADR-004:17`).
fn write_manifest(set: &TierSet, source: &Dataset, unit: &LinearUnit) -> Result<()> {
    let manifest = json!({
        "schema": "spatial-ide/lod-tiers/1",
        "builder_version": LOD_BUILDER_VERSION,
        "simplifier": LOD_SIMPLIFIER,
        "source": {
            "content_hash": set.source_content_hash,
            "bytes": set.source_bytes,
            "path_at_build": source.path().to_string_lossy(),
            "crs_identifier": source.crs().identifier(),
            "linear_unit": unit.name,
            "metres_per_unit": unit.metres_per_unit,
            "crs_definition_provenance": unit.definition_provenance,
            "crs_definition_sha256": unit.definition_sha256,
            "id_column": source.identity().source().source_column(),
        },
        "tiers": set.tiers.iter().map(|o| o.record.to_json()).collect::<Vec<_>>(),
    });
    let text = serde_json::to_string_pretty(&manifest)
        .map_err(|e| EngineError::Source(format!("serialize tiers.json: {e}")))?;
    std::fs::write(set.manifest_path(), text)
        .map_err(|e| EngineError::Source(format!("write tiers.json: {e}")))
}

// ---------------------------------------------------------------------------------------------
// Building one tier.
// ---------------------------------------------------------------------------------------------

/// One emitted row: the identity value, the simplified geometry's WKB, and that geometry's own
/// bounding box. Carried in the source's row order and never sorted.
struct EmittedRow {
    id: u64,
    wkb: Vec<u8>,
    bbox: [f64; 4],
    vertices_before: u64,
    vertices_after: u64,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum IdType {
    U64,
    I64,
}

#[allow(clippy::too_many_arguments)]
fn build_one_tier(
    source: &Dataset,
    tier: u8,
    tolerance_metres: f64,
    unit: &LinearUnit,
    key: LodTierKey,
    id_column: &str,
    source_bytes: u64,
    source_validity: Option<ValidityHeuristic>,
    directory: &Path,
    workers: usize,
    cancel: &CancelToken,
    progress: &dyn TierBuildProgress,
) -> Result<TierRecord> {
    let tolerance = unit.tolerance_in_unit(tolerance_metres);
    let out_path = directory.join(format!("tier-{tier}.parquet"));

    match write_tier(
        source, tier, tolerance, id_column, &out_path, workers, cancel, progress,
    ) {
        Ok(facts) => {
            let (sha256, _ms) = index::content_hash(&out_path, cancel)?;
            let bytes = std::fs::metadata(&out_path)
                .map_err(|e| EngineError::Source(format!("stat the written tier: {e}")))?
                .len();
            // A "simplified" tier larger than its own source is a defect, not a tier (§7). The
            // defect is not kept on disk while it is being reported.
            let limit = (source_bytes as f64 * LOD_TIER_MAX_RELATIVE_BYTES) as u64;
            if bytes > limit {
                remove_reporting(&out_path)?;
                return Err(EngineError::CeilingExceeded {
                    ceiling: LOD_TIER_LARGER_THAN_SOURCE,
                    limit,
                    saw: bytes,
                });
            }
            Ok(TierRecord {
                key,
                tier,
                tolerance_source_units: tolerance,
                unit: unit.clone(),
                features: facts.features,
                vertices_before: facts.vertices_before,
                vertices_after: facts.vertices_after,
                path: out_path,
                bytes,
                sha256,
                source_validity,
            })
        }
        Err(e) => {
            // The partial file is the side effect; removing it is the recovery policy, and its
            // outcome is reported rather than swallowed (`fixture.rs:583-615`).
            if out_path.exists() {
                if let Err(io) = std::fs::remove_file(&out_path) {
                    return Err(EngineError::Source(format!(
                        "tier {tier} failed ({e}) and the partial file `{}` could not then be \
                         removed ({io}). Both are reported: the first is what went wrong, the \
                         second is what is still on disk",
                        out_path.display()
                    )));
                }
            }
            Err(e)
        }
    }
}

struct TierFacts {
    features: u64,
    vertices_before: u64,
    vertices_after: u64,
}

#[allow(clippy::too_many_arguments)]
fn write_tier(
    source: &Dataset,
    tier: u8,
    tolerance: f64,
    id_column: &str,
    out_path: &Path,
    workers: usize,
    cancel: &CancelToken,
    progress: &dyn TierBuildProgress,
) -> Result<TierFacts> {
    let geometry_column = source.geometry_column().to_string();

    let file = std::fs::File::open(source.path())
        .map_err(|e| EngineError::Source(format!("open the source for tiering: {e}")))?;
    let builder = ParquetRecordBatchReaderBuilder::try_new(file)
        .map_err(|e| EngineError::Source(format!("read the source's parquet footer: {e}")))?;
    let file_schema = builder.schema().clone();
    let id_index = column_index(&file_schema, id_column)?;
    let geometry_index = column_index(&file_schema, &geometry_column)?;
    let id_type = match file_schema.field(id_index).data_type() {
        DataType::UInt64 => IdType::U64,
        DataType::Int64 => IdType::I64,
        other => {
            // Unreachable through `Dataset`: ADR-016's admission refuses a column that cannot widen
            // into `u64` before an open ever succeeds (`identity.rs`). Reported rather than
            // assumed away, in the same posture `dataset.rs:366-379` takes for its own unreachable
            // arm.
            return Err(EngineError::Source(format!(
                "internal inconsistency: identity column `{id_column}` is {other} in the file, but \
                 this dataset was admitted with it as feature identity"
            )));
        }
    };
    let features_total = builder.metadata().file_metadata().num_rows().max(0) as u64;
    // Only the two columns this build reads are decompressed — the tier is identity and geometry,
    // and reading the rest would be work whose output is discarded.
    let mask = ProjectionMask::roots(
        builder.parquet_schema(),
        [id_index, geometry_index],
    );
    let mut reader = builder
        .with_projection(mask)
        .with_batch_size(LOD_READ_BATCH_ROWS)
        .build()
        .map_err(|e| EngineError::Source(format!("build the source reader: {e}")))?;

    let schema = tier_schema(id_column, &geometry_column, id_type);
    let props = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_key_value_metadata(Some(tier_footer_metadata(source, &geometry_column)?))
        .set_max_row_group_row_count(Some(LOD_TIER_ROW_GROUP_ROWS))
        .build();
    let out = std::fs::File::create(out_path)
        .map_err(|e| EngineError::Source(format!("create the tier file: {e}")))?;
    let mut writer = ArrowWriter::try_new(out, schema.clone(), Some(props))
        .map_err(|e| EngineError::Source(format!("parquet writer: {e}")))?;

    let mut facts = TierFacts { features: 0, vertices_before: 0, vertices_after: 0 };
    loop {
        // **Before the next batch is pulled, not after.** Reading a batch is a decompress with no
        // interruption point inside it; checking after the pull would put that whole read inside
        // every cancel's detection window, which is the row-group-grained shape §7 exists to
        // replace.
        if cancel.is_cancelled() {
            progress.cancel_observed(tier, facts.features);
            return Err(EngineError::Cancelled);
        }
        let Some(batch) = reader.next() else { break };
        let batch = batch.map_err(|e| EngineError::Source(format!("read a source batch: {e}")))?;
        let ids = read_ids(&batch, id_column, id_type)?;
        let wkb = read_wkb_column(&batch, &geometry_column)?;

        let rows = simplify_rows(&ids, &wkb, tolerance, tier, workers, cancel, progress, facts.features)?;
        for r in &rows {
            facts.features += 1;
            facts.vertices_before += r.vertices_before;
            facts.vertices_after += r.vertices_after;
        }
        let out_batch = emitted_batch(&schema, &rows, id_type)?;
        writer
            .write(&out_batch)
            .map_err(|e| EngineError::Source(format!("write a tier batch: {e}")))?;
        progress.tier_progress(tier, facts.features, features_total);
    }

    // **The uninterruptible window, named rather than implied**: `close` writes the footer, and it
    // is the one step of this build with no cancellation point inside it (`fixture.rs:575-581`).
    writer
        .close()
        .map_err(|e| EngineError::Source(format!("close the tier writer: {e}")))?;
    Ok(facts)
}

/// Decode, simplify, validate and re-encode one batch's rows — **in the batch's own order**.
///
/// With `workers > 1` the batch is split into contiguous slices, one per worker, and the slices'
/// outputs are concatenated **in slice order**, so the emitted order is the source's whichever arm
/// ran (§2d: the tier differs from its source by geometry simplification and by nothing else).
#[allow(clippy::too_many_arguments)]
fn simplify_rows(
    ids: &[u64],
    wkb: &[&[u8]],
    tolerance: f64,
    tier: u8,
    workers: usize,
    cancel: &CancelToken,
    progress: &dyn TierBuildProgress,
    features_before_batch: u64,
) -> Result<Vec<EmittedRow>> {
    if workers <= LOD_BUILD_WORKERS_ARM_S {
        // Arm S runs inline: spawning one thread would add a handoff the baseline is supposed to be
        // free of.
        return simplify_slice(ids, wkb, tolerance, tier, cancel, progress, features_before_batch);
    }
    let n = ids.len();
    let per = n.div_ceil(workers.max(1));
    let mut results: Vec<Result<Vec<EmittedRow>>> = Vec::new();
    std::thread::scope(|scope| {
        let mut handles = Vec::new();
        let mut start = 0usize;
        while start < n {
            let end = (start + per).min(n);
            let ids = &ids[start..end];
            let wkb = &wkb[start..end];
            let done_before = features_before_batch + start as u64;
            handles.push(scope.spawn(move || {
                simplify_slice(ids, wkb, tolerance, tier, cancel, progress, done_before)
            }));
            start = end;
        }
        for h in handles {
            results.push(h.join().unwrap_or_else(|_| {
                Err(EngineError::Source("a tier worker panicked".into()))
            }));
        }
    });

    let mut rows = Vec::with_capacity(n);
    // The first error **in slice order**, so which failure a caller sees does not depend on thread
    // scheduling.
    for r in results {
        rows.extend(r?);
    }
    Ok(rows)
}

fn simplify_slice(
    ids: &[u64],
    wkb: &[&[u8]],
    tolerance: f64,
    tier: u8,
    cancel: &CancelToken,
    progress: &dyn TierBuildProgress,
    features_done_before: u64,
) -> Result<Vec<EmittedRow>> {
    let mut out = Vec::with_capacity(ids.len());
    for (i, bytes) in wkb.iter().enumerate() {
        // **Once per feature** (`LOD_CANCEL_CHECK_FEATURES`), not once per row group. The instant
        // the check fires is stamped here, on this thread, before anything unwinds.
        if cancel.is_cancelled() {
            progress.cancel_observed(tier, features_done_before + i as u64);
            return Err(EngineError::Cancelled);
        }
        let id = ids[i];
        let parsed = wkb::reader::read_wkb(bytes)
            .map_err(|e| EngineError::Wkb(format!("feature {id}: {e}")))?;
        let geometry = parsed
            .try_to_geometry()
            .ok_or_else(|| EngineError::Wkb(format!("feature {id}: empty geometry")))?;
        let polygon = match geometry {
            geo::Geometry::Polygon(p) => p,
            other => {
                return Err(EngineError::Wkb(format!(
                    "feature {id}: expected a Polygon, found {}",
                    geometry_type_name(&other)
                )))
            }
        };
        let vertices_before = ring_vertices(&polygon);
        let simplified = polygon.simplify_vw_preserve(tolerance);

        // O1's hard gate, per feature, at the moment the geometry exists — not a sampled check and
        // not a post-pass. An invalid output stops the build (§5, I2).
        if !simplified.is_valid() {
            let errors: Vec<String> =
                simplified.validation_errors().iter().map(|e| e.to_string()).collect();
            return Err(refusal(
                LOD_INVALID_OUTPUT,
                format!(
                    "feature {id} simplified to an invalid Polygon at tolerance {tolerance} \
                     (source units): {}. The simplifier choice is falsified for this input and no \
                     post-processing step is added to rescue it",
                    errors.join("; ")
                ),
            ));
        }

        let vertices_after = ring_vertices(&simplified);
        let bbox = polygon_bbox(&simplified);
        let mut bytes_out = Vec::new();
        wkb::writer::write_polygon(
            &mut bytes_out,
            &simplified,
            // **Declared, not defaulted**: little-endian ISO WKB, the same encoding
            // `crate::wkb::encode_polygon` writes and this engine's own decoder reads.
            &wkb::writer::WriteOptions { endianness: wkb::Endianness::LittleEndian },
        )
        .map_err(|e| EngineError::Wkb(format!("feature {id}: writing WKB: {e}")))?;

        out.push(EmittedRow { id, wkb: bytes_out, bbox, vertices_before, vertices_after });
    }
    Ok(out)
}

/// Every ring's vertices, exterior and interiors — the same counting the spike cross-checked
/// exactly against the other route (`§6`).
fn ring_vertices(p: &geo::Polygon<f64>) -> u64 {
    let mut n = p.exterior().0.len() as u64;
    for interior in p.interiors() {
        n += interior.0.len() as u64;
    }
    n
}

fn polygon_bbox(p: &geo::Polygon<f64>) -> [f64; 4] {
    let mut b = [f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY];
    let mut take = |c: &geo::Coord<f64>| {
        b[0] = b[0].min(c.x);
        b[1] = b[1].min(c.y);
        b[2] = b[2].max(c.x);
        b[3] = b[3].max(c.y);
    };
    for c in &p.exterior().0 {
        take(c);
    }
    for interior in p.interiors() {
        for c in &interior.0 {
            take(c);
        }
    }
    b
}

fn geometry_type_name(g: &geo::Geometry<f64>) -> &'static str {
    match g {
        geo::Geometry::Point(_) => "Point",
        geo::Geometry::Line(_) => "Line",
        geo::Geometry::LineString(_) => "LineString",
        geo::Geometry::Polygon(_) => "Polygon",
        geo::Geometry::MultiPoint(_) => "MultiPoint",
        geo::Geometry::MultiLineString(_) => "MultiLineString",
        geo::Geometry::MultiPolygon(_) => "MultiPolygon",
        geo::Geometry::GeometryCollection(_) => "GeometryCollection",
        geo::Geometry::Rect(_) => "Rect",
        geo::Geometry::Triangle(_) => "Triangle",
    }
}

// ---------------------------------------------------------------------------------------------
// Arrow/Parquet shapes for a written tier.
// ---------------------------------------------------------------------------------------------

/// The tier's own schema: **identity, its covering bbox, and geometry** — in that order, declared,
/// with geometry last exactly as this tree's own generator declares it (`fixture.rs:373-379`).
///
/// **What a tier carries, and what it does not.** Attributes are not copied: tier 0 (the source) is
/// the record for everything that is not geometry, and a tier that carried its own copy of an
/// attribute column would be a second place for the same fact to live. The covering bbox **is**
/// written, and it is recomputed from the simplified geometry rather than copied from the source —
/// a bbox copied from unsimplified geometry would describe rows this file does not contain.
fn tier_schema(id_column: &str, geometry_column: &str, id_type: IdType) -> std::sync::Arc<Schema> {
    let id_field = match id_type {
        IdType::U64 => Field::new(id_column, DataType::UInt64, false),
        IdType::I64 => Field::new(id_column, DataType::Int64, false),
    };
    std::sync::Arc::new(Schema::new(vec![
        std::sync::Arc::new(id_field),
        std::sync::Arc::new(Field::new("bbox", DataType::Struct(bbox_fields()), false)),
        std::sync::Arc::new(Field::new(geometry_column, DataType::Binary, false)),
    ]))
}

fn bbox_fields() -> Fields {
    Fields::from(vec![
        Field::new("xmin", DataType::Float64, false),
        Field::new("ymin", DataType::Float64, false),
        Field::new("xmax", DataType::Float64, false),
        Field::new("ymax", DataType::Float64, false),
    ])
}

/// The tier's `geo` key, and the source's own declared license keys carried verbatim.
///
/// The CRS written is **the definition this dataset was admitted with** (`crs.rs`'s
/// `definition_json`), not a name looked up elsewhere: the tier is in the source's CRS because
/// nothing here transforms a coordinate, and saying so with the same bytes is what lets the engine
/// re-admit its own tier under R-C5.
fn tier_footer_metadata(source: &Dataset, geometry_column: &str) -> Result<Vec<KeyValue>> {
    let crs_fragment = match source.crs().definition_json() {
        Some(definition) => {
            let value: Value = serde_json::from_str(definition).map_err(|e| {
                EngineError::GeoMetadata(format!("the admitted CRS definition does not parse: {e}"))
            })?;
            Some(value)
        }
        None => None,
    };
    let mut column = json!({
        "encoding": "WKB",
        "geometry_types": ["Polygon"],
        "covering": {
            "bbox": {
                "xmin": ["bbox", "xmin"],
                "ymin": ["bbox", "ymin"],
                "xmax": ["bbox", "xmax"],
                "ymax": ["bbox", "ymax"],
            }
        },
    });
    if let Some(crs) = crs_fragment {
        column["crs"] = crs;
    }
    let geo = json!({
        "version": source.geoparquet_version(),
        "primary_column": geometry_column,
        "columns": { geometry_column: column },
    });
    let mut kv = vec![KeyValue::new(
        "geo".to_string(),
        serde_json::to_string(&geo)
            .map_err(|e| EngineError::GeoMetadata(format!("serialize the tier's geo key: {e}")))?,
    )];
    // Carried verbatim and uninterpreted, exactly as the source declared them: a tier is a
    // redistributed copy of the source's data and inherits whatever terms it states
    // (`dataset.rs:129-143`).
    let license = source.source_license();
    if let Some(v) = license.license.as_ref() {
        kv.push(KeyValue::new("license".to_string(), v.clone()));
    }
    if let Some(v) = license.attribution.as_ref() {
        kv.push(KeyValue::new("attribution".to_string(), v.clone()));
    }
    if let Some(v) = license.redistribution.as_ref() {
        kv.push(KeyValue::new("redistribution".to_string(), v.clone()));
    }
    Ok(kv)
}

fn emitted_batch(
    schema: &std::sync::Arc<Schema>,
    rows: &[EmittedRow],
    id_type: IdType,
) -> Result<RecordBatch> {
    let ids: ArrayRef = match id_type {
        IdType::U64 => {
            let mut b = UInt64Builder::with_capacity(rows.len());
            for r in rows {
                b.append_value(r.id);
            }
            std::sync::Arc::new(b.finish())
        }
        IdType::I64 => {
            let mut b = Int64Builder::with_capacity(rows.len());
            for r in rows {
                b.append_value(r.id as i64);
            }
            std::sync::Arc::new(b.finish())
        }
    };
    let mut xmin = Float64Builder::with_capacity(rows.len());
    let mut ymin = Float64Builder::with_capacity(rows.len());
    let mut xmax = Float64Builder::with_capacity(rows.len());
    let mut ymax = Float64Builder::with_capacity(rows.len());
    let mut geoms = BinaryBuilder::new();
    for r in rows {
        xmin.append_value(r.bbox[0]);
        ymin.append_value(r.bbox[1]);
        xmax.append_value(r.bbox[2]);
        ymax.append_value(r.bbox[3]);
        geoms.append_value(&r.wkb);
    }
    let fields = bbox_fields();
    let bbox: ArrayRef = std::sync::Arc::new(StructArray::new(
        fields,
        vec![
            std::sync::Arc::new(xmin.finish()) as ArrayRef,
            std::sync::Arc::new(ymin.finish()) as ArrayRef,
            std::sync::Arc::new(xmax.finish()) as ArrayRef,
            std::sync::Arc::new(ymax.finish()) as ArrayRef,
        ],
        None,
    ));
    RecordBatch::try_new(
        schema.clone(),
        vec![ids, bbox, std::sync::Arc::new(geoms.finish()) as ArrayRef],
    )
    .map_err(|e| EngineError::Arrow(format!("assemble a tier batch: {e}")))
}

fn column_index(schema: &std::sync::Arc<Schema>, name: &str) -> Result<usize> {
    schema
        .fields()
        .iter()
        .position(|f| f.name() == name)
        .ok_or_else(|| EngineError::Source(format!("column `{name}` is not in the source schema")))
}

fn read_ids(batch: &RecordBatch, id_column: &str, id_type: IdType) -> Result<Vec<u64>> {
    let idx = batch
        .schema()
        .index_of(id_column)
        .map_err(|e| EngineError::Source(format!("identity column in a batch: {e}")))?;
    let column = batch.column(idx);
    match id_type {
        IdType::U64 => {
            let a = column
                .as_any()
                .downcast_ref::<UInt64Array>()
                .ok_or_else(|| EngineError::Source("identity column is not UInt64".into()))?;
            Ok((0..a.len()).map(|i| a.value(i)).collect())
        }
        IdType::I64 => {
            let a = column
                .as_any()
                .downcast_ref::<Int64Array>()
                .ok_or_else(|| EngineError::Source("identity column is not Int64".into()))?;
            // Negative values cannot reach here: ADR-016's admission refuses them before a dataset
            // exists (`identity.rs`), and a tier is built only from an admitted dataset.
            (0..a.len())
                .map(|i| {
                    u64::try_from(a.value(i)).map_err(|_| {
                        EngineError::Source(format!(
                            "identity value {} is negative; ADR-016 admission should have refused \
                             this dataset",
                            a.value(i)
                        ))
                    })
                })
                .collect()
        }
    }
}

fn read_wkb_column<'a>(batch: &'a RecordBatch, geometry_column: &str) -> Result<Vec<&'a [u8]>> {
    let idx = batch
        .schema()
        .index_of(geometry_column)
        .map_err(|e| EngineError::Source(format!("geometry column in a batch: {e}")))?;
    let column = batch.column(idx).as_ref();
    if let Some(a) = column.as_any().downcast_ref::<BinaryArray>() {
        return Ok((0..a.len()).map(|i| a.value(i)).collect());
    }
    if let Some(a) = column.as_any().downcast_ref::<LargeBinaryArray>() {
        return Ok((0..a.len()).map(|i| a.value(i)).collect());
    }
    Err(EngineError::EncodingMismatch {
        claimed: "WKB in a binary column".into(),
        found: format!("{}", column.data_type()),
    })
}

fn remove_reporting(path: &Path) -> Result<()> {
    if path.exists() {
        std::fs::remove_file(path).map_err(|e| {
            EngineError::Source(format!("could not remove `{}`: {e}", path.display()))
        })?;
    }
    Ok(())
}

/// A typed refusal, carried on the engine's existing ceiling/refusal vocabulary.
///
/// The identifier is the value; the detail says what convicted this source. Both travel to the
/// caller — a refusal nobody can act on is a log line with a type attached.
fn refusal(identifier: &'static str, detail: String) -> EngineError {
    EngineError::LodRefused { refusal: identifier, detail }
}
